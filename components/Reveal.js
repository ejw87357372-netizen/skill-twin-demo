"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 스크롤로 화면에 들어오면 .in 클래스를 붙여 리빌·차트 드로잉 애니메이션을 재생한다.
 * delay: 순차 등장(ms). once=false면 벗어날 때 초기화(재생 반복).
 */
export default function Reveal({ children, delay = 0, once = true, style, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.unobserve(el);
        } else if (!once) setShown(false);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
