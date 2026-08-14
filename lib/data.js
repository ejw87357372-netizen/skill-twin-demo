// ─────────────────────────────────────────────────────────────
// 가상 반도체 기업 "세미코어(SemiCore)"의 인력·스킬 데이터
// 전부 가상의 데모 데이터입니다. (연구 발표용)
// ─────────────────────────────────────────────────────────────

export const SKILLS = [
  { id: "verilog", name: "Verilog/RTL 설계", cat: "설계" },
  { id: "analog", name: "아날로그 회로 설계", cat: "설계" },
  { id: "layout", name: "레이아웃 설계", cat: "설계" },
  { id: "dft", name: "DFT/테스트 설계", cat: "설계" },
  { id: "litho", name: "포토/리소그래피", cat: "공정" },
  { id: "etch", name: "식각(Etch) 공정", cat: "공정" },
  { id: "thinfilm", name: "박막(Thin Film)", cat: "공정" },
  { id: "yield", name: "수율 분석", cat: "공정" },
  { id: "spc", name: "SPC/공정통계", cat: "품질" },
  { id: "reliability", name: "신뢰성 평가", cat: "품질" },
  { id: "fa", name: "불량 분석(FA)", cat: "품질" },
  { id: "python", name: "Python 데이터분석", cat: "데이터·AI" },
  { id: "ml", name: "머신러닝 모델링", cat: "데이터·AI" },
  { id: "cv", name: "비전 검사 AI", cat: "데이터·AI" },
  { id: "mlops", name: "MLOps/배포", cat: "데이터·AI" },
  { id: "bigdata", name: "공정 빅데이터 처리", cat: "데이터·AI" },
  { id: "fin", name: "재무회계·결산", cat: "경영지원" },
  { id: "tax", name: "세무", cat: "경영지원" },
  { id: "erp", name: "ERP(SAP) 운영", cat: "경영지원" },
  { id: "hrm", name: "인사운영(HRM)", cat: "경영지원" },
  { id: "payroll", name: "급여·4대보험", cat: "경영지원" },
  { id: "labor", name: "노무·근로관계", cat: "경영지원" },
  { id: "legal", name: "계약·법무", cat: "경영지원" },
  { id: "procure", name: "구매·계약관리", cat: "경영지원" },
];

// 스킬 온톨로지: 스킬 간 연관 관계 (그래프 엣지)
export const SKILL_EDGES = [
  ["verilog", "dft"], ["verilog", "layout"], ["analog", "layout"],
  ["litho", "etch"], ["etch", "thinfilm"], ["litho", "yield"],
  ["yield", "spc"], ["spc", "fa"], ["reliability", "fa"],
  ["yield", "python"], ["python", "ml"], ["ml", "cv"],
  ["ml", "mlops"], ["python", "bigdata"], ["bigdata", "mlops"],
  ["cv", "fa"], ["spc", "python"], ["dft", "python"],
  // 경영지원 도메인
  ["fin", "tax"], ["fin", "erp"], ["tax", "erp"],
  ["hrm", "payroll"], ["payroll", "labor"], ["hrm", "labor"],
  ["legal", "labor"], ["legal", "procure"], ["fin", "procure"],
  // 도메인 간 다리: 경영 데이터도 분석 대상 (온톨로지의 핵심 메시지)
  ["fin", "python"], ["hrm", "python"], ["erp", "bigdata"],
];

export const TEAMS = ["회로설계팀", "공정기술팀", "품질보증팀", "DX데이터팀", "재무회계팀", "경영지원팀"];

export const PROJECTS = [
  { id: "p1", name: "차세대 HBM 컨트롤러 설계", team: "회로설계팀", needs: ["verilog", "dft", "layout"] },
  { id: "p2", name: "3나노 공정 수율 개선 TF", team: "공정기술팀", needs: ["yield", "etch", "spc", "python"] },
  { id: "p3", name: "AI 비전 웨이퍼 검사 도입", team: "DX데이터팀", needs: ["cv", "ml", "mlops"] },
  { id: "p4", name: "공정 데이터 레이크 구축", team: "DX데이터팀", needs: ["bigdata", "python", "mlops"] },
  { id: "p5", name: "신뢰성 평가 자동화", team: "품질보증팀", needs: ["reliability", "fa", "python"] },
  { id: "p6", name: "아날로그 PMIC 신제품", team: "회로설계팀", needs: ["analog", "layout"] },
  { id: "p7", name: "차세대 ERP(S/4HANA) 전환", team: "재무회계팀", needs: ["erp", "fin", "procure"] },
  { id: "p8", name: "연결결산 자동화", team: "재무회계팀", needs: ["fin", "tax", "python"] },
  { id: "p9", name: "인사제도 개편(직무급 도입)", team: "경영지원팀", needs: ["hrm", "labor", "payroll"] },
];

// 결정적(고정) 가상 직원 데이터 — 이름·스킬·연차 모두 가상
const FIRST = ["민준", "서연", "도윤", "지우", "하준", "서준", "지민", "수아", "예준", "하은", "시우", "지아", "주원", "다은", "건우", "채원", "우진", "유나", "선우", "가은", "연우", "소율", "정우", "예린", "승현", "나윤", "태윤", "다인", "현우", "세아", "지호", "유진"];
const LAST = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황"];

function mulberry(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TEAM_SKILL_POOL = {
  회로설계팀: ["verilog", "analog", "layout", "dft", "python"],
  공정기술팀: ["litho", "etch", "thinfilm", "yield", "spc", "python"],
  품질보증팀: ["spc", "reliability", "fa", "yield", "python"],
  DX데이터팀: ["python", "ml", "cv", "mlops", "bigdata", "spc"],
  재무회계팀: ["fin", "tax", "erp", "procure", "python"],
  경영지원팀: ["hrm", "payroll", "labor", "legal", "procure", "erp"],
};
const ROLES = ["사원", "선임", "선임", "책임", "책임", "수석"];

function buildEmployees() {
  const rnd = mulberry(20260803);
  const list = [];
  let n = 0;
  for (const team of TEAMS) {
    for (let i = 0; i < 8; i++) {
      const name = LAST[Math.floor(rnd() * LAST.length)] + FIRST[n % FIRST.length];
      const pool = TEAM_SKILL_POOL[team];
      const k = 2 + Math.floor(rnd() * 3); // 스킬 2~4개
      const skills = [...pool].sort(() => rnd() - 0.5).slice(0, k)
        .map((s) => ({ skill: s, level: 2 + Math.floor(rnd() * 4) })); // 2~5
      const role = ROLES[Math.floor(rnd() * ROLES.length)];
      const years = 1 + Math.floor(rnd() * 14);
      const projects = PROJECTS.filter(
        (p) => p.team === team && p.needs.some((need) => skills.some((s) => s.skill === need)) && rnd() > 0.35
      ).map((p) => p.id);
      list.push({ id: `e${n + 1}`, name, team, role, years, skills, projects });
      n++;
    }
  }
  return list;
}

export const EMPLOYEES = buildEmployees();

// ── 조회 헬퍼 ────────────────────────────────────────────────
export const skillName = (id) => SKILLS.find((s) => s.id === id)?.name ?? id;

export function holdersOf(skillId, minLevel = 1) {
  return EMPLOYEES.filter((e) => e.skills.some((s) => s.skill === skillId && s.level >= minLevel));
}

/** 팀 × 스킬 보유 인원 매트릭스 (히트맵용) */
export function teamSkillMatrix() {
  return TEAMS.map((team) => ({
    team,
    counts: SKILLS.map((sk) => ({
      skill: sk.id,
      n: EMPLOYEES.filter((e) => e.team === team && e.skills.some((s) => s.skill === sk.id)).length,
    })),
  }));
}

/** 단일 실패점: 숙련 보유자(레벨 4+)가 1명 이하인 스킬 */
export function singlePointsOfFailure() {
  return SKILLS.map((sk) => ({ ...sk, experts: holdersOf(sk.id, 4).length, holders: holdersOf(sk.id).length }))
    .filter((s) => s.experts <= 1)
    .sort((a, b) => a.experts - b.experts || a.holders - b.holders);
}

/** 퇴사 시뮬레이션: 영향받는 프로젝트, 공백 스킬, 대체 후보 */
export function departureImpact(employeeId) {
  const emp = EMPLOYEES.find((e) => e.id === employeeId);
  if (!emp) return null;
  const affectedProjects = PROJECTS.filter((p) => emp.projects.includes(p.id));
  const gapSkills = emp.skills
    .map((s) => ({ ...s, remaining: holdersOf(s.skill).filter((h) => h.id !== emp.id).length }))
    .filter((s) => s.remaining <= 2)
    .sort((a, b) => a.remaining - b.remaining);
  const candidates = EMPLOYEES.filter((e) => e.id !== emp.id)
    .map((e) => {
      const overlap = e.skills.filter((s) => emp.skills.some((m) => m.skill === s.skill));
      return { emp: e, overlap, match: Math.round((overlap.length / emp.skills.length) * 100) };
    })
    .filter((c) => c.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, 4);
  return { emp, affectedProjects, gapSkills, candidates };
}

/** 스킬 수요 예측: AI 프로젝트 n개 신설 시 필요 인원 vs 보유 인원 */
export function demandGap(nNewAiProjects) {
  const perProject = { ml: 2, cv: 1, mlops: 1, python: 2, bigdata: 1 };
  return Object.entries(perProject).map(([skill, per]) => {
    const need = per * nNewAiProjects;
    const have = holdersOf(skill).length;
    return { skill, need, have, gap: Math.max(0, need - have) };
  });
}

/** 이직률 기반 12개월 인력 전망: supply × (1-r)^m */
export function projection(headcount, monthlyRatePct, months = 12) {
  const r = monthlyRatePct / 100;
  return Array.from({ length: months + 1 }, (_, m) => ({
    month: m,
    n: Math.round(headcount * Math.pow(1 - r, m) * 10) / 10,
  }));
}

/** 알림 피드 (데모 연출용 — 실제 데이터에서 규칙 기반으로 생성) */
export function buildAlerts(benchmark) {
  const spof = singlePointsOfFailure().slice(0, 4);
  const alerts = spof.map((s) => ({
    level: s.experts === 0 ? "critical" : "serious",
    text: `'${s.name}' 숙련 보유자 ${s.experts}명 — 단일 실패점 위험`,
    action: "교차 교육 대상자 지정 권장",
  }));
  const gap = demandGap(2).filter((g) => g.gap > 0);
  for (const g of gap.slice(0, 2)) {
    alerts.push({
      level: "warning",
      text: `AI 프로젝트 2개 신설 가정 시 '${skillName(g.skill)}' ${g.gap}명 부족 전망`,
      action: "리스킬링 프로그램 검토",
    });
  }
  if (benchmark) {
    alerts.push({
      level: "good",
      text: `업계 기준선 반영됨: ${benchmark.label} 월 이직률 ${benchmark.turnoverMonthlyPct}% (${benchmark.source})`,
      action: "전망 모델 기준값으로 사용 중",
    });
  }
  return alerts;
}
