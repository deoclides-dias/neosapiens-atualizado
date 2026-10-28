// src/components/traditions/WuXingPentagram.tsx
// Pentagrama dos Cinco Elementos: pentágono = ciclo de geração,
// estrela = ciclo de controle; o tamanho de cada círculo acompanha a força
// do elemento e os ausentes aparecem tracejados.

import type { ChineseElement } from '../../lib/astro';
import { ELEMENT_HAN } from '../../lib/astro';

const ORDER: ChineseElement[] = ['Fogo', 'Terra', 'Metal', 'Água', 'Madeira']; // horário = geração
const CONTROL: [ChineseElement, ChineseElement][] = [
  ['Madeira', 'Terra'], ['Terra', 'Água'], ['Água', 'Fogo'], ['Fogo', 'Metal'], ['Metal', 'Madeira']
];
export const ELEMENT_COLORS: Record<ChineseElement, string> = {
  Madeira: '#3f9b5f', Fogo: '#e0523f', Terra: '#c79a2e', Metal: '#b7c0cc', Água: '#7aa5ff'
};

const PC = 280, PR = 165;

interface WuXingPentagramProps {
  elements: Record<ChineseElement, number>;
}

export default function WuXingPentagram({ elements }: WuXingPentagramProps) {
  const P = Object.fromEntries(
    ORDER.map((e, i) => {
      const th = ((90 - i * 72) * Math.PI) / 180;
      return [e, { x: PC + PR * Math.cos(th), y: PC - PR * Math.sin(th) }];
    })
  ) as Record<ChineseElement, { x: number; y: number }>;

  const radius = (e: ChineseElement) => 26 + Math.min(elements[e], 6) * 7;

  const segment = (a: ChineseElement, b: ChineseElement) => {
    const A = P[a], B = P[b];
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
    const ra = radius(a) + 4, rb = radius(b) + 8;
    return { x1: A.x + (dx * ra) / L, y1: A.y + (dy * ra) / L, x2: B.x - (dx * rb) / L, y2: B.y - (dy * rb) / L };
  };

  const label = `Pentagrama dos Cinco Elementos: ${ORDER.map((e) => `${e} ${elements[e]}`).join(', ')}`;

  return (
    <svg viewBox="0 0 560 560" width="100%" style={{ display: 'block', maxWidth: 520, margin: '0 auto' }} role="img" aria-label={label}>
      <defs>
        <marker id="wx-gen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#e8d9a8" />
        </marker>
        <marker id="wx-ctrl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#b9a7f5" />
        </marker>
      </defs>
      <circle cx={PC} cy={PC} r={273} fill="#15122f" stroke="#e8d9a8" strokeOpacity={0.35} />

      {CONTROL.map(([a, b]) => (
        <line key={`c-${a}`} {...segment(a, b)} stroke="#b9a7f5" strokeOpacity={0.75} strokeWidth={1.4} strokeDasharray="6 5" markerEnd="url(#wx-ctrl)" />
      ))}
      {ORDER.map((a, i) => (
        <line key={`g-${a}`} {...segment(a, ORDER[(i + 1) % 5])} stroke="#e8d9a8" strokeWidth={2} markerEnd="url(#wx-gen)" />
      ))}

      {ORDER.map((e) => {
        const { x, y } = P[e];
        const r = radius(e);
        const empty = elements[e] === 0;
        const ly = e === 'Fogo' ? y - r - 16 : y + r + 18;
        const lx = e === 'Madeira' ? x - 30 : x;
        return (
          <g key={e}>
            <circle cx={x} cy={y} r={r} fill={empty ? '#15122f' : ELEMENT_COLORS[e]} stroke={empty ? ELEMENT_COLORS[e] : 'none'} strokeWidth={2} strokeDasharray={empty ? '4 4' : undefined} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={empty ? 24 : 22 + Math.min(elements[e], 6) * 3} fill={empty ? ELEMENT_COLORS[e] : '#ffffff'} fontFamily="'Noto Serif SC', serif">
              {ELEMENT_HAN[e]}
            </text>
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#f3e7c4" fontFamily="Inter, sans-serif">
              {e} · {elements[e]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
