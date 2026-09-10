import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Megaphone,
  MessageSquare,
  Pin,
  Plus,
  Send,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { MASCOTS, accentFor } from "../lib/brand";
import { EmptyState, Loader } from "../components/Primitives";
import { Reveal } from "../components/Reveal";
import { MathText } from "../components/MathText";
import { UserAvatar } from "../components/UserAvatar";
import { RichTextEditor } from "../components/RichTextEditor";

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
  clarification: "Klarifikasi",
  solution: "Solusi Resmi",
  exam_tip: "Tips TKA",
  notice: "Pengumuman",
};

export default function Discussions() {
  const { moduleId } = useParams();
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";
  const [threads, setThreads] = useState(null);
  const [module, setModule] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'announcements'
  const [form, setForm] = useState({
    title: "",
    body: "",
    is_pinned: false,
    is_announcement: false,
    announcement_type: "notice",
    announcement_title: "",
  });
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (moduleId) {
      api(`/modules/${moduleId}`).then((d) => setModule(d.module)).catch(() => {});
      api(`/modules/${moduleId}/threads`).then(setThreads).catch(() => setThreads([]));
    } else {
      api("/discussions/recent").then(setThreads).catch(() => setThreads([]));
    }
  };

  useEffect(load, [moduleId]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Judul dan isi pertanyaan tidak boleh kosong.");
      return;
    }
    setBusy(true);
    try {
      await api(`/modules/${moduleId}/threads`, {
        method: "POST",
        body: {
          title: form.title,
          body: form.body,
          is_pinned: isTeacher ? form.is_pinned : false,
          is_announcement: isTeacher ? form.is_announcement : false,
          announcement_type: isTeacher && form.is_announcement ? form.announcement_type : undefined,
          announcement_title: isTeacher && form.is_announcement ? form.announcement_title : undefined,
        },
      });
      toast.success(
        form.is_announcement
          ? "Pengumuman resmi guru berhasil diterbitkan!"
          : "Diskusi berhasil dibuat."
      );
      setForm({
        title: "",
        body: "",
        is_pinned: false,
        is_announcement: false,
        announcement_type: "notice",
        announcement_title: "",
      });
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!threads) return <Loader label="Memuat diskusi..." />;

  const accent = accentFor(module?.order_index || 1);

  const filteredThreads =
    filter === "announcements"
      ? threads.filter((t) => t.is_pinned || t.has_pinned || t.is_announcement)
      : threads;

  return (
    <div className="space-y-8">
      {moduleId ? (
        <Link to={`/app/modul/${moduleId}`} className="btn-ghost" data-testid="discussion-back-button">
          <ArrowLeft size={15} /> Modul
        </Link>
      ) : null}

      <header className="flex flex-wrap items-end gap-5">
        <div className="min-w-0 flex-1">
          <p className="overline-label" style={{ color: accent.hex }}>
            {module ? `Modul ${module.order_index} · ${module.district_name}` : "Semua modul"}
          </p>
          <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-4xl">
            {module ? "Ruang Diskusi" : "Diskusi SIGMA City"}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400">
            Forum belajar interaktif dengan format kaya matematika. Guru dapat menyematkan klarifikasi
            dan pengumuman resmi berprioritas tinggi.
          </p>
        </div>
        {moduleId && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-sigma btn-magenta text-xs"
            data-testid="new-thread-button"
          >
            <Plus size={15} /> {open ? "Tutup Form" : "Buat Diskusi / Pengumuman"}
          </button>
        )}
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          data-testid="filter-all-discussions"
          className={`rounded-full px-4 py-1.5 font-display text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-sigma-cyan/20 text-sigma-cyan border border-sigma-cyan/40"
              : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          Semua Diskusi ({threads.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("announcements")}
          data-testid="filter-announcements"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-xs font-bold transition-all ${
            filter === "announcements"
              ? "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10"
              : "bg-white/5 text-slate-400 hover:text-amber-300"
          }`}
        >
          <Megaphone size={12} /> Pengumuman Guru (
          {threads.filter((t) => t.is_pinned || t.has_pinned || t.is_announcement).length})
        </button>
      </div>

      {open && moduleId && (
        <form
          onSubmit={create}
          className="space-y-4 rounded-3xl glass p-7 border border-white/15"
          data-testid="new-thread-form"
        >
          <div>
            <label htmlFor="t-title" className="overline-label mb-2 block">
              Judul pertanyaan / Topik Pembahasan
            </label>
            <input
              id="t-title"
              className="field"
              required
              minLength={3}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Pembuktian Sifat Determinan Matriks $2 \times 2$"
              data-testid="thread-title-input"
            />
          </div>

          <div>
            <label className="overline-label mb-2 block">
              Uraian Pertanyaan / Materi Lengkap
            </label>
            <RichTextEditor
              value={form.body}
              onChange={(val) => setForm({ ...form, body: val })}
              placeholder="Jelaskan secara rinci dengan rumus matematika ($...$), langkah solusi, atau pertanyaan spesifik..."
              isTeacher={isTeacher}
              isAnnouncement={form.is_announcement}
              onAnnouncementChange={(val) =>
                setForm({ ...form, is_announcement: val, is_pinned: val })
              }
              announcementType={form.announcement_type}
              onAnnouncementTypeChange={(type) => setForm({ ...form, announcement_type: type })}
              announcementTitle={form.announcement_title}
              onAnnouncementTitleChange={(title) => setForm({ ...form, announcement_title: title })}
              minHeight="min-h-36"
              testId="new-thread-editor"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-ghost text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={busy || !form.title.trim() || !form.body.trim()}
              className="btn-sigma text-xs"
              data-testid="thread-submit-button"
            >
              <Send size={15} /> {form.is_announcement ? "Terbitkan Pengumuman" : "Kirim Diskusi"}
            </button>
          </div>
        </form>
      )}

      {filteredThreads.length === 0 ? (
        <EmptyState
          testid="discussion-empty-state"
          mascot={MASCOTS.gamma.img}
          title={
            filter === "announcements"
              ? "Belum ada pengumuman guru"
              : "Belum ada diskusi di sini"
          }
          body={
            filter === "announcements"
              ? "Guru belum menerbitkan atau menyematkan pengumuman penting pada modul ini."
              : moduleId
              ? "Jadilah yang pertama bertanya. Pertanyaanmu mungkin juga menjadi pertanyaan temanmu."
              : "Diskusi akan muncul di sini setelah ada yang membuka topik di salah satu modul."
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredThreads.map((t, i) => {
            const hasAnnouncement = t.is_pinned || t.has_pinned;
            const IconComp = ANNOUNCEMENT_ICONS[t.announcement_type] || Megaphone;

            return (
              <Reveal key={t.id} delay={i * 0.04}>
                <Link
                  to={`/app/discussions/${t.id}`}
                  data-testid={`thread-card-${i + 1}`}
                  className={`group block rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                    hasAnnouncement
                      ? "border-amber-400/60 bg-gradient-to-br from-amber-500/[0.09] via-sigma-panel/60 to-slate-950 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                      : "border-white/10 bg-sigma-panel/50 hover:border-sigma-magenta/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    {t.modules && (
                      <span className="mono rounded-full bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-slate-400">
                        Modul {t.modules.order_index}
                      </span>
                    )}

                    {t.is_pinned && (
                      <span className="mono inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-amber-300 border border-amber-400/30">
                        <Pin size={10} /> Thread Pengumuman Guru
                      </span>
                    )}

                    {!t.is_pinned && t.has_pinned && (
                      <span className="mono inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-amber-300 border border-amber-400/25">
                        <Megaphone size={10} /> Ada Pengumuman Disematkan
                      </span>
                    )}

                    {t.announcement_type && (
                      <span className="mono inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-wider text-amber-300">
                        <IconComp size={10} />
                        {ANNOUNCEMENT_LABELS[t.announcement_type] || t.announcement_type}
                      </span>
                    )}

                    <span className="mono ml-auto text-[0.62rem] uppercase tracking-[0.14em] text-slate-500">
                      {when(t.created_at)}
                    </span>
                  </div>

                  <h3
                    className={`mt-4 font-display text-lg font-bold transition-colors ${
                      hasAnnouncement
                        ? "text-white group-hover:text-amber-300"
                        : "text-white group-hover:text-sigma-magenta"
                    }`}
                  >
                    <MathText as="span">{t.title}</MathText>
                  </h3>

                  <div className="mt-2 line-clamp-2 text-sm text-slate-400">
                    <MathText as="span">{t.body}</MathText>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3.5 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <UserAvatar
                        src={t.author?.avatar_url}
                        name={t.author?.full_name || "Anonim"}
                        role={t.author?.role}
                        size="xs"
                      />
                      <span>{t.author?.full_name || "Anonim"}</span>
                      {t.author?.role === "teacher" && (
                        <span className="mono rounded bg-sigma-cyan/15 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-sigma-cyan font-bold">
                          guru
                        </span>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <MessageSquare size={13} /> {t.reply_count} balasan
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      {isTeacher && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-center gap-3">
          <Megaphone size={16} className="shrink-0 text-amber-300" />
          <span>
            Sebagai Dewan Guru, Anda dapat mempublikasikan pengumuman modul baru, menyematkan jawaban yang benar, atau menyematkan tips penting yang tampil di urutan teratas bagi seluruh siswa.
          </span>
        </div>
      )}
    </div>
  );
}

