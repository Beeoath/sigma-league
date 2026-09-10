import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Megaphone,
  Pin,
  PinOff,
  Send,
  Sparkles,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Target,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Loader } from "../components/Primitives";
import { MathText } from "../components/MathText";
import { RichTextEditor } from "../components/RichTextEditor";
import { UserAvatar } from "../components/UserAvatar";

const when = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const ANNOUNCEMENT_ICONS = {
  clarification: AlertTriangle,
  solution: Lightbulb,
  exam_tip: Target,
  notice: Megaphone,
};

const ANNOUNCEMENT_LABELS = {
  clarification: "Klarifikasi & Ralat Soal",
  solution: "Kunci Jawaban & Solusi Resmi",
  exam_tip: "Tips & Trik TKA",
  notice: "Pengumuman Modul / Kelas",
};

export default function ThreadDetail() {
  const { threadId } = useParams();
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";
  const [data, setData] = useState(null);
  const [body, setBody] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [announcementType, setAnnouncementType] = useState("clarification");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [pinModalReplyId, setPinModalReplyId] = useState(null);
  const [pinModalType, setPinModalType] = useState("clarification");
  const [pinModalTitle, setPinModalTitle] = useState("");

  const load = useCallback(() => {
    api(`/threads/${threadId}`)
      .then(setData)
      .catch(() => setData({ thread: null, replies: [] }));
  }, [threadId]);

  useEffect(load, [load]);

  if (!data) return <Loader label="Memuat diskusi..." />;
  if (!data.thread) return <p className="text-slate-300">Diskusi tidak ditemukan.</p>;

  const { thread, replies } = data;

  const pinnedReplies = replies.filter((r) => r.is_pinned);

  const reply = async (e) => {
    e.preventDefault();
    if (!body || !body.trim()) {
      toast.error("Mohon tuliskan isi balasan terlebih dahulu.");
      return;
    }
    setBusy(true);
    try {
      await api(`/threads/${threadId}/replies`, {
        method: "POST",
        body: {
          body,
          is_pinned: isTeacher ? isAnnouncement : false,
          is_announcement: isTeacher ? isAnnouncement : false,
          announcement_type: isTeacher && isAnnouncement ? announcementType : undefined,
          announcement_title: isTeacher && isAnnouncement ? announcementTitle : undefined,
        },
      });
      toast.success(
        isAnnouncement
          ? "Pengumuman resmi berhasil diterbitkan dan disematkan ke thread."
          : "Balasan berhasil dikirim."
      );
      setBody("");
      setIsAnnouncement(false);
      setAnnouncementTitle("");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const upvote = async (id) => {
    try {
      await api(`/replies/${id}/upvote`, { method: "POST" });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePinReply = async (id, currentPinned) => {
    if (currentPinned) {
      // Unpin directly
      try {
        await api(`/replies/${id}/pin`, { method: "POST", body: { pinned: false } });
        toast.success("Sematan pengumuman dilepas.");
        load();
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      // Open modal to configure announcement type
      setPinModalReplyId(id);
      setPinModalType("clarification");
      setPinModalTitle("");
    }
  };

  const confirmPinReply = async () => {
    if (!pinModalReplyId) return;
    try {
      await api(`/replies/${pinModalReplyId}/pin`, {
        method: "POST",
        body: {
          pinned: true,
          is_announcement: true,
          announcement_type: pinModalType,
          announcement_title: pinModalTitle || "Pengumuman Resmi Guru",
        },
      });
      toast.success("Balasan berhasil disematkan sebagai Pengumuman!");
      setPinModalReplyId(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePinThread = async () => {
    try {
      const nextPinned = !thread.is_pinned;
      await api(`/threads/${threadId}/pin`, {
        method: "POST",
        body: { pinned: nextPinned, is_announcement: nextPinned },
      });
      toast.success(
        nextPinned
          ? "Thread ini sekarang disematkan sebagai Pengumuman Utama!"
          : "Sematan thread pengumuman dilepas."
      );
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api(`/replies/${id}`, { method: "DELETE" });
      toast.success("Balasan dihapus.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div className="flex items-center justify-between gap-4">
        <Link to="/app/discussions" className="btn-ghost" data-testid="thread-back-button">
          <ArrowLeft size={15} /> Semua diskusi
        </Link>

        {isTeacher && (
          <button
            onClick={togglePinThread}
            data-testid="thread-pin-toggle-btn"
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
              thread.is_pinned
                ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/10"
                : "border-white/15 bg-white/5 text-slate-300 hover:border-amber-400/60 hover:text-amber-300"
            }`}
          >
            {thread.is_pinned ? <PinOff size={13} /> : <Pin size={13} />}
            <span>{thread.is_pinned ? "Lepas Sematan Thread" : "Sematkan Thread Ini"}</span>
          </button>
        )}
      </div>

      {/* Main Thread Article */}
      <article
        className={`rounded-3xl glass p-7 sm:p-9 transition-all duration-300 ${
          thread.is_pinned
            ? "border-amber-400/60 bg-gradient-to-br from-amber-500/[0.08] via-sigma-panel/70 to-slate-950/80 shadow-xl shadow-amber-500/5"
            : ""
        }`}
        data-testid="thread-detail"
      >
        {thread.is_pinned && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Megaphone size={13} className="animate-pulse" />
            <span>THREAD PENGUMUMAN RESMI DEWAN GURU</span>
          </div>
        )}

        <h1 className="font-display text-2xl font-black leading-snug text-white sm:text-3xl">
          <MathText as="span">{thread.title}</MathText>
        </h1>

        <div className="mt-4 text-sm leading-relaxed text-slate-300">
          <MathText>{thread.body}</MathText>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-slate-400">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
            <UserAvatar
              src={thread.author?.avatar_url}
              name={thread.author?.full_name || "Anonim"}
              role={thread.author?.role}
              size="sm"
            />
            <span>{thread.author?.full_name || "Anonim"}</span>
            {thread.author?.role === "teacher" && (
              <span className="mono rounded bg-sigma-cyan/15 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-sigma-cyan font-bold">
                guru
              </span>
            )}
            <span className="text-slate-600">·</span>
            <span className="mono text-[0.64rem] uppercase tracking-[0.14em] text-slate-500">
              {when(thread.created_at)}
            </span>
          </div>

          <span className="mono text-xs text-slate-400">
            {replies.length} balasan dalam diskusi
          </span>
        </div>
      </article>

      {/* Pinned Announcements Highlight Box (If any pinned replies exist) */}
      {pinnedReplies.length > 0 && (
        <section
          className="space-y-3 rounded-3xl border border-amber-400/60 bg-gradient-to-br from-amber-500/15 via-yellow-500/5 to-slate-950 p-6 sm:p-7 shadow-2xl shadow-amber-500/10 backdrop-blur-xl"
          data-testid="pinned-announcement-highlight-box"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/20 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30">
                <Megaphone size={16} />
              </span>
              <div>
                <p className="font-display text-sm font-black uppercase tracking-wider text-amber-300">
                  Pengumuman & Catatan Penting Guru
                </p>
                <p className="text-[0.68rem] text-amber-200/70">
                  Disematkan langsung oleh dewan guru untuk pedoman seluruh siswa
                </p>
              </div>
            </div>

            <span className="mono inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-[0.64rem] font-bold text-amber-300 border border-amber-400/30">
              <Pin size={11} /> {pinnedReplies.length} Disematkan
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {pinnedReplies.map((pr, pIdx) => {
              const IconComp = ANNOUNCEMENT_ICONS[pr.announcement_type] || Sparkles;
              const catLabel =
                ANNOUNCEMENT_LABELS[pr.announcement_type] || "Pengumuman Resmi";

              return (
                <div
                  key={pr.id}
                  className="rounded-2xl border border-amber-400/30 bg-black/40 p-5 backdrop-blur-sm"
                  data-testid={`pinned-reply-highlight-${pIdx + 1}`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/25">
                      <IconComp size={12} /> {catLabel}
                    </span>

                    {pr.announcement_title && (
                      <span className="font-display text-xs font-bold text-white">
                        {pr.announcement_title}
                      </span>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                      <span className="mono text-[0.62rem] text-slate-400">
                        {when(pr.created_at)}
                      </span>
                      {isTeacher && (
                        <button
                          onClick={() => togglePinReply(pr.id, true)}
                          title="Lepas sematan pengumuman"
                          className="rounded-full border border-amber-400/30 p-1 text-amber-300 hover:bg-amber-400/20 hover:text-white transition-colors"
                        >
                          <PinOff size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <MathText className="text-sm leading-relaxed text-slate-100">
                    {pr.body}
                  </MathText>

                  <div className="mt-4 flex items-center gap-2.5 border-t border-white/5 pt-3 text-xs text-slate-400">
                    <UserAvatar
                      src={pr.author?.avatar_url}
                      name={pr.author?.full_name}
                      role={pr.author?.role || "teacher"}
                      size="xs"
                    />
                    <span className="font-semibold text-amber-200">
                      {pr.author?.full_name}
                    </span>
                    <span className="mono rounded bg-sigma-cyan/15 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-sigma-cyan font-bold">
                      Pengampu Matematika
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Replies Timeline Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="overline-label" data-testid="reply-count">
            {replies.length} Balasan Diskusi
          </p>
        </div>

        {replies.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-sigma-panel/40 p-8 text-center text-slate-400">
            <p className="text-sm">Belum ada balasan pada diskusi ini.</p>
            <p className="mt-1 text-xs text-slate-500">
              Jadilah yang pertama memberikan solusi atau mengajukan klarifikasi!
            </p>
          </div>
        ) : (
          replies.map((r, i) => {
            const IconComp = ANNOUNCEMENT_ICONS[r.announcement_type] || Megaphone;

            return (
              <div
                key={r.id}
                data-testid={`reply-card-${i + 1}`}
                className={`rounded-3xl border p-6 transition-all duration-300 ${
                  r.is_pinned
                    ? "border-amber-400/60 bg-gradient-to-r from-amber-500/[0.08] via-sigma-panel/60 to-slate-950 shadow-lg shadow-amber-500/5"
                    : "border-white/10 bg-sigma-panel/50 hover:border-white/20"
                }`}
              >
                {r.is_pinned && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="mono inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-amber-300 border border-amber-400/30">
                      <Pin size={11} /> Pengumuman Disematkan Guru
                    </span>
                    {r.announcement_type && (
                      <span className="mono inline-flex items-center gap-1 text-[0.62rem] uppercase tracking-wider text-amber-200/80">
                        <IconComp size={11} />
                        {ANNOUNCEMENT_LABELS[r.announcement_type] || r.announcement_type}
                      </span>
                    )}
                    {r.announcement_title && (
                      <span className="font-display text-xs font-bold text-white">
                        — {r.announcement_title}
                      </span>
                    )}
                  </div>
                )}

                <MathText className="text-sm leading-relaxed text-slate-200">
                  {r.body}
                </MathText>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <UserAvatar
                      src={r.author?.avatar_url}
                      name={r.author?.full_name}
                      role={r.author?.role}
                      size="xs"
                    />
                    <span>{r.author?.full_name}</span>
                    {r.author?.role === "teacher" && (
                      <span className="mono rounded bg-sigma-cyan/15 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-sigma-cyan font-bold">
                        guru
                      </span>
                    )}
                  </span>
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-slate-500">
                    {when(r.created_at)}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    {!isTeacher && (
                      <button
                        onClick={() => upvote(r.id)}
                        data-testid={`reply-upvote-${i + 1}`}
                        aria-pressed={r.upvoted_by_me}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
                          r.upvoted_by_me
                            ? "border-sigma-cyan bg-sigma-cyan/15 text-sigma-cyan"
                            : "border-white/15 text-slate-400 hover:border-sigma-cyan/60 hover:text-sigma-cyan"
                        }`}
                      >
                        <ArrowUp size={13} /> {r.upvotes}
                      </button>
                    )}

                    {isTeacher && (
                      <>
                        <span className="mono text-xs text-slate-400">{r.upvotes} suara</span>
                        <button
                          onClick={() => togglePinReply(r.id, r.is_pinned)}
                          data-testid={`reply-pin-${i + 1}`}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                            r.is_pinned
                              ? "border-amber-400/50 bg-amber-400/15 text-amber-300 hover:bg-amber-400/25"
                              : "border-white/15 text-slate-300 hover:border-amber-400 hover:text-amber-300"
                          }`}
                        >
                          {r.is_pinned ? <PinOff size={13} /> : <Pin size={13} />}
                          {r.is_pinned ? "Lepas Sematan" : "Sematkan Pengumuman"}
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          data-testid={`reply-delete-${i + 1}`}
                          aria-label="Hapus balasan"
                          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-slate-400 transition-colors hover:border-sigma-magenta hover:text-sigma-magenta"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Reply Form with Rich Text Editor */}
      <form onSubmit={reply} className="rounded-3xl glass p-6 sm:p-7 space-y-4" data-testid="reply-form">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <label className="overline-label block">
              Tulis balasan sebagai {profile?.full_name}
            </label>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan toolbar di bawah untuk format tebal, rumus matematika KaTeX ($...$), dan daftar langkah.
            </p>
          </div>

          {isTeacher && (
            <span className="mono rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[0.62rem] font-bold text-amber-300">
              Hak Akses Guru Aktif
            </span>
          )}
        </div>

        {/* Enhanced Rich Text Editor */}
        <RichTextEditor
          value={body}
          onChange={setBody}
          placeholder="Bantu jelaskan dengan langkah-langkah yang runtut, rumus matematika ($x^2$), atau penjelasan konsep..."
          isTeacher={isTeacher}
          isAnnouncement={isAnnouncement}
          onAnnouncementChange={setIsAnnouncement}
          announcementType={announcementType}
          onAnnouncementTypeChange={setAnnouncementType}
          announcementTitle={announcementTitle}
          onAnnouncementTitleChange={setAnnouncementTitle}
          minHeight="min-h-36"
          testId="reply-rich-editor"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="mono text-[0.64rem] text-slate-500">
            Tips: Gunakan tab <span className="text-sigma-cyan font-bold">&quot;Pratinjau&quot;</span> untuk memverifikasi tampilan rumus sebelum mengirim.
          </p>

          <button
            type="submit"
            disabled={busy || !body.trim()}
            className="btn-sigma text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="reply-submit-button"
          >
            <Send size={15} /> {isAnnouncement ? "Terbitkan Pengumuman" : "Kirim Balasan"}
          </button>
        </div>
      </form>

      {/* Teacher Pin Announcement Modal */}
      {pinModalReplyId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          data-testid="pin-announcement-modal"
        >
          <div className="w-full max-w-md rounded-3xl border border-amber-400/50 bg-slate-950 p-6 shadow-2xl shadow-amber-500/20">
            <div className="flex items-center gap-2.5 text-amber-300">
              <Megaphone size={18} />
              <h3 className="font-display text-lg font-black">Sematkan sebagai Pengumuman</h3>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Balasan ini akan disematkan di bagian teratas thread dan diberi sorotan khusus untuk seluruh siswa.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kategori Pengumuman
                </label>
                <select
                  value={pinModalType}
                  onChange={(e) => setPinModalType(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  data-testid="modal-announcement-type-select"
                >
                  <option value="clarification">⚠️ Klarifikasi & Ralat Soal</option>
                  <option value="solution">💡 Kunci Jawaban & Solusi Resmi</option>
                  <option value="exam_tip">🎯 Tips & Trik TKA</option>
                  <option value="notice">📢 Pengumuman Modul / Kelas</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Judul Sorotan (Opsional)
                </label>
                <input
                  type="text"
                  value={pinModalTitle}
                  onChange={(e) => setPinModalTitle(e.target.value)}
                  placeholder="Contoh: Pembahasan Resmi Soal Nilai Mutlak"
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  data-testid="modal-announcement-title-input"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPinModalReplyId(null)}
                className="btn-ghost text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmPinReply}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-md shadow-amber-400/30"
                data-testid="confirm-pin-btn"
              >
                <Pin size={13} /> Sematkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

