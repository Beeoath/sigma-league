import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Map,
  Flame,
  Award,
  Layers,
  Compass,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { MathText } from "../components/MathText";

const CATEGORIES = [
  { id: "all", label: "Semua Modul" },
  { id: "aljabar", label: "Aljabar" },
  { id: "fungsi", label: "Fungsi" },
  { id: "polinomial", label: "Polinomial" },
  { id: "statistika", label: "Statistika" },
  { id: "tka", label: "TKA Siaga" },
];

const QUICK_LESSONS = [
  {
    id: "ql-1",
    moduleId: "modul-1-aljabar",
    title: "Trik Cepat Nilai Mutlak",
    formula: "$|f(x)| < |g(x)| \\Leftrightarrow (f+g)(f-g) < 0$",
    duration: "12 Menit",
    topic: "Aljabar Cepat",
    tag: "Trik TKA",
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    badge: "🔥 Update Hari Ini",
  },
  {
    id: "ql-2",
    moduleId: "modul-2-fungsi",
    title: "Asimtot & Domain Pecahan",
    formula: "f(x) = \\frac{ax+b}{cx+d} \\Rightarrow y_{as} = \\frac{a}{c}",
    duration: "15 Menit",
    topic: "Analisis Fungsi",
    tag: "Konsep Inti",
    color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30",
    badge: "⚡ Populer",
  },
];

export default function SigmaHub() {
  const { profile } = useAuth();
  const nav = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mods = await api("/modules");
        if (mounted) {
          setModules(mods || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat modul:", err);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter modules based on search and category
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        activeCategory === "all" ||
        m.district?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        m.topic?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === "tka" && m.order_index <= 3);

      return matchSearch && matchCat;
    });
  }, [modules, searchQuery, activeCategory]);

  const activeHeroModule = useMemo(() => {
    if (modules.length === 0) return null;
    return modules[selectedHeroIndex % modules.length] || modules[0];
  }, [modules, selectedHeroIndex]);

  const nextHero = () => {
    setSelectedHeroIndex((prev) => (prev + 1) % (modules.length || 1));
  };

  const prevHero = () => {
    setSelectedHeroIndex((prev) => (prev - 1 + (modules.length || 1)) % (modules.length || 1));
  };

  return (
    <div className="space-y-6" data-testid="sigma-hub-root">
      {/* ---------------- TOP BAR (Search + Categories + User Pill) ---------------- */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Left: Search input */}
        <div className="relative w-full xl:w-80">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari modul, materi, rumus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/[0.06] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-sigma-cyan/50 focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-sigma-cyan/20"
            data-testid="hub-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Center: Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat.id
                  ? "bg-white text-slate-950 shadow-md font-bold scale-[1.02]"
                  : "bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
              data-testid={`category-pill-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right: Notifications & Quick Switch */}
        <div className="flex items-center gap-2.5 self-end xl:self-auto">
          {/* View Mode Toggle: Hub vs Peta */}
          <Link
            to="/app/peta"
            className="inline-flex items-center gap-1.5 rounded-full border border-sigma-cyan/30 bg-sigma-cyan/10 px-3.5 py-1.5 text-xs font-bold text-sigma-cyan hover:bg-sigma-cyan/20 transition-colors"
            title="Lihat Peta Jalur Node TKA"
          >
            <Map size={14} /> Peta Jalur
          </Link>

          {/* Notification Button with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Notifikasi"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0c0824] animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-white/10 bg-[#151036] p-4 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Notifikasi Pembelajaran
                  </span>
                  <span className="text-[0.65rem] text-sigma-cyan">Terbaru</span>
                </div>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                    <p className="font-semibold text-white">Selamat Datang di SIGMA!</p>
                    <p className="text-slate-400 text-[0.72rem] mt-0.5">
                      Mulailah dari Modul 01. Capai skor kuis minimal 75 untuk membuka gerbang
                      berikutnya.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                    <p className="font-semibold text-white">TKA Siaga 2026 Aktif</p>
                    <p className="text-slate-400 text-[0.72rem] mt-0.5">
                      Format soal pilihan ganda telah disesuaikan dengan standar MA Darunnajah 9.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- MAIN 2-COLUMN LAYOUT (Directly matching reference image) ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SUB-COLUMN (32% width on desktop) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* WIDGET 1: MATERI BARU & VIDEO KUNCI (Like "New Trailer" in image) */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                  <Flame size={16} />
                </span>
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-white">
                  Materi Baru
                </h3>
              </div>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[0.65rem] font-bold text-slate-300 border border-white/5">
                Update Hari Ini
              </span>
            </div>

            <div className="space-y-3.5">
              {QUICK_LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`group relative overflow-hidden rounded-2xl border ${lesson.border} bg-gradient-to-br ${lesson.color} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-white">
                          {lesson.tag}
                        </span>
                        <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-slate-300">
                          <Clock size={11} /> {lesson.duration}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-sigma-cyan transition-colors">
                        {lesson.title}
                      </h4>
                      <div className="text-[0.72rem] text-slate-300 overflow-x-auto no-scrollbar py-0.5">
                        <MathText text={lesson.formula} />
                      </div>
                    </div>

                    <Link
                      to={`/app/modul/${lesson.moduleId}/materi`}
                      className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-md transition-transform duration-200 group-hover:scale-110"
                      title="Pelajari Materi"
                      data-testid={`play-lesson-${lesson.id}`}
                    >
                      <Play size={16} className="fill-slate-950 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 2: LANJUTKAN BELAJAR (Like "Continue Watching" in image) */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sigma-cyan/20 text-sigma-cyan">
                  <TrendingUp size={16} />
                </span>
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-white">
                  Lanjutkan Belajar
                </h3>
              </div>
              <span className="text-[0.7rem] text-slate-400 font-semibold">
                {modules.filter((m) => m.progress?.status === "available" || m.progress?.status === "completed").length} Aktif
              </span>
            </div>

            <div className="space-y-3">
              {modules.slice(0, 3).map((mod, idx) => {
                const isCompleted = mod.progress?.status === "completed";
                const isAvailable = mod.progress?.status === "available";
                const isLocked = mod.progress?.status === "locked";
                const highestScore = mod.progress?.highest_score || 0;
                const progressPct = isCompleted ? 100 : isAvailable ? 50 : 0;

                return (
                  <div
                    key={mod.id}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.06] hover:border-white/15"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Badge Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${
                          isCompleted
                            ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                            : isAvailable
                            ? "border-sigma-cyan/40 bg-sigma-cyan/20 text-sigma-cyan"
                            : "border-white/10 bg-white/5 text-slate-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={20} />
                        ) : isLocked ? (
                          <Lock size={18} />
                        ) : (
                          `0${idx + 1}`
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-sigma-cyan transition-colors">
                          {mod.title}
                        </h4>
                        <p className="text-[0.68rem] text-slate-400 truncate">{mod.topic}</p>

                        {/* Progress line */}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCompleted
                                  ? "bg-emerald-400"
                                  : "bg-gradient-to-r from-sigma-cyan to-sigma-yellow"
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[0.62rem] font-bold text-slate-400">
                            {isCompleted ? "100%" : highestScore > 0 ? `${highestScore}/100` : "Siap"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isLocked ? (
                      <Link
                        to={`/app/modul/${mod.id}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-sigma-cyan hover:text-slate-950 transition-all"
                        title="Buka Modul"
                        data-testid={`continue-mod-${mod.id}`}
                      >
                        <Play size={14} className="ml-0.5 fill-current" />
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-600">
                        <Lock size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT MAIN COLUMN (68% width on desktop) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* HERO FEATURED MODULE CARD (Matches Spider-Man card in reference image) */}
          {activeHeroModule && (
            <div
              className="relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br from-[#201548] via-[#120b2e] to-[#08051a] p-6 sm:p-9 shadow-2xl transition-all duration-300"
              data-testid="hero-featured-card"
            >
              {/* Glowing decorative background elements */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sigma-cyan/20 blur-[90px]" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-600/20 blur-[90px]" />

              {/* Formula decoration in background */}
              <div className="pointer-events-none absolute right-8 top-12 select-none text-right opacity-15">
                <span className="font-display text-4xl sm:text-6xl font-black text-white/40">
                  {activeHeroModule.district?.toUpperCase() || "ALJABAR"}
                </span>
                <div className="mono text-xs text-sigma-cyan mt-1">
                  Σ f(x) · TKA DARUNNAJAH 9
                </div>
              </div>

              <div className="relative z-10 space-y-4 max-w-xl">
                {/* Top badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                    <Sparkles size={12} /> Modul Unggulan
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-bold text-slate-200 border border-white/10">
                    {activeHeroModule.district || "Distrik Aljabar"}
                  </span>
                  <span className="rounded-full bg-sigma-cyan/15 px-3 py-1 text-[0.7rem] font-bold text-sigma-cyan border border-sigma-cyan/20">
                    Level {activeHeroModule.order_index}
                  </span>
                </div>

                {/* Main Title */}
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white drop-shadow-md">
                  {activeHeroModule.title}
                </h2>

                {/* Topic / Subtitle */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeHeroModule.description ||
                    "Kuasai konsep esensial, pemfaktoran efisien tanpa uji domain redundan, serta pembahasan intensif tipe soal Tes Kemampuan Akademik (TKA)."}
                </p>

                {/* Learning Stats / Target */}
                <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-sigma-cyan" />
                    <span>Materi Interaktif Slide</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award size={14} className="text-amber-400" />
                    <span>Target Lulus: Skor ≥ 75</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to={`/app/modul/${activeHeroModule.id}/materi`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 shadow-xl hover:bg-sigma-cyan hover:scale-105 transition-all"
                    data-testid="hero-play-button"
                  >
                    <Play size={16} className="fill-slate-950" />
                    Mulai Belajar
                  </Link>

                  <Link
                    to={`/app/modul/${activeHeroModule.id}/kuis`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/20 transition-all"
                    data-testid="hero-quiz-button"
                  >
                    Uji Kuis (75+)
                  </Link>

                  <Link
                    to={`/app/modul/${activeHeroModule.id}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title="Detail Lengkap Modul"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Carousel navigation arrows at bottom right (matches the reference image!) */}
              <div className="absolute bottom-5 right-6 flex items-center gap-2 z-20">
                <button
                  onClick={prevHero}
                  aria-label="Modul Sebelumnya"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/20"
                  data-testid="hero-prev-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextHero}
                  aria-label="Modul Berikutnya"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/20"
                  data-testid="hero-next-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM SECTION: REKOMENDASI MODUL UNTUKMU (Matches the 4 cards in reference image) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-wider text-white">
                  Rekomendasi Modul Untukmu
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih modul untuk melihat ringkasan atau langsung masuk ke sesi latihan
                </p>
              </div>
              <Link
                to="/app/peta"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-sigma-cyan hover:underline"
              >
                Lihat Semua ({modules.length} Distrik) <ChevronRight size={14} />
              </Link>
            </div>

            {/* 4 Cards Grid (Directly mirroring the 4 movie cards in the image) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredModules.slice(0, 4).map((mod, idx) => {
                const isCompleted = mod.progress?.status === "completed";
                const isAvailable = mod.progress?.status === "available";
                const isLocked = mod.progress?.status === "locked";
                const isHero = activeHeroModule?.id === mod.id;

                const gradients = [
                  "from-cyan-900/60 via-[#101438] to-[#0a0720]",
                  "from-purple-900/60 via-[#1a0f3c] to-[#0c0822]",
                  "from-amber-900/50 via-[#1f172e] to-[#0a061a]",
                  "from-emerald-900/50 via-[#0e1f2b] to-[#070e17]",
                ];
                const cardGradient = gradients[idx % gradients.length];

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      const modIdx = modules.findIndex((m) => m.id === mod.id);
                      if (modIdx !== -1) setSelectedHeroIndex(modIdx);
                    }}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer min-h-[200px] ${
                      isHero
                        ? "border-sigma-cyan ring-2 ring-sigma-cyan/30 shadow-2xl scale-[1.02]"
                        : "border-white/10 hover:border-white/25 hover:shadow-xl hover:-translate-y-1"
                    } bg-gradient-to-br ${cardGradient}`}
                    data-testid={`rec-card-${mod.id}`}
                  >
                    {/* Card Top: District Tag & Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[0.62rem] font-bold text-slate-200">
                          {mod.district || `Level ${mod.order_index}`}
                        </span>
                        {isCompleted ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.62rem] font-bold text-emerald-300">
                            <Check size={11} /> Selesai
                          </span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[0.62rem] font-bold text-slate-500">
                            <Lock size={11} /> Terkunci
                          </span>
                        ) : (
                          <span className="rounded-full bg-sigma-cyan/20 px-2 py-0.5 text-[0.62rem] font-bold text-sigma-cyan">
                            Terbuka
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-sm font-bold leading-tight text-white group-hover:text-sigma-cyan transition-colors line-clamp-2">
                        {mod.title}
                      </h4>
                      <p className="text-[0.68rem] text-slate-400 line-clamp-2">{mod.topic}</p>
                    </div>

                    {/* Card Bottom: Duration & Circular Play Button */}
                    <div className="flex items-center justify-between pt-4 mt-auto">
                      <div className="mono text-[0.65rem] text-slate-400 font-semibold">
                        {mod.progress?.highest_score ? `Skor: ${mod.progress.highest_score}` : "Syarat: 75"}
                      </div>

                      {!isLocked ? (
                        <Link
                          to={`/app/modul/${mod.id}/materi`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-950 shadow-md transition-transform group-hover:scale-110 hover:bg-sigma-cyan"
                          title="Buka Materi"
                        >
                          <Play size={13} className="fill-slate-950 ml-0.5" />
                        </Link>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-600">
                          <Lock size={13} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
