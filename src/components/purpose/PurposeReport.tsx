// src/components/purpose/PurposeReport.tsx
// Resultado do Propósito: valores (hexágono), sentido de vida (quadrantes),
// o que você valoriza × como você vive (halteres), florescimento,
// leitura dos Cinco Espíritos (MTC) e a visão escrita pela pessoa.

import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { Pencil, Quote } from 'lucide-react';
import { AreaRadar } from '../body/BodyCharts';
import WuXingPentagram from '../traditions/WuXingPentagram';
import { Card, CardTitle, DarkPanel, Eyebrow } from '../traditions/ui';
import type { ChineseElement } from '../../lib/astro';
import { Answers, flourishScore, fmt, lifeAreas, mlqScore, shenProfile, valueProfile } from '../../lib/purpose/purpose';

const PURPLE = '#7c3aed';
const AMBER = '#d97706';
const GRID = '#e5e7eb';
const MUTED = '#6b7280';
const INK = '#111827';

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

const QUADRANT_TEXT = {
  tem_e_busca: 'Você sente que a sua vida tem sentido e continua buscando aprofundá-lo. É um perfil comum em quem está em crescimento ativo.',
  tem: 'Você sente que a sua vida tem sentido e não está à procura de outro. É o perfil associado a mais satisfação com a vida.',
  busca: 'Você está em busca: ainda não sente um sentido claro, mas está procurando. Essa procura é o primeiro movimento do propósito.',
  nenhum: 'Neste momento, você não sente um sentido claro nem está buscando um. Pode ser uma fase de cansaço; vale olhar para isso com carinho e, se pesar, conversar com alguém.'
} as const;

function MeaningQuadrant({ presence, search }: { presence: number; search: number }) {
  const S = 240;
  const m = 34;
  const x = (v: number) => m + ((v - 5) / 30) * (S - m - 8);
  const y = (v: number) => S - m - ((v - 5) / 30) * (S - m - 8);
  const cut = 24.5;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[300px]" role="img" aria-label={`Presença de sentido ${presence}, busca de sentido ${search}`}>
      <rect x={x(cut)} y={y(35)} width={x(35) - x(cut)} height={y(5) - y(35)} fill={PURPLE} opacity="0.06" />
      <line x1={x(cut)} y1={y(5)} x2={x(cut)} y2={y(35)} stroke={GRID} />
      <line x1={x(5)} y1={y(cut)} x2={x(35)} y2={y(cut)} stroke={GRID} />
      <rect x={x(5)} y={y(35)} width={x(35) - x(5)} height={y(5) - y(35)} fill="none" stroke={GRID} />
      {[
        { t: 'buscando', xx: (x(5) + x(cut)) / 2, yy: y(34) },
        { t: 'tem e busca', xx: (x(cut) + x(35)) / 2, yy: y(34) },
        { t: 'ainda não', xx: (x(5) + x(cut)) / 2, yy: y(6) },
        { t: 'tem sentido', xx: (x(cut) + x(35)) / 2, yy: y(6) }
      ].map((q) => (
        <text key={q.t} x={q.xx} y={q.yy + (q.t === 'ainda não' || q.t === 'tem sentido' ? -2 : 10)} textAnchor="middle" fontSize="10" fill={MUTED}>
          {q.t}
        </text>
      ))}
      <circle cx={x(presence)} cy={y(search)} r="7" fill={PURPLE} stroke="#fff" strokeWidth="2.5">
        <title>{`Presença ${presence}, busca ${search}`}</title>
      </circle>
      <text x={(x(5) + x(35)) / 2} y={S - 8} textAnchor="middle" fontSize="11" fill={INK}>
        presença de sentido →
      </text>
      <text x={12} y={(y(5) + y(35)) / 2} textAnchor="middle" fontSize="11" fill={INK} transform={`rotate(-90 12 ${(y(5) + y(35)) / 2})`}>
        busca de sentido →
      </text>
    </svg>
  );
}

function Dumbbells({ areas }: { areas: { id: string; label: string; importance: number; coherence: number; gap: number }[] }) {
  const W = 360;
  const L = 138;
  const row = 28;
  const H = areas.length * row + 26;
  const x = (v: number) => L + ((v - 1) / 9) * (W - L - 12);
  return (
    <figure className="m-0 flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Importância e coerência por área da vida">
        {[1, 5, 10].map((v) => (
          <g key={v}>
            <line x1={x(v)} y1="4" x2={x(v)} y2={H - 20} stroke={GRID} />
            <text x={x(v)} y={H - 6} textAnchor="middle" fontSize="10" fill={MUTED}>
              {v}
            </text>
          </g>
        ))}
        {areas.map((a, i) => {
          const cy = 16 + i * row;
          const big = a.gap >= 3;
          return (
            <g key={a.id}>
              <text x={L - 8} y={cy + 4} textAnchor="end" fontSize="11.5" fontWeight={big ? 700 : 500} fill={INK}>
                {a.label}
              </text>
              <line x1={x(Math.min(a.importance, a.coherence))} y1={cy} x2={x(Math.max(a.importance, a.coherence))} y2={cy} stroke={big ? AMBER : '#c4b5fd'} strokeWidth="3" strokeLinecap="round" />
              <circle cx={x(a.coherence)} cy={cy} r="6" fill="#fff" stroke={AMBER} strokeWidth="2.5">
                <title>{`${a.label}: vivi de acordo ${a.coherence}`}</title>
              </circle>
              <circle cx={x(a.importance)} cy={cy} r="6" fill={PURPLE} stroke="#fff" strokeWidth="2">
                <title>{`${a.label}: importância ${a.importance}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: PURPLE }} /> Importância
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: AMBER }} /> Quanto viveu de acordo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-[3px] rounded" style={{ background: AMBER }} /> Distância de 3 ou mais
        </span>
      </div>
    </figure>
  );
}

const SHEN_TO_ELEMENT: Record<string, ChineseElement> = { Madeira: 'Madeira', Fogo: 'Fogo', Terra: 'Terra', Metal: 'Metal', Água: 'Água' };

export default function PurposeReport({ answers }: { answers: Answers }) {
  const values = useMemo(() => valueProfile(answers), [answers]);
  const mlq = useMemo(() => mlqScore(answers), [answers]);
  const life = useMemo(() => lifeAreas(answers), [answers]);
  const flourish = useMemo(() => flourishScore(answers), [answers]);
  const shen = useMemo(() => shenProfile(answers), [answers]);
  const sortedAreas = life ? [...life.areas].sort((p, q) => q.gap - p.gap) : [];
  const bigGaps = sortedAreas.filter((x) => x.gap >= 3);
  const aligned = life ? life.areas.filter((x) => x.importance >= 8 && Math.abs(x.gap) <= 1) : [];
  const topGroups = values ? values.groups.filter((g) => values.top.includes(g.id)) : [];
  const shenSorted = shen ? [...shen].sort((p, q) => q.value - p.value) : [];
  const dia = typeof answers.meta_dia === 'string' ? answers.meta_dia.trim() : '';
  const legado = typeof answers.meta_legado === 'string' ? answers.meta_legado.trim() : '';

  return (
    <>
      {/* Potencial: valores */}
      {values && (
        <Card>
          <Eyebrow>Potencial · o que move você</Eyebrow>
          <CardTitle>Seus valores</CardTitle>
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <AreaRadar single label="Hexágono dos valores" axes={values.groups.map((g) => ({ label: g.label, measured: g.score }))} />
            <div className="flex flex-col gap-3">
              <p className="m-0 text-[15px] leading-relaxed text-gray-800">
                O que mais orienta você, <strong>em relação à sua própria média</strong>, é{' '}
                {topGroups.map((g, i) => (
                  <span key={g.id}>
                    {i > 0 && ' e '}
                    <strong>{g.label.toLowerCase()}</strong> ({g.desc})
                  </span>
                ))}
                .
              </p>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-600">Os cinco valores que você mais marcou</span>
                <div className="flex flex-wrap gap-1.5">
                  {values.topItems.map((t) => (
                    <span key={t.name} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 text-sm">
                      {t.name} · {t.value}
                    </span>
                  ))}
                </div>
              </div>
              <p className="m-0 text-sm text-gray-600">
                Muita gente marca quase tudo como importante; por isso olhamos para o que se destaca acima da sua média ({fmt(values.overall)} de 7).
              </p>
            </div>
          </div>
          <Details title="Como calculamos">
            <p className="m-0">18 valores, de 1 a 7, em 6 grupos de 3. Cada grupo é a média dos seus 3 valores, levada para 0 a 100: (média − 1) ÷ 6 × 100.</p>
            <ul className="m-0 pl-5 list-disc">
              {values.groups.map((g) => (
                <li key={g.id}>
                  {g.label}: média {fmt(g.mean)} → {g.score}; em relação à sua média, {g.relative >= 0 ? '+' : '−'}
                  {fmt(Math.abs(g.relative))}
                </li>
              ))}
            </ul>
          </Details>
        </Card>
      )}

      {/* Estado atual */}
      <div className="grid gap-5 md:grid-cols-2 items-start">
        {mlq && (
          <Card>
            <Eyebrow>Estado atual</Eyebrow>
            <CardTitle>Sentido de vida</CardTitle>
            <MeaningQuadrant presence={mlq.presence} search={mlq.search} />
            <p className="m-0 text-[15px] leading-relaxed text-gray-800">{QUADRANT_TEXT[mlq.quadrant]}</p>
            <p className="m-0 text-sm text-gray-600">
              Presença de sentido: <strong>{mlq.presence}</strong> de 35 · busca: <strong>{mlq.search}</strong> de 35.
            </p>
            <Details title="Como calculamos">
              {mlq.steps.map((s) => (
                <p key={s} className="m-0">
                  {s}
                </p>
              ))}
            </Details>
          </Card>
        )}
        {flourish && (
          <Card>
            <Eyebrow>Estado atual</Eyebrow>
            <CardTitle>Florescimento</CardTitle>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Relações, propósito, competência e otimismo</span>
                <span className="font-semibold text-gray-900">{flourish.total} de 56</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100">
                <div className="h-3 rounded-full" style={{ width: `${flourish.score}%`, background: flourish.score >= 70 ? '#059669' : flourish.score >= 45 ? AMBER : '#e11d48' }} />
              </div>
            </div>
            <p className="m-0 text-[15px] leading-relaxed text-gray-800">
              {flourish.score >= 70
                ? 'Você se vê florescendo: com propósito, boas relações e confiança no que faz.'
                : flourish.score >= 45
                  ? 'Algumas áreas florescem e outras pedem mais cuidado. As frases com nota mais baixa mostram por onde começar.'
                  : 'Neste momento, você se vê pouco florescendo. Vale olhar com carinho para relações, sentido e o que traz energia.'}
            </p>
            <Details title="Como calculamos">
              <p className="m-0">8 frases de 1 a 7, somadas (8 a 56). Na escala de 0 a 100: (soma ÷ 8 − 1) ÷ 6 × 100 = {flourish.score}.</p>
            </Details>
          </Card>
        )}
      </div>

      {/* Contradição: valoriza × vive */}
      {life && (
        <Card>
          <Eyebrow>Você × sua vida</Eyebrow>
          <CardTitle>O que você valoriza × como você vive</CardTitle>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            <Dumbbells areas={sortedAreas} />
            <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-800">
              {bigGaps.length ? (
                <p className="m-0">
                  Onde o que importa e o que você vive mais se afastam: <strong>{bigGaps.map((x) => x.label.toLowerCase()).join(', ')}</strong>. É aí que mora a maior energia
                  para mudança.
                </p>
              ) : (
                <p className="m-0">Em nenhuma área a distância entre o que importa e o que você vive chegou a 3 pontos.</p>
              )}
              {aligned.length > 0 && (
                <p className="m-0">
                  Em <strong>{aligned.map((x) => x.label.toLowerCase()).join(', ')}</strong>, o que é muito importante e o que você vive estão alinhados.
                </p>
              )}
              <p className="m-0 text-sm text-gray-600">
                Índice de vida valorizada: <strong>{life.composite}</strong> (de 1 a 100).
              </p>
            </div>
          </div>
          <Details title="Como calculamos">
            <p className="m-0">Distância = importância − quanto viveu de acordo. As áreas estão em ordem da maior para a menor distância.</p>
            <p className="m-0">
              Índice de vida valorizada = média de (importância × quanto viveu de acordo) nas 10 áreas, como no método de Wilson e colegas (2010). Quanto mais alto,
              mais a vida segue o que importa.
            </p>
            <ul className="m-0 pl-5 list-disc">
              {sortedAreas.map((x) => (
                <li key={x.id}>
                  {x.label}: {x.importance} − {x.coherence} = {x.gap}
                </li>
              ))}
            </ul>
          </Details>
        </Card>
      )}

      {/* Meta */}
      {(dia || legado) && (
        <Card>
          <Eyebrow>Meta · para onde você quer ir</Eyebrow>
          <CardTitle>Sua visão</CardTitle>
          {dia && (
            <blockquote className="m-0 flex gap-3 rounded-xl bg-purple-50 p-4 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
              <Quote className="w-5 h-5 shrink-0 text-purple-400" aria-hidden="true" />
              <span>{dia}</span>
            </blockquote>
          )}
          {legado && (
            <p className="m-0 text-lg text-indigo-950" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              <strong>O que você quer deixar no mundo:</strong> {legado}
            </p>
          )}
          <p className="m-0 text-sm text-gray-600">Estas palavras são suas e vão orientar a sua Primeira Jornada, quando juntarmos todas as dimensões.</p>
        </Card>
      )}

      {/* Tradição: Cinco Espíritos */}
      {shen && (
        <DarkPanel label="Os Cinco Espíritos" className="p-5 sm:p-6">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-200">Leitura da Medicina Tradicional Chinesa</p>
          <CardTitle dark>Os Cinco Espíritos · Wǔ Shén</CardTitle>
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <WuXingPentagram elements={Object.fromEntries(shen.map((s) => [SHEN_TO_ELEMENT[s.element], s.value])) as Record<ChineseElement, number>} />
            <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-purple-50">
              <p className="m-0">
                Na MTC, cada órgão abriga um aspecto do espírito, e o propósito nasce do equilíbrio entre eles. O tamanho de cada círculo mostra a sua resposta, de 1 a 5.
              </p>
              <ul className="m-0 pl-0 list-none flex flex-col gap-2">
                {shenSorted.map((s) => (
                  <li key={s.id} className="flex gap-2">
                    <strong className="w-24 shrink-0 text-amber-100">
                      {s.spirit} · {s.value}
                    </strong>
                    <span>
                      {s.aspect} ({s.element}, {s.organ})
                    </span>
                  </li>
                ))}
              </ul>
              <p className="m-0 text-purple-100">
                O espírito mais presente hoje é o <strong>{shenSorted[0].spirit}</strong> ({shenSorted[0].aspect}); o que mais pede atenção é o{' '}
                <strong>{shenSorted[shenSorted.length - 1].spirit}</strong> ({shenSorted[shenSorted.length - 1].aspect}). Para a MTC, fortalecer o elemento{' '}
                {shenSorted[shenSorted.length - 1].element} ajuda a sustentar esse aspecto.
              </p>
              <p className="m-0 text-xs text-purple-200">Esta é uma leitura da tradição, não uma medida científica.</p>
            </div>
          </div>
        </DarkPanel>
      )}

      <Card>
        <Eyebrow>Sobre este resultado</Eyebrow>
        <CardTitle>De onde vêm as perguntas</CardTitle>
        <ul className="m-0 pl-5 list-disc text-sm leading-relaxed text-gray-700 flex flex-col gap-1.5">
          <li>
            <strong>Valores:</strong> frases do NeoSapiens inspiradas na teoria funcionalista dos valores humanos, de Valdiney Gouveia (UFPB), com seus 6 grupos. Não é o
            Questionário dos Valores Básicos oficial.
          </li>
          <li>
            <strong>Sentido de vida:</strong> Meaning in Life Questionnaire (Steger, Frazier, Oishi e Kaler, 2006), tradução do NeoSapiens.
          </li>
          <li>
            <strong>O que você valoriza × como você vive:</strong> perguntas próprias, seguindo o método do Valued Living Questionnaire (Wilson e colegas, 2010).
          </li>
          <li>
            <strong>Florescimento:</strong> Flourishing Scale (Diener e colegas, 2010), usada com crédito aos autores.
          </li>
          <li>
            <strong>Cinco Espíritos:</strong> leitura da Medicina Tradicional Chinesa, com frases do NeoSapiens.
          </li>
        </ul>
        <p className="m-0 text-sm text-gray-700">Não é avaliação psicológica nem diagnóstico. É um retrato para você se conhecer e acompanhar ao longo do tempo.</p>
        <Link href="/analysis/purpose" className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit">
          <Pencil className="w-4 h-4" /> Rever minhas respostas
        </Link>
      </Card>
    </>
  );
}

