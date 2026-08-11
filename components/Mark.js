/**
 * Weave 마크 (인라인 SVG — currentColor 상속)
 * 두 고리가 사슬처럼 실제로 맞물린 구조: 한쪽 교차는 A가 위, 다른 쪽은 B가 위.
 */
const RING =
  "M-25 -10 A15 15 0 0 1 -10 -25 H10 A15 15 0 0 1 25 -10 V10 A15 15 0 0 1 10 25 H-10 A15 15 0 0 1 -25 10 Z";

export default function Mark({ size = 22, id = "wv", style, ...rest }) {
  const clip = `${id}-half`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Weave" style={style} {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d="M120 0 L120 120 L0 120 Z" />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="11" strokeLinejoin="round">
        <path d={RING} transform="translate(47 47)" />
        <path d={RING} transform="translate(73 73)" />
        <g clipPath={`url(#${clip})`}>
          <path d={RING} transform="translate(47 47)" />
        </g>
      </g>
    </svg>
  );
}
