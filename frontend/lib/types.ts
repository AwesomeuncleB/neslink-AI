export interface Question {
  key: string;
  label: string;
  word_limit: number;
  prompt: string;
  what_they_test: string;
  common_weaknesses: string;
}

export interface Scholarship {
  key: string;
  name: string;
  status: "active" | "coming_soon";
  description: string;
  tagline?: string;
  essay_count?: number;
  questions?: Record<string, Question>;
}

export interface Criterion {
  name: string;
  score: number; // 1 to 5
  note: string;
}

export interface LineNote {
  quote: string;
  note: string;
}

export interface JudgeResult {
  overall_score: number; // 1 to 10
  criteria: Criterion[];
  top_suggestions: string[];
  line_notes: LineNote[];
  word_count: number;
  word_limit: number;
  within_word_limit: boolean;
}

export interface HistoryRow {
  id: string;
  scholarship_key?: string;
  question_key: string;
  essay_text: string;
  overall_score: number;
  criteria: Criterion[];
  top_suggestions: string[];
  line_notes: LineNote[];
  word_count: number;
  word_limit: number;
  within_word_limit: boolean;
  created_at: string;
  user_id?: string;
}
