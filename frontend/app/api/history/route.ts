import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbznwwkpovfrspvhslyq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ evaluations: [] });
  }

  const userId = req.nextUrl?.searchParams?.get("user_id");

  let endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/evaluations?select=*&order=created_at.desc&limit=50`;
  if (userId) {
    endpoint += `&user_id=eq.${encodeURIComponent(userId)}`;
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ evaluations: [], error: await res.text() }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ evaluations: Array.isArray(data) ? data : [] });
  } catch (err: any) {
    return NextResponse.json({ evaluations: [], error: err.message }, { status: 500 });
  }
}
