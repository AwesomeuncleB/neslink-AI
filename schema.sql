-- Schema for Marginalia AI on Supabase (with Auth Integration)

-- Table: evaluations
-- Stores generated essay assessments, scores, line notes, and feedback.

CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scholarship_key TEXT DEFAULT 'chevening' NOT NULL,
    question_key TEXT NOT NULL,
    essay_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    word_limit INTEGER NOT NULL,
    within_word_limit BOOLEAN NOT NULL,
    overall_score INTEGER NOT NULL,
    criteria JSONB NOT NULL,
    top_suggestions JSONB NOT NULL,
    line_notes JSONB NOT NULL
);

-- Index for querying history by user, question_key or date
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON public.evaluations (user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_scholarship_key ON public.evaluations (scholarship_key);
CREATE INDEX IF NOT EXISTS idx_evaluations_question_key ON public.evaluations (question_key);

-- Table: drafts
-- Stores auto-saved applicant draft essays.

CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scholarship_key TEXT DEFAULT 'chevening' NOT NULL,
    question_key TEXT NOT NULL,
    essay_text TEXT NOT NULL,
    CONSTRAINT unique_user_question_draft UNIQUE (user_id, scholarship_key, question_key)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Evaluations Policies:
-- Allow authenticated users to view their own evaluations, or anonymous evaluations if user_id is null
CREATE POLICY "Users can select own evaluations" ON public.evaluations
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow inserting evaluations (authenticated or anonymous)
CREATE POLICY "Allow insert evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Drafts Policies:
-- Users can manage their own drafts
CREATE POLICY "Users can manage own drafts" ON public.drafts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
