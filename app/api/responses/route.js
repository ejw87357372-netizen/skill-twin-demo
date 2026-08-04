// 설문/진단 응답 저장 (Supabase) — 수용성 설문 도구를 이 사이트에 붙일 때 사용
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 미설정 시 501 반환
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ error: "Supabase 미설정 (.env 참고)" }, { status: 501 });
  }
  const body = await req.json();
  const supabase = createClient(url, key);
  const { error } = await supabase.from("responses").insert({
    channel: "web",
    consent: !!body.consent,
    demographics: body.demographics ?? {},
    answers: body.answers ?? {},
    attention_passed: body.attentionPassed ?? null,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
