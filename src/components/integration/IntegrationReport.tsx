// src/components/integration/IntegrationReport.tsx
// O Mapa NeoSapiens: radar de 12 eixos por pilar, mapa das contradições,
// ressonâncias entre módulos e o que as tradições repetem.

import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Repeat, Scale, Sparkles } from 'lucide-react';
import { Card, CardTitle, DarkPanel, Eyebrow } from '../traditions/ui';
import ElementStar from './ElementStar';
import ResonanceWeb from './ResonanceWeb';
import { Contradiction, PILLARS, Pillar, RadarAxis, Sources, compute, contradictions, elementMentions, radarAxes, resonanceNodes, resonances, traditionThemes, windRootPattern } from '../../lib/integration/integration';

const GRID = '#e5e7eb';
const INK = '#111827';
const MUTED = '#6b7280';
const PURPLE = '#7c3aed';
const level = (v: number) => (v >= 70 ? '#059669' : v >= 45 ? '#d97706' : '#e11d48');
const pillarOf = (p: Pillar) => PILLARS.find((x) => x.id === p)!;

function DarkDetails({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-white/15 bg-white/[0.03] text-sm">
      <summary className="cursor-pointer list-none px-4 min-h-[44px] flex items-center justify-between font-semibold text-amber-100">
        {title}
        <span className="text-purple-300 group-open:rotate-180 transition-transform" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="px-4 pb-4 flex flex-col gap-2">{children}</div>
    </details>
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

/** Radar de 12 eixos com os setores de cada pilar coloridos */
function NeoRadar({ axes }: { axes: RadarAxis[] }) {
  const S = 340;
  const c = S / 2;
  const R = 118;
  const n = axes.length;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, v: number) => [c + Math.cos(ang(i)) * (R * v) / 100, c + Math.sin(ang(i)) * (R * v) / 100];
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');
  const wedge = (i0: number, i1: number) => {
    const a0 = ang(i0) - Math.PI / n;
    const a1 = ang(i1) + Math.PI / n;
    const r = R + 6;
    return `M${c},${c} L${c + Math.cos(a0) * r},${c + Math.sin(a0) * r} A${r},${r} 0 0 1 ${c + Math.cos(a1) * r},${c + Math.sin(a1) * r} Z`;
  };
  const groups = PILLARS.map((p) => ({ p, idx: axes.map((a, i) => (a.pillar === p.id ? i : -1)).filter((i) => i >= 0) })).filter((g) => g.idx.length);

  return (
    <svg viewBox={`-110 -24 ${S + 220} ${S + 48}`} className="w-full max-w-[560px] mx-auto" role="img" aria-label="Radar NeoSapiens de 12 eixos">
      {groups.map((g) => (
        <path key={g.p.id} d={wedge(g.idx[0], g.idx[g.idx.length - 1])} fill={g.p.color} opacity="0.06" />
      ))}
      {[25, 50, 75, 100].map((r) => (
        <polygon key={r} points={poly(axes.map(() => r))} fill="none" stroke={GRID} strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke={GRID} strokeWidth="1" />;
      })}
      <polygon points={poly(axes.map((a) => a.value ?? 0))} fill={PURPLE} fillOpacity="0.14" stroke={PURPLE} strokeWidth="2.5" strokeLinejoin="round" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.value ?? 0);
        const col = pillarOf(a.pillar).color;
        return (
          <circle key={a.id} cx={x} cy={y} r="5.5" fill={col} stroke="#fff" strokeWidth="2">
            <title>{`${a.label}: ${a.value ?? 'sem dados'}`}</title>
          </circle>
        );
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 122);
        const anchor = Math.abs(x - c) < 10 ? 'middle' : x > c ? 'start' : 'end';
        return (
          <text key={`l${a.id}`} x={x} y={y - 6} textAnchor={anchor} dominantBaseline="middle" fontSize="14" fill={INK}>
            <tspan fontWeight="600" fill={pillarOf(a.pillar).color}>
              {a.label}
            </tspan>
            <tspan x={x} dy="17" fill={MUTED} fontSize="13">
              {a.value ?? '–'}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

const MODULE_COLOR: Record<Contradiction['module'], string> = {
  Personalidade: '#db2777',
  Corpo: '#059669',
  Mente: '#2563eb',
  Propósito: '#7c3aed'
};
const WANT = '#d97706';
/** Nome curto para o eixo: a primeira palavra quando o nome é longo */
const shortAxis = (a: string) => (a.length > 13 ? a.split(' ')[0] : a);

/** Radar das contradições: o que a pessoa quer ou acredita × o que as respostas mostram */
function ContradictionRadar({ items }: { items: Contradiction[] }) {
  const [sel, setSel] = useState(0);
  const S = 340;
  const c = S / 2;
  const R = 118;
  const n = items.length;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, v: number) => [c + Math.cos(ang(i)) * (R * v) / 100, c + Math.sin(ang(i)) * (R * v) / 100];
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, Math.max(2, v)).join(',')).join(' ');
  const x = items[sel];

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
      <svg viewBox={`-120 -26 ${S + 240} ${S + 52}`} className="w-full max-w-[540px] mx-auto touch-manipulation" role="img" aria-label="Radar das contradições">
        {[25, 50, 75, 100].map((r) => (
          <polygon key={r} points={poly(items.map(() => r))} fill="none" stroke={GRID} strokeWidth="1" />
        ))}
        {items.map((it, i) => {
          const [ex, ey] = pt(i, 100);
          return <line key={it.id} x1={c} y1={c} x2={ex} y2={ey} stroke={i === sel ? '#a78bfa' : GRID} strokeWidth={i === sel ? 2 : 1} />;
        })}
        <polygon points={poly(items.map((it) => it.is))} fill={PURPLE} fillOpacity="0.14" stroke={PURPLE} strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points={poly(items.map((it) => it.want))} fill="none" stroke={WANT} strokeWidth="2.5" strokeDasharray="6 4" strokeLinejoin="round" />
        {items.map((it, i) => {
          const [ix, iy] = pt(i, Math.max(2, it.is));
          const [wx, wy] = pt(i, Math.max(2, it.want));
          const on = i === sel;
          return (
            <g key={`p${it.id}`}>
              <line x1={ix} y1={iy} x2={wx} y2={wy} stroke={on ? INK : 'transparent'} strokeWidth="1.5" />
              <circle cx={ix} cy={iy} r={on ? 7 : 5} fill={PURPLE} stroke="#fff" strokeWidth="2" />
              <circle cx={wx} cy={wy} r={on ? 7 : 5} fill="#fff" stroke={WANT} strokeWidth="2.5" />
            </g>
          );
        })}
        {items.map((it, i) => {
          const [lx, ly] = pt(i, 122);
          const anchor = Math.abs(lx - c) < 10 ? 'middle' : lx > c ? 'start' : 'end';
          const on = i === sel;
          return (
            <text
              key={`l${it.id}`}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={on ? 17 : 16}
              fontWeight={on ? 700 : 600}
              fill={MODULE_COLOR[it.module]}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setSel(i)}
              onClick={() => setSel(i)}
            >
              {i + 1}. {shortAxis(it.axis)}
            </text>
          );
        })}
        {/* Áreas de toque largas sobre cada eixo */}
        {items.map((it, i) => {
          const a0 = ang(i) - Math.PI / n;
          const a1 = ang(i) + Math.PI / n;
          const r = R + 10;
          return (
            <path
              key={`h${it.id}`}
              d={`M${c},${c} L${c + Math.cos(a0) * r},${c + Math.sin(a0) * r} A${r},${r} 0 0 1 ${c + Math.cos(a1) * r},${c + Math.sin(a1) * r} Z`}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setSel(i)}
              onClick={() => setSel(i)}
            >
              <title>{`${it.axis}: ${it.wantLabel} ${it.want}, ${it.isLabel} ${it.is}`}</title>
            </path>
          );
        })}
      </svg>

      <div className="flex flex-col gap-3" aria-live="polite">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-[3px] bg-white" style={{ borderColor: WANT }} /> O que você quer ou acredita
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: PURPLE }} /> O que as respostas mostram
          </span>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: MODULE_COLOR[x.module] }}>
              {x.module}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">{KIND_LABEL[x.kind]}</span>
          </div>
          <p className="m-0 text-lg font-semibold text-gray-900 leading-snug">
            {sel + 1}. {x.title}
          </p>
          <p className="m-0 text-sm text-gray-700">{x.detail}</p>
          {[
            { l: x.wantLabel, v: x.want, color: WANT },
            { l: x.isLabel, v: x.is, color: PURPLE }
          ].map((b) => (
            <div key={b.l} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 first-letter:uppercase">{b.l}</span>
                <span className="font-semibold text-gray-900">{b.v}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full" style={{ width: `${Math.max(3, b.v)}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Escolher contradição">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              role="tab"
              aria-selected={i === sel}
              onClick={() => setSel(i)}
              className={`w-9 h-9 rounded-full text-sm font-bold ${i === sel ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="m-0 text-xs text-gray-500">Passe o mouse ou toque em cada ponta do radar, ou nos números, para ver o comentário.</p>
      </div>
    </div>
  );
}

const KIND_LABEL = {
  quer_mudar: 'Quer mudar',
  se_ve_melhor: 'Se vê melhor',
  se_ve_pior: 'Se cobra mais',
  valoriza_nao_vive: 'Valoriza e não vive'
} as const;

const RES_KIND = {
  cascata: { label: 'Efeito cascata', cls: 'bg-rose-50 text-rose-800' },
  forca: { label: 'Força', cls: 'bg-emerald-50 text-emerald-800' },
  tensao: { label: 'Tensão', cls: 'bg-amber-50 text-amber-800' }
} as const;

const STRENGTH = { forte: 'Evidência forte', moderada: 'Evidência moderada', possível: 'Relação possível' } as const;

export default function IntegrationReport({ sources }: { sources: Sources }) {
  const c = useMemo(() => compute(sources), [sources]);
  const axes = useMemo(() => radarAxes(sources, c), [sources, c]);
  const contra = useMemo(() => contradictions(c), [c]);
  const reson = useMemo(() => resonances(sources, c), [sources, c]);
  const resNodes = useMemo(() => resonanceNodes(sources, c), [sources, c]);
  const mentions = useMemo(() => elementMentions(sources, c), [sources, c]);
  const themes = useMemo(() => traditionThemes(sources), [sources]);
  const windRoot = useMemo(() => windRootPattern(mentions, c, sources), [mentions, c, sources]);
  const filled = axes.filter((a) => a.value !== null);
  const pillarAvg = (p: Pillar) => {
    const v = axes.filter((a) => a.pillar === p && a.value !== null).map((a) => a.value as number);
    return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length) : null;
  };

  return (
    <>
      {/* Camada 1: Radar */}
      <Card>
        <Eyebrow>Camada 1 · onde você está</Eyebrow>
        <CardTitle>O Radar NeoSapiens</CardTitle>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          Doze eixos em três pilares, cada um calculado a partir dos módulos que você respondeu. Quanto mais para fora, melhor.
        </p>
        {filled.length >= 3 ? <NeoRadar axes={axes} /> : <p className="m-0 text-sm text-gray-600">Responda mais módulos para formar o radar.</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p) => {
            const v = pillarAvg(p.id);
            return (
              <div key={p.id} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold" style={{ color: p.color }}>
                    {p.emoji} {p.label}
                  </span>
                  <span className="text-2xl font-bold" style={{ color: v === null ? '#9ca3af' : level(v) }}>
                    {v ?? '–'}
                  </span>
                </div>
                {axes
                  .filter((a) => a.pillar === p.id)
                  .map((a) => (
                    <div key={a.id} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">{a.label}</span>
                        <span className="font-semibold text-gray-900">{a.value ?? '–'}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        {a.value !== null && <div className="h-1.5 rounded-full" style={{ width: `${Math.max(3, a.value)}%`, background: p.color }} />}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
        <Details title="De onde vem cada eixo">
          <ul className="m-0 pl-5 list-disc">
            {axes.map((a) => (
              <li key={a.id}>
                <strong>{a.label}</strong> ({pillarOf(a.pillar).label}): {a.from}. {a.value === null ? 'Ainda sem dados.' : `Valor ${a.value}.`}
              </li>
            ))}
          </ul>
          <p className="m-0">Quando um eixo junta duas medidas, usamos a média das que existem. Cada pilar é a média dos seus eixos.</p>
        </Details>
      </Card>

      {/* Camada 2: Contradições */}
      <Card>
        <div className="flex items-start gap-3">
          <Scale className="w-7 h-7 text-purple-600 shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <Eyebrow>Camada 2 · você × suas respostas</Eyebrow>
            <CardTitle>O Mapa das Contradições</CardTitle>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          Todas as distâncias entre o que você diz e o que as respostas mostram, juntas e da maior para a menor. É nelas que mora a energia para mudar.
        </p>
        {contra.length >= 3 ? (
          <>
            <ContradictionRadar items={contra.slice(0, 10)} />
            <Details title={`Ver em lista${contra.length > 10 ? ` (todas as ${contra.length})` : ''}`}>
          <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
            {contra.map((x, i) => (
              <li key={x.id} className="flex gap-3 rounded-xl border border-gray-200 p-3.5">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white grid place-items-center text-sm font-bold shrink-0">{i + 1}</span>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{x.title}</span>
                  </div>
                  <span className="text-sm text-gray-700">{x.detail}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{x.module}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">{KIND_LABEL[x.kind]}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center w-28 shrink-0">
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: `${Math.min(100, x.size)}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
            </Details>
          </>
        ) : contra.length ? (
          <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
            {contra.map((x, i) => (
              <li key={x.id} className="flex gap-3 rounded-xl border border-gray-200 p-3.5">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white grid place-items-center text-sm font-bold shrink-0">{i + 1}</span>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{x.title}</span>
                  </div>
                  <span className="text-sm text-gray-700">{x.detail}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{x.module}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">{KIND_LABEL[x.kind]}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center w-28 shrink-0">
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: `${Math.min(100, x.size)}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="m-0 text-[15px] text-gray-800">Nenhuma contradição grande apareceu: o que você diz e o que as respostas mostram estão próximos.</p>
        )}
        <Details title="Como juntamos">
          <p className="m-0">Personalidade: hoje × como gostaria de ser, distâncias de 16 pontos ou mais. Corpo: sua nota de satisfação (× 10) × o escore medido, diferença de 35 ou mais.</p>
          <p className="m-0">Mente: a nota que você se deu (× 10) × o teste, diferença de 30 ou mais. Propósito: importância × quanto viveu de acordo, distância de 3 ou mais (× 11 para ficar na mesma escala).</p>
        </Details>
      </Card>

      {/* Camada 3: Ressonâncias */}
      <Card>
        <div className="flex items-start gap-3">
          <Layers className="w-7 h-7 text-purple-600 shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <Eyebrow>Camada 3 · o que conversa com o quê</Eyebrow>
            <CardTitle>Ressonâncias entre os módulos</CardTitle>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">Padrões que aparecem em mais de um lugar ao mesmo tempo, com a força da evidência por trás.</p>
        {reson.length ? (
          <ResonanceWeb nodes={resNodes} items={reson} />
        ) : (
          <p className="m-0 text-[15px] text-gray-800">Nenhum padrão entre módulos chamou atenção com os dados de agora.</p>
        )}
      </Card>

      {/* Camada 4: Tradições */}
      <DarkPanel label="O que as tradições repetem" className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Repeat className="w-7 h-7 text-amber-200 shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-200">Camada 4 · leitura das tradições</p>
            <CardTitle dark>O que as tradições repetem</CardTitle>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-purple-50">
          Na leitura tradicional, o que importa é a repetição: quando o mesmo elemento aparece em fontes diferentes (o mapa natal, o mapa chinês, a numerologia, os Cinco
          Espíritos, o relógio dos órgãos, a digestão), ele merece atenção.
        </p>
        {mentions.length > 0 ? (
          <ElementStar mentions={mentions} />
        ) : (
          <p className="m-0 text-sm text-purple-100">Ainda não há leituras das tradições para montar a estrela.</p>
        )}
        {windRoot && (
          <div className="rounded-2xl border border-amber-200/30 bg-amber-200/[0.07] p-4 sm:p-5 flex flex-col gap-2 text-[15px] leading-relaxed text-purple-50">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-200">Padrão das tradições</p>
            <p className="m-0 text-xl font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Muito vento, pouca raiz
            </p>
            <p className="m-0">
              {`Ar e Madeira aparecem em destaque (${windRoot.windSources.join(', ').toLowerCase()}), e a Terra pede atenção em ${windRoot.rootSources.length} fontes (${windRoot.rootSources.join(', ').toLowerCase()}).`}{' '}
              A imagem é a de uma árvore de copa grande e raízes rasas: muita expansão, ideias e movimento, e pouca
              base para sustentá-los.
            </p>
            <p className="m-0">
              Na Medicina Tradicional Chinesa, a Madeira sem a Terra que a nutre e enraíza tende a gerar <strong>vento interno</strong>, que se expressa como inquietude e
              oscilação emocional. Para a tradição, o caminho é fortalecer a Terra: rotina, refeições regulares, presença no corpo e no lugar onde se vive.
            </p>
            {windRoot.woodWake && (
              <p className="m-0">
                E você costuma acordar <strong>{windRoot.woodWake}</strong>. Para a MTC, é o mesmo quadro: quando o Fígado não consegue ancorar a Madeira à noite, o vento
                sobe e acorda a pessoa sempre na mesma hora.
              </p>
            )}
            {typeof windRoot.stability === 'number' && (
              <p className="m-0 text-purple-100">
                Na sua avaliação de personalidade, a estabilidade emocional ficou em <strong>{windRoot.stability}</strong> de 100. Vale observar se esta imagem conversa
                com você.
              </p>
            )}
          </div>
        )}
        {themes.length > 0 && (
          <DarkDetails title="Os três temas: o que cada tradição confirma">
            <div className="grid gap-3 md:grid-cols-3">
              {themes.map((t) => (
                <div key={t.id} className="rounded-xl bg-white/[0.06] border border-white/10 p-3.5 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-white">{t.title}</span>
                    <span className="text-xs text-amber-100 whitespace-nowrap">{t.strength} de 3</span>
                  </div>
                  {[
                    { l: 'Mapa natal', e: t.western },
                    { l: 'Mapa chinês', e: t.chinese },
                    { l: 'Numerologia', e: t.numerology }
                  ].map((x) => (
                    <div key={x.l} className="flex gap-2 text-xs text-purple-100">
                      <span className={`w-4 shrink-0 font-bold ${x.e.supports ? 'text-emerald-300' : 'text-purple-300/60'}`} aria-label={x.e.supports ? 'confirma' : 'não confirma'}>
                        {x.e.supports ? '✓' : '·'}
                      </span>
                      <span>
                        <strong className="text-purple-50">{x.l}:</strong> {x.e.text}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </DarkDetails>
        )}
        {mentions.length > 0 && (
          <DarkDetails title="O que cada fonte diz">
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from(new Set(mentions.map((m) => m.source))).map((src) => (
                <div key={src} className="rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-purple-100">
                  <strong className="text-amber-100">{src}</strong>
                  <ul className="m-0 mt-1 pl-0 list-none flex flex-col gap-0.5">
                    {mentions
                      .filter((m) => m.source === src)
                      .map((m, k) => (
                        <li key={k} className="flex gap-2">
                          <span className={m.sign === 'forte' ? 'text-emerald-300' : 'text-amber-300'} aria-hidden="true">
                            {m.sign === 'forte' ? '▲' : '▼'}
                          </span>
                          <span>
                            <strong className="text-purple-50">{m.element}</strong>: {m.note}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="m-0 text-xs text-purple-200">▲ aparece com força · ▼ pede atenção</p>
          </DarkDetails>
        )}
        <p className="m-0 text-xs text-purple-200">Leitura das tradições (astrologia ocidental, astrologia chinesa, numerologia e Medicina Tradicional Chinesa), separada das medidas científicas das camadas anteriores.</p>
      </DarkPanel>

      <Card>
        <div className="flex items-start gap-3">
          <Sparkles className="w-7 h-7 text-purple-600 shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <Eyebrow>Próximo passo</Eyebrow>
            <CardTitle>O Plano de Voo</CardTitle>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          A partir deste mapa, a Bússola sugere os rumos com mais força para mudar agora. Você escolhe um e faz um Voo de Experiência de 7 dias, com uma ou duas
          práticas pequenas e um diário de bordo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/voo" className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
            Abrir a Bússola <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/results" className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit">
            Resultados de cada módulo
          </Link>
        </div>
      </Card>
    </>
  );
}
