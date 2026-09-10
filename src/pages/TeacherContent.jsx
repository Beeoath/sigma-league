import { useCallback, useEffect, useState } from "react";
import { Check, FileText, ListChecks, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { accentFor } from "../lib/brand";
import { Loader } from "../components/Primitives";
import { MathText } from "../components/MathText";

const SAMPLE = `1. Akar-akar dari $x^2 - 7x + 12 = 0$ adalah ...
A. 2 dan 6
*B. 3 dan 4
C. -3 dan -4
D. 1 dan 12

2. Nilai diskriminan dari $2x^2 + 3x - 5 = 0$ adalah ...
A. 9
B. 19
C. 49
D. -31
Jawaban: C`;

const emptySlide = { slide_order: 1, title: "", content: "", image_url: "" };
const emptyQuestion = {
  order_index: 1,
  question_text: "",
  options: [
    { option_text: "", is_correct: true },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ],
};

export default function TeacherContent() {
  const [modules, setModules] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("slides");
  const [slides, setSlides] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [slideForm, setSlideForm] = useState(null);
  const [qForm, setQForm] = useState(null);
  const [bulk, setBulk] = useState(null);
  const [preview, setPreview] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/modules").then((ms) => {
      setModules(ms);
      if (ms.length) setActiveId(ms[0].id);
    });
  }, []);

  const load = useCallback(async () => {
    if (!activeId) return;
    try {
      const [s, q] = await Promise.all([
        api(`/modules/${activeId}/slides`),
        api(`/teacher/modules/${activeId}/questions`),
      ]);
      setSlides(Array.isArray(s) ? s : []);
      setQuestions(Array.isArray(q?.questions) ? q.questions : []);
    } catch {
      setSlides([]);
      setQuestions([]);
    }
  }, [activeId]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  if (!modules) return <Loader label="Memuat konten modul..." />;

  const active = modules.find((m) => m.id === activeId);
  const accent = accentFor(active?.order_index || 1);

  const saveSlide = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...slideForm, image_url: slideForm.image_url || null };
      delete body.id;
      if (slideForm.id) await api(`/teacher/slides/${slideForm.id}`, { method: "PUT", body });
      else await api(`/teacher/modules/${activeId}/slides`, { method: "POST", body });
      toast.success("Slide disimpan.");
      setSlideForm(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const delSlide = async (id) => {
    try {
      await api(`/teacher/slides/${id}`, { method: "DELETE" });
      toast.success("Slide dihapus.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const saveQuestion = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = {
        order_index: Number(qForm.order_index),
        question_text: qForm.question_text,
        options: qForm.options.filter((o) => o.option_text.trim()),
      };
      if (qForm.id) await api(`/teacher/questions/${qForm.id}`, { method: "PUT", body });
      else await api(`/teacher/modules/${activeId}/questions`, { method: "POST", body });
      toast.success("Soal disimpan.");
      setQForm(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const delQuestion = async (id) => {
    try {
      await api(`/teacher/questions/${id}`, { method: "DELETE" });
      toast.success("Soal dihapus.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const runPreview = async () => {
    setBusy(true);
    try {
      const res = await api("/teacher/questions/parse", {
        method: "POST",
        body: { raw_text: bulk },
      });
      setPreview(res);
      if (!res.count) toast.error("Tidak ada soal yang terdeteksi.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const runImport = async () => {
    setBusy(true);
    try {
      const res = await api(`/teacher/modules/${activeId}/questions/bulk`, {
        method: "POST",
        body: { raw_text: bulk, replace_existing: replaceExisting },
      });
      toast.success(`${res.created} soal diimpor · total ${res.total} soal.`);
      if (res.errors?.length) toast.warning(`${res.errors.length} blok dilewati.`);
      setBulk(null);
      setPreview(null);
      setReplaceExisting(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="overline-label">Panel konten</p>
        <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-4xl">
          Kelola Materi & Soal
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Susun slide materi dan bank soal untuk tiap distrik. Kuis membutuhkan 15 soal pilihan
          ganda dengan satu jawaban benar.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" data-testid="content-module-tabs">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveId(m.id);
              setSlideForm(null);
              setQForm(null);
            }}
            data-testid={`content-module-tab-${m.order_index}`}
            className={`rounded-full px-4 py-2 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors ${
              activeId === m.id
                ? "bg-sigma-cyan/15 text-sigma-cyan"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            M{m.order_index} · {m.district_name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl glass p-6">
        <div className="min-w-0 flex-1">
          <p className="mono text-[0.64rem] uppercase tracking-[0.2em]" style={{ color: accent.hex }}>
            Modul {active?.order_index}
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-white">{active?.title}</h2>
        </div>
        <span className="mono text-xs text-slate-400" data-testid="content-counts">
          {slides.length} slide · {questions.length} soal
        </span>
      </div>

      <div className="flex gap-2">
        {[
          { id: "slides", label: "Materi", icon: FileText },
          { id: "quiz", label: "Soal Kuis", icon: ListChecks },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`content-tab-${t.id}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors ${
                tab === t.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "slides" && (
        <section className="space-y-4">
          <button
            onClick={() => setSlideForm({ ...emptySlide, slide_order: slides.length + 1 })}
            className="btn-sigma text-xs"
            data-testid="add-slide-button"
          >
            <Plus size={15} /> Tambah Slide
          </button>

          {slideForm && (
            <form onSubmit={saveSlide} className="space-y-4 rounded-3xl glass p-7" data-testid="slide-form">
              <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                <div>
                  <label className="overline-label mb-2 block" htmlFor="s-order">
                    Urutan
                  </label>
                  <input
                    id="s-order"
                    type="number"
                    min={1}
                    className="field"
                    value={slideForm.slide_order}
                    onChange={(e) => setSlideForm({ ...slideForm, slide_order: Number(e.target.value) })}
                    data-testid="slide-order-input"
                  />
                </div>
                <div>
                  <label className="overline-label mb-2 block" htmlFor="s-title">
                    Judul slide
                  </label>
                  <input
                    id="s-title"
                    className="field"
                    required
                    value={slideForm.title}
                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                    data-testid="slide-title-input"
                  />
                </div>
              </div>
              <div>
                <label className="overline-label mb-2 block" htmlFor="s-content">
                  Isi slide
                </label>
                <textarea
                  id="s-content"
                  className="field mono min-h-40"
                  value={slideForm.content}
                  onChange={(e) => setSlideForm({ ...slideForm, content: e.target.value })}
                  data-testid="slide-content-input"
                />
                <p className="mono mt-2 text-[0.64rem] text-slate-500">
                  Gunakan $...$ untuk rumus sebaris dan $$...$$ untuk rumus terpusat. Contoh: $x =
                  \frac{"{-b \\pm \\sqrt{b^2-4ac}}"}{"{2a}"}$
                </p>
              </div>
              <div>
                <label className="overline-label mb-2 block" htmlFor="s-img">
                  URL gambar (opsional)
                </label>
                <input
                  id="s-img"
                  className="field"
                  value={slideForm.image_url || ""}
                  onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={busy} className="btn-sigma text-xs" data-testid="slide-save-button">
                  <Check size={15} /> Simpan
                </button>
                <button type="button" onClick={() => setSlideForm(null)} className="btn-ghost">
                  <X size={15} /> Batal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {slides.map((s) => (
              <div
                key={s.id}
                data-testid={`slide-row-${s.slide_order}`}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-sigma-panel/50 p-5"
              >
                <span className="mono grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-sm font-bold text-sigma-cyan">
                  {s.slide_order}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{s.title}</p>
                <button
                  onClick={() => setSlideForm({ ...s, image_url: s.image_url || "" })}
                  aria-label="Edit slide"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-sigma-cyan hover:text-sigma-cyan"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => delSlide(s.id)}
                  aria-label="Hapus slide"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-sigma-magenta hover:text-sigma-magenta"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "quiz" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setBulk(null);
                setPreview(null);
                setQForm({
                  ...emptyQuestion,
                  order_index: questions.length + 1,
                  options: emptyQuestion.options.map((o) => ({ ...o })),
                });
              }}
              className="btn-sigma text-xs"
              data-testid="add-question-button"
            >
              <Plus size={15} /> Tambah Soal
            </button>
            <button
              onClick={() => {
                setQForm(null);
                setPreview(null);
                setBulk(bulk === null ? "" : null);
              }}
              className="btn-ghost"
              data-testid="bulk-import-button"
            >
              <Upload size={15} /> Impor Massal
            </button>
            <span
              className={`mono text-xs ${questions.length === 15 ? "text-sigma-emerald" : "text-sigma-yellow"}`}
            >
              {questions.length} / 15 soal siap
            </span>
          </div>

          {bulk !== null && (
            <div className="space-y-5 rounded-3xl glass p-7" data-testid="bulk-import-panel">
              <div>
                <p className="overline-label">Tempel satu set soal sekaligus</p>
                <p className="mt-3 text-sm text-slate-400">
                  Satu soal dimulai dengan nomor (<span className="mono">1.</span>), pilihan dengan
                  huruf (<span className="mono">A.</span>). Tandai kunci jawaban dengan tanda{" "}
                  <span className="mono text-sigma-emerald">*</span> di depan huruf, atau tulis baris{" "}
                  <span className="mono text-sigma-emerald">Jawaban: B</span>. Gunakan{" "}
                  <span className="mono text-sigma-yellow">$...$</span> untuk rumus matematika.
                </p>
              </div>

              <textarea
                className="field mono min-h-64"
                placeholder={SAMPLE}
                value={bulk}
                onChange={(e) => {
                  setBulk(e.target.value);
                  setPreview(null);
                }}
                data-testid="bulk-import-textarea"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBulk(SAMPLE)}
                  className="mono text-[0.66rem] uppercase tracking-[0.16em] text-slate-400 hover:text-sigma-cyan"
                  data-testid="bulk-sample-button"
                >
                  isi contoh format
                </button>
                <label className="mono ml-auto flex cursor-pointer items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-slate-300">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="h-4 w-4 accent-[#00F0FF]"
                    data-testid="bulk-replace-checkbox"
                  />
                  ganti semua soal yang ada
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={runPreview}
                  disabled={busy || !bulk.trim()}
                  className="btn-ghost"
                  data-testid="bulk-preview-button"
                >
                  <ListChecks size={15} /> Pratinjau
                </button>
                <button
                  onClick={runImport}
                  disabled={busy || !preview?.count}
                  className="btn-sigma text-xs"
                  data-testid="bulk-confirm-button"
                >
                  <Check size={15} /> Impor {preview?.count ? `${preview.count} Soal` : ""}
                </button>
                <button
                  onClick={() => {
                    setBulk(null);
                    setPreview(null);
                  }}
                  className="btn-ghost"
                >
                  <X size={15} /> Tutup
                </button>
              </div>

              {preview && (
                <div className="space-y-3" data-testid="bulk-preview-result">
                  <p className="mono text-xs uppercase tracking-[0.16em] text-sigma-cyan">
                    {preview.count} soal terdeteksi
                    {preview.errors.length ? ` · ${preview.errors.length} blok bermasalah` : ""}
                  </p>
                  {preview.errors.map((e, i) => (
                    <p
                      key={i}
                      className="mono rounded-xl bg-sigma-magenta/12 px-4 py-2.5 text-xs text-sigma-magenta"
                      data-testid={`bulk-error-${i + 1}`}
                    >
                      {e}
                    </p>
                  ))}
                  {preview.questions.map((q, i) => (
                    <div
                      key={i}
                      data-testid={`bulk-preview-question-${i + 1}`}
                      className="rounded-2xl border border-white/10 bg-sigma-void/45 p-5"
                    >
                      <div className="flex gap-3">
                        <span className="mono text-sm font-bold text-sigma-yellow">
                          {q.order_index}
                        </span>
                        <MathText className="mono min-w-0 flex-1 text-sm text-white">
                          {q.question_text}
                        </MathText>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((o, j) => (
                          <span
                            key={j}
                            className={`mono rounded-lg px-3 py-2 text-xs ${
                              o.is_correct
                                ? "bg-sigma-emerald/12 text-sigma-emerald"
                                : "bg-white/[0.03] text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + j)}.{" "}
                            <MathText as="span">{o.option_text}</MathText>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {qForm && (
            <form onSubmit={saveQuestion} className="space-y-4 rounded-3xl glass p-7" data-testid="question-form">
              <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                <div>
                  <label className="overline-label mb-2 block" htmlFor="q-order">
                    Nomor
                  </label>
                  <input
                    id="q-order"
                    type="number"
                    min={1}
                    className="field"
                    value={qForm.order_index}
                    onChange={(e) => setQForm({ ...qForm, order_index: Number(e.target.value) })}
                    data-testid="question-order-input"
                  />
                </div>
                <div>
                  <label className="overline-label mb-2 block" htmlFor="q-text">
                    Pertanyaan
                  </label>
                  <textarea
                    id="q-text"
                    className="field mono min-h-20"
                    required
                    value={qForm.question_text}
                    onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })}
                    data-testid="question-text-input"
                  />
                  <p className="mono mt-2 text-[0.64rem] text-slate-500">
                    Rumus matematika: tulis di antara $...$
                  </p>
                </div>
              </div>

              <p className="overline-label">Pilihan jawaban · tandai yang benar</p>
              <div className="space-y-3">
                {qForm.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setQForm({
                          ...qForm,
                          options: qForm.options.map((x, j) => ({ ...x, is_correct: j === i })),
                        })
                      }
                      data-testid={`question-correct-${i + 1}`}
                      aria-label={`Tandai pilihan ${String.fromCharCode(65 + i)} sebagai benar`}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs font-bold transition-colors ${
                        o.is_correct
                          ? "border-sigma-emerald bg-sigma-emerald/20 text-sigma-emerald"
                          : "border-white/15 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input
                      className="field mono"
                      placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                      value={o.option_text}
                      onChange={(e) =>
                        setQForm({
                          ...qForm,
                          options: qForm.options.map((x, j) =>
                            j === i ? { ...x, option_text: e.target.value } : x
                          ),
                        })
                      }
                      data-testid={`question-option-input-${i + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={busy} className="btn-sigma text-xs" data-testid="question-save-button">
                  <Check size={15} /> Simpan Soal
                </button>
                <button type="button" onClick={() => setQForm(null)} className="btn-ghost">
                  <X size={15} /> Batal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                data-testid={`question-row-${q.order_index}`}
                className="rounded-2xl border border-white/10 bg-sigma-panel/50 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="mono grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-sm font-bold text-sigma-yellow">
                    {q.order_index}
                  </span>
                  <MathText className="mono min-w-0 flex-1 text-sm text-white">
                    {q.question_text}
                  </MathText>
                  <button
                    onClick={() =>
                      setQForm({
                        id: q.id,
                        order_index: q.order_index,
                        question_text: q.question_text,
                        options: (q.options || q.quiz_options || []).map((o) => ({
                          option_text: o.option_text,
                          is_correct: o.is_correct,
                        })),
                      })
                    }
                    aria-label="Edit soal"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-sigma-cyan hover:text-sigma-cyan"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => delQuestion(q.id)}
                    aria-label="Hapus soal"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-sigma-magenta hover:text-sigma-magenta"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mono mt-4 grid gap-2 pl-[3.25rem] sm:grid-cols-2">
                  {(q.options || q.quiz_options || []).map((o, i) => (
                    <span
                      key={o.id || i}
                      className={`rounded-lg px-3 py-2 text-xs ${
                        o.is_correct
                          ? "bg-sigma-emerald/12 text-sigma-emerald"
                          : "bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. <MathText as="span">{o.option_text}</MathText>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
