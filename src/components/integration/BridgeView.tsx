// src/components/integration/BridgeView.tsx
// A Ponte: ciência e tradições lado a lado, sem misturar os números.
// Parte 1: estrela de elementos com cada círculo partido ao meio
//   (metade esquerda = tradições, metade direita = medidas).
// Parte 2: personalidade (Mini-IPIP) × o que signos e números sugerem.

import { useMemo, useState } from 'react';
import type { ChineseElement } from '../../lib/astro';
import { ELEMENT_HAN } from '../../lib/astro';
import type { ElementMention } from '../../lib/integration/integration';
import { ElementBridge, MIN_MEASURES, TraitBridge, VERDICT_LABEL, Verdict } from '../../lib/integration/bridge';

const TRAD_COLOR = { forte: '#059669', atencao: '#d97706', misto: '#8b5cf6' } as const;
const TRAD_SYMBOL = { forte: '▲', atencao: '▼', misto: '◆' } as const;
const TRAD_LABEL = { forte: 'aparece como força', atencao: 'pede atenção', misto: 'força e atenção' } as const;
const level = (v: number) => (v >= 70 ? '#059669' : v >= 45 ? '#d97706' : '#e11d48');
const EMPTY = '#e5e7eb';
const GOLD = '#b45309';

type AnyVerdict = Verdict | 'dividida';
const V_STYLE: Record<AnyVerdict, { cls: string; icon: string; label: string }> = {
  converge: { cls: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '✓', label: VERDICT_LABEL.converge },
  diverge: { cls: 'bg-rose-50 text-rose-800 border-rose-200', icon: '✕', label: VERDICT_LABEL.diverge },
  parcial: { cls: 'bg-amber-50 text-amber-800 border-amber-200', icon: '≈', label: VERDICT_LABEL.parcial },
  so_ciencia: { cls: 'bg-gray-50 text-gray-600 border-gray-200', icon: '·', label: VERDICT_LABEL.so_ciencia },
  so_tradicao: { cls: 'bg-gray-50 text-gray-600 border-gray-200', icon: '·', label: VERDICT_LABEL.so_tradicao },
  dividida: { cls: 'bg-violet-50 text-violet-800 border-violet-200', icon: '⇅', label: 'Tradições divididas' }
};
const V_FILL: Record<AnyVerdict, string> = { converge: '#059669', diverge: '#e11d48', parcial: '#d97706', so_ciencia: '#9ca3af', so_tradicao: '#9ca3af', dividida: '#8b5cf6' };

function VerdictChip({ v, big = false }: { v: AnyVerdict; big?: boolean }) {
  const s = V_STYLE[v];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${s.cls} ${big ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-[11px]'}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}

function Score({ items }: { items: (AnyVerdict | null)[] }) {
  const order: AnyVerdict[] = ['converge', 'parcial', 'diverge', 'dividida', 'so_ciencia', 'so_tradicao'];
  const counts = order.map((v) => [v, items.filter((x) => x === v).length] as const).filter(([, n]) => n > 0);
  if (!counts.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <span className="text-gray-600 mr-1">Placar completo:</span>
      {counts.map(([v, n]) => (
        <span key={v} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${V_STYLE[v].cls}`}>
          <strong>{n}</strong> {V_STYLE[v].label.toLowerCase()}
        </span>
      ))}
    </div>
  );
}

const ORDER: ChineseElement[] = ['Fogo', 'Terra', 'Metal', 'Água', 'Madeira'];
const PC = 250;
const PR = 150;
const CR = 44;

function halfPath(x: number, y: number, r: number, left: boolean) {
  return left ? `M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z` : `M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z`;
}

function ElementPart({ items, mentions }: { items: ElementBridge[]; mentions: ElementMention[] }) {
  const first = useMemo(() => {
    const i = items.findIndex((x) => x.verdict === 'converge' || x.verdict === 'diverge');
    return i >= 0 ? i : Math.max(0, items.findIndex((x) => x.verdict));
  }, [items]);
  const [sel, setSel] = useState<number | null>(null);
  const cur = items[sel ?? first];
  const P = Object.fromEntries(
    ORDER.map((e, i) => {
      const th = ((90 - i * 72) * Math.PI) / 180;
      return [e, { x: PC + PR * Math.cos(th), y: PC - PR * Math.sin(th) }];
    })
  ) as Record<ChineseElement, { x: number; y: number }>;
  const curMentions = mentions.filter((m) => m.element === cur.element);

  return (
    <div className="flex flex-col gap-3">
      <Score items={items.map((x) => x.verdict)} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
        <div className="flex flex-col gap-2">
          <svg viewBox="40 30 420 450" className="w-full max-w-[460px] mx-auto touch-manipulation" role="img" aria-label="Ponte dos Cinco Elementos: tradições à esquerda, medidas à direita">
            <polygon points={ORDER.map((e) => `${P[e].x},${P[e].y}`).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth={2} />
            {ORDER.map((e) => {
              const it = items.find((x) => x.element === e)!;
              const { x, y } = P[e];
              const on = it === cur;
              const tColor = it.tradition ? TRAD_COLOR[it.tradition] : EMPTY;
              const sColor = it.science !== null ? level(it.science) : EMPTY;
              const below = e === 'Metal' || e === 'Água';
              return (
                <g key={e} style={{ cursor: 'pointer' }} onMouseEnter={() => setSel(items.indexOf(it))} onClick={() => setSel(items.indexOf(it))}>
                  <title>{`${e}: tradições ${it.tradition ? TRAD_LABEL[it.tradition] : 'não repetem'} · medidas ${it.science ?? 'sem dados suficientes'}`}</title>
                  {on && <circle cx={x} cy={y} r={CR + 9} fill="none" stroke="#111827" strokeWidth={2.5} />}
                  <path d={halfPath(x, y, CR, true)} fill={tColor} />
                  <path d={halfPath(x, y, CR, false)} fill={sColor} />
                  <line x1={x} y1={y - CR} x2={x} y2={y + CR} stroke="#fff" strokeWidth={3} />
                  <text x={x - CR / 2} y={y} textAnchor="middle" dominantBaseline="central" fontSize={20} fontWeight={700} fill={it.tradition ? '#fff' : '#9ca3af'}>
                    {it.tradition ? TRAD_SYMBOL[it.tradition] : '–'}
                  </text>
                  <text x={x + CR / 2} y={y} textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight={700} fill={it.science !== null ? '#fff' : '#9ca3af'}>
                    {it.science ?? '–'}
                  </text>
                  <text x={x} y={below ? y + CR + 24 : y - CR - 18} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={on ? 700 : 600} fill="#111827">
                    {ELEMENT_HAN[e]} {e}
                  </text>
                  {it.verdict && (
                    <g>
                      <circle cx={x + CR * 0.78} cy={below ? y - CR * 0.78 : y + CR * 0.78} r={13} fill={V_FILL[it.verdict]} stroke="#fff" strokeWidth={2.5} />
                      <text x={x + CR * 0.78} y={below ? y - CR * 0.78 : y + CR * 0.78} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={800} fill="#fff">
                        {V_STYLE[it.verdict].icon}
                      </text>
                    </g>
                  )}
                  <circle cx={x} cy={y} r={CR + 14} fill="transparent" />
                </g>
              );
            })}
          </svg>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-5 rounded-l-full bg-amber-600" /> metade esquerda: tradições (▲ força · ▼ atenção)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-5 rounded-r-full bg-emerald-600" /> metade direita: medidas (0 a 100)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3" aria-live="polite">
          <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {ELEMENT_HAN[cur.element]}
              </span>
              <span className="text-lg font-semibold text-gray-900">{cur.element}</span>
              {cur.verdict && <VerdictChip v={cur.verdict} big />}
            </div>
            {cur.explain && <p className="m-0 text-sm text-gray-800">{cur.explain}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <p className="m-0 text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>
                  O que as tradições dizem
                </p>
                {curMentions.length ? (
                  <ul className="m-0 pl-0 list-none flex flex-col gap-1 text-sm text-gray-800">
                    {curMentions.map((m, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span style={{ color: m.sign === 'forte' ? TRAD_COLOR.forte : TRAD_COLOR.atencao }} aria-hidden="true">
                          {m.sign === 'forte' ? '▲' : '▼'}
                        </span>
                        <span>
                          <strong>{m.source}:</strong> {m.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-sm text-gray-500">Nenhuma fonte destacou este elemento.</p>
                )}
                {curMentions.length > 0 && cur.traditionSources.length < 2 && <p className="m-0 text-xs text-gray-500">Só uma fonte citou: pela regra da repetição, não conta como leitura.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">O que as medidas mostram</p>
                {cur.measures.length ? (
                  <ul className="m-0 pl-0 list-none flex flex-col gap-2">
                    {cur.measures.map((m, i) => (
                      <li key={i} className="flex flex-col gap-0.5">
                        <div className="flex justify-between gap-2 text-xs">
                          <span className="text-gray-800">
                            <span className="text-purple-500" title={m.classic ? 'correspondência clássica da MTC' : 'aproximação do NeoSapiens'}>
                              {m.classic ? '✦' : '◇'}
                            </span>{' '}
                            {m.label}
                          </span>
                          <strong className="text-gray-900">{m.value}</strong>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100">
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.max(3, m.value)}%`, background: level(m.value) }} />
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {m.origin}
                          {m.note ? ` · ${m.note}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-sm text-gray-500">Ainda sem medidas respondidas.</p>
                )}
                {cur.measures.length > 0 && cur.measures.length < MIN_MEASURES && (
                  <p className="m-0 text-xs text-gray-500">São precisas pelo menos {MIN_MEASURES} medidas para dar uma nota ao elemento.</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Escolher elemento">
            {items.map((it, i) => (
              <button
                key={it.element}
                type="button"
                role="tab"
                aria-selected={it === cur}
                onClick={() => setSel(i)}
                className={`min-h-[36px] px-3 rounded-full text-sm font-semibold border ${it === cur ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {it.element}
              </button>
            ))}
          </div>
          <p className="m-0 text-xs text-gray-500">
            ✦ correspondência clássica da MTC · ◇ aproximação do NeoSapiens. Os números vêm das medidas científicas; o agrupamento por elemento vem da tradição.
          </p>
        </div>
      </div>
    </div>
  );
}

function TraitPart({ items }: { items: TraitBridge[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Score items={items.map((x) => x.verdict)} />
      <ul className="m-0 p-0 list-none flex flex-col gap-3">
        {items.map((t) => (
          <li key={t.id} className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-gray-900">{t.label}</span>
              {t.verdict && <VerdictChip v={t.verdict} />}
            </div>
            <div className="relative h-7">
              <div className="absolute inset-x-0 top-3 h-1.5 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
              <span className="absolute left-0 -top-0.5 text-[10px] text-gray-400">menos</span>
              <span className="absolute right-0 -top-0.5 text-[10px] text-gray-400">mais</span>
              {t.tradDir !== 0 && (
                <div
                  className="absolute top-2.5 h-2.5 rounded-full opacity-40"
                  style={{ background: GOLD, left: t.tradDir > 0 ? '55%' : '0%', width: '45%' }}
                  title={`as tradições sugerem ${t.tradDir > 0 ? 'mais' : 'menos'}`}
                />
              )}
              {t.score !== null && (
                <div className="absolute top-0.5 -translate-x-1/2 flex flex-col items-center" style={{ left: `${t.score}%` }}>
                  <span className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white shadow" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {t.score !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-800 px-2.5 py-0.5 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Teste: {t.score}
                </span>
              )}
              {t.voices.map((v, i) => (
                <span key={i} title={v.why} className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 px-2.5 py-0.5 text-xs font-semibold">
                  {v.dir > 0 ? '↑' : '↓'} {v.source}
                </span>
              ))}
              {!t.voices.length && <span className="text-xs text-gray-500">Mapa e números não falam desta dimensão.</span>}
            </div>
            {t.explain && <p className="m-0 text-sm text-gray-700">{t.explain}</p>}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600" /> o que o teste Mini-IPIP mostrou
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-2 rounded-full opacity-40" style={{ background: GOLD }} /> para onde as tradições apontam (↑ mais · ↓ menos)
        </span>
      </div>
    </div>
  );
}

export default function BridgeView({ elements, traits, mentions }: { elements: ElementBridge[]; traits: TraitBridge[]; mentions: ElementMention[] }) {
  const hasEl = elements.some((x) => x.verdict);
  const hasTr = traits.some((x) => x.verdict);
  return (
    <div className="flex flex-col gap-6">
      {hasEl && (
        <div className="flex flex-col gap-2">
          <p className="m-0 text-base font-semibold text-gray-900">1. Corpo e mente × Cinco Elementos</p>
          <p className="m-0 text-sm text-gray-600">
            Cada elemento tem duas metades: à esquerda, o que as tradições repetem; à direita, a média das suas medidas que a MTC liga a ele. Toque em cada um para ver de onde
            vem cada parte.
          </p>
          <ElementPart items={elements} mentions={mentions} />
        </div>
      )}
      {hasTr && (
        <div className="flex flex-col gap-2">
          <p className="m-0 text-base font-semibold text-gray-900">2. Personalidade × signos e números</p>
          <p className="m-0 text-sm text-gray-600">
            O Sol, a Lua (para as emoções), o Ascendente (para a extroversão) e os seus números de numerologia traduzidos para as cinco dimensões do teste de personalidade.
          </p>
          <TraitPart items={traits} />
          <p className="m-0 text-xs text-gray-500">
            Estudos grandes já testaram se o signo solar prevê a personalidade e não encontraram relação na população (o mais conhecido é o teste duplo-cego de Carlson, na
            revista Nature, em 1985). Aqui você vê se, no seu caso, as vozes coincidem, com os acertos e os desacertos no mesmo placar.
          </p>
        </div>
      )}
    </div>
  );
}
