// ─────────────────────────────────────────────────────────────
// HR용 스킬 갭 집계 — 개인 식별 없는 조직 단위 집계만 산출
// 시연은 가상 직원 48명의 데이터로 계산. 실서비스 설계 원칙:
// 직원 동의 기반 수집 + 익명 집계 표시(소수 인원 구간 마스킹) + 개인 결과 미제공
// ─────────────────────────────────────────────────────────────
import { EMPLOYEES, TEAMS, skillName } from "@/lib/data";
import { TARGET_ROLES, COURSES } from "@/lib/skillcheck";

const TEAM_GROUP = {
  회로설계팀: "설계",
  공정기술팀: "공정",
  품질보증팀: "품질",
  DX데이터팀: "데이터·AI",
  재무회계팀: "경영지원",
  경영지원팀: "경영지원",
};

function readinessFor(emp, role) {
  const owned = Object.fromEntries(emp.skills.map((s) => [s.skill, s.level]));
  let score = 0, total = 0;
  const gaps = [];
  for (const [sk, need] of role.requires) {
    const have = owned[sk] ?? 0;
    total += need;
    score += Math.min(have, need);
    if (have < need) gaps.push(sk);
  }
  return { readiness: Math.round((score / total) * 100), gaps };
}

/** 직원별 최적합 직무(같은 도메인 그룹 내 준비도 최고)와 그 격차 */
function bestFit(emp) {
  const group = TEAM_GROUP[emp.team];
  const candidates = TARGET_ROLES.filter((r) => r.group === group || (group === "품질" && r.group === "공정"));
  let best = null;
  for (const r of candidates) {
    const v = readinessFor(emp, r);
    if (!best || v.readiness > best.readiness) best = { role: r, ...v };
  }
  return best;
}

export function orgGapReport() {
  const fits = EMPLOYEES.map((e) => ({ emp: e, fit: bestFit(e) })).filter((x) => x.fit);

  // 직무별 준비 현황
  const byRole = TARGET_ROLES.map((r) => {
    const evals = EMPLOYEES.map((e) => readinessFor(e, r).readiness);
    return {
      role: r,
      ready: evals.filter((v) => v >= 70).length,
      near: evals.filter((v) => v >= 40 && v < 70).length,
    };
  });

  // 교육 수요: 최적합 직무 기준 부족 스킬 집계
  const demand = {};
  for (const { fit } of fits) for (const sk of fit.gaps) demand[sk] = (demand[sk] ?? 0) + 1;
  const courseDemand = Object.entries(demand)
    .map(([sk, n]) => ({ skill: sk, label: `${COURSES[sk]?.name ?? skillName(sk)}`, value: n }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 팀별 평균 준비도
  const teamReadiness = TEAMS.map((team) => {
    const vals = fits.filter((x) => x.emp.team === team).map((x) => x.fit.readiness);
    return { label: team, value: Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1)), n: vals.length };
  }).sort((a, b) => b.value - a.value);

  return { byRole, courseDemand, teamReadiness, total: fits.length };
}
