import { orgGapReport } from "@/lib/gap";
import { HBarChart } from "@/components/charts";
import Link from "next/link";

export const metadata = { title: "스킬 갭 분석 — SkillWeave" };

export default function Gap() {
  const { byRole, courseDemand, teamReadiness, total } = orgGapReport();

  return (
    <>
      <section className="hero" style={{ paddingBottom: 10 }}>
        <span className="tag">HR 관점 · 가상 데이터 시연</span>
        <h1>스킬 갭 분석 — 조직은 무엇을 준비해야 하는가</h1>
        <p>
          직원들의 스킬 진단이 쌓이면, 인사팀은 개인이 아니라 <strong>조직 단위의 패턴</strong>을
          봅니다 — 어떤 직무로 성장할 인재가 얼마나 준비되어 있고, 어떤 교육을 먼저 열어야
          하는지. 아래는 가상 직원 {total}명의 데이터로 계산한 집계 화면입니다.
        </p>
      </section>

      <div className="card" style={{ padding: "12px 16px" }}>
        <strong style={{ fontSize: 14 }}>프라이버시 설계 원칙 (이 화면이 보여주지 않는 것)</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8, fontSize: 13, color: "var(--ink-2)" }}>
          <span>✓ 개인별 진단 결과는 본인 외 누구에게도 제공되지 않음 — HR은 <strong>익명 집계만</strong> 열람</span>
          <span>✓ 집계는 <strong>동의한 응답만</strong> 포함하는 것을 전제로 설계</span>
          <span>✓ 실서비스 기준: 5인 미만 소집단 수치는 재식별 위험으로 미표시(k-익명성)</span>
        </div>
      </div>

      <h2 className="section-title">직무별 인재 준비 현황 — 내부에서 키울 수 있는가</h2>
      <div className="card">
        <table className="data" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>희망 직무(가상 카탈로그)</th>
              <th style={{ textAlign: "right" }}>준비됨 (70%+)</th>
              <th style={{ textAlign: "right" }}>근접 (40~69%)</th>
              <th>시사점</th>
            </tr>
          </thead>
          <tbody>
            {byRole.map(({ role, ready, near }) => (
              <tr key={role.id}>
                <td style={{ whiteSpace: "nowrap" }}>{role.name}</td>
                <td className="num" style={{ textAlign: "right", fontWeight: 700, color: ready > 0 ? "var(--good-text)" : "var(--series-2)" }}>{ready}명</td>
                <td className="num" style={{ textAlign: "right" }}>{near}명</td>
                <td style={{ fontSize: 13, color: "var(--ink-2)" }}>
                  {ready === 0 && near === 0 ? "내부 육성 어려움 — 채용 검토"
                    : ready === 0 ? "교육 투자 시 내부 전환 가능"
                    : "내부 충원 여력 있음"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginTop: 8 }}>
          준비도는 스킬 진단과 동일한 공개 계산식(min(보유,요구)의 합 ÷ 요구의 합)으로 산출.
          퇴사 리스크가 높은 스킬은 <Link href="/dashboard" style={{ color: "var(--series-1)" }}>조직 대시보드</Link>의
          단일 실패점 알림과 함께 보세요.
        </p>
      </div>

      <h2 className="section-title">교육 수요 Top 10 — 어떤 교육을 먼저 열어야 하나</h2>
      <div className="card">
        <HBarChart items={courseDemand} unit="명" labelW={215} />
        <p className="hint">
          각 직원의 최적합 직무 기준 부족 스킬을 집계한 것. 수요가 몰리는 교육부터 개설하면
          같은 예산으로 조직 준비도를 가장 빨리 올릴 수 있습니다.
        </p>
      </div>

      <h2 className="section-title">팀별 평균 성장 준비도</h2>
      <div className="card">
        <HBarChart items={teamReadiness} unit="%" max={100} />
        <p className="hint">
          팀 내 직원들이 자기 도메인의 성장 직무에 얼마나 근접해 있는지의 평균.
          낮은 팀은 교육 예산 배분과 리스킬링 우선 대상 후보입니다.
        </p>
      </div>
    </>
  );
}
