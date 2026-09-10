import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Shield, Layers, Image as ImageIcon } from "lucide-react";

// The 11 essential glyphs covering SIGMA, JUSTICE, and LEAGUE
// Coordinate system: H = 200, 45-degree chamfers, heavy condensed slab proportions
const GLYPHS: Record<string, { w: number; d: string }> = {
  S: {
    w: 104,
    d: "M 0,22 L 22,0 L 104,0 L 104,68 L 74,68 L 74,34 L 34,34 L 34,80 L 74,104 L 104,124 L 104,178 L 82,200 L 22,200 L 0,178 L 0,132 L 30,132 L 30,166 L 70,166 L 70,120 L 30,96 L 0,76 Z",
  },
  I: {
    w: 36,
    d: "M 0,0 L 36,0 L 36,200 L 0,200 Z",
  },
  G: {
    w: 104,
    d: "M 0,22 L 22,0 L 104,0 L 104,34 L 34,34 L 34,166 L 70,166 L 70,116 L 52,116 L 52,86 L 104,86 L 104,178 L 82,200 L 22,200 L 0,178 Z",
  },
  M: {
    w: 124,
    d: "M 0,22 L 22,0 L 42,0 L 62,110 L 82,0 L 102,0 L 124,22 L 124,200 L 90,200 L 90,65 L 72,165 L 52,165 L 34,65 L 34,200 L 0,200 Z",
  },
  A: {
    w: 110,
    d: "M 38,0 L 72,0 L 94,24 L 110,200 L 76,200 L 71,152 L 39,152 L 34,200 L 0,200 L 16,24 Z M 44,118 L 66,118 L 55,48 Z",
  },
  J: {
    w: 92,
    d: "M 56,0 L 92,0 L 92,176 L 68,200 L 22,200 L 0,178 L 0,132 L 34,132 L 34,166 L 58,166 L 58,0 Z",
  },
  U: {
    w: 104,
    d: "M 0,0 L 34,0 L 34,166 L 70,166 L 70,0 L 104,0 L 104,178 L 82,200 L 22,200 L 0,178 Z",
  },
  T: {
    w: 104,
    d: "M 0,0 L 104,0 L 104,36 L 70,36 L 70,200 L 34,200 L 34,36 L 0,36 Z",
  },
  C: {
    w: 104,
    d: "M 0,22 L 22,0 L 104,0 L 104,36 L 34,36 L 34,164 L 104,164 L 104,200 L 22,200 L 0,178 Z",
  },
  E: {
    w: 96,
    d: "M 0,22 L 22,0 L 96,0 L 96,36 L 34,36 L 34,82 L 86,82 L 86,116 L 34,116 L 34,164 L 96,164 L 96,200 L 22,200 L 0,178 Z",
  },
  L: {
    w: 90,
    d: "M 0,22 L 22,0 L 34,0 L 34,164 L 90,164 L 90,200 L 22,200 L 0,178 Z",
  },
};

const STAR_PATH =
  "M 0,-24 L 7,-7 L 24,-7 L 11,4 L 16,21 L 0,10 L -16,21 L -11,4 L -24,-7 L -7,-7 Z";

interface JusticeLeagueTitleProps {
  initialType?: "3D_RENDER" | "VECTOR_SVG";
  initialMode?: "SIGMA" | "JUSTICE_LEAGUE" | "SIGMA_LEAGUE";
  showControls?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const JusticeLeagueTitle: React.FC<JusticeLeagueTitleProps> = ({
  initialType = "3D_RENDER",
  initialMode = "SIGMA",
  showControls = false,
  className = "",
  size = "lg",
}) => {
  // Directly use the authentic 3D Model Render as default, transparent with no background box!
  const [renderType, setRenderType] = useState<"3D_RENDER" | "VECTOR_SVG">(initialType);
  const [mode, setMode] = useState<"SIGMA" | "JUSTICE_LEAGUE" | "SIGMA_LEAGUE">(initialMode);
  const [enableFlare, setEnableFlare] = useState(true);

  const lines =
    mode === "SIGMA"
      ? ["SIGMA"]
      : mode === "SIGMA_LEAGUE"
      ? ["SIGMA", "LEAGUE"]
      : ["JUSTICE", "LEAGUE"];

  return (
    <div className={`relative flex flex-col items-start select-none w-full bg-transparent ${className}`}>
      {/* Discreet, transparent controller tabs if enabled */}
      {showControls && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-700/40 bg-slate-950/40 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setRenderType("3D_RENDER")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black tracking-wide transition-all ${
              renderType === "3D_RENDER"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon size={11} className={renderType === "3D_RENDER" ? "text-cyan-400" : ""} />
            Model 3D Render (Transparan)
          </button>

          <button
            type="button"
            onClick={() => setRenderType("VECTOR_SVG")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black tracking-wide transition-all ${
              renderType === "VECTOR_SVG"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers size={11} className={renderType === "VECTOR_SVG" ? "text-cyan-400" : ""} />
            Model Vektor (SVG)
          </button>

          {renderType === "VECTOR_SVG" && (
            <>
              <div className="h-3.5 w-px bg-slate-700/60" />
              <button
                type="button"
                onClick={() => setMode("SIGMA")}
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  mode === "SIGMA" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                SIGMA
              </button>
              <button
                type="button"
                onClick={() => setMode("JUSTICE_LEAGUE")}
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  mode === "JUSTICE_LEAGUE" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                JUSTICE LEAGUE
              </button>
            </>
          )}

          <div className="h-3.5 w-px bg-slate-700/60" />
          <button
            type="button"
            onClick={() => setEnableFlare(!enableFlare)}
            title="Efek Kilauan Anamorfik"
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
              enableFlare ? "text-cyan-300" : "text-slate-500"
            }`}
          >
            <Sparkles size={11} className={enableFlare ? "text-cyan-400 animate-pulse" : ""} />
            Flare: {enableFlare ? "ON" : "OFF"}
          </button>
        </div>
      )}

      {/* 100% TRANSPARENT STAGE - NO BOX, NO BACKGROUND, NO BORDER */}
      <div className="relative w-full flex items-center justify-start bg-transparent p-0">
        <AnimatePresence mode="wait">
          {renderType === "3D_RENDER" ? (
            /* DIRECT 3D MODEL RENDER (TRANSPARENT BACKGROUND) */
            <motion.div
              key="3d-render-model"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full group select-none"
            >
              {/* Optional Anamorphic flare glow behind the star */}
              {enableFlare && (
                <div
                  className="pointer-events-none absolute -inset-2 opacity-50 blur-2xl transition-opacity group-hover:opacity-75"
                  style={{
                    background:
                      "radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.25) 0%, transparent 60%)",
                  }}
                />
              )}

              {/* The photorealistic 3D Model image - transparent PNG */}
              <img
                src="/assets/sigma_justice_league.png"
                alt="SIGMA - Justice League 3D Title"
                referrerPolicy="no-referrer"
                className="w-full max-w-none h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter contrast-125 brightness-105"
              />

              {/* Dynamic Lens Flare Star Sparkle Overlay */}
              {enableFlare && (
                <div className="pointer-events-none absolute right-[13%] top-[35%] w-8 h-8 flex items-center justify-center">
                  <span className="absolute w-28 sm:w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_12px_#38bdf8] opacity-90 animate-pulse" />
                  <span className="absolute h-28 sm:h-40 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_12px_#38bdf8] opacity-75 animate-pulse" />
                  <span className="absolute w-3 h-3 rounded-full bg-white blur-[1px] shadow-[0_0_15px_#38bdf8]" />
                </div>
              )}
            </motion.div>
          ) : (
            /* VECTOR SVG VERSION (ALSO 100% TRANSPARENT WITH NO BACKGROUND) */
            <motion.div
              key="vector-svg-model"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative flex flex-col items-start gap-2 w-full bg-transparent"
            >
              {lines.map((lineText, lineIdx) => {
                const letterSpacing = 10;
                let currentX = 0;
                const lettersData = Array.from(lineText).map((char) => {
                  const glyph = GLYPHS[char] || GLYPHS["I"];
                  const xPos = currentX;
                  currentX += glyph.w + letterSpacing;
                  return { char, glyph, x: xPos };
                });
                const totalWidth = currentX - letterSpacing;
                const totalHeight = 200;

                let starConfig: { x: number; y: number } | null = null;
                if (lineText === "JUSTICE") {
                  const cLetter = lettersData.find((l) => l.char === "C");
                  if (cLetter) {
                    starConfig = { x: cLetter.x - 4, y: 55 };
                  }
                } else if (lineText === "SIGMA") {
                  const aLetter = lettersData.find((l) => l.char === "A");
                  if (aLetter) {
                    starConfig = { x: aLetter.x + 55, y: 135 };
                  }
                }

                return (
                  <div
                    key={`${lineText}-${lineIdx}`}
                    className="relative w-full flex items-center justify-start bg-transparent"
                  >
                    <svg
                      viewBox={`-20 -15 ${totalWidth + 40} ${totalHeight + 40}`}
                      className="w-full h-auto max-h-[160px] sm:max-h-[220px] md:max-h-[280px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
                      preserveAspectRatio="xMinYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id={`jl-steel-t-${lineIdx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BACDD6" />
                          <stop offset="18%" stopColor="#8DA2AC" />
                          <stop offset="45%" stopColor="#5E737D" />
                          <stop offset="70%" stopColor="#3F525B" />
                          <stop offset="100%" stopColor="#25343A" />
                        </linearGradient>

                        <linearGradient id={`jl-sheen-t-${lineIdx}`} x1="0" y1="0" x2="0.8" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                          <stop offset="25%" stopColor="#CBD5E1" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#334155" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="jl-rim-light-t" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                          <stop offset="40%" stopColor="#CBD5E1" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
                        </linearGradient>

                        <linearGradient id="jl-rim-dark-t" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0B1114" stopOpacity="0.95" />
                        </linearGradient>

                        <pattern
                          id={`jl-scratch-pattern-t-${lineIdx}`}
                          width="120"
                          height="120"
                          patternUnits="userSpaceOnUse"
                        >
                          <line x1="0" y1="0" x2="120" y2="120" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.35" />
                          <line x1="20" y1="0" x2="140" y2="120" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
                          <line x1="-20" y1="0" x2="100" y2="120" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.3" />
                          <line x1="60" y1="0" x2="180" y2="120" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
                          <line x1="120" y1="0" x2="0" y2="120" stroke="#E2E8F0" strokeWidth="0.6" opacity="0.25" />
                          <line x1="140" y1="20" x2="20" y2="140" stroke="#0F172A" strokeWidth="1.1" opacity="0.45" />
                          <line x1="80" y1="0" x2="-40" y2="120" stroke="#0F172A" strokeWidth="1" opacity="0.4" />
                          <line x1="100" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.3" />
                          <line x1="10" y1="45" x2="95" y2="115" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
                          <line x1="15" y1="35" x2="110" y2="90" stroke="#0B1115" strokeWidth="1.2" opacity="0.6" />
                          <line x1="5" y1="90" x2="85" y2="15" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.35" />
                        </pattern>

                        <filter id={`jl-shadow-t-${lineIdx}`} x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="-4" dy="6" stdDeviation="4" floodColor="#050708" floodOpacity="0.9" />
                          <feDropShadow dx="-8" dy="12" stdDeviation="8" floodColor="#000000" floodOpacity="0.8" />
                        </filter>
                      </defs>

                      {/* 3D Extrusions */}
                      <g filter={`url(#jl-shadow-t-${lineIdx})`}>
                        <g transform="translate(-7, 7)" fill="#0A0E11" opacity="0.95">
                          {lettersData.map((l, i) => (
                            <path key={`ext4-${i}`} d={l.glyph.d} transform={`translate(${l.x}, 0)`} />
                          ))}
                        </g>
                        <g transform="translate(-5, 5)" fill="#141C22">
                          {lettersData.map((l, i) => (
                            <path key={`ext3-${i}`} d={l.glyph.d} transform={`translate(${l.x}, 0)`} />
                          ))}
                        </g>
                        <g transform="translate(-3, 3)" fill="#202C33">
                          {lettersData.map((l, i) => (
                            <path key={`ext2-${i}`} d={l.glyph.d} transform={`translate(${l.x}, 0)`} />
                          ))}
                        </g>
                        <g transform="translate(-1.5, 1.5)" fill="#31424C">
                          {lettersData.map((l, i) => (
                            <path key={`ext1-${i}`} d={l.glyph.d} transform={`translate(${l.x}, 0)`} />
                          ))}
                        </g>
                      </g>

                      {/* Bevel rim */}
                      <g>
                        {lettersData.map((l, i) => (
                          <path
                            key={`bevel-shadow-${i}`}
                            d={l.glyph.d}
                            transform={`translate(${l.x}, 0)`}
                            fill="none"
                            stroke="url(#jl-rim-dark-t)"
                            strokeWidth="3.5"
                          />
                        ))}
                        {lettersData.map((l, i) => (
                          <path
                            key={`bevel-light-${i}`}
                            d={l.glyph.d}
                            transform={`translate(${l.x - 0.5}, -0.5)`}
                            fill="none"
                            stroke="url(#jl-rim-light-t)"
                            strokeWidth="2"
                          />
                        ))}
                      </g>

                      {/* Front face with metal texture */}
                      <g>
                        {lettersData.map((l, i) => (
                          <g key={`face-${i}`} transform={`translate(${l.x}, 0)`}>
                            <path d={l.glyph.d} fill={`url(#jl-steel-t-${lineIdx})`} />
                            <path
                              d={l.glyph.d}
                              fill={`url(#jl-scratch-pattern-t-${lineIdx})`}
                              style={{ mixBlendMode: "overlay" }}
                            />
                            <path
                              d={l.glyph.d}
                              fill={`url(#jl-sheen-t-${lineIdx})`}
                              style={{ mixBlendMode: "screen" }}
                              opacity="0.45"
                            />
                            <path
                              d={l.glyph.d}
                              fill="none"
                              stroke="#FFFFFF"
                              strokeWidth="0.75"
                              opacity="0.4"
                            />
                          </g>
                        ))}
                      </g>

                      {/* Star */}
                      {starConfig && (
                        <g transform={`translate(${starConfig.x}, ${starConfig.y})`}>
                          <path d={STAR_PATH} fill="#05080A" transform="scale(1.08)" />
                          <path d={STAR_PATH} fill="#0F161B" stroke="#7A939E" strokeWidth="1.2" />
                          <path d={STAR_PATH} fill="#0B1014" transform="scale(0.85)" />

                          {enableFlare && (
                            <g transform="translate(7, -7)">
                              <circle cx="0" cy="0" r="28" fill="#38BDF8" opacity="0.3" filter="blur(6px)" />
                              <circle cx="0" cy="0" r="14" fill="#E0F2FE" opacity="0.6" filter="blur(3px)" />
                              <line x1="-90" y1="0" x2="90" y2="0" stroke="#E0F2FE" strokeWidth="1.8" opacity="0.85" />
                              <line x1="-40" y1="0" x2="40" y2="0" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.95" />
                              <polygon points="0,-22 2,-3 22,0 2,3 0,22 -2,3 -22,0 -2,-3" fill="#FFFFFF" opacity="0.95" />
                            </g>
                          )}
                        </g>
                      )}
                    </svg>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
