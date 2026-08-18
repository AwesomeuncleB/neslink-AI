import { NextRequest, NextResponse } from "next/server";
import { QUESTIONS, buildSystemPrompt } from "@/lib/rubrics";
import { JudgeResult } from "@/lib/types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const DAILY_LIMIT = 4; // 4 essays per day (1 full round of all 4 scholarship questions)

function countWords(text: string): number {
  const matches = text.match(/\S+/g);
  return matches ? matches.length : 0;
}

function extractJson(raw: string): any {
  const cleaned = raw.replace(/^```(?:json)?|```$/gm, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = raw.match(/(\{[\s\S]*\})/);
    if (match) {
      return JSON.parse(match[1]);
    }
    throw new Error("Unable to parse JSON from model output");
  }
}

async function checkRateLimit(userId?: string | null): Promise<{ allowed: boolean; message?: string; count?: number }> {
  if (!userId || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { allowed: true };
  }

  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/evaluations?user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${encodeURIComponent(todayStart.toISOString())}&select=id`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "count=exact",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : 0;

      if (count >= DAILY_LIMIT) {
        const hoursUntilReset = 24 - now.getUTCHours();
        return {
          allowed: false,
          count,
          message: `Daily review quota reached (${count}/${DAILY_LIMIT} essays used today). Your quota resets in ${hoursUntilReset} hour${hoursUntilReset > 1 ? "s" : ""} at midnight UTC. Take time to implement your line notes and fix first recommendations!`,
        };
      }
      return { allowed: true, count };
    }
    return { allowed: true };
  } catch (err) {
    console.warn("Rate limit check warning:", err);
    return { allowed: true };
  }
}

async function saveToSupabase(
  parsed: JudgeResult,
  questionKey: string,
  essayText: string,
  userId?: string | null,
  scholarshipKey?: string | null
) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/evaluations`;
  const payload: Record<string, any> = {
    scholarship_key: scholarshipKey || "chevening",
    question_key: questionKey,
    essay_text: essayText,
    word_count: parsed.word_count,
    word_limit: parsed.word_limit,
    within_word_limit: parsed.within_word_limit,
    overall_score: parsed.overall_score,
    criteria: parsed.criteria,
    top_suggestions: parsed.top_suggestions,
    line_notes: parsed.line_notes,
  };

  if (userId) {
    payload.user_id = userId;
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Supabase persistence warning:", err);
  }
}

export async function POST(req: NextRequest) {
  const groqApiKey = process.env.GROQ_API_KEY;
  const configuredModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  if (!groqApiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { scholarship_key, question_key, essay_text, user_id } = body || {};

  if (!question_key || !QUESTIONS[question_key]) {
    return NextResponse.json({ error: "Invalid or missing question_key." }, { status: 400 });
  }

  const essay = (essay_text || "").trim();
  if (!essay) {
    return NextResponse.json({ error: "Essay text cannot be empty." }, { status: 400 });
  }

  // Rate limit check
  if (user_id) {
    const rateCheck = await checkRateLimit(user_id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }
  }

  const wc = countWords(essay);
  const qMeta = QUESTIONS[question_key];
  const systemPrompt = buildSystemPrompt(question_key);

  const modelsToTry = [configuredModel];
  if (configuredModel !== "qwen/qwen3.6-27b") modelsToTry.push("qwen/qwen3.6-27b");
  if (configuredModel !== "openai/gpt-oss-20b") modelsToTry.push("openai/gpt-oss-20b");

  let rawContent: string | null = null;
  let lastError: string | null = null;

  for (const model of modelsToTry) {
    try {
      const resp = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Please evaluate this essay draft:\n\n---\n${essay}\n---`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 2500,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        rawContent = data.choices?.[0]?.message?.content || null;
        if (rawContent) break;
      } else {
        lastError = `Model ${model} responded HTTP ${resp.status}: ${await resp.text()}`;
      }
    } catch (err: any) {
      lastError = `Network error with model ${model}: ${err.message}`;
    }
  }

  if (!rawContent) {
    return NextResponse.json(
      { error: "Evaluation service temporarily unavailable. Please try again in a moment.", details: lastError },
      { status: 502 }
    );
  }

  let parsed: any;
  try {
    parsed = extractJson(rawContent);
  } catch (err: any) {
    console.error("[JSON Parse Error]:", err, rawContent);
    return NextResponse.json(
      { error: "Model did not return valid JSON.", raw: rawContent },
      { status: 502 }
    );
  }

  const result: JudgeResult = {
    overall_score: Number(parsed.overall_score) || 0,
    criteria: Array.isArray(parsed.criteria) ? parsed.criteria : [],
    top_suggestions: Array.isArray(parsed.top_suggestions) ? parsed.top_suggestions : [],
    line_notes: Array.isArray(parsed.line_notes) ? parsed.line_notes : [],
    word_count: wc,
    word_limit: qMeta.word_limit,
    within_word_limit: wc <= qMeta.word_limit,
  };

  // Persist to Supabase asynchronously
  await saveToSupabase(result, question_key, essay, user_id, scholarship_key);

  return NextResponse.json(result);
}
