# Marginalia AI — Chevening Essay Review (MVP)

Judges a draft Chevening essay against the official rubric for whichever of the
4 questions it answers, and gives feedback — never rewrites the essay for the user
(Chevening bans AI-generated content, so this stays a coaching tool, not a ghostwriter).

## Run it (5 minutes)

```bash
cd chevening-judge
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

export GROQ_API_KEY="your_key_here"   # get one free at console.groq.com
python app.py
```

Open http://localhost:5050

## Add your winning essays (do this before real users touch it)

Open `rubric.py` and paste your reference essays into `WINNING_ESSAYS`, under the
matching question key (`leadership`, `networking`, `course`, `career`). They're used
only as reference points for what strong evidence looks like — the model is explicitly
told not to reward similarity to them, so applicants with very different backgrounds
still get judged fairly.

If you don't have winning essays for a question yet, leave that list empty — the
rubric criteria alone (pulled from Chevening's official guidance) still drive the
scoring.

## What's hardcoded that you may want to change

- **Word limit**: set to 500 per question in `rubric.py` (`QUESTIONS[...]["word_limit"]`).
  Chevening's exact limit has varied by cycle (300 in some recent guidance) — confirm
  against the current year's actual application form and adjust if needed.
- **Model**: `llama-3.3-70b-versatile` in `app.py`. Check console.groq.com/docs/models
  if Groq deprecates it — swap `GROQ_MODEL` env var or the default in code.

## Known limitations of this MVP

- No auth, no database — nothing is saved between requests. Fine for testing with
  yourself or a few friends; not fine for a real multi-user product yet.
- No rate limiting — someone hammering `/api/judge` will run up your Groq bill.
- The model can occasionally still return malformed JSON despite instructions —
  the endpoint returns a 502 with the raw text in that case rather than crashing.
- Reference essays are pasted directly into the system prompt (no retrieval). Fine
  up to maybe 10-15 essays per question; beyond that you'll want the RAG version.

## Natural next steps, in order

1. Test with real drafts of your own essays first — sanity-check whether Groq's
   feedback is actually good before you show this to anyone else.
2. Add your winning essays.
3. Add a simple password/shared secret if you're going to share the localhost link
   with beta testers before deploying anywhere.
4. Deploy (Render/Railway/Fly.io all have free tiers that work for this).
