import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, X, ChevronRight, CheckCircle, HelpCircle } from "lucide-react";
import { mascotFor } from "../lib/brand";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

interface MascotDialogProps {
  districtOrder?: number;
  mode?: "welcome" | "quiz_tip" | "review_hint" | "completion" | "discussion_hint" | "custom";
  customTitle?: string;
  customMessage?: string;
  customQuote?: string;
}

export const SigmaMascotDialog: React.FC<MascotDialogProps> = ({
  districtOrder = 1,
  mode = "welcome",
  customTitle,
  customMessage,
  customQuote,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const mascot = mascotFor(districtOrder);

  const getDialogContent = () => {
    switch (mode) {
      case "quiz_tip":
        return {
          title: `${mascot.name} berbisik:`,
          text: "Waktumu 20 menit untuk 15 butir soal. Kerjakan soal yang kamu kuasai lebih dulu. Nilai minimal 75 untuk membuka distrik berikutnya!",
          quote: "Rumus bukan untuk dihafal mati, tapi dipahami polanya.",
        };
      case "review_hint":
        return {
          title: `Pesan Semangat dari ${mascot.name}:`,
          text: "Jangan berkecil hati! Pelajari kembali slide materi dengan teliti, perhatikan contoh soal & rumus LaTeX, lalu coba kuis kembali!",
          quote: "Setiap kesalahan adalah langkah kalkulasi menuju ketepatan.",
        };
      case "completion":
        return {
          title: `Perayaan dari ${mascot.name}:`,
          text: "Hebat sekali! Kamu berhasil menyelesaikan distrik ini dengan nilai memuaskan. Gerbang distrik berikutnya kini terbuka untukmu!",
          quote: "Gerbang SIGMA City terus meluas bersama pemahamanmu.",
        };
      case "discussion_hint":
        return {
          title: `${mascot.name} di Ruang Diskusi:`,
          text: "Ajukan pertanyaan jika kamu menemukan kendala pada soal atau konsep materi. Gunakan nama aslimu dan berikan upvote pada jawaban yang paling membantu!",
          quote: "Diskusi matematis membangun logika yang kokoh.",
        };
      case "welcome":
      default:
        return {
          title: `Salam dari ${mascot.name} (${mascot.role}):`,
          text: "Selamat datang di SIGMA City! Mari jelajahi setiap distrik matematika kelas 11 MA Darunnajah 9 secara terstruktur demi menaklukkan TKA.",
          quote: "Matematika adalah bahasa alam semesta.",
        };
    }
  };

  const content = {
    title: customTitle || getDialogContent().title,
    text: customMessage || getDialogContent().text,
    quote: customQuote || getDialogContent().quote,
  };

  if (!isOpen) return null;

  return (
    <div className="relative my-6 select-none" data-testid="mascot-companion-widget">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={prefersReduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            animate={prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 rounded-full border border-sigma-cyan/40 bg-sigma-panel/80 px-4 py-2 backdrop-blur-md transition-colors hover:border-sigma-cyan hover:bg-sigma-panel"
            title="Buka saran maskot"
          >
            <img
              src={mascot.img}
              alt={mascot.name}
              className="h-7 w-7 rounded-full object-cover border border-sigma-cyan/60"
            />
            <span className="mono text-xs font-semibold text-sigma-cyan">
              Tips {mascot.name}
            </span>
            <Sparkles size={13} className="text-sigma-yellow" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={prefersReduced ? { opacity: 0 } : { y: 15, opacity: 0 }}
            animate={prefersReduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { y: 15, opacity: 0 }}
            className="relative overflow-hidden rounded-2xl border border-sigma-cyan/30 bg-gradient-to-r from-sigma-panel/95 via-sigma-deep/90 to-sigma-panel/95 p-5 shadow-lg backdrop-blur-lg"
          >
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={mascot.img}
                  alt={mascot.name}
                  className={`h-16 w-16 rounded-2xl border-2 border-sigma-cyan/50 object-cover shadow-md ${
                    prefersReduced ? "" : "anim-float"
                  }`}
                />
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-sigma-cyan text-[0.6rem] font-bold text-sigma-void">
                  Σ
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="mono text-xs font-bold text-sigma-cyan uppercase tracking-wider">
                      {content.title}
                    </p>
                    <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-medium text-slate-300">
                      {mascot.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="rounded p-1 text-slate-400 hover:text-white"
                      title="Sembunyikan pesan"
                    >
                      <span className="mono text-[0.65rem] underline mr-1">ciutkan</span>
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded p-1 text-slate-400 hover:text-sigma-magenta"
                      title="Tutup pesan"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
                  {content.text}
                </p>

                {content.quote && (
                  <p className="mt-2 text-xs italic text-sigma-yellow/90 flex items-center gap-1.5">
                    <Sparkles size={11} className="shrink-0" />
                    "{content.quote}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
