"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "@/components/Mark";

const GROUPS = [
  { label: null, links: [{ href: "/", label: "소개" }] },
  {
    label: "HR 관점",
    links: [
      { href: "/dashboard", label: "조직 대시보드" },
      { href: "/people", label: "인재 프로필" },
      { href: "/simulation", label: "시뮬레이션" },
      { href: "/gap", label: "스킬 갭 분석" },
      { href: "/industry", label: "산업 동향" },
    ],
  },
  {
    label: "직원 관점",
    links: [
      { href: "/skill-check", label: "스킬 진단" },
      { href: "/survey", label: "수용성 진단" },
    ],
  },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Mark size={20} style={{ verticalAlign: "-4px", marginRight: 8, color: "var(--series-1)" }} />
          <span>Weave</span>
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {GROUPS.map((g, gi) => (
            <span key={gi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {g.label && (
                <span style={{
                  fontSize: 10.5, fontWeight: 700, color: "var(--ink-muted)",
                  textTransform: "uppercase", letterSpacing: 0.5,
                  borderLeft: "1px solid var(--axis)", paddingLeft: 12,
                }}>
                  {g.label}
                </span>
              )}
              {g.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={path === l.href || (l.href !== "/" && path.startsWith(l.href)) ? "active" : ""}
                >
                  {l.label}
                </Link>
              ))}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
