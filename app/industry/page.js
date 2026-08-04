import {
  SOURCES, HEADLINE, TURNOVER_TREND, TURNOVER_TREND_NOTE,
  INDUSTRIES, US_QUITS, US_QUITS_NOTE, EMPLOYED_TOTAL,
} from "@/lib/industry";
import { HBarChart } from "@/components/charts";

export const metadata = { title: "산업 동향 — SkillWeave" };

const fmtChange = (v) => (v > 0 ? `+${v}` : `${v}`);

function Badge({ verified, asOf }) {
  return verified ? (
    <span className="badge" style={{ color: "var(--good-text)", fontSize: 11.5 }}>공표치{asOf ? ` · ${asOf}` : ""}</span>
  ) : (
    <span className="badge" style={{ color: "var(--series-2)", fontSize: 11.5 }}>예시값 · 갱신 필요</span>
  );
}

export default function Industry() {
  const share = INDUSTRIES
    .map((d) => ({ label: d.name, value: +((d.employment.value / EMPLOYED_TOTAL) * 100).toFixed(1) }))
    .sort((a, b) => b.value - a.value);

  const changes = INDUSTRIES
    .filter((d) => d.change.value != null)
    .sort((a, b) => b.change.value - a.change.value);

  const sepRates = [...INDUSTRIES]
    .sort((a, b) => b.sepRate.value - a.sepRate.value)
    .map((d) => ({ label: d.name, value: d.sepRate.value, color: d.sepRate.value >= 4.9 ? "var(--series-2)" : "var(--series-1)" }));

  return (
    <>
      <section className="hero" style={{ paddingBottom: 10 }}>
        <span className="tag">공식 통계 기반 · 산업 맥락</span>
        <h1>산업별 고용 점유율과 이직 동태</h1>
        <p>
          스킬 기반 인재관리가 필요한 이유는 산업마다 다릅니다 — 이직이 잦은 산업은 인력 공백
          예측이, 고용이 줄어드는 산업은 리스킬링 경로 설계가 먼저입니다. 이 탭은 고용노동부
          사업체노동력조사·경제활동인구조사(국가데이터처)·미국 BLS JOLTS의 공표 자료로 그 맥락을 보여줍니다.
        </p>
        <p className="hint" style={{ marginTop: 4 }}>
          <span className="badge" style={{ color: "var(--good-text)", marginRight: 6 }}>공표치</span>
          보도자료·공표 요약에서 확인한 수치 ·{" "}
          <span className="badge" style={{ color: "var(--series-2)", margin: "0 6px" }}>예시값 · 갱신 필요</span>
          구조 시연용 근사값 — 발표 전 KOSIS 최신 공표치로 갱신하세요.
        </p>
      </section>

      <section className="grid grid-4">
        {Object.values(HEADLINE).map((h) => (
          <div className="card" key={h.label}>
            <div className="stat-value num">{h.value}<span style={{ fontSize: 15, fontWeight: 600 }}>{h.unit}</span></div>
            <div className="stat-label">{h.label}</div>
            <Badge verified={h.verified} asOf={h.asOf} />
          </div>
        ))}
      </section>

      <h2 className="section-title">산업별 고용 점유율 — 전체 취업자 대비 (%)</h2>
      <div className="card">
        <div style={{ marginBottom: 6 }}><Badge verified={false} /> <span className="hint">산업별 규모는 연간 공표치 기준 근사, 분모(취업자 {EMPLOYED_TOTAL}만명)는 2026.6 공표치</span></div>
        <HBarChart items={share} unit="%" />
        <p className="hint">
          제조업·도소매·공공교육·보건복지가 고용의 큰 축입니다. 점유율이 큰 산업의 수용성이
          곧 전체 노동시장의 수용성을 좌우한다는 점에서, 설문의 산업별 분석 가중치 참고용으로 쓸 수 있습니다.
        </p>
      </div>

      <h2 className="section-title">어느 산업에서 사람이 늘고 줄었나 — 전년동월대비 증감 (만명)</h2>
      <div className="card">
        <div style={{ marginBottom: 6 }}><Badge verified={true} asOf="2026.6 / 2026.5" /> <span className="hint">경제활동인구조사(취업자)·사업체노동력조사(종사자) 공표치</span></div>
        <table className="data" style={{ width: "100%" }}>
          <thead>
            <tr><th>산업</th><th style={{ textAlign: "right" }}>증감</th><th>확인된 동향</th></tr>
          </thead>
          <tbody>
            {changes.map((d) => (
              <tr key={d.id}>
                <td style={{ whiteSpace: "nowrap" }}>{d.name}</td>
                <td className="num" style={{ textAlign: "right", fontWeight: 700, color: d.change.value > 0 ? "var(--good-text)" : "var(--series-2)", whiteSpace: "nowrap" }}>
                  {fmtChange(d.change.value)}만
                </td>
                <td style={{ fontSize: 13, color: "var(--ink-2)" }}>{d.trendNote}{d.change.changeNote ? ` (${d.change.changeNote})` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">이직 동태 — 입직률·이직률 추이와 산업별 수준</h2>
      <div className="grid grid-2">
        <div className="card">
          <strong>전체 입직률·이직률 추이 (월, %)</strong>{" "}
          <Badge verified={true} />
          <table className="data" style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr><th>시점</th><th style={{ textAlign: "right" }}>입직률</th><th style={{ textAlign: "right" }}>이직률</th></tr>
            </thead>
            <tbody>
              {TURNOVER_TREND.map((t) => (
                <tr key={t.period}>
                  <td>{t.period}</td>
                  <td className="num" style={{ textAlign: "right" }}>{t.hire}%</td>
                  <td className="num" style={{ textAlign: "right" }}>{t.sep}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint" style={{ marginTop: 8 }}>{TURNOVER_TREND_NOTE}</p>
        </div>
        <div className="card">
          <strong>산업별 월 이직률 수준 (%)</strong>{" "}
          <Badge verified={false} />
          <HBarChart items={sepRates} unit="%" />
          <p className="hint">
            주황 = 전 산업 평균(4.9%, 2026.5 공표) 이상. 숙박·음식, 건설처럼 이직이 잦은
            산업일수록 인력 공백 예측(이 데모의 시뮬레이션 탭)의 효용이 커집니다.
          </p>
        </div>
      </div>

      <h2 className="section-title">국제 비교 — 미국 산업별 자발적 이직률 (JOLTS quits rate)</h2>
      <div className="card">
        <div style={{ marginBottom: 6 }}><Badge verified={true} asOf="2026.4" /> <span className="hint">미국 노동통계국(BLS), 계절조정</span></div>
        <HBarChart
          items={US_QUITS.map((d) => ({ ...d, color: d.em ? "var(--series-7)" : "var(--series-1)" }))}
          unit="%"
        />
        <p className="hint">{US_QUITS_NOTE}</p>
      </div>

      <h2 className="section-title">출처</h2>
      <div className="card">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.9 }}>
          {SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--series-1)" }}>{s.name}</a>
              {" — "}{s.note}
            </li>
          ))}
        </ul>
        <p className="hint" style={{ marginTop: 10 }}>
          학술연구 데모입니다. "예시값" 배지 항목은 KOSIS 공표 상세표 확인 후 lib/industry.js에서 갱신하세요.
        </p>
      </div>
    </>
  );
}
