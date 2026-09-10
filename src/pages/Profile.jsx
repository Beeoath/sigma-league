import { useEffect, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  GraduationCap,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AVATAR_PRESETS } from "../lib/avatarPresets";
import { compressImageToDataUrl } from "../lib/imageUtils";
import { UserAvatar } from "../components/UserAvatar";
import { Loader, StatTile } from "../components/Primitives";

const CLASS_OPTIONS = [
  "XI MIPA 1 (Sains Unggulan)",
  "XI MIPA 2 (Sains Terapan)",
  "XI MIPA 3 (Sains Reguler)",
  "XI IPS 1 (Sosial Humaniora)",
  "XI IPS 2 (Sosial Humaniora)",
  "XI Keagamaan (Tahfidz & Dirasah Islamiyah)",
  "Pengampu Matematika (Dewan Guru)",
];

const TARGET_CAMPUS_SUGGESTIONS = [
  "ITB - STEI (Rekayasa Perangkat Lunak)",
  "UI - Fasilkom (Ilmu Komputer)",
  "UGM - Matematika Murni & Terapan",
  "ITS - Teknik Informatika",
  "UNAIR - Kedokteran",
  "UNPAD - Statistika & Sains Data",
  "IPB - Aktuaria & Matematika",
  "UIN Jakarta - Pendidikan Matematika",
];

const FAVORITE_TOPIC_SUGGESTIONS = [
  "Pertidaksamaan Nilai Mutlak",
  "Fungsi Komposisi & Invers",
  "Kalkulus & Konsep Limit",
  "Geometri Ruang Tiga Dimensi",
  "Peluang & Kombinatorika",
  "Matriks & Transformasi Geometri",
  "Statistika Deskriptif & Inferensial",
];

export default function Profile() {
  const { profile, setProfile, logout } = useAuth();
  const nav = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [className, setClassName] = useState(profile?.class_name || CLASS_OPTIONS[0]);
  const [schoolName, setSchoolName] = useState(profile?.school_name || "MA Darunnajah 9");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [targetCampus, setTargetCampus] = useState(profile?.target_campus || "");
  const [favoriteTopic, setFavoriteTopic] = useState(profile?.favorite_topic || "");
  const [nisn, setNisn] = useState(profile?.nisn || "");

  // UI State
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Sync state if profile changes externally
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setClassName(profile.class_name || CLASS_OPTIONS[0]);
      setSchoolName(profile.school_name || "MA Darunnajah 9");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
      setTargetCampus(profile.target_campus || "");
      setFavoriteTopic(profile.favorite_topic || "");
      setNisn(profile.nisn || "");
    }
  }, [profile]);

  // Load user dashboard stats
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api("/me/dashboard");
        if (mounted) {
          setStats(data);
          setStatsLoading(false);
        }
      } catch {
        if (mounted) setStatsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges =
    fullName !== (profile?.full_name || "") ||
    avatarUrl !== (profile?.avatar_url || "") ||
    className !== (profile?.class_name || CLASS_OPTIONS[0]) ||
    schoolName !== (profile?.school_name || "MA Darunnajah 9") ||
    phone !== (profile?.phone || "") ||
    bio !== (profile?.bio || "") ||
    targetCampus !== (profile?.target_campus || "") ||
    favoriteTopic !== (profile?.favorite_topic || "") ||
    nisn !== (profile?.nisn || "");

  // Handle image file selection (both click & drop)
  const processImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Berkas harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file gambar maksimal 5 MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 360, 360, 0.88);
      setAvatarUrl(compressedDataUrl);
      toast.success("Foto profil berhasil dipasang! Klik 'Simpan Perubahan' untuk memperbarui.");
      setShowAvatarModal(false);
    } catch (err) {
      toast.error(err.message || "Gagal memproses gambar profil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Submit Profile Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error("Nama lengkap minimal 2 karakter.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        class_name: className,
        school_name: schoolName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        target_campus: targetCampus.trim(),
        favorite_topic: favoriteTopic.trim(),
        nisn: nisn.trim(),
      };

      const updated = await api("/auth/me", {
        method: "PUT",
        body: payload,
      });

      setProfile(updated);
      toast.success("Profil akun SIGMA berhasil diperbarui!");
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui profil.");
    } finally {
      setBusy(false);
    }
  };

  const isTeacher = profile?.role === "teacher";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="overline-label">Pengaturan Akun</p>
          <h1 className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">
            Profil Pengguna SIGMA
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola foto profil, data pribadi, target akademik, dan preferensi belajar Anda.
          </p>
        </div>

        {hasUnsavedChanges && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            Ada perubahan yang belum disimpan
          </div>
        )}
      </header>

      {/* Main Profile Summary Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-sigma-panel/90 via-[#120D2C] to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sigma-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with hover change trigger */}
          <div className="relative group">
            <UserAvatar
              src={avatarUrl}
              name={fullName || profile?.full_name}
              role={profile?.role}
              size="3xl"
              showBadge
              className="ring-4 ring-white/10 shadow-2xl transition-transform group-hover:scale-[1.02]"
            />

            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              data-testid="profile-avatar-trigger"
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 text-white font-display text-[0.68rem] font-bold uppercase tracking-wider"
              title="Ubah Foto Profil"
            >
              <Camera size={22} className="mb-1 text-sigma-cyan" />
              <span>Ganti Foto</span>
            </button>
          </div>

          {/* User Bio and Primary Meta */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span
                className={`mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] font-bold ${
                  isTeacher
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "bg-sigma-cyan/15 text-sigma-cyan border border-sigma-cyan/30"
                }`}
              >
                {isTeacher ? <ShieldCheck size={11} /> : <User size={11} />}
                {isTeacher ? "Dewan Guru Pengampu" : "Siswa Kelas 11 MA"}
              </span>

              <span className="mono inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[0.62rem] text-slate-400">
                <CheckCircle2 size={11} className="text-emerald-400" /> Akun Terverifikasi
              </span>
            </div>

            <h2 className="mt-3 font-display text-xl sm:text-2xl font-black text-white truncate">
              {fullName || "Nama Belum Diisi"}
            </h2>

            <p className="text-sm text-slate-300 mt-1 truncate" data-testid="profile-email">
              {profile?.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{className}</span>
              <span>•</span>
              <span>{schoolName}</span>
              {phone && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <Phone size={11} className="text-sigma-cyan" /> {phone}
                  </span>
                </>
              )}
            </div>

            {bio ? (
              <p className="mt-3 text-xs italic text-slate-300 bg-white/[0.03] border border-white/5 rounded-xl px-3.5 py-2">
                &ldquo;{bio}&rdquo;
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-500 italic">
                Belum ada motto belajar. Tambahkan di formulir di bawah.
              </p>
            )}

            {/* Quick avatar buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 hover:border-sigma-cyan/50 transition-colors"
                data-testid="profile-change-avatar-btn"
              >
                <Camera size={13} className="text-sigma-cyan" />
                Ubah Foto Profil
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl("");
                    toast.info("Foto profil direset. Klik 'Simpan' untuk konfirmasi.");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Hapus foto dan gunakan inisial"
                >
                  <Trash2 size={12} /> Hapus Foto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Stats Preview (for students) */}
      {!isTeacher && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <StatTile
            label="Modul Tuntas"
            value={statsLoading ? "..." : `${stats?.completed || 0}/5`}
            sub="Persiapan TKA"
            accent="#00F0FF"
            testid="profile-stat-completed"
          />
          <StatTile
            label="Total Poin XP"
            value={
              statsLoading
                ? "..."
                : stats?.attempts?.reduce((acc, a) => acc + (a.score || 0), 0) || 0
            }
            sub="Akumulasi Belajar"
            accent="#FFD600"
            testid="profile-stat-xp"
          />
          <StatTile
            label="Kuis Dikerjakan"
            value={statsLoading ? "..." : stats?.attempts?.length || 0}
            sub="Riwayat Percobaan"
            accent="#A78BFA"
            testid="profile-stat-attempts"
          />
          <StatTile
            label="Diskusi Aktif"
            value={
              statsLoading
                ? "..."
                : (stats?.threads?.length || 0) + (stats?.replies?.length || 0)
            }
            sub="Kontribusi Forum"
            accent="#10B981"
            testid="profile-stat-forum"
          />
        </div>
      )}

      {/* Main Form: Data Diri & Akademik */}
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
        {/* Section 1: Identitas Pribadi */}
        <div className="rounded-[24px] border border-white/10 bg-sigma-panel/50 p-6 sm:p-7 backdrop-blur-xl space-y-5">
          <div className="border-b border-white/10 pb-3 flex items-center gap-2 text-white">
            <User size={18} className="text-sigma-cyan" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              1. Identitas & Data Pribadi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="pname" className="overline-label mb-2 block">
                Nama Lengkap <span className="text-sigma-cyan">*</span>
              </label>
              <input
                id="pname"
                type="text"
                required
                minLength={2}
                maxLength={80}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Muhammad Raihan Pratama"
                className="field"
                data-testid="profile-name-input"
              />
              <p className="mt-1.5 text-[0.68rem] text-slate-400">
                Nama ini akan digunakan pada sertifikat capaian modul, riwayat kuis, dan forum diskusi.
              </p>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="overline-label mb-2 block">Email Akun (Terdaftar)</label>
              <input
                type="email"
                disabled
                value={profile?.email || ""}
                className="field cursor-not-allowed opacity-60 bg-white/[0.02]"
              />
              <p className="mt-1.5 text-[0.68rem] text-slate-500">
                Email ditautkan dengan autentikasi madrasah dan tidak dapat diubah bebas.
              </p>
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label htmlFor="pphone" className="overline-label mb-2 block">
                Nomor WhatsApp / Kontak
              </label>
              <div className="relative">
                <input
                  id="pphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="field pl-9"
                  data-testid="profile-phone-input"
                />
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
              <p className="mt-1.5 text-[0.68rem] text-slate-400">
                Digunakan untuk koordinasi bimbingan belajar dan notifikasi kuis penting.
              </p>
            </div>

            {/* Bio / Motto */}
            <div className="sm:col-span-2">
              <label htmlFor="pbio" className="overline-label mb-2 block">
                Motto Belajar & Catatan Motivasi
              </label>
              <textarea
                id="pbio"
                rows={2}
                maxLength={200}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan komitmen atau target belajar matematika Anda (misal: Konsisten 5 soal nilai mutlak per hari)..."
                className="field resize-none"
                data-testid="profile-bio-input"
              />
              <div className="mt-1 flex justify-between text-[0.68rem] text-slate-400">
                <span>Dapat dilihat oleh sesama siswa di forum diskusi.</span>
                <span className="mono">{bio.length}/200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Data Akademik & Target Impian */}
        <div className="rounded-[24px] border border-white/10 bg-sigma-panel/50 p-6 sm:p-7 backdrop-blur-xl space-y-5">
          <div className="border-b border-white/10 pb-3 flex items-center gap-2 text-white">
            <GraduationCap size={18} className="text-sigma-yellow" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              2. Data Akademik & Target Belajar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Class / Rombel */}
            <div>
              <label htmlFor="pclass" className="overline-label mb-2 block">
                Kelas / Rombel Belajar
              </label>
              <select
                id="pclass"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="field"
                data-testid="profile-class-select"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* School Name */}
            <div>
              <label htmlFor="pschool" className="overline-label mb-2 block">
                Asal Madrasah / Sekolah
              </label>
              <input
                id="pschool"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="field"
                data-testid="profile-school-input"
              />
            </div>

            {/* NISN / NIP */}
            <div>
              <label htmlFor="pnisn" className="overline-label mb-2 block">
                {isTeacher ? "NIP / ID Guru" : "NISN (Nomor Induk Siswa)"}
              </label>
              <input
                id="pnisn"
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder={isTeacher ? "Contoh: 198501012010011001" : "Contoh: 0071234567"}
                className="field"
                data-testid="profile-nisn-input"
              />
            </div>

            {/* Favorite Topic */}
            <div>
              <label htmlFor="ptopic" className="overline-label mb-2 block">
                Topik Matematika Terfavorit
              </label>
              <input
                id="ptopic"
                type="text"
                value={favoriteTopic}
                onChange={(e) => setFavoriteTopic(e.target.value)}
                placeholder="Pilih dari daftar atau ketik sendiri..."
                className="field"
                data-testid="profile-topic-input"
              />
            </div>

            {/* Quick Topic Chips */}
            <div className="sm:col-span-2">
              <p className="text-[0.68rem] text-slate-400 mb-2">Pilihan cepat materi favorit:</p>
              <div className="flex flex-wrap gap-2">
                {FAVORITE_TOPIC_SUGGESTIONS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setFavoriteTopic(topic)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors border ${
                      favoriteTopic === topic
                        ? "border-sigma-cyan bg-sigma-cyan/20 text-sigma-cyan font-bold"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Target PTN / Campus */}
            <div className="sm:col-span-2">
              <label htmlFor="pcampus" className="overline-label mb-2 block">
                Target Kampus & Jurusan Impian (SNBT / TKA)
              </label>
              <div className="relative">
                <input
                  id="pcampus"
                  type="text"
                  value={targetCampus}
                  onChange={(e) => setTargetCampus(e.target.value)}
                  placeholder="Contoh: ITB - STEI atau UI - Ilmu Komputer"
                  className="field pl-9"
                  data-testid="profile-target-input"
                />
                <Target
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sigma-yellow pointer-events-none"
                />
              </div>

              {/* Suggestions chips */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {TARGET_CAMPUS_SUGGESTIONS.map((tc) => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => setTargetCampus(tc)}
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] transition-colors border ${
                      targetCampus === tc
                        ? "border-sigma-yellow bg-sigma-yellow/20 text-sigma-yellow font-bold"
                        : "border-white/5 bg-white/[0.03] text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    {tc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin keluar dari akun SIGMA?")) {
                logout();
                nav("/");
              }
            }}
            className="btn-ghost text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto"
            data-testid="profile-logout-button"
          >
            <LogOut size={15} /> Keluar dari SIGMA
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={() => {
                  if (profile) {
                    setFullName(profile.full_name || "");
                    setAvatarUrl(profile.avatar_url || "");
                    setClassName(profile.class_name || CLASS_OPTIONS[0]);
                    setSchoolName(profile.school_name || "MA Darunnajah 9");
                    setPhone(profile.phone || "");
                    setBio(profile.bio || "");
                    setTargetCampus(profile.target_campus || "");
                    setFavoriteTopic(profile.favorite_topic || "");
                    setNisn(profile.nisn || "");
                    toast.info("Perubahan dibatalkan.");
                  }
                }}
                className="btn-ghost text-xs w-full sm:w-auto"
              >
                Batalkan
              </button>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-sigma text-xs w-full sm:w-auto"
              data-testid="profile-save-button"
            >
              {busy ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={15} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ================= AVATAR PICKER & UPLOAD MODAL ================= */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/15 bg-[#120D2C] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Camera size={20} className="text-sigma-cyan" />
                <h3 className="font-display text-lg font-bold text-white">
                  Pilih atau Unggah Foto Profil
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Upload Area: Drag & Drop and File Picker */}
            <div>
              <p className="overline-label mb-2">Unggah Foto Sendiri</p>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-sigma-cyan bg-sigma-cyan/10 scale-[1.01]"
                    : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                }`}
                data-testid="profile-avatar-dropzone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  data-testid="profile-avatar-file-input"
                />

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sigma-cyan/15 text-sigma-cyan mb-3">
                  <Upload size={22} />
                </div>

                <p className="text-xs font-semibold text-white">
                  {uploadingAvatar
                    ? "Memproses gambar..."
                    : "Tarik & letakkan foto di sini, atau klik untuk memilih berkas"}
                </p>
                <p className="text-[0.68rem] text-slate-400 mt-1">
                  Format JPG, PNG, atau WEBP. Gambar otomatis dioptimasi ke ukuran ringan.
                </p>
              </div>
            </div>

            {/* Presets Gallery */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="overline-label">Atau Pilih Avatar / Maskot Matematika</p>
                <span className="mono text-[0.62rem] uppercase tracking-wider text-slate-400">
                  {AVATAR_PRESETS.length} Pilihan
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(preset.url);
                        toast.success(`Avatar ${preset.name} dipilih!`);
                        setShowAvatarModal(false);
                      }}
                      className={`group relative flex flex-col items-center rounded-2xl p-2.5 text-center transition-all border ${
                        isSelected
                          ? "border-sigma-cyan bg-sigma-cyan/20 ring-2 ring-sigma-cyan"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                      data-testid={`avatar-preset-${preset.id}`}
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-900 shadow-md">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Check size={18} className="text-sigma-cyan stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <span className="mt-1.5 line-clamp-1 font-display text-[0.65rem] font-bold text-white">
                        {preset.name}
                      </span>
                      <span className="line-clamp-1 text-[0.58rem] text-slate-400">
                        {preset.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  setAvatarUrl("");
                  setShowAvatarModal(false);
                  toast.info("Foto profil dihapus (menggunakan inisial)");
                }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Gunakan Inisial Nama Saja
              </button>

              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="btn-ghost text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
