import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MASCOTS } from "../lib/brand";

export function Animated3DMascot({ initialMascot = "beta", className = "" }) {
  const [activeKey, setActiveKey] = useState(initialMascot);
  const cardRef = useRef(null);
  const mascot = MASCOTS[activeKey] || MASCOTS.beta;

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for physics feel
  const springConfig = { damping: 18, stiffness: 140 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const getThemeColor = () => {
    if (activeKey === "alpha") return { hex: "#00F0FF", shadow: "rgba(0,240,255,0.4)" };
    if (activeKey === "beta") return { hex: "#FF007A", shadow: "rgba(255,0,122,0.45)" };
    return { hex: "#FFD600", shadow: "rgba(255,214,0,0.4)" };
  };

  const theme = getThemeColor();

  return (
    <div className={`relative flex flex-col items-center lg:items-start ${className}`}>
      {/* 3D Interactive Card Container */}
      <div
        className="relative perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pulsing Backlight Aura */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-full opacity-60 blur-3xl transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${theme.hex} 0%, transparent 70%)` }}
        />

        {/* Floating Mathematical Orbit Badges */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-4 -left-6 z-30 rounded-xl border border-sigma-cyan/40 bg-sigma-panel/90 px-2.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          style={{ transform: "translateZ(55px)" }}
        >
          <span className="mono text-[0.68rem] font-bold text-sigma-cyan">x² + y² = r²</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 9, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="pointer-events-none absolute -bottom-3 -right-5 z-30 rounded-xl border border-sigma-yellow/40 bg-sigma-panel/90 px-2.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,214,0,0.3)]"
          style={{ transform: "translateZ(65px)" }}
        >
          <span className="mono text-[0.68rem] font-bold text-sigma-yellow">Σ (xᵢ - x̄)</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute top-1/2 -right-8 z-30 rounded-xl border border-sigma-magenta/40 bg-sigma-panel/90 px-2 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,122,0.3)]"
          style={{ transform: "translateZ(45px)" }}
        >
          <span className="mono text-[0.65rem] font-bold text-sigma-magenta">f∘g (x)</span>
        </motion.div>

        {/* 3D Tilt Card */}
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group relative h-64 w-52 cursor-pointer overflow-hidden rounded-[2.2rem] border border-white/20 bg-sigma-void/80 p-2 shadow-2xl transition-all duration-300 sm:h-72 sm:w-56"
        >
          {/* Holographic Inner Frame */}
          <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-sigma-deep">
            {/* 3D Character Image */}
            <motion.img
              key={activeKey}
              initial={{ opacity: 0.4, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={mascot.img}
              alt={mascot.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ transform: "translateZ(25px)" }}
            />

            {/* Holographic Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sigma-void via-transparent to-white/10 opacity-70" />

            {/* Dynamic Cursor Light Glare / Specular Shine */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle 120px at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 80%)`,
              }}
            />

            {/* Character Info Overlay at bottom */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-sigma-void via-sigma-void/80 to-transparent p-3.5 pt-8"
              style={{ transform: "translateZ(35px)" }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.hex }}
                />
                <span className="font-display text-xs font-black text-white drop-shadow">
                  {mascot.name}
                </span>
              </div>
              <p className="mono mt-0.5 text-[0.62rem] text-slate-300/90">{mascot.role}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mascot Switcher Pills */}
      <div className="mt-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
        {Object.entries(MASCOTS).map(([k, m]) => (
          <button
            key={k}
            type="button"
            onClick={() => setActiveKey(k)}
            className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold transition-all ${
              activeKey === k
                ? "bg-white text-sigma-void shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            data-testid={`mascot-select-${k}`}
          >
            {m.name.split("-")[0]}
          </button>
        ))}
        <span className="mono mr-1 text-[0.6rem] text-slate-400 flex items-center gap-0.5">
          <Sparkles size={10} className="text-sigma-cyan" /> 3D
        </span>
      </div>
    </div>
  );
}

export function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
