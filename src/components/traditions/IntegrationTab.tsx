// src/components/traditions/IntegrationTab.tsx
// Aba "Integração": convergências e divergências entre as três tradições,
// pelas regras explícitas de src/lib/astro/interpretation.ts.

import type { TraditionsResult } from '../../lib/astro';
import { ELEMENT_HAN, SIGN_GLYPHS } from '../../lib/astro';
import { integrationThemes, ThemeEvidence } from '../../lib/astro/interpretation';
import { ELEMENT_COLORS } from './WuXingPentagram';
import { Bars, Card, CardTitle, DarkPanel, Eyebrow, DISPLAY_FONT, HAN_FONT, SYMBOL_FONT } from './ui';

function Evidence({ e }: { e: ThemeEvidence }) {
  return (
    <td className="px-3 py-3.5 align-top">
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-1 ${e.supports ? 'text-purple-700' : 'text-gray-500'}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${e.supports ? 'bg-purple-700' : 'border-2 border-gray-400'}`} aria-hidden="true" />
        {e.supports ? 'Indica' : 'Não indica'}
      </span>
      <span className="block text-gray-700">{e.text}</span>
    </td>
  );
}

export default function IntegrationTab({ result }: { result: TraditionsResult }) {
  const { western: w, chinese: c, numerology: n } = result;
  const themes = integrationThemes(result);
  const sun = w.planets.find((p) => p.id === 'Sun')!;
  const topChinese = (Object.entries(c.elements) as [keyof typeof c.elements, number][]).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap gap-7 items-center justify-center py-2" aria-label="Resumo">
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden="true" className="w-[84px] h-[84px] rounded-full border-2 border-[#e8d9a8] flex items-center justify-center text-[40px] text-[#f3e7c4]" style={{ fontFamily: SYMBOL_FONT }}>
            {SIGN_GLYPHS[sun.signIndex]}{'︎'}
          </span>
          <span className="text-[13px] text-purple-100">Sol em {sun.sign}</span>
        </div>
        <span aria-hidden="true" className="text-4xl text-purple-300">·</span>
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden="true" className="w-[84px] h-[84px] rounded-full flex items-center justify-center text-[40px] text-white" style={{ fontFamily: HAN_FONT, background: ELEMENT_COLORS[topChinese] }}>
            {ELEMENT_HAN[topChinese]}
          </span>
          <span className="text-[13px] text-purple-100">{topChinese} dominante</span>
        </div>
        <span aria-hidden="true" className="text-4xl text-purple-300">·</span>
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden="true" className="w-[84px] h-[84px] rounded-full bg-indigo-950 flex items-center justify-center text-[42px] font-bold text-[#f3e7c4]" style={{ fontFamily: DISPLAY_FONT, boxShadow: '0 0 0 2px #e8d9a8' }}>
            {n.lifePath}
          </span>
          <span className="text-[13px] text-purple-100">Caminho de Vida</span>
        </div>
      </section>

      <Card>
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <CardTitle>Onde as três tradições se encontram</CardTitle>
          <p className="m-0 text-[13px] text-gray-600">Cada linha é um tema; a força mostra quantas tradições o indicam</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-gray-600 text-xs uppercase tracking-wide">
                {['Tema', 'Mapa Natal', 'Astrologia Chinesa', 'Numerologia', 'Força'].map((h) => (
                  <th key={h} className="px-3 py-2.5 border-b border-gray-200 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-3.5 align-top font-bold text-gray-900">
                    {t.title}
                    {t.divergent && <span className="block mt-1 text-xs font-semibold text-amber-700">As tradições divergem</span>}
                  </td>
                  <Evidence e={t.western} />
                  <Evidence e={t.chinese} />
                  <Evidence e={t.numerology} />
                  <td className="px-3 py-3.5 align-top">
                    <span className="inline-flex gap-1" role="img" aria-label={`${t.strength} de 3`}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`w-3 h-3 rounded-full ${i < t.strength ? 'bg-purple-700' : 'border-2 border-gray-300'}`} />
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-wrap gap-6 items-stretch">
        <DarkPanel className="flex-[1_1_440px] min-w-0">
          <h2 className="m-0 text-[26px] font-bold text-white" style={{ fontFamily: DISPLAY_FONT }}>Os elementos lado a lado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2.5">
              <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-200">Ocidental · 4 elementos</p>
              <Bars dark rows={(['Fogo', 'Terra', 'Ar', 'Água'] as const).map((e) => ({ label: e, value: w.elements[e], max: w.elementPoints, color: { Fogo: '#f4725e', Terra: '#d6aa3c', Ar: '#6ec3f0', Água: '#8a82f5' }[e] })).sort((a, b) => b.value - a.value)} />
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-200">Chinesa · 5 elementos</p>
              <Bars dark rows={(Object.keys(c.elements) as (keyof typeof c.elements)[]).map((e) => ({ label: e, value: c.elements[e], max: 8, color: ELEMENT_COLORS[e] })).sort((a, b) => b.value - a.value)} />
            </div>
          </div>
          <p className="m-0 text-[13px] leading-relaxed text-purple-100">Os dois sistemas não se traduzem um no outro, mas podem apontar o mesmo padrão. É a tabela acima que diz onde concordam.</p>
        </DarkPanel>

        <Card className="flex-[1_1_440px] min-w-0">
          <Eyebrow>Próximo passo</Eyebrow>
          <CardTitle>Ponte com a dimensão psicológica</CardTitle>
          <p className="m-0 text-sm leading-relaxed text-gray-700">Hipóteses que as suas respostas da avaliação psicológica vão confirmar ou contestar:</p>
          <div className="flex flex-col gap-2.5">
            {themes.map((t) => (
              <div key={t.id} className="flex justify-between gap-3 px-3.5 py-3 border border-gray-200 rounded-xl text-sm">
                <span><strong>{t.title}</strong> ↔ {t.bridge}</span>
                <span className="text-gray-600 whitespace-nowrap">a calcular</span>
              </div>
            ))}
            <div className="flex justify-between gap-3 px-3.5 py-3 border border-gray-200 rounded-xl text-sm">
              <span><strong>Pentagrama chinês</strong> ↔ 5 Elementos da MTC (etapas 7 e 8)</span>
              <span className="text-gray-600 whitespace-nowrap">a calcular</span>
            </div>
          </div>
        </Card>
      </div>

      <p className="m-0 text-xs text-purple-200">Leituras simbólicas das tradições, para autoconhecimento. As correlações com a psicologia serão apresentadas como hipóteses, não como diagnóstico.</p>
    </div>
  );
}
