"use client";
// ─────────────────────────────────────────────────────────────
// Talent Compass AI — 관리자용 통합 데모 (단일 클라이언트 컴포넌트)
// 백엔드·외부 API 없음. 모든 추천은 규칙 기반 가상 데이터.
// ─────────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import {
  EMPLOYEES, PROJECT, SEARCH_RESULTS, TEAM_INIT, ALTERNATES,
  GAPS, PATHS, RETENTION, DEMO_STEPS, empById,
} from "@/lib/tcData";

// 화면 관점 구분: admin = 인사담당자, emp = 직원 본인, all = 전 구성원 공통
const MENU_GROUPS = [
  ["관리자 화면", "admin", [
    ["dash", "통합 대시보드"], ["search", "AI 인재 탐색"],
    ["matching", "프로젝트 매칭"], ["retention", "인재 유지관리"],
  ]],
  ["직원 화면", "emp", [
    ["profile", "내 역량 프로필"], ["training", "역량 진단·교육 추천"], ["career", "경력경로"],
  ]],
  ["공통", "all", [
    ["fairness", "공정성·신뢰센터"], ["about", "시스템 안내"],
  ]],
];
const AUD = { dash: "admin", search: "admin", matching: "admin", retention: "admin",
  profile: "emp", training: "emp", career: "emp", fairness: "all", about: "all" };
const AUD_LABEL = {
  admin: "지금 보는 화면: 관리자(인사담당자) 관점",
  emp: "지금 보는 화면: 직원 본인 관점",
  all: "지금 보는 화면: 전 구성원 공통",
};

const CHECKS = [
  "직원에게 추천 사실을 안내했는가?",
  "직원의 프로젝트 참여의사를 확인했는가?",
  "추천 근거를 담당자가 검토했는가?",
  "특정 직원에게 기회가 편중되지 않았는가?",
  "AI가 제시한 후보 외의 인재도 검토했는가?",
];

export default function System() {
  const [screen, setScreen] = useState("dash");
  const [toasts, setToasts] = useState([]);
  const toast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  // 인재 탐색
  const [searched, setSearched] = useState(false);
  const [why, setWhy] = useState(null);            // 추천 근거 모달 대상
  const [fDept, setFDept] = useState("전체");
  const [fSkill, setFSkill] = useState("전체");

  // 프로젝트 매칭
  const [team, setTeam] = useState(TEAM_INIT);
  const [confirmed, setConfirmed] = useState({});  // id -> 참여의사 확인
  const [excludeTarget, setExcludeTarget] = useState(null);
  const [excludeReason, setExcludeReason] = useState("");
  const [checks, setChecks] = useState(CHECKS.map(() => false));
  const [placed, setPlaced] = useState(false);

  // 역량 프로필 (김서연)
  const me = empById("E01");
  const [wantRole, setWantRole] = useState(me.wantRole);
  const [recvRec, setRecvRec] = useState(true);
  const [aiExcluded, setAiExcluded] = useState({}); // 항목별 AI 분석 제외
  const [requests, setRequests] = useState([]);     // 수정 요청·이의제기 기록

  // 교육 추천 / 경력경로
  const [courseState, setCourseState] = useState({});
  const [pathSel, setPathSel] = useState(null);

  // 시연 시나리오
  const [demoOn, setDemoOn] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoModal, setDemoModal] = useState(false);

  const resetAll = () => {
    setScreen("dash"); setSearched(false); setWhy(null); setFDept("전체"); setFSkill("전체");
    setTeam(TEAM_INIT); setConfirmed({}); setChecks(CHECKS.map(() => false)); setPlaced(false);
    setWantRole(me.wantRole); setRecvRec(true); setAiExcluded({}); setRequests([]);
    setCourseState({}); setPathSel(null);
    setDemoOn(false); setDemoStep(0);
    toast("시연 데이터를 초기 상태로 되돌렸습니다.");
  };

  const gotoDemo = (i) => {
    const idx = Math.max(0, Math.min(DEMO_STEPS.length - 1, i));
    setDemoStep(idx); setScreen(DEMO_STEPS[idx][1]);
  };

  const results = useMemo(() => SEARCH_RESULTS.filter((r) => {
    const e = empById(r.id);
    if (fDept !== "전체" && e.dept !== fDept) return false;
    if (fSkill !== "전체" && !e.skills.some(([s]) => s === fSkill)) return false;
    return true;
  }), [fDept, fSkill]);

  return (
    <div className="tc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── 헤더 ── */}
      <header className="tc-head">
        <div>
          <div className="tc-title">Talent Compass AI <span className="tc-demo-tag">데모 · 가상 데이터</span></div>
          <div className="tc-sub">사람의 가능성과 조직의 기회를 연결하는 AI 인재관리 시스템</div>
        </div>
        <div className="tc-head-actions">
          {demoOn && (
            <div className="tc-step-pill">
              <b>{demoStep + 1}/{DEMO_STEPS.length}</b> {DEMO_STEPS[demoStep][0]}
              <button onClick={() => gotoDemo(demoStep - 1)} disabled={demoStep === 0}>이전</button>
              <button onClick={() => demoStep === DEMO_STEPS.length - 1 ? (setDemoOn(false), toast("시연 시나리오를 마쳤습니다.")) : gotoDemo(demoStep + 1)}>
                {demoStep === DEMO_STEPS.length - 1 ? "종료" : "다음"}
              </button>
            </div>
          )}
          {!demoOn && <button className="tc-btn primary" onClick={() => setDemoModal(true)}>시연 시작</button>}
          <button className="tc-btn ghost" onClick={resetAll}>초기화</button>
        </div>
      </header>

      <div className="tc-body">
        {/* ── 사이드바 ── */}
        <nav className="tc-side">
          {(() => { let n = 0; return MENU_GROUPS.map(([gLabel, gAud, items]) => (
            <div key={gLabel} className="tc-side-group">
              <div className={`tc-side-label ${gAud}`}>{gLabel}</div>
              {items.map(([k, label]) => { n += 1; return (
                <button key={k} className={screen === k ? "on" : ""} onClick={() => setScreen(k)}>
                  <span className="no">{String(n).padStart(2, "0")}</span>{label}
                </button>
              ); })}
            </div>
          )); })()}
          <div className="tc-side-note">
            본 데모의 모든 인물·수치는 가상이며, 추천은 규칙 기반으로 생성된 예시입니다. 실제 AI를 호출하지 않습니다.
          </div>
        </nav>

        {/* ── 콘텐츠 ── */}
        <main className="tc-main">
          <div className={`tc-aud ${AUD[screen]}`}>{AUD_LABEL[AUD[screen]]}</div>
          {screen === "dash" && <Dash />}
          {screen === "search" && (
            <Search searched={searched} setSearched={setSearched} results={results}
                    fDept={fDept} setFDept={setFDept} fSkill={fSkill} setFSkill={setFSkill}
                    openWhy={setWhy} toast={toast} />
          )}
          {screen === "matching" && (
            <Matching team={team} setTeam={setTeam} confirmed={confirmed} setConfirmed={setConfirmed}
                      setExcludeTarget={setExcludeTarget} checks={checks} setChecks={setChecks}
                      placed={placed} setPlaced={setPlaced} toast={toast} />
          )}
          {screen === "profile" && (
            <Profile me={me} wantRole={wantRole} setWantRole={setWantRole}
                     recvRec={recvRec} setRecvRec={setRecvRec}
                     aiExcluded={aiExcluded} setAiExcluded={setAiExcluded}
                     requests={requests} setRequests={setRequests} toast={toast} />
          )}
          {screen === "training" && <Training courseState={courseState} setCourseState={setCourseState} toast={toast} />}
          {screen === "career" && <Career pathSel={pathSel} setPathSel={setPathSel} toast={toast} />}
          {screen === "retention" && <Retention />}
          {screen === "fairness" && <Fairness toast={toast} />}
          {screen === "about" && <About />}
        </main>
      </div>

      {/* ── 추천 근거 모달 ── */}
      {why && (
        <Modal onClose={() => setWhy(null)} title={`추천 근거 · ${empById(why.id).name}`}>
          <WhyBody r={why} />
        </Modal>
      )}

      {/* ── 제외 사유 모달 ── */}
      {excludeTarget && (
        <Modal onClose={() => setExcludeTarget(null)} title={`후보 제외 · ${empById(excludeTarget.id).name} (${excludeTarget.slot})`}>
          <p className="tc-p">제외 사유를 남기면 공정성 센터의 추천 이력에 기록됩니다.</p>
          <textarea className="tc-input" rows={3} value={excludeReason}
                    onChange={(e) => setExcludeReason(e.target.value)}
                    placeholder="예: 해당 기간 타 프로젝트 투입 확정" />
          <div className="tc-row-end">
            <button className="tc-btn ghost" onClick={() => setExcludeTarget(null)}>취소</button>
            <button className="tc-btn primary" disabled={!excludeReason.trim()} onClick={() => {
              const alt = ALTERNATES[excludeTarget.slot];
              setTeam((t) => t.map((m) => m === excludeTarget
                ? { ...m, id: alt, why: "대체 후보(규칙 기반 재추천)", gap: "요구역량 재검토 필요", replaced: true }
                : m));
              toast(`${empById(excludeTarget.id).name} 제외: 사유가 기록되고 대체 후보를 추천했습니다.`);
              setExcludeTarget(null); setExcludeReason("");
            }}>제외하고 다른 후보 추천</button>
          </div>
        </Modal>
      )}

      {/* ── 시연 안내 모달 ── */}
      {demoModal && (
        <Modal onClose={() => setDemoModal(false)} title="핵심 시연 시나리오 (8단계)">
          <ol className="tc-ol">
            {DEMO_STEPS.map(([label], i) => <li key={i}>{label}</li>)}
          </ol>
          <p className="tc-p muted">상단의 이전·다음 버튼으로 각 단계에 해당하는 화면으로 이동합니다.</p>
          <div className="tc-row-end">
            <button className="tc-btn primary" onClick={() => { setDemoModal(false); setDemoOn(true); gotoDemo(0); }}>
              1단계부터 시작
            </button>
          </div>
        </Modal>
      )}

      {/* ── 토스트 ── */}
      <div className="tc-toasts">
        {toasts.map((t) => <div key={t.id} className="tc-toast">{t.msg}</div>)}
      </div>
    </div>
  );
}

/* ═══════════ 화면 1. 통합 대시보드 ═══════════ */
function Dash() {
  const kpi = [
    ["248", "전체 직원"], ["37", "프로젝트 투입 가능"], ["64", "핵심역량 보유 인재"],
    ["82%", "역량정보 업데이트율"], ["71%", "교육 추천 수락률"], ["156", "경력경로 설정 직원"],
    ["12", "추가 검토 필요(이탈위험)", "warn"],
  ];
  const dept = [["플랫폼·디지털서비스", 58], ["영업·마케팅", 38], ["경영지원(인사·재무)", 30], ["데이터·AI", 34], ["인프라·정보보안", 27], ["디자인·서비스기획", 25], ["품질·고객지원", 21], ["기획·PMO", 15]];
  const skills = [["Java·Spring", 58], ["데이터 분석", 41], ["프로젝트 관리", 39], ["클라우드·인프라", 34], ["AI·머신러닝", 24], ["디자인·UX", 19], ["정보보안", 15]];
  const demands = [["차세대 데이터 플랫폼", "6명", "9월"], ["AI 민원 안내 고도화", "4명", "10월"], ["레거시 전환 2차", "8명", "11월"]];
  const recents = [
    ["프로젝트 매칭", "차세대 데이터 플랫폼 후보 6명 추천", "담당자 검토 중"],
    ["교육 추천", "Python 데이터 분석 12명 추천", "수락 9명"],
    ["경력경로", "AI 서비스 개발 경로 8명 안내", "설정 5명"],
  ];
  return (
    <>
      <Notice>AI 추천은 인사 결정을 지원하기 위한 참고정보이며, 최종 결정은 담당자의 검토와 직원의 의사 확인을 거쳐 이루어집니다.</Notice>
      <div className="tc-kpis">
        {kpi.map(([v, l, w]) => (
          <div key={l} className={`tc-kpi${w ? " warn" : ""}`}><b>{v}</b><span>{l}</span></div>
        ))}
      </div>
      <div className="tc-grid2">
        <Card title="부서별 인원 현황">
          {dept.map(([n, v]) => <Bar key={n} label={n} v={v} max={70} suffix="명" />)}
        </Card>
        <Card title="주요 기술역량 분포">
          {skills.map(([n, v]) => <Bar key={n} label={n} v={v} max={80} suffix="명" tone="mint" />)}
        </Card>
        <Card title="현재 프로젝트 인력 수요">
          <table className="tc-table"><tbody>
            {demands.map(([n, c, m]) => <tr key={n}><td>{n}</td><td className="num">{c}</td><td className="muted">{m} 투입</td></tr>)}
          </tbody></table>
        </Card>
        <Card title="최근 AI 추천 현황">
          <table className="tc-table"><tbody>
            {recents.map(([t, d, s]) => <tr key={d}><td className="muted">{t}</td><td>{d}</td><td><span className="tc-badge">{s}</span></td></tr>)}
          </tbody></table>
        </Card>
        <Card title="직원 정보 업데이트 요청">
          <p className="tc-p">역량정보가 90일 이상 갱신되지 않은 직원 <b>45명</b>에게 업데이트 요청을 발송했습니다. 완료 31명 · 대기 14명.</p>
          <Bar label="업데이트 완료" v={31} max={45} suffix="명" tone="mint" />
        </Card>
        <Card title="개인정보·AI 분석 동의 현황">
          <Bar label="개인정보 활용 동의" v={97} max={100} suffix="%" />
          <Bar label="AI 분석 동의" v={93} max={100} suffix="%" />
          <p className="tc-p muted">동의하지 않은 직원은 AI 추천 대상에서 제외되며, 어떠한 불이익도 없습니다.</p>
        </Card>
      </div>
    </>
  );
}

/* ═══════════ 화면 2. AI 인재 탐색 ═══════════ */
function Search({ searched, setSearched, results, fDept, setFDept, fSkill, setFSkill, openWhy, toast }) {
  const [q, setQ] = useState("공공데이터 프로젝트 경험이 있고 Java·Spring Boot를 사용할 수 있으며, 프로젝트 관리 경험이 있는 인재를 찾아줘.");
  return (
    <>
      <Card title="자연어 인재 검색">
        <div className="tc-searchrow">
          <textarea className="tc-input" rows={2} value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="tc-btn primary" onClick={() => { setSearched(true); toast("규칙 기반 매칭으로 4명을 찾았습니다."); }}>검색</button>
        </div>
        <div className="tc-filters">
          <label>부서
            <select value={fDept} onChange={(e) => setFDept(e.target.value)}>
              {["전체", "경영기획실", "인사팀", "재무회계팀", "영업본부", "마케팅팀", "디자인팀", "서비스기획팀", "디지털서비스팀", "플랫폼개발팀", "데이터팀", "AI연구팀", "인프라팀", "정보보안팀", "품질관리팀", "PMO", "고객지원팀"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label>보유 기술
            <select value={fSkill} onChange={(e) => setFSkill(e.target.value)}>
              {["전체", "Java", "Spring Boot", "Python", "Oracle", "데이터 모델링", "머신러닝", "AWS", "Kubernetes", "React", "Figma", "UX 리서치", "테스트 자동화", "프로젝트 관리", "HR 데이터 분석", "B2B 영업", "콘텐츠 기획", "광고 운영"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <span className="muted tc-p" style={{ margin: 0 }}>그 외 필터: 숙련도 · 자격증 · 희망 직무 · 투입 가능 시점 · 경력연수</span>
        </div>
      </Card>

      {searched && (
        <>
          <Notice>적합도는 직원의 우열을 평가하는 점수가 아니라, 현재 프로젝트 요구조건과 등록된 역량정보의 일치 정도입니다.</Notice>
          <div className="tc-cards">
            {results.map((r) => {
              const e = empById(r.id);
              return (
                <div key={r.id} className="tc-person">
                  <div className="tc-person-top">
                    <div>
                      <b>{e.name}</b> <span className="muted">{e.role} · {e.dept} · {e.years}년</span>
                    </div>
                    <div className="tc-fit">{r.fit}<em>%</em></div>
                  </div>
                  <dl className="tc-dl">
                    <div><dt>주요 기술</dt><dd>{e.skills.map(([s]) => s).slice(0, 4).join(", ")}</dd></div>
                    <div><dt>프로젝트</dt><dd>{e.projects[0]}</dd></div>
                    <div><dt>희망 경력</dt><dd>{e.wantRole}{r.wantMatch && <span className="tc-badge mint">희망 일치</span>}</dd></div>
                    <div><dt>투입 가능</dt><dd>{e.available}</dd></div>
                    <div><dt>정보 최신성</dt><dd>{e.updated} 갱신</dd></div>
                    <div><dt>AI 분석 동의</dt><dd>{e.aiConsent ? "동의함" : "미동의"}</dd></div>
                  </dl>
                  <p className="tc-p">{r.reason}</p>
                  <button className="tc-btn ghost" onClick={() => openWhy(r)}>추천 근거 보기</button>
                </div>
              );
            })}
            {!results.length && <p className="tc-p muted">필터 조건에 맞는 추천 결과가 없습니다.</p>}
          </div>
        </>
      )}
      {!searched && <p className="tc-p muted">검색 버튼을 누르면 규칙 기반 매칭 결과(가상 직원 4명)가 표시됩니다.</p>}
    </>
  );
}

function WhyBody({ r }) {
  const e = empById(r.id);
  return (
    <>
      <dl className="tc-why">
        <dt>요구역량과 일치</dt><dd>{r.matched.join(", ") || "없음"}</dd>
        <dt>부족한 역량</dt><dd>{r.missing.join(", ") || "없음"}</dd>
        <dt>유사 프로젝트 경험</dt><dd>{r.similar.join(", ")}</dd>
        <dt>희망 직무 일치</dt><dd>{r.wantMatch ? `일치 (본인 희망: ${e.wantRole})` : "부분 일치"}</dd>
        <dt>데이터 기준일</dt><dd>{e.updated}</dd>
        <dt>AI가 사용하지 않은 정보</dt>
        <dd>성별, 연령, 출신지역, 출신학교, 가족관계 등 직무와 직접 관련 없는 정보는 추천에 사용하지 않았습니다.</dd>
        <dt>관리자 추가 확인 사항</dt>
        <dd>현재 업무 부하, 본인 참여 의사, 부족 역량의 교육 보완 계획</dd>
      </dl>
      <p className="tc-p muted">본 근거는 규칙 기반으로 생성된 데모용 예시입니다.</p>
    </>
  );
}

/* ═══════════ 화면 3. 프로젝트 매칭 ═══════════ */
function Matching({ team, setTeam, confirmed, setConfirmed, setExcludeTarget, checks, setChecks, placed, setPlaced, toast }) {
  const allChecked = checks.every(Boolean);
  return (
    <>
      <Card title={`프로젝트: ${PROJECT.name}`}>
        <dl className="tc-dl wide">
          <div><dt>기간</dt><dd>{PROJECT.period}</dd></div>
          <div><dt>필요 인원</dt><dd>{PROJECT.headcount}명</dd></div>
          <div><dt>요구역량</dt><dd>{PROJECT.required.join(", ")}</dd></div>
          <div><dt>우대사항</dt><dd>{PROJECT.preferred.join(", ")}</dd></div>
        </dl>
      </Card>

      <Card title="AI 추천 팀 구성안 (규칙 기반 가상 추천)">
        <table className="tc-table lines">
          <thead><tr><th>역할</th><th>후보</th><th>추천 이유</th><th>보완 필요</th><th>참여의사</th><th></th></tr></thead>
          <tbody>
            {team.map((m, i) => {
              const e = empById(m.id);
              return (
                <tr key={i} className={m.replaced ? "alt" : ""}>
                  <td className="muted">{m.slot}</td>
                  <td><b>{e.name}</b><div className="muted small">{e.dept} · {e.years}년</div></td>
                  <td>{m.why}</td>
                  <td>{m.gap}</td>
                  <td>
                    {confirmed[m.id]
                      ? <span className="tc-badge mint">확인됨</span>
                      : <button className="tc-btn tiny" onClick={() => { setConfirmed((c) => ({ ...c, [m.id]: true })); toast(`${e.name}님에게 참여의사 확인 요청을 보냈습니다. (데모: 즉시 확인됨)`); }}>의사 확인</button>}
                  </td>
                  <td><button className="tc-btn tiny ghost" onClick={() => setExcludeTarget(m)}>제외</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="tc-p muted">후보 제외 시 사유를 기록해야 하며, 규칙 기반으로 대체 후보가 추천됩니다.</p>
      </Card>

      <Card title="배치 확정 전 공정성 점검" tone={placed ? "mint" : allChecked ? "" : "warn"}>
        {CHECKS.map((c, i) => (
          <label key={i} className="tc-check">
            <input type="checkbox" checked={checks[i]}
                   onChange={() => setChecks((arr) => arr.map((v, j) => j === i ? !v : v))} /> {c}
          </label>
        ))}
        <div className="tc-row-end">
          {placed
            ? <span className="tc-badge mint big">최종 검토 완료: 배치안이 인사 담당자에게 전달되었습니다</span>
            : <button className="tc-btn primary" disabled={!allChecked}
                      onClick={() => { setPlaced(true); toast("공정성 점검을 통과했습니다. 최종 결정은 담당자 검토로 확정됩니다."); }}>
                관리자 최종검토 요청
              </button>}
        </div>
        {!allChecked && !placed && <p className="tc-p warn-text">모든 점검 항목을 확인해야 최종 검토를 요청할 수 있습니다.</p>}
      </Card>
    </>
  );
}

/* ═══════════ 화면 4. 역량 진단(직원 프로필) ═══════════ */
function Profile({ me, wantRole, setWantRole, recvRec, setRecvRec, aiExcluded, setAiExcluded, requests, setRequests, toast }) {
  const inferred = [["코드 리뷰 역량", "PR 이력 기반 추론"], ["공공 도메인 이해", "프로젝트 이력 기반 추론"]];
  const managerOk = ["Java", "Spring Boot"];
  const req = (type, target) => {
    setRequests((r) => [...r, { type, target, at: "방금 전" }]);
    toast(`'${target}'에 대한 ${type}가 접수되었습니다. 처리 결과는 알림으로 안내됩니다.`);
  };
  return (
    <>
      <Notice>AI가 추론한 정보와 내가 직접 입력한 정보를 구분해서 보여주고, 잘못된 정보는 수정 요청·이의제기·분석 제외를 할 수 있습니다.</Notice>
      <div className="tc-grid2">
        <Card title="기본 정보">
          <dl className="tc-dl wide">
            <div><dt>이름</dt><dd>데모 직원 계정 (가상)</dd></div>
            <div><dt>직무</dt><dd>{me.role} · {me.years}년</dd></div>
            <div><dt>소속</dt><dd>{me.dept}</dd></div>
            <div><dt>희망 직무</dt>
              <dd>
                <select className="tc-input slim" value={wantRole} onChange={(e) => { setWantRole(e.target.value); toast("희망 직무가 변경되었습니다. 추천에 즉시 반영됩니다."); }}>
                  {["데이터·AI 서비스 개발자", "백엔드 아키텍트", "테크리드", "데이터 엔지니어"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </dd></div>
            <div><dt>희망 프로젝트</dt><dd>{me.wantProject}</dd></div>
            <div><dt>자격증</dt><dd>{me.certs.join(", ")}</dd></div>
            <div><dt>교육 이력</dt><dd>{me.edu.join(", ")}</dd></div>
          </dl>
          <label className="tc-check">
            <input type="checkbox" checked={recvRec} onChange={() => { setRecvRec(!recvRec); toast(recvRec ? "프로젝트 추천 수신을 중단했습니다." : "프로젝트 추천을 다시 수신합니다."); }} />
            프로젝트 추천 수신
          </label>
          <p className="tc-p muted">데이터 활용 동의 범위: 역량·경력·교육 이력에 한함 (평가·근태 정보 미포함) · 보유기간 3년</p>
        </Card>

        <Card title="보유 기술과 숙련도">
          {me.skills.map(([s, lv]) => (
            <div key={s} className="tc-skillrow">
              <Bar label={s} v={lv} max={5} suffix="/5" />
              <div className="tc-skill-actions">
                <span className={`tc-badge ${managerOk.includes(s) ? "mint" : ""}`}>
                  {managerOk.includes(s) ? "관리자 확인" : "직접 등록"}
                </span>
                <button className="tc-btn tiny ghost" onClick={() => req("수정 요청", s)}>수정 요청</button>
                <label className="tc-check tiny">
                  <input type="checkbox" checked={!!aiExcluded[s]}
                         onChange={() => { setAiExcluded((x) => ({ ...x, [s]: !x[s] })); toast(`'${s}' 항목을 AI 분석에서 ${aiExcluded[s] ? "다시 포함" : "제외"}했습니다.`); }} />
                  분석 제외
                </label>
              </div>
            </div>
          ))}
        </Card>

        <Card title="AI가 추론한 역량 (본인 확인 필요)">
          {inferred.map(([s, src]) => (
            <div key={s} className="tc-skillrow">
              <div><b>{s}</b> <span className="muted small">{src}</span> <span className="tc-badge orange">AI 추론</span></div>
              <div className="tc-skill-actions">
                <button className="tc-btn tiny" onClick={() => toast(`'${s}' 추론에 동의했습니다. 프로필에 반영됩니다.`)}>동의</button>
                <button className="tc-btn tiny ghost" onClick={() => req("이의제기", s)}>이의 제기</button>
              </div>
            </div>
          ))}
          <p className="tc-p muted">AI 추론 역량은 본인이 동의하기 전까지 추천에 사용되지 않습니다.</p>
        </Card>

        <Card title="나의 요청 내역">
          {requests.length
            ? <table className="tc-table"><tbody>{requests.map((r, i) => <tr key={i}><td><span className="tc-badge">{r.type}</span></td><td>{r.target}</td><td className="muted">{r.at} · 처리 대기</td></tr>)}</tbody></table>
            : <p className="tc-p muted">아직 요청 내역이 없습니다. 수정 요청·이의제기는 공정성 센터의 처리율 지표에 집계됩니다.</p>}
        </Card>
      </div>
    </>
  );
}

/* ═══════════ 화면 5. 교육 추천 ═══════════ */
function Training({ courseState, setCourseState, toast }) {
  const set = (c, s, msg) => { setCourseState((x) => ({ ...x, [c]: s })); toast(msg); };
  return (
    <>
      <Card title="역량 격차 진단 · 목표 직무: AI·데이터 기반 서비스 개발자">
        <p className="tc-p"><b>현재 강점</b>: Java, Spring Boot, Oracle, 공공 프로젝트 경험, 데이터 모델링</p>
        {GAPS.map((g) => (
          <div key={g.skill} className="tc-gaprow">
            <div className="tc-gaphead">
              <b>{g.skill}</b>
              <span className="muted">현재 {g.cur} → 목표 {g.target} (차이 {g.target - g.cur})</span>
            </div>
            <div className="tc-gapbar">
              <i style={{ width: `${(g.cur / 5) * 100}%` }} />
              <em style={{ width: `${((g.target - g.cur) / 5) * 100}%`, left: `${(g.cur / 5) * 100}%` }} />
            </div>
            <p className="tc-p">{g.why} · 추천 교육 <b>{g.course}</b> (약 {g.hours}시간) · 완료 시 연결 가능: {g.link}</p>
            <div className="tc-row">
              {courseState[g.course] === "enrolled"
                ? <span className="tc-badge mint">수강 신청 완료</span>
                : courseState[g.course] === "dismissed"
                  ? <span className="tc-badge">추천 숨김</span>
                  : <>
                      <button className="tc-btn tiny" onClick={() => set(g.course, "enrolled", `'${g.course}' 수강 신청이 접수되었습니다.`)}>교육 수강 신청</button>
                      <button className="tc-btn tiny ghost" onClick={() => set(g.course, "dismissed", "이 추천을 숨겼습니다. 사유는 추천 개선에 사용됩니다.")}>관심 없음</button>
                      <button className="tc-btn tiny ghost" onClick={() => toast("유사 교육 2건을 더 찾았습니다: AI 서비스 설계 프로젝트, 데이터 시각화 실무")}>다른 교육 보기</button>
                    </>}
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ═══════════ 화면 6. 경력경로 ═══════════ */
function Career({ pathSel, setPathSel, toast }) {
  return (
    <>
      <Notice>경력경로는 AI가 확정하는 것이 아니라 직원이 참고하고 선택하는 추천정보입니다. 선택·수정 권한은 본인에게 있습니다.</Notice>
      <div className="tc-cards three">
        {PATHS.map((p) => (
          <div key={p.key} className={`tc-person path${pathSel === p.key ? " sel" : ""}`}>
            <div className="tc-person-top">
              <b>경로 {p.key}</b>
              <div className="tc-fit small">{p.match}<em>%</em></div>
            </div>
            <div className="tc-steps">
              {p.steps.map((s, i) => (
                <span key={s}>{i > 0 && <i>→</i>}<b className={i === 0 ? "muted" : ""}>{s}</b></span>
              ))}
            </div>
            <dl className="tc-dl">
              <div><dt>필요 역량</dt><dd>{p.needs.join(", ")}</dd></div>
              <div><dt>추천 교육</dt><dd>{p.courses.join(", ")}</dd></div>
              <div><dt>필요 프로젝트</dt><dd>{p.projects.join(", ")}</dd></div>
              <div><dt>예상 준비기간</dt><dd>{p.period}</dd></div>
            </dl>
            <button className={`tc-btn ${pathSel === p.key ? "" : "primary"}`}
                    onClick={() => { setPathSel(p.key); toast(`경로 ${p.key}를 나의 경력 목표로 설정했습니다. 언제든 변경할 수 있습니다.`); }}>
              {pathSel === p.key ? "선택됨 (변경 가능)" : "이 경로 선택"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════ 화면 7. 인재 유지관리 ═══════════ */
function Retention() {
  return (
    <>
      <Notice>본 정보는 직원에 대한 불이익이나 퇴사 가능성 판단에 사용되지 않으며, 성장기회와 경력지원을 제공하기 위한 참고정보입니다.</Notice>
      <Card title="성장지원 필요 신호">
        <p className="tc-p muted">확인 항목: 최근 프로젝트 기회 부족 · 희망 직무와 현재 업무 불일치 · 장기간 교육 참여 부재 · 보유역량 대비 낮은 역할 활용도 · 경력개발 면담 필요 · 본인이 제출한 성장 관련 의견</p>
        <table className="tc-table lines">
          <thead><tr><th>직원</th><th>확인된 신호</th><th>상태</th><th>지원 방안</th></tr></thead>
          <tbody>
            {RETENTION.map((r) => {
              const e = empById(r.id);
              return (
                <tr key={r.id}>
                  <td><b>{e.name}</b><div className="muted small">{e.role} · {e.dept}</div></td>
                  <td>{e.signals.join(" · ") || "없음"}</td>
                  <td><span className="tc-badge orange">{r.status}</span></td>
                  <td>{r.support}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="tc-p muted">직원을 위험점수로 줄 세우지 않고, 필요한 지원의 종류로만 분류합니다.</p>
      </Card>
    </>
  );
}

/* ═══════════ 화면 8. 공정성·신뢰센터 ═══════════ */
function Fairness({ toast }) {
  const metrics = [
    ["AI 추천 설명 제공률", 100], ["직원 정보 확인률", 82], ["이의제기 처리율", 94],
    ["관리자 최종검토율", 100], ["추천 데이터 최신성(90일 내)", 76], ["개인정보 활용 동의율", 97],
  ];
  return (
    <>
      <div className="tc-grid2">
        <Card title="신뢰 지표">
          {metrics.map(([n, v]) => <Bar key={n} label={n} v={v} max={100} suffix="%" tone={v < 80 ? "orange" : "mint"} />)}
          <p className="tc-p muted">프로젝트 추천 기회 분포: 상위 20% 직원에게 추천의 34%가 집중되어 있습니다. 아래 점검 결과를 참조하세요.</p>
        </Card>
        <Card title="추천 결과 편향 점검" tone="warn">
          <p className="tc-p"><span className="tc-badge orange big">전체 상태: 주의 필요</span></p>
          <ul className="tc-ul">
            <li>특정 부서(플랫폼개발팀)의 프로젝트 추천 기회 편중 가능성 발견</li>
            <li>일부 직원의 역량정보가 오래되어 추천 정확도 저하 가능</li>
            <li>교육 참여 이력이 많은 직원에게 추천이 집중될 가능성</li>
          </ul>
          <p className="tc-p"><b>개선조치</b>: 정보 업데이트 요청 발송, 추천 기준 재검토, 관리자 교차검토 시행</p>
        </Card>
        <Card title="AI 추천에 사용되는 데이터">
          <p className="tc-p">보유 기술·숙련도, 프로젝트 경험, 자격증, 교육 이력, 본인이 등록한 희망 직무·희망 프로젝트, 투입 가능 시점</p>
          <p className="tc-p"><b>사용하지 않는 민감정보</b>: 성별, 연령, 출신지역, 출신학교, 가족관계, 노조 가입 여부, 건강 정보, 평가·근태 기록</p>
          <p className="tc-p muted">추천 기준: 프로젝트 요구조건과 등록된 역량정보의 일치 정도(규칙 기반). 데이터 보유기간: 퇴직 후 3년, 이후 파기.</p>
        </Card>
        <Card title="직원의 권리">
          <div className="tc-row wrap">
            {["내 정보 열람 요청", "정보 수정 요청", "정보 삭제 요청", "AI 추천 이의제기"].map((b) => (
              <button key={b} className="tc-btn ghost" onClick={() => toast(`'${b}'가 접수되었습니다. 담당자가 7일 이내에 처리합니다.`)}>{b}</button>
            ))}
          </div>
          <p className="tc-p muted">모든 추천은 인간의 최종검토를 거치며, 이의제기 시 재검토 절차가 진행됩니다.</p>
        </Card>
      </div>
    </>
  );
}

/* ═══════════ 화면 10. 시스템 안내 ═══════════ */
function About() {
  const flow = [
    ["기존 문제", ["내부 인재정보의 분산", "인력배치의 경험 의존", "직원별 경력개발 지원의 한계", "핵심역량 활용 부족", "구성원의 AI 인사결정에 대한 우려"]],
    ["AI 지원", ["역량정보 통합", "사내 인재 탐색", "프로젝트 추천", "교육·경력경로 추천", "성장지원 필요 신호 확인"]],
    ["필수 도입조건", ["직원의 사전 동의", "설명 가능한 추천", "정보 열람·수정권", "공정성 점검", "개인정보 최소 활용", "직원의 선택권", "관리자의 최종검토", "이의제기·재검토 절차"]],
    ["기대효과", ["내부 인재 발견 가능성 향상", "프로젝트 배치 의사결정 지원", "개인 맞춤형 교육 제공 가능", "직원의 경력개발 지원", "조직의 역량 현황 파악", "인재 유지관리 지원 가능성"]],
  ];
  return (
    <>
      <Notice>연구(AI 기반 인재관리 시스템 구축 방향 연구: 기업 적용 사례와 도입 전 구성원 수용 요인 분석)의 결론을 사용자 경험으로 옮긴 데모입니다. AI는 의사결정을 지원할 뿐, 최종 결정은 사람이 검토합니다.</Notice>
      <div className="tc-flow">
        {flow.map(([t, items], i) => (
          <div key={t} className="tc-flowcol">
            <div className="tc-flowhead">{i + 1}. {t}</div>
            <ul className="tc-ul">{items.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════ 공용 컴포넌트 ═══════════ */
function Card({ title, tone, children }) {
  return (
    <section className={`tc-card${tone ? ` ${tone}` : ""}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function Notice({ children }) {
  return <div className="tc-notice">{children}</div>;
}
function Bar({ label, v, max, suffix = "", tone }) {
  return (
    <div className="tc-bar">
      <span className="l">{label}</span>
      <div className="t"><i className={tone || ""} style={{ width: `${(v / max) * 100}%` }} /></div>
      <span className="v">{v}{suffix}</span>
    </div>
  );
}
function Modal({ title, onClose, children }) {
  return (
    <div className="tc-overlay" onClick={onClose}>
      <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tc-modal-head"><b>{title}</b><button onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════ 스타일 ═══════════ */
const CSS = `
.tc { margin: 0 calc(50% - 50vw); background: var(--page); min-height: calc(100vh - 57px);
  font-size: 14px; }
.tc-head { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;
  padding: 16px 26px; background: var(--surface-1); border-bottom: 1px solid var(--border); }
.tc-title { font-size: 19px; font-weight: 800; letter-spacing: -0.5px; }
.tc-demo-tag { font-size: 11.5px; font-weight: 700; color: #b45f22; background: rgba(201,106,60,0.12);
  border-radius: 999px; padding: 3px 10px; vertical-align: 3px; margin-left: 6px; }
.tc-sub { font-size: 12.5px; color: var(--ink-muted); margin-top: 2px; }
.tc-head-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.tc-step-pill { display: flex; align-items: center; gap: 8px; font-size: 13px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 999px; padding: 6px 8px 6px 14px; }
.tc-step-pill b { color: var(--brand); }
.tc-step-pill button { border: 1px solid var(--axis); background: var(--surface-1); border-radius: 999px;
  padding: 4px 12px; font: inherit; font-size: 12.5px; cursor: pointer; }
.tc-step-pill button:disabled { opacity: 0.4; cursor: default; }

.tc-body { display: flex; align-items: stretch; }
.tc-side { width: 208px; flex: none; background: var(--surface-1); border-right: 1px solid var(--border);
  padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; }
.tc-side button { display: flex; gap: 9px; align-items: center; text-align: left; width: 100%;
  border: 0; background: none; font: inherit; font-size: 13.5px; color: var(--ink-2);
  padding: 9px 12px; border-radius: 9px; cursor: pointer; }
.tc-side button .no { font-size: 10.5px; font-weight: 700; color: var(--ink-muted); width: 18px; }
.tc-side button:hover { background: var(--surface-2); }
.tc-side button.on { background: color-mix(in srgb, var(--brand) 9%, var(--surface-1));
  color: var(--ink-1); font-weight: 700; }
.tc-side button.on .no { color: var(--brand); }
.tc-side-group { margin-bottom: 10px; }
.tc-side-label { font-size: 10.5px; font-weight: 800; letter-spacing: 0.6px; padding: 8px 12px 4px; }
.tc-side-label.admin { color: var(--brand); }
.tc-side-label.emp { color: #1d6a58; }
.tc-side-label.all { color: var(--ink-muted); }
.tc-side-note { margin-top: auto; font-size: 11.5px; color: var(--ink-muted); line-height: 1.5;
  padding: 12px; background: var(--surface-2); border-radius: 10px; }

.tc-aud { align-self: flex-start; font-size: 12.5px; font-weight: 800; letter-spacing: 0.2px;
  border-radius: 999px; padding: 6px 16px; }
.tc-aud.admin { background: var(--brand); color: #fff; }
.tc-aud.emp { background: #2e8b76; color: #fff; }
.tc-aud.all { background: var(--surface-2); color: var(--ink-2); border: 1px solid var(--border); }
.tc-main { flex: 1; min-width: 0; padding: 16px 26px 60px; display: flex; flex-direction: column; gap: 16px; }

.tc-notice { font-size: 13px; color: var(--ink-2); background: color-mix(in srgb, var(--brand) 7%, var(--surface-1));
  border: 1px solid color-mix(in srgb, var(--brand) 22%, transparent); border-radius: 12px; padding: 11px 16px; }

.tc-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.tc-kpi { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
.tc-kpi b { display: block; font-size: 24px; letter-spacing: -0.8px; }
.tc-kpi span { font-size: 12px; color: var(--ink-muted); }
.tc-kpi.warn { border-color: rgba(201,106,60,0.5); } .tc-kpi.warn b { color: #b45f22; }

.tc-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 980px) { .tc-grid2 { grid-template-columns: 1fr; } .tc-side { width: 170px; } }

.tc-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
.tc-card h3 { margin: 0 0 12px; font-size: 15px; letter-spacing: -0.3px; }
.tc-card.warn { border-color: rgba(201,106,60,0.45); }
.tc-card.mint { border-color: rgba(46,139,118,0.45); }

.tc-bar { display: grid; grid-template-columns: 150px 1fr 52px; gap: 10px; align-items: center; margin: 7px 0; }
.tc-bar .l { font-size: 12.5px; color: var(--ink-2); }
.tc-bar .t { height: 10px; background: var(--grid); border-radius: 99px; overflow: hidden; }
.tc-bar .t i { display: block; height: 100%; border-radius: 99px; background: var(--seq-550); }
.tc-bar .t i.mint { background: #2e8b76; } .tc-bar .t i.orange { background: #c96a3c; }
.tc-bar .v { font-size: 12.5px; font-variant-numeric: tabular-nums; color: var(--ink-2); text-align: right; }

.tc-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.tc-table td, .tc-table th { padding: 8px 8px; text-align: left; vertical-align: top; }
.tc-table.lines th { font-size: 12px; color: var(--ink-muted); border-bottom: 1px solid var(--axis); }
.tc-table.lines td { border-bottom: 1px solid var(--grid); }
.tc-table tr.alt td { background: color-mix(in srgb, var(--brand) 5%, transparent); }
.tc-table .small { font-size: 12px; }

.tc-badge { display: inline-block; font-size: 11.5px; font-weight: 700; border-radius: 999px;
  padding: 2px 9px; background: var(--surface-2); color: var(--ink-2); margin-left: 4px; }
.tc-badge.mint { background: rgba(46,139,118,0.13); color: #1d6a58; }
.tc-badge.orange { background: rgba(201,106,60,0.13); color: #b45f22; }
.tc-badge.big { font-size: 13px; padding: 6px 14px; }

.tc-btn { border: 0; border-radius: 9px; padding: 9px 16px; font: inherit; font-size: 13.5px;
  font-weight: 600; cursor: pointer; background: var(--surface-2); color: var(--ink-1); }
.tc-btn.primary { background: var(--brand); color: #fff; }
.tc-btn.ghost { background: transparent; border: 1px solid var(--axis); }
.tc-btn.tiny { padding: 5px 11px; font-size: 12.5px; }
.tc-btn:disabled { opacity: 0.45; cursor: default; }
.tc-btn:not(:disabled):hover { filter: brightness(1.05); }

.tc-p { font-size: 13.5px; line-height: 1.62; margin: 8px 0; color: var(--ink-1); }
.muted { color: var(--ink-muted); } .warn-text { color: #b45f22; font-size: 12.5px; }
.tc-row { display: flex; gap: 8px; align-items: center; } .tc-row.wrap { flex-wrap: wrap; }
.tc-row-end { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.tc-ol { margin: 6px 0; padding-left: 20px; font-size: 14px; line-height: 1.9; }
.tc-ul { margin: 6px 0; padding-left: 18px; font-size: 13.5px; line-height: 1.8; color: var(--ink-2); }

.tc-searchrow { display: flex; gap: 10px; align-items: stretch; }
.tc-searchrow .tc-btn { flex: none; align-self: center; }
.tc-input { width: 100%; font: inherit; font-size: 13.5px; border: 1px solid var(--axis);
  border-radius: 10px; padding: 10px 12px; background: var(--surface-1); color: var(--ink-1); resize: vertical; }
.tc-input.slim { width: auto; padding: 6px 10px; }
.tc-filters { display: flex; gap: 16px; margin-top: 10px; align-items: center; flex-wrap: wrap; font-size: 12.5px; color: var(--ink-2); }
.tc-filters select { margin-left: 6px; font: inherit; font-size: 12.5px; border: 1px solid var(--axis); border-radius: 8px; padding: 4px 8px; background: var(--surface-1); color: var(--ink-1); }

.tc-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.tc-cards.three { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .tc-cards, .tc-cards.three { grid-template-columns: 1fr; } }
.tc-person { background: var(--surface-1); border: 1px solid var(--border); border-radius: 14px; padding: 18px; }
.tc-person.path.sel { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 12%, transparent); }
.tc-person-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.tc-fit { font-size: 26px; font-weight: 800; letter-spacing: -1px; color: var(--brand); }
.tc-fit em { font-style: normal; font-size: 14px; } .tc-fit.small { font-size: 20px; }
.tc-dl { margin: 0; } .tc-dl > div { display: flex; gap: 8px; font-size: 13px; padding: 2.5px 0; }
.tc-dl dt { flex: none; width: 86px; color: var(--ink-muted); } .tc-dl dd { margin: 0; }
.tc-dl.wide dt { width: 110px; }
.tc-why dt { font-size: 12px; font-weight: 700; color: var(--ink-muted); margin-top: 10px; }
.tc-why dd { margin: 2px 0 0; font-size: 13.5px; }

.tc-check { display: flex; gap: 8px; align-items: center; font-size: 13.5px; padding: 5px 0; cursor: pointer; }
.tc-check.tiny { font-size: 12px; color: var(--ink-2); padding: 0; }
.tc-skillrow { display: flex; justify-content: space-between; gap: 10px; align-items: center; flex-wrap: wrap; padding: 4px 0; border-bottom: 1px solid var(--grid); }
.tc-skillrow:last-child { border-bottom: 0; }
.tc-skillrow .tc-bar { flex: 1; min-width: 220px; margin: 0; }
.tc-skill-actions { display: flex; gap: 8px; align-items: center; }

.tc-gaprow { border-top: 1px solid var(--grid); padding: 12px 0 8px; }
.tc-gaphead { display: flex; justify-content: space-between; font-size: 13.5px; }
.tc-gapbar { position: relative; height: 10px; background: var(--grid); border-radius: 99px; margin: 8px 0 2px; overflow: hidden; }
.tc-gapbar i { position: absolute; inset: 0 auto 0 0; background: var(--seq-550); border-radius: 99px; }
.tc-gapbar em { position: absolute; top: 0; bottom: 0; background: repeating-linear-gradient(45deg, rgba(46,139,118,0.5) 0 5px, rgba(46,139,118,0.22) 5px 10px); }

.tc-steps { display: flex; gap: 6px; flex-wrap: wrap; font-size: 13px; margin: 6px 0 10px; align-items: center; }
.tc-steps i { font-style: normal; color: var(--ink-muted); margin-right: 6px; }

.tc-qrow { display: flex; justify-content: space-between; gap: 14px; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--grid); flex-wrap: wrap; }
.tc-qtext { font-size: 13.5px; flex: 1; min-width: 260px; }
.tc-scale { display: flex; gap: 4px; }
.tc-scale label { width: 34px; height: 32px; display: grid; place-items: center; border: 1px solid var(--axis);
  border-radius: 8px; font-size: 13px; cursor: pointer; color: var(--ink-2); }
.tc-scale label.on { background: var(--brand); color: #fff; border-color: var(--brand); font-weight: 700; }
.tc-scale input { display: none; }

.tc-flow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 980px) { .tc-flow { grid-template-columns: 1fr 1fr; } }
.tc-flowcol { background: var(--surface-1); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
.tc-flowhead { font-weight: 800; font-size: 14px; margin-bottom: 6px; color: var(--brand); }

.tc-overlay { position: fixed; inset: 0; background: rgba(12,18,32,0.45); z-index: 60;
  display: grid; place-items: center; padding: 20px; }
.tc-modal { background: var(--surface-1); border-radius: 16px; padding: 20px 22px; width: min(560px, 100%);
  max-height: 84vh; overflow: auto; box-shadow: 0 30px 70px -30px rgba(0,0,0,0.4); }
.tc-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.tc-modal-head b { font-size: 15px; }
.tc-modal-head button { border: 0; background: none; font-size: 16px; cursor: pointer; color: var(--ink-muted); }

.tc-toasts { position: fixed; right: 18px; bottom: 18px; display: flex; flex-direction: column; gap: 8px; z-index: 70; }
.tc-toast { background: #16273f; color: #fff; font-size: 13px; border-radius: 10px; padding: 11px 16px;
  max-width: 340px; box-shadow: 0 12px 30px -12px rgba(0,0,0,0.4); animation: tcToast 0.3s ease; }
@keyframes tcToast { from { opacity: 0; transform: translateY(8px); } }
`;
