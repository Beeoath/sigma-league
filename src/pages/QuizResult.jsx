import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Map,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "../lib/api";
import { mascotFor } from "../lib/brand";
import { Loader, StatTile } from "../components/Primitives";
import { MathText } from "../components/MathText";
import { SigmaMascotDialog } from "../components/SigmaMascotDialog";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

export default function QuizResult() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    api(`/attempts/${attemptId}/result`)
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [attemptId]);

  if (err) {
    return (
      <div className="mx-auto max-w-xl text-center py-12">
        <p className="text-sigma-magenta font-mono text-sm">{err}</p>
        <Link to="/app" className="btn-ghost mt-4 inline-flex items-center gap-2">
          Kembali ke Peta SIGMA City
        </Link>
      </div>
    );
  }

  if (!data) return <Loader label="Menghitung skor & kunci pembahasan..." />;

  const { attempt, module, total_questions, incorrect_count, passing_score, next_module, review = [] } = data;
  const passed = attempt.passed;
  const mascot = mascotFor(module?.order_index || 1);
  const color = passed ? "#10B981" : "#FF007A";

  const displayedReview = showOnlyIncorrect
    ? review.filter((r) => !r.is_correct)
    : review;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16" data-testid="quiz-result-view">
      {/* Top Header Result Card */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2rem] border p-8 text-center sm:p-12 shadow-2xl"
        style={{
          borderColor: `${color}55`,
          background: `linear-gradient(160deg, ${color}1c, rgba(11,7,30,0.94))`,
        }}
        data-testid="quiz-result-card"
      >
        <img
          src={mascot.img}
          alt={mascot.name}
          className={`mx-auto h-24 w-24 rounded-2xl object-cover border-2 shadow-lg ${
            prefersReduced ? "" : "anim-float"
          }`}
          style={{ borderColor: color }}
        />
        <p className="overline-label mt-5" style={{ color }}>
          {module?.district_name || "SIGMA District"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black text-white sm:text-5xl">
          {passed ? "Kuis Berhasil Diselesaikan!" : "Belum Lulus — Tetap Semangat!"}
        </h1>

        <div className="mt-7">
          <motion.p
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mono text-6xl font-black tabular-nums sm:text-7xl"
            style={{ color }}
            data-testid="result-score"
          >
            {attempt.score}
          </motion.p>
          <p className="mono mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
            Skor Total (Batas Lulus: {passing_score}/100)
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Jawaban Benar"
            value={`${attempt.correct_count} / ${total_questions}`}
            accent="#10B981"
            testid="result-correct"
          />
          <StatTile
            label="Jawaban Salah"
            value={incorrect_count}
            accent="#FF007A"
            testid="result-incorrect"
          />
          <StatTile
            label="Status Distrik"
            value={passed ? "LULUS (75+)" : "REMIDI (<75)"}
            accent={color}
            testid="result-status"
          />
        </div>

        {attempt.status === "expired" && (
          <p className="mono mt-5 text-xs uppercase tracking-wider text-sigma-yellow">
            * Dikumpulkan otomatis saat waktu 20 menit berakhir
          </p>
        )}
      </motion.div>

      {/* Mascot Dialog Feedback */}
      <SigmaMascotDialog
        districtOrder={module?.order_index || 1}
        mode={passed ? "completion" : "review_hint"}
      />

      {/* Next Step Guidance Box */}
      <div
        className="rounded-3xl border p-7 shadow-lg"
        style={{ borderColor: `${color}44`, background: `${color}0d` }}
        data-testid="result-next-step"
      >
        {passed ? (
          <>
            <p className="flex items-center gap-3 font-display text-lg font-bold text-white">
              <CheckCircle2 size={22} style={{ color }} /> Modul {module?.order_index} — {module?.title} Tuntas
            </p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {next_module
                ? `Selamat! Distrik berikutnya (${next_module.order_index} — ${next_module.district_name}) sekarang telah terbuka untuk dipelajari.`
                : "Luar biasa! Kamu telah menuntaskan seluruh 5 distrik matematika di SIGMA City MA Darunnajah 9."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {next_module && (
                <Link
                  to={`/app/modul/${next_module.id}`}
                  className="btn-sigma text-xs py-2.5 px-5 font-semibold"
                  data-testid="result-next-module-button"
                >
                  Buka {next_module.district_name} <ArrowRight size={15} />
                </Link>
              )}
              <Link to="/app" className="btn-ghost">
                <Map size={15} /> Peta SIGMA City
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="flex items-center gap-3 font-display text-lg font-bold text-white">
              <XCircle size={22} style={{ color }} /> Nilai Minimal 75 Belum Tercapai
            </p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Sesuai aturan kurikulum, kamu wajib meninjau kembali materi modul ini sampai tuntas sebelum dapat mencoba kuis kembali. Perhatikan pembahasan rumus KaTeX di bawah untuk memperbaiki pemahamanmu!
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/app/modul/${module?.id}/materi`}
                className="btn-sigma btn-magenta text-xs py-2.5 px-5 font-semibold"
                data-testid="result-review-material-button"
              >
                <FileText size={15} /> Pelajari Materi Kembali
              </Link>
              <Link to={`/app/modul/${module?.id}/diskusi`} className="btn-ghost">
                Tanya Teman di Ruang Diskusi
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Comprehensive 15-Question Review Section (Rule 6) */}
      <section className="space-y-6 pt-4" data-testid="quiz-review-section">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Kunci Jawaban & Pembahasan Lengkap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tinjau langkah matematis untuk seluruh 15 butir soal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnlyIncorrect(false)}
              className={`rounded-full px-3 py-1 text-xs mono transition-colors ${
                !showOnlyIncorrect
                  ? "bg-sigma-cyan text-sigma-void font-bold"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Semua ({review.length})
            </button>
            <button
              type="button"
              onClick={() => setShowOnlyIncorrect(true)}
              className={`rounded-full px-3 py-1 text-xs mono transition-colors ${
                showOnlyIncorrect
                  ? "bg-sigma-magenta text-white font-bold"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Salah Saja ({incorrect_count})
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {displayedReview.map((item, idx) => {
            const isCorrect = item.is_correct;
            const itemColor = isCorrect ? "#10B981" : "#FF007A";

            return (
              <div
                key={item.question_id || idx}
                className="rounded-3xl border border-white/10 bg-sigma-panel/60 p-6 sm:p-7 shadow-md"
                data-testid={`review-item-${item.order_index}`}
              >
                {/* Header Question with Indicator */}
                <div className="flex items-start gap-4">
                  <span
                    className="mono grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black"
                    style={{
                      backgroundColor: `${itemColor}20`,
                      color: itemColor,
                      border: `1px solid ${itemColor}50`,
                    }}
                  >
                    {item.order_index}
                  </span>
                  <div className="min-w-0 flex-1">
                    <MathText className="mono text-base font-medium text-white leading-relaxed">
                      {item.question_text}
                    </MathText>
                  </div>
                  <span
                    className="mono shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: `${itemColor}1a`,
                      color: itemColor,
                    }}
                  >
                    {isCorrect ? "BENAR" : "SALAH"}
                  </span>
                </div>

                {/* Options List with status */}
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {(item.options || []).map((optText, optIdx) => {
                    const isTheCorrectAnswer = optIdx === item.correct_index;
                    const isTheUserSelected = optIdx === item.user_answer_index;

                    let optBorder = "border-white/10 bg-white/[0.02] text-slate-400";
                    if (isTheCorrectAnswer) {
                      optBorder = "border-sigma-emerald/70 bg-sigma-emerald/15 text-white font-medium ring-1 ring-sigma-emerald/40";
                    } else if (isTheUserSelected && !isCorrect) {
                      optBorder = "border-sigma-magenta/70 bg-sigma-magenta/15 text-white ring-1 ring-sigma-magenta/40";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs sm:text-sm ${optBorder}`}
                      >
                        <span
                          className={`mono grid h-6 w-6 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                            isTheCorrectAnswer
                              ? "bg-sigma-emerald text-sigma-void"
                              : isTheUserSelected
                              ? "bg-sigma-magenta text-white"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <MathText as="span" className="mono">
                            {optText}
                          </MathText>
                        </div>
                        {isTheCorrectAnswer && (
                          <span className="mono text-[0.68rem] text-sigma-emerald font-bold">
                            ✓ Kunci
                          </span>
                        )}
                        {isTheUserSelected && !isCorrect && (
                          <span className="mono text-[0.68rem] text-sigma-magenta font-bold">
                            ✗ Pilihanmu
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mathematical Explanation in KaTeX */}
                {item.explanation && (
                  <div className="mt-5 rounded-2xl border border-sigma-cyan/20 bg-sigma-void/60 p-4 sm:p-5">
                    <p className="mono text-xs font-bold text-sigma-cyan flex items-center gap-2">
                      <Sparkles size={13} />
                      Pembahasan Langkah Demi Langkah:
                    </p>
                    <div className="mt-2 text-sm text-slate-200 leading-relaxed">
                      <MathText className="mono">{item.explanation}</MathText>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
