// ─────────────────────────────────────────────────────────────
// 산업 동향 데이터 — 두 등급으로 구분해 정직하게 표기한다.
//  verified: true  → 공표 자료(보도자료·요약)에서 확인한 수치. 출처·기준 시점 명시.
//  verified: false → 구조 시연용 예시값. 화면에 "예시값·갱신 필요" 배지가 붙는다.
//                    발표 전 KOSIS(kosis.kr)에서 최신 공표치로 직접 갱신할 것.
// ─────────────────────────────────────────────────────────────

export const SOURCES = [
  {
    id: "semc",
    name: "고용노동부 사업체노동력조사 (2026년 5월 결과)",
    url: "https://eiec.kdi.re.kr/policy/materialView.do?num=283575",
    note: "전체 입·이직률, 산업별 종사자 증감 (종사자 1인 이상 사업체 기준)",
  },
  {
    id: "semc0111",
    name: "사업체노동력조사 (2026년 1월 · 2025년 11월 결과)",
    url: "https://eiec.kdi.re.kr/policy/materialView.do?num=277342",
    note: "입·이직률 추이 시점 자료",
  },
  {
    id: "eaps",
    name: "국가데이터처(옛 통계청) 경제활동인구조사 · 2026년 6월 고용동향",
    url: "https://www.newspim.com/news/view/20260715000066",
    note: "전체 취업자 수, 산업별 취업자 증감",
  },
  {
    id: "jolts",
    name: "미국 노동통계국(BLS) JOLTS · 2026년 4·5월",
    url: "https://www.bls.gov/news.release/jolts.nr0.htm",
    note: "미국 산업별 자발적 이직률(quits rate), 국제 비교용",
  },
  {
    id: "kosis",
    name: "KOSIS 국가통계포털 · 산업별 상세표 (갱신용)",
    url: "https://kosis.kr",
    note: "예시값 표기 항목은 여기서 최신 공표치로 갱신",
  },
];

// ── 헤드라인 (공표치) ─────────────────────────────────────────
export const HEADLINE = {
  employedTotal: { value: 2915.4, unit: "만명", asOf: "2026.6", label: "전체 취업자", verified: true, src: "eaps" },
  hireRate: { value: 4.9, unit: "%", asOf: "2026.5", label: "입직률(월)", verified: true, src: "semc" },
  sepRate: { value: 4.9, unit: "%", asOf: "2026.5", label: "이직률(월)", verified: true, src: "semc" },
  usQuits: { value: 1.9, unit: "%", asOf: "2026.4", label: "미국 자발적 이직률(월)", verified: true, src: "jolts" },
};

// ── 입·이직률 추이 — 사업체노동력조사 공표 시점 (공표치) ──────
export const TURNOVER_TREND = [
  { period: "2025.11", hire: 4.5, sep: 4.4, verified: true },
  { period: "2026.1", hire: 5.6, sep: 5.2, verified: true },
  { period: "2026.5", hire: 4.9, sep: 4.9, verified: true },
];
export const TURNOVER_TREND_NOTE =
  "월 단위 지표라 계절성이 큽니다(1월은 연초 채용·계약 갱신으로 높게 나타나는 경향). 2026년 5월 입직자는 95.4만명(+12.0%), 이직자는 95.2만명(+14.4%).";

// ── 산업별 데이터 ────────────────────────────────────────────
// employment: 취업자 규모(만명) — 예시값(연간 근사). share는 화면에서 계산.
// change: 취업자 전년동월대비 증감(만명, 2026.6 고용동향) — 공표치는 verified:true.
// sepRate: 월 이직률(%) — 예시값(산업 간 상대 수준 시연용). KOSIS에서 갱신.
// trendNote: 공표 자료에서 확인된 정성 동향.
export const INDUSTRIES = [
  {
    id: "health", name: "보건업·사회복지",
    employment: { value: 305, verified: false },
    change: { value: +21.4, verified: true, src: "eaps" },
    sepRate: { value: 4.3, verified: false },
    trendNote: "취업자 증가 1위(+21.4만, 2026.6). 사업체 종사자도 +11.4만(+4.4%, 2026.5)으로 최대 증가.",
    surveyKeys: ["의료·바이오"],
  },
  {
    id: "manuf", name: "제조업",
    employment: { value: 441, verified: false },
    change: { value: -9.7, verified: true, src: "eaps" },
    sepRate: { value: 2.9, verified: false },
    trendNote: "취업자 -9.7만(2026.6). 2년 이상 연속 감소 추세. 이직률은 전 산업 평균보다 낮은 편.",
    surveyKeys: ["제조"],
  },
  {
    id: "construction", name: "건설업",
    employment: { value: 207, verified: false },
    change: { value: -6.7, verified: true, src: "eaps" },
    sepRate: { value: 7.9, verified: false },
    trendNote: "취업자 -6.7만(2026.6), 장기 감소 추세. 일용직 비중이 높아 입·이직이 잦은 산업.",
    surveyKeys: [],
  },
  {
    id: "transport", name: "운수·창고업",
    employment: { value: 166, verified: false },
    change: { value: +4.8, verified: true, src: "eaps" },
    sepRate: { value: 4.9, verified: false },
    trendNote: "취업자 +4.8만(2026.6), 증가 상위 산업.",
    surveyKeys: [],
  },
  {
    id: "arts", name: "예술·스포츠·여가",
    employment: { value: 53, verified: false },
    change: { value: +5.5, verified: true, src: "eaps" },
    sepRate: { value: 5.9, verified: false },
    trendNote: "취업자 +5.5만(2026.6), 증가 상위 산업.",
    surveyKeys: [],
  },
  {
    id: "wholesale", name: "도매·소매업",
    employment: { value: 326, verified: false },
    change: { value: -2.6, verified: true, src: "semc", changeNote: "사업체 종사자 기준(2026.5)" },
    sepRate: { value: 4.5, verified: false },
    trendNote: "사업체 종사자 -2.6만(-1.2%, 2026.5), 감소 지속.",
    surveyKeys: ["유통·서비스"],
  },
  {
    id: "hospitality", name: "숙박·음식점업",
    employment: { value: 229, verified: false },
    change: { value: null, verified: false },
    sepRate: { value: 8.1, verified: false },
    trendNote: "전통적으로 이직률이 가장 높은 산업군. 미국도 같은 패턴(숙박·음식 quits 4.0%로 최고).",
    surveyKeys: ["유통·서비스"],
  },
  {
    id: "ict", name: "정보통신업",
    employment: { value: 109, verified: false },
    change: { value: null, verified: false },
    sepRate: { value: 3.0, verified: false },
    trendNote: "미국은 정보산업 quits 0.9%로 산업 중 최저 수준. 침체기 IT 인력시장의 이동 둔화 패턴.",
    surveyKeys: ["IT·소프트웨어"],
  },
  {
    id: "finance", name: "금융·보험업",
    employment: { value: 78, verified: false },
    change: { value: +3.2, verified: true, src: "semc", changeNote: "사업체 종사자 기준(2026.5)" },
    sepRate: { value: 2.4, verified: false },
    trendNote: "사업체 종사자 +3.2만(+3.7%, 2026.5). 이직률이 낮은 안정 고용 산업.",
    surveyKeys: ["금융"],
  },
  {
    id: "public", name: "공공행정·교육",
    employment: { value: 316, verified: false },
    change: { value: +2.6, verified: true, src: "semc", changeNote: "공공행정, 사업체 종사자 기준(2026.5)" },
    sepRate: { value: 2.0, verified: false },
    trendNote: "공공행정 종사자 +2.6만(+2.7%, 2026.5). 미국도 정부 부문 quits 0.8%로 최저.",
    surveyKeys: ["공공·교육"],
  },
  {
    id: "prof", name: "전문·과학·기술",
    employment: { value: 140, verified: false },
    change: { value: null, verified: false },
    sepRate: { value: 3.4, verified: false },
    trendNote: "2026.1 사업체 종사자 +2.4만(+1.8%) 증가가 확인된 지식서비스 산업.",
    surveyKeys: ["IT·소프트웨어"],
  },
];

// ── 미국 JOLTS 산업별 자발적 이직률 (2026.4, 공표치) ──────────
export const US_QUITS = [
  { label: "숙박·음식", value: 4.0 },
  { label: "레저·접객 전체", value: 3.7 },
  { label: "소매업", value: 2.7 },
  { label: "전문·사업서비스", value: 1.9 },
  { label: "보건·사회복지", value: 1.9 },
  { label: "전체 평균", value: 1.9, em: true },
  { label: "건설업", value: 1.7 },
  { label: "제조업", value: 1.3 },
  { label: "금융", value: 1.2 },
  { label: "정보(IT·미디어)", value: 0.9 },
  { label: "정부", value: 0.8 },
];
export const US_QUITS_NOTE =
  "미국 quits rate는 '자발적 이직'만 집계합니다. 한국 사업체노동력조사의 이직률(4.9%)은 자발·비자발을 모두 포함한 전체 이직 기준이라 직접 비교는 어렵고, 대응 개념은 미국 total separations 3.2%(2026.5)입니다. 산업 간 '순위 패턴'(숙박·음식 최고, 정부·금융 최저)이 국제적으로 일치한다는 점이 비교의 핵심입니다.";

// ── 설문 산업 선택지 → 산업 데이터 매핑 ──────────────────────
export function industryForSurveyOption(option) {
  if (!option || option === "기타") return null;
  const hit = INDUSTRIES.filter((d) => d.surveyKeys.includes(option));
  return hit.length ? hit : null;
}

export const EMPLOYED_TOTAL = HEADLINE.employedTotal.value; // 만명, 점유율 계산용
