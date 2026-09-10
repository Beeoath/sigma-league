import { useMemo } from "react";

const SYMBOLS = ["Σ", "π", "√", "∫", "x²", "θ", "∞", "f(x)", "÷", "Δ", "≥", "%"];

/** Deep-space starfield + drifting mathematical glyphs. Pure CSS, no canvas. */
export const SigmaBackground = ({ density = 34, glyphs = 14 }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        top: (i * 37.7) % 100,
        left: (i * 61.3) % 100,
        size: 1 + ((i * 13) % 3),
        delay: (i % 9) * 0.5,
      })),
    [density]
  );
  const marks = useMemo(
    () =>
      Array.from({ length: glyphs }, (_, i) => ({
        id: i,
        s: SYMBOLS[i % SYMBOLS.length],
        top: (i * 43.1) % 92,
        left: (i * 71.9) % 94,
        size: 14 + ((i * 7) % 30),
        delay: (i % 7) * 0.9,
        dur: 6 + (i % 5),
        color: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#FFD600" : "#FF007A",
      })),
    [glyphs]
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#241466_0%,#120a35_38%,#07041a_78%)]" />
      <div className="absolute inset-0 grid-floor opacity-[0.28] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000_20%,transparent_80%)]" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="anim-twinkle absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {marks.map((m) => (
        <span
          key={m.id}
          className="mono absolute font-bold anim-float select-none"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            fontSize: m.size,
            color: m.color,
            opacity: 0.16,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
            textShadow: `0 0 22px ${m.color}`,
          }}
        >
          {m.s}
        </span>
      ))}
    </div>
  );
};
