import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading,
  Quote,
  List,
  ListOrdered,
  Sigma,
  Sparkles,
  Eye,
  Edit3,
  Columns,
  Pin,
  Megaphone,
  AlertTriangle,
  Award,
  ChevronDown,
} from "lucide-react";
import { MathText } from "./MathText";

const MATH_SYMBOLS = [
  { label: "√x", insert: "\\sqrt{x}", title: "Akar Kuadrat" },
  { label: "a/b", insert: "\\frac{a}{b}", title: "Pecahan" },
  { label: "x²", insert: "x^{2}", title: "Pangkat Dua" },
  { label: "xₙ", insert: "x_{n}", title: "Indeks Bawah" },
  { label: "±", insert: "\\pm", title: "Plus Minus" },
  { label: "≤", insert: "\\le", title: "Kurang dari Sama dengan" },
  { label: "≥", insert: "\\ge", title: "Lebih dari Sama dengan" },
  { label: "≠", insert: "\\neq", title: "Tidak Sama dengan" },
  { label: "×", insert: "\\times", title: "Kali" },
  { label: "÷", insert: "\\div", title: "Bagi" },
  { label: "π", insert: "\\pi", title: "Pi" },
  { label: "α", insert: "\\alpha", title: "Alpha" },
  { label: "β", insert: "\\beta", title: "Beta" },
  { label: "θ", insert: "\\theta", title: "Theta" },
  { label: "Δ", insert: "\\Delta", title: "Delta (Diskriminan)" },
  { label: "∞", insert: "\\infty", title: "Tak Hingga" },
  { label: "∑", insert: "\\sum_{i=1}^{n}", title: "Notasi Sigma" },
  { label: "∫", insert: "\\int_{a}^{b}", title: "Integral" },
  { label: "⇒", insert: "\\implies", title: "Maka / Implikasi" },
  { label: "⇔", insert: "\\iff", title: "Jika dan Hanya Jika" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tuliskan penjelasan, jawaban, atau pertanyaan dengan langkah runtut...",
  isTeacher = false,
  isAnnouncement = false,
  onAnnouncementChange,
  announcementType = "clarification",
  onAnnouncementTypeChange,
  announcementTitle = "",
  onAnnouncementTitleChange,
  minHeight = "min-h-36",
  autoFocus = false,
  testId = "rich-text-editor",
}) {
  const [mode, setMode] = useState("write"); // 'write' | 'preview' | 'split'
  const [showMathPalette, setShowMathPalette] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef(null);

  // Focus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Insert or wrap text at cursor
  const insertText = useCallback(
    (prefix, suffix = "", defaultText = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = value || "";
      const selected = currentVal.substring(start, end);
      const insertContent = selected || defaultText;

      const replacement = `${prefix}${insertContent}${suffix}`;
      const updated =
        currentVal.substring(0, start) + replacement + currentVal.substring(end);

      onChange(updated);

      // Restore cursor position inside the wrapped text
      setTimeout(() => {
        textarea.focus();
        const cursorStart = start + prefix.length;
        const cursorEnd = cursorStart + insertContent.length;
        textarea.setSelectionRange(cursorStart, cursorEnd);
      }, 10);
    },
    [value, onChange]
  );

  // Line prefix helper for headers, lists, quotes
  const insertLinePrefix = useCallback(
    (prefix) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const currentVal = value || "";
      const lastNewline = currentVal.lastIndexOf("\n", start - 1);
      const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

      const updated =
        currentVal.substring(0, lineStart) +
        prefix +
        currentVal.substring(lineStart);

      onChange(updated);

      setTimeout(() => {
        textarea.focus();
        const newPos = start + prefix.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 10);
    },
    [value, onChange]
  );

  // Keyboard shortcut listener
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + B (Bold)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      insertText("**", "**", "teks tebal");
      return;
    }
    // Ctrl/Cmd + I (Italic)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      insertText("*", "*", "teks miring");
      return;
    }
    // Ctrl/Cmd + M (Math inline)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
      e.preventDefault();
      insertText("$", "$", "x^2 + 2x - 3 = 0");
      return;
    }
    // Tab key indent
    if (e.key === "Tab") {
      e.preventDefault();
      insertText("  ", "");
      return;
    }
  };

  // Metrics
  const charCount = (value || "").length;
  const wordCount = (value || "").trim() ? (value || "").trim().split(/\s+/).length : 0;
  const mathFormulaCount = ((value || "").match(/\$[^$\n]+?\$|\$\$[\s\S]+?\$\$/g) || []).length;

  return (
    <div
      className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 sm:p-4 backdrop-blur-md transition-all focus-within:border-sigma-cyan/50"
      data-testid={testId}
    >
      {/* Teacher Announcement Special Toggle Box */}
      {isTeacher && onAnnouncementChange && (
        <div
          className={`rounded-xl border p-3.5 transition-all duration-300 ${
            isAnnouncement
              ? "border-amber-400/60 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-950/20 shadow-lg shadow-amber-500/5"
              : "border-white/10 bg-white/[0.02]"
          }`}
          data-testid="announcement-toggle-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={isAnnouncement}
                onChange={(e) => onAnnouncementChange(e.target.checked)}
                className="h-4 w-4 rounded border-amber-400/50 bg-slate-900 text-amber-500 focus:ring-amber-400 focus:ring-offset-0"
                data-testid="announcement-checkbox"
              />
              <span className="flex items-center gap-1.5">
                <Pin size={13} className={isAnnouncement ? "text-amber-400" : "text-slate-400"} />
                <span className={isAnnouncement ? "text-amber-300 font-bold" : "text-slate-300"}>
                  Sematkan balasan ini sebagai Pengumuman Resmi Guru
                </span>
              </span>
            </label>

            {isAnnouncement && (
              <span className="mono inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-amber-300">
                <Megaphone size={10} /> Prioritas Sematan
              </span>
            )}
          </div>

          {isAnnouncement && (
            <div className="mt-3.5 grid gap-3 pt-3 border-t border-amber-400/20 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[0.65rem] font-bold uppercase tracking-wider text-amber-200/80">
                  Kategori Pengumuman
                </label>
                <select
                  value={announcementType}
                  onChange={(e) => onAnnouncementTypeChange?.(e.target.value)}
                  className="w-full rounded-lg border border-amber-400/30 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-amber-100 focus:border-amber-400 focus:outline-none"
                  data-testid="announcement-type-select"
                >
                  <option value="clarification">⚠️ Klarifikasi & Koreksi Materi</option>
                  <option value="solution">💡 Kunci Jawaban & Solusi Resmi</option>
                  <option value="exam_tip">🎯 Tips & Trik Strategi TKA</option>
                  <option value="notice">📢 Pengumuman Modul / Kelas</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[0.65rem] font-bold uppercase tracking-wider text-amber-200/80">
                  Judul Pengumuman (Opsional)
                </label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => onAnnouncementTitleChange?.(e.target.value)}
                  placeholder="Contoh: Koreksi Trik Cepat Soal No. 3"
                  className="w-full rounded-lg border border-amber-400/30 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-amber-100 placeholder:text-amber-300/40 focus:border-amber-400 focus:outline-none"
                  data-testid="announcement-title-input"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        {/* Left Formatting Tools */}
        <div className="flex flex-wrap items-center gap-1 text-slate-300">
          <button
            type="button"
            onClick={() => insertText("**", "**", "teks tebal")}
            title="Tebal (Ctrl+B)"
            data-testid="format-bold-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText("*", "*", "teks miring")}
            title="Miring (Ctrl+I)"
            data-testid="format-italic-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText("~~", "~~", "teks coret")}
            title="Coret"
            data-testid="format-strike-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Strikethrough size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText("`", "`", "kode")}
            title="Kode Sebaris"
            data-testid="format-code-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Code size={14} />
          </button>

          <span className="mx-1 h-4 w-[1px] bg-white/15" />

          <button
            type="button"
            onClick={() => insertLinePrefix("### ")}
            title="Subjudul (H3)"
            data-testid="format-h3-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Heading size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix("> ")}
            title="Kutipan / Catatan"
            data-testid="format-quote-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix("- ")}
            title="Daftar Butir"
            data-testid="format-ul-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix("1. ")}
            title="Daftar Bernomor"
            data-testid="format-ol-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ListOrdered size={14} />
          </button>

          <span className="mx-1 h-4 w-[1px] bg-white/15" />

          {/* Math Formula Shortcuts */}
          <button
            type="button"
            onClick={() => insertText("$", "$", "x^2 + 2x - 3 = 0")}
            title="Rumus Matematika KaTeX Sebaris ($...$)"
            data-testid="format-math-inline-btn"
            className="flex items-center gap-1 rounded bg-sigma-cyan/15 px-2 py-1 text-xs font-bold text-sigma-cyan hover:bg-sigma-cyan/25 transition-colors"
          >
            <Sigma size={13} /> Rumus
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                "\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\n",
                ""
              )
            }
            title="Rumus Matematika Blok Terpusat ($$...$$)"
            data-testid="format-math-block-btn"
            className="rounded p-1.5 hover:bg-white/10 hover:text-sigma-cyan transition-colors text-xs font-mono font-bold"
          >
            $$
          </button>

          {/* Quick Math Symbols Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setShowMathPalette((p) => !p)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              showMathPalette
                ? "bg-white/20 text-white"
                : "text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
            data-testid="toggle-math-symbols-btn"
          >
            <span>Simbol</span>
            <ChevronDown size={11} className={showMathPalette ? "rotate-180" : ""} />
          </button>

          {/* Templates Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setShowTemplates((t) => !t)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              showTemplates
                ? "bg-sigma-magenta/20 text-sigma-magenta"
                : "text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
            data-testid="toggle-templates-btn"
          >
            <Sparkles size={12} />
            <span>Template</span>
            <ChevronDown size={11} className={showTemplates ? "rotate-180" : ""} />
          </button>
        </div>

        {/* Right View Modes: Tulis, Pratinjau, Split */}
        <div className="flex items-center gap-1 rounded-lg bg-black/40 p-0.5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setMode("write")}
            data-testid="view-write-btn"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              mode === "write"
                ? "bg-sigma-cyan/20 text-sigma-cyan font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 size={12} /> Tulis
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            data-testid="view-preview-btn"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              mode === "preview"
                ? "bg-sigma-cyan/20 text-sigma-cyan font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye size={12} /> Pratinjau
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            data-testid="view-split-btn"
            title="Tampilkan Berdampingan"
            className={`hidden sm:flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-colors ${
              mode === "split"
                ? "bg-sigma-cyan/20 text-sigma-cyan font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Columns size={12} />
          </button>
        </div>
      </div>

      {/* Collapsible Math Symbols Palette */}
      {showMathPalette && (
        <div
          className="rounded-xl border border-white/10 bg-black/50 p-2.5 transition-all"
          data-testid="math-symbols-palette"
        >
          <div className="mb-2 flex items-center justify-between text-[0.68rem] text-slate-400">
            <span>Klik simbol untuk menyisipkan ke dalam rumus:</span>
            <span className="mono text-[0.62rem] text-sigma-cyan">KaTeX Siap Pakai</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MATH_SYMBOLS.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  insertText(sym.insert, "");
                }}
                title={`${sym.title} (${sym.insert})`}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200 hover:border-sigma-cyan/60 hover:bg-sigma-cyan/15 hover:text-sigma-cyan transition-colors"
              >
                {sym.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Templates Bar */}
      {showTemplates && (
        <div
          className="rounded-xl border border-sigma-magenta/20 bg-sigma-magenta/[0.05] p-2.5"
          data-testid="templates-palette"
        >
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-wider text-sigma-magenta">
            Template Struktur Diskusi
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                insertText(
                  `**Diketahui:**\n- Bentuk fungsi: $f(x) = ...$\n- Syarat: $x \\neq ...$\n\n**Ditanya:** Nilai ...\n\n**Langkah Pembahasan:**\n1. Sederhanakan bentuk awal: $...$\n2. Terapkan sifat $...$\n3. Diperoleh solusi akhir: $...$\n`
                );
                setShowTemplates(false);
              }}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 hover:border-sigma-cyan hover:text-sigma-cyan transition-colors"
            >
              💡 Langkah Solusi Runtut
            </button>
            <button
              type="button"
              onClick={() => {
                insertText(
                  `> 💡 **Trik Singkat TKA:**\n> Untuk tipe soal seperti ini, gunakan kaidah rasio koefisien suku tertinggi: $y = \\frac{a}{c}$ tanpa perlu menurunkan limit manual.\n`
                );
                setShowTemplates(false);
              }}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 hover:border-sigma-yellow hover:text-sigma-yellow transition-colors"
            >
              ⚡ Trik Singkat TKA
            </button>
            {isTeacher && (
              <button
                type="button"
                onClick={() => {
                  insertText(
                    `### 📢 PENGUMUMAN PENTING GURU: Klarifikasi Materi\n\nKepada seluruh siswa kelas 11, perhatikan kaidah berikut agar tidak keliru dalam pengerjaan:\n\n> **Kaidah Ekuivalensi:**\n> Karena kedua ruas bertanda mutlak $(|f(x)| \\ge 0)$, penguadratan dua ruas bersifat ekuivalen mutlak.\n\n**Langkah yang Disarankan:**\n1. Terapkan pemfaktoran selisih kuadrat: $[f(x)+g(x)][f(x)-g(x)] < 0$\n2. Gambar garis bilangan untuk menentukan interval penyelesaian.\n`
                  );
                  setShowTemplates(false);
                  onAnnouncementChange?.(true);
                }}
                className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                📢 Format Pengumuman Resmi Guru
              </button>
            )}
          </div>
        </div>
      )}

      {/* Editor Main Content Area */}
      <div className={mode === "split" ? "grid gap-3 sm:grid-cols-2" : ""}>
        {/* Write View */}
        {(mode === "write" || mode === "split") && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3.5 font-sans text-sm text-slate-200 placeholder:text-slate-500 focus:border-sigma-cyan/60 focus:outline-none focus:ring-1 focus:ring-sigma-cyan/40 ${minHeight}`}
              data-testid="rich-textarea"
            />
          </div>
        )}

        {/* Preview View */}
        {(mode === "preview" || mode === "split") && (
          <div
            className={`rounded-xl border border-white/10 bg-black/30 p-4 ${minHeight} overflow-y-auto ${
              mode === "split" ? "border-dashed border-sigma-cyan/30" : ""
            }`}
            data-testid="rich-preview"
          >
            {value && value.trim() ? (
              <div className="space-y-3">
                {isAnnouncement && isTeacher && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
                    <Megaphone size={14} />
                    <span>Pratinjau Pengumuman Resmi: {announcementTitle || "Pemberitahuan Guru"}</span>
                  </div>
                )}
                <MathText>{value}</MathText>
              </div>
            ) : (
              <p className="italic text-slate-500 text-sm">
                Belum ada teks. Tuliskan teks di tab &quot;Tulis&quot; untuk melihat pratinjau matematika dan format gaya.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Status Footer: Stats & Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.68rem] text-slate-500 pt-1">
        <div className="flex items-center gap-3">
          <span>{charCount} karakter</span>
          <span>·</span>
          <span>{wordCount} kata</span>
          {mathFormulaCount > 0 && (
            <>
              <span>·</span>
              <span className="mono font-semibold text-sigma-cyan">
                {mathFormulaCount} Rumus KaTeX aktif
              </span>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <span className="mono">Rumus: $...$</span>
          <span>·</span>
          <span className="mono">Ctrl+B: Tebal</span>
          <span>·</span>
          <span className="mono">Ctrl+M: Math</span>
        </div>
      </div>
    </div>
  );
}
