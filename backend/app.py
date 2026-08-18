import json
import os
import re
from functools import wraps

import jwt
import requests
from flask import Flask, g, jsonify, request
from flask_cors import CORS

from rubric import QUESTIONS, WINNING_ESSAYS

app = Flask(__name__)

# ---------- Config (all from environment -- set these in Render, not in code) ----------
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "qwen/qwen3.6-27b")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")

# Comma-separated list of allowed frontend origins, e.g. "https://marginalia.vercel.app,http://localhost:8000"
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
CORS(app, origins=FRONTEND_ORIGIN.split(",") if FRONTEND_ORIGIN != "*" else "*", supports_credentials=False)


# ---------- Auth ----------
def require_auth(fn):
    """Verifies the Supabase-issued JWT on the Authorization header.
    On success, sets g.user_id and g.user_token for downstream use.
    This does NOT call out to Supabase -- it verifies the signature locally
    using the project's JWT secret, so it's fast and works even if Supabase
    is briefly unreachable."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not SUPABASE_JWT_SECRET:
            return jsonify({"error": "Server is not configured with SUPABASE_JWT_SECRET."}), 500

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or malformed Authorization header."}), 401

        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.PyJWTError as e:
            return jsonify({"error": f"Invalid or expired session: {e}"}), 401

        g.user_id = payload.get("sub")
        g.user_token = token
        if not g.user_id:
            return jsonify({"error": "Token missing subject claim."}), 401

        return fn(*args, **kwargs)
    return wrapper


# ---------- Supabase REST helpers ----------
# Requests are made AS the user (forwarding their own token), so Supabase's
# row-level security policies do the access control -- the backend never
# holds a service-role secret.
def supabase_headers():
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {g.user_token}",
        "Content-Type": "application/json",
    }


def log_submission(question_key, essay_text, wc, result):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return  # Supabase not configured -- skip logging rather than fail the request
    try:
        requests.post(
            f"{SUPABASE_URL}/rest/v1/submissions",
            headers={**supabase_headers(), "Prefer": "return=minimal"},
            json={
                "user_id": g.user_id,
                "question_key": question_key,
                "essay_text": essay_text,
                "overall_score": result.get("overall_score"),
                "word_count": wc,
                "word_limit": QUESTIONS[question_key]["word_limit"],
                "response": result,
            },
            timeout=10,
        )
    except requests.exceptions.RequestException as e:
        app.logger.warning(f"Failed to log submission to Supabase: {e}")


def fetch_history():
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return []
    try:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/submissions",
            headers=supabase_headers(),
            params={
                "select": "id,question_key,overall_score,word_count,word_limit,created_at",
                "order": "created_at.desc",
                "limit": "20",
            },
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        app.logger.warning(f"Failed to fetch history from Supabase: {e}")
        return []


# ---------- Judge logic ----------
def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def build_system_prompt(qkey: str) -> str:
    q = QUESTIONS[qkey]
    refs = WINNING_ESSAYS.get(qkey, [])
    ref_block = ""
    if refs:
        joined = "\n\n---\n\n".join(f"Reference essay {i+1}:\n{e}" for i, e in enumerate(refs))
        ref_block = f"""
BENCHMARK REFERENCE ESSAYS (Winning Application Quality):
Use these ONLY as examples of winning evidence density, structure, and clarity.
{joined}
"""

    return f"""You are an expert scholarship reading-committee evaluator and coach giving balanced, objective assessment feedback to an applicant.

QUESTION: {q['prompt']}
WORD LIMIT: {q['word_limit']} words.

CORE ASSESSMENT CRITERIA:
{q['what_they_test']}

COMMON PITFALLS TO WATCH FOR:
{q['common_weaknesses']}
{ref_block}
SCORING CALIBRATION SCALE (Be objective -- reward genuine quality, do not artificially suppress scores):
• 9-10 (Winning / Shortlist Standard): Highly compelling, demonstrates strong personal agency, concrete measurable results/metrics, distinct narrative voice, and directly aligns with all prompt objectives.
• 7-8 (Competitive / Strong Applicant): Solid evidence, clear personal role, well-structured, minor areas for refinement or deeper specificity.
• 5-6 (Developing Draft): General claims without sufficient personal evidence, passive storytelling, or vague outcomes.
• 1-4 (Weak / Incomplete): Off-topic, generic, or lacking core criteria.

CRITERIA SCORING (1-5 per criterion):
• 5 = Outstanding / Benchmark quality
• 4 = Strong, well-supported evidence
• 3 = Competent, needs more specificity
• 2 = Weak / under-developed
• 1 = Missing / unsatisfactory

COACHING GUIDELINES:
1. Objectively evaluate against the rubric: If the applicant demonstrates strong personal impact and concrete examples, award the appropriate 8-10 score.
2. Identify both strong anchors (what to keep) and high-value areas for refinement.
3. Diagnostic only: Never write replacement sentences or generated draft text for the applicant. Describe what a stronger version would demonstrate.

Return ONLY valid JSON matching this schema:
{{
  "overall_score": <integer 1-10>,
  "criteria": [
    {{"name": "<criterion name>", "score": <integer 1-5>, "note": "<objective 1-2 sentence assessment>"}}
  ],
  "top_suggestions": [
    "<actionable suggestion to elevate the essay further>"
  ],
  "line_notes": [
    {{"quote": "<exact short phrase from essay, max ~15 words>", "note": "<insight on why this is strong or how to sharpen it — 2 to 3 sentences>"}}
  ]
}}"""



def extract_json(raw: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\{[\s\S]*\})", raw)
        if match:
            return json.loads(match.group(1))
        raise


# ---------- Routes ----------
@app.route("/")
def health():
    return jsonify({"status": "ok", "service": "marginalia-api"})


@app.route("/api/questions")
def questions():
    """Public -- no auth needed. Lets the frontend build its dropdown without
    hardcoding the rubric in two places."""
    return jsonify([
        {"key": k, "label": v["label"], "word_limit": v["word_limit"], "prompt": v["prompt"]}
        for k, v in QUESTIONS.items()
    ])


@app.route("/api/judge", methods=["POST"])
@require_auth
def judge():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY is not set on the server."}), 500

    data = request.get_json(force=True) or {}
    qkey = data.get("question_key")
    essay = (data.get("essay_text") or "").strip()

    if qkey not in QUESTIONS:
        return jsonify({"error": "Unknown question_key."}), 400
    if not essay:
        return jsonify({"error": "Essay text is empty."}), 400

    wc = word_count(essay)

    try:
        parsed = call_groq(qkey, essay, wc)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Groq API request failed: {e}"}), 502
    except json.JSONDecodeError:
        return jsonify({"error": "Model did not return valid JSON."}), 502

    parsed["word_count"] = wc
    parsed["word_limit"] = QUESTIONS[qkey]["word_limit"]
    parsed["within_word_limit"] = wc <= QUESTIONS[qkey]["word_limit"]

    log_submission(qkey, essay, wc, parsed)

    return jsonify(parsed)


@app.route("/api/history")
@require_auth
def history():
    return jsonify(fetch_history())


if __name__ == "__main__":
    app.run(debug=True, port=5050)
