import { useId } from "react";
import type { MidiaExame } from "@/lib/data";

/** Arte gerada por CSS/SVG que representa o arquivo do exame. */
export function ExameArte({ midia, seed = 0, className = "" }: { midia: MidiaExame; seed?: number; className?: string }) {
  const uid = useId();
  if (midia === "grafico") {
    const linhas = [0, 1, 2, 3];
    return (
      <div className={`relative overflow-hidden bg-[#e9cfd3] ${className}`}>
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(140,70,80,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(140,70,80,0.25) 1px, transparent 1px)",
            backgroundSize: "8% 8%",
          }}
        />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          {linhas.map((l) => {
            const y = 18 + l * 22;
            const pontos = Array.from({ length: 10 }, (_, i) => {
              const x = i * 10;
              const pico = (i + seed + l) % 3 === 0 ? -11 : -2;
              return `${x},${y} ${x + 3},${y + 2} ${x + 4},${y + pico} ${x + 5},${y + 4} ${x + 6},${y}`;
            }).join(" ");
            return <polyline key={l} points={pontos} fill="none" stroke="rgba(40,20,25,0.75)" strokeWidth="0.7" />;
          })}
        </svg>
      </div>
    );
  }

  if (midia === "laudo") {
    return (
      <div className={`flex flex-col gap-[6%] overflow-hidden bg-card p-[10%] ${className}`}>
        <span className="h-[7%] w-[55%] rounded-full bg-muted-foreground/50" />
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            className="h-[4%] rounded-full bg-border"
            style={{ width: `${95 - ((i * 13 + seed * 7) % 45)}%` }}
          />
        ))}
      </div>
    );
  }

  if (midia === "microscopia") {
    return (
      <div className={`relative overflow-hidden bg-[#f0d9de] ${className}`}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          {Array.from({ length: 26 }, (_, i) => {
            const x = ((i * 37 + seed * 11) % 90) + 5;
            const y = ((i * 53 + seed * 19) % 90) + 5;
            const r = 3 + ((i + seed) % 4);
            return <circle key={i} cx={x} cy={y} r={r} fill="rgba(150,60,80,0.35)" stroke="rgba(110,30,50,0.5)" strokeWidth="0.6" />;
          })}
        </svg>
      </div>
    );
  }

  // rx
  const gid = `osso-${uid.replace(/[:]/g, "")}`;
  return (
    <div className={`relative overflow-hidden bg-[#0b0d0f] ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id={gid} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#f4f7fa" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#c9d6df" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0b0d0f" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M ${10 + i * 1.5} ${24 + i * 10} Q 50 ${12 + i * 11} ${90 - i * 1.5} ${26 + i * 10}`}
            fill="none"
            stroke="#dbe6ee"
            strokeOpacity="0.28"
            strokeWidth="3"
          />
        ))}
        <ellipse cx="46" cy="34" rx="20" ry="16" fill={`url(#${gid})`} />
        <rect x="40" y="36" width="15" height="52" rx="7.5" fill={`url(#${gid})`} />
        <circle cx="62" cy="30" r="7" fill="#eef4f8" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
