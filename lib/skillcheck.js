// ─────────────────────────────────────────────────────────────
// 스킬 온톨로지 — 직무군 · 직무 · 과업 · 스킬 · 요구 숙련도 · 교육 · 경력 경로
//
// 구조 근거 (계획서 이론적 배경과 동일)
//  · 직무군–직무–과업–스킬 계층 : NCS 소분류–세분류–능력단위–지식·기술·태도,
//    O*NET의 Occupation–Tasks–KSA 분해 방식에 대응
//  · 직무–스킬 관계의 필수/선택 구분 : ESCO의 essential / optional skills
//  · 요구 숙련도 : ISO/IEC 20006-2(숙련도 수준 정보모델). NCS 8수준을 시연상 5단계로 축약
//  · 경력 경로 : 직무 간 공유 스킬(전이 가능 스킬)로 인접성을 계산 — O*NET Career Pathways 방식
//
// 데모용 가상 데이터이며 실제 NCS 능력단위 코드와 1:1 매핑되지 않습니다.
// ─────────────────────────────────────────────────────────────
import { SKILLS, SKILL_EDGES, skillName } from "@/lib/data";

// needs: [스킬 id, 요구 숙련도(1~5), 'E'(필수) | 'O'(선택)]
export const TARGET_ROLES = [
  {
    id: "rtl", name: "디지털 회로 설계 엔지니어", group: "설계",
    desc: "RTL 설계와 검증, 테스트 용이화 설계까지 담당",
    tasks: [
      { name: "RTL 설계", needs: [["verilog", 4, "E"], ["layout", 2, "O"]] },
      { name: "검증·테스트 설계", needs: [["dft", 3, "E"], ["verilog", 3, "E"]] },
    ],
  },
  {
    id: "process", name: "공정 엔지니어", group: "공정",
    desc: "핵심 공정 운영과 수율 개선 활동",
    tasks: [
      { name: "공정 조건 최적화", needs: [["etch", 4, "E"], ["thinfilm", 3, "E"]] },
      { name: "수율 이슈 대응", needs: [["yield", 3, "E"], ["spc", 2, "O"]] },
    ],
  },
  {
    id: "yield", name: "수율 분석 엔지니어", group: "공정",
    desc: "수율 데이터 분석으로 공정 개선 포인트 도출",
    tasks: [
      { name: "수율 데이터 분석", needs: [["yield", 4, "E"], ["python", 3, "E"]] },
      { name: "공정 통계 관리", needs: [["spc", 3, "E"]] },
    ],
  },
  {
    id: "quality", name: "품질·신뢰성 엔지니어", group: "품질",
    desc: "신뢰성 평가와 불량 원인 분석",
    tasks: [
      { name: "신뢰성 시험 설계", needs: [["reliability", 4, "E"]] },
      { name: "불량 원인 분석", needs: [["fa", 3, "E"], ["spc", 3, "E"]] },
    ],
  },
  {
    id: "ds", name: "데이터 사이언티스트 (제조 AI)", group: "데이터·AI",
    desc: "공정·품질 데이터로 예측 모델 구축",
    tasks: [
      { name: "데이터 파이프라인 구축", needs: [["bigdata", 3, "E"], ["python", 4, "E"]] },
      { name: "예측 모델 개발", needs: [["ml", 4, "E"]] },
      { name: "모델 배포·운영", needs: [["mlops", 2, "O"]] },
    ],
  },
  {
    id: "visionai", name: "비전 검사 AI 엔지니어", group: "데이터·AI",
    desc: "웨이퍼 이미지 검사 AI 모델 개발·운영",
    tasks: [
      { name: "검사 모델 개발", needs: [["cv", 4, "E"], ["ml", 3, "E"]] },
      { name: "검사 시스템 운영", needs: [["mlops", 3, "E"]] },
    ],
  },
  {
    id: "hranalyst", name: "HR 애널리스트", group: "경영지원",
    desc: "인사 데이터를 분석해 채용·유지 전략 지원",
    tasks: [
      { name: "인사 데이터 관리", needs: [["hrm", 4, "E"], ["payroll", 2, "O"]] },
      { name: "인력 분석·리포팅", needs: [["python", 3, "E"]] },
    ],
  },
  {
    id: "finpro", name: "재무 분석가", group: "경영지원",
    desc: "결산·재무 데이터 분석과 경영 리포팅",
    tasks: [
      { name: "결산·재무제표 작성", needs: [["fin", 4, "E"], ["tax", 2, "O"]] },
      { name: "ERP 기반 데이터 관리", needs: [["erp", 3, "E"]] },
      { name: "경영 분석 리포팅", needs: [["python", 2, "O"]] },
    ],
  },
  {
    id: "erppm", name: "ERP 전환 프로젝트 매니저", group: "경영지원",
    desc: "차세대 ERP 구축의 업무 요건·이행 관리",
    tasks: [
      { name: "업무 요건 정의", needs: [["erp", 4, "E"], ["fin", 3, "E"]] },
      { name: "구매·계약 프로세스 이행", needs: [["procure", 3, "E"]] },
    ],
  },
  {
    id: "verif", name: "설계 검증 엔지니어", group: "설계",
    desc: "UVM 검증 환경 구축과 커버리지 확보",
    tasks: [
      { name: "검증 환경 구축", needs: [["verification", 4, "E"], ["verilog", 3, "E"]] },
      { name: "커버리지 분석", needs: [["dft", 2, "O"]] },
    ],
  },
  {
    id: "analogde", name: "아날로그 회로 설계 엔지니어", group: "설계",
    desc: "PMIC·아날로그 IP 설계와 레이아웃 연계",
    tasks: [
      { name: "회로 설계", needs: [["analog", 4, "E"]] },
      { name: "레이아웃 연계 검토", needs: [["layout", 3, "E"], ["lowpower", 2, "O"]] },
    ],
  },
  {
    id: "pkgtest", name: "패키지·테스트 엔지니어", group: "설계",
    desc: "패키지 설계와 ATE 테스트 프로그램 개발",
    tasks: [
      { name: "패키지 구조 설계", needs: [["pkg", 4, "E"], ["reliability", 2, "O"]] },
      { name: "테스트 프로그램 개발", needs: [["atetest", 3, "E"], ["dft", 3, "E"]] },
    ],
  },
  {
    id: "equipeng", name: "설비 엔지니어", group: "공정",
    desc: "장비 예방보전과 가동률·산포 관리",
    tasks: [
      { name: "예방보전 계획 수립", needs: [["equip", 4, "E"]] },
      { name: "설비 이상 대응", needs: [["metrology", 3, "E"], ["etch", 2, "O"]] },
    ],
  },
  {
    id: "metro", name: "계측·검사 엔지니어", group: "공정",
    desc: "계측 조건 설정과 검사 데이터 신뢰성 관리",
    tasks: [
      { name: "계측 레시피 관리", needs: [["metrology", 4, "E"], ["litho", 2, "O"]] },
      { name: "검사 데이터 분석", needs: [["spc", 3, "E"]] },
    ],
  },
  {
    id: "custq", name: "고객품질 엔지니어", group: "품질",
    desc: "고객 클레임 대응과 8D 재발방지",
    tasks: [
      { name: "클레임 원인 규명", needs: [["custqual", 4, "E"], ["fa", 3, "E"]] },
      { name: "재발방지 대책 수립", needs: [["eightd", 3, "E"]] },
    ],
  },
  {
    id: "dataeng", name: "데이터 엔지니어", group: "데이터·AI",
    desc: "공정 데이터 수집·적재 파이프라인 운영",
    tasks: [
      { name: "데이터 모델링", needs: [["sql", 4, "E"], ["bigdata", 3, "E"]] },
      { name: "파이프라인 운영", needs: [["python", 3, "E"], ["mlops", 2, "O"]] },
    ],
  },
  {
    id: "mlops", name: "설비 이상탐지 엔지니어", group: "데이터·AI",
    desc: "센서 시계열로 설비 이상을 사전 감지",
    tasks: [
      { name: "이상탐지 모델 개발", needs: [["anomaly", 4, "E"], ["ml", 3, "E"]] },
      { name: "현장 적용·운영", needs: [["equip", 2, "O"], ["mlops", 3, "E"]] },
    ],
  },
  {
    id: "hrd", name: "HRD 담당자", group: "경영지원",
    desc: "역량 기반 교육체계 설계와 운영",
    tasks: [
      { name: "교육체계 설계", needs: [["hrd", 4, "E"], ["hrm", 3, "E"]] },
      { name: "채용·배치 연계", needs: [["recruit", 3, "E"]] },
    ],
  },
  {
    id: "scmpl", name: "SCM 수급 담당자", group: "경영지원",
    desc: "수요 예측과 자재 수급 계획 수립",
    tasks: [
      { name: "수요 계획 수립", needs: [["scm", 4, "E"], ["erp", 3, "E"]] },
      { name: "구매 실행 관리", needs: [["procure", 3, "E"]] },
    ],
  },
  {
    id: "costmgr", name: "원가관리 담당자", group: "경영지원",
    desc: "제조원가 산정과 수익성 분석",
    tasks: [
      { name: "표준원가 산정", needs: [["cost", 4, "E"], ["fin", 3, "E"]] },
      { name: "원가 데이터 분석", needs: [["erp", 3, "E"], ["sql", 2, "O"]] },
    ],
  },
  {
    id: "secmgr", name: "정보보안 담당자", group: "경영지원",
    desc: "기술자료 보호와 접근권한 통제",
    tasks: [
      { name: "접근권한 관리", needs: [["security", 4, "E"], ["erp", 2, "O"]] },
      { name: "보안 정책·계약 검토", needs: [["legal", 3, "E"]] },
    ],
  },
];

// 직무의 요구 스킬 = 과업들의 요구를 합친 것 (같은 스킬은 최고 요구 숙련도 채택)
for (const r of TARGET_ROLES) {
  const merged = new Map();
  for (const t of r.tasks) {
    for (const [sk, lv, req] of t.needs) {
      const cur = merged.get(sk);
      if (!cur || lv > cur[1] || (req === "E" && cur[2] === "O")) {
        merged.set(sk, [sk, Math.max(lv, cur ? cur[1] : 0), req === "E" || cur?.[2] === "E" ? "E" : "O"]);
      }
    }
  }
  r.needs = [...merged.values()];                       // [스킬, 요구수준, 필수여부]
  r.requires = r.needs.filter((n) => n[2] === "E").map((n) => [n[0], n[1]]); // 필수만 (준비도 계산 기준)
  r.essential = new Set(r.requires.map((n) => n[0]));
}

// 스킬별 추천 교육 (가상 카탈로그)
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
  verification: { name: "UVM 검증 환경 구축", hours: 28 },
  lowpower: { name: "저전력 설계(UPF) 실무", hours: 16 },
  pkg: { name: "반도체 패키지 설계 기초", hours: 20 },
  implant: { name: "이온주입 공정의 이해", hours: 12 },
  cmp: { name: "CMP 평탄화 공정 실무", hours: 12 },
  metrology: { name: "계측·검사 장비 운용", hours: 16 },
  equip: { name: "설비 예방보전(PM) 실무", hours: 20 },
  atetest: { name: "ATE 테스트 프로그램 개발", hours: 24 },
  eightd: { name: "8D 문제해결 방법론", hours: 12 },
  custqual: { name: "고객 품질 대응 실무", hours: 12 },
  sql: { name: "SQL과 데이터 모델링", hours: 20 },
  anomaly: { name: "시계열 이상탐지 실전", hours: 24 },
  cost: { name: "제조원가 관리 실무", hours: 20 },
  hrd: { name: "역량 기반 교육체계 설계", hours: 16 },
  recruit: { name: "구조화 면접과 선발 도구", hours: 12 },
  scm: { name: "수요예측과 SCM 계획", hours: 20 },
  security: { name: "기술보호와 정보보안 실무", hours: 16 },
};

/** 온톨로지에서 인접한 스킬 (학습 경로 근거) */
export function adjacentSkills(skillId) {
  const out = new Set();
  for (const [a, b] of SKILL_EDGES) {
    if (a === skillId) out.add(b);
    if (b === skillId) out.add(a);
  }
  return [...out];
}

/** 직무 준비도: min(보유, 요구)의 합 ÷ 요구의 합 (필수 스킬 기준) */
export function readiness(role, owned) {
  let score = 0, total = 0;
  for (const [sk, need] of role.requires) {
    total += need;
    score += Math.min(owned[sk] ?? 0, need);
  }
  return total ? Math.round((score / total) * 100) : 0;
}

/** 두 직무가 공유하는 필수 스킬 = 전이 가능 스킬 */
export function transferable(a, b) {
  return [...a.essential].filter((s) => b.essential.has(s));
}

/** 경력 경로 그래프: 전이 가능 스킬이 1개 이상이면 인접 직무로 본다 */
const ROLE_GRAPH = (() => {
  const g = {};
  for (const a of TARGET_ROLES) {
    g[a.id] = TARGET_ROLES
      .filter((b) => b.id !== a.id && transferable(a, b).length > 0)
      .map((b) => b.id);
  }
  return g;
})();

/** 현재 위치 추정 → 목표 직무까지 최단 경로 (BFS) */
export function careerPath(fromId, toId) {
  if (fromId === toId) return [toId];
  const prev = { [fromId]: null };
  const q = [fromId];
  while (q.length) {
    const cur = q.shift();
    for (const nx of ROLE_GRAPH[cur] ?? []) {
      if (nx in prev) continue;
      prev[nx] = cur;
      if (nx === toId) {
        const path = [nx];
        let p = cur;
        while (p != null) { path.unshift(p); p = prev[p]; }
        return path;
      }
      q.push(nx);
    }
  }
  return [fromId, toId]; // 연결이 없으면 직접 이동으로 표시
}

/**
 * 종합 진단.
 * owned: { skillId: level }, roleId: 희망 직무
 */
export function diagnose(roleId, owned) {
  const role = TARGET_ROLES.find((r) => r.id === roleId);
  if (!role) return null;

  // 필수 스킬 충족/부족
  const met = [], gaps = [];
  for (const [sk, need] of role.requires) {
    const have = owned[sk] ?? 0;
    const item = { skill: sk, name: skillName(sk), need, have };
    (have >= need ? met : gaps).push({ ...item, course: COURSES[sk] });
  }
  gaps.sort((a, b) => (b.need - b.have) - (a.need - a.have) || b.need - a.need);

  // 학습 경로 근거: 부족 스킬과 인접한 보유 스킬
  const bridges = gaps.map((g) => ({
    skill: g.skill,
    from: adjacentSkills(g.skill).filter((s) => (owned[s] ?? 0) >= 3).map(skillName),
  }));

  // 과업별 충족도
  const tasks = role.tasks.map((t) => {
    const items = t.needs.map(([sk, need, req]) => ({
      skill: sk, name: skillName(sk), need, req,
      have: owned[sk] ?? 0, ok: (owned[sk] ?? 0) >= need,
    }));
    const essentials = items.filter((i) => i.req === "E");
    return {
      name: t.name,
      items,
      done: essentials.every((i) => i.ok),
      missing: essentials.filter((i) => !i.ok).map((i) => i.name),
    };
  });

  // 경력 경로: 보유 스킬로 현재 위치를 추정한 뒤 목표까지의 단계
  const others = TARGET_ROLES.filter((r) => r.id !== roleId);
  const current = others.reduce(
    (best, r) => (readiness(r, owned) > readiness(best, owned) ? r : best), others[0]);
  const path = careerPath(current.id, roleId).map((id) => {
    const r = TARGET_ROLES.find((x) => x.id === id);
    const short = r.requires.filter(([sk, need]) => (owned[sk] ?? 0) < need);
    return {
      id, name: r.name, group: r.group,
      readiness: readiness(r, owned),
      shortage: short.length,
      keySkill: short.length ? skillName(short[0][0]) : null,
    };
  });
  const bridgeSkills = path.length > 1
    ? transferable(TARGET_ROLES.find((r) => r.id === path[0].id), role).map(skillName)
    : [];

  return {
    role, met, gaps, bridges, tasks, path, bridgeSkills,
    currentRole: current,
    readiness: readiness(role, owned),
  };
}

export const ALL_SKILLS = SKILLS;
