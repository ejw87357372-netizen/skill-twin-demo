// ─────────────────────────────────────────────────────────────
// 스킬 진단 — 희망 직무 선택 → 보유 스킬 입력 → 격차 진단 → 교육 추천
// 연구보고서의 프로토타입 요구 기능:
// "희망 직무·보유 스킬 입력, 부족 스킬 진단 및 교육 추천"
// 직무·교육과정은 시연용 가상 카탈로그입니다.
// ─────────────────────────────────────────────────────────────
import { SKILLS, SKILL_EDGES, skillName } from "@/lib/data";

// 희망 직무 카탈로그 — requires: [스킬 id, 요구 숙련도(1~5)]
export const TARGET_ROLES = [
  {
    id: "rtl", name: "디지털 회로 설계 엔지니어", group: "설계",
    desc: "RTL 설계와 검증, 테스트 용이화 설계까지 담당",
    requires: [["verilog", 4], ["dft", 3], ["layout", 2]],
  },
  {
    id: "process", name: "공정 엔지니어", group: "공정",
    desc: "핵심 공정 운영과 수율 개선 활동",
    requires: [["etch", 4], ["thinfilm", 3], ["yield", 3], ["spc", 2]],
  },
  {
    id: "yield", name: "수율 분석 엔지니어", group: "공정",
    desc: "수율 데이터 분석으로 공정 개선 포인트 도출",
    requires: [["yield", 4], ["spc", 3], ["python", 3]],
  },
  {
    id: "quality", name: "품질·신뢰성 엔지니어", group: "품질",
    desc: "신뢰성 평가와 불량 원인 분석",
    requires: [["reliability", 4], ["fa", 3], ["spc", 3]],
  },
  {
    id: "ds", name: "데이터 사이언티스트 (제조 AI)", group: "데이터·AI",
    desc: "공정·품질 데이터로 예측 모델 구축",
    requires: [["python", 4], ["ml", 4], ["bigdata", 3], ["mlops", 2]],
  },
  {
    id: "visionai", name: "비전 검사 AI 엔지니어", group: "데이터·AI",
    desc: "웨이퍼 이미지 검사 AI 모델 개발·운영",
    requires: [["cv", 4], ["ml", 3], ["mlops", 3]],
  },
  {
    id: "hranalyst", name: "HR 애널리스트", group: "경영지원",
    desc: "인사 데이터를 분석해 채용·유지 전략 지원 (사내 전환 수요 증가 직무)",
    requires: [["hrm", 4], ["python", 3], ["payroll", 2]],
  },
  {
    id: "finpro", name: "재무 분석가", group: "경영지원",
    desc: "결산·재무 데이터 분석과 경영 리포팅",
    requires: [["fin", 4], ["erp", 3], ["tax", 2], ["python", 2]],
  },
  {
    id: "erppm", name: "ERP 전환 프로젝트 매니저", group: "경영지원",
    desc: "차세대 ERP 구축의 업무 요건·이행 관리",
    requires: [["erp", 4], ["fin", 3], ["procure", 3]],
  },
];

// 스킬별 추천 교육 (가상 카탈로그 — 사내 교육 플랫폼 가정)
export const COURSES = {
  verilog: { name: "Verilog RTL 설계 실무", hours: 24 },
  analog: { name: "아날로그 회로 설계 기초", hours: 20 },
  layout: { name: "레이아웃 설계와 DRC/LVS", hours: 16 },
  dft: { name: "DFT 아키텍처와 스캔 설계", hours: 16 },
  litho: { name: "포토 공정의 이해", hours: 12 },
  etch: { name: "식각 공정 심화", hours: 16 },
  thinfilm: { name: "박막 증착 공정 실무", hours: 16 },
  yield: { name: "수율 분석 방법론", hours: 20 },
  spc: { name: "SPC 통계적 공정관리", hours: 12 },
  reliability: { name: "신뢰성 시험 설계", hours: 16 },
  fa: { name: "불량 분석(FA) 실무", hours: 20 },
  python: { name: "Python 데이터 분석 부트캠프", hours: 30 },
  ml: { name: "머신러닝 모델링 실전", hours: 30 },
  cv: { name: "컴퓨터 비전과 결함 검출", hours: 24 },
  mlops: { name: "MLOps 파이프라인 구축", hours: 20 },
  bigdata: { name: "대용량 데이터 처리(Spark)", hours: 24 },
  fin: { name: "재무회계 결산 실무", hours: 24 },
  tax: { name: "법인세·부가세 실무", hours: 16 },
  erp: { name: "SAP ERP 핵심 모듈 실습", hours: 30 },
  hrm: { name: "인사운영과 HR 데이터 관리", hours: 20 },
  payroll: { name: "급여·4대보험 실무", hours: 12 },
  labor: { name: "노동법과 근로관계 실무", hours: 16 },
  legal: { name: "계약 검토 실무", hours: 12 },
  procure: { name: "구매·계약관리 프로세스", hours: 12 },
};

/** 온톨로지에서 스킬의 인접 스킬 목록 */
export function adjacentSkills(skillId) {
  const out = new Set();
  for (const [a, b] of SKILL_EDGES) {
    if (a === skillId) out.add(b);
    if (b === skillId) out.add(a);
  }
  return [...out];
}

/**
 * 격차 진단.
 * owned: { skillId: level }  /  roleId: TARGET_ROLES id
 * 반환: { role, met[], gaps[], readiness(0~100), bridges[] }
 *  - bridges: 부족 스킬과 인접한 보유 스킬 (학습 경로 근거)
 */
export function diagnose(roleId, owned) {
  const role = TARGET_ROLES.find((r) => r.id === roleId);
  if (!role) return null;
  const met = [], gaps = [];
  let score = 0, total = 0;
  for (const [sk, need] of role.requires) {
    const have = owned[sk] ?? 0;
    total += need;
    score += Math.min(have, need);
    const item = { skill: sk, name: skillName(sk), need, have };
    if (have >= need) met.push(item);
    else gaps.push({ ...item, course: COURSES[sk] });
  }
  const bridges = gaps.map((g) => ({
    skill: g.skill,
    from: adjacentSkills(g.skill).filter((s) => (owned[s] ?? 0) >= 3).map(skillName),
  }));
  return { role, met, gaps, bridges, readiness: Math.round((score / total) * 100) };
}

export const ALL_SKILLS = SKILLS;
