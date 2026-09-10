import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, Lock, PlayCircle, Sparkles } from "lucide-react";
import { CITY_IMG, DISTRICT_ACCENT, MASCOTS } from "../lib/brand";
import { MaskedLine, Reveal } from "../components/Reveal";
import { SigmaBackground } from "../components/SigmaBackground";
import { TiltCard } from "../components/Animated3DMascot";
import { JusticeLeagueTitle } from "../components/JusticeLeagueTitle";
import { IronManTitle } from "../components/IronManTitle";
import { useLenis } from "../lib/useLenis";

const MARQUEE = [
  "x² + bx + c = 0",
  "f∘g (x) = f(g(x))",
  "Σ (xᵢ − x̄)²",
  "P(A ∪ B) = P(A) + P(B)",
  "sin²θ + cos²θ = 1",
  "|a| = √(a₁² + a₂²)",
  "LEARN. SOLVE. UNLOCK YOUR FUTURE.",
];

const CHAPTERS = [
  {
    n: "01",
    title: "Satu gerbang, satu penguasaan",
    body: "Setiap modul adalah gerbang di SIGMA City. Gerbang berikutnya hanya terbuka ketika kamu benar-benar menguasai yang sekarang — nilai kuis minimal 75.",
  },
  {
    n: "02",
    title: "Materi dulu, kuis kemudian",
    body: "Materi disajikan seperti presentasi bergerak: satu slide, satu ide. Kuis berada di halaman terpisah agar belajar dan menguji tidak saling mengganggu.",
  },
  {
    n: "03",
    title: "Gagal bukan akhir, tapi arah",
    body: "Nilai di bawah 75 mengembalikanmu ke materi. Kamu wajib meninjau ulang sebelum mencoba lagi — karena mengulang tanpa memahami hanya mengulang kesalahan.",
  },
  {
    n: "04",
    title: "Tanpa peringkat, tanpa perbandingan",
    body: "Tidak ada XP, lencana, atau papan peringkat. Perjalananmu sepenuhnya milikmu. Guru hanya melihat gambaran kelas, bukan nilai per siswa.",
  },
];

const Landing = () => {
  useLenis();
  const heroRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const cityY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const cityScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.2]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-sigma-deep">
      <SigmaBackground density={44} glyphs={16} />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "glass border-b border-white/10" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sigma-cyan font-display text-xl font-black text-sigma-void shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              Σ
            </span>
            <span className="leading-none">
              <span className="block font-display text-[0.58rem] font-black tracking-[0.34em] text-sigma-cyan">
                MATEMATIKA
              </span>
              <span className="block font-display text-lg font-black tracking-tight text-white">SIGMA</span>
            </span>
          </div>
          <span className="mono ml-6 hidden text-[0.68rem] uppercase tracking-[0.24em] text-slate-400/90 lg:block">
            MA DARUNNAJAH 9 &times; UNIVERSITAS PAMULANG <span className="text-sigma-cyan/80 font-normal">&int;</span>
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/masuk?mode=daftar&role=guru"
              className="mono hidden items-center gap-1.5 rounded-full border border-sigma-yellow/40 bg-sigma-yellow/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-wider text-sigma-yellow transition-all hover:bg-sigma-yellow/20 sm:inline-flex"
              data-testid="header-teacher-register-button"
            >
              <GraduationCap size={14} /> Portal Guru
            </Link>
            <Link to="/masuk" className="btn-sigma !px-8 !py-2.5 font-black uppercase tracking-wider" data-testid="header-login-button">
              MASUK
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative z-10 min-h-[102vh] overflow-hidden">
        <motion.div
          style={{ y: cityY, scale: cityScale }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62vh] origin-bottom"
        >
          <img
            src={CITY_IMG}
            alt="Panorama kota futuristik SIGMA City"
            className="h-full w-full object-cover object-top opacity-70 [mask-image:linear-gradient(to_top,#000_18%,transparent_92%)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sigma-deep via-sigma-deep/25 to-transparent" />
        </motion.div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative mx-auto flex min-h-[102vh] max-w-6xl flex-col justify-center px-5 pt-28 sm:px-8"
        >
          <MaskedLine delay={0.15}>
            <span className="poster-sub block text-xs tracking-[0.35em] sm:text-sm md:text-base font-black">
              MATEMATIKA
            </span>
          </MaskedLine>

          <MaskedLine delay={0.28}>
            <div className="relative mt-2 w-full max-w-4xl lg:max-w-5xl -ml-2 sm:-ml-3">
              <JusticeLeagueTitle />
            </div>
          </MaskedLine>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <MaskedLine delay={0.42}>
              <span className="poster-sub text-2xl font-black sm:text-4xl lg:text-5xl">
                KELAS 11
              </span>
            </MaskedLine>
            <MaskedLine delay={0.54}>
              <span className="font-display text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                MA DARUNNAJAH 9
              </span>
            </MaskedLine>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
          >
            <span className="font-semibold text-sigma-cyan">Sistem Interaktif Gerbang Modul Matematika Atraktif.</span>{" "}
            Jelajahi kota matematika futuristik, buka satu distrik demi satu, dan siapkan dirimu
            menghadapi TKA Kelas 12.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link to="/masuk" className="btn-sigma !px-7 !py-3.5 text-xs sm:text-sm font-black tracking-wider uppercase" data-testid="hero-start-journey-button">
              START YOUR JOURNEY <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
            <a href="#kota" className="btn-ghost !px-6 !py-3.5 text-xs sm:text-sm font-black tracking-wider uppercase" data-testid="hero-explore-button">
              <PlayCircle size={17} strokeWidth={2.5} /> LIHAT SIGMA CITY
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 1 }}
            className="mono mt-10 text-[0.66rem] uppercase tracking-[0.28em] text-slate-500"
          >
            Your journey to TKA starts here
          </motion.p>
        </motion.div>

        {/* Mascots swinging in the hero */}
        <motion.img
          initial={{ opacity: 0, x: -70, y: -40, rotate: -12 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: -6 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={MASCOTS.alpha.img}
          alt={MASCOTS.alpha.name}
          className="anim-swing pointer-events-none absolute right-[3%] top-[16%] hidden w-40 rounded-[2rem] object-cover shadow-[0_30px_70px_-20px_rgba(0,240,255,0.6)] lg:block xl:w-56"
        />
        <motion.img
          initial={{ opacity: 0, x: 60, y: 40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={MASCOTS.gamma.img}
          alt={MASCOTS.gamma.name}
          className="anim-float pointer-events-none absolute right-[16%] top-[52%] hidden w-28 rounded-[1.6rem] object-cover shadow-[0_30px_60px_-20px_rgba(255,214,0,0.55)] xl:block"
          style={{ animationDelay: "1.4s" }}
        />
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <section className="relative z-10 border-y border-white/10 bg-sigma-void/70 py-5">
        <div className="flex w-max anim-marquee gap-14 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={i}
              className="mono text-sm uppercase tracking-[0.3em] text-slate-500 sm:text-base"
            >
              {m}
              <span className="ml-14 text-sigma-magenta">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- MANIFESTO ---------------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <Reveal>
          <p className="overline-label">Cara SIGMA bekerja</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-black leading-tight text-white sm:text-5xl">
            Empat prinsip yang membentuk perjalananmu
          </h2>
        </Reveal>

        <div className="mt-16 space-y-px overflow-hidden rounded-3xl border border-white/10">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.08}>
              <div className="group grid gap-4 border-b border-white/10 bg-sigma-panel/45 p-7 transition-colors duration-300 last:border-0 hover:bg-sigma-panel/80 sm:grid-cols-[7rem_1fr] sm:p-10">
                <span className="mono text-4xl font-bold text-sigma-cyan/35 transition-colors duration-300 group-hover:text-sigma-cyan sm:text-5xl">
                  {c.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{c.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                    {c.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- DISTRICTS ---------------- */}
      <section id="kota" className="relative z-10 mx-auto max-w-6xl px-5 pb-28 sm:px-8">
        <Reveal>
          <p className="overline-label">Peta perjalanan</p>
          <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-5xl">
            Lima distrik SIGMA City
          </h2>
          <p className="mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Distrik terbuka berurutan. Setiap distrik memiliki materi presentasi, kuis 15 soal
            berdurasi 20 menit, dan ruang diskusi tersendiri.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(DISTRICT_ACCENT).map(([order, d], i) => (
            <Reveal key={order} delay={i * 0.07}>
              <div
                className="group relative h-full overflow-hidden rounded-3xl border p-7 transition-transform duration-500 hover:-translate-y-2"
                style={{ borderColor: `${d.hex}33`, background: `linear-gradient(160deg, ${d.hex}14, rgba(11,7,30,0.85))` }}
              >
                <span
                  className="mono absolute -bottom-6 -right-2 text-7xl font-bold opacity-15 transition-opacity duration-500 group-hover:opacity-30"
                  style={{ color: d.hex }}
                >
                  {d.symbol}
                </span>
                <span className="mono text-xs tracking-[0.25em]" style={{ color: d.hex }}>
                  MODUL {String(order).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white">{d.label}</h3>
                <p className="mt-3 text-sm text-slate-400">
                  {order === "1" && "Bentuk aljabar, persamaan kuadrat, dan SPLDV."}
                  {order === "2" && "Relasi, domain–range, komposisi, dan invers fungsi."}
                  {order === "3" && "Trigonometri dasar, dimensi tiga, dan vektor."}
                  {order === "4" && "Pencacahan, permutasi, kombinasi, dan peluang."}
                  {order === "5" && "Pemusatan, penyebaran, dan penafsiran data."}
                </p>
                {order !== "1" && (
                  <span className="mono mt-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-slate-500">
                    <Lock size={12} /> terbuka setelah modul sebelumnya
                  </span>
                )}
                {order === "1" && (
                  <span className="mono mt-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-sigma-cyan">
                    <Sparkles size={12} /> gerbang pertama terbuka
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- MASCOTS ---------------- */}
      <section className="relative z-10 border-y border-white/10 bg-sigma-void/60 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="overline-label">Pemandu perjalanan</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-black text-white sm:text-5xl">
              Tiga pahlawan matematika menemanimu
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {Object.entries(MASCOTS).map(([key, m], i) => (
              <Reveal key={key} delay={i * 0.1}>
                <TiltCard className="group relative">
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-sigma-panel/40 p-2 shadow-2xl transition-all duration-300 group-hover:border-sigma-cyan/50 group-hover:shadow-[0_20px_50px_rgba(0,240,255,0.2)]">
                    <div className="relative overflow-hidden rounded-[1.6rem]">
                      <div className="absolute inset-0 z-10 bg-[radial-gradient(60%_50%_at_50%_20%,transparent,rgba(7,4,26,0.75))]" />
                      <img
                        src={m.img}
                        alt={m.name}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
                        style={{ transform: "translateZ(20px)" }}
                      />
                    </div>
                  </div>
                  <figcaption className="mt-5" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sigma-cyan animate-pulse" />
                      <h3 className="font-display text-lg font-bold text-white">{m.name}</h3>
                    </div>
                    <p className="mono mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-sigma-cyan">
                      {m.role}
                    </p>
                  </figcaption>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-32 text-center sm:px-8">
        <Reveal>
          <h2 className="w-full flex justify-center">
            <IronManTitle text="SIAP MASUK?" />
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm text-slate-400 sm:text-base">
            Buat akun siswa dalam hitungan detik, lalu buka gerbang pertama Algebra District.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/masuk?mode=daftar" className="btn-sigma" data-testid="cta-register-button">
              Daftar Siswa <ArrowRight size={17} />
            </Link>
            <Link
              to="/masuk?mode=daftar&role=guru"
              className="btn-ghost flex items-center gap-2 border-sigma-yellow/40 text-sigma-yellow hover:border-sigma-yellow hover:bg-sigma-yellow/10"
              data-testid="cta-teacher-register-button"
            >
              <GraduationCap size={16} /> Daftar Akun Guru
            </Link>
            <Link to="/masuk" className="btn-ghost" data-testid="cta-login-button">
              Sudah punya akun
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-slate-500">
            MATEMATIKA SIGMA · KELAS 11 · MA DARUNNAJAH 9
          </p>
          <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-slate-600">
            Pengabdian Masyarakat · Prodi Matematika Universitas Pamulang
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
