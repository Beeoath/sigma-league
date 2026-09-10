import React from "react";
import { motion } from "framer-motion";

interface IronManTitleProps {
  text?: string;
  className?: string;
}

export const IronManTitle: React.FC<IronManTitleProps> = ({
  text = "SIAP MASUK?",
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none w-full max-w-2xl sm:max-w-3xl mx-auto ${className}`}
      aria-label={text}
    >
      {/* Ambient Arc-Reactor Warm Forge Heat Glow behind 3D letters */}
      <div
        className="pointer-events-none absolute inset-0 -bottom-4 opacity-70 blur-3xl transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.2) 40%, transparent 75%)",
        }}
      />

      {/* 3D Model Render of Iron Man Style Title - 100% Transparent */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative w-full flex items-center justify-center group"
      >
        <img
          src="/assets/siap_masuk_ironman.png"
          alt={text}
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain max-h-[140px] sm:max-h-[180px] md:max-h-[220px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] filter contrast-125 brightness-105"
        />

        {/* Subtle Incandescent Gold Shimmer Flare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-screen"
          style={{
            background:
              "linear-gradient(105deg, transparent 20%, rgba(254, 240, 138, 0.6) 45%, rgba(245, 158, 11, 0.8) 50%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
};
