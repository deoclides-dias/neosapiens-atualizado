// src/components/traditions/NatalWheel.tsx
// Roda do mapa natal em SVG, desenhada a partir do WesternChart:
// signos coloridos por elemento, casas, planetas (espalhados para não
// colidir), linhas de aspecto e Grandes Trígonos preenchidos.

import { useMemo } from 'react';
import type { AspectType, WesternChart } from '../../lib/astro';
import { SIGN_GLYPHS } from '../../lib/astro';

const VS = '︎'; // força o glifo em modo texto (não emoji)
const C = 300;
const R_OUT = 290, R_SIGN = 248, R_HOUSE = 216, R_PLAN = 182, R_ASP = 150;

const SIGN_FILLS = ['rgba(244,114,94,0.20)', 'rgba(214,170,60,0.20)', 'rgba(110,190,240,0.18)', 'rgba(130,120,245,0.24)'];

export const ASPECT_STYLE: Record<Exclude<AspectType, 'conjuncao'>, { color: string; dash?: string; width: number; label: string }> = {
  trigono: { color: '#7fb4ff', width: 1.6, label: 'Trígono (120°)' },
  sextil: { color: '#5fd3a8', dash: '5 4', width: 1.2, label: 'Sextil (60°)' },
  quadratura: { color: '#ff9a4d', width: 1.2, label: 'Quadratura (90°)' },
  oposicao: { color: '#ff6b8a', dash: '7 5', width: 1.6, label: 'Oposição (180°)' },
  quintil: { color: '#e8d9a8', dash: '2 3', width: 1, label: 'Quintil (72°)' }
};

const SYMBOL_FONT = "'Noto Sans Symbols', 'Segoe UI Symbol', serif";

interface NatalWheelProps {
  chart: WesternChart;
}

export default function NatalWheel({ chart }: NatalWheelProps) {
  const geo = useMemo(() => {
    const asc = chart.ascendant.lon;
    const pt = (lon: number, r: number) => {
      const th = ((180 + (lon - asc)) * Math.PI) / 180;
      return { x: C + r * Math.cos(th), y: C - r * Math.sin(th) };
    };

    const signs = Array.from({ length: 12 }, (_, i) => {
      const a0 = i * 30, a1 = a0 + 30;
      const p0o = pt(a0, R_OUT), p1o = pt(a1, R_OUT), p0i = pt(a0, R_SIGN), p1i = pt(a1, R_SIGN);
      const d = `M${p0o.x},${p0o.y} A${R_OUT},${R_OUT} 0 0 0 ${p1o.x},${p1o.y} L${p1i.x},${p1i.y} A${R_SIGN},${R_SIGN} 0 0 1 ${p0i.x},${p0i.y} Z`;
      return { d, fill: SIGN_FILLS[i % 4], glyph: pt(a0 + 15, (R_OUT + R_SIGN) / 2), symbol: SIGN_GLYPHS[i] + VS };
    });

    const cusps = chart.cusps.map((c, i) => {
      const axis = i % 3 === 0;
      const next = chart.cusps[(i + 1) % 12];
      const span = (((next - c) % 360) + 360) % 360;
      return {
        from: pt(c, axis ? R_SIGN : R_HOUSE),
        to: pt(c, R_ASP),
        axis,
        label: pt(c + span / 2, (R_SIGN + R_HOUSE) / 2),
        n: i + 1
      };
    });

    const pos = Object.fromEntries(chart.planets.map((p) => [p.id, p.lon]));

    // Um trígono que repete 2 planetas de outro (variação por conjunção) não é preenchido de novo
    const drawn: string[][] = [];
    chart.patterns
      .filter((p) => p.type === 'grandeTrigono')
      .forEach((p) => {
        if (!drawn.some((d) => d.filter((id) => p.planets.includes(id as any)).length >= 2)) drawn.push(p.planets);
      });
    const trines = drawn.map((ids) => ids.map((id) => pt(pos[id], R_ASP)).map((q) => `${q.x},${q.y}`).join(' '));

    const aspects = chart.aspects
      .filter((a) => a.type !== 'conjuncao')
      .map((a) => ({ ...ASPECT_STYLE[a.type as Exclude<AspectType, 'conjuncao'>], from: pt(pos[a.a], R_ASP), to: pt(pos[a.b], R_ASP), key: `${a.a}-${a.b}` }));

    // Espalha os glifos para manter pelo menos 9° entre vizinhos
    const disp: Record<string, number> = { ...pos };
    for (let it = 0; it < 80; it++) {
      let moved = false;
      const ids = Object.keys(disp).sort((a, b) => disp[a] - disp[b]);
      for (let i = 0; i < ids.length; i++) {
        const a = ids[i], b = ids[(i + 1) % ids.length];
        const gap = (((disp[b] - disp[a]) % 360) + 360) % 360;
        if (gap < 9) {
          disp[a] -= (9 - gap) / 2;
          disp[b] += (9 - gap) / 2;
          moved = true;
        }
      }
      if (!moved) break;
    }

    const planets = chart.planets.map((p) => ({
      id: p.id,
      tick0: pt(p.lon, R_HOUSE),
      tick1: pt(p.lon, R_HOUSE - 8),
      dot: pt(p.lon, R_ASP),
      glyph: pt(disp[p.id], R_PLAN),
      label: pt(disp[p.id], R_PLAN - 19),
      symbol: p.glyph + VS,
      text: `${Math.floor(p.degree)}°${p.retrograde ? ' ℞' : ''}`,
      title: `${p.name} em ${p.sign}`
    }));

    return { signs, cusps, trines, aspects, planets, ac: pt(chart.cusps[0], R_OUT + 13), mc: pt(chart.cusps[9], R_OUT + 13) };
  }, [chart]);

  const f = (n: number) => n.toFixed(1);

  return (
    <svg
      viewBox="-26 -26 652 652"
      width="100%"
      style={{ display: 'block', maxWidth: 620, margin: '0 auto' }}
      role="img"
      aria-label="Roda do mapa natal com signos, casas, planetas e aspectos"
    >
      <circle cx={C} cy={C} r={R_OUT} fill="#15122f" stroke="#e8d9a8" strokeOpacity={0.55} strokeWidth={1.5} />

      {geo.signs.map((s, i) => (
        <g key={`s${i}`}>
          <path d={s.d} fill={s.fill} stroke="#e8d9a8" strokeOpacity={0.35} />
          <text x={f(s.glyph.x)} y={f(s.glyph.y)} textAnchor="middle" dominantBaseline="central" fontSize={22} fill="#f3e7c4" fontFamily={SYMBOL_FONT}>
            {s.symbol}
          </text>
        </g>
      ))}

      <circle cx={C} cy={C} r={R_SIGN} fill="none" stroke="#e8d9a8" strokeOpacity={0.55} />
      <circle cx={C} cy={C} r={R_HOUSE} fill="none" stroke="#e8d9a8" strokeOpacity={0.35} />
      <circle cx={C} cy={C} r={R_ASP} fill="rgba(255,255,255,0.03)" stroke="#e8d9a8" strokeOpacity={0.45} />

      {geo.cusps.map((c) => (
        <g key={`c${c.n}`}>
          <line x1={f(c.from.x)} y1={f(c.from.y)} x2={f(c.to.x)} y2={f(c.to.y)} stroke="#e8d9a8" strokeOpacity={c.axis ? 0.85 : 0.3} strokeWidth={c.axis ? 1.6 : 1} />
          <text x={f(c.label.x)} y={f(c.label.y)} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="#c9bfe8" fontFamily="Inter, sans-serif">
            {c.n}
          </text>
        </g>
      ))}

      {geo.trines.map((points, i) => (
        <polygon key={`t${i}`} points={points} fill="rgba(127,180,255,0.13)" />
      ))}

      {geo.aspects.map((a) => (
        <line key={a.key} x1={f(a.from.x)} y1={f(a.from.y)} x2={f(a.to.x)} y2={f(a.to.y)} stroke={a.color} strokeWidth={a.width} strokeOpacity={0.9} strokeDasharray={a.dash} />
      ))}

      {geo.planets.map((p) => (
        <g key={p.id}>
          <title>{p.title}</title>
          <line x1={f(p.tick0.x)} y1={f(p.tick0.y)} x2={f(p.tick1.x)} y2={f(p.tick1.y)} stroke="#f3e7c4" strokeWidth={1.5} />
          <circle cx={f(p.dot.x)} cy={f(p.dot.y)} r={2.4} fill="#f3e7c4" />
          <text x={f(p.glyph.x)} y={f(p.glyph.y)} textAnchor="middle" dominantBaseline="central" fontSize={21} fill="#fff6dc" fontFamily={SYMBOL_FONT}>
            {p.symbol}
          </text>
          <text x={f(p.label.x)} y={f(p.label.y)} textAnchor="middle" dominantBaseline="central" fontSize={9.5} fill="#c9bfe8" fontFamily="Inter, sans-serif">
            {p.text}
          </text>
        </g>
      ))}

      {[{ p: geo.ac, t: 'AC' }, { p: geo.mc, t: 'MC' }].map(({ p, t }) => (
        <g key={t}>
          <circle cx={f(p.x)} cy={f(p.y)} r={11} fill="#e8d9a8" />
          <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#15122f" fontFamily="Inter, sans-serif">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
