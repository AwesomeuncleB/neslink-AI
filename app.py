import json
import os
import re

import requests
from flask import Flask, jsonify, render_template, request

from rubric import QUESTIONS, WINNING_ESSAYS, SCHOLARSHIPS

try:
    from dotenv import dotenv_values, load_dotenv
    load_dotenv()
except ImportError:
    dotenv_values = None

# Neslink AI - Flask Application Controller
app = Flask(__name__)


GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", os.environ.get("SUPABASE_KEY", ""))
SUPABASE_KEY = SUPABASE_ANON_KEY

def get_groq_config():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if dotenv_values and os.path.exists(env_path):
        env_dict = dotenv_values(env_path)
        key = env_dict.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY", "")
        model = env_dict.get("GROQ_MODEL") or os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
        return key, model
    return os.environ.get("GROQ_API_KEY", ""), os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")




@app.route("/api/test-groq")
def test_groq():
    key, model = get_groq_config()
    if not key:
        return jsonify({"error": "GROQ_API_KEY is not set."}), 500
    
    # 1. Fetch available models
    models_res = requests.get(
        "https://api.groq.com/openai/v1/models",
        headers={"Authorization": f"Bearer {key}"}
    )
    models_data = models_res.json() if models_res.status_code == 200 else {"status": models_res.status_code, "text": models_res.text}

    # 2. Test chat completion
    chat_res = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [{"role": "user", "content": "Return the word 'OK'."}],
            "max_tokens": 10,
        },
        timeout=15,
    )
    chat_data = {
        "status_code": chat_res.status_code,
        "body": chat_res.json() if chat_res.status_code == 200 else chat_res.text,
        "tested_model": model,
    }
    return jsonify({"models": models_data, "chat_test": chat_data})




def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def check_rate_limit(user_id: str) -> tuple[bool, str]:
    """Check if user has exceeded daily submission limit (4 essays per day)."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return True, "Rate limiting disabled (Supabase not configured)"

    from datetime import datetime, timedelta

    # Get start of today in UTC
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/evaluations"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    
    # Count evaluations for this user today
    params = {
        "user_id": f"eq.{user_id}",
        "created_at": f"gte.{today_start.isoformat()}",
        "count": "exact"
    }
    
    try:
        resp = requests.get(endpoint, headers=headers, params=params, timeout=10)
        if resp.status_code == 200:
            count = int(resp.headers.get("content-range", "0-0/0").split("/")[-1])
            if count >= 4:
                return False, f"Daily limit reached ({count}/4 essays). Try again tomorrow."
            return True, f"{count}/4 essays used today"
        return True, "Rate check failed, allowing submission"
    except Exception as e:
        print(f"Rate limit check error: {e}")
        return True, "Rate check failed, allowing submission"


def save_to_supabase(parsed_result: dict, qkey: str, essay: str, user_id: str = None):
    """Persists an essay evaluation record to Supabase evaluations table."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return

    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/evaluations"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "question_key": qkey,
        "essay_text": essay,
        "word_count": parsed_result.get("word_count", 0),
        "word_limit": parsed_result.get("word_limit", 500),
        "within_word_limit": parsed_result.get("within_word_limit", True),
        "overall_score": parsed_result.get("overall_score", 0),
        "criteria": parsed_result.get("criteria", []),
        "top_suggestions": parsed_result.get("top_suggestions", []),
        "line_notes": parsed_result.get("line_notes", []),
    }
    if user_id:
        payload["user_id"] = user_id

    try:
        requests.post(endpoint, headers=headers, json=payload, timeout=10)
    except Exception as e:
        print(f"Supabase save warning: {e}")


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



@app.route("/")
def landing():
    return render_template(
        "landing.html",
        supabase_url=SUPABASE_URL,
        supabase_anon_key=SUPABASE_ANON_KEY,
        scholarships=SCHOLARSHIPS,
    )


@app.route("/app")
@app.route("/reviewer")
def reviewer():
    questions = [
        {"key": k, "label": v["label"], "word_limit": v["word_limit"], "prompt": v["prompt"]}
        for k, v in QUESTIONS.items()
    ]
    return render_template(
        "index.html",
        questions=questions,
        supabase_url=SUPABASE_URL,
        supabase_anon_key=SUPABASE_ANON_KEY,
    )


@app.route("/login")
def login():
    return render_template(
        "login.html",
        supabase_url=SUPABASE_URL,
        supabase_anon_key=SUPABASE_ANON_KEY,
    )


@app.route("/signup")
def signup():
    return render_template(
        "signup.html",
        supabase_url=SUPABASE_URL,
        supabase_anon_key=SUPABASE_ANON_KEY,
    )


def extract_json(raw: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\{[\s\S]*\})", raw)
        if match:
            return json.loads(match.group(1))
        raise

@app.route("/api/judge", methods=["POST"])
def judge():
    key, model = get_groq_config()
    if not key:
        return jsonify({"error": "GROQ_API_KEY is not set on the server. Export it before running app.py."}), 500

    data = request.get_json(force=True) or {}
    qkey = data.get("question_key")
    essay = (data.get("essay_text") or "").strip()
    user_id = data.get("user_id")

    if qkey not in QUESTIONS:
        return jsonify({"error": "Unknown question_key."}), 400
    if not essay:
        return jsonify({"error": "Essay text is empty."}), 400
    if not user_id:
        return jsonify({"error": "Authentication required. Please sign in to submit essays."}), 401
    
    # Check rate limit
    allowed, rate_msg = check_rate_limit(user_id)
    if not allowed:
        return jsonify({"error": rate_msg}), 429

    system_prompt = build_system_prompt(qkey)
    wc = word_count(essay)

    models_to_try = [model]
    if model != "qwen/qwen3.6-27b":
        models_to_try.append("qwen/qwen3.6-27b")
    if model != "openai/gpt-oss-20b":
        models_to_try.append("openai/gpt-oss-20b")

    raw = None
    last_err = None

    for m in models_to_try:
        try:
            resp = requests.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": m,
                    "temperature": 0.2,
                    "max_tokens": 3000,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Here is the applicant's essay ({wc} words):\n\n{essay}"},
                    ],
                },
                timeout=60,
            )
            if resp.status_code != 200:
                print(f"[Groq Error ({m})]: HTTP {resp.status_code} - {resp.text}")
                last_err = f"HTTP {resp.status_code}: {resp.text}"
                continue
            
            raw = resp.json()["choices"][0]["message"]["content"]
            if raw and raw.strip():
                break
        except requests.exceptions.RequestException as e:
            print(f"[Groq Request Exception ({m})]: {e}")
            last_err = str(e)
            continue

    if not raw or not raw.strip():
        return jsonify({"error": f"Groq evaluation failed across candidate models: {last_err}"}), 502

    try:
        parsed = extract_json(raw)
    except Exception as e:
        print(f"[JSON Parse Error]: {e}\nRaw Content:\n{raw}")
        return jsonify({"error": "Model did not return valid JSON.", "raw": raw, "parse_error": str(e)}), 502



    parsed["word_count"] = wc
    parsed["word_limit"] = QUESTIONS[qkey]["word_limit"]
    parsed["within_word_limit"] = wc <= QUESTIONS[qkey]["word_limit"]

    # Persist to Supabase with user_id association if authenticated
    save_to_supabase(parsed, qkey, essay, user_id=user_id)

    return jsonify(parsed)


@app.route("/api/history", methods=["GET"])
def history():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return jsonify({"error": "Supabase key not configured on server.", "evaluations": []}), 200

    user_id = request.args.get("user_id")
    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/evaluations?select=*&order=created_at.desc&limit=20"
    if user_id:
        endpoint += f"&user_id=eq.{user_id}"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    try:
        resp = requests.get(endpoint, headers=headers, timeout=10)
        resp.raise_for_status()
        return jsonify({"evaluations": resp.json()})
    except Exception as e:
        return jsonify({"error": str(e), "evaluations": []}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5050)


