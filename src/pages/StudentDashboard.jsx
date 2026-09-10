import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Lock, MessageSquare, Target } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { accentFor } from "../lib/brand";
import { EmptyState, Loader, StatTile } from "../components/Primitives";
import { Reveal } from "../components/Reveal";
import { MASCOTS } from "../lib/brand";

const when = (iso) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const STATUS_ICON = {
  locked: <Lock size={13} />,
  available: <Target size={13} />,
  completed: <CheckCircle2 size={13} />,
};
const STATUS_LABEL = { locked: "Terkunci", available: "Sedang dijalani", completed: "Selesai" };
const STATUS_COLOR = { locked: "#64748B", available: "#FFD600", completed: "#10B981" };

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/me/dashboard").then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <Loader label="Menyusun progres pribadimu..." />;

  const pct = Math.round((data.completed_count / Math.max(data.total_modules, 1)) * 100);

  return (
    <div className="space-y-11">
      <header>
        <p className="overline-label">Dashboard pribadi</p>
        <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-4xl">
          Progres {profile?.full_name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-400">
          Halaman ini sepenuhnya milikmu. Tidak ada peringkat, tidak ada perbandingan dengan siswa
          lain.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Perjalanan"
          value={`${data.completed_count} / ${data.total_modules}`}
          sub="modul selesai"
          accent="#00F0FF"
          testid="dashboard-journey-stat"
        />
        <StatTile
          label="Modul saat ini"
          value={data.current_module ? `Modul ${data.current_module.order_index}` : "Selesai semua"}
          sub={data.current_module?.district_name || "SIGMA City tuntas"}
          accent="#FFD600"
          testid="dashboard-current-stat"
        />
        <StatTile
          label="Percobaan kuis"
          value={data.attempts.length}
          sub="riwayat pribadi"
          accent="#FF007A"
          testid="dashboard-attempts-stat"
        />
      </section>

      <section className="rounded-3xl glass p-7">
        <div className="flex items-end justify-between">
          <p className="overline-label">Keseluruhan perjalanan</p>
          <span className="mono text-sm font-bold text-sigma-cyan">{pct}%</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sigma-cyan via-sigma-yellow to-sigma-emerald"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </section>

      <section>
        <p className="overline-label">Progres per modul</p>
        <div className="mt-5 space-y-3">
          {(data?.modules || []).map((m, i) => {
            const st = m.progress.status;
            const accent = accentFor(m.order_index);
            return (
              <Reveal key={m.id} delay={i * 0.05}>
                <div
                  data-testid={`dashboard-module-row-${m.order_index}`}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-sigma-panel/50 p-5"
                >
                  <span
                    className="mono grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold"
                    style={{ background: `${accent.hex}1f`, color: accent.hex }}
                  >
                    {String(m.order_index).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-white">{m.title}</p>
                    <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">
                      {m.district_name}
                    </p>
                  </div>
                  <span
                    className="mono inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em]"
                    style={{ background: `${STATUS_COLOR[st]}1f`, color: STATUS_COLOR[st] }}
                  >
                    {STATUS_ICON[st]} {STATUS_LABEL[st]}
                  </span>
                  {st !== "locked" && (
                    <Link
                      to={`/app/modul/${m.id}`}
                      className="mono text-[0.62rem] uppercase tracking-[0.16em] text-sigma-cyan hover:underline"
                    >
                      buka
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section>
        <p className="overline-label">Riwayat kuis</p>
        {(data?.attempts || []).length === 0 ? (
          <div className="mt-5">
            <EmptyState
              testid="dashboard-attempts-empty"
              mascot={MASCOTS.alpha.img}
              title="Belum ada kuis yang dikumpulkan"
              body="Selesaikan materi modul pertama lalu kerjakan kuisnya. Riwayat nilaimu akan muncul di sini."
              action={
                <Link to="/app" className="btn-sigma text-xs">
                  Ke Peta SIGMA <ArrowRight size={15} />
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-sigma-panel/70">
                <tr className="mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-5 py-4">Modul</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Benar</th>
                  <th className="px-5 py-4">Nilai</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.attempts || []).map((a, i) => (
                  <tr
                    key={a.id}
                    data-testid={`quiz-history-row-${i + 1}`}
                    className="border-t border-white/10 text-slate-300"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-white">
                        {a.quizzes?.modules?.title || "—"}
                      </span>
                    </td>
                    <td className="mono px-5 py-4 text-xs">{when(a.submitted_at)}</td>
                    <td className="mono px-5 py-4">{a.correct_count}</td>
                    <td className="mono px-5 py-4 font-bold text-white">{a.score}</td>
                    <td className="px-5 py-4">
                      <span
                        className="mono rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em]"
                        style={{
                          background: a.passed ? "#10b9811f" : "#ff007a1f",
                          color: a.passed ? "#10B981" : "#FF007A",
                        }}
                      >
                        {a.passed ? "lulus" : "belum lulus"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl glass p-7">
          <p className="overline-label">Diskusi yang kamu buat</p>
          {(data?.threads || []).length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Belum ada topik yang kamu buka.</p>
          ) : (
            <ul className="mt-4 space-y-3" data-testid="dashboard-threads-list">
              {(data?.threads || []).map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/app/discussions/${t.id}`}
                    className="block rounded-2xl border border-white/10 p-4 transition-colors hover:border-sigma-magenta/50"
                  >
                    <p className="text-sm font-semibold text-white">{t.title}</p>
                    <p className="mono mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-slate-500">
                      Modul {t.modules?.order_index} · {when(t.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl glass p-7">
          <p className="overline-label">Balasan yang kamu tulis</p>
          {(data?.replies || []).length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Belum ada balasan.</p>
          ) : (
            <ul className="mt-4 space-y-3" data-testid="dashboard-replies-list">
              {(data?.replies || []).map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/app/discussions/${r.discussion_threads?.id}`}
                    className="block rounded-2xl border border-white/10 p-4 transition-colors hover:border-sigma-cyan/50"
                  >
                    <p className="line-clamp-2 text-sm text-slate-300">{r.body}</p>
                    <p className="mono mt-2 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.16em] text-slate-500">
                      <MessageSquare size={11} /> {r.discussion_threads?.title}
                      {r.is_pinned && <span className="text-sigma-yellow">· disematkan</span>}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <p className="mono flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] text-slate-600">
        <Clock size={12} /> data pribadi · tidak dibandingkan dengan siswa lain
      </p>
    </div>
  );
}
