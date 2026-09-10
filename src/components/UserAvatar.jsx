import { useState } from "react";
import { ShieldCheck, User } from "lucide-react";

const SIZES = {
  xs: "h-6 w-6 text-[0.6rem]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-20 w-20 text-2xl",
  "3xl": "h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl",
};

const BADGE_SIZES = {
  xs: "h-2.5 w-2.5 -bottom-0.5 -right-0.5",
  sm: "h-3.5 w-3.5 -bottom-0.5 -right-0.5 text-[8px]",
  md: "h-4 w-4 -bottom-1 -right-1 text-[9px]",
  lg: "h-5 w-5 -bottom-1 -right-1 text-[10px]",
  xl: "h-6 w-6 -bottom-1.5 -right-1.5 text-xs",
  "2xl": "h-7 w-7 -bottom-1.5 -right-1.5 text-xs",
  "3xl": "h-8 w-8 -bottom-1 -right-1 text-xs",
};

const GRADIENTS = [
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-cyan-500",
];

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradientIndex(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GRADIENTS.length;
}

export function UserAvatar({
  src,
  name = "Pengguna",
  role = "student",
  size = "md",
  className = "",
  showBadge = false,
  badgeIcon = null,
  rounded = "full", // "full" or "2xl"
}) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = SIZES[size] || SIZES.md;
  const badgeClasses = BADGE_SIZES[size] || BADGE_SIZES.md;
  const roundedClass = rounded === "2xl" ? "rounded-2xl" : "rounded-full";
  const isTeacher = role === "teacher";
  const gradient = GRADIENTS[getGradientIndex(name + (role || ""))];
  const initials = getInitials(name);

  const hasValidImage = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} ${roundedClass} overflow-hidden border border-white/15 bg-slate-900 shadow-md flex items-center justify-center select-none`}
      >
        {hasValidImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`h-full w-full flex items-center justify-center font-display font-black text-white uppercase bg-gradient-to-tr ${
              isTeacher ? "from-amber-500 via-rose-600 to-purple-600" : gradient
            }`}
          >
            {initials}
          </div>
        )}
      </div>

      {showBadge && (
        <div
          className={`absolute ${badgeClasses} rounded-full border-2 border-[#0B071E] flex items-center justify-center shadow-lg ${
            isTeacher ? "bg-amber-400 text-slate-950" : "bg-sigma-cyan text-slate-950"
          }`}
          title={isTeacher ? "Dewan Guru Pengampu" : "Siswa Kelas 11"}
        >
          {badgeIcon || (isTeacher ? <ShieldCheck size={10} className="stroke-[2.5]" /> : <User size={10} className="stroke-[2.5]" />)}
        </div>
      )}
    </div>
  );
}
