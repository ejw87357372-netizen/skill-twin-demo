import Link from "next/link";
import result from "@/data/result.json";
import { HBarChart } from "@/components/charts";

export const metadata = { title: "연구 결과 · Weave" };

export default function Result() {
  const has = result.n != null;

  return (
    <>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>연구 결과</h1>
      <p className="hint">
        구글폼으로 수집한 응답을 분석 스크립트(analysis/weave_analysis.py)로 처리한 결과를 표시합니다.
        {has ? ` 최종 유효표본 ${result.n}명 · ${result.updated} 기준.` : " 아직 조사가 끝나지 않아 값이 비어 있습니다."}
      </p>

      {!has ? (
        <div className="card" style={{ marginTop: 16 }}>
          <strong>조사 후 갱신 예정</strong>
          <p className="hint" style={{ marginTop: 8, lineHeight: 1.9 }}>
            갱신은 세 단계입니다.<br />
            1. 구글폼 응답 시트를 CSV로 내려받습니다.<br />
            2. <code>python3 analysis/weave_analysis.py 응답.csv</code> 를 실행합니다.<br />
            3. 생성된 <code>analysis/out/result.json</code> 을 <code>data/result.json</code> 에 덮어쓰고 배포하면 이 화면이 채워집니다.
          </p>
          <p className="hint" style={{ marginTop: 10 }}>
            결과가 나오기 전까지 어떤 수치도 표시하지 않습니다. 가상의 값으로 대체하지 않는 것이 본 연구의 원칙입니다.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Link href="/survey" className="btn btn-ghost btn-pill">수용성 진단 문항 보기</Link>
            <Link href="/" className="btn btn-ghost btn-pill">연구 개요</Link>
          </div>
        </div>
      ) : (
        <>
          <h2 className="section-title">요인별 신뢰도 (Cronbach&apos;s α)</h2>
          <div className="card">
            <HBarChart items={result.reliability.map((r) => ({ label: r.factor, value: r.alpha }))} max={1} unit="" />
            <p className="hint">일반적으로 .70 이상이면 내적 일관성이 확보된 것으로 본다.</p>
          </div>

          <h2 className="section-title">가설 검정 결과</h2>
          <div className="card">
            <table className="data">
              <thead><tr><th>가설</th><th>변수</th><th>B</th><th>p</th><th>판정</th></tr></thead>
              <tbody>
                {result.hypotheses.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td><td>{h.factor}</td>
                    <td className="num">{h.B}</td><td className="num">{h.p}</td>
                    <td><span className="badge" style={{ color: h.accepted ? "var(--good-text)" : "var(--ink-muted)" }}>
                      {h.accepted ? "채택" : "기각"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="section-title">위계적 회귀 모형</h2>
          <div className="card">
            <table className="data">
              <thead><tr><th>모형</th><th>투입 변수</th><th>R²</th><th>ΔR²</th></tr></thead>
              <tbody>
                {result.models.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td><td>{m.vars}</td>
                    <td className="num">{m.r2}</td><td className="num">{m.dr2 ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="hint" style={{ marginTop: 20 }}>{result.note}</p>
    </>
  );
}
