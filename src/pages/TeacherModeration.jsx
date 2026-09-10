import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, MessageSquare, Pin, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { MASCOTS } from "../lib/brand";
import { EmptyState, Loader } from "../components/Primitives";
import { Reveal } from "../components/Reveal";
import { MathText } from "../components/MathText";
import { UserAvatar } from "../components/UserAvatar";

const when = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TeacherModeration() {
  const [threads, setThreads] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api("/discussions/recent").then(setThreads).catch(() => setThreads([]));
  }, []);

  if (!threads) return <Loader label="Memuat forum kelas..." />;

  const shown =
    filter === "unpinned"
      ? threads.filter((t) => !t.has_pinned && !t.is_pinned && t.reply_count > 0)
      : filter === "announcements"
      ? threads.filter((t) => t.is_pinned || t.has_pinned)
      : threads;

  return (
    <div className="space-y-8">
      <header>
        <p className="overline-label">Moderasi diskusi & Pengumuman</p>
        <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-4xl">
          Forum seluruh modul
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Balas pertanyaan siswa dengan editor teks kaya dan rumus KaTeX, sematkan jawaban paling membantu atau terbitkan pengumuman resmi berkategori.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: `Semua diskusi (${threads.length})` },
          {
            id: "unpinned",
            label: `Perlu Ditinjau (${
              threads.filter((t) => !t.has_pinned && !t.is_pinned && t.reply_count > 0).length
            })`,
          },
          {
            id: "announcements",
            label: `Pengumuman & Sematan (${
              threads.filter((t) => t.is_pinned || t.has_pinned).length
            })`,
          },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            data-testid={`moderation-filter-${f.id}`}
            className={`rounded-full px-4 py-2 font-display text-[0.68rem] font-bold uppercase tracking-[0.09em] transition-colors ${
              filter === f.id
                ? "bg-sigma-cyan/15 text-sigma-cyan border border-sigma-cyan/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          testid="moderation-empty-state"
          mascot={MASCOTS.beta.img}
          title="Tidak ada diskusi pada filter ini"
          body="Forum akan terisi ketika siswa atau guru membuka topik diskusi pada modul mereka."
        />
      ) : (
        <div className="space-y-4">
          {shown.map((t, i) => {
            const hasAnnouncement = t.is_pinned || t.has_pinned;

            return (
              <Reveal key={t.id} delay={i * 0.05}>
                <Link
                  to={`/app/discussions/${t.id}`}
                  data-testid={`moderation-thread-${i + 1}`}
                  className={`group block rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                    hasAnnouncement
                      ? "border-amber-400/50 bg-gradient-to-br from-amber-500/[0.08] via-sigma-panel/60 to-slate-950 hover:border-amber-400"
                      : "border-white/10 bg-sigma-panel/50 hover:border-sigma-cyan/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="mono rounded-full bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-slate-400">
                      Modul {t.modules?.order_index} · {t.modules?.district_name}
                    </span>

                    {t.is_pinned ? (
                      <span className="mono inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-amber-300 border border-amber-400/30">
                        <Megaphone size={10} /> pengumuman utama
                      </span>
                    ) : t.has_pinned ? (
                      <span className="mono inline-flex items-center gap-1.5 rounded-full bg-sigma-yellow/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-sigma-yellow border border-sigma-yellow/30">
                        <Pin size={10} /> sudah disematkan
                      </span>
                    ) : (
                      <span className="mono inline-flex items-center gap-1.5 rounded-full bg-sigma-magenta/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-sigma-magenta">
                        <ShieldCheck size={10} /> perlu ditinjau
                      </span>
                    )}

                    <span className="mono ml-auto text-[0.62rem] uppercase tracking-[0.14em] text-slate-500">
                      {when(t.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white transition-colors group-hover:text-sigma-cyan">
                    <MathText as="span">{t.title}</MathText>
                  </h3>
                  <div className="mt-2 line-clamp-2 text-sm text-slate-400">
                    <MathText as="span">{t.body}</MathText>
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <UserAvatar
                        src={t.author?.avatar_url}
                        name={t.author?.full_name || "Anonim"}
                        role={t.author?.role}
                        size="xs"
                      />
                      <span>{t.author?.full_name}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare size={13} /> {t.reply_count} balasan
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

