// ─────────────────────────────────────────────────────────────
// 공식 통계 기준선. KOSIS_API_URL이 설정되면 실제 공표치를 가져오고,
// 없으면 아래 폴백 예시값을 사용합니다.
// 폴백 값은 배포 전 최신 공표치로 직접 갱신하세요. (출처 표기 필수)
// ─────────────────────────────────────────────────────────────

export const FALLBACK_BENCHMARK = {
  label: "전자부품·컴퓨터·영상·음향·통신장비 제조업(C26)",
  turnoverMonthlyPct: 2.0, // 예시값 — 사업체노동력조사 최신 공표치로 갱신할 것
  shortagePct: 1.6, // 예시값 — KIAT 산업기술인력 수급실태조사(반도체)로 갱신할 것
  source: "고용노동부 사업체노동력조사 (폴백 예시값)",
  live: false,
};

export async function fetchBenchmark() {
  const url = process.env.KOSIS_API_URL;
  if (!url) return FALLBACK_BENCHMARK;
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } }); // 하루 캐시
    if (!res.ok) throw new Error(`KOSIS ${res.status}`);
    const rows = await res.json();
    // KOSIS 공유서비스 표준 응답: [{ PRD_DE, DT, ITM_NM, C1_NM, ... }]
    const last = Array.isArray(rows) ? rows[rows.length - 1] : null;
    if (!last || last.DT == null) throw new Error("KOSIS 응답 형식 확인 필요");
    return {
      label: last.C1_NM || FALLBACK_BENCHMARK.label,
      turnoverMonthlyPct: parseFloat(last.DT),
      shortagePct: FALLBACK_BENCHMARK.shortagePct,
      source: `고용노동부 사업체노동력조사 ${last.PRD_DE ?? ""} 공표치 (KOSIS API)`,
      live: true,
    };
  } catch (e) {
    console.warn("KOSIS fetch 실패, 폴백 사용:", e.message);
    return FALLBACK_BENCHMARK;
  }
}
