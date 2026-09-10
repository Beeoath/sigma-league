export const MASCOTS = {
  alpha: {
    name: "Sigma-Slinger",
    role: "Ahli Aljabar & Fungsi",
    img: "https://static.prod-images.emergentagent.com/jobs/28eca473-4af6-4d9a-833e-dcf63b11a922/images/fe164d8c15bad717788411c6ab11638d8f284bd102c90061c71d675ebf1d9813.jpeg",
  },
  beta: {
    name: "Geo-Arachne",
    role: "Penjaga Geometri & Vektor",
    img: "https://static.prod-images.emergentagent.com/jobs/28eca473-4af6-4d9a-833e-dcf63b11a922/images/3149fcd9d38d6faa3e0e6f8408655c6f9bb77577904e46eff8bc254e8bc2ab38.jpeg",
  },
  gamma: {
    name: "Prob-Spinner",
    role: "Penganalisis Peluang & Data",
    img: "https://static.prod-images.emergentagent.com/jobs/28eca473-4af6-4d9a-833e-dcf63b11a922/images/dd2b64a87ac7dbe90aece160e6aaee14cc6abe320fb39d5f4e4c7eb8180745e5.jpeg",
  },
};

export const CITY_IMG =
  "https://static.prod-images.emergentagent.com/jobs/28eca473-4af6-4d9a-833e-dcf63b11a922/images/70ed4c3a5b903c98a96944f1f3be855bb6d9c1c0b52c5e38c81332badaf20297.jpeg";

export const DISTRICT_ACCENT = {
  1: { hex: "#00F0FF", symbol: "x²", label: "Algebra District" },
  2: { hex: "#FFD600", symbol: "f(x)", label: "Function Tower" },
  3: { hex: "#FF007A", symbol: "△", label: "Geometry City" },
  4: { hex: "#A78BFA", symbol: "P(A)", label: "Probability Zone" },
  5: { hex: "#10B981", symbol: "Σ", label: "Data District" },
};

export const accentFor = (order) =>
  DISTRICT_ACCENT[order] || { hex: "#00F0FF", symbol: "∞", label: "SIGMA City" };

export const mascotFor = (order) =>
  order <= 2 ? MASCOTS.alpha : order === 3 ? MASCOTS.beta : MASCOTS.gamma;
