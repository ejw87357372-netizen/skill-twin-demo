import { SKILLS, EMPLOYEES, teamSkillMatrix, singlePointsOfFailure, holdersOf, buildAlerts } from "@/lib/data";
import { fetchBenchmark } from "@/lib/benchmarks";
import { Heatmap, HBarChart } from "@/components/charts";
import AlertFeed from "@/components/AlertFeed";

export const metadata = { title: "조직 대시보드 · Weave" };

export default async function Dashboard() {
  const benchmark = await fetchBenchmark();
  const matrix = teamSkillMatrix();
  const spof = singlePointsOfFailure();
  const alerts = buildAlerts(benchmark);
  const topSkills = SKILLS.map((s) => ({ label: s.name, value: holdersOf(s.id).length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>조직 스킬 대시보드</h1>
      <p className="hint">가상 반도체 기업 세미코어 · 직원 {EMPLOYEES.length}명 · 데이터는 전부 가상</p>

      <div className="grid grid-4" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="stat-value num">{spof.length}</div>
          <div className="stat-label">단일 실패점 스킬 (숙련자 1명 이하)</div>
        </div>
        <div className="card">
          <div className="stat-value num">{benchmark.turnoverMonthlyPct}%</div>
          <div className="stat-label">업계 월 이직률 기준선{benchmark.live ? " (KOSIS 실시간)" : " (폴백 예시값)"}</div>
        </div>
        <div className="card">
          <div className="stat-value num">{benchmark.shortagePct}%</div>
          <div className="stat-label">반도체 산업기술인력 부족률 (예시값)</div>
        </div>
        <div className="card">
          <div className="stat-value num">{SKILLS.length}</div>
          <div className="stat-label">관리 중인 스킬 노드</div>
        </div>
      </div>

      <h2 className="section-title">선제 알림 피드</h2>
      <div className="card">
        <AlertFeed alerts={alerts} />
        <p className="hint" style={{ marginTop: 10 }}>
          ※ 알림 도착 연출은 데모입니다. 알림 내용 자체는 좌측 가상 조직 데이터에서
          규칙 기반으로 실제 계산된 결과입니다.
        </p>
      </div>

      <h2 className="section-title">팀 × 스킬 보유 현황</h2>
      <div className="card">
        <Heatmap rows={matrix} cols={SKILLS} colLabel={(c) => c.name} />
        <p className="hint">색이 진할수록 보유 인원이 많음. 빈 칸(회색)은 보유자 0명, 팀 간 스킬 공백 지점.</p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <div className="card">
          <strong>보유 인원 상위 스킬</strong>
          <div style={{ marginTop: 10 }}>
            <HBarChart items={topSkills} />
          </div>
        </div>
        <div className="card">
          <strong>단일 실패점 스킬</strong>
          <table className="data" style={{ marginTop: 10 }}>
            <thead>
              <tr><th>스킬</th><th>숙련자</th><th>전체 보유자</th></tr>
            </thead>
            <tbody>
              {spof.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="num" style={{ color: s.experts === 0 ? "var(--status-critical)" : "inherit" }}>
                    {s.experts}명
                  </td>
                  <td className="num">{s.holders}명</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint" style={{ marginTop: 8 }}>숙련자 = 레벨 4 이상 보유자.</p>
        </div>
      </div>
    </>
  );
}
