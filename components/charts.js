// 경량 인라인 SVG 차트 (라이브러리 무의존)
// 마크 스펙: 얇은 막대 + 4px 라운드 데이터 끝, 2px 라인, 은은한 그리드

/** 가로 막대 차트 — 단일 시리즈(파랑), 값 직접 표기 */
export function HBarChart({ items, max, unit = "명" }) {
  const m = max ?? Math.max(...items.map((d) => d.value), 1);
  const rowH = 30, labelW = 150, chartW = 420, valueW = 40;
  const H = items.length * rowH + 8;
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
            <rect x={labelW} y={y} width={w} height={18} rx={4} fill={d.color || "var(--series-1)"} />
            <text x={labelW + w + 7} y={y + 13} fontSize="12" fill="var(--ink-2)" className="num">
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
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
            <circle cx={x(last.month)} cy={y(last.n)} r="4.5" fill={s.color} stroke="var(--surface-1)" strokeWidth="2" />
            <text x={x(last.month) - 6} y={y(last.n) + dy} textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--ink-1)" className="num">
              {s.name} {last.n}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--axis)" strokeWidth="1" />
    </svg>
  );
}

/** 스킬 온톨로지 그래프 — 원형 배치 네트워크 */
export function OntologyGraph({ skills, edges, highlight = [] }) {
  const W = 560, H = 400, cx = W / 2, cy = H / 2, R = 150;
  const pos = {};
  skills.forEach((s, i) => {
    const a = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
    pos[s.id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const catColor = { "설계": "var(--series-1)", "공정": "var(--series-2)", "품질": "var(--series-3)", "데이터·AI": "var(--series-7)" };
  const hi = new Set(highlight);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="스킬 온톨로지 그래프" style={{ maxWidth: 640 }}>
      {edges.map(([a, b]) => (
        <line
          key={a + b}
          x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
          stroke={hi.has(a) && hi.has(b) ? "var(--series-2)" : "var(--grid)"}
          strokeWidth={hi.has(a) && hi.has(b) ? 2 : 1}
        />
      ))}
      {skills.map((s) => (
        <g key={s.id}>
          <title>{`${s.name} (${s.cat})`}</title>
          <circle
            cx={pos[s.id].x} cy={pos[s.id].y}
            r={hi.has(s.id) ? 11 : 8}
            fill={catColor[s.cat] || "var(--series-1)"}
            stroke="var(--surface-1)" strokeWidth="2"
            opacity={hi.size === 0 || hi.has(s.id) ? 1 : 0.35}
          />
          <text
            x={pos[s.id].x} y={pos[s.id].y + (pos[s.id].y > cy ? 24 : -14)}
            textAnchor="middle" fontSize="10.5" fill="var(--ink-2)"
            opacity={hi.size === 0 || hi.has(s.id) ? 1 : 0.4}
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 레이더 차트 — 6요인 프로필 (1~7 척도) */
export function RadarChart({ items, max = 7 }) {
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
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="6요인 수용도 레이더 차트" style={{ maxWidth: 460 }}>
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
      <polygon points={poly} fill="var(--series-1)" fillOpacity="0.18" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" />
      {items.map((d, i) => {
        const [x, y] = pt(i, d.value);
        return <circle key={d.label} cx={x} cy={y} r="4" fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth="2" />;
      })}
    </svg>
  );
}
