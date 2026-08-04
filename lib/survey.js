// ─────────────────────────────────────────────────────────────
// 수용성 진단 설문 — 구글폼 질문지와 문항 문구·순서·척도 완전 동일 (합산 분석 전제)
// 7점 리커트: 1 전혀 그렇지 않다 ~ 7 매우 그렇다
// ─────────────────────────────────────────────────────────────

export const INTRO = {
  title: "AI 인재관리 수용도 진단",
  time: "약 5분 · 익명 · 즉시 결과 제공",
  scenario: `"스킬 기반 AI 인재관리 시스템"이란?
직원의 스킬(보유 기술·역량), 경력, 교육 이수 내역, 프로젝트 경험 등의 데이터를 AI가 통합·분석하여 ① 나에게 맞는 교육·경력 개발 경로 추천 ② 사내 프로젝트·직무 이동 시 적합한 인재 매칭 ③ 조직 전체의 스킬 현황 분석에 활용하는 시스템입니다. 실제로 글로벌 기업들이 도입 중이며(예: Workday Skills Cloud, Eightfold AI), 국내 기업에도 확산되고 있습니다.

이러한 시스템이 우리 회사에 도입된다고 가정하고 응답해 주세요.`,
  consent: `본 진단은 성균관대학교 AI융합운영전공 학부생 연구팀의 학술연구(스킬 기반 AI 인재관리 시스템에 대한 직원 수용성 연구)의 일환입니다. 모든 응답은 익명으로 수집되며(이름·이메일·IP 미수집), 통계 처리되어 학술 연구 목적으로만 사용됩니다. 응답 도중 언제든 중단할 수 있습니다.`,
};

// 요인 정의: key, 표시명, 결과 차트에서의 방향
export const FACTORS = [
  { key: "PE", name: "성과기대" },
  { key: "EE", name: "노력기대" },
  { key: "SI", name: "사회적 영향" },
  { key: "FC", name: "촉진조건" },
  { key: "PC", name: "프라이버시 안심도", reverse: true }, // 표시용 8-x 역산
  { key: "AF", name: "공정성 인식" },
  { key: "BI", name: "수용 의도" },
];

export const QUESTIONS = [
  { id: "PE1", f: "PE", text: "이 시스템은 나에게 맞는 교육과 경력 개발 기회를 찾는 데 도움이 될 것이다." },
  { id: "PE2", f: "PE", text: "이 시스템을 활용하면 나의 업무 성과를 높이는 데 도움이 될 것이다." },
  { id: "PE3", f: "PE", text: "이 시스템은 사내에서 나의 역량을 더 잘 인정받는 데 유용할 것이다." },
  { id: "PE4", f: "PE", text: "이 시스템은 나의 경력 목표를 더 빨리 달성하는 데 도움이 될 것이다." },
  { id: "EE1", f: "EE", text: "나는 이러한 시스템의 사용법을 쉽게 익힐 수 있을 것이다." },
  { id: "EE2", f: "EE", text: "이러한 시스템을 사용하는 것은 나에게 어렵지 않을 것이다." },
  { id: "EE3", f: "EE", text: "이러한 시스템은 명확하고 이해하기 쉽게 사용할 수 있을 것이다." },
  { id: "SI1", f: "SI", text: "나에게 중요한 사람들(상사, 동료)은 내가 이 시스템을 활용하는 것을 긍정적으로 볼 것이다." },
  { id: "SI2", f: "SI", text: "우리 회사에서 영향력 있는 사람들은 이 시스템의 사용을 지지할 것이다." },
  { id: "SI3", f: "SI", text: "동료들이 이 시스템을 사용한다면 나도 사용해야 한다고 느낄 것이다." },
  { id: "FC1", f: "FC", text: "우리 조직은 시스템 활용에 필요한 교육과 지원을 제공할 것이다." },
  { id: "FC2", f: "FC", text: "나는 이 시스템을 사용하는 데 필요한 지식과 자원을 갖추고 있다." },
  { id: "FC3", f: "FC", text: "시스템 사용 중 어려움이 생기면 도움을 받을 수 있는 체계가 마련될 것이다." },
  { id: "PC1", f: "PC", text: "나의 스킬·경력 데이터가 AI에 의해 수집·분석되는 것이 불안하다." },
  { id: "PC2", f: "PC", text: "이 시스템이 나에 대한 데이터를 필요 이상으로 수집할까 봐 걱정된다." },
  { id: "PC3", f: "PC", text: "나의 데이터가 내가 동의하지 않은 목적(예: 평가, 구조조정)에 사용될까 봐 우려된다." },
  { id: "ATT", f: "ATT", text: "※ 이 문항은 응답 확인용입니다. '전혀 그렇지 않다(1)'를 선택해 주세요." },
  { id: "PC4", f: "PC", text: "나의 데이터에 누가 접근할 수 있는지 통제할 수 없을 것 같아 걱정된다." },
  { id: "AF1", f: "AF", text: "AI가 제시하는 평가와 추천 결과는 사람의 판단보다 편향이 적을 것이다." },
  { id: "AF2", f: "AF", text: "이 시스템은 학연·인맥 등에 좌우되지 않고 일관된 기준으로 직원을 평가할 것이다." },
  { id: "AF3", f: "AF", text: "이 시스템이 제공하는 추천·평가의 근거는 납득할 수 있을 것이다." },
  { id: "AF4", f: "AF", text: "이 시스템은 모든 직원에게 공평한 기회를 제공할 것이다." },
  { id: "BI1", f: "BI", text: "우리 회사가 이 시스템을 도입한다면 나는 적극적으로 사용할 의향이 있다." },
  { id: "BI2", f: "BI", text: "나는 이 시스템에 나의 스킬·경력 정보를 등록하고 활용할 의향이 있다." },
  { id: "BI3", f: "BI", text: "나는 동료에게도 이 시스템의 사용을 권할 의향이 있다." },
];

export const DEMOGRAPHICS = [
  { id: "employed", label: "현재 기업 또는 기관에 재직 중이십니까?", options: ["예, 재직 중입니다", "아니오"] },
  { id: "age", label: "연령대", options: ["20대", "30대", "40대", "50대 이상"] },
  { id: "gender", label: "성별", options: ["남성", "여성", "응답하지 않음"] },
  { id: "rank", label: "직급", options: ["사원급", "대리급", "과장·차장급", "부장급 이상", "임원", "기타"] },
  { id: "tenure", label: "현 직장 근속연수", options: ["1년 미만", "1~3년", "4~7년", "8~15년", "16년 이상"] },
  { id: "industry", label: "소속 산업", options: ["IT·소프트웨어", "제조", "금융", "유통·서비스", "공공·교육", "의료·바이오", "기타"] },
  { id: "size", label: "회사 규모", options: ["30인 미만", "30~299인", "300~999인", "1,000인 이상"] },
  { id: "aiFreq", label: "업무에서 AI 도구(ChatGPT 등) 사용 빈도", options: ["사용하지 않음", "월 1~2회", "주 1~2회", "거의 매일"] },
  { id: "aiHr", label: "AI 기반 HR 시스템(채용·평가·교육 추천 등) 경험", options: ["있다", "없다", "잘 모르겠다"] },
];

export const SCALE_LABELS = { 1: "전혀 그렇지 않다", 4: "보통이다", 7: "매우 그렇다" };

/** 요인별 점수 계산 (원값 평균; 표시용 역산은 결과 화면에서) */
export function scoreFactors(answers) {
  const out = {};
  for (const f of FACTORS) {
    const items = QUESTIONS.filter((q) => q.f === f.key);
    const vals = items.map((q) => answers[q.id]).filter((v) => v != null);
    if (!vals.length) continue;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    out[f.key] = { raw: mean, display: f.reverse ? 8 - mean : mean };
  }
  return out;
}

/** 종합 수용 준비도: BI 제외 6요인(표시값) 평균 → 0~100 */
export function overallScore(factors) {
  const keys = ["PE", "EE", "SI", "FC", "PC", "AF"];
  const vals = keys.map((k) => factors[k]?.display).filter((v) => v != null);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(((mean - 1) / 6) * 100);
}

export function typeLabel(score) {
  if (score >= 75) return { name: "얼리어답터형", desc: "새 시스템을 적극적으로 받아들일 준비가 되어 있어요. 도입 초기 앰배서더 역할에 적합합니다." };
  if (score >= 55) return { name: "신중한 수용형", desc: "이득이 확인되면 수용하는 유형이에요. 명확한 활용 사례와 투명한 기준 공개가 수용의 열쇠입니다." };
  if (score >= 40) return { name: "관망형", desc: "동료들의 사용 경험을 지켜본 뒤 판단하는 유형이에요. 조직의 교육·지원 체계가 중요합니다." };
  return { name: "회의형", desc: "프라이버시와 공정성에 대한 우려가 커요. 데이터 활용 범위의 투명한 공개가 선행되어야 합니다." };
}

/** 가장 낮은 요인 1~2개에 대한 해설 */
const FACTOR_TIPS = {
  PE: "이 시스템이 개인의 경력 개발에 주는 이득이 아직 와닿지 않는 상태예요. 연구에 따르면 성과기대는 수용 의도의 가장 강력한 예측 요인입니다.",
  EE: "사용법이 어려울 것이라는 부담이 있어요. 도입 초기 교육과 간단한 UI가 이 부담을 낮춥니다.",
  SI: "주변의 지지가 약하다고 느끼고 있어요. 동료·리더의 공개적인 사용이 수용 분위기를 만듭니다.",
  FC: "조직의 지원 체계에 대한 신뢰가 낮아요. 교육·헬프데스크 등 촉진조건이 갖춰질 때 수용이 올라갑니다.",
  PC: "프라이버시 우려가 높은 편이에요. 데이터 활용 범위가 투명하게 공개될 때 수용도가 올라간다는 연구 결과가 있어요.",
  AF: "AI 판단의 공정성에 대한 의구심이 있어요. 평가·추천 기준의 공개가 공정성 인식을 높이는 핵심 수단입니다.",
};

export function weakestFactors(factors, n = 2) {
  return ["PE", "EE", "SI", "FC", "PC", "AF"]
    .map((k) => ({ key: k, name: FACTORS.find((f) => f.key === k).name, v: factors[k]?.display ?? 7, tip: FACTOR_TIPS[k] }))
    .sort((a, b) => a.v - b.v)
    .slice(0, n);
}
