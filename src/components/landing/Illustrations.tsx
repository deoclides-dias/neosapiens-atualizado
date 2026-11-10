// src/components/landing/Illustrations.tsx
// Desenhos da página inicial: a rosa dos ventos, um radar de exemplo
// (vontade × vida) e a estrela dos Cinco Elementos, com dados fictícios.

const AMBER = '#f59e0b';
const r2 = (n: number) => Math.round(n * 100) / 100;
const VIOLET = '#a78bfa';

export function CompassRose({ size = 360 }: { size?: number }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg viewBox="-200 -200 400 400" width={size} height={size} aria-hidden="true" className="max-w-full h-auto">
      <defs>
        <radialGradient id="cr-glow" r="60%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="cr-n" x1="0" y1="-1" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle r="190" fill="url(#cr-glow)" />
      <circle r="168" fill="none" stroke="#c4b5fd" strokeOpacity={0.35} />
      <circle r="140" fill="none" stroke="#c4b5fd" strokeOpacity={0.2} strokeDasharray="2 6" />
      {ticks.map((a) => {
        const long = a % 45 === 0;
        const r1 = long ? 150 : 160;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={r2(Math.sin(rad) * r1)}
            y1={r2(-Math.cos(rad) * r1)}
            x2={r2(Math.sin(rad) * 168)}
            y2={r2(-Math.cos(rad) * 168)}
            stroke="#ddd6fe"
            strokeOpacity={long ? 0.8 : 0.35}
            strokeWidth={long ? 2 : 1}
          />
        );
      })}
      {/* rosa: quatro pontas longas e quatro curtas */}
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -128 L16 0 L0 0 Z" fill="#ede9fe" opacity={0.9} />
          <path d="M0 -128 L-16 0 L0 0 Z" fill="#7c3aed" opacity={0.85} />
        </g>
      ))}
      {[45, 135, 225, 315].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -78 L10 0 L0 0 Z" fill="#c4b5fd" opacity={0.7} />
          <path d="M0 -78 L-10 0 L0 0 Z" fill="#4c1d95" opacity={0.8} />
        </g>
      ))}
      {/* agulha */}
      <g transform="rotate(28)">
        <path d="M0 -150 L9 0 L-9 0 Z" fill="url(#cr-n)" />
        <path d="M0 150 L9 0 L-9 0 Z" fill="#1e1b4b" stroke="#a78bfa" strokeOpacity={0.6} />
      </g>
      <circle r="10" fill="#1e1b4b" stroke="#fde68a" strokeWidth={2} />
      {[
        ['N', 0, -182],
        ['L', 182, 6],
        ['S', 0, 192],
        ['O', -182, 6]
      ].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fill="#ede9fe" fontSize="15" fontFamily="'Cormorant Garamond', serif" fontWeight={700}>
          {t}
        </text>
      ))}
    </svg>
  );
}

const AXES = ['Sono', 'Movimento', 'Bem-estar', 'Atenção', 'Sentido', 'Relações'];
const WANT = [85, 90, 80, 75, 88, 82];
const IS = [42, 31, 58, 52, 74, 70];

function pts(vals: number[], R: number) {
  return vals
    .map((v, i) => {
      const a = (i / vals.length) * 2 * Math.PI - Math.PI / 2;
      return `${r2((Math.cos(a) * R * v) / 100)},${r2((Math.sin(a) * R * v) / 100)}`;
    })
    .join(' ');
}

export function SampleRadar() {
  const R = 110;
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="-190 -160 380 320" className="w-full h-auto" role="img" aria-label="Radar de exemplo: o que a pessoa quer em cada área e o que a sua rotina mostra">
        {[25, 50, 75, 100].map((g) => (
          <polygon key={g} points={pts(AXES.map(() => g), R)} fill="none" stroke="#e5e7eb" />
        ))}
        {AXES.map((label, i) => {
          const a = (i / AXES.length) * 2 * Math.PI - Math.PI / 2;
          const x = r2(Math.cos(a) * (R + 26));
          const y = r2(Math.sin(a) * (R + 18));
          return (
            <g key={label}>
              <line x1={0} y1={0} x2={r2(Math.cos(a) * R)} y2={r2(Math.sin(a) * R)} stroke="#e5e7eb" />
              <text x={x} y={y + 4} textAnchor={Math.abs(x) < 10 ? 'middle' : x > 0 ? 'start' : 'end'} fontSize="13" fill="#374151" fontFamily="Inter, sans-serif">
                {label}
              </text>
            </g>
          );
        })}
        <polygon points={pts(WANT, R)} fill={AMBER} fillOpacity={0.12} stroke={AMBER} strokeWidth={2} strokeDasharray="5 4" />
        <polygon points={pts(IS, R)} fill="#7c3aed" fillOpacity={0.22} stroke="#7c3aed" strokeWidth={2} />
      </svg>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600 justify-center">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-dashed" style={{ borderColor: AMBER }} /> o que você quer
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-2.5 rounded-sm" style={{ background: '#7c3aed', opacity: 0.6 }} /> o que a sua rotina mostra
        </span>
      </figcaption>
    </figure>
  );
}

const ELEMENTS = [
  { name: 'Madeira', han: '木', color: '#059669', size: 3 },
  { name: 'Fogo', han: '火', color: '#e11d48', size: 2 },
  { name: 'Terra', han: '土', color: '#d97706', size: 1 },
  { name: 'Metal', han: '金', color: '#64748b', size: 2 },
  { name: 'Água', han: '水', color: '#2563eb', size: 4 }
];

export function SampleStar() {
  const R = 100;
  const p = ELEMENTS.map((_, i) => {
    const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
    return [r2(Math.cos(a) * R), r2(Math.sin(a) * R)];
  });
  return (
    <svg viewBox="-150 -140 300 275" className="w-full h-auto" role="img" aria-label="Estrela dos Cinco Elementos de exemplo">
      {/* ciclo de geração */}
      <polygon points={p.map((q) => q.join(',')).join(' ')} fill="none" stroke={VIOLET} strokeOpacity={0.5} strokeWidth={1.5} />
      {/* ciclo de controle */}
      <polygon points={[0, 2, 4, 1, 3].map((i) => p[i].join(',')).join(' ')} fill="none" stroke={VIOLET} strokeOpacity={0.25} strokeDasharray="3 5" />
      {ELEMENTS.map((e, i) => {
        const r = 14 + e.size * 5;
        const [x, y] = p[i];
        return (
          <g key={e.name}>
            <circle cx={x} cy={y} r={r} fill={e.color} fillOpacity={0.9} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
            <text x={x} y={y + 7} textAnchor="middle" fill="#fff" fontSize="19" fontFamily="'Noto Serif SC', serif">
              {e.han}
            </text>
            <text x={x} y={y + r + 15} textAnchor="middle" fill="#ede9fe" fontSize="12" fontFamily="Inter, sans-serif">
              {e.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
