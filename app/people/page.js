import Link from "next/link";
import { EMPLOYEES, TEAMS, skillName } from "@/lib/data";

export const metadata = { title: "인재 프로필 · Weave" };

export default function People() {
  return (
    <>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>인재 프로필</h1>
      <p className="hint">직원을 클릭하면 스킬 프로필과 퇴사 영향 시뮬레이션을 볼 수 있습니다. (전원 가상 인물)</p>
      <p className="hint" style={{ marginTop: 4 }}>
        전원 가상 인물입니다. 실제 시스템에서 개인 프로필은 본인과 권한 있는 담당자만 열람할 수 있어야 하며,
        본 화면의 어떤 정보도 인사평가·배치 결정의 근거가 아닙니다.
      </p>
      {TEAMS.map((team) => (
        <div key={team}>
          <h2 className="section-title">{team}</h2>
          <div className="grid grid-4">
            {EMPLOYEES.filter((e) => e.team === team).map((e) => (
              <Link key={e.id} href={`/people/${e.id}`} className="card" style={{ padding: 14 }}>
                <strong>{e.name}</strong>{" "}
                <span className="hint">{e.role} · {e.years}년차</span>
                <div className="hint" style={{ marginTop: 6 }}>
                  {e.skills.map((s) => skillName(s.skill)).join(" · ")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
