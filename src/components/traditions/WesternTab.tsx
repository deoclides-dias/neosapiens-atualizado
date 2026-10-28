// src/components/traditions/WesternTab.tsx
// Aba "Mapa Natal": roda, três pilares, geometria, elementos e posições.

import type { WesternChart } from '../../lib/astro';
import { formatDegree } from '../../lib/astro';
import { groupedPatterns, patternText, patternTitle, SIGN_KEYWORDS, sunHorizonText } from '../../lib/astro/interpretation';
import NatalWheel, { ASPECT_STYLE } from './NatalWheel';
import { Bars, Card, CardTitle, DarkPanel, LegendLine, SYMBOL_FONT } from './ui';

const VS = '︎';

export default function WesternTab({ chart }: { chart: WesternChart }) {
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const patterns = groupedPatterns(chart);
  const used = new Set(chart.aspects.map((a) => a.type));
  const max = chart.elementPoints;
  const elementRows = (['Fogo', 'Terra', 'Ar', 'Água'] as const)
    .map((e) => ({ label: e, value: chart.elements[e], max, color: { Fogo: '#dc2626', Terra: '#a16207', Ar: '#0284c7', Água: '#4338ca' }[e] }))
    .sort((a, b) => b.value - a.value);

  const pillars = [
    { glyph: sun.glyph + VS, color: '#b45309', label: 'Sol', sign: sun.sign, detail: `${formatDegree(sun.degree)} · casa ${sun.house}` },
    { glyph: moon.glyph + VS, color: '#4338ca', label: 'Lua', sign: moon.sign, detail: `${formatDegree(moon.degree)} · casa ${moon.house}` },
    { glyph: 'AC', color: '#6d28d9', label: 'Ascendente', sign: chart.ascendant.sign, detail: formatDegree(chart.ascendant.degree) }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6 items-start">
        <DarkPanel label="Roda do mapa natal" className="flex-[999_1_560px] min-w-0">
          <NatalWheel chart={chart} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-[13px] text-purple-100">
            {(Object.keys(ASPECT_STYLE) as (keyof typeof ASPECT_STYLE)[])
              .filter((t) => used.has(t))
              .map((t) => <LegendLine key={t} color={ASPECT_STYLE[t].color} dash={ASPECT_STYLE[t].dash} label={ASPECT_STYLE[t].label} />)}
          </div>
        </DarkPanel>

        <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
          <Card>
            <CardTitle>Os três pilares do mapa</CardTitle>
            <div className="grid grid-cols-3 gap-3">
              {pillars.map((p) => (
                <div key={p.label} className="border border-gray-200 rounded-xl px-3 py-3.5 flex flex-col items-center gap-1 text-center">
                  <span aria-hidden="true" className={p.glyph === 'AC' ? 'text-xl font-bold leading-9' : 'text-3xl'} style={{ color: p.color, fontFamily: p.glyph === 'AC' ? undefined : SYMBOL_FONT }}>
                    {p.glyph}
                  </span>
                  <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{p.label}</span>
                  <span className="text-[17px] font-bold">{p.sign}</span>
                  <span className="text-[13px] text-gray-600">{p.detail}</span>
                </div>
              ))}
            </div>
            <p className="m-0 text-sm leading-relaxed text-gray-700">
              Sol em {sun.sign} ({SIGN_KEYWORDS[sun.sign]}), Lua em {moon.sign} ({SIGN_KEYWORDS[moon.sign]}) e Ascendente em {chart.ascendant.sign} ({SIGN_KEYWORDS[chart.ascendant.sign]}). {sunHorizonText(chart)}
            </p>
          </Card>

          <Card>
            <CardTitle>A geometria do seu mapa</CardTitle>
            {patterns.length === 0 && <p className="m-0 text-sm text-gray-700">Nenhuma figura maior (Grande Trígono, Pipa, T-Quadrada, Grande Cruz ou Stellium) aparece neste mapa.</p>}
            {patterns.map((p, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="m-0 font-bold text-[15px]">{patternTitle(p)}</p>
                <p className="m-0 text-sm leading-relaxed text-gray-700">{patternText(p, chart)}</p>
              </div>
            ))}
          </Card>

          <Card>
            <CardTitle>Equilíbrio dos elementos</CardTitle>
            <p className="m-0 text-[13px] text-gray-600">{chart.planets.length} planetas + Ascendente</p>
            <Bars rows={elementRows} />
          </Card>
        </div>
      </div>

      <Card>
        <CardTitle>Posições planetárias</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-gray-600 text-xs uppercase tracking-wide">
                {['Planeta', 'Signo', 'Grau', 'Casa', 'Movimento'].map((h) => (
                  <th key={h} className="px-3 py-2.5 border-b border-gray-200 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.planets.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2.5"><span aria-hidden="true" style={{ fontFamily: SYMBOL_FONT }}>{p.glyph + VS}</span> {p.name}</td>
                  <td className="px-3 py-2.5">{p.sign}</td>
                  <td className="px-3 py-2.5">{formatDegree(p.degree)}</td>
                  <td className="px-3 py-2.5">{p.house}</td>
                  <td className={`px-3 py-2.5 ${p.retrograde ? 'text-amber-700 font-semibold' : ''}`}>{p.retrograde ? 'Retrógrado ℞' : 'Direto'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-xs text-gray-600">
          Meio do Céu: {chart.midheaven.sign} {formatDegree(chart.midheaven.degree)} · Zodíaco tropical · Casas {chart.houseSystem} · Efemérides astronomy-engine
        </p>
      </Card>
    </div>
  );
}
