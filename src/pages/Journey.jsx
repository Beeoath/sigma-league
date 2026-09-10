import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, RotateCcw } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { CITY_IMG, accentFor, mascotFor } from "../lib/brand";
import { Loader } from "../components/Primitives";
import { Reveal } from "../components/Reveal";

const STATE_COPY = {
  locked: { label: "Terkunci", cta: "Terkunci" },
  available: { label: "Terbuka", cta: "Mulai Modul" },
  completed: { label: "Selesai", cta: "Tinjau Modul" },
};

const ModuleNode = ({ module, index }) => {
  const status = module.progress.status;
  const accent = accentFor(module.order_index);
  const mascot = mascotFor(module.order_index);
  const locked = status === "locked";
  const done = status === "completed";
  const color = locked ? "#4b5573" : done ? "#10B981" : accent.hex;

  return (
    <Reveal delay={index * 0.06}>
      <div
        data-testid={`module-node-${module.order_index}`}
        data-status={status}
        className={`group relative overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-500 sm:p-8 ${
          locked ? "opacity-55 grayscale" : "hover:-translate-y-1.5"
        }`}
        style={{
          borderColor: `${color}55`,
          background: locked
            ? "rgba(11,7,30,0.7)"
            : `linear-gradient(150deg, ${color}18, rgba(11,7,30,0.9))`,
          boxShadow: locked ? "none" : `0 24px 60px -34px ${color}`,
        }}
      >
        {!locked && !done && (
          <span
            className="anim-ring pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full"
            style={{ border: `2px solid ${color}` }}
          />
        )}

        <span
          className="mono pointer-events-none absolute -bottom-8 right-2 text-8xl font-bold opacity-10"
          style={{ color }}
        >
          {accent.symbol}
        </span>

        <div className="relative flex items-start gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-black"
            style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {String(module.order_index).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="mono text-[0.64rem] uppercase tracking-[0.24em]" style={{ color }}>
              {module.district_name}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold leading-snug text-white sm:text-xl">
              {module.title}
            </h3>
          </div>
          {!locked && (
            <img
              src={mascot.img}
              alt=""
              className="anim-float hidden h-16 w-16 rounded-xl object-cover sm:block"
              style={{ animationDelay: `${index * 0.4}s` }}
            />
          )}
        </div>

        <p className="relative mt-4 line-clamp-2 text-sm text-slate-400">{module.description}</p>

        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <span
            className="mono inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em]"
            style={{ background: `${color}1f`, color }}
            data-testid={`module-status-${module.order_index}`}
          >
            {locked && <Lock size={11} />}
            {done && <CheckCircle2 size={11} />}
            {STATE_COPY[status].label}
          </span>
          {module.progress.must_review_material && (
            <span className="mono inline-flex items-center gap-1.5 rounded-full bg-sigma-magenta/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-sigma-magenta">
              <RotateCcw size={11} /> tinjau materi
            </span>
          )}
          <span className="mono text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">
            ± {module.estimated_minutes} menit
          </span>
        </div>

        <div className="relative mt-6">
          {locked ? (
            <p className="mono text-[0.66rem] leading-relaxed text-slate-500">
              Selesaikan modul {module.order_index - 1} dengan nilai ≥ 75 untuk membuka distrik ini.
            </p>
          ) : (
            <Link
              to={`/app/modul/${module.id}`}
              className={`btn-sigma text-xs ${done ? "btn-yellow" : ""}`}
              data-testid={`module-open-button-${module.order_index}`}
            >
              {STATE_COPY[status].cta} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
};

export default function Journey() {
  const { profile } = useAuth();
  const [modules, setModules] = useState(null);

  useEffect(() => {
    api("/modules").then(setModules).catch(() => setModules([]));
  }, []);

  if (!modules) return <Loader />;

  const completed = modules.filter((m) => m.progress.status === "completed").length;
  const current = modules.find((m) => m.progress.status === "available");

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={CITY_IMG}
          alt="SIGMA City"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sigma-void via-sigma-void/80 to-transparent" />
        <div className="relative p-7 sm:p-12">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overline-label"
          >
            SIGMA City · Peta Perjalanan
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-3 font-display text-3xl font-black leading-tight text-white sm:text-5xl"
          >
            Halo, {profile?.full_name?.split(" ")[0]}.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-3 max-w-lg text-sm text-slate-300 sm:text-base"
            data-testid="journey-current-hint"
          >
            {current
              ? `Distrik yang bisa kamu masuki sekarang: ${current.district_name} — ${current.title}.`
              : "Luar biasa. Kamu telah menuntaskan seluruh distrik SIGMA City."}
          </motion.p>

          <div className="mt-8 max-w-sm">
            <div className="flex items-end justify-between">
              <span className="overline-label">Progres perjalanan</span>
              <span
                className="mono text-sm font-bold text-sigma-cyan"
                data-testid="journey-progress-count"
              >
                {completed} / {modules.length} modul
              </span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sigma-cyan to-sigma-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${(completed / modules.length) * 100}%` }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="overline-label">Distrik</p>
        <h2 className="mt-3 font-display text-2xl font-black text-white sm:text-3xl">
          Buka satu gerbang demi satu
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {modules.map((m, i) => (
            <ModuleNode key={m.id} module={m} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
