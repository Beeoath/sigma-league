import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Loader2,
  Send,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { accentFor, mascotFor } from "../lib/brand";
import { Loader } from "../components/Primitives";
import { MathText } from "../components/MathText";
import { SigmaMascotDialog } from "../components/SigmaMascotDialog";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const fmt = (s) => {
  const m = Math.floor(Math.max(s, 0) / 60);
  const r = Math.max(s, 0) % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

export default function Quiz() {
  const { moduleId } = useParams();
  const nav = useNavigate();
  const [state, setState] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const submitting = useRef(false);
  const prefersReduced = usePrefersReducedMotion();

  const load = useCallback(async () => {
    try {
      const s = await api(`/modules/${moduleId}/quiz/state`);
      setState(s);
      if (s.active_attempt_id) {
        const a = await api(`/attempts/${s.active_attempt_id}`);
        setAttempt(a);
        setAnswers(a.answers || {});
        setLeft(a.remaining_seconds);
      }
    } catch (e) {
      console.error(e);
      nav(`/app/modul/${moduleId}`);
    }
  }, [moduleId, nav]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = useCallback(
    async (auto = false) => {
      if (submitting.current || !attempt) return;
      submitting.current = true;
      setBusy(true);
      try {
        const res = await api(`/attempts/${attempt.attempt_id}/submit`, { method: "POST" });
        if (auto) toast.warning("Waktu 20 menit habis — jawabanmu otomatis dikumpulkan.");
        else toast.success("Kuis berhasil dikumpulkan!");
        nav(`/app/hasil/${res.attempt.id}`, { replace: true });
      } catch (e) {
        toast.error(e.message || "Gagal mengumpulkan kuis");
        submitting.current = false;
        setBusy(false);
      }
    },
    [attempt, nav]
  );

  // 20-minute countdown timer with auto-submit
  useEffect(() => {
    if (!attempt) return;
    const id = setInterval(() => {
      const remaining = Math.round((new Date(attempt.expires_at) - new Date()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        submit(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [attempt, submit]);

  if (!state) return <Loader label="Memeriksa status kuis distrik..." />;

  const accent = accentFor(1);
  const mascot = mascotFor(1);

  /* ---------- GATE: must review material (Rule 7) ---------- */
  if (!attempt && state.must_review_material) {
    return (
      <div className="mx-auto max-w-2xl space-y-8" data-testid="quiz-review-gate">
        <Link to={`/app/modul/${moduleId}`} className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft size={15} /> Kembali ke Modul
        </Link>
        <div className="rounded-[2rem] border border-sigma-magenta/40 bg-sigma-magenta/10 p-8 sm:p-11 text-center shadow-xl">
          <AlertTriangle size={36} className="mx-auto text-sigma-magenta" />
          <h1 className="mt-5 font-display text-2xl font-black text-white sm:text-3xl">
            Tinjau Materi Terlebih Dahulu
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-300 leading-relaxed">
            Nilai kuis terakhirmu <span className="font-bold text-sigma-magenta">{state.last_attempt?.score || 0}</span> — belum mencapai batas minimum 75. Sesuai aturan akademik, pelajari kembali materi modul sampai slide terakhir agar kuis terbuka kembali!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={`/app/modul/${moduleId}/materi`}
              className="btn-sigma btn-magenta text-xs font-semibold px-6 py-3"
              data-testid="gate-review-material-button"
            >
              <FileText size={16} /> Pelajari Materi Kembali
            </Link>
          </div>
        </div>

        <SigmaMascotDialog
          districtOrder={1}
          mode="review_hint"
          customTitle="Saran dari Maskot Distrik:"
          customMessage="Jangan menyerah! Buka kembali rumus-rumus di slide materi, pahami contoh penerapannya, lalu buktikan pemahamanmu di kuis berikutnya."
        />
      </div>
    );
  }

  /* ---------- ALREADY COMPLETED ---------- */
  if (!attempt && state.module_status === "completed") {
    return (
      <div className="mx-auto max-w-2xl space-y-8" data-testid="quiz-completed-state">
        <Link to={`/app/modul/${moduleId}`} className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft size={15} /> Kembali ke Modul
        </Link>
        <div className="rounded-[2rem] border border-sigma-emerald/40 bg-sigma-emerald/10 p-8 sm:p-11 text-center shadow-xl">
          <CheckCircle2 size={36} className="mx-auto text-sigma-emerald" />
          <h1 className="mt-5 font-display text-2xl font-black text-white sm:text-3xl">
            Distrik Ini Telah Selesai!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-300 leading-relaxed">
            Skor kuis terbaikmu <span className="font-bold text-sigma-emerald">{state.last_attempt?.score || 100} / 100</span>. Gerbang distrik berikutnya telah terbuka untukmu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {state.last_attempt && (
              <Link to={`/app/hasil/${state.last_attempt.id}`} className="btn-sigma text-xs">
                Lihat Hasil Kuis
              </Link>
            )}
            <Link to={`/app/modul/${moduleId}/materi`} className="btn-ghost">
              Baca Ulang Materi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- BRIEFING BEFORE START ---------- */
  if (!attempt) {
    const start = async () => {
      setBusy(true);
      try {
        const a = await api(`/modules/${moduleId}/quiz/start`, { method: "POST" });
        setAttempt(a);
        setAnswers(a.answers || {});
        setLeft(a.remaining_seconds);
      } catch (e) {
        toast.error(e.message || "Gagal memulai kuis");
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="mx-auto max-w-2xl space-y-8" data-testid="quiz-briefing">
        <Link to={`/app/modul/${moduleId}`} className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft size={15} /> Modul
        </Link>

        <div className="rounded-[2rem] glass p-8 sm:p-11 border border-sigma-cyan/20">
          <div className="flex items-start gap-5">
            <img
              src={mascot.img}
              alt={mascot.name}
              className={`h-20 w-20 rounded-2xl object-cover border border-sigma-cyan/40 ${prefersReduced ? "" : "anim-float"}`}
            />
            <div>
              <p className="overline-label">Simulasi TKA Matematika</p>
              <h1 className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">
                15 Soal Pilihan Ganda · 20 Menit
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Standar Kuis SIGMA Kelas 11 MA Darunnajah 9
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-2xl bg-white/[0.03] p-5 border border-white/5 text-sm text-slate-300">
            {[
              "Tepat 15 soal pilihan ganda berstandar TKA MA Darunnajah 9.",
              "Durasi tepat 20 menit berjalan otomatis saat kamu menekan tombol mulai.",
              "Jawaban tersimpan otomatis secara berkala.",
              "Gunakan penanda 'Ragu-ragu' pada navigator soal untuk mereview jawaban.",
              "Batas kelulusan adalah 75/100 untuk membuka distrik matematika berikutnya.",
              "Umpan balik dan kunci pembahasan KaTeX muncul lengkap setelah kamu mengumpulkan.",
            ].map((ruleText, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="mono text-xs font-bold text-sigma-cyan shrink-0 pt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-200">{ruleText}</span>
              </div>
            ))}
          </div>

          {state.last_attempt && (
            <div className="mono mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400 flex items-center justify-between">
              <span>Nilai Percobaan Terakhir:</span>
              <span className={`font-bold ${state.last_attempt.score >= 75 ? "text-sigma-emerald" : "text-sigma-magenta"}`}>
                {state.last_attempt.score} / 100
              </span>
            </div>
          )}

          <button
            onClick={start}
            disabled={busy}
            className="btn-sigma btn-yellow mt-8 w-full text-xs py-3.5"
            data-testid="quiz-begin-button"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
            Mulai Kuis Sekarang (20 Menit)
          </button>
        </div>

        <SigmaMascotDialog
          districtOrder={1}
          mode="quiz_tip"
        />
      </div>
    );
  }

  /* ---------- RUNNER INTERFACE ---------- */
  const answeredCount = Object.keys(answers).length;
  const questionsList = attempt.questions || [];
  const totalQuestions = questionsList.length || 15;
  const isDangerTime = left <= 180; // 3 minutes warning

  const pickAnswer = async (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    try {
      await api(`/attempts/${attempt.attempt_id}/answer`, {
        method: "POST",
        body: { question_id: questionId, selected_index: optionIndex },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const scrollToQuestion = (idx) => {
    setActiveQuestionIndex(idx);
    const element = document.getElementById(`question-card-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-6 pb-16" data-testid="quiz-active-runner">
      {/* Sticky Quiz Header & Question Navigator */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-white/10 bg-sigma-deep/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="mono text-[0.65rem] uppercase tracking-wider text-sigma-cyan">
              Simulasi Kuis Distrik
            </span>
            <p className="font-display text-sm font-bold text-white flex items-center gap-2">
              <span>Terjawab:</span>
              <span className="mono font-extrabold text-sigma-yellow" data-testid="quiz-answered-count">
                {answeredCount} / {totalQuestions}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 20-minute countdown */}
            <div
              className={`mono flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-base font-bold tabular-nums border ${
                isDangerTime
                  ? "border-sigma-magenta bg-sigma-magenta/20 text-sigma-magenta animate-pulse"
                  : "border-sigma-cyan/40 bg-sigma-cyan/10 text-sigma-cyan"
              }`}
              data-testid="quiz-timer"
              aria-live="polite"
              title="Waktu pengerjaan tersisa"
            >
              <Clock size={16} />
              <span>{fmt(left)}</span>
            </div>

            <button
              onClick={() => submit(false)}
              disabled={busy}
              className="btn-sigma text-xs py-2 px-4 shadow-md"
              data-testid="quiz-submit-button"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              <span>Kumpulkan</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sigma-cyan via-sigma-yellow to-sigma-emerald"
            animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Sticky 15-Question Navigator Bar */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar" data-testid="question-navigator">
          {questionsList.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flagged[q.id];
            const isActive = activeQuestionIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(idx)}
                className={`mono relative h-8 w-8 shrink-0 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "ring-2 ring-sigma-cyan bg-sigma-cyan text-sigma-void scale-105"
                    : isFlagged
                    ? "border border-sigma-yellow bg-sigma-yellow/20 text-sigma-yellow"
                    : isAnswered
                    ? "border border-sigma-emerald bg-sigma-emerald/20 text-sigma-emerald"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white"
                }`}
                title={`Nomor ${idx + 1} ${isAnswered ? "(Terjawab)" : "(Belum)"} ${isFlagged ? "[Ragu]" : ""}`}
                data-testid={`nav-bubble-${idx + 1}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-sigma-yellow ring-1 ring-sigma-void" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 15 Question Cards */}
      <div className="space-y-6">
        {questionsList.map((q, qi) => {
          const rawOptions = q.options || q.quiz_options || [];
          const isFlagged = flagged[q.id];
          const selectedOption = answers[q.id];

          return (
            <div
              key={q.id}
              id={`question-card-${qi}`}
              className={`rounded-3xl border p-6 sm:p-8 transition-all ${
                activeQuestionIndex === qi
                  ? "border-sigma-cyan/60 bg-sigma-panel/85 shadow-lg shadow-sigma-cyan/5"
                  : "border-white/10 bg-sigma-panel/50 hover:border-white/20"
              }`}
              data-testid={`quiz-question-${qi + 1}`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span
                    className="mono grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black border"
                    style={{
                      background: `${accent.hex}18`,
                      color: accent.hex,
                      borderColor: `${accent.hex}40`,
                    }}
                  >
                    {qi + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <MathText className="mono text-base font-medium leading-relaxed text-white">
                      {q.question_text}
                    </MathText>
                  </div>
                </div>

                {/* Flag Question Toggle (Ragu-ragu) */}
                <button
                  type="button"
                  onClick={() => toggleFlag(q.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs mono transition-colors ${
                    isFlagged
                      ? "bg-sigma-yellow/20 text-sigma-yellow border border-sigma-yellow/40"
                      : "bg-white/5 text-slate-400 hover:text-white border border-transparent"
                  }`}
                  title={isFlagged ? "Hapus tanda ragu" : "Tandai ragu-ragu"}
                  data-testid={`flag-btn-${qi + 1}`}
                >
                  <Flag size={13} className={isFlagged ? "fill-sigma-yellow" : ""} />
                  <span className="hidden sm:inline">{isFlagged ? "Ragu" : "Tandai"}</span>
                </button>
              </div>

              {/* Multiple Choice Options (A, B, C, D) */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {rawOptions.map((opt, oi) => {
                  const optIndex = opt.index !== undefined ? opt.index : oi;
                  const isSelected = selectedOption === optIndex;

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => pickAnswer(q.id, optIndex)}
                      data-testid={`quiz-option-${qi + 1}-${oi + 1}`}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-sigma-cyan bg-sigma-cyan/15 text-white shadow-sm ring-1 ring-sigma-cyan/40"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span
                        className={`mono grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black transition-colors ${
                          isSelected
                            ? "bg-sigma-cyan text-sigma-void"
                            : "bg-white/10 text-slate-400 group-hover:text-white"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <MathText as="span" className="mono text-sm leading-snug">
                        {opt.option_text}
                      </MathText>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Actions */}
      <div className="rounded-3xl border border-white/10 bg-sigma-panel/70 p-7 text-center shadow-lg">
        <p className="text-sm text-slate-300">
          Semua jawaban tersimpan. Kamu telah menjawab{" "}
          <strong className="text-sigma-cyan">{answeredCount} dari {totalQuestions}</strong> butir soal.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Umpan balik komprehensif dan pembahasan KaTeX ditampilkan tepat setelah pengumpulan.
        </p>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => submit(false)}
            disabled={busy}
            className="btn-sigma btn-yellow text-xs py-3.5 px-8 shadow-xl font-bold"
            data-testid="quiz-submit-bottom-button"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Kumpulkan Lembar Jawaban Kuis
          </button>
        </div>
      </div>
    </div>
  );
}
