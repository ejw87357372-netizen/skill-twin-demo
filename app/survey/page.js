"use client";
import { useMemo, useState } from "react";
import {
  INTRO, QUESTIONS, DEMOGRAPHICS, SCALE_LABELS,
  scoreFactors, acceptanceScore, typeLabel, weakestFactors, pct,
} from "@/lib/survey";
import { RadarChart } from "@/components/charts";
import { industryForSurveyOption } from "@/lib/industry";
import Link from "next/link";

// 단계: intro → consent → demo → questions → result
export default function Survey() {
  const [step, setStep] = useState("intro");
  const [consent, setConsent] = useState(null); // true=수집 동의, false=결과만
  const [demo, setDemo] = useState({});
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(null);

  const factors = useMemo(() => scoreFactors(answers), [answers]);

  const pick = (v) => {
    const q = QUESTIONS[qi];
    setAnswers((a) => ({ ...a, [q.id]: v }));
    if (qi + 1 < QUESTIONS.length) setQi(qi + 1);
    else finish({ ...answers, [q.id]: v });
  };

  async function finish(finalAnswers) {
    setStep("result");
    if (!consent) return;
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          demographics: demo,
          answers: finalAnswers,
          attentionPassed: finalAnswers.ATT === 1,
        }),
      });
      setSaved(res.ok);
    } catch {
      setSaved(false);
    }
  }

  if (step === "intro")
    return (
      <Card>
        <span className="tag">성균관대 학술연구 · 익명</span>
        <h1 style={{ fontSize: 26, margin: "6px 0 4px" }}>{INTRO.title}</h1>
        <p className="hint">{INTRO.time}</p>
        <p style={{ whiteSpace: "pre-line", fontSize: 14.5, color: "var(--ink-2)" }}>{INTRO.scenario}</p>
        <button className="btn" onClick={() => setStep("consent")}>진단 시작하기</button>
      </Card>
    );

  if (step === "consent")
    return (
      <Card>
        <h2 style={{ fontSize: 20, marginTop: 0 }}>연구 참여 동의</h2>
        <p style={{ fontSize: 14.5, color: "var(--ink-2)" }}>{INTRO.consent}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => { setConsent(true); setStep("demo"); }}>
            동의하고 시작하기
          </button>
          <button className="btn btn-ghost" onClick={() => { setConsent(false); setStep("demo"); }}>
            동의 없이 결과만 볼래요
          </button>
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          동의하지 않아도 진단 결과는 볼 수 있으며, 이 경우 응답은 저장되지 않습니다.
        </p>
      </Card>
    );

  if (step === "demo") {
    const done = DEMOGRAPHICS.every((d) => demo[d.id]);
    return (
      <Card>
        <h2 style={{ fontSize: 20, marginTop: 0 }}>기본 정보</h2>
        <p className="hint">통계 처리 목적으로만 사용됩니다.</p>
        {DEMOGRAPHICS.map((d) => (
          <label key={d.id} style={{ display: "block", margin: "12px 0", fontSize: 14 }}>
            {d.label}
            <select
              value={demo[d.id] ?? ""}
              onChange={(e) => setDemo((x) => ({ ...x, [d.id]: e.target.value }))}
              style={{ display: "block", marginTop: 4, width: "100%", maxWidth: 340 }}
            >
              <option value="" disabled>선택해 주세요</option>
              {d.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
        <button className="btn" disabled={!done} style={{ opacity: done ? 1 : 0.5 }} onClick={() => setStep("questions")}>
          문항 시작 (총 {QUESTIONS.length}개)
        </button>
      </Card>
    );
  }

  if (step === "questions") {
    const q = QUESTIONS[qi];
    return (
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-muted)" }}>
          <span>문항 {qi + 1} / {QUESTIONS.length}</span>
          {qi > 0 && (
            <button onClick={() => setQi(qi - 1)} style={{ background: "none", border: 0, color: "var(--series-1)", cursor: "pointer", fontSize: 12.5 }}>
              ← 이전 문항
            </button>
          )}
        </div>
        <div style={{ height: 4, background: "var(--grid)", borderRadius: 99, margin: "10px 0 22px" }}>
          <div style={{ height: 4, width: `${((qi + 1) / QUESTIONS.length) * 100}%`, background: "var(--series-1)", borderRadius: 99 }} />
        </div>
        <p style={{ fontSize: 17, fontWeight: 600, minHeight: 72 }}>{q.text}</p>
        <div style={{ display: "grid", gap: 7 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((v) => (
            <button
              key={v}
              onClick={() => pick(v)}
              className="btn-ghost"
              style={{
                textAlign: "left", padding: "11px 14px", borderRadius: 10, fontSize: 14.5,
                border: `1px solid ${answers[q.id] === v ? "var(--series-1)" : "var(--axis)"}`,
                background: answers[q.id] === v ? "color-mix(in srgb, var(--series-1) 10%, transparent)" : "var(--surface-1)",
                cursor: "pointer", color: "var(--ink-1)",
              }}
            >
              <strong className="num">{v}</strong>
              {SCALE_LABELS[v] ? ` — ${SCALE_LABELS[v]}` : ""}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  // 결과
  const score = acceptanceScore(factors) ?? 0;
  const type = typeLabel(score);
  const weak = weakestFactors(factors);
  // 레이더에는 방향이 같은 5요인만. 역방향 요인(프라이버시 우려)은 아래에 따로 표시한다.
  const radar = ["PE", "EE", "SI", "FC", "AF"].map((k) => ({
    label: { PE: "성과기대", EE: "노력기대", SI: "사회적 영향", FC: "촉진조건", AF: "알고리즘 공정성 인식" }[k],
    value: factors[k]?.raw ?? 0,
  }));
  const privacy = factors.PC?.raw ?? 0;

  return (
    <div style={{ maxWidth: 640, margin: "32px auto" }}>
      <div className="card" style={{ textAlign: "center" }}>
        <p className="hint" style={{ margin: 0 }}>나의 수용 의도 (연구 종속변수)</p>
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }} className="num">{score}<span style={{ fontSize: 22, fontWeight: 600 }}>점</span></div>
        <span className="badge" style={{ color: "var(--series-1)", fontSize: 14 }}>{type.name}</span>
        <p style={{ fontSize: 14.5, color: "var(--ink-2)" }}>{type.desc}</p>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <strong>수용 요인 프로필 (5요인)</strong>
        <RadarChart items={radar} />
        <p className="hint">
          모두 값이 클수록 수용에 유리한 방향의 요인입니다. 방향이 반대인 프라이버시 우려는 아래에 따로 표시했습니다.
        </p>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <strong>프라이버시 우려</strong>
          <span className="num" style={{ fontSize: 20, fontWeight: 700, color: privacy >= 5 ? "var(--series-2)" : "var(--ink-1)" }}>
            {privacy.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-muted)" }}> / 7</span>
          </span>
        </div>
        <div style={{ height: 8, background: "var(--grid)", borderRadius: 99, margin: "8px 0 4px" }}>
          <div style={{ height: 8, width: `${pct(privacy)}%`, background: privacy >= 5 ? "var(--series-2)" : "var(--series-1)", borderRadius: 99 }} />
        </div>
        <p className="hint">
          이 요인만 방향이 반대입니다 — <strong>값이 클수록 우려가 크고 수용에 불리</strong>합니다.
          연구 모형에서 프라이버시 우려는 수용 의도에 부(−)의 영향을 미칠 것으로 가정합니다.
        </p>
      </div>
      {weak.map((w) => (
        <div className="card" key={w.key} style={{ marginTop: 14 }}>
          <strong>
            {w.negative ? "가장 큰 저해 요인" : "가장 낮은 요인"}: {w.name} ({w.v.toFixed(1)}점{w.negative ? " · 높을수록 불리" : ""})
          </strong>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "6px 0 0" }}>{w.tip}</p>
        </div>
      ))}
      <IndustryContext option={demo.industry} />
      <div className="card" style={{ marginTop: 14 }}>
        {consent ? (
          saved === null ? <p className="hint">응답 저장 중…</p>
          : saved ? <p className="hint" style={{ color: "var(--good-text)" }}>✓ 응답이 익명으로 저장되었습니다. 연구 참여에 감사드립니다!</p>
          : <p className="hint">응답 저장이 설정되지 않았거나 실패했습니다. (결과는 정상입니다 — Supabase 연결 후 저장됩니다)</p>
        ) : (
          <p className="hint">동의 없이 진행하여 응답은 저장되지 않았습니다.</p>
        )}
        <button className="btn btn-ghost" style={{ marginTop: 6 }} onClick={() => { setStep("intro"); setQi(0); setAnswers({}); setSaved(null); }}>
          처음부터 다시
        </button>
      </div>
    </div>
  );
}

/** 응답자가 선택한 산업의 고용·이직 맥락 — 문항과 무관한 결과 화면 부가정보 */
function IndustryContext({ option }) {
  const hits = industryForSurveyOption(option);
  if (!hits) return null;
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <strong>내 산업의 고용·이직 맥락 — {option}</strong>
      {hits.map((d) => (
        <p key={d.id} style={{ fontSize: 14, color: "var(--ink-2)", margin: "8px 0 0" }}>
          <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{d.name}</span>
          {d.change.value != null && d.change.verified && (
            <>
              {" · "}취업자{" "}
              <span className="num" style={{ fontWeight: 700, color: d.change.value > 0 ? "var(--good-text)" : "var(--series-2)" }}>
                {d.change.value > 0 ? "+" : ""}{d.change.value}만
              </span>
              (전년동월대비)
            </>
          )}
          {" — "}{d.trendNote}
        </p>
      ))}
      <p className="hint" style={{ marginTop: 10 }}>
        이직이 잦거나 고용이 줄어드는 산업일수록 스킬 데이터 기반 인력 예측의 효용이 커집니다.
        전체 산업 비교는 <Link href="/industry" style={{ color: "var(--series-1)" }}>산업 동향 탭</Link>에서 볼 수 있어요.
        (출처·기준 시점도 그곳에 표기)
      </p>
    </div>
  );
}

function Card({ children }) {
  return <div className="card" style={{ maxWidth: 560, margin: "36px auto", padding: 26 }}>{children}</div>;
}
