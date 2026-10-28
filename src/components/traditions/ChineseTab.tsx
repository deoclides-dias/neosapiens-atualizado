// src/components/traditions/ChineseTab.tsx
// Aba "Astrologia Chinesa": Quatro Pilares, pentagrama Wu Xing e leituras.

import type { ChineseChart, ChineseElement, Pillar } from '../../lib/astro';
import { CHINESE_ELEMENTS } from '../../lib/astro';
import { ANIMAL_TEXT, chineseBalanceText, dayMasterText } from '../../lib/astro/interpretation';
import WuXingPentagram from './WuXingPentagram';
import { Bars, Card, CardTitle, DarkPanel, Eyebrow, DISPLAY_FONT, HAN_FONT } from './ui';

const INK: Record<ChineseElement, string> = { Madeira: '#2f855a', Fogo: '#dc2626', Terra: '#b7791f', Metal: '#4b5563', Água: '#1d4ed8' };
const BAR: Record<ChineseElement, string> = { Madeira: '#2f855a', Fogo: '#dc2626', Terra: '#b7791f', Metal: '#6b7280', Água: '#1d4ed8' };

function PillarCard({ label, p, self = false }: { label: string; p: Pillar; self?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-4 flex flex-col items-center gap-1.5 text-center ${self ? 'border-2 border-purple-600 bg-purple-50' : 'border border-gray-200'}`}>
      <span className={`text-xs uppercase tracking-wider ${self ? 'font-bold text-purple-700' : 'font-semibold text-gray-600'}`}>{label}</span>
      <span className="text-5xl leading-tight" style={{ fontFamily: HAN_FONT, color: INK[p.stemElement] }}>{p.stemHan}</span>
      <span className="text-5xl leading-tight" style={{ fontFamily: HAN_FONT, color: INK[p.branchElement] }}>{p.branchHan}</span>
      <span className="text-sm font-semibold">{p.stem} · {p.branch}</span>
      <span className="text-[13px] text-gray-700">{p.stemElement} {p.yin ? 'Yin' : 'Yang'} · {p.animal}</span>
    </div>
  );
}

export default function ChineseTab({ chart }: { chart: ChineseChart }) {
  const rows = [...CHINESE_ELEMENTS]
    .map((e) => ({ label: e, value: chart.elements[e], max: 8, color: BAR[e] }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <CardTitle>Os Quatro Pilares do Destino</CardTitle>
          <p className="m-0 text-[13px] text-gray-600">Bāzì · cada pilar = um tronco celeste sobre um ramo terrestre</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <PillarCard label="Ano" p={chart.year} />
          <PillarCard label="Mês" p={chart.month} />
          <PillarCard label="Dia · você" p={chart.day} self />
          <PillarCard label="Hora" p={chart.hour} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-6 items-start">
        <DarkPanel label="Pentagrama dos Cinco Elementos" className="flex-[999_1_520px] min-w-0">
          <CardTitle dark>Os Cinco Elementos · Wǔ Xíng</CardTitle>
          <WuXingPentagram elements={chart.elements} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-[13px] text-purple-100">
            <span className="inline-flex items-center gap-2"><svg width="30" height="10" aria-hidden="true"><line x1="0" y1="5" x2="30" y2="5" stroke="#e8d9a8" strokeWidth="2" /></svg>Ciclo de geração (nutre)</span>
            <span className="inline-flex items-center gap-2"><svg width="30" height="10" aria-hidden="true"><line x1="0" y1="5" x2="30" y2="5" stroke="#b9a7f5" strokeWidth="2" strokeDasharray="6 5" /></svg>Ciclo de controle (contém)</span>
            <span className="inline-flex items-center gap-2"><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="#e9e3ff" strokeDasharray="3 3" /></svg>Elemento ausente</span>
          </div>
        </DarkPanel>

        <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
          <Card>
            <Eyebrow>Signo do ano</Eyebrow>
            <h3 className="m-0 text-[30px] font-bold text-indigo-950" style={{ fontFamily: DISPLAY_FONT }}>{chart.year.animal} de {chart.year.stemElement}</h3>
            <p className="m-0 text-sm leading-relaxed text-gray-700">
              {ANIMAL_TEXT[chart.year.animal][0].toUpperCase() + ANIMAL_TEXT[chart.year.animal].slice(1)}. O ano chinês começa no Lì Chūn (por volta de 4 de fevereiro, com o Sol a 315°); quem nasce antes dessa data pertence ao signo do ano anterior.
            </p>
          </Card>

          <Card>
            <Eyebrow>Mestre do Dia</Eyebrow>
            <h3 className="m-0 text-[30px] font-bold text-indigo-950" style={{ fontFamily: DISPLAY_FONT }}>
              <span style={{ fontFamily: HAN_FONT, color: INK[chart.day.stemElement] }}>{chart.day.stemHan}</span> {chart.day.stemElement} {chart.day.yin ? 'Yin' : 'Yang'}
            </h3>
            <p className="m-0 text-sm leading-relaxed text-gray-700">{dayMasterText(chart)}</p>
          </Card>

          <Card>
            <Eyebrow>Equilíbrio</Eyebrow>
            <Bars rows={rows} />
            <p className="m-0 text-sm leading-relaxed text-gray-700">{chineseBalanceText(chart)}</p>
          </Card>
        </div>
      </div>

      <p className="m-0 text-xs text-purple-200">Contagem pelos 8 caracteres visíveis. Os troncos ocultos dos ramos ainda não estão incluídos. Pilar da hora pelo horário civil.</p>
    </div>
  );
}
