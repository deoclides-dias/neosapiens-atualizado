// src/components/integration/ElementStar.tsx
// Estrela dos Cinco Elementos: junta tudo o que as tradições disseram.
// Círculo de fora = ciclo de geração (mãe → filho); estrela de dentro =
// ciclo de controle. O tamanho de cada elemento acompanha quantas fontes o
// citam; pontinhos verdes = aparece como força, âmbar = pede atenção.
// O Ar fica como satélite da Madeira, ligado pelo "vento".

import { useMemo, useState } from 'react';
import type { ChineseElement } from '../../lib/astro';
import { ELEMENT_HAN } from '../../lib/astro';
import { ELEMENT_COLORS } from '../traditions/WuXingPentagram';
import type { AnyElement, ElementMention } from '../../lib/integration/integration';

const ORDER: ChineseElement[] = ['Fogo', 'Terra', 'Metal', 'Água', 'Madeira']; // horário = geração
const CONTROL: [ChineseElement, ChineseElement][] = [
  ['Madeira', 'Terra'],
  ['Terra', 'Água'],
  ['Água', 'Fogo'],
  ['Fogo', 'Metal'],
  ['Metal', 'Madeira']
];
const AR_COLOR = '#94a3b8';
const GOLD = '#e8d9a8';
const STRONG = '#34d399';
const ATTN = '#fbbf24';
const PRESS = '#fb7185';

const ART: Record<AnyElement, string> = { Madeira: 'a', Fogo: 'o', Terra: 'a', Metal: 'o', Água: 'a', Ar: 'o' };
const the = (e: AnyElement) => `${ART[e]} ${e}`;
const The = (e: AnyElement) => `${ART[e].toUpperCase()} ${e}`;

/** Correspondências clássicas da MTC (e do Ar, na astrologia ocidental) */
const MEANING: Record<AnyElement, string> = {
  Madeira: 'Fígado e Vesícula · raiva e decisão · crescimento, planos e o vento',
  Fogo: 'Coração e Intestino Delgado · alegria · calor, entusiasmo e vínculo',
  Terra: 'Baço e Estômago · preocupação · digestão, rotina e enraizamento',
  Metal: 'Pulmão e Intestino Grosso · tristeza · limites, ordem e desapego',
  Água: 'Rins e Bexiga · medo · reservas, descanso e intuição',
  Ar: 'Elemento ocidental (não existe na MTC) · mente, ideias e comunicação · aproximado do vento da Madeira'
};

type Status = 'forte' | 'atencao' | 'misto' | 'quieto';
interface Stat {
  element: AnyElement;
  mentions: ElementMention[];
  sources: number;
  forte: number;
  atencao: number;
  status: Status;
}

type RelKind = 'pressiona' | 'desafia' | 'nutre';
interface Relation {
  kind: RelKind;
  from: ChineseElement;
  to: ChineseElement;
  title: string;
  text: string;
}

const STATUS_LABEL: Record<Status, string> = {
  forte: 'Aparece como força',
  atencao: 'Pede atenção',
  misto: 'Força e atenção ao mesmo tempo',
  quieto: 'Nenhuma fonte citou'
};

function stats(mentions: ElementMention[]): Record<AnyElement, Stat> {
  const all: AnyElement[] = [...ORDER, 'Ar'];
  return Object.fromEntries(
    all.map((e) => {
      const m = mentions.filter((x) => x.element === e);
      const forte = m.filter((x) => x.sign === 'forte').length;
      const atencao = m.filter((x) => x.sign === 'atencao').length;
      const status: Status = !m.length ? 'quieto' : forte > atencao ? 'forte' : atencao > forte ? 'atencao' : 'misto';
      return [e, { element: e, mentions: m, sources: new Set(m.map((x) => x.source)).size, forte, atencao, status }];
    })
  ) as Record<AnyElement, Stat>;
}

function relations(st: Record<AnyElement, Stat>): Relation[] {
  const out: Relation[] = [];
  // Regra da repetição: só conta quem foi citado por duas ou mais fontes
  const strong = (e: ChineseElement) => st[e].status === 'forte' && st[e].sources >= 2;
  const weak = (e: ChineseElement) => st[e].status === 'atencao' && st[e].sources >= 2;
  for (const [a, b] of CONTROL) {
    if (strong(a) && weak(b)) {
      out.push({
        kind: 'pressiona',
        from: a,
        to: b,
        title: `${The(a)} pressiona ${the(b)}`,
        text:
          `No ciclo de controle, ${the(a)} controla ${the(b)}. Com ${the(a)} forte e ${the(b)} pedindo atenção, esse controle passa da conta.` +
          (a === 'Madeira' && b === 'Terra' ? ' Na MTC é o “Fígado invadindo o Baço”: o mesmo quadro de muito vento e pouca raiz.' : '')
      });
    } else if (strong(b) && weak(a)) {
      out.push({
        kind: 'desafia',
        from: b,
        to: a,
        title: `${The(b)} desafia ${the(a)}`,
        text: `Normalmente ${the(a)} controla ${the(b)}. Com ${the(b)} forte e ${the(a)} pedindo atenção, o controle se inverte: ${the(b)} passa a desafiar quem deveria contê-l${ART[b]}.`
      });
    }
  }
  ORDER.forEach((e, i) => {
    if (!weak(e)) return;
    const mother = ORDER[(i + 4) % 5];
    if (weak(mother)) return;
    out.push({
      kind: 'nutre',
      from: mother,
      to: e,
      title: `${The(mother)} pode nutrir ${the(e)}`,
      text: `Para fortalecer ${the(e)}, a tradição olha para a sua mãe no ciclo de geração: ${the(mother)}. Cuidar da mãe é um caminho indireto para o filho.`
    });
  });
  return out;
}

const REL_STYLE: Record<RelKind, { color: string; label: string }> = {
  pressiona: { color: PRESS, label: 'Pressão' },
  desafia: { color: PRESS, label: 'Inversão' },
  nutre: { color: STRONG, label: 'Caminho de nutrição' }
};

const PC = 280;
const PR = 168;

export default function ElementStar({ mentions }: { mentions: ElementMention[] }) {
  const st = useMemo(() => stats(mentions), [mentions]);
  const rels = useMemo(() => relations(st), [st]);
  const first = useMemo(() => [...ORDER, 'Ar' as AnyElement].sort((a, b) => st[b].mentions.length - st[a].mentions.length)[0], [st]);
  const [sel, setSel] = useState<AnyElement | null>(null);
  const cur: AnyElement = sel ?? first;
  const showAr = st.Ar.mentions.length > 0;

  const P = useMemo(() => {
    const p = Object.fromEntries(
      ORDER.map((e, i) => {
        const th = ((90 - i * 72) * Math.PI) / 180;
        return [e, { x: PC + PR * Math.cos(th), y: PC - PR * Math.sin(th) }];
      })
    ) as Record<AnyElement, { x: number; y: number }>;
    const th = (126 * Math.PI) / 180; // entre Fogo e Madeira, por fora
    p.Ar = { x: PC + 238 * Math.cos(th), y: PC - 238 * Math.sin(th) };
    return p;
  }, []);

  const radius = (e: AnyElement) => (e === 'Ar' ? 20 + Math.min(st.Ar.sources, 4) * 5 : 26 + Math.min(st[e].sources, 5) * 6.5);

  const seg = (a: AnyElement, b: AnyElement, padA = 6, padB = 10) => {
    const A = P[a];
    const B = P[b];
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const L = Math.hypot(dx, dy);
    const ra = radius(a) + padA;
    const rb = radius(b) + padB;
    return { x1: A.x + (dx * ra) / L, y1: A.y + (dy * ra) / L, x2: B.x - (dx * rb) / L, y2: B.y - (dy * rb) / L };
  };

  const relOn = (a: ChineseElement, b: ChineseElement, kinds: RelKind[]) => rels.find((r) => kinds.includes(r.kind) && ((r.from === a && r.to === b) || (r.from === b && r.to === a)));
  const touches = (r: Relation, e: AnyElement) => r.from === e || r.to === e;
  const s = st[cur];
  const curRels = rels.filter((r) => touches(r, cur));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
        <svg viewBox="0 8 560 540" className="w-full max-w-[520px] mx-auto touch-manipulation" role="img" aria-label={`Estrela dos Cinco Elementos: ${ORDER.map((e) => `${e}, ${st[e].sources} fontes`).join('; ')}`}>
          <defs>
            {[
              ['es-gen', GOLD],
              ['es-ctrl', '#b9a7f5'],
              ['es-press', PRESS],
              ['es-nutre', STRONG]
            ].map(([id, color]) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={color} />
              </marker>
            ))}
          </defs>
          <circle cx={PC} cy={PC} r={262} fill="#15122f" stroke={GOLD} strokeOpacity={0.3} />

          {/* Ciclo de controle (estrela) */}
          {CONTROL.map(([a, b]) => {
            const r = relOn(a, b, ['pressiona', 'desafia']);
            const line = r ? seg(r.from, r.to) : seg(a, b);
            const dim = r && !touches(r, cur);
            return (
              <line
                key={`c-${a}`}
                {...line}
                stroke={r ? PRESS : '#b9a7f5'}
                strokeOpacity={r ? (dim ? 0.55 : 1) : 0.45}
                strokeWidth={r ? 4 : 1.3}
                strokeDasharray={r ? undefined : '6 5'}
                markerEnd={`url(#${r ? 'es-press' : 'es-ctrl'})`}
              />
            );
          })}
          {/* Ciclo de geração (círculo) */}
          {ORDER.map((a, i) => {
            const b = ORDER[(i + 1) % 5];
            const r = relOn(a, b, ['nutre']);
            const dim = r && !touches(r, cur);
            return (
              <line
                key={`g-${a}`}
                {...seg(a, b)}
                stroke={r ? STRONG : GOLD}
                strokeOpacity={r ? (dim ? 0.55 : 1) : 0.55}
                strokeWidth={r ? 4 : 1.8}
                markerEnd={`url(#${r ? 'es-nutre' : 'es-gen'})`}
              />
            );
          })}
          {showAr && <line {...seg('Ar', 'Madeira', 4, 6)} stroke={AR_COLOR} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />}
          {showAr && (
            <text x={(P.Ar.x + P.Madeira.x) / 2 - 16} y={(P.Ar.y + P.Madeira.y) / 2 - 2} textAnchor="end" fontSize={12} fill={AR_COLOR} fontStyle="italic" fontFamily="Inter, sans-serif">
              vento
            </text>
          )}

          {/* Elementos */}
          {([...ORDER, ...(showAr ? (['Ar'] as AnyElement[]) : [])] as AnyElement[]).map((e) => {
            const { x, y } = P[e];
            const r = radius(e);
            const stt = st[e];
            const color = e === 'Ar' ? AR_COLOR : ELEMENT_COLORS[e as ChineseElement];
            const quiet = stt.status === 'quieto';
            const on = e === cur;
            const n = stt.mentions.length;
            const below = e === 'Metal' || e === 'Água';
            const ly = below || e === 'Madeira' ? y + r + 30 : y - r - 28;
            return (
              <g key={e} style={{ cursor: 'pointer' }} onMouseEnter={() => setSel(e)} onClick={() => setSel(e)}>
                <title>{`${e}: ${stt.sources} fontes · ${STATUS_LABEL[stt.status].toLowerCase()}`}</title>
                {on && <circle cx={x} cy={y} r={r + 17} fill="none" stroke="#ffffff" strokeOpacity={0.85} strokeWidth={2} />}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={quiet ? '#15122f' : color}
                  fillOpacity={quiet ? 1 : 0.95}
                  stroke={quiet ? color : 'none'}
                  strokeWidth={2}
                  strokeDasharray={quiet ? '4 4' : undefined}
                />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={e === 'Ar' ? 22 : 20 + Math.min(stt.sources, 5) * 3} fill={quiet ? color : '#ffffff'} fontFamily="'Noto Serif SC', serif">
                  {e === 'Ar' ? '≋' : ELEMENT_HAN[e as ChineseElement]}
                </text>
                {stt.mentions.map((m, k) => {
                  const a = -Math.PI / 2 + ((k - (n - 1) / 2) * Math.PI) / 7 + (below ? 0 : Math.PI);
                  return <circle key={k} cx={x + Math.cos(a) * (r + 8)} cy={y + Math.sin(a) * (r + 8)} r={4.5} fill={m.sign === 'forte' ? STRONG : ATTN} stroke="#15122f" strokeWidth={1.5} />;
                })}
                <text x={e === 'Madeira' ? x + 4 : x} y={ly} textAnchor={e === 'Madeira' ? 'end' : 'middle'} dominantBaseline="central" fontSize={on ? 16 : 15} fontWeight={on ? 700 : 600} fill="#f3e7c4" fontFamily="Inter, sans-serif">
                  {e} · {stt.sources}
                </text>
                {/* área de toque maior */}
                <circle cx={x} cy={y} r={Math.max(r + 16, 34)} fill="transparent" />
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col gap-3" aria-live="polite">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-purple-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: STRONG }} /> aparece como força
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: ATTN }} /> pede atenção
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-0.5" style={{ background: GOLD }} /> geração
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 border-t border-dashed" style={{ borderColor: '#b9a7f5' }} /> controle
            </span>
          </div>

          <div className="rounded-2xl bg-white/[0.07] border border-white/15 p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-full grid place-items-center text-2xl text-white shrink-0"
                style={{ background: cur === 'Ar' ? AR_COLOR : ELEMENT_COLORS[cur as ChineseElement], fontFamily: "'Noto Serif SC', serif" }}
              >
                {cur === 'Ar' ? '≋' : ELEMENT_HAN[cur as ChineseElement]}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-semibold text-white leading-tight">
                  {cur} · {s.sources} {s.sources === 1 ? 'fonte' : 'fontes'}
                </span>
                <span className="text-xs font-semibold" style={{ color: s.status === 'forte' ? STRONG : s.status === 'atencao' ? ATTN : '#c4b5fd' }}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
            </div>
            <p className="m-0 text-xs text-purple-200">{MEANING[cur]}</p>
            {s.mentions.length ? (
              <ul className="m-0 pl-0 list-none flex flex-col gap-1 text-sm text-purple-50">
                {s.mentions.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: m.sign === 'forte' ? STRONG : ATTN }} aria-hidden="true">
                      {m.sign === 'forte' ? '▲' : '▼'}
                    </span>
                    <span>
                      <strong className="text-amber-100">{m.source}:</strong> {m.note}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-sm text-purple-100">Nenhuma tradição destacou este elemento, nem como força nem como atenção.</p>
            )}
            {curRels.map((r, i) => (
              <div key={i} className="rounded-xl p-3 text-sm text-purple-50 border" style={{ borderColor: `${REL_STYLE[r.kind].color}66`, background: `${REL_STYLE[r.kind].color}14` }}>
                <p className="m-0 text-xs font-semibold uppercase tracking-wider" style={{ color: REL_STYLE[r.kind].color }}>
                  {REL_STYLE[r.kind].label}
                </p>
                <p className="m-0 font-semibold text-white">{r.title}</p>
                <p className="m-0 mt-0.5">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Escolher elemento">
            {([...ORDER, ...(showAr ? (['Ar'] as AnyElement[]) : [])] as AnyElement[]).map((e) => (
              <button
                key={e}
                type="button"
                role="tab"
                aria-selected={e === cur}
                onClick={() => setSel(e)}
                className={`min-h-[36px] px-3 rounded-full text-sm font-semibold border ${e === cur ? 'bg-white text-[#15122f] border-white' : 'bg-white/5 text-purple-50 border-white/20 hover:bg-white/10'}`}
              >
                {e}
              </button>
            ))}
          </div>
          <p className="m-0 text-xs text-purple-200">Passe o mouse ou toque em cada elemento para ver o que cada tradição diz.</p>
        </div>
      </div>

      {rels.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="m-0 text-sm font-semibold text-amber-100">O que a estrela mostra</p>
          <p className="m-0 text-xs text-purple-200">Pela regra da repetição, só entram aqui os elementos citados por duas ou mais fontes.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {rels.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSel(r.kind === 'nutre' ? r.to : r.from)}
                className="text-left rounded-xl px-3.5 py-2.5 text-sm text-purple-50 border bg-white/[0.04] hover:bg-white/[0.08]"
                style={{ borderColor: `${REL_STYLE[r.kind].color}55` }}
              >
                <span className="inline-flex items-center gap-2 font-semibold text-white">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: REL_STYLE[r.kind].color }} aria-hidden="true" />
                  {r.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
