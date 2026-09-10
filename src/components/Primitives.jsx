export const Panel = ({ children, className = "", accent, ...rest }) => (
  <div
    className={`relative overflow-hidden rounded-3xl glass p-6 transition-colors duration-300 ${className}`}
    style={accent ? { borderColor: `${accent}44` } : undefined}
    {...rest}
  >
    {children}
  </div>
);

export const StatTile = ({ label, value, sub, accent = "#00F0FF", testid }) => (
  <div
    data-testid={testid}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-sigma-panel/60 p-5"
  >
    <div
      className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
      style={{ background: `${accent}33` }}
    />
    <p className="overline-label" style={{ color: accent }}>
      {label}
    </p>
    <p className="mt-2 font-display text-3xl font-black text-white">{value}</p>
    {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
  </div>
);

export const Loader = ({ label = "Memuat SIGMA City..." }) => (
  <div className="grid min-h-[50vh] place-items-center" data-testid="loading-state">
    <div className="text-center">
      <span className="mono mx-auto mb-4 block animate-pulse text-4xl font-bold text-sigma-cyan">Σ</span>
      <p className="overline-label">{label}</p>
    </div>
  </div>
);

export const EmptyState = ({ title, body, action, mascot, testid }) => (
  <div
    data-testid={testid}
    className="rounded-3xl border border-dashed border-white/15 bg-sigma-panel/40 p-10 text-center"
  >
    {mascot && (
      <img
        src={mascot}
        alt=""
        className="mx-auto mb-5 h-24 w-24 rounded-2xl object-cover opacity-90 anim-float"
      />
    )}
    <h3 className="font-display text-lg font-bold text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{body}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
