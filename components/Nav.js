"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "소개" },
  { href: "/dashboard", label: "조직 대시보드" },
  { href: "/people", label: "인재 프로필" },
  { href: "/simulation", label: "시뮬레이션" },
  { href: "/industry", label: "산업 동향" },
  { href: "/survey", label: "수용성 진단" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">
          Skill<span>Weave</span>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path === l.href || (l.href !== "/" && path.startsWith(l.href)) ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
