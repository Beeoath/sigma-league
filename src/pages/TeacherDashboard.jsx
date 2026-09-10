import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info, Users } from "lucide-react";
import { api } from "../lib/api";
import { accentFor } from "../lib/brand";
import { Loader, StatTile } from "../components/Primitives";
import { Reveal } from "../components/Reveal";

const tooltipStyle = {
  background: "#140D36",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
};

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/teacher/dashboard").then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <Loader label="Menghitung agregat kelas..." />;

  const label = (id) => {
    const m = data.modules.find((x) => x.id === id);
    return m ? `M${m.order_index}` : "—";
  };

  const distData = (data?.distribution || []).map((d) => ({
    name: label(d.module_id),
    Selesai: Number(d.pct_completed || 0),
    Berjalan: Number(d.pct_in_progress || 0),
    "Belum mulai": Number(d.pct_not_started || 0),
  }));
  const scoreData = (data?.avg_scores || []).map((d) => ({
    name: label(d.module_id),
    nilai: Number(d.avg_score || 0),
  }));
  const forumData = (data?.forum || []).map((d) => ({
    name: label(d.module_id),
    kontribusi: Number(d.contributions || 0),
  }));

  return (
    <div className="space-y-11">
      <header>
        <p className="overline-label">Dashboard guru · agregat kelas</p>
        <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-4xl">
          Gambaran Kelas XI
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Semua angka di halaman ini bersifat agregat. Nilai individual siswa tidak ditampilkan dan
          tidak ada sistem peringatan otomatis — pemantauan dilakukan secara manual.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Penyelesaian kelas"
          value={`${Number(data.completion_rate || 0).toFixed(1)}%`}
          sub="rata-rata seluruh modul"
          accent="#10B981"
          testid="teacher-completion-rate"
        />
        <StatTile
          label="Jumlah siswa"
          value={data.student_count}
          sub="akun siswa terdaftar"
          accent="#00F0FF"
          testid="teacher-student-count"
        />
        <StatTile
          label="Modul aktif"
          value={data.modules.length}
          sub="distrik SIGMA City"
          accent="#FFD600"
          testid="teacher-module-count"
        />
      </section>

      <Reveal>
        <section className="rounded-3xl glass p-7" data-testid="teacher-distribution-chart">
          <p className="overline-label">Distribusi progres per modul (%)</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="name" stroke="#7c8199" fontSize={12} />
                <YAxis stroke="#7c8199" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="Selesai" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Berjalan" stackId="a" fill="#FFD600" />
                <Bar dataKey="Belum mulai" stackId="a" fill="#3b3f5c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mono mt-4 flex flex-wrap gap-5 text-[0.62rem] uppercase tracking-[0.16em] text-slate-400">
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm bg-sigma-emerald" /> selesai
            </span>
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm bg-sigma-yellow" /> berjalan
            </span>
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm bg-slate-600" /> belum mulai
            </span>
          </div>
        </section>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <section className="rounded-3xl glass p-7" data-testid="teacher-avg-score-chart">
            <p className="overline-label">Rata-rata nilai kuis</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" stroke="#7c8199" fontSize={12} />
                  <YAxis stroke="#7c8199" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="nilai" radius={[8, 8, 0, 0]}>
                    {scoreData.map((d, i) => (
                      <Cell key={i} fill={accentFor(i + 1).hex} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="rounded-3xl glass p-7" data-testid="teacher-forum-chart">
            <p className="overline-label">Partisipasi forum</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" stroke="#7c8199" fontSize={12} />
                  <YAxis stroke="#7c8199" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="kontribusi" fill="#FF007A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </Reveal>
      </div>

      <section className="overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-sigma-panel/70">
            <tr className="mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">
              <th className="px-5 py-4">Modul</th>
              <th className="px-5 py-4">Selesai</th>
              <th className="px-5 py-4">Berjalan</th>
              <th className="px-5 py-4">Belum mulai</th>
              <th className="px-5 py-4">Rata-rata nilai</th>
              <th className="px-5 py-4">Kontribusi forum</th>
            </tr>
          </thead>
          <tbody>
            {(data?.modules || []).map((m, i) => {
              const d = (data?.distribution || []).find((x) => x.module_id === m.id) || {};
              const s = (data?.avg_scores || []).find((x) => x.module_id === m.id) || {};
              const f = (data?.forum || []).find((x) => x.module_id === m.id) || {};
              return (
                <tr
                  key={m.id}
                  data-testid={`teacher-module-row-${m.order_index}`}
                  className="border-t border-white/10 text-slate-300"
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-white">
                      {m.order_index}. {m.title}
                    </span>
                    <span className="mono mt-1 block text-[0.6rem] uppercase tracking-[0.14em] text-slate-500">
                      {m.district_name}
                    </span>
                  </td>
                  <td className="mono px-5 py-4 text-sigma-emerald">
                    {Number(d.pct_completed || 0).toFixed(0)}%
                  </td>
                  <td className="mono px-5 py-4 text-sigma-yellow">
                    {Number(d.pct_in_progress || 0).toFixed(0)}%
                  </td>
                  <td className="mono px-5 py-4 text-slate-500">
                    {Number(d.pct_not_started || 0).toFixed(0)}%
                  </td>
                  <td className="mono px-5 py-4 font-bold text-white">
                    {s.avg_score != null ? Number(s.avg_score).toFixed(1) : "—"}
                  </td>
                  <td className="mono px-5 py-4">{Number(f.contributions || 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="mono flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[0.66rem] leading-relaxed uppercase tracking-[0.14em] text-slate-500">
        <Info size={14} className="mt-0.5 shrink-0" />
        tidak ada notifikasi otomatis · tidak ada peringkat siswa · pemantauan dilakukan manual
        <Users size={14} className="ml-auto mt-0.5 shrink-0" />
      </p>
    </div>
  );
}
