import Link from "next/link";
import { notFound } from "next/navigation";
import { EMPLOYEES, SKILLS, SKILL_EDGES, skillName, departureImpact } from "@/lib/data";
import { OntologyGraph, HBarChart } from "@/components/charts";

export function generateStaticParams() {
  return EMPLOYEES.map((e) => ({ id: e.id }));
}

export default function Person({ params }) {
  const impact = departureImpact(params.id);
  if (!impact) notFound();
  const { emp, affectedProjects, gapSkills, candidates } = impact;

  return (
    <>
      <p style={{ marginTop: 24 }}>
        <Link href="/people" className="hint">← 인재 프로필 목록</Link>
      </p>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 4 }}>
        {emp.name} <span className="hint" style={{ fontSize: 15 }}>{emp.team} · {emp.role} · {emp.years}년차</span>
      </h1>

      <div className="grid grid-2">
        <div className="card">
          <strong>보유 스킬 (숙련도 1~5)</strong>
          <div style={{ marginTop: 10 }}>
            <HBarChart
              items={emp.skills.map((s) => ({ label: skillName(s.skill), value: s.level }))}
              max={5}
              unit="레벨"
            />
          </div>
        </div>
        <div className="card">
          <strong>온톨로지에서의 위치</strong>
          <OntologyGraph skills={SKILLS} edges={SKILL_EDGES} highlight={emp.skills.map((s) => s.skill)} />
        </div>
      </div>

      <h2 className="section-title">퇴사 영향 시뮬레이션 (what-if)</h2>
      <div className="grid grid-3">
        <div className="card">
          <strong>영향받는 프로젝트</strong>
          {affectedProjects.length === 0 ? (
            <p className="hint">현재 배정된 프로젝트 없음</p>
          ) : (
            <ul style={{ paddingLeft: 18, margin: "8px 0 0" }}>
              {affectedProjects.map((p) => (
                <li key={p.id} style={{ fontSize: 14, marginBottom: 4 }}>{p.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <strong>공백이 생기는 스킬</strong>
          {gapSkills.length === 0 ? (
            <p className="hint">대체 인력이 충분한 스킬만 보유</p>
          ) : (
            <table className="data" style={{ marginTop: 8 }}>
              <thead><tr><th>스킬</th><th>남는 보유자</th></tr></thead>
              <tbody>
                {gapSkills.map((s) => (
                  <tr key={s.skill}>
                    <td>{skillName(s.skill)}</td>
                    <td className="num" style={{ color: s.remaining <= 1 ? "var(--status-critical)" : "inherit" }}>
                      {s.remaining}명
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <strong>대체 후보 (스킬 일치율)</strong>
          <table className="data" style={{ marginTop: 8 }}>
            <thead><tr><th>이름</th><th>팀</th><th>일치율</th></tr></thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.emp.id}>
                  <td><Link href={`/people/${c.emp.id}`}>{c.emp.name}</Link></td>
                  <td className="hint">{c.emp.team}</td>
                  <td className="num">{c.match}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="hint" style={{ marginTop: 12 }}>
        공장 디지털 트윈의 &ldquo;습도가 오르면?&rdquo; 시나리오와 같은 구조입니다 —
        변수(인력) 하나를 바꿨을 때의 파급 효과를 온톨로지 그래프로 즉시 계산합니다.
      </p>
    </>
  );
}
