import Link from "next/link";
import { SKILLS, SKILL_EDGES, EMPLOYEES, TEAMS, PROJECTS } from "@/lib/data";
import { OntologyGraph } from "@/components/charts";

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="tag">학술연구 데모 · 가상 데이터</span>
        <h1>
          공장의 디지털 트윈처럼,<br />
          조직의 스킬을 실시간으로 읽는다
        </h1>
        <p>
          파나소닉 공장이 습도 변화를 예측해 미리 알림을 받듯, SkillTwin은 조직의
          스킬 데이터를 온톨로지로 연결해 인력 공백을 예측하고 선제 알림을 제공합니다.
          가상 반도체 기업 &lsquo;세미코어&rsquo;의 데이터로 시연합니다.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard" className="btn">조직 대시보드 보기</Link>
          <Link href="/simulation" className="btn btn-ghost">시뮬레이션 해보기</Link>
          <Link href="/survey" className="btn btn-ghost">수용성 진단 참여</Link>
        </div>
      </section>

      <section className="grid grid-4">
        <div className="card"><div className="stat-value num">{EMPLOYEES.length}</div><div className="stat-label">가상 직원</div></div>
        <div className="card"><div className="stat-value num">{TEAMS.length}</div><div className="stat-label">팀</div></div>
        <div className="card"><div className="stat-value num">{SKILLS.length}</div><div className="stat-label">스킬 노드</div></div>
        <div className="card"><div className="stat-value num">{PROJECTS.length}</div><div className="stat-label">진행 프로젝트</div></div>
      </section>

      <h2 className="section-title">스킬 온톨로지 — 스킬은 서로 연결되어 있다</h2>
      <div className="card">
        <OntologyGraph skills={SKILLS} edges={SKILL_EDGES} />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
          <span className="badge"><i style={dot("var(--series-1)")} />설계</span>
          <span className="badge"><i style={dot("var(--series-2)")} />공정</span>
          <span className="badge"><i style={dot("var(--series-3)")} />품질</span>
          <span className="badge"><i style={dot("var(--series-7)")} />데이터·AI</span>
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          Workday Skills Cloud, Eightfold AI 등 실제 탤런트 인텔리전스 플랫폼이 쓰는
          구조를 단순화한 것입니다. 스킬 간 연결이 있어야 &ldquo;이 사람이 빠지면 어떤
          역량이 함께 위험해지는가&rdquo;를 계산할 수 있습니다.
        </p>
      </div>

      <h2 className="section-title">이 데모가 보여주는 것</h2>
      <div className="grid grid-3">
        <div className="card">
          <strong>① 조직 대시보드</strong>
          <p className="hint">팀×스킬 히트맵으로 조직 스킬 현황을 한눈에. 단일 실패점(한 명에게만 있는 스킬)을 자동 탐지해 알림.</p>
        </div>
        <div className="card">
          <strong>② 퇴사 영향 시뮬레이션</strong>
          <p className="hint">&ldquo;이 직원이 퇴사한다면?&rdquo; — 영향받는 프로젝트, 공백 스킬, 대체 후보를 즉시 계산. 공장 트윈의 what-if와 같은 구조.</p>
        </div>
        <div className="card">
          <strong>③ 인력 전망</strong>
          <p className="hint">공식 통계(고용노동부 사업체노동력조사) 이직률을 기준선으로 12개월 인력 변화를 전망하고 리스킬링 필요 시점을 알림.</p>
        </div>
      </div>
    </>
  );
}

function dot(color) {
  return { display: "inline-block", width: 9, height: 9, borderRadius: 99, background: color };
}
