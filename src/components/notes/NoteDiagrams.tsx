/** Hand-drawn SVG study diagrams; colours come from theme tokens via currentColor/CSS vars. */
export function PomeDiagram() {
  const label = "fill-foreground text-[11px]";
  return (
    <figure className="rounded-2xl border border-border bg-card p-4">
      <svg viewBox="0 0 420 300" className="mx-auto w-full max-w-md" role="img" aria-label="Cross-section of apple fruit (pome)">
        <path d="M150 60 C 90 50, 50 110, 60 170 C 70 240, 130 280, 180 270 C 195 266, 205 266, 220 270 C 270 280, 330 240, 340 170 C 350 110, 310 50, 250 60 C 225 64, 210 72, 200 78 C 190 72, 175 64, 150 60 Z" className="fill-destructive/80 stroke-destructive" strokeWidth="3" />
        <path d="M155 72 C 100 66, 68 115, 76 170 C 85 228, 135 262, 180 254 C 195 251, 205 251, 220 254 C 265 262, 315 228, 324 170 C 332 115, 300 66, 245 72 C 222 75, 210 82, 200 88 C 190 82, 178 75, 155 72 Z" className="fill-accent" />
        <ellipse cx="200" cy="170" rx="62" ry="58" fill="none" className="stroke-primary" strokeDasharray="4 4" strokeWidth="2" />
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a} 200 170)`}>
            <path d="M200 170 C 188 150, 190 128, 200 120 C 210 128, 212 150, 200 170 Z" className="fill-muted stroke-primary" strokeWidth="1.5" />
            <ellipse cx="200" cy="136" rx="4" ry="8" className="fill-foreground/80" />
          </g>
        ))}
        <path d="M200 78 C 198 60, 204 40, 212 28" className="stroke-foreground" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M212 34 C 235 20, 262 26, 270 40 C 250 50, 228 48, 212 34 Z" className="fill-primary" />
        <path d="M190 262 l10 10 l10 -10" className="stroke-foreground" strokeWidth="2" fill="none" />
        <g className="stroke-muted-foreground" strokeWidth="1">
          <line x1="215" y1="40" x2="300" y2="20" /><line x1="300" y1="80" x2="340" y2="70" />
          <line x1="95" y1="200" x2="20" y2="230" /><line x1="262" y1="170" x2="350" y2="200" />
          <line x1="200" y1="136" x2="120" y2="40" /><line x1="200" y1="270" x2="260" y2="292" />
          <line x1="65" y1="140" x2="20" y2="120" />
        </g>
        <text x="302" y="22" className={label}>Pedicel / stem</text>
        <text x="342" y="72" className={label}>Thalamus (edible)</text>
        <text x="4" y="244" className={label}>Vascular ring</text>
        <text x="352" y="204" className={label}>5 carpels</text>
        <text x="60" y="36" className={label}>Seed (pip)</text>
        <text x="262" y="296" className={label}>Calyx eye</text>
        <text x="4" y="116" className={label}>Peel (exocarp)</text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">Fig. Cross-section of apple (pome) — flesh is thalamus, core is the true fruit.</figcaption>
    </figure>
  );
}

const vigour = [
  { label: "Ultra-dwarf", eg: "M-27, P-22, Mac-39", h: 25 },
  { label: "Dwarf", eg: "M-9, Bud-9, G-41", h: 40 },
  { label: "Semi-dwarf", eg: "M-26, M-7, MM-106", h: 58 },
  { label: "Semi-vigorous", eg: "MM-111, M-2", h: 76 },
  { label: "Vigorous", eg: "Merton 793, M-16, Seedling", h: 100 },
];

export function RootstockChart() {
  return (
    <figure className="rounded-2xl border border-border bg-card p-4">
      <div className="flex h-48 items-end gap-2 sm:gap-4">
        {vigour.map((v) => (
          <div key={v.label} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/50" style={{ height: `${v.h}%` }} />
            <span className="text-center text-[11px] font-semibold">{v.label}</span>
            <span className="text-center text-[10px] leading-tight text-muted-foreground">{v.eg}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">Fig. Apple rootstock vigour — tree size increases left to right.</figcaption>
    </figure>
  );
}

export function GrowthCurve() {
  return (
    <figure className="rounded-2xl border border-border bg-card p-4">
      <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-md" role="img" aria-label="Single sigmoid growth curve">
        <line x1="40" y1="170" x2="340" y2="170" className="stroke-muted-foreground" />
        <line x1="40" y1="170" x2="40" y2="20" className="stroke-muted-foreground" />
        <path d="M40 165 C 100 162, 120 150, 160 110 C 200 65, 230 40, 330 32" fill="none" className="stroke-primary" strokeWidth="3" />
        <line x1="120" y1="20" x2="120" y2="170" strokeDasharray="4 4" className="stroke-border" />
        <line x1="250" y1="20" x2="250" y2="170" strokeDasharray="4 4" className="stroke-border" />
        <text x="55" y="188" className="fill-foreground text-[10px]">I · Cell division</text>
        <text x="140" y="188" className="fill-foreground text-[10px]">II · Cell expansion</text>
        <text x="262" y="188" className="fill-foreground text-[10px]">III · Maturation</text>
        <text x="8" y="100" className="fill-muted-foreground text-[10px]" transform="rotate(-90 14 100)">Fruit size</text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">Fig. Single sigmoid growth of apple (Phase I 0–25, II 26–75, III 76–90 days after petal fall).</figcaption>
    </figure>
  );
}
