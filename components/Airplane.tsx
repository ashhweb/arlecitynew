/** Small decorative airplane that slowly crosses the sky in the top-right area. */
export function Airplane() {
  return (
    <div
      aria-hidden
      className="absolute left-[56vw] top-[16%] animate-plane motion-reduce:animate-none motion-reduce:opacity-80 sm:top-[11%]"
      style={{ willChange: "transform" }}
    >
      <svg width="64" height="26" viewBox="0 0 64 26" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
        <path d="M2 13 L10 11 L48 11 Q60 12 63 13 Q60 14 48 15 L10 15 Z" fill="#fff" />
        <path d="M30 11.5 L19 1.5 L25 1.5 L42 11.5 Z" fill="#e8edf6" />
        <path d="M30 14.5 L19 24.5 L25 24.5 L42 14.5 Z" fill="#d9e0ee" />
        <path d="M8 11 L3 4 L8 4 L16 11 Z" fill="#e8edf6" />
        <path d="M8 15 L3 22 L8 22 L16 15 Z" fill="#d9e0ee" />
        <rect x="50" y="12" width="9" height="1.4" rx="0.7" fill="#9fb0cf" />
      </svg>
    </div>
  );
}
