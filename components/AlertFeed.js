"use client";
import { useEffect, useState } from "react";

const ICONS = {
  critical: { icon: "⛔", label: "심각", color: "var(--status-critical)" },
  serious: { icon: "▲", label: "주의", color: "var(--status-serious)" },
  warning: { icon: "●", label: "경고", color: "var(--status-warning)" },
  good: { icon: "✓", label: "정상", color: "var(--good-text)" },
};

/** 알림 피드 — 데모 연출: 알림이 몇 초 간격으로 하나씩 도착하는 것처럼 표시 */
export default function AlertFeed({ alerts }) {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    if (visible >= alerts.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1800);
    return () => clearTimeout(t);
  }, [visible, alerts.length]);

  return (
    <div>
      {alerts.slice(0, visible).map((a, i) => {
        const s = ICONS[a.level] ?? ICONS.warning;
        return (
          <div className="alert-row" key={i}>
            <span className="alert-icon" style={{ color: s.color }} aria-hidden>
              {s.icon}
            </span>
            <div>
              <span className="badge" style={{ color: s.color, marginRight: 8 }}>{s.label}</span>
              {a.text}
              <div className="alert-action">→ {a.action}</div>
            </div>
          </div>
        );
      })}
      {visible < alerts.length && (
        <p className="hint" style={{ paddingTop: 8 }}>새 알림 수신 중…</p>
      )}
    </div>
  );
}
