// src/components/mind/MindReport.tsx
// Resultado do módulo Mente: radar testado × como você se vê, contradições,
// contexto do dia e um cartão por habilidade com gráfico e a conta à mostra.

import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { Info, RotateCcw } from 'lucide-react';
import { AxisScore, LAPSE_MS, MindData, median, mindAxes, stroopCalc, uniqueIdeas } from '../../lib/mind/mind';
import { AreaRadar } from '../body/BodyCharts';
import { Card, CardTitle, Eyebrow } from '../traditions/ui';

const PURPLE = '#7c3aed';
const GRID = '#e5e7eb';
const MUTED = '#6b7280';
const INK = '#111827';
const level = (s: number) => (s >= 70 ? { l: 'Bom', c: '#059669' } : s >= 45 ? { l: 'Médio', c: '#d97706' } : { l: 'Atenção', c: '#e11d48' });
const s1 = (n: number) => n.toFixed(1).replace('.', ',');

function Details({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-gray-200 text-sm">
      <summary className="cursor-pointer list-none px-4 min-h-[44px] flex items-center justify-between font-semibold text-purple-800">
        {title}
        <span className="text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="px-4 pb-4 flex flex-col gap-2.5 text-gray-700">{children}</div>
    </details>
  );
}

/** Barra horizontal com faixa típica sombreada */
function RangeBar({ label, value, max, unit, typical, text }: { label: string; value: number; max: number; unit: string; typical?: [number, number]; text?: string }) {
  const pct = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-900">
          {text ?? value} {unit}
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-gray-100">
        {typical && <div className="absolute inset-y-0 bg-emerald-100" style={{ left: pct(typical[0]), width: `calc(${pct(typical[1])} - ${pct(typical[0])})` }} title="Faixa comum em adultos" />}
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: pct(value), background: PURPLE }} />
      </div>
    </div>
  );
}

function ReactionStrip({ rts }: { rts: number[] }) {
  const W = 320;
  const lo = 150;
  const hi = 800;
  const x = (v: number) => ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * W;
  const med = median(rts);
  return (
    <figure className="m-0 flex flex-col gap-1">
      <svg viewBox={`-6 0 ${W + 18} 76`} className="w-full" role="img" aria-label={`Tempos de reação, mediana ${Math.round(med)} ms`}>
        <rect x={x(LAPSE_MS)} y="18" width={W - x(LAPSE_MS)} height="34" fill="#e11d48" opacity="0.07" />
        <text x={W - 2} y="30" textAnchor="end" fontSize="9" fill={MUTED}>
          lapsos
        </text>
        <line x1="0" y1="42" x2={W} y2="42" stroke={GRID} />
        {rts.map((r, i) => (
          <circle key={i} cx={x(r)} cy={42 + ((i % 3) - 1) * 6} r="4" fill={PURPLE} fillOpacity="0.55" stroke="#fff" strokeWidth="1.5">
            <title>{`${r} ms`}</title>
          </circle>
        ))}
        <line x1={x(med)} y1="16" x2={x(med)} y2="56" stroke={INK} strokeWidth="2" />
        <text x={x(med)} y="11" textAnchor={x(med) > W - 60 ? 'end' : x(med) < 60 ? 'start' : 'middle'} fontSize="11" fontWeight="700" fill={INK}>
          mediana {Math.round(med)} ms
        </text>
        {[200, 400, 600, 800].map((t) => (
          <text key={t} x={x(t)} y="70" textAnchor={t === 800 ? 'end' : 'middle'} fontSize="10" fill={MUTED}>
            {t} ms
          </text>
        ))}
      </svg>
      <figcaption className="text-xs text-gray-500">Cada ponto é uma resposta; a linha é a mediana.</figcaption>
    </figure>
  );
}

function AxisCard({ a, chart, extra }: { a: AxisScore; chart?: ReactNode; extra?: ReactNode }) {
  const lv = a.score === null ? null : level(a.score);
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow>{lv ? lv.l : 'Não feito'}</Eyebrow>
          <CardTitle>{a.label}</CardTitle>
        </div>
        <div className="text-right shrink-0">
          <p className="m-0 text-3xl font-bold" style={{ color: lv?.c ?? '#9ca3af' }}>
            {a.score ?? '–'}
          </p>
          {a.self !== undefined && <p className="m-0 text-xs text-gray-500">você se deu {a.self / 10}/10</p>}
        </div>
      </div>
      <p className="m-0 text-[15px] leading-relaxed text-gray-800">{a.headline}</p>
      {a.score !== null && chart}
      {extra}
      {a.score !== null && (
        <>
          <p className="m-0 text-sm text-gray-600">{a.reference}</p>
          <Details title={`Como chegamos a ${a.score}`}>
            {a.steps.map((s) => (
              <p key={s} className="m-0">
                {s}
              </p>
            ))}
          </Details>
        </>
      )}
    </Card>
  );
}

export default function MindReport({ data }: { data: MindData }) {
  const axes = useMemo(() => mindAxes(data), [data]);
  const scored = axes.filter((a) => a.score !== null);
  const mismatches = scored.filter((a) => a.self !== undefined && Math.abs(a.self - (a.score as number)) >= 30);
  const ax = (id: string) => axes.find((a) => a.id === id)!;
  const t = data.testes;
  const st = stroopCalc(t.stroop);
  const sleepLow = typeof data.contexto.sonoHoras === 'number' && data.contexto.sonoHoras < 6;

  return (
    <>
      {(sleepLow || data.contexto.cafeinaHoje) && (
        <div role="note" className="rounded-2xl border border-purple-200 bg-white p-5 flex gap-3 text-gray-800">
          <Info className="w-6 h-6 shrink-0 mt-0.5 text-purple-600" aria-hidden="true" />
          <p className="m-0 text-sm leading-relaxed">
            {sleepLow && `Você dormiu menos de ${data.contexto.sonoHoras! < 5 ? 5 : 6} horas na noite anterior aos testes, o que costuma piorar atenção e memória. `}
            {data.contexto.cafeinaHoje && 'Você tomou cafeína pouco antes, o que pode acelerar o tempo de reação. '}
            Vale refazer em outro dia para comparar.
          </p>
        </div>
      )}

      <Card>
        <Eyebrow>Visão geral</Eyebrow>
        <CardTitle>Seis habilidades, de 0 a 100</CardTitle>
        <div className="grid gap-6 md:grid-cols-2 items-center">
          {scored.length >= 3 ? (
            <AreaRadar label="Radar da mente: testado e como você se vê" measuredLabel="Resultado dos testes" selfLabel="Nota que você se deu (× 10)" axes={scored.map((a) => ({ label: a.label, measured: a.score as number, self: a.self }))} />
          ) : (
            <p className="m-0 text-sm text-gray-600">Faça pelo menos três testes para ver o radar.</p>
          )}
          <div className="flex flex-col gap-3">
            {axes.map((a) => {
              const lv = a.score === null ? null : level(a.score);
              return (
                <div key={a.id} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-900">{a.label}</span>
                    <span className="text-sm">
                      <strong className="text-lg" style={{ color: lv?.c ?? '#9ca3af' }}>
                        {a.score ?? '–'}
                      </strong>
                      <span className="text-gray-500"> {a.self !== undefined ? `· você: ${a.self}` : ''}</span>
                    </span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-gray-100">
                    {a.score !== null && <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.max(3, a.score)}%`, background: lv!.c }} />}
                    {a.self !== undefined && <div className="absolute -top-1 -bottom-1 w-1 rounded bg-amber-500" style={{ left: `calc(${a.self}% - 2px)` }} title={`Você se deu ${a.self / 10}`} />}
                  </div>
                </div>
              );
            })}
            <p className="m-0 text-xs text-gray-500">A marca laranja é a nota que você se deu (× 10).</p>
          </div>
        </div>
        {mismatches.length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl bg-purple-50 p-4">
            <p className="m-0 text-sm font-semibold text-purple-900">Onde a sua impressão e os testes não batem</p>
            <ul className="m-0 pl-5 list-disc text-sm text-gray-800 flex flex-col gap-1">
              {mismatches.map((a) => (
                <li key={a.id}>
                  <strong>{a.label}</strong>: você se deu {a.self! / 10} de 10, e o teste deu {a.score} de 100.{' '}
                  {a.self! > (a.score as number) ? 'Hoje, o teste ficou abaixo da sua impressão.' : 'Você pode estar se subestimando nessa habilidade.'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className="grid gap-5 md:grid-cols-2 items-start">
        <AxisCard a={ax('atencao')} chart={t.reacao && <ReactionStrip rts={t.reacao.rts} />} />
        <AxisCard
          a={ax('memoria')}
          chart={
            t.digitos && (
              <div className="flex flex-col gap-3">
                <RangeBar label="Ordem direta" value={t.digitos.forward} max={9} unit="números" typical={[5, 8]} />
                <RangeBar label="Ordem inversa" value={t.digitos.backward} max={9} unit="números" typical={[4, 6]} />
                <p className="m-0 text-xs text-gray-500">A faixa verde é a comum em adultos.</p>
              </div>
            )
          }
        />
        <AxisCard
          a={ax('controle')}
          chart={
            st && (
              <div className="flex flex-col gap-3">
                <RangeBar label="Palavra e cor combinando" value={Math.round(st.cong)} max={Math.max(st.inc, st.cong) * 1.15} unit="ms" />
                <RangeBar label="Palavra e cor em conflito" value={Math.round(st.inc)} max={Math.max(st.inc, st.cong) * 1.15} unit="ms" />
                <p className="m-0 text-xs text-gray-500">A diferença entre as duas barras é o custo de resistir à leitura automática.</p>
              </div>
            )
          }
        />
        <AxisCard
          a={ax('flexibilidade')}
          chart={
            t.trilhas &&
            t.trilhas.bMs > 0 && (
              <div className="flex flex-col gap-3">
                <RangeBar label="Parte A (1 → 2 → 3…)" text={s1(t.trilhas.aMs / 1000)} value={t.trilhas.aMs / 1000} max={(Math.max(t.trilhas.aMs, t.trilhas.bMs) / 1000) * 1.1} unit="s" />
                <RangeBar label="Parte B (1 → A → 2 → B…)" text={s1(t.trilhas.bMs / 1000)} value={t.trilhas.bMs / 1000} max={(Math.max(t.trilhas.aMs, t.trilhas.bMs) / 1000) * 1.1} unit="s" />
              </div>
            )
          }
        />
        <AxisCard
          a={ax('criatividade')}
          chart={
            t.criatividade && (
              <div className="flex flex-wrap gap-1.5">
                {uniqueIdeas(t.criatividade.ideas).map((i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 text-sm">
                    {i}
                  </span>
                ))}
              </div>
            )
          }
        />
        <AxisCard a={ax('curiosidade')} />
      </div>

      <Card>
        <Eyebrow>Sobre este resultado</Eyebrow>
        <CardTitle>O que ele é, e o que não é</CardTitle>
        <ul className="m-0 pl-5 list-disc text-sm leading-relaxed text-gray-700 flex flex-col gap-1.5">
          <li>
            Os testes são versões curtas de tarefas clássicas da psicologia: vigilância psicomotora (PVT), extensão de dígitos, Stroop, Trilhas e usos alternativos.
            A curiosidade usa a escala NCS-6 (Lins de Holanda Coelho, Hanel e Wolf, 2020), traduzida pelo NeoSapiens.
          </li>
          <li>
            Os escores de 0 a 100 usam faixas da literatura, não normas brasileiras por idade. Celular, cansaço e distrações mudam os resultados: servem para você se
            acompanhar ao longo do tempo.
          </li>
          <li>Não é avaliação neuropsicológica nem diagnóstico. Dificuldades persistentes de memória ou atenção merecem conversa com um profissional.</li>
        </ul>
        <Link
          href="/analysis/cognitive"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit"
        >
          <RotateCcw className="w-4 h-4" /> Refazer os testes
        </Link>
      </Card>
    </>
  );
}
