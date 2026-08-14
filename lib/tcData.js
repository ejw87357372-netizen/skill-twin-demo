// ─────────────────────────────────────────────────────────────
// Weave AI — 가상 샘플 데이터 (전원 가상 인물, 실명·실기업 아님)
// 추천·적합도는 규칙 기반으로 생성된 데모 값이며 실제 AI 호출이 없다.
// ─────────────────────────────────────────────────────────────

export const EMPLOYEES = [
  { id: "E01", name: "김서연", dept: "디지털서비스팀", role: "백엔드 개발자", years: 5,
    skills: [["Java", 5], ["Spring Boot", 5], ["Oracle", 4], ["데이터 모델링", 4], ["Python", 2]],
    certs: ["정보처리기사", "SQLD"], projects: ["공공기관 민원 시스템 고도화", "지자체 데이터 개방 API"],
    edu: ["클린 코드와 리팩터링", "SQL 성능 튜닝"],
    wantRole: "데이터·AI 서비스 개발자", wantProject: "AI·공공데이터 융합 프로젝트",
    available: "2026.09.01", updated: "2026.07.28", aiConsent: true, recvRec: true, signals: [] },
  { id: "E02", name: "이준호", dept: "플랫폼개발팀", role: "백엔드 개발자", years: 7,
    skills: [["Java", 5], ["Spring Boot", 4], ["MSA", 4], ["Kubernetes", 3], ["Oracle", 3]],
    certs: ["정보처리기사"], projects: ["금융권 계정계 전환", "공공 클라우드 전환 지원"],
    edu: ["대용량 트래픽 설계"], wantRole: "테크리드", wantProject: "대규모 플랫폼 구축",
    available: "2026.09.15", updated: "2026.08.02", aiConsent: true, recvRec: true, signals: [] },
  { id: "E03", name: "박지민", dept: "데이터팀", role: "데이터 분석가", years: 3,
    skills: [["Python", 4], ["SQL", 4], ["Tableau", 4], ["통계 분석", 3]],
    certs: ["ADsP"], projects: ["고객 이탈 분석", "매출 대시보드 구축"],
    edu: ["실무 통계"], wantRole: "데이터 사이언티스트", wantProject: "예측 모델링 프로젝트",
    available: "2026.10.01", updated: "2026.05.11", aiConsent: true, recvRec: true,
    signals: ["최근 프로젝트 기회 부족", "역량정보 갱신 필요"] },
  { id: "E04", name: "최현우", dept: "디지털서비스팀", role: "프런트엔드 개발자", years: 4,
    skills: [["React", 5], ["TypeScript", 4], ["Next.js", 4], ["접근성", 3]],
    certs: [], projects: ["대민 포털 개편", "사내 디자인시스템 구축"],
    edu: ["웹 접근성 심화"], wantRole: "프로덕트 엔지니어", wantProject: "신규 서비스 런칭",
    available: "2026.09.01", updated: "2026.07.30", aiConsent: true, recvRec: true, signals: [] },
  { id: "E05", name: "정다은", dept: "데이터팀", role: "데이터 엔지니어", years: 6,
    skills: [["Python", 4], ["Spark", 4], ["Airflow", 4], ["데이터 모델링", 5], ["Oracle", 4]],
    certs: ["SQLP"], projects: ["전사 데이터 웨어하우스 구축", "공공데이터 수집 파이프라인"],
    edu: ["데이터 거버넌스"], wantRole: "데이터 플랫폼 아키텍트", wantProject: "차세대 데이터 플랫폼",
    available: "2026.09.01", updated: "2026.08.05", aiConsent: true, recvRec: true, signals: [] },
  { id: "E06", name: "한상윤", dept: "PMO", role: "프로젝트 매니저", years: 11,
    skills: [["프로젝트 관리", 5], ["요구사항 분석", 5], ["공공 프로젝트", 5], ["Java", 2]],
    certs: ["PMP", "정보시스템감리원"], projects: ["공공기관 차세대 시스템 PM", "지자체 통합 플랫폼 PM"],
    edu: ["애자일 리더십"], wantRole: "포트폴리오 매니저", wantProject: "대형 공공 SI",
    available: "2026.09.01", updated: "2026.07.15", aiConsent: true, recvRec: true, signals: [] },
  { id: "E07", name: "오세라", dept: "서비스기획팀", role: "서비스 기획자", years: 5,
    skills: [["서비스 기획", 5], ["데이터 리터러시", 3], ["UX 리서치", 4]],
    certs: [], projects: ["모바일 민원 서비스 기획", "공공 마이데이터 기획"],
    edu: ["프로덕트 디스커버리"], wantRole: "프로덕트 오너", wantProject: "AI 서비스 기획",
    available: "2026.09.10", updated: "2026.08.01", aiConsent: true, recvRec: true, signals: [] },
  { id: "E08", name: "임태규", dept: "인프라팀", role: "클라우드 엔지니어", years: 8,
    skills: [["AWS", 5], ["Kubernetes", 4], ["Terraform", 4], ["보안", 3]],
    certs: ["AWS SA Pro"], projects: ["공공 클라우드 전환", "재해복구 체계 구축"],
    edu: ["제로 트러스트 보안"], wantRole: "클라우드 아키텍트", wantProject: "하이브리드 클라우드",
    available: "2026.11.01", updated: "2026.06.20", aiConsent: false, recvRec: false,
    signals: ["희망 직무와 현재 업무 불일치"] },
  { id: "E09", name: "송하늘", dept: "플랫폼개발팀", role: "백엔드 개발자", years: 2,
    skills: [["Java", 3], ["Spring Boot", 3], ["MySQL", 3]],
    certs: ["정보처리기사"], projects: ["사내 인증 서비스 개선"],
    edu: ["신입 온보딩 과정"], wantRole: "백엔드 개발자", wantProject: "공공 프로젝트 참여",
    available: "2026.09.01", updated: "2026.04.02", aiConsent: true, recvRec: true,
    signals: ["장기간 교육 참여 부재", "역량정보 갱신 필요"] },
  { id: "E10", name: "배진우", dept: "AI연구팀", role: "ML 엔지니어", years: 4,
    skills: [["Python", 5], ["머신러닝", 4], ["MLOps", 3], ["Java", 2]],
    certs: ["빅데이터분석기사"], projects: ["수요 예측 모델 구축", "문서 분류 자동화"],
    edu: ["LLM 활용 실무"], wantRole: "AI 솔루션 아키텍트", wantProject: "공공 AI 융합",
    available: "2026.09.20", updated: "2026.08.03", aiConsent: true, recvRec: true, signals: [] },
  { id: "E11", name: "문가영", dept: "AI연구팀", role: "AI 서비스 개발자", years: 6,
    skills: [["Python", 5], ["AI API 활용", 5], ["머신러닝", 4], ["서비스 설계", 4]],
    certs: [], projects: ["대화형 민원 안내 서비스", "AI 문서요약 도입"],
    edu: ["AI 윤리와 거버넌스"], wantRole: "AI 프로덕트 리드", wantProject: "공공 AI 서비스",
    available: "2026.09.01", updated: "2026.07.22", aiConsent: true, recvRec: true, signals: [] },
  { id: "E12", name: "신동혁", dept: "품질관리팀", role: "QA 엔지니어", years: 9,
    skills: [["테스트 자동화", 5], ["성능 테스트", 4], ["Python", 3]],
    certs: ["ISTQB"], projects: ["차세대 시스템 품질 검증", "테스트 자동화 체계 구축"],
    edu: ["시프트레프트 테스팅"], wantRole: "QA 리드", wantProject: "품질 엔지니어링 표준화",
    available: "2026.09.01", updated: "2026.07.10", aiConsent: true, recvRec: true,
    signals: ["보유역량 대비 낮은 역할 활용도", "경력개발 면담 필요"] },
  { id: "E13", name: "김민지", dept: "마케팅팀", role: "퍼포먼스 마케터", years: 4,
    skills: [["GA4·데이터 분석", 4], ["콘텐츠 기획", 4], ["SQL", 3], ["광고 운영", 5]],
    certs: ["GAIQ"], projects: ["신규 서비스 론칭 캠페인", "리텐션 개선 실험"],
    edu: ["그로스 마케팅 실무"], wantRole: "그로스 리드", wantProject: "데이터 기반 마케팅 자동화",
    available: "2026.10.01", updated: "2026.07.18", aiConsent: true, recvRec: true, signals: [] },
  { id: "E14", name: "유정한", dept: "인사팀", role: "HRD 담당", years: 6,
    skills: [["교육 기획", 5], ["HR 데이터 분석", 3], ["조직개발", 4], ["퍼실리테이션", 4]],
    certs: ["평생교육사"], projects: ["직무교육 체계 개편", "온보딩 프로그램 구축"],
    edu: ["피플 애널리틱스 입문"], wantRole: "피플 애널리틱스 리드", wantProject: "역량 데이터 기반 교육 설계",
    available: "2026.09.01", updated: "2026.08.06", aiConsent: true, recvRec: true, signals: [] },
  { id: "E15", name: "조은비", dept: "디자인팀", role: "프로덕트 디자이너", years: 5,
    skills: [["Figma", 5], ["UX 리서치", 4], ["디자인시스템", 4], ["프로토타이핑", 4]],
    certs: [], projects: ["대민 포털 UX 개편", "디자인시스템 2.0"],
    edu: ["데이터 기반 UX"], wantRole: "프로덕트 디자인 리드", wantProject: "AI 서비스 UX 설계",
    available: "2026.09.15", updated: "2026.07.25", aiConsent: true, recvRec: true, signals: [] },
  { id: "E16", name: "장우석", dept: "영업본부", role: "B2B 영업", years: 8,
    skills: [["B2B 영업", 5], ["제안서 작성", 4], ["CRM 활용", 4], ["공공 조달", 4]],
    certs: [], projects: ["공공기관 수주 3건", "파트너 채널 확대"],
    edu: ["전략 영업 과정"], wantRole: "영업 팀장", wantProject: "대형 공공 수주",
    available: "2026.09.01", updated: "2026.06.30", aiConsent: true, recvRec: true, signals: [] },
];

export const PROJECT = {
  name: "공공기관 차세대 데이터 플랫폼 구축",
  period: "2026.09. ~ 2027.03.", headcount: 6,
  required: ["Java", "Spring Boot", "Oracle", "데이터 모델링", "공공 프로젝트 경험"],
  preferred: ["프로젝트 리딩 경험", "SQLD", "AI 활용 경험"],
};

// 규칙 기반 매칭 결과 (요구조건-역량 일치 정도, 가상 값)
export const SEARCH_RESULTS = [
  { id: "E01", fit: 96,
    reason: "요구역량 5개 중 5개 보유. 공공 프로젝트 2건, SQLD 보유, 희망 프로젝트와 일치.",
    matched: ["Java", "Spring Boot", "Oracle", "데이터 모델링", "공공 프로젝트 경험"],
    missing: [], similar: ["공공기관 민원 시스템 고도화", "지자체 데이터 개방 API"], wantMatch: true },
  { id: "E02", fit: 91,
    reason: "요구역량 4개 보유, MSA·클라우드 전환 경험. 데이터 모델링 심화 경험은 보완 필요.",
    matched: ["Java", "Spring Boot", "Oracle", "공공 프로젝트 경험"],
    missing: ["데이터 모델링(심화)"], similar: ["공공 클라우드 전환 지원"], wantMatch: false },
  { id: "E05", fit: 86,
    reason: "데이터 모델링 최고 수준, 공공데이터 파이프라인 경험. Java 백엔드 실무는 보완 필요.",
    matched: ["Oracle", "데이터 모델링", "공공 프로젝트 경험"],
    missing: ["Java(실무)", "Spring Boot"], similar: ["공공데이터 수집 파이프라인"], wantMatch: true },
  { id: "E10", fit: 79,
    reason: "AI 활용 우대사항 충족, Python 상급. 백엔드 핵심 스택은 기초 수준이라 역할 조정 필요.",
    matched: ["공공 프로젝트 경험(유사)"],
    missing: ["Java(실무)", "Spring Boot", "Oracle"], similar: ["수요 예측 모델 구축"], wantMatch: true },
];

export const TEAM_INIT = [
  { slot: "PM", id: "E06", why: "공공 대형 프로젝트 PM 2회, PMP 보유", gap: "없음" },
  { slot: "백엔드 개발자", id: "E01", why: "요구 스택 전부 보유, 공공 경험·SQLD", gap: "없음" },
  { slot: "백엔드 개발자", id: "E02", why: "대용량 처리·클라우드 전환 경험", gap: "데이터 모델링 심화" },
  { slot: "데이터 담당자", id: "E05", why: "DW 구축·공공데이터 파이프라인 경험", gap: "없음" },
  { slot: "AI 담당자", id: "E11", why: "AI API 서비스화 경험, 공공 AI 서비스 이력", gap: "없음" },
  { slot: "서비스 기획자", id: "E07", why: "공공 마이데이터 기획 경험", gap: "데이터 리터러시 보강" },
];
export const ALTERNATES = { "백엔드 개발자": "E09", "AI 담당자": "E10", "데이터 담당자": "E03", "PM": "E06", "서비스 기획자": "E07" };

export const GAPS = [
  { skill: "Python", cur: 2, target: 4, why: "데이터·AI 서비스의 공용 언어", course: "실무자를 위한 Python 데이터 분석", hours: 24, link: "공공데이터 분석 과제" },
  { skill: "머신러닝 기초", cur: 1, target: 3, why: "추천·예측 기능의 원리 이해", course: "머신러닝 입문", hours: 30, link: "수요 예측 모델 참여" },
  { skill: "AI API 활용", cur: 1, target: 4, why: "생성형 AI 기능을 서비스에 결합", course: "생성형 AI API 활용", hours: 16, link: "AI 민원 안내 고도화" },
  { skill: "데이터 시각화", cur: 2, target: 3, why: "분석 결과를 의사결정자에게 전달", course: "AI 서비스 설계 프로젝트", hours: 20, link: "경영 대시보드 구축" },
  { skill: "MLOps 기초", cur: 1, target: 2, why: "모델 배포·운영 파이프라인 이해", course: "MLOps 기초", hours: 18, link: "모델 서빙 표준화" },
];

export const PATHS = [
  { key: "A", steps: ["백엔드 개발자", "AI 서비스 개발자", "AI 솔루션 아키텍트"],
    needs: ["Python", "AI API 활용", "머신러닝 기초"], courses: ["생성형 AI API 활용", "머신러닝 입문"],
    projects: ["AI·공공데이터 융합"], period: "약 18~24개월", match: 78 },
  { key: "B", steps: ["백엔드 개발자", "데이터 엔지니어", "데이터 플랫폼 아키텍트"],
    needs: ["Spark", "Airflow", "데이터 거버넌스"], courses: ["데이터 파이프라인 실무"],
    projects: ["차세대 데이터 플랫폼"], period: "약 24개월", match: 71 },
  { key: "C", steps: ["백엔드 개발자", "테크리드", "프로젝트 매니저"],
    needs: ["아키텍처 설계", "리딩 경험", "이해관계자 관리"], courses: ["테크리드 워크숍"],
    projects: ["모듈 리딩 역할 수행"], period: "약 24~36개월", match: 64 },
];

export const RETENTION = [
  { id: "E03", status: "프로젝트 기회 추천", support: "예측 모델링 프로젝트 후보 추천, 분석 직무 공모 안내" },
  { id: "E08", status: "경력상담 권장", support: "클라우드 아키텍트 전환 경로 면담, 희망 직무 재확인" },
  { id: "E09", status: "교육지원 검토", support: "백엔드 심화 교육 지원, 공공 프로젝트 참관 기회" },
  { id: "E12", status: "성장지원 검토", support: "QA 리드 역할 시범 부여, 품질 표준화 과제 리딩 기회" },
];

export const SURVEY_ITEMS = [
  { k: "PE", label: "성과기대", text: "이 시스템은 나에게 적합한 프로젝트를 찾는 데 도움이 될 것이다." },
  { k: "PE2", label: "성과기대", text: "이 시스템은 나의 경력개발에 유용할 것이다." },
  { k: "EE", label: "노력기대", text: "이 시스템의 추천 결과를 이해하기 쉬울 것이다." },
  { k: "FC", label: "촉진조건", text: "회사는 시스템 활용에 필요한 교육과 지원을 제공할 것이다." },
  { k: "TR", label: "AI 신뢰", text: "AI가 제시한 추천 근거를 확인할 수 있다면 결과를 신뢰할 수 있다." },
  { k: "AF", label: "공정성 인식", text: "AI가 직원들에게 공정한 기준을 적용할 것이라고 생각한다." },
  { k: "PC", label: "개인정보 우려", text: "나의 경력과 역량정보가 AI 분석에 활용되는 것이 우려된다.", negative: true },
  { k: "BI", label: "사용의도", text: "필요한 통제장치가 마련된다면 이 시스템을 사용할 의향이 있다." },
];

export const DEMO_STEPS = [
  ["프로젝트 요구조건 등록", "matching"],
  ["AI가 사내 적합 인재 추천", "search"],
  ["추천 근거·부족 역량 확인", "search"],
  ["직원이 정보·참여의사 확인", "profile"],
  ["공정성·추천 편중 점검", "fairness"],
  ["관리자 최종 배치 검토", "matching"],
  ["미선정 직원에게 교육·기회 추천", "training"],
];

export const empById = (id) => EMPLOYEES.find((e) => e.id === id);
