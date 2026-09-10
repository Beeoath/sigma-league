import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { accentFor, mascotFor } from "../lib/brand";
import { Loader } from "../components/Primitives";
import { MathText } from "../components/MathText";

export default function Material() {
  const { moduleId } = useParams();
  const nav = useNavigate();
  const [slides, setSlides] = useState(null);
  const [module, setModule] = useState(null);
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    api(`/modules/${moduleId}`)
      .then((d) => setModule(d.module))
      .catch(() => nav("/app"));
    api(`/modules/${moduleId}/slides`)
      .then(setSlides)
      .catch(() => setSlides([]));
  }, [moduleId, nav]);

  const markReviewed = useCallback(async () => {
    if (reviewed) return;
    setReviewed(true);
    try {
      await api(`/modules/${moduleId}/material-reviewed`, { method: "POST" });
    } catch {
      /* non blocking */
    }
  }, [moduleId, reviewed]);

  const go = useCallback(
    (dir) => {
      setI((prev) => {
        const next = Math.min(Math.max(prev + dir, 0), (slides?.length || 1) - 1);
        if (slides && next === slides.length - 1) markReviewed();
        return next;
      });
    },
    [slides, markReviewed]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!slides || !module) return <Loader label="Menyiapkan materi..." />;

  if (slides.length === 0) {
    return (
      <div className="space-y-8">
        <Link to={`/app/modul/${moduleId}`} className="btn-ghost">
          <ArrowLeft size={15} /> Kembali
        </Link>
        <p className="text-slate-300">Materi untuk modul ini belum tersedia.</p>
      </div>
    );
  }

  const accent = accentFor(module.order_index);
  const mascot = mascotFor(module.order_index);
  const slide = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className={full ? "fixed inset-0 z-50 overflow-y-auto bg-sigma-void p-4 sm:p-8" : "space-y-7"}>
      <div className="flex flex-wrap items-center gap-3">
        {!full && (
          <Link to={`/app/modul/${moduleId}`} className="btn-ghost" data-testid="material-back-button">
            <ArrowLeft size={15} /> Modul
          </Link>
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="mono text-xs uppercase tracking-[0.2em] text-slate-400" data-testid="slide-counter">
            Slide {i + 1} / {slides.length}
          </span>
          <button
            onClick={() => setFull((f) => !f)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-sigma-cyan hover:text-sigma-cyan"
            aria-label={full ? "Keluar layar penuh" : "Layar penuh"}
            data-testid="fullscreen-toggle"
          >
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent.hex }}
          animate={{ width: `${((i + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          data-testid="material-progress-bar"
        />
      </div>

      <div
        className="relative overflow-hidden rounded-[2rem] border bg-sigma-panel/70 p-7 sm:p-12"
        style={{ borderColor: `${accent.hex}33`, minHeight: full ? "70vh" : "56vh" }}
      >
        <span
          className="mono pointer-events-none absolute -bottom-12 right-2 text-[10rem] font-bold opacity-[0.07]"
          style={{ color: accent.hex }}
        >
          {accent.symbol}
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p className="mono text-[0.66rem] uppercase tracking-[0.26em]" style={{ color: accent.hex }}>
              {module.district_name}
            </p>
            <h2 className="mt-3 font-display text-2xl font-black leading-tight text-white sm:text-4xl">
              <MathText as="span">{slide.title}</MathText>
            </h2>
            {slide.image_url && (
              <img
                src={slide.image_url}
                alt=""
                className="mt-6 max-h-64 w-full rounded-2xl border border-white/10 object-cover"
              />
            )}
            <MathText className="mono mt-7 text-[0.95rem] leading-loose text-slate-200 sm:text-base">
              {slide.content}
            </MathText>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="btn-ghost"
          data-testid="slide-prev-button"
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>

        {last ? (
          <>
            <button
              onClick={async () => {
                await markReviewed();
                toast.success("Materi selesai ditinjau. Kuis sudah aktif.");
                nav(`/app/modul/${moduleId}/kuis`);
              }}
              className="btn-sigma btn-yellow text-xs"
              data-testid="material-to-quiz-button"
            >
              <ListChecks size={15} /> Lanjut ke Kuis
            </button>
            <span className="mono inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.18em] text-sigma-emerald">
              <CheckCircle2 size={13} /> materi selesai
            </span>
          </>
        ) : (
          <button onClick={() => go(1)} className="btn-sigma text-xs" data-testid="slide-next-button">
            Berikutnya <ChevronRight size={16} />
          </button>
        )}

        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <img src={mascot.img} alt="" className="anim-float h-14 w-14 rounded-xl object-cover" />
          <p className="max-w-[15rem] text-xs text-slate-400">
            {mascot.name}: “Baca perlahan, satu slide satu ide.”
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            data-testid={`slide-dot-${idx + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: idx === i ? 34 : 12,
              background: idx === i ? accent.hex : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>

      {!full && (
        <Link
          to={`/app/modul/${moduleId}/diskusi`}
          className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-sigma-magenta"
        >
          Ada yang belum jelas? Buka diskusi modul <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}
