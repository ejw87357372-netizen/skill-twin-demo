import Link from "next/link";
import { SKILLS, SKILL_EDGES, EMPLOYEES, TEAMS, PROJECTS, teamSkillMatrix, skillName } from "@/lib/data";
import { OntologyGraph, Heatmap, HBarChart } from "@/components/charts";
import Reveal from "@/components/Reveal";

export default function Home() {
  const matrix = teamSkillMatrix();

  return (
    <>
      {/* ── 히어로 ── */}
      <section className="hero-wash">
        <span className="tag">학술연구 데모 · 가상 데이터</span>
        <h1>
          조직의 스킬을<br />실시간으로 읽는다
        </h1>
        <p className="lede">
          스킬 데이터를 온톨로지로 엮어 인력 공백을 예측하고 선제 알림을 제공합니다.
          공장의 디지털 트윈이 설비를 읽듯, Weave는 조직의 역량을 읽습니다.
        </p>
        <div className="cta-row">
          <div className="cta-group">
            <span className="cta-group-label">인사담당자·경영진</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/dashboard" className="btn btn-pill">조직 대시보드</Link>
              <Link href="/simulation" className="btn btn-ghost btn-pill">시뮬레이션</Link>
            </div>
          </div>
          <div className="cta-group">
            <span className="cta-group-label">직원</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/skill-check" className="btn btn-pill">스킬 진단</Link>
              <Link href="/survey" className="btn btn-ghost btn-pill">수용성 진단</Link>
            </div>
          </div>
        </div>

        {/* 브라우저 프레임 안의 미리보기 */}
        <Reveal>
          <div className="hero-shot">
            <div className="hero-shot-bar">
              <span className="hero-shot-dot" /><span className="hero-shot-dot" /><span className="hero-shot-dot" />
              <span className="hero-shot-url">weave · 조직 대시보드</span>
            </div>
            <div className="hero-shot-body" style={{ textAlign: "left" }}>
              <div className="grid grid-4" style={{ marginBottom: 16 }}>
                {[
                  [EMPLOYEES.length, "가상 직원"], [TEAMS.length, "팀"],
                  [SKILLS.length, "스킬 노드"], [PROJECTS.length, "진행 프로젝트"],
                ].map(([v, label]) => (
                  <div key={label}>
                    <div className="stat-value num">{v}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>
              <Heatmap rows={matrix} cols={SKILLS} colLabel={(c) => skillName(c.id)} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 온톨로지 ── */}
      <Reveal>
        <h2 className="section-title">스킬 온톨로지 — 스킬은 서로 연결되어 있다</h2>
        <div className="card">
          <OntologyGraph skills={SKILLS} edges={SKILL_EDGES} />
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
            <span className="badge"><i style={dot("var(--series-1)")} />설계</span>
            <span className="badge"><i style={dot("var(--series-2)")} />공정</span>
            <span className="badge"><i style={dot("var(--series-3)")} />품질</span>
            <span className="badge"><i style={dot("var(--series-7)")} />데이터·AI</span>
            <span className="badge"><i style={dot("var(--series-4)")} />경영지원</span>
          </div>
          <p className="hint" style={{ marginTop: 10 }}>
            Workday Skills Cloud, Eightfold AI 등 실제 탤런트 인텔리전스 플랫폼이 쓰는
            구조를 단순화한 것입니다. 스킬 간 연결이 있어야 &ldquo;이 사람이 빠지면 어떤
            역량이 함께 위험해지는가&rdquo;를 계산할 수 있습니다.
          </p>
        </div>
      </Reveal>

      {/* ── 기능 3종 ── */}
      <Reveal>
        <h2 className="section-title">이 데모가 보여주는 것</h2>
      </Reveal>
      <div className="grid grid-3">
        {[
          ["① 조직 대시보드", "팀×스킬 히트맵으로 조직 스킬 현황을 한눈에. 단일 실패점(한 명에게만 있는 스킬)을 자동 탐지해 알림."],
          ["② 퇴사 영향 시뮬레이션", "“이 직원이 퇴사한다면?” — 영향받는 프로젝트, 공백 스킬, 대체 후보를 즉시 계산. 공장 트윈의 what-if와 같은 구조."],
          ["③ 인력 전망", "공식 통계(고용노동부 사업체노동력조사) 이직률을 기준선으로 12개월 인력 변화를 전망하고 리스킬링 필요 시점을 알림."],
        ].map(([title, desc], i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="card" style={{ height: "100%" }}>
              <strong>{title}</strong>
              <p className="hint">{desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── 산업 동향 ── */}
      <Reveal>
        <h2 className="section-title">우리 산업은 지금 어떤가 — 산업 동향</h2>
        <div className="card">
          <p style={{ margin: "0 0 12px", fontSize: 14.5, color: "var(--ink-2)" }}>
            전체 취업자 <strong className="num">2,915.4만명</strong>(2026.6), 월 이직률{" "}
            <strong className="num">4.9%</strong>(2026.5). 이직이 잦은 산업일수록 스킬 기반
            인력 예측의 효용이 커집니다.
          </p>
          <HBarChart
            items={[
              { label: "숙박·음식점업", value: 8.1, color: "var(--series-2)" },
              { label: "건설업", value: 7.9, color: "var(--series-2)" },
              { label: "예술·스포츠·여가", value: 5.9, color: "var(--series-2)" },
              { label: "전 산업 평균", value: 4.9, color: "var(--series-7)" },
              { label: "제조업", value: 2.9 },
              { label: "공공행정·교육", value: 2.0 },
            ]}
            unit="%"
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
            <span className="hint">산업별 월 이직률 — 자세한 근거·국제 비교는 산업 동향 탭에</span>
            <Link href="/industry" className="btn btn-ghost btn-pill">산업 동향 보기 →</Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function dot(color) {
  return { display: "inline-block", width: 9, height: 9, borderRadius: 99, background: color };
}
