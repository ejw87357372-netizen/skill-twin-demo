"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { TARGET_ROLES, ALL_SKILLS, diagnose } from "@/lib/skillcheck";
import { skillName } from "@/lib/data";
import { RadarChart } from "@/components/charts";

// 단계: role → skills → result
export default function SkillCheck() {
  const [step, setStep] = useState("role");
  const [roleId, setRoleId] = useState(null);
  const [owned, setOwned] = useState({}); // { skillId: level }

  const result = useMemo(
    () => (step === "result" ? diagnose(roleId, owned) : null),
    [step, roleId, owned]
  );

  const toggle = (id) =>
    setOwned((o) => {
      const n = { ...o };
      if (n[id]) delete n[id];
      else n[id] = 3;
      return n;
    });
  const setLevel = (id, lv) => setOwned((o) => ({ ...o, [id]: lv }));

  if (step === "role")
    return (
      <div style={{ maxWidth: 760, margin: "32px auto" }}>
        <span className="tag">직원 관점 · 시연용 가상 직무 카탈로그</span>
        <h1 style={{ fontSize: 24, margin: "8px 0 4px" }}>스킬 진단 — 희망 직무를 선택하세요</h1>
        <p className="hint">
          희망 직무와 보유 스킬을 입력하면, 스킬 온톨로지를 기준으로 부족 스킬과 학습 경로를
          제안합니다.
        </p>
        <div className="card" style={{ marginTop: 10, padding: "12px 16px" }}>
          <strong style={{ fontSize: 14 }}>이 진단은 성과평가가 아닙니다</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8, fontSize: 13, color: "var(--ink-2)" }}>
            <span>✓ <strong>자가진단</strong> — 시험·검증 없이 본인 판단으로 입력하는 경력개발 참고 도구</span>
            <span>✓ <strong>내 브라우저에서만 처리</strong> — 입력한 직무·스킬은 서버로 전송·저장되지 않음</span>
            <span>✓ <strong>근거 공개</strong> — 준비도 계산식과 추천 이유(온톨로지 인접 관계)를 화면에 표시</span>
          </div>
        </div>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          {TARGET_ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => { setRoleId(r.id); setStep("skills"); }}
              className="card"
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--axis)", font: "inherit" }}
            >
              <span className="badge" style={{ color: "var(--series-1)", fontSize: 11.5 }}>{r.group}</span>
              <strong style={{ display: "block", margin: "6px 0 4px" }}>{r.name}</strong>
              <span className="hint">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );

  if (step === "skills") {
    const role = TARGET_ROLES.find((r) => r.id === roleId);
    return (
      <div style={{ maxWidth: 760, margin: "32px auto" }}>
        <p className="hint" style={{ marginBottom: 4 }}>
          희망 직무: <strong style={{ color: "var(--ink-1)" }}>{role.name}</strong>{" "}
          <button onClick={() => setStep("role")} style={{ background: "none", border: 0, color: "var(--series-1)", cursor: "pointer", fontSize: 12.5 }}>변경</button>
        </p>
        <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>보유 스킬을 선택하고 숙련도를 입력하세요</h1>
        <p className="hint">선택한 스킬마다 숙련도 1(입문)~5(전문가)를 지정합니다. 정직하게 입력할수록 진단이 정확해요.</p>
        <div className="card" style={{ marginTop: 12 }}>
          {["설계", "공정", "품질", "데이터·AI", "경영지원"].map((cat) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div className="hint" style={{ fontWeight: 600, marginBottom: 6 }}>{cat}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ALL_SKILLS.filter((s) => s.cat === cat).map((s) => {
                  const sel = owned[s.id] != null;
                  return (
                    <div key={s.id} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                      borderRadius: 9, fontSize: 13,
                      border: `1px solid ${sel ? "var(--series-1)" : "var(--axis)"}`,
                      background: sel ? "color-mix(in srgb, var(--series-1) 8%, transparent)" : "var(--surface-1)",
                    }}>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="checkbox" checked={sel} onChange={() => toggle(s.id)} />
                        {s.name}
                      </label>
                      {sel && (
                        <select value={owned[s.id]} onChange={(e) => setLevel(s.id, +e.target.value)} style={{ fontSize: 12.5 }}>
                          {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>Lv.{v}</option>)}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={() => setStep("result")}>
          진단 결과 보기
        </button>
      </div>
    );
  }

  // 결과
  const { role, met, gaps, bridges, readiness } = result;
  return (
    <div style={{ maxWidth: 720, margin: "32px auto" }}>
      <div className="card" style={{ textAlign: "center" }}>
        <p className="hint" style={{ margin: 0 }}>{role.name} 준비도</p>
        <div className="num" style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
          {readiness}<span style={{ fontSize: 22, fontWeight: 600 }}>%</span>
        </div>
        <div style={{ height: 8, background: "var(--grid)", borderRadius: 99, margin: "8px auto 4px", maxWidth: 380 }}>
          <div style={{ height: 8, width: `${readiness}%`, background: readiness >= 70 ? "var(--series-3)" : "var(--series-1)", borderRadius: 99 }} />
        </div>
        <p className="hint">요구 숙련도 합 대비 보유 숙련도 기준 (계산식 공개: min(보유,요구)의 합 ÷ 요구의 합)</p>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <strong>보유 수준(파랑) vs 직무 요구 수준(주황 점선)</strong>
        <RadarChart
          max={5}
          items={role.requires.map(([sk, need]) => ({
            label: skillName(sk),
            value: owned[sk] ?? 0,
            target: need,
          }))}
        />
        <p className="hint">점선 안쪽이 비어 있는 축이 성장 여지가 있는 스킬입니다.</p>
      </div>

      {met.length > 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          <strong>이미 충족한 스킬</strong>
          <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "6px 0 0" }}>
            {met.map((m) => `${m.name} (Lv.${m.have}/${m.need})`).join(" · ")}
          </p>
        </div>
      )}

      <div className="card" style={{ marginTop: 14 }}>
        <strong>부족 스킬과 추천 교육 {gaps.length === 0 && "— 없음!"}</strong>
        {gaps.length > 0 && <p className="hint" style={{ margin: "4px 0 0" }}>우선순위 = 격차(요구−보유)가 큰 순서. 격차가 큰 스킬부터 채우는 것이 준비도를 가장 빨리 올립니다.</p>}
        {gaps.length === 0 ? (
          <p className="hint" style={{ marginTop: 6 }}>요구 스킬을 모두 충족했어요. 인접 직무 탐색을 권해요.</p>
        ) : (
          [...gaps].sort((a, b) => (b.need - b.have) - (a.need - a.have) || b.need - a.need).map((g, gi) => {
            const bridge = bridges.find((b) => b.skill === g.skill);
            return (
              <div key={g.skill} style={{ borderTop: "1px solid var(--grid)", marginTop: 10, paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                  <strong style={{ fontSize: 14.5 }}>
                    <span className="badge" style={{ color: gi === 0 ? "var(--series-2)" : "var(--ink-muted)", marginRight: 6, fontSize: 11 }}>
                      {gi + 1}순위
                    </span>
                    {g.name}
                  </strong>
                  <span className="hint">보유 Lv.{g.have} → 요구 Lv.{g.need}</span>
                </div>
                {g.course && (
                  <p style={{ fontSize: 13.5, margin: "4px 0 0", color: "var(--ink-2)" }}>
                    추천 교육: <strong>{g.course.name}</strong> ({g.course.hours}시간 · 가상 카탈로그)
                  </p>
                )}
                {bridge?.from.length > 0 && (
                  <p className="hint" style={{ margin: "3px 0 0" }}>
                    학습 경로: 보유하신 {bridge.from.join(", ")}이(가) 온톨로지에서 인접 스킬이라 진입 장벽이 낮아요.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <p className="hint" style={{ margin: 0 }}>
          이 진단은 시연용 가상 카탈로그 기반의 참고 정보이며, 실제 인사평가·배치 결정에
          사용되지 않습니다. 이런 시스템이 회사에 도입된다면 어떻게 느끼실지 —{" "}
          <Link href="/survey" style={{ color: "var(--series-1)" }}>수용성 진단</Link>에 참여해 보세요.
        </p>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => { setStep("role"); setOwned({}); }}>
          처음부터 다시
        </button>
      </div>
    </div>
  );
}
