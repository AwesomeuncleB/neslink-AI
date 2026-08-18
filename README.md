# Neslink AI — Scholarship Essay Review & Coaching Platform

Neslink AI provides rubric-grounded assessment and feedback for scholarship applicants across global programs (Chevening, Mastercard Foundation, DAAD, Commonwealth, Fulbright, and Erasmus).

---

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (React 19, TypeScript, Vanilla CSS design system)
- **Backend / Database**: Supabase (PostgreSQL, Row-Level Security, Auth)
- **LLM Inference**: Groq LPU Engine (`openai/gpt-oss-120b`)

---

## ⚙️ Environment Variables

Create `.env.local` in `frontend/` (or `.env` in the root):

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 🛠️ Quick Start

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
