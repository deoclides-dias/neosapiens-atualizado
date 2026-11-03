// src/components/body/BodyReportView.tsx
// Resultado do módulo Corpo: visão geral, prioridades (com contradições
// entre como a pessoa se vê e o que as respostas mostram), relações entre
// áreas, cartão por área com a conta à mostra, hábitos, sinais e fontes.

import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, HeartHandshake, Pencil } from 'lucide-react';
import { BodyAnswers, SIGNALS, SOURCES } from '../../lib/body/questions';
import { AreaScore, BodyQuality, activityCalc, buildReport, sleepCalc } from '../../lib/body/scoring';
import { AreaRadar, DigestionCharts, FoodCharts, MovementBar, PriorityMatrix, SleepTimeline, WellbeingGauge } from './BodyCharts';
import { Card, CardTitle, Eyebrow } from '../traditions/ui';

const LEVEL = {
  bom: { label: 'Bom', color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  medio: { label: 'Médio', color: '#d97706', bg: 'bg-amber-50', text: 'text-amber-800' },
  atencao: { label: 'Atenção', color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-800' }
} as const;

const STRENGTH = {
  forte: 'Evidência forte',
  moderada: 'Evidência moderada',
  possível: 'Relação possível'
} as const;

function Meter({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-2.5 rounded-full bg-gray-100" aria-hidden="true">
      <div className="h-2.5 rounded-full" style={{ width: `${Math.max(3, score)}%`, background: color }} />
    </div>
  );
}

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

function AreaCard({ area, extra, chart }: { area: AreaScore; extra?: ReactNode; chart?: ReactNode }) {
  const lv = LEVEL[area.level];
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow>{lv.label}</Eyebrow>
          <CardTitle>{area.label}</CardTitle>
        </div>
        <p className="m-0 text-3xl font-bold shrink-0" style={{ color: lv.color }}>
          {area.score}
        </p>
      </div>
      <Meter score={area.score} color={lv.color} />
      <p className="m-0 text-[15px] leading-relaxed text-gray-800">{area.summary}</p>
      {chart}
      {area.dimensions && (
        <ul className="m-0 p-0 list-none flex flex-col gap-2">
          {area.dimensions.map((d) => {
            const c = d.points === 2 ? LEVEL.bom : d.points === 1 ? LEVEL.medio : LEVEL.atencao;
            return (
              <li key={d.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} aria-hidden="true" />
                <span className="text-gray-800">
                  <strong>{d.label}</strong> <span className="text-gray-500">({c.label.toLowerCase()})</span>: {d.value}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {extra}
      <Details title={`Como chegamos a ${area.score}`}>
        {area.steps.map((s) => (
          <p key={s} className="m-0">
            {s}
          </p>
        ))}
        {area.dimensions && (
          <ul className="m-0 pl-5 list-disc">
            {area.dimensions.map((d) => (
              <li key={d.id}>
                <strong>{d.label}:</strong> {d.rule}
              </li>
            ))}
          </ul>
        )}
      </Details>
    </Card>
  );
}

export default function BodyReportView({ answers, quality }: { answers: BodyAnswers; quality?: BodyQuality }) {
  const r = useMemo(() => buildReport(answers), [answers]);
  const sleep = useMemo(() => sleepCalc(answers), [answers]);
  const activity = useMemo(() => activityCalc(answers), [answers]);
  const selfOf = (id: string) => {
    const p = r.priorities.find((x) => x.id === id);
    return p ? p.satisfaction * 10 : undefined;
  };
  const radarAxes = r.areas.map((a) => ({ label: a.label, measured: a.score, self: selfOf(a.id === 'bemestar' ? 'energia' : a.id) }));
  const area = (id: AreaScore['id']) => r.areas.find((a) => a.id === id);
  const top = r.priorities.filter((p) => p.importance >= 5 && p.weight > 0).slice(0, 3);
  const mismatches = r.priorities.filter((p) => p.mismatch);
  const signalLabels = r.signals.map((s) => SIGNALS.find((x) => x.value === s)?.label ?? s);

  const sitRiseText = (v?: number) =>
    v === undefined
      ? null
      : v >= 8
        ? 'Faixa de 8 a 10: nos estudos com adultos de meia-idade e idosos, é a faixa associada à maior sobrevida.'
        : v >= 6
          ? 'Faixa intermediária. Força de pernas, flexibilidade e equilíbrio são o que mais sobe essa nota.'
          : 'Nota baixa. Nos estudos, notas baixas se associam a mais risco; fortalecer pernas e tronco, com orientação, faz diferença.';
  const oneLegText = (v?: number) =>
    v === undefined
      ? null
      : v === 2
        ? 'Equilíbrio em um pé: conseguiu com as duas pernas.'
        : v === 1
          ? 'Equilíbrio em um pé: só de um lado. Vale treinar o lado mais fraco.'
          : 'Equilíbrio em um pé: não conseguiu. Em pessoas de 51 a 75 anos, isso se associou a mais risco em um estudo brasileiro; o equilíbrio melhora com treino.';

  return (
    <>
      {quality && !quality.ok && (
        <div role="note" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex gap-3 text-amber-900">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1.5 text-sm">
            <p className="m-0 font-semibold">Leia a parte de alimentação com cautela.</p>
            <ul className="m-0 pl-5 list-disc">
              {quality.issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {r.who5 <= 28 && (
        <div role="note" className="rounded-2xl border border-purple-200 bg-white p-5 flex gap-3 text-gray-800">
          <HeartHandshake className="w-6 h-6 shrink-0 mt-0.5 text-purple-600" aria-hidden="true" />
          <p className="m-0 text-sm leading-relaxed">
            Suas respostas de bem-estar indicam que as últimas duas semanas foram bem difíceis. Isso merece cuidado: vale conversar com um profissional de saúde
            ou com alguém de confiança. Se precisar falar agora, o CVV atende de graça, 24 horas, pelo telefone <strong>188</strong> ou em cvv.org.br.
          </p>
        </div>
      )}

      {/* Visão geral */}
      <Card>
        <Eyebrow>Visão geral</Eyebrow>
        <CardTitle>Cinco áreas, de 0 a 100</CardTitle>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
          <AreaRadar axes={radarAxes} />
          <div className="grid gap-x-6 gap-y-4">
            {r.areas.map((a) => {
              const lv = LEVEL[a.level];
              return (
                <div key={a.id} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-900">{a.label}</span>
                    <span className="text-sm">
                      <strong className="text-lg" style={{ color: lv.color }}>
                        {a.score}
                      </strong>{' '}
                      <span className="text-gray-500">· {lv.label.toLowerCase()}</span>
                    </span>
                  </div>
                  <Meter score={a.score} color={lv.color} />
                </div>
              );
            })}
            {r.composition && (
              <div className="flex flex-col gap-0.5 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Medidas</span>
                <span>
                  IMC {r.composition.bmi.toFixed(1).replace('.', ',')} ({r.composition.bmiLabel})
                </span>
                {r.composition.whtr !== undefined && (
                  <span>
                    Cintura/altura {r.composition.whtr.toFixed(2).replace('.', ',')} ({r.composition.whtrLabel})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="m-0 text-xs text-gray-500">
          Bom: 70 ou mais · Médio: 45 a 69 · Atenção: abaixo de 45. No bem-estar, o limite de atenção é 50, como no índice da OMS.
        </p>
      </Card>

      {/* Prioridades e contradições */}
      <Card>
        <Eyebrow>Você × suas respostas</Eyebrow>
        <CardTitle>Por onde começar</CardTitle>
        {top.length ? (
          <>
            <p className="m-0 text-[15px] leading-relaxed text-gray-800">
              Áreas importantes para você e com mais espaço para melhorar, pela sua própria avaliação:
            </p>
            <div className="grid gap-5 md:grid-cols-2 items-center">
              <PriorityMatrix items={r.priorities} />
              <ol className="m-0 pl-0 list-none flex flex-col gap-3">
              {r.priorities.map((p, i) => {
                const isTop = top.some((t) => t.id === p.id);
                return (
                  <li key={p.id} className={`flex items-start gap-3 ${isTop ? '' : 'opacity-60'}`}>
                    <span className="w-7 h-7 rounded-full bg-purple-600 text-white grid place-items-center text-sm font-bold shrink-0">{i + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 first-letter:uppercase">{p.label}</span>
                      <span className="text-sm text-gray-600">
                        Importância {p.importance}/10 · satisfação {p.satisfaction}/10
                        {p.measured !== undefined && ` · medido ${p.measured}/100`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            </div>
          </>
        ) : (
          <p className="m-0 text-[15px] text-gray-800">Você está satisfeito(a) com as áreas que considera importantes.</p>
        )}
        {mismatches.length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl bg-purple-50 p-4">
            <p className="m-0 text-sm font-semibold text-purple-900">Onde a sua impressão e as suas respostas não batem</p>
            <ul className="m-0 pl-5 list-disc text-sm text-gray-800 flex flex-col gap-1">
              {mismatches.map((p) => (
                <li key={p.id}>
                  <strong className="first-letter:uppercase inline-block">{p.label}</strong>: você se dá {p.satisfaction} de 10, e as respostas indicam{' '}
                  {p.measured} de 100.{' '}
                  {p.mismatch === 'se_ve_melhor'
                    ? 'Pode valer olhar essa área com mais atenção do que você imagina.'
                    : 'Talvez você esteja sendo mais exigente consigo do que os números mostram.'}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Details title="Como montamos esta ordem">
          <p className="m-0">Peso de cada área = importância × (10 − satisfação). Quanto mais importante e menos satisfeito(a), maior o peso.</p>
          <p className="m-0">Uma área aparece como “não bate” quando a sua nota de satisfação (× 10) e o escore medido diferem em 35 pontos ou mais.</p>
          <ul className="m-0 pl-5 list-disc">
            {r.priorities.map((p) => (
              <li key={p.id}>
                {p.label}: {p.importance} × (10 − {p.satisfaction}) = {p.weight}
              </li>
            ))}
          </ul>
        </Details>
      </Card>

      {/* Relações */}
      {r.relations.length > 0 && (
        <Card>
          <Eyebrow>O que conversa com o quê</Eyebrow>
          <CardTitle>Relações nas suas respostas</CardTitle>
          <ul className="m-0 p-0 list-none flex flex-col gap-3">
            {r.relations.map((x) => (
              <li key={x.id} className="rounded-xl border border-gray-200 p-4 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">{x.title}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${x.strength === 'forte' ? 'bg-emerald-50 text-emerald-800' : x.strength === 'moderada' ? 'bg-amber-50 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {STRENGTH[x.strength]}
                  </span>
                </div>
                <p className="m-0 text-sm text-gray-800">
                  <span className="text-gray-500">O que vimos:</span> {x.seen}
                </p>
                <p className="m-0 text-sm text-gray-800">
                  <span className="text-gray-500">O que a ciência diz:</span> {x.science}
                </p>
                {x.tradition && (
                  <p className="m-0 text-sm text-gray-800 rounded-lg bg-amber-50/70 border border-amber-100 px-3 py-2">
                    <span className="text-amber-800 font-semibold">Leitura da Medicina Tradicional Chinesa:</span> {x.tradition}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Áreas */}
      <div className="grid gap-5 md:grid-cols-2 items-start">
        {area('sono') && <AreaCard area={area('sono')!} chart={sleep && <SleepTimeline a={answers} c={sleep} />} />}
        <AreaCard
          area={area('movimento')!}
          chart={<MovementBar c={activity} />}
          extra={
            (r.fitness.sitRise !== undefined || r.fitness.oneLeg !== undefined) && (
              <div className="flex flex-col gap-1 text-sm text-gray-700 rounded-xl bg-gray-50 p-3">
                {r.fitness.sitRise !== undefined && (
                  <p className="m-0">
                    <strong>Sentar-Levantar:</strong> {sitRiseText(r.fitness.sitRise)}
                  </p>
                )}
                {r.fitness.oneLeg !== undefined && <p className="m-0">{oneLegText(r.fitness.oneLeg)}</p>}
              </div>
            )
          }
        />
        <AreaCard area={area('alimentacao')!} chart={<FoodCharts a={answers} />} />
        <AreaCard area={area('digestao')!} chart={<DigestionCharts a={answers} />} />
        <AreaCard area={area('bemestar')!} chart={<WellbeingGauge score={r.who5} />} />
        {r.composition && (
          <Card>
            <Eyebrow>Medidas</Eyebrow>
            <CardTitle>Composição</CardTitle>
            <ul className="m-0 pl-5 list-disc text-[15px] text-gray-800 flex flex-col gap-1">
              <li>
                IMC <strong>{r.composition.bmi.toFixed(1).replace('.', ',')}</strong>: {r.composition.bmiLabel}.
              </li>
              {r.composition.whtr !== undefined && (
                <li>
                  Cintura ÷ altura <strong>{r.composition.whtr.toFixed(2).replace('.', ',')}</strong>: {r.composition.whtrLabel}; cintura{' '}
                  {r.composition.waistLabel}.
                </li>
              )}
            </ul>
            <p className="m-0 text-sm text-gray-600">
              O IMC não separa músculo de gordura; a relação cintura/altura indica melhor a gordura na barriga, a mais ligada a risco.
            </p>
            <Details title="Como calculamos">
              {r.composition.steps.map((s) => (
                <p key={s} className="m-0">
                  {s}
                </p>
              ))}
            </Details>
          </Card>
        )}
      </div>

      {/* Hábitos e sinais */}
      <div className="grid gap-5 md:grid-cols-2 items-start">
        <Card>
          <Eyebrow>Hábitos</Eyebrow>
          <CardTitle>Pontos de atenção</CardTitle>
          {r.flags.length ? (
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
              {r.flags.map((f) => (
                <li key={f.id} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LEVEL[f.level].color }} aria-hidden="true" />
                  <span>
                    <strong className="text-gray-900">{f.label}.</strong> <span className="text-gray-700">{f.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-[15px] text-gray-800">Nenhum hábito de risco entre os que perguntamos.</p>
          )}
          {r.audit !== null && (
            <p className="m-0 text-xs text-gray-500">
              Álcool (AUDIT-C): {r.audit} de 12 pontos. A partir de {answers.sexo === 'F' ? 3 : 4} indica consumo de risco.
            </p>
          )}
        </Card>

        <Card>
          <Eyebrow>Sinais do corpo</Eyebrow>
          <CardTitle>{signalLabels.length ? 'Vale conversar com um profissional' : 'Nenhum sinal marcado'}</CardTitle>
          {signalLabels.length ? (
            <>
              <ul className="m-0 pl-5 list-disc text-[15px] text-gray-800 flex flex-col gap-1">
                {signalLabels.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="m-0 text-sm leading-relaxed text-gray-600">
                Cada um desses sinais tem muitas causas possíveis: alimentação, hormônios, pele, medicamentos, estresse. Sozinhos, eles não indicam uma
                deficiência específica. Um profissional pode avaliar com exames, se for o caso.
              </p>
            </>
          ) : (
            <p className="m-0 text-[15px] text-gray-800">Você não marcou nenhum dos sinais da lista nos últimos 3 meses.</p>
          )}
        </Card>
      </div>

      <Card>
        <Eyebrow>Sobre este resultado</Eyebrow>
        <CardTitle>De onde vêm as perguntas</CardTitle>
        <ul className="m-0 pl-5 list-disc text-sm leading-relaxed text-gray-700 flex flex-col gap-1.5">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <strong>{s.label}.</strong> {s.text}{' '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">
                fonte
              </a>
            </li>
          ))}
        </ul>
        <p className="m-0 text-sm text-gray-700">
          Os escores de 0 a 100 e as regras de cada área são do NeoSapiens e servem para você se acompanhar ao longo do tempo. Não são diagnóstico e não
          substituem consulta com profissional de saúde.
        </p>
        <Link
          href="/analysis/biohacking"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit"
        >
          <Pencil className="w-4 h-4" /> Rever minhas respostas <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    </>
  );
}
