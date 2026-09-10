import { MASCOTS } from "./brand";

export interface AvatarPreset {
  id: string;
  name: string;
  category: "mascot" | "math_legend" | "sigil";
  role: string;
  url: string;
}

// SVG helpers for math icons
const makeSvgUri = (bgGradient: [string, string], symbol: string, sub: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="200" height="200" rx="48" fill="url(#g)" />
    <circle cx="100" cy="100" r="70" fill="url(#glow)" />
    <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="6,4" />
    <text x="100" y="115" font-family="'JetBrains Mono', monospace, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${symbol}</text>
    <text x="100" y="165" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="middle" letter-spacing="2">${sub}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "mascot-alpha",
    name: "Sigma-Slinger",
    category: "mascot",
    role: "Ahli Aljabar & Nilai Mutlak",
    url: MASCOTS.alpha.img,
  },
  {
    id: "mascot-beta",
    name: "Geo-Arachne",
    category: "mascot",
    role: "Penjaga Geometri & Vektor",
    url: MASCOTS.beta.img,
  },
  {
    id: "mascot-gamma",
    name: "Prob-Spinner",
    category: "mascot",
    role: "Penganalisis Peluang & Data",
    url: MASCOTS.gamma.img,
  },
  {
    id: "legend-euler",
    name: "Leonhard Euler",
    category: "math_legend",
    role: "Master Analisis Matematika",
    url: makeSvgUri(["#0284c7", "#4f46e5"], "e^{iπ}", "EULER"),
  },
  {
    id: "legend-hypatia",
    name: "Hypatia",
    category: "math_legend",
    role: "Pionir Geometri & Astronomi",
    url: makeSvgUri(["#db2777", "#7c3aed"], "△Φ", "HYPATIA"),
  },
  {
    id: "legend-gauss",
    name: "Carl F. Gauss",
    category: "math_legend",
    role: "Pangeran Teori Bilangan",
    url: makeSvgUri(["#d97706", "#b91c1c"], "∫e^{-x²}", "GAUSS"),
  },
  {
    id: "sigil-sigma",
    name: "Sigma Cyber Core",
    category: "sigil",
    role: "Simbol Akumulasi Nilai",
    url: makeSvgUri(["#06b6d4", "#0f172a"], "Σ", "SIGMA"),
  },
  {
    id: "sigil-infinity",
    name: "Infinite Limit",
    category: "sigil",
    role: "Konvergensi Tak Hingga",
    url: makeSvgUri(["#10b981", "#047857"], "∞", "LIMIT"),
  },
];
