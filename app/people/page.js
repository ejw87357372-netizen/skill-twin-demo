import Link from "next/link";
import { EMPLOYEES, TEAMS, skillName } from "@/lib/data";

export const metadata = { title: "인재 프로필 — SkillTwin" };

export default function People() {
  return (
    <>
      <h1 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>인재 프로필</h1>
      <p className="hint">직원을 클릭하면 스킬 프로필과 퇴사 영향 시뮬레이션을 볼 수 있습니다. (전원 가상 인물)</p>
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
