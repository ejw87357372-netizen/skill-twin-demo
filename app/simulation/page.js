"use client";
import { useEffect, useMemo, useState } from "react";
import { SKILLS, skillName, demandGap, projection, holdersOf } from "@/lib/data";
import { LineChart, HBarChart } from "@/components/charts";
import { FALLBACK_BENCHMARK } from "@/lib/benchmarks";

export default function Simulation() {
  const [benchmark, setBenchmark] = useState(FALLBACK_BENCHMARK);
  const [nProjects, setNProjects] = useState(2);
  const [skill, setSkill] = useState("ml");
  const [ratePct, setRatePct] = useState(FALLBACK_BENCHMARK.turnoverMonthlyPct);

  useEffect(() => {
    fetch("/api/benchmarks")
      .then((r) => r.json())
      .then((b) => {
        setBenchmark(b);
        setRatePct(b.turnoverMonthlyPct);
      })
      .catch(() => {});
  }, []);

  const gaps = useMemo(() => demandGap(nProjects), [nProjects]);
  const supply = holdersOf(skill).length;
  const series = useMemo(
    () => [
      { name: "업계 기준선", color: "var(--series-1)", points: projection(supply, benchmark.turnoverMonthlyPct) },
      { name: "조정 시나리오", color: "var(--series-2)", points: projection(supply, ratePct) },
    ],
    [supply, benchmark, ratePct]
  );
  const after12 = series[1].points[12].n;

  return (
    <>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>인력 시뮬레이션</h1>
      <p className="hint">
        기준선: {benchmark.label} 월 이직률 {benchmark.turnoverMonthlyPct}% —{" "}
        {benchmark.live ? "KOSIS API 실시간 공표치" : "폴백 예시값 (KOSIS_API_URL 설정 시 자동 갱신)"}
      </p>

      <h2 className="section-title">① 신규 AI 프로젝트 착수 시 스킬 수요</h2>
      <div className="card">
        <label style={{ fontSize: 14 }}>
          신설 AI 프로젝트 수: <strong className="num">{nProjects}개</strong>
          <input
            type="range" min="0" max="5" value={nProjects}
            onChange={(e) => setNProjects(+e.target.value)}
            style={{ width: "100%", maxWidth: 360, display: "block", marginTop: 6 }}
          />
        </label>
        <div className="grid grid-2" style={{ marginTop: 14 }}>
          <table className="data">
            <thead><tr><th>스킬</th><th>필요</th><th>보유</th><th>부족</th></tr></thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.skill}>
                  <td>{skillName(g.skill)}</td>
                  <td className="num">{g.need}명</td>
                  <td className="num">{g.have}명</td>
                  <td className="num" style={{ color: g.gap > 0 ? "var(--status-critical)" : "var(--good-text)" }}>
                    {g.gap > 0 ? `▲ ${g.gap}명` : "✓ 충분"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <p className="hint" style={{ margin: "0 0 6px" }}>부족 인원 (명)</p>
            <HBarChart
              items={gaps.map((g) => ({ label: skillName(g.skill), value: g.gap, color: "var(--series-2)" }))}
              max={Math.max(...gaps.map((g) => g.gap), 4)}
            />
          </div>
        </div>
      </div>

      <h2 className="section-title">② 이직률 기반 12개월 보유 인력 전망</h2>
      <div className="card">
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 14 }}>
            대상 스킬{" "}
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 14, flex: 1, minWidth: 220 }}>
            가정 월 이직률: <strong className="num">{ratePct.toFixed(1)}%</strong>
            <input
              type="range" min="0" max="6" step="0.1" value={ratePct}
              onChange={(e) => setRatePct(+e.target.value)}
              style={{ width: "100%", display: "block", marginTop: 6 }}
            />
          </label>
        </div>
        <div style={{ marginTop: 14 }}>
          <LineChart series={series} />
        </div>
        <p style={{ fontSize: 14 }}>
          현재 <strong className="num">{supply}명</strong>인 &lsquo;{skillName(skill)}&rsquo; 보유 인력은
          조정 시나리오 기준 12개월 뒤 <strong className="num">{after12}명</strong>으로 전망됩니다.
          {after12 < supply * 0.85 && (
            <span style={{ color: "var(--status-critical)" }}>
              {" "}▲ 15% 이상 감소 — 채용·리스킬링 선제 대응이 필요한 구간입니다.
            </span>
          )}
        </p>
        <p className="hint">
          전망식: 보유 인원 × (1 − 월 이직률)^개월. 파나소닉 트윈의 &ldquo;몇 분 뒤
          습도&rdquo; 예측을 인력 버전으로 옮긴 단순 모델이며, 기준선만 공식 통계를 사용합니다.
        </p>
      </div>
    </>
  );
}
