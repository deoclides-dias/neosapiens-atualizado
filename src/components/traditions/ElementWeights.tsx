// src/components/traditions/ElementWeights.tsx
// "Como contamos os elementos": a tabela de pesos do mapa natal, ponto a ponto.

import type { WesternChart } from '../../lib/astro';

const fmt = (n: number) => String(n).replace('.', ',');

export const westernElementRows = (chart: WesternChart, colors: Record<'Fogo' | 'Terra' | 'Ar' | 'Água', string>) =>
  (['Fogo', 'Terra', 'Ar', 'Água'] as const)
    .map((e) => ({ label: e, value: Math.round((chart.elements[e] / chart.elementPoints) * 100), max: 100, color: colors[e] }))
    .sort((a, b) => b.value - a.value);

export default function ElementWeights({ chart, dark = false }: { chart: WesternChart; dark?: boolean }) {
  const rows = [...chart.weights].sort((a, b) => b.weight - a.weight);
  const ink = dark ? 'text-purple-50' : 'text-gray-900';
  const quiet = dark ? 'text-purple-200' : 'text-gray-600';
  return (
    <details className="group text-sm">
      <summary className={`cursor-pointer list-none inline-flex items-center gap-1 font-semibold ${dark ? 'text-purple-100' : 'text-purple-700'}`}>
        Como contamos os elementos <span className="group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="mt-3 flex flex-col gap-3">
        <p className={`m-0 text-[13px] leading-relaxed ${quiet}`}>
          Nem todo ponto do mapa pesa igual. Sol, Lua e Ascendente são os pilares (peso 4); o regente do Ascendente e o Meio do Céu pesam 3; Mercúrio, Vênus e
          Marte, 2; Júpiter e Saturno, 1. Urano, Netuno e Plutão ficam anos no mesmo signo e falam mais da geração do que da pessoa: pesam 0,5, e só sobem para
          2 quando estão a até 5° de um ângulo ou em conjunção, quadratura ou oposição a até 3° do Sol ou da Lua.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] ">
            <thead>
              <tr className={`text-left text-xs uppercase tracking-wide ${quiet}`}>
                {['Ponto', 'Signo', 'Peso', 'Por quê'].map((h) => (
                  <th key={h} className={`px-2 py-1.5 border-b font-semibold ${dark ? 'border-white/15' : 'border-gray-200'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.point} className={`border-b last:border-0 ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                  <td className={`px-2 py-1.5 font-semibold ${ink}`}>{w.label}</td>
                  <td className={`px-2 py-1.5 ${ink}`}>
                    {w.sign} <span className={quiet}>· {w.element}</span>
                  </td>
                  <td className={`px-2 py-1.5 font-bold ${ink}`}>{fmt(w.weight)}</td>
                  <td className={`px-2 py-1.5 ${quiet}`}>{w.reason}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className={`px-2 pt-2 font-semibold ${ink}`}>Total</td>
                <td className={`px-2 pt-2 font-bold ${ink}`}>{fmt(chart.elementPoints)}</td>
                <td className={`px-2 pt-2 ${quiet}`}>elemento = seus pesos ÷ total</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className={`m-0 text-xs ${quiet}`}>
          Contagem simples, sem pesos (1 por ponto): Fogo {chart.elementCounts.Fogo}, Terra {chart.elementCounts.Terra}, Ar {chart.elementCounts.Ar}, Água {chart.elementCounts.Água}, de 11.
        </p>
      </div>
    </details>
  );
}
