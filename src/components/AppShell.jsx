import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  Map,
  BookOpen,
  MessageSquare,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { UserAvatar } from "./UserAvatar";

const STUDENT_LINKS = [
  { to: "/app", label: "Hub Modul", icon: Compass, testid: "nav-hub" },
  { to: "/app/peta", label: "Peta TKA", icon: Map, testid: "nav-journey" },
  { to: "/app/discussions", label: "Diskusi", icon: MessageSquare, testid: "nav-discussions" },
  { to: "/app/profile", label: "Profil", icon: User, testid: "nav-profile" },
];

const TEACHER_LINKS = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, testid: "nav-teacher-dashboard" },
  { to: "/teacher/moderation", label: "Moderasi", icon: ShieldCheck, testid: "nav-teacher-moderation" },
  { to: "/teacher/content", label: "Konten", icon: BookOpen, testid: "nav-teacher-content" },
  { to: "/app/profile", label: "Profil", icon: User, testid: "nav-profile" },
];

export const AppShell = ({ children }) => {
  const { profile, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const isTeacher = profile?.role === "teacher";
  const links = isTeacher ? TEACHER_LINKS : STUDENT_LINKS;

  const active = (to) => {
    if (to === "/app" || to === "/teacher") {
      return pathname === to;
    }
    return pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="relative min-h-screen bg-[#070417] text-white p-3 sm:p-5 lg:p-8 flex flex-col justify-start">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[5%] h-[550px] w-[550px] rounded-full bg-purple-900/15 blur-[130px]" />
        <div className="absolute right-[5%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-900/15 blur-[130px]" />
        <div className="absolute bottom-[5%] left-[25%] h-[600px] w-[600px] rounded-full bg-indigo-950/20 blur-[150px]" />
      </div>

      {/* Main Container: Left Vertical Pill Dock + Center Main Card */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] flex items-start gap-4 lg:gap-6 flex-1 min-h-[calc(100vh-2rem)]">
        {/* ================= LEFT FLOATING CAPSULE PILL DOCK (Matches reference image) ================= */}
        <aside
          className="hidden lg:flex flex-col items-center justify-between py-6 px-3 rounded-[36px] bg-[#140e32]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] sticky top-6 z-30 shrink-0 h-[calc(100vh-4rem)] max-h-[820px]"
          data-testid="desktop-capsule-dock"
        >
          {/* Top Brand Logo */}
          <div className="flex flex-col items-center gap-6">
            <Link
              to={isTeacher ? "/teacher" : "/app"}
              className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sigma-cyan to-blue-600 text-slate-950 font-display text-xl font-black shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-transform duration-300 hover:scale-110"
              title="SIGMA - Beranda"
            >
              Σ
            </Link>

            {/* Navigation Icons Dock */}
            <nav className="flex flex-col items-center gap-4 pt-4">
              {links.map((item) => {
                const Icon = item.icon;
                const isActive = active(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-testid={item.testid}
                    title={item.label}
                    className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                      isActive
                        ? "bg-white text-slate-950 shadow-lg scale-105 font-bold"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-sigma-cyan" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Dock Controls: Profile & Logout */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10">
            <Link
              to="/app/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:ring-2 hover:ring-sigma-cyan/50 transition-all"
              title={profile?.full_name || "Profil"}
            >
              <UserAvatar
                src={profile?.avatar_url}
                name={profile?.full_name}
                role={profile?.role}
                size="sm"
              />
            </Link>

            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Keluar Akun"
              data-testid="dock-logout-button"
            >
              <LogOut size={18} />
            </button>
          </div>
        </aside>

        {/* ================= CENTER FLOATING GLASS CONTAINER (Matches reference image) ================= */}
        <div
          className="flex-1 min-w-0 rounded-[28px] sm:rounded-[36px] bg-[#0d0926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-5 sm:p-7 flex flex-col justify-between"
          data-testid="main-content-window"
        >
          {/* Top Header Bar for Profile & Quick Info */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-3">
              <Link to={isTeacher ? "/teacher" : "/app"} className="lg:hidden flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-sigma-cyan font-display text-sm font-black text-slate-950">
                  Σ
                </span>
                <span className="font-display text-sm font-black tracking-wider text-white">SIGMA</span>
              </Link>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Selamat datang kembali,</span>
                  <span className="text-xs font-bold text-white">{profile?.full_name}</span>
                </div>
                <div className="text-[0.68rem] text-sigma-cyan font-mono">{profile?.class_name || "MA Darunnajah 9"}</div>
              </div>
            </div>

            {/* Right: User Profile Pill with dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-white backdrop-blur-md transition-colors hover:bg-white/[0.08]"
                data-testid="user-profile-pill"
              >
                <UserAvatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  role={profile?.role}
                  size="sm"
                />
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-bold text-white max-w-[130px] truncate">
                    {profile?.full_name}
                  </div>
                  <div className="text-[0.62rem] text-slate-400">
                    {isTeacher ? "Dewan Guru" : "Siswa Aktif"}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-white/10 bg-[#161036] p-2 shadow-2xl backdrop-blur-2xl">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1 flex items-center gap-2.5">
                    <UserAvatar
                      src={profile?.avatar_url}
                      name={profile?.full_name}
                      role={profile?.role}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{profile?.full_name}</p>
                      <p className="text-[0.68rem] text-slate-400 truncate">{profile?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/app/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <User size={15} /> Profil Saya
                  </Link>
                  <Link
                    to="/app/peta"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <Map size={15} /> Peta Belajar Node
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Children View Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM PILL NAVIGATION (for small screens) ================= */}
      <nav
        className="lg:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto rounded-full bg-[#161033]/90 backdrop-blur-2xl border border-white/15 py-2 px-5 flex items-center justify-around shadow-2xl z-50"
        data-testid="mobile-bottom-dock"
      >
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = active(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              data-testid={`${item.testid}-mobile`}
              className={`flex flex-col items-center gap-0.5 text-[0.62rem] font-bold uppercase tracking-wider transition-colors ${
                isActive ? "text-sigma-cyan font-black scale-110" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

