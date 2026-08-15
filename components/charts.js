// 경량 인라인 SVG 차트 (라이브러리 무의존)
// 마크 스펙: 얇은 막대 + 4px 라운드 데이터 끝, 2px 라인, 은은한 그리드

/** 가로 막대 차트 — 단일 시리즈(파랑), 값 직접 표기 */
export function HBarChart({ items, max, unit = "명", labelW = 150 }) {
  const m = max ?? Math.max(...items.map((d) => d.value), 1);
  const rowH = 30, chartW = 420, valueW = 40;
  const H = items.length * rowH + 8;
  // 색을 지정하지 않은 항목은 값에 비례한 네이비 농도(순차 척도)로 칠한다
  const seq = ["var(--seq-250)", "var(--seq-400)", "var(--seq-550)", "var(--seq-700)"];
  const auto = (v) => seq[Math.min(seq.length - 1, Math.floor((v / m) * seq.length))];
  return (
    <svg
      viewBox={`0 0 ${labelW + chartW + valueW} ${H}`}
      width="100%"
      role="img"
      aria-label="가로 막대 차트"
      style={{ maxWidth: 640 }}
    >
      {items.map((d, i) => {
        const w = Math.max((d.value / m) * chartW, 2);
        const y = i * rowH + 6;
        return (
          <g key={d.label}>
            <title>{`${d.label}: ${d.value}${unit}`}</title>
            <text x={labelW - 8} y={y + 13} textAnchor="end" fontSize="12" fill="var(--ink-2)">
              {d.label}
            </text>
            <rect
              x={labelW} y={y} width={w} height={18} rx={4}
              fill={d.color || auto(d.value)}
              data-draw="bar"
              style={{ animationDelay: `${i * 95}ms`, transformBox: "fill-box" }}
            />
            <text
              x={labelW + w + 7} y={y + 13} fontSize="12" fill="var(--ink-2)" className="num"
              data-draw="fade" style={{ animationDelay: `${i * 95 + 620}ms` }}
            >
              {d.value}
            </text>
          </g>
        );
      })}
      <line x1={labelW} y1={0} x2={labelW} y2={H} stroke="var(--axis)" strokeWidth="1" />
    </svg>
  );
}

/** 팀 × 스킬 히트맵 — 순차(단일 색상, 밝음→어두움) */
export function Heatmap({ rows, cols, colLabel }) {
  const cell = 34, gap = 2, labelW = 96, topH = 84;
  const W = labelW + cols.length * (cell + gap) + 64; // 우측 여백: 회전 라벨 잘림 방지
  const H = topH + rows.length * (cell + gap);
  const maxV = Math.max(...rows.flatMap((r) => r.counts.map((c) => c.n)), 1);
  const steps = ["var(--seq-100)", "var(--seq-250)", "var(--seq-400)", "var(--seq-550)", "var(--seq-700)"];
  const color = (v) =>
    v === 0 ? "var(--grid)" : steps[Math.min(steps.length - 1, Math.floor((v / maxV) * steps.length))];
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} role="img" aria-label="팀별 스킬 보유 히트맵">
        {cols.map((c, j) => (
          <text
            key={c.id}
            x={labelW + j * (cell + gap) + cell / 2}
            y={topH - 8}
            fontSize="10.5"
            fill="var(--ink-muted)"
            transform={`rotate(-42 ${labelW + j * (cell + gap) + cell / 2} ${topH - 8})`}
          >
            {colLabel(c)}
          </text>
        ))}
        {rows.map((r, i) => (
          <g key={r.team}>
            <text x={labelW - 8} y={topH + i * (cell + gap) + cell / 2 + 4} textAnchor="end" fontSize="12" fill="var(--ink-2)">
              {r.team}
            </text>
            {r.counts.map((c, j) => (
              <g key={c.skill}>
                <title>{`${r.team} · ${colLabel(cols[j])}: ${c.n}명`}</title>
                <rect
                  x={labelW + j * (cell + gap)}
                  y={topH + i * (cell + gap)}
                  width={cell}
                  height={cell}
                  rx={4}
                  fill={color(c.n)}
                  data-draw="pop"
                  style={{ animationDelay: `${(i + j) * 38}ms`, transformBox: "fill-box" }}
                />
                {c.n > 0 && (
                  <text
                    x={labelW + j * (cell + gap) + cell / 2}
                    y={topH + i * (cell + gap) + cell / 2 + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill={c.n / maxV > 0.55 ? "#fff" : "var(--ink-1)"}
                    className="num"
                  >
                    {c.n}
                  </text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** 라인 차트 — 인력 전망 (2px 라인, ≥8px 마커는 끝점만) */
export function LineChart({ series, yLabel = "명", months = 12 }) {
  const W = 560, H = 220, padL = 44, padR = 16, padT = 14, padB = 30;
  const all = series.flatMap((s) => s.points.map((p) => p.n));
  const yMax = Math.ceil(Math.max(...all) * 1.08);
  const yMin = Math.floor(Math.min(...all) * 0.92);
  const x = (m) => padL + (m / months) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - padT - padB);
  const ticks = 4;
  const fmt = (v) => (yMax - yMin < 5 ? v.toFixed(1) : String(Math.round(v)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="인력 전망 라인 차트" style={{ maxWidth: 640 }}>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = yMin + ((yMax - yMin) / ticks) * i;
        return (
          <g key={i}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--grid)" strokeWidth="1" />
            <text x={padL - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-muted)" className="num">
              {fmt(v)}
            </text>
          </g>
        );
      })}
      {[0, 3, 6, 9, 12].map((m) => (
        <text key={m} x={x(m)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--ink-muted)">
          {m}개월
        </text>
      ))}
      {series.map((s, si) => {
        const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month)},${y(p.n)}`).join(" ");
        const last = s.points[s.points.length - 1];
        // 시리즈 끝점이 겹칠 때 라벨이 충돌하지 않도록 시리즈별로 위/아래로 분산
        const dy = si === 0 ? -11 : 20;
        return (
          <g key={s.name}>
            <title>{`${s.name}: ${last.n}${yLabel} (12개월 후)`}</title>
            <path
              d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"
              data-draw="line" style={{ animationDelay: `${si * 160}ms` }}
            />
            <circle
              cx={x(last.month)} cy={y(last.n)} r="4.5" fill={s.color} stroke="var(--surface-1)" strokeWidth="2"
              data-draw="pop" style={{ animationDelay: `${si * 160 + 1150}ms`, transformBox: "fill-box" }}
            />
            <text x={x(last.month) - 6} y={y(last.n) + dy} textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--ink-1)" className="num"
              data-draw="fade" style={{ animationDelay: `${si * 160 + 1150}ms` }}
            >
              {s.name} {last.n}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--axis)" strokeWidth="1" />
    </svg>
  );
}

/**
 * 스킬 온톨로지 그래프 — 힘 기반(force-directed) 배치.
 * 서로 당기는 연결선과 서로 미는 노드가 균형을 이루는 지점으로 수렴시켜,
 * 같은 도메인의 스킬이 자연스럽게 뭉치고 도메인을 잇는 스킬이 사이에 놓이게 한다.
 * 시드 고정 난수를 써서 서버·클라이언트 렌더 결과가 항상 같다.
 */
function forceLayout(nodes, edges, W, H, seed = 20260810) {
  let t = seed;
  const rnd = () => {
    t = (t + 0x6d2b79f5) | 0;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const N = nodes.length;
  const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
  const P = nodes.map((_, i) => {
    const a = (i / N) * Math.PI * 2;
    return { x: W / 2 + Math.cos(a) * 90 + (rnd() - 0.5) * 40,
             y: H / 2 + Math.sin(a) * 90 + (rnd() - 0.5) * 40 };
  });
  const E = edges.filter(([a, b]) => a in idx && b in idx).map(([a, b]) => [idx[a], idx[b]]);
  const k = Math.sqrt((W * H) / N) * 1.02;  // 이상적인 노드 간 거리 (라벨이 겹치지 않을 만큼)
  const cut = k * 3.2;                       // 이 거리 밖에서는 밀어내지 않음(분리된 덩어리가 튀는 것 방지)
  let temp = W / 8;

  for (let step = 0; step < 520; step++) {
    const disp = P.map(() => ({ x: 0, y: 0 }));
    // 척력 — 모든 노드 쌍
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        let dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
        let d = Math.hypot(dx, dy) || 0.01;
        if (d > cut) continue;
        const f = (k * k) / d;
        dx /= d; dy /= d;
        disp[i].x += dx * f; disp[i].y += dy * f;
        disp[j].x -= dx * f; disp[j].y -= dy * f;
      }
    }
    // 인력 — 연결된 노드
    for (const [a, b] of E) {
      let dx = P[a].x - P[b].x, dy = P[a].y - P[b].y;
      let d = Math.hypot(dx, dy) || 0.01;
      const f = (d * d) / k;
      dx /= d; dy /= d;
      disp[a].x -= dx * f; disp[a].y -= dy * f;
      disp[b].x += dx * f; disp[b].y += dy * f;
    }
    // 중심으로 약하게 수렴 + 이동량 제한(냉각)
    for (let i = 0; i < N; i++) {
      disp[i].x += (W / 2 - P[i].x) * 0.09;   // 중력 — 연결이 없는 덩어리도 화면 안에 모은다
      disp[i].y += (H / 2 - P[i].y) * 0.09;
      const d = Math.hypot(disp[i].x, disp[i].y) || 0.01;
      P[i].x += (disp[i].x / d) * Math.min(d, temp);
      P[i].y += (disp[i].y / d) * Math.min(d, temp);
    }
    temp = Math.max(temp * 0.975, 0.6);
  }

  // 화면에 꽉 차도록 정규화
  const pad = 52;
  const xs = P.map((p) => p.x), ys = P.map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sc = Math.min((W - pad * 2) / (x1 - x0 || 1), (H - pad * 2) / (y1 - y0 || 1));
  const pos = {};
  nodes.forEach((n, i) => {
    pos[n.id] = {
      x: pad + (P[i].x - x0) * sc + (W - pad * 2 - (x1 - x0) * sc) / 2,
      y: pad + (P[i].y - y0) * sc + (H - pad * 2 - (y1 - y0) * sc) / 2,
    };
  });
  return pos;
}

export function OntologyGraph({ skills, edges, highlight = [] }) {
  // 노드가 늘어나도 라벨이 붙지 않도록 캔버스를 함께 키운다
  const W = 980, H = 700;
  const pos = forceLayout(skills, edges, W, H);
  const deg = {};
  for (const s of skills) deg[s.id] = 0;
  for (const [a, b] of edges) { if (a in deg) deg[a]++; if (b in deg) deg[b]++; }
  const maxDeg = Math.max(...Object.values(deg), 1);

  // 옵시디언 느낌 — 채도를 낮춘 카테고리 색 (원색을 회청과 섞는다)
  const catColor = {
    "설계": "color-mix(in srgb, var(--series-1) 80%, var(--ink-muted))",
    "공정": "color-mix(in srgb, var(--series-2) 72%, var(--ink-muted))",
    "품질": "color-mix(in srgb, var(--series-3) 72%, var(--ink-muted))",
    "데이터·AI": "color-mix(in srgb, var(--series-7) 82%, var(--ink-muted))",
    "경영지원": "color-mix(in srgb, var(--series-4) 72%, var(--ink-muted))",
  };
  const hi = new Set(highlight);
  const r = (id) => 4 + (deg[id] / maxDeg) * 8.5 + (hi.has(id) ? 3 : 0);

  // ── 라벨 겹침 제거 ──────────────────────────────────────────────
  // 한글은 글자당 폭이 거의 1em, 영문·숫자는 그 절반쯤이다. 이 근사로 박스를 잡고
  // 연결이 많은 노드부터 자리를 차지하게 한 뒤, 남은 노드는 위/아래로 밀어 배치한다.
  const textW = (t, fs) => {
    let w = 0;
    for (const ch of t) w += /[\u3131-\uD79D]/.test(ch) ? fs * 0.98 : fs * 0.54;
    return w;
  };
  const placed = [];
  const overlaps = (a, b) =>
    a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
  const labelDy = {};
  const order = [...skills]
    .filter((s) => pos[s.id])
    .sort((a, b) => deg[b.id] - deg[a.id]);
  for (const s of order) {
    const p = pos[s.id];
    const big = deg[s.id] >= maxDeg * 0.5;
    const fs = big ? 11.5 : 9.5;
    const w = textW(s.name, fs) + 6;
    const rad = r(s.id);
    // 위 → 아래 → 더 위 → 더 아래 순으로 빈 자리를 찾는다
    const cands = [-rad - 6, rad + 13, -rad - 19, rad + 26, -rad - 32, rad + 39];
    let dy = cands[0], ok = false;
    for (const c of cands) {
      const box = { x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y + c - fs, y1: p.y + c + 3 };
      if (!placed.some((q) => overlaps(box, q))) { dy = c; ok = true; placed.push(box); break; }
    }
    // 어디에도 못 놓으면 연결이 적은 노드의 라벨은 생략한다(호버 시 title로 보인다)
    labelDy[s.id] = ok ? dy : (big ? cands[0] : null);
    if (!ok && big) {
      placed.push({ x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y + cands[0] - fs, y1: p.y + cands[0] + 3 });
    }
  }

  // 스크롤 진입: 작은 구(globe) 형태로 뭉쳐 있던 노드들이 은하가 펼쳐지듯 제자리로 퍼진다.
  const GLOBE_R = 96;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
         aria-label="스킬 온톨로지 그래프 (힘 기반 배치)"
         style={{ maxWidth: 980, display: "block", margin: "0 auto" }}>
      <g className="og-spin" style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}>
        {edges.map(([a, b], ei) => {
          if (!pos[a] || !pos[b]) return null;
          const on = hi.has(a) && hi.has(b);
          return (
            <line
              key={a + b + ei}
              x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
              stroke={on ? "var(--series-2)" : "var(--axis)"}
              strokeWidth={on ? 1.6 : 0.8} strokeOpacity={on ? 0.9 : 0.42}
              data-draw="fade" style={{ animationDelay: `${1050 + ei * 14}ms` }}
            />
          );
        })}
        {skills.map((s, si) => {
          const p = pos[s.id];
          const dim = hi.size > 0 && !hi.has(s.id);
          const big = deg[s.id] >= maxDeg * 0.5;
          // 출발점: 최종 위치와 같은 방향의 작은 구 표면 — 구가 부풀어 오르는 느낌
          const dx = p.x - W / 2, dy = p.y - H / 2;
          const dist = Math.hypot(dx, dy) || 1;
          const sx = W / 2 + (dx / dist) * GLOBE_R;
          const sy = H / 2 + (dy / dist) * GLOBE_R * 0.9;
          const delay = Math.round((dist / Math.hypot(W / 2, H / 2)) * 460 + si * 5);
          return (
            <g key={s.id} opacity={dim ? 0.32 : 1}>
              <title>{`${s.name} (${s.cat}) · 연결 ${deg[s.id]}개`}</title>
              <g data-og="node"
                 style={{ "--tx": `${p.x}px`, "--ty": `${p.y}px`,
                          "--sx": `${sx}px`, "--sy": `${sy}px`,
                          animationDelay: `${delay}ms` }}>
                <circle
                  cx={0} cy={0} r={r(s.id)}
                  fill={catColor[s.cat] || "var(--series-1)"}
                  stroke="var(--surface-1)" strokeWidth="1.5"
                />
                {labelDy[s.id] != null && (
                  <text
                    x={0} y={labelDy[s.id]}
                    textAnchor="middle" fontSize={big ? 11.5 : 9.5}
                    fontWeight={big ? 600 : 400}
                    fill={big ? "var(--ink-1)" : "var(--ink-muted)"}
                    stroke="var(--surface-1)" strokeWidth="3.5" paintOrder="stroke"
                    data-draw="fade" style={{ animationDelay: `${1000 + si * 16}ms` }}
                  >
                    {s.name}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** 레이더 차트 — 프로필 비교 (items[].value = 실선 채움, items[].target = 점선 기준선) */
export function RadarChart({ items, max = 7, label = "요인별 프로필 레이더 차트" }) {
  const W = 420, H = 360, cx = W / 2, cy = H / 2 + 6, R = 120;
  const n = items.length;
  const pt = (i, v) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (v / max) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ring = (v) => items.map((_, i) => pt(i, v).join(",")).join(" ");
  const poly = items.map((d, i) => pt(i, d.value).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={label} style={{ maxWidth: 460 }}>
      {[max / 3, (max * 2) / 3, max].map((v) => (
        <polygon key={v} points={ring(v)} fill="none" stroke="var(--grid)" strokeWidth="1" />
      ))}
      {items.map((d, i) => {
        const [x, y] = pt(i, max);
        const [lx, ly] = pt(i, max * 1.24);
        return (
          <g key={d.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--grid)" strokeWidth="1" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="11.5" fill="var(--ink-2)">
              {d.label}
            </text>
            <text x={lx} y={ly + 18} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ink-1)" className="num">
              {d.value.toFixed(1)}
            </text>
          </g>
        );
      })}
      {items.some((d) => d.target != null) && (
        <polygon
          points={items.map((d, i) => pt(i, d.target ?? 0).join(",")).join(" ")}
          fill="none" stroke="var(--series-2)" strokeWidth="1.8" strokeDasharray="5 4" strokeLinejoin="round"
        />
      )}
      <polygon
        points={poly} fill="var(--series-1)" fillOpacity="0.18"
        stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round"
        data-draw="pop" style={{ transformBox: "fill-box", animationDelay: "120ms" }}
      />
      {items.map((d, i) => {
        const [x, y] = pt(i, d.value);
        return (
          <circle
            key={d.label} cx={x} cy={y} r="4" fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth="2"
            data-draw="pop" style={{ transformBox: "fill-box", animationDelay: `${380 + i * 60}ms` }}
          />
        );
      })}
    </svg>
  );
}
