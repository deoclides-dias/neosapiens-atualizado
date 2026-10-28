// src/components/traditions/PythagoreanGrid.tsx
// Grade de Pitágoras 3×3 (colunas: pensamento, vontade, ação; linhas:
// mental, emocional, físico) com as setas completas desenhadas.

import type { NumerologyChart } from '../../lib/astro';

// Posição de cada dígito: coluna = (n-1)/3, linha de baixo para cima
const center = (n: number) => {
  const col = Math.floor((n - 1) / 3);
  const row = 2 - ((n - 1) % 3);
  return { x: 70 + col * 110, y: 70 + row * 110 };
};

export const ARROW_COLORS = ['#f2c94c', '#7fb4ff', '#5fd3a8', '#ff9a4d', '#c4a7ff', '#ff6b8a', '#9be7ff', '#e8d9a8'];

interface PythagoreanGridProps {
  numerology: NumerologyChart;
}

export default function PythagoreanGrid({ numerology }: PythagoreanGridProps) {
  const complete = numerology.arrows.filter((a) => a.complete);
  const present = Object.entries(numerology.grid).filter(([, c]) => c > 0).map(([n]) => n);
  const label = `Grade de Pitágoras: presentes ${present.join(', ') || 'nenhum'}; ausentes ${numerology.missing.join(', ') || 'nenhum'}`;

  return (
    <svg viewBox="0 0 420 400" width="100%" style={{ display: 'block', maxWidth: 420, margin: '0 auto' }} role="img" aria-label={label}>
      {['Pensamento', 'Vontade', 'Ação'].map((t, i) => (
        <text key={t} x={70 + i * 110} y={14} textAnchor="middle" fontSize={11} fill="#c9bfe8" fontFamily="Inter, sans-serif">{t}</text>
      ))}
      {['Mental', 'Emocional', 'Físico'].map((t, i) => (
        <text key={t} x={358} y={74 + i * 110} fontSize={11} fill="#c9bfe8" fontFamily="Inter, sans-serif">{t}</text>
      ))}

      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const { x, y } = center(n);
        const has = numerology.grid[n] > 0;
        return (
          <rect key={`r${n}`} x={x - 50} y={y - 50} width={100} height={100} rx={14}
            fill={has ? '#15122f' : 'none'} stroke={has ? '#e8d9a8' : '#9ca3af'} strokeOpacity={has ? 0.5 : 0.6} strokeDasharray={has ? undefined : '5 5'} />
        );
      })}

      {complete.map((a) => {
        const p0 = center(a.digits[0]);
        const p2 = center(a.digits[2]);
        const color = ARROW_COLORS[numerology.arrows.findIndex((x) => x.id === a.id) % ARROW_COLORS.length];
        return <line key={a.id} x1={p0.x} y1={p0.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={5} strokeLinecap="round" strokeOpacity={0.55} />;
      })}

      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const { x, y } = center(n);
        const count = numerology.grid[n];
        if (!count) {
          return <text key={`t${n}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={34} fill="#9ca3af" fontFamily="'Cormorant Garamond', Georgia, serif">{n}</text>;
        }
        return (
          <g key={`t${n}`}>
            <circle cx={x} cy={y} r={26} fill="#15122f" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={38} fontWeight={700} fill="#f3e7c4" fontFamily="'Cormorant Garamond', Georgia, serif">{n}</text>
            {count > 1 && (
              <text x={x + 30} y={y - 30} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#f3e7c4" fontFamily="Inter, sans-serif">×{count}</text>
            )}
          </g>
        );
      })}
      <text x={180} y={372} textAnchor="middle" fontSize={12} fill="#c9bfe8" fontFamily="Inter, sans-serif">Contorno tracejado = número ausente</text>
    </svg>
  );
}
