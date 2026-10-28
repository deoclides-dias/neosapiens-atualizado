// src/components/traditions/NumerologyTab.tsx
// Aba "Numerologia": Caminho de Vida, números principais e Grade de Pitágoras.

import type { NumerologyChart } from '../../lib/astro';
import { ARROW_TEXT, MISSING_TEXT, NUMBER_TEXT, PERSONAL_YEAR_TEXT } from '../../lib/astro/interpretation';
import PythagoreanGrid, { ARROW_COLORS } from './PythagoreanGrid';
import { Card, CardTitle, DarkPanel, Eyebrow, DISPLAY_FONT } from './ui';

const MASTERS = [11, 22, 33];

export default function NumerologyTab({ n }: { n: NumerologyChart }) {
  const lp = NUMBER_TEXT[n.lifePath];
  const isMaster = MASTERS.includes(n.lifePath);
  const reduced = isMaster ? `${n.lifePath}/${String(n.lifePath).split('').reduce((s, c) => s + Number(c), 0)}` : String(n.lifePath);
  const others = [
    { value: n.expression, label: 'Expressão', hint: 'todas as letras do nome' },
    { value: n.soulUrge, label: 'Motivação', hint: 'vogais do nome' },
    { value: n.personality, label: 'Personalidade', hint: 'consoantes do nome' },
    { value: n.birthday, label: 'Aniversário', hint: 'dia do nascimento' },
    { value: n.personalYear.value, label: `Ano Pessoal ${n.personalYear.year}`, hint: PERSONAL_YEAR_TEXT[n.personalYear.value] || '', dark: true }
  ];
  const complete = n.arrows.filter((a) => a.complete);
  const s = n.lifePathSteps;

  return (
    <div className="flex flex-col gap-6">
      <Card className="!flex-row flex-wrap items-center gap-7">
        <div className="w-[168px] h-[168px] shrink-0 rounded-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 40%, #4c1d95, #1e1b4b)', boxShadow: '0 0 0 6px #ede9fe' }}>
          <span className="text-[84px] leading-none font-bold text-[#f3e7c4]" style={{ fontFamily: DISPLAY_FONT }}>{n.lifePath}</span>
          {isMaster && <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">Número mestre</span>}
        </div>
        <div className="flex-[1_1_360px] min-w-0 flex flex-col gap-2">
          <Eyebrow>Caminho de Vida</Eyebrow>
          <h2 className="m-0 text-[32px] font-bold text-indigo-950" style={{ fontFamily: DISPLAY_FONT }}>{reduced} — {lp.title}</h2>
          <p className="m-0 text-[15px] leading-relaxed text-gray-700">{lp.text[0].toUpperCase() + lp.text.slice(1)}.</p>
          <p className="m-0 text-[13px] text-gray-600 font-mono">
            dia → {s.day} · mês → {s.month} · ano → {s.yearSum}{s.yearSum !== s.year ? ` → ${s.year}` : ''} · {s.day} + {s.month} + {s.year} = {n.lifePath}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {others.map((o) => (
          <div key={o.label} className="bg-white rounded-2xl px-3 py-4 flex flex-col items-center gap-1.5 text-center shadow-lg shadow-black/20">
            <span
              className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold ${o.dark ? 'bg-indigo-950 text-[#f3e7c4]' : 'border-2 border-purple-600 text-purple-900'}`}
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {o.value}
            </span>
            <span className="text-sm font-bold text-gray-900">{o.label}</span>
            <span className="text-xs text-gray-600">{o.hint}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <DarkPanel label="Grade de Pitágoras" className="flex-[1_1_440px] min-w-0">
          <CardTitle dark>Grade de Pitágoras</CardTitle>
          <p className="m-0 text-[13px] text-purple-200 text-center">Dígitos da data de nascimento distribuídos de 1 a 9</p>
          <PythagoreanGrid numerology={n} />
        </DarkPanel>

        <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
          <Card>
            <CardTitle>{complete.length ? 'Setas completas na grade' : 'Nenhuma seta completa'}</CardTitle>
            {complete.map((a) => (
              <div key={a.id} className="flex gap-3 items-start">
                <span className="shrink-0 w-[34px] h-1.5 mt-2 rounded-full" style={{ background: ARROW_COLORS[n.arrows.findIndex((x) => x.id === a.id)] }} />
                <p className="m-0 text-sm leading-relaxed text-gray-700">
                  <strong className="text-gray-900">{a.digits.join(' · ')} — {a.name}.</strong> {ARROW_TEXT[a.id][0].toUpperCase() + ARROW_TEXT[a.id].slice(1)}.
                </p>
              </div>
            ))}
          </Card>

          {n.missing.length > 0 && (
            <Card>
              <CardTitle>Números ausentes: {n.missing.join(', ')}</CardTitle>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                Na tradição, são lidos como aprendizados: {n.missing.map((m) => `o ${m} (${MISSING_TEXT[m]})`).join(', ')}.
              </p>
            </Card>
          )}
        </div>
      </div>

      <p className="m-0 text-xs text-purple-200">Numerologia pitagórica · nome completo sem acentos · números mestres 11, 22 e 33 preservados.</p>
    </div>
  );
}
