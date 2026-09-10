import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  MessageSquare,
  RotateCcw,
  Target,
} from "lucide-react";
import { api } from "../lib/api";
import { accentFor, mascotFor } from "../lib/brand";
import { Loader } from "../components/Primitives";
import { Reveal } from "../components/Reveal";

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [quizState, setQuizState] = useState(null);

  useEffect(() => {
    api(`/modules/${moduleId}`)
      .then(setData)
      .catch(() => nav("/app"));
    api(`/modules/${moduleId}/quiz/state`)
      .then(setQuizState)
      .catch(() => setQuizState({ questions_ready: 0, can_start: false }));
  }, [moduleId, nav]);

  if (!data) return <Loader label="Membuka gerbang modul..." />;

  const { module, progress } = data;
  const accent = accentFor(module.order_index);
  const mascot = mascotFor(module.order_index);
  const done = progress.status === "completed";
  const mustReview = progress.must_review_material;
  const noQuiz = (quizState?.questions_ready || 0) === 0;

  return (
    <div className="space-y-10">
      <Link to="/app" className="btn-ghost" data-testid="back-to-journey">
        <ArrowLeft size={15} /> Peta SIGMA City
      </Link>

      <section
        className="relative overflow-hidden rounded-[2rem] border p-7 sm:p-12"
        style={{
          borderColor: `${accent.hex}44`,
          background: `linear-gradient(150deg, ${accent.hex}1a, rgba(11,7,30,0.92))`,
        }}
      >
        <span
          className="mono pointer-events-none absolute -bottom-14 right-0 text-[11rem] font-bold opacity-10"
          style={{ color: accent.hex }}
        >
          {accent.symbol}
        </span>
        <div className="relative flex flex-wrap items-start gap-8">
          <div className="min-w-0 flex-1">
            <p className="mono text-[0.66rem] uppercase tracking-[0.26em]" style={{ color: accent.hex }}>
              Modul {String(module.order_index).padStart(2, "0")} · {module.district_name}
            </p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight text-white sm:text-5xl">
              {module.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {module.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span
                className="mono inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em]"
                style={{
                  background: done ? "#10b98122" : `${accent.hex}22`,
                  color: done ? "#10B981" : accent.hex,
                }}
                data-testid="module-detail-status"
              >
                {done ? <CheckCircle2 size={12} /> : <Target size={12} />}
                {done ? "Selesai" : "Terbuka"}
              </span>
              <span className="mono inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-slate-300">
                <Clock size={12} /> ± {module.estimated_minutes} menit
              </span>
              <span className="mono inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-slate-300">
                <FileText size={12} /> {data.slide_count} slide
              </span>
              <span className="mono inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-slate-300">
                <ListChecks size={12} /> {data.question_count} soal
              </span>
            </div>
          </div>
          <img
            src={mascot.img}
            alt={mascot.name}
            className="anim-float hidden w-36 rounded-[1.5rem] object-cover shadow-[0_28px_60px_-28px_rgba(0,240,255,0.7)] lg:block"
          />
        </div>
      </section>

      {mustReview && (
        <div
          className="flex flex-wrap items-center gap-4 rounded-3xl border border-sigma-magenta/40 bg-sigma-magenta/10 p-6"
          data-testid="must-review-banner"
        >
          <RotateCcw size={22} className="text-sigma-magenta" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold text-white">
              Tinjau materi sebelum mencoba lagi
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Nilai kuis terakhirmu di bawah 75. Buka kembali seluruh materi terlebih dahulu — kuis
              akan aktif setelah kamu menyelesaikan peninjauan.
            </p>
          </div>
          <Link to={`/app/modul/${moduleId}/materi`} className="btn-sigma btn-magenta text-xs">
            Buka Materi <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <section>
        <p className="overline-label">Tujuan pembelajaran</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(module.learning_objectives || []).map((o, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-sigma-panel/50 p-5">
                <span className="mono text-sm font-bold text-sigma-cyan">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-slate-300">{o}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Reveal>
          <div className="flex h-full flex-col rounded-3xl border border-sigma-cyan/30 bg-sigma-panel/60 p-7">
            <FileText size={22} className="text-sigma-cyan" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">Materi</h3>
            <p className="mt-2 flex-1 text-sm text-slate-400">
              {data.slide_count} slide presentasi dengan rumus, contoh, dan latihan bertipe TKA.
            </p>
            <Link
              to={`/app/modul/${moduleId}/materi`}
              className="btn-sigma mt-6 text-xs"
              data-testid="start-learning-button"
            >
              Mulai Belajar <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col rounded-3xl border border-sigma-yellow/30 bg-sigma-panel/60 p-7">
            <ListChecks size={22} className="text-sigma-yellow" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">Kuis</h3>
            <p className="mt-2 flex-1 text-sm text-slate-400">
              {data.question_count || 15} soal pilihan ganda · 20 menit · nilai kelulusan 75.
              Umpan balik muncul hanya setelah pengumpulan.
            </p>
            {noQuiz ? (
              <p className="mono mt-6 rounded-full bg-white/5 px-4 py-3 text-center text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">
                Soal belum disiapkan guru
              </p>
            ) : (
              <Link
                to={`/app/modul/${moduleId}/kuis`}
                className={`btn-sigma btn-yellow mt-6 text-xs ${
                  mustReview ? "pointer-events-none opacity-40 grayscale" : ""
                }`}
                data-testid="start-quiz-button"
              >
                {done ? "Lihat Hasil" : "Mulai Kuis"} <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex h-full flex-col rounded-3xl border border-sigma-magenta/30 bg-sigma-panel/60 p-7">
            <MessageSquare size={22} className="text-sigma-magenta" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">Diskusi</h3>
            <p className="mt-2 flex-1 text-sm text-slate-400">
              Tanyakan soal yang sulit, bantu temanmu, dan lihat jawaban yang disematkan guru.
            </p>
            <Link
              to={`/app/modul/${moduleId}/diskusi`}
              className="btn-sigma btn-magenta mt-6 text-xs"
              data-testid="join-discussion-button"
            >
              Buka Diskusi <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
