import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap, KeyRound, Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { MASCOTS } from "../lib/brand";
import { SigmaBackground } from "../components/SigmaBackground";
import { Animated3DMascot } from "../components/Animated3DMascot";
import { JusticeLeagueTitle } from "../components/JusticeLeagueTitle";

export default function Login() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "daftar" ? "daftar" : "masuk");
  const [role, setRole] = useState(
    params.get("role") === "guru" || params.get("role") === "teacher" ? "teacher" : "student"
  );
  const [form, setForm] = useState({ full_name: "", email: "", password: "", class_name: "Kelas 11 IPA 1", teacher_code: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showTeacherCode, setShowTeacherCode] = useState(false);
  const [busy, setBusy] = useState(false);
  const { profile, login, register } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (params.get("mode") === "daftar") setMode("daftar");
    if (params.get("role") === "guru" || params.get("role") === "teacher") setRole("teacher");
    else if (params.get("role") === "siswa" || params.get("role") === "student") setRole("student");
  }, [params]);

  useEffect(() => {
    if (profile) nav(profile.role === "teacher" ? "/teacher" : "/app", { replace: true });
  }, [profile, nav]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "daftar" && role === "teacher" && !form.teacher_code?.trim()) {
        throw new Error("Masukkan kode otorisasi guru untuk verifikasi keamanan.");
      }

      const me =
        mode === "masuk"
          ? await login(form.email.trim(), form.password)
          : await register(form.full_name.trim(), form.email.trim(), form.password, role, {
              class_name: role === "student" ? form.class_name : "Pengampu Matematika",
              teacher_code: form.teacher_code?.trim(),
            });
      toast.success(`Selamat datang, ${me.full_name}!`);
      nav(me.role === "teacher" ? "/teacher" : "/app", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <SigmaBackground density={30} glyphs={12} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Link to="/" className="btn-ghost mb-10" data-testid="back-home-link">
            <ArrowLeft size={16} /> Beranda
          </Link>
          <p className="poster-sub text-xs tracking-[0.5em]">MATEMATIKA</p>
          <div className="my-2 w-full max-w-sm -ml-1">
            <JusticeLeagueTitle />
          </div>
          <p className="poster-sub mt-2 text-3xl">KELAS 11</p>
          <p className="mt-1 font-display text-xl font-extrabold text-white">MA DARUNNAJAH 9</p>
          <p className="mt-8 max-w-md text-sm text-slate-400">
            Masuk untuk melanjutkan perjalananmu menembus lima distrik SIGMA City dan bersiap
            menghadapi TKA.
          </p>
          <Animated3DMascot className="mt-8" />
        </div>

        <div className="rounded-[2rem] glass p-7 sm:p-10">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs text-slate-400 lg:hidden">
            <ArrowLeft size={14} /> Beranda
          </Link>
          <div className="flex items-center justify-between">
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl font-display text-xl font-black text-sigma-void transition-colors ${
                mode === "daftar" && role === "teacher" ? "bg-sigma-yellow" : "bg-sigma-cyan"
              }`}
            >
              Σ
            </span>
            {mode === "daftar" && (
              <span
                className={`mono rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider ${
                  role === "teacher"
                    ? "border border-sigma-yellow/40 bg-sigma-yellow/10 text-sigma-yellow"
                    : "border border-sigma-cyan/40 bg-sigma-cyan/10 text-sigma-cyan"
                }`}
              >
                Pendaftaran {role === "teacher" ? "Guru" : "Siswa"}
              </span>
            )}
          </div>

          <h2 className="mt-5 font-display text-2xl font-black text-white">
            {mode === "masuk"
              ? "Masuk ke SIGMA"
              : role === "teacher"
              ? "Daftar Akun Guru"
              : "Daftar Akun Siswa"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "masuk"
              ? "Gunakan email dan password yang terdaftar untuk masuk."
              : role === "teacher"
              ? "Daftarkan diri Anda sebagai pengajar untuk mengelola modul dan memantau kelas."
              : "Akun baru siswa Kelas 11 untuk membuka distrik matematika SIGMA."}
          </p>

          {/* Menu Tab Peran jika mode Daftar */}
          {mode === "daftar" && (
            <div
              className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5"
              data-testid="register-role-tabs"
            >
              <button
                type="button"
                onClick={() => setRole("student")}
                data-testid="tab-register-student"
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  role === "student"
                    ? "bg-sigma-cyan text-sigma-void shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User size={15} /> Siswa Kelas 11
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                data-testid="tab-register-teacher"
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  role === "teacher"
                    ? "bg-sigma-yellow text-sigma-void shadow-[0_0_20px_rgba(255,214,0,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap size={15} /> Guru / Pengajar
              </button>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4" data-testid="auth-form">
            {mode === "daftar" && (
              <div>
                <label htmlFor="full_name" className="overline-label mb-2 block">
                  {role === "teacher" ? "Nama Lengkap & Gelar Guru" : "Nama Lengkap Siswa"}
                </label>
                <input
                  id="full_name"
                  className="field"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder={
                    role === "teacher"
                      ? "Contoh: Ust. Ahmad Fauzi, S.Pd."
                      : "Nama lengkap sesuai absen kelas"
                  }
                  value={form.full_name}
                  onChange={set("full_name")}
                  data-testid="register-fullname-input"
                />
              </div>
            )}
            {mode === "daftar" && role === "student" && (
              <div>
                <label htmlFor="class_name" className="overline-label mb-2 block">
                  Pilih Kelas
                </label>
                <select
                  id="class_name"
                  className="field cursor-pointer"
                  value={form.class_name}
                  onChange={set("class_name")}
                  data-testid="register-class-select"
                >
                  <option value="Kelas 11 IPA 1">Kelas 11 IPA 1</option>
                  <option value="Kelas 11 IPA 2">Kelas 11 IPA 2</option>
                  <option value="Kelas 11 IPS 1">Kelas 11 IPS 1</option>
                  <option value="Kelas 11 IPS 2">Kelas 11 IPS 2</option>
                  <option value="Kelas 11 Keagamaan">Kelas 11 Keagamaan</option>
                </select>
              </div>
            )}
            <div>
              <label htmlFor="email" className="overline-label mb-2 block">
                Email {role === "teacher" && mode === "daftar" ? "Guru / Sekolah" : ""}
              </label>
              <input
                id="email"
                type="email"
                className="field"
                required
                autoComplete="email"
                placeholder={
                  role === "teacher" && mode === "daftar"
                    ? "guru@darunnajah9.sch.id"
                    : "nama@sekolah.id"
                }
                value={form.email}
                onChange={set("email")}
                data-testid="auth-email-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="overline-label mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="field !pr-12"
                  required
                  minLength={6}
                  autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={set("password")}
                  data-testid="auth-password-input"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  data-testid="toggle-password-visibility-button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "daftar" && role === "teacher" && (
              <div className="rounded-2xl border border-sigma-yellow/30 bg-sigma-yellow/[0.06] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="teacher_code" className="overline-label !text-sigma-yellow flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={14} className="text-sigma-yellow" /> Kode Otorisasi Guru
                  </label>
                  <span className="mono text-[0.62rem] text-sigma-yellow font-bold uppercase tracking-wider">
                    Wajib Valid
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="teacher_code"
                    type={showTeacherCode ? "text" : "password"}
                    className="field !border-sigma-yellow/40 focus:!border-sigma-yellow focus:!shadow-[0_0_18px_rgba(255,214,0,0.3)] !pr-12 uppercase placeholder:normal-case font-mono tracking-wider font-semibold text-sigma-yellow"
                    required
                    autoComplete="off"
                    placeholder="Contoh: SIGMAGURU2026"
                    value={form.teacher_code || ""}
                    onChange={set("teacher_code")}
                    data-testid="teacher-code-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeacherCode((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={showTeacherCode ? "Sembunyikan kode" : "Tampilkan kode"}
                  >
                    {showTeacherCode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-start gap-2 pt-1 text-[0.72rem] text-slate-300">
                  <KeyRound size={13} className="shrink-0 text-sigma-yellow mt-0.5" />
                  <div>
                    <p>
                      Hanya untuk dewan guru MA Darunnajah 9. Siswa tidak dapat mendaftar tanpa kode otorisasi resmi sekolah.
                    </p>
                    <p className="text-slate-400 text-[0.68rem] mt-0.5 font-mono">
                      (Kode resmi verifikasi: <strong className="text-sigma-yellow">SIGMAGURU2026</strong>)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className={`w-full ${
                mode === "daftar" && role === "teacher"
                  ? "btn-sigma !bg-sigma-yellow !text-sigma-void hover:!bg-sigma-yellow/90 !shadow-[0_0_25px_rgba(255,214,0,0.5)]"
                  : "btn-sigma"
              }`}
              data-testid="auth-submit-button"
            >
              {busy ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <ArrowRight size={17} />
              )}
              {mode === "masuk"
                ? "Masuk ke SIGMA"
                : role === "teacher"
                ? "Daftar Akun Guru"
                : "Daftar Akun Siswa"}
            </button>
          </form>

          {mode === "masuk" ? (
            <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-slate-400">
              <p>Belum memiliki akun?</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("daftar");
                    setRole("student");
                  }}
                  className="font-semibold text-sigma-cyan transition-colors hover:underline"
                  data-testid="link-register-student"
                >
                  Daftar Siswa
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("daftar");
                    setRole("teacher");
                  }}
                  className="font-semibold text-sigma-yellow transition-colors hover:underline"
                  data-testid="link-register-teacher"
                >
                  Daftar Akun Guru
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMode("masuk")}
              className="mt-6 w-full text-center text-sm text-slate-400 transition-colors hover:text-white"
              data-testid="auth-toggle-mode"
            >
              Sudah punya akun?{" "}
              <span className="font-semibold text-sigma-cyan hover:underline">
                Masuk di sini
              </span>
            </button>
          )}

          <div
            className={`mt-8 flex items-start gap-3 rounded-2xl border p-4 ${
              mode === "daftar" && role === "teacher"
                ? "border-sigma-yellow/30 bg-sigma-yellow/[0.06]"
                : "border-white/10 bg-sigma-void/50"
            }`}
          >
            <GraduationCap
              size={18}
              className={`mt-0.5 shrink-0 ${
                mode === "daftar" && role === "teacher"
                  ? "text-sigma-yellow"
                  : "text-slate-400"
              }`}
            />
            <p className="text-xs leading-relaxed text-slate-400">
              {mode === "daftar" && role === "teacher"
                ? "Akun guru memiliki akses penuh ke Dashboard Guru, pengelolaan materi slide, bank soal kuis, serta moderasi forum diskusi kelas."
                : "Guru dan siswa masuk melalui halaman ini. Sistem akan otomatis mengarahkan ke dashboard yang sesuai dengan peran akun Anda."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
