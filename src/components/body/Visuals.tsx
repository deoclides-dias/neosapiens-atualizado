// src/components/body/Visuals.tsx
// Desenhos esquemáticos próprios da Escala de Bristol (tipos 1 a 7)
// e amostras de cor da urina, usados nas opções do questionário.

const DARK = '#6b3f1d';
const MID = '#8a5a2b';
const LIGHT = '#b07d48';

export function BristolIcon({ type, width = 96 }: { type: number; width?: number }) {
  const common = { width, height: (width * 40) / 96, viewBox: '0 0 96 40', 'aria-hidden': true } as const;
  switch (type) {
    case 1: // caroços duros e separados
      return (
        <svg {...common}>
          {[
            [14, 22, 7],
            [32, 15, 6],
            [46, 26, 7.5],
            [63, 17, 6],
            [80, 24, 7]
          ].map(([cx, cy, r]) => (
            <circle key={cx} cx={cx} cy={cy} r={r} fill={DARK} />
          ))}
        </svg>
      );
    case 2: // salsicha encaroçada
      return (
        <svg {...common}>
          {[14, 26, 38, 50, 62, 74, 84].map((cx, i) => (
            <circle key={cx} cx={cx} cy={20 + (i % 2 ? -2 : 2)} r={9} fill={i % 2 ? MID : DARK} />
          ))}
        </svg>
      );
    case 3: // salsicha com rachaduras
      return (
        <svg {...common}>
          <rect x="6" y="11" width="84" height="18" rx="9" fill={MID} />
          {[22, 36, 50, 64, 76].map((x, i) => (
            <path key={x} d={`M${x} 11 l${i % 2 ? 3 : -3} 6`} stroke={DARK} strokeWidth="2" strokeLinecap="round" />
          ))}
          {[30, 58].map((x) => (
            <path key={x} d={`M${x} 29 l2 -5`} stroke={DARK} strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
      );
    case 4: // lisa e macia, como cobra
      return (
        <svg {...common}>
          <path d="M8 24 C 22 8, 38 8, 50 20 S 78 32, 88 16" stroke={MID} strokeWidth="14" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 5: // pedaços macios de bordas definidas
      return (
        <svg {...common}>
          <ellipse cx="18" cy="22" rx="12" ry="8" fill={LIGHT} />
          <ellipse cx="47" cy="17" rx="13" ry="8" fill={LIGHT} />
          <ellipse cx="77" cy="23" rx="12" ry="8" fill={LIGHT} />
        </svg>
      );
    case 6: // pastosos, bordas irregulares
      return (
        <svg {...common}>
          <path
            d="M10 26 q4 -10 10 -6 q3 -9 10 -3 q5 -8 11 -1 q6 -7 10 1 q7 -6 10 2 q8 -3 9 5 q6 3 2 8 q-6 4 -12 1 q-6 5 -12 0 q-7 4 -12 -1 q-7 4 -12 -1 q-8 3 -11 -2 q-6 0 -5 -3z"
            fill={LIGHT}
          />
          <circle cx="86" cy="16" r="3" fill={LIGHT} />
          <circle cx="8" cy="15" r="2.5" fill={LIGHT} />
        </svg>
      );
    default: // 7: líquidas
      return (
        <svg {...common}>
          <path d="M6 28 q10 -8 24 -4 q14 -6 28 0 q16 -6 32 2 q2 6 -8 7 q-20 2 -40 1 q-24 1 -34 -2 q-4 -2 -2 -4z" fill={LIGHT} opacity="0.8" />
          {[22, 48, 70].map((x) => (
            <path key={x} d={`M${x} 8 q3 5 0 8 q-3 -3 0 -8z`} fill={LIGHT} opacity="0.8" />
          ))}
        </svg>
      );
  }
}

/** Cores de referência para a urina (do mais claro ao mais escuro) */
export const URINE_COLORS: Record<number, string> = {
  1: '#f6f8ea',
  2: '#f5eca0',
  3: '#efd85a',
  4: '#e0b52a',
  5: '#c7861c',
  6: '#8a4a1c'
};

export function Swatch({ color }: { color: string }) {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true">
      <path d="M8 4 h20 v6 l2 4 v24 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4 v-24 l2 -4z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M7.5 18 h21 v20 a3.5 3.5 0 0 1 -3.5 3.5 h-14 a3.5 3.5 0 0 1 -3.5 -3.5z" fill={color} />
    </svg>
  );
}
