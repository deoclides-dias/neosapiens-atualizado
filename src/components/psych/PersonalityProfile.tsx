// src/components/psych/PersonalityProfile.tsx
// Corpo da página de resultados do Mini-IPIP: aviso de qualidade, visão geral,
// um cartão por traço (com a conta à mostra) e notas sobre o instrumento.

import { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { INSTRUMENT, MARGIN, SCALE, TRAITS, TraitScore, PsychologicalResult, scoreTraits } from '../../lib/psych/miniIpip';
import { Card, CardTitle, Eyebrow } from '../traditions/ui';

const BAND_LABEL = { baixo: 'Mais baixo', intermediario: 'Intermediário', alto: 'Mais alto' } as const;
const fmt = (n: number) => n.toFixed(1).replace('.', ',');

function TraitBar({ s, color }: { s: TraitScore; color: string }) {
  return (
    <div className="relative h-8" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-100" />
      {[35, 65].map((x) => (
        <div key={x} className="absolute top-1 bottom-1 w-px bg-gray-300" style={{ left: `${x}%` }} />
      ))}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full opacity-25"
        style={{ left: `${s.low}%`, width: `${s.high - s.low}%`, background: color }}
      />
      <div
        className="absolute top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow"
        style={{ left: `${s.score}%`, background: color }}
      />
    </div>
  );
}

function Calculation({ s, inverted }: { s: TraitScore; inverted?: boolean }) {
  return (
    <details className="group rounded-xl border border-gray-200 text-sm">
      <summary className="cursor-pointer list-none px-4 min-h-[44px] flex items-center justify-between font-semibold text-purple-800">
        Como chegamos a {s.score}
        <span className="text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="px-4 pb-4 flex flex-col gap-3 text-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-1.5 pr-2 font-semibold">Frase</th>
              <th className="py-1.5 px-2 font-semibold text-center">Resposta</th>
              <th className="py-1.5 pl-2 font-semibold text-center">Na conta</th>
            </tr>
          </thead>
          <tbody>
            {s.items.map((i) => (
              <tr key={i.id} className="border-t border-gray-100 align-top">
                <td className="py-2 pr-2">{i.text}</td>
                <td className="py-2 px-2 text-center font-semibold">{i.answer}</td>
                <td className="py-2 pl-2 text-center font-semibold whitespace-nowrap">
                  {i.reversed ? (
                    <span title="Frase invertida: 6 − resposta">
                      6 − {i.answer} = {i.used}
                    </span>
                  ) : (
                    i.used
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="m-0">
          Frases escritas no sentido oposto do traço entram invertidas (6 − resposta)
          {inverted ? '. Como este traço é mostrado como estabilidade, as frases sobre oscilação de humor é que entram invertidas' : ''}.
        </p>
        <p className="m-0">
          Média: ({s.items.map((i) => i.used).join(' + ')}) ÷ 4 = <strong>{fmt(s.mean)}</strong> na escala de 1 a 5. Na escala de 0 a 100: ({fmt(s.mean)} − 1) ÷
          4 × 100 = <strong>{s.score}</strong>.
        </p>
      </div>
    </details>
  );
}

export default function PersonalityProfile({ result }: { result: PsychologicalResult }) {
  const scores = useMemo(() => scoreTraits(result.respostas), [result]);
  const quality = result.qualidade;
  return (
    <>
      {quality && quality.status !== 'ok' && (
        <div role="note" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex gap-3 text-amber-900">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1.5 text-sm">
            <p className="m-0 font-semibold">
              {quality.status === 'invalido' ? 'Leia com cautela: as respostas parecem apressadas.' : 'Uma das verificações de qualidade chamou atenção.'}
            </p>
            <ul className="m-0 pl-5 list-disc">
              {quality.checks
                .filter((c) => !c.ok)
                .map((c) => (
                  <li key={c.id}>
                    <strong>{c.label}:</strong> {c.detail}
                  </li>
                ))}
            </ul>
            <Link href="/analysis/psychological" className="font-semibold underline w-fit">
              Refazer com calma
            </Link>
          </div>
        </div>
      )}

      <Card>
        <Eyebrow>Visão geral</Eyebrow>
        <CardTitle>Os cinco traços</CardTitle>
        <p className="m-0 text-sm leading-relaxed text-gray-700">
          Cada traço vai de 0 a 100 e mostra onde você se colocou <strong>dentro da própria escala</strong>, não em comparação com outras pessoas. Nenhum ponto
          é melhor que outro: cada um tem vantagens e custos. A faixa clara indica a margem de ±{MARGIN} pontos de um questionário curto.
        </p>
        <div className="flex flex-col gap-4">
          {TRAITS.map((t) => {
            const s = scores.find((x) => x.id === t.id)!;
            return (
              <div key={t.id} className="grid gap-x-4 gap-y-1 items-center sm:grid-cols-[180px_minmax(0,1fr)_44px] grid-cols-[minmax(0,1fr)_44px]">
                <span className="font-semibold text-gray-900 sm:col-span-1 col-span-1">{t.name}</span>
                <span className="sm:hidden text-right font-bold text-gray-900">{s.score}</span>
                <div className="col-span-2 sm:col-span-1">
                  <TraitBar s={s} color={t.color} />
                </div>
                <span className="hidden sm:block text-right font-bold text-gray-900">{s.score}</span>
              </div>
            );
          })}
          <div className="grid sm:grid-cols-[180px_minmax(0,1fr)_44px] gap-x-4 text-xs text-gray-500">
            <span className="hidden sm:block" />
            <div className="flex justify-between">
              <span>0 · mais baixo</span>
              <span>intermediário</span>
              <span>mais alto · 100</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 items-start">
        {TRAITS.map((t) => {
          const s = scores.find((x) => x.id === t.id)!;
          return (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Eyebrow>{t.technical}</Eyebrow>
                  <CardTitle>{t.name}</CardTitle>
                </div>
                <div className="text-right shrink-0">
                  <p className="m-0 text-3xl font-bold" style={{ color: t.color }}>
                    {s.score}
                  </p>
                  <p className="m-0 text-xs text-gray-500">
                    {BAND_LABEL[s.band]} · {s.low}–{s.high}
                  </p>
                </div>
              </div>
              <TraitBar s={s} color={t.color} />
              <p className="m-0 text-[15px] leading-relaxed text-gray-800">{t[s.band === 'baixo' ? 'low' : s.band === 'alto' ? 'high' : 'mid']}</p>
              <Calculation s={s} inverted={t.inverted} />
            </Card>
          );
        })}
      </div>

      <Card>
        <Eyebrow>Sobre este resultado</Eyebrow>
        <CardTitle>O que ele é, e o que não é</CardTitle>
        <ul className="m-0 pl-5 list-disc text-sm leading-relaxed text-gray-700 flex flex-col gap-1.5">
          <li>
            O <strong>Mini-IPIP</strong> é uma versão curta, de 20 frases, de um banco de itens de personalidade de domínio público (IPIP), testada em vários
            estudos. A tradução para o português é do NeoSapiens e ainda não foi validada no Brasil.
          </li>
          <li>Com 4 frases por traço, a medida é rápida, mas aproximada. Por isso mostramos a margem, e diferenças de poucos pontos não significam nada.</li>
          <li>É um retrato de como você se descreve hoje. Personalidade muda devagar ao longo da vida; refazer daqui a alguns meses mostra o seu movimento.</li>
          <li>Não é diagnóstico e não substitui avaliação feita por profissional de psicologia.</li>
        </ul>
        <p className="m-0 text-xs text-gray-500">
          Respostas: {SCALE.map((s) => `${s.value} = ${s.label.toLowerCase()}`).join(' · ')}.
          <br />
          Fonte: {INSTRUMENT.citation}{' '}
          <a href={INSTRUMENT.doi} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">
            {INSTRUMENT.doi.replace('https://', '')}
          </a>
        </p>
        <Link
          href="/analysis/psychological"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit"
        >
          <RotateCcw className="w-4 h-4" /> Responder de novo
        </Link>
      </Card>
    </>
  );
}
