// src/components/traditions/ui.tsx
// Peças visuais compartilhadas pelas abas do Mapa das Tradições.

import { ReactNode } from 'react';

export const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif";
export const SYMBOL_FONT = "'Noto Sans Symbols', 'Segoe UI Symbol', serif";
export const HAN_FONT = "'Noto Serif SC', serif";

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-white text-gray-900 rounded-2xl shadow-xl shadow-black/25 p-5 sm:p-6 flex flex-col gap-4 ${className}`}>{children}</section>;
}

export function DarkPanel({ children, className = '', label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <section aria-label={label} className={`bg-white/[0.04] border border-white/10 rounded-2xl p-2 sm:p-6 flex flex-col gap-4 ${className}`}>
      {children}
    </section>
  );
}

export function CardTitle({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <h2 className={`m-0 text-[26px] font-bold leading-tight ${dark ? 'text-white text-center' : 'text-indigo-950'}`} style={{ fontFamily: DISPLAY_FONT }}>
      {children}
    </h2>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">{children}</p>;
}

export function Bars({ rows, dark = false }: { rows: { label: string; value: number; max: number; color: string }[]; dark?: boolean }) {
  return (
    <div className="grid items-center gap-x-3 gap-y-2.5 text-sm" style={{ gridTemplateColumns: '72px minmax(0, 1fr) 24px' }}>
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <span className={`font-semibold ${dark ? 'text-purple-50' : 'text-gray-900'}`}>{r.label}</span>
          {r.value > 0 ? (
            <div className={`h-3 rounded-full ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <div className="h-3 rounded-full" style={{ width: `${(r.value / r.max) * 100}%`, background: r.color }} />
            </div>
          ) : (
            <div className={`h-3 rounded-full border border-dashed ${dark ? 'border-white/40' : 'border-gray-400'}`} />
          )}
          <span className={`text-right font-bold ${dark ? 'text-purple-50' : 'text-gray-900'}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LegendLine({ color, dash, label }: { color: string; dash?: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="28" height="8" aria-hidden="true">
        <line x1="0" y1="4" x2="28" y2="4" stroke={color} strokeWidth="2" strokeDasharray={dash} />
      </svg>
      {label}
    </span>
  );
}
