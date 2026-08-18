import { NextRequest, NextResponse } from "next/server";
import { SCHOLARSHIPS, CHEVENING_QUESTIONS } from "@/lib/rubrics";

export async function GET(req: NextRequest) {
  try {
    const scholarshipKey = req.nextUrl?.searchParams?.get("scholarship");

    if (scholarshipKey) {
      const scholarship = SCHOLARSHIPS[scholarshipKey];
      if (!scholarship) {
        return NextResponse.json({ error: "Unknown scholarship" }, { status: 404 });
      }
      const questionsMap = scholarship.questions || {};
      const questionsList = Object.values(questionsMap).map((q) => ({
        key: q.key,
        label: q.label,
        word_limit: q.word_limit,
        prompt: q.prompt,
        what_they_test: q.what_they_test,
        common_weaknesses: q.common_weaknesses,
      }));
      return NextResponse.json({
        scholarship: {
          key: scholarship.key,
          name: scholarship.name,
          status: scholarship.status,
          description: scholarship.description,
        },
        questions: questionsList,
      });
    }

    const scholarshipsList = Object.values(SCHOLARSHIPS).map((s) => ({
      key: s.key,
      name: s.name,
      status: s.status,
      description: s.description,
      tagline: s.tagline,
      essay_count: s.essay_count,
    }));

    const defaultQuestions = Object.values(CHEVENING_QUESTIONS).map((q) => ({
      key: q.key,
      label: q.label,
      word_limit: q.word_limit,
      prompt: q.prompt,
      what_they_test: q.what_they_test,
      common_weaknesses: q.common_weaknesses,
    }));

    return NextResponse.json({
      scholarships: scholarshipsList,
      questions: defaultQuestions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load questions" }, { status: 500 });
  }
}
