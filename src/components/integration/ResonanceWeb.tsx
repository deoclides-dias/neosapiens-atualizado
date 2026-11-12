// src/components/integration/ResonanceWeb.tsx
// Rede de ressonâncias: cada área medida é um ponto no círculo (agrupado por
// módulo) e cada ressonância é um fio entre pontos. Cor = tipo (cascata,
// força, tensão); espessura = força da evidência. O ponto com mais fios de
// cascata ou tensão vira o "ponto de alavanca".

import { useMemo, useState } from 'react';
import type { ResNode, ResNodeId, Resonance } from '../../lib/integration/integration';

const MODULE_COLOR: Record<ResNode['module'], string> = {
  Corpo: '#059669',
  Mente: '#2563eb',
  Personalidade: '#db2777',
  Propósito: '#7c3aed'
};
const KIND = {
  cascata: { label: 'Efeito cascata', color: '#e11d48', chip: 'bg-rose-50 text-rose-800' },
  forca: { label: 'Força que se confirma', color: '#059669', chip: 'bg-emerald-50 text-emerald-800' },
  tensao: { label: 'Tensão', color: '#d97706', chip: 'bg-amber-50 text-amber-800' }
} as const;
const STRENGTH = {
  forte: { label: 'Evidência forte', w: 4.5, dash: undefined },
  moderada: { label: 'Evidência moderada', w: 3, dash: undefined },
  possível: { label: 'Relação possível', w: 2.4, dash: '4 5' }
} as const;
const level = (v: number) => (v >= 70 ? '#059669' : v >= 45 ? '#d97706' : '#e11d48');

const listPt = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}` : xs[0]);

const S = 420;
const C = S / 2;
const R = 150;

export default function ResonanceWeb({ nodes, items }: { nodes: ResNode[]; items: Resonance[] }) {
  const linked = useMemo(() => new Set(items.flatMap((r) => r.links.flatMap((l) => [l.from, l.to]))), [items]);
  // Só os pontos que têm fio; os módulos se alternam no círculo para os fios
  // ficarem longos e legíveis (a cor do nome continua dizendo o módulo)
  const shown = useMemo(() => {
    const groups = (['Corpo', 'Mente', 'Personalidade', 'Propósito'] as ResNode['module'][]).map((m) => nodes.filter((n) => n.module === m && linked.has(n.id)));
    const out: ResNode[] = [];
    for (let i = 0; groups.some((g) => g.length > i); i++) groups.forEach((g) => g[i] && out.push(g[i]));
    return out;
  }, [nodes, linked]);

  const pos = useMemo(() => {
    const out = {} as Record<ResNodeId, { x: number; y: number; a: number }>;
    shown.forEach((n, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / shown.length;
      out[n.id] = { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R, a };
    });
    return out;
  }, [shown]);

  // Ponto de alavanca: mais vizinhos em fios de cascata ou tensão
  const lever = useMemo(() => {
    const nb = new Map<ResNodeId, Set<ResNodeId>>();
    items
      .filter((r) => r.kind !== 'forca')
      .forEach((r) =>
        r.links.forEach((l) => {
          if (!nb.has(l.from)) nb.set(l.from, new Set());
          if (!nb.has(l.to)) nb.set(l.to, new Set());
          nb.get(l.from)!.add(l.to);
          nb.get(l.to)!.add(l.from);
        })
      );
    let best: { id: ResNodeId; n: ResNodeId[] } | null = null;
    nb.forEach((set, id) => {
      if (set.size >= 2 && (!best || set.size > best.n.length)) best = { id, n: Array.from(set) };
    });
    return best as { id: ResNodeId; n: ResNodeId[] } | null;
  }, [items]);

  const firstSel = lever ? Math.max(0, items.findIndex((r) => r.links.some((l) => l.from === lever.id || l.to === lever.id))) : 0;
  const [sel, setSel] = useState<number | null>(null);
  const cur = sel ?? firstSel;
  const x = items[cur];
  const byId = (id: ResNodeId) => nodes.find((n) => n.id === id)!;
  const nodeR = (id: ResNodeId) => (lever?.id === id ? 21 : 17);

  const curve = (a: ResNodeId, b: ResNodeId) => {
    const A = pos[a];
    const B = pos[b];
    const mx = (A.x + B.x) / 2;
    const my = (A.y + B.y) / 2;
    const qx = C + (mx - C) * 0.25;
    const qy = C + (my - C) * 0.25;
    const cut = (P: { x: number; y: number }, r: number) => {
      const dx = qx - P.x;
      const dy = qy - P.y;
      const L = Math.hypot(dx, dy) || 1;
      return { x: P.x + (dx * r) / L, y: P.y + (dy * r) / L };
    };
    const s = cut(A, nodeR(a) + 3);
    const e = cut(B, nodeR(b) + 7);
    const at = (t: number) => ({ x: (1 - t) * (1 - t) * A.x + 2 * t * (1 - t) * qx + t * t * B.x, y: (1 - t) * (1 - t) * A.y + 2 * t * (1 - t) * qy + t * t * B.y });
    return { d: `M${s.x},${s.y} Q${qx},${qy} ${e.x},${e.y}`, at };
  };

  const badges = (() => {
    const placed: { x: number; y: number }[] = [];
    return items.map((r) => {
      if (!r.links.length || !pos[r.links[0].from] || !pos[r.links[0].to]) return null;
      const { at } = curve(r.links[0].from, r.links[0].to);
      let best = at(0.5);
      for (const t of [0.5, 0.38, 0.62, 0.3, 0.7]) {
        const p = at(t);
        best = p;
        if (placed.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 30)) break;
      }
      placed.push(best);
      return best;
    });
  })();

  const pick = (id: ResNodeId) => {
    const i = items.findIndex((r) => r.links.some((l) => l.from === id || l.to === id));
    if (i >= 0) setSel(i);
  };
  const inCur = (id: ResNodeId) => x?.links.some((l) => l.from === id || l.to === id);

  return (
    <div className="flex flex-col gap-4">
      {lever && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 flex gap-3 items-start">
          <span className="w-10 h-10 rounded-full grid place-items-center text-white font-bold shrink-0" style={{ background: MODULE_COLOR[byId(lever.id).module] }} aria-hidden="true">
            ★
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">Ponto de alavanca</p>
            <p className="m-0 text-[15px] text-gray-900">
              <strong>{byId(lever.id).label}</strong> está ligado a {lever.n.length} outras áreas: {listPt(lever.n.map((id) => byId(id).label.toLowerCase()))}. Cuidar
              dele mexe em todas, e por isso é um bom primeiro rumo para a Bússola da Primeira Jornada.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
        <svg viewBox={`-125 -30 ${S + 250} ${S + 60}`} className="w-full max-w-[560px] mx-auto touch-manipulation" role="img" aria-label="Rede de ressonâncias entre os módulos">
          <defs>
            {(Object.keys(KIND) as (keyof typeof KIND)[]).map((k) => (
              <marker key={k} id={`rw-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={KIND[k].color} />
              </marker>
            ))}
          </defs>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#e5e7eb" strokeDasharray="2 6" />

          {/* Fios */}
          {items.map((r, i) =>
            r.links.map((l, k) => {
              const { d } = curve(l.from, l.to);
              const on = i === cur;
              const st = STRENGTH[r.strength];
              return (
                <g key={`${r.id}-${k}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
                  <path
                    d={d}
                    fill="none"
                    stroke={KIND[r.kind].color}
                    strokeOpacity={on ? 1 : 0.3}
                    strokeWidth={on ? st.w + 1 : st.w}
                    strokeDasharray={st.dash}
                    strokeLinecap="round"
                    markerEnd={r.kind === 'cascata' ? `url(#rw-${r.kind})` : undefined}
                  />
                  <path d={d} fill="none" stroke="transparent" strokeWidth={18}>
                    <title>{r.title}</title>
                  </path>
                </g>
              );
            })
          )}
          {/* Número de cada ressonância sobre o seu primeiro fio */}
          {items.map((r, i) => {
            const mid = badges[i];
            if (!mid) return null;
            const on = i === cur;
            return (
              <g key={`n${r.id}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
                <circle cx={mid.x} cy={mid.y} r={on ? 14 : 12.5} fill={on ? KIND[r.kind].color : '#fff'} stroke={KIND[r.kind].color} strokeWidth={2} />
                <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fontSize={on ? 15 : 14} fontWeight={700} fill={on ? '#fff' : KIND[r.kind].color}>
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Pontos */}
          {shown.map((n) => {
            const p = pos[n.id];
            const r = nodeR(n.id);
            const has = true;
            const on = inCur(n.id);
            const lx = C + Math.cos(p.a) * (R + r + 18);
            const ly = C + Math.sin(p.a) * (R + r + 18);
            const anchor = Math.abs(lx - C) < 12 ? 'middle' : lx > C ? 'start' : 'end';
            return (
              <g key={n.id} style={{ cursor: has ? 'pointer' : 'default' }} opacity={has ? 1 : 0.45} onMouseEnter={() => pick(n.id)} onClick={() => pick(n.id)}>
                <title>{`${n.label}: ${n.value ?? 'sem dado'}${n.value !== null ? ' de 100' : ''} · ${n.from}`}</title>
                {lever?.id === n.id && <circle cx={p.x} cy={p.y} r={r + 6} fill="none" stroke={MODULE_COLOR[n.module]} strokeWidth={2} strokeDasharray="3 3" />}
                <circle cx={p.x} cy={p.y} r={r} fill={n.value === null ? '#e5e7eb' : level(n.value)} stroke={on ? '#111827' : '#fff'} strokeWidth={on ? 2.5 : 2} />
                <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={r >= 20 ? 15 : 13} fontWeight={700} fill="#fff">
                  {n.value ?? '–'}
                </text>
                <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize={on ? 19 : 18} fontWeight={on ? 700 : 600} fill={MODULE_COLOR[n.module]}>
                  {n.label}
                </text>
                <circle cx={p.x} cy={p.y} r={26} fill="transparent" />
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col gap-3" aria-live="polite">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {(Object.keys(KIND) as (keyof typeof KIND)[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="w-5 h-1 rounded-full" style={{ background: KIND[k].color }} /> {KIND[k].label}
              </span>
            ))}
          </div>
          {x && (
            <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${KIND[x.kind].chip}`}>{KIND[x.kind].label}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{STRENGTH[x.strength].label}</span>
              </div>
              <p className="m-0 text-lg font-semibold text-gray-900 leading-snug">
                {cur + 1}. {x.title}
              </p>
              <p className="m-0 text-sm text-gray-800">
                <span className="text-gray-500">O que vimos:</span> {x.seen}
              </p>
              <p className="m-0 text-sm text-gray-800">
                <span className="text-gray-500">Por quê:</span> {x.why}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(x.links.flatMap((l) => [l.from, l.to]))).map((id) => {
                  const n = byId(id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-gray-200 px-2 py-0.5 text-gray-700">
                      <span className="w-2 h-2 rounded-full" style={{ background: MODULE_COLOR[n.module] }} />
                      {n.label}
                      {n.value !== null && <strong className="text-gray-900">{n.value}</strong>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Escolher ressonância">
            {items.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === cur}
                onClick={() => setSel(i)}
                className={`w-9 h-9 rounded-full text-sm font-bold border-2 ${i === cur ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                style={{ borderColor: KIND[r.kind].color, background: i === cur ? KIND[r.kind].color : undefined, color: i === cur ? '#fff' : KIND[r.kind].color }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="m-0 text-xs text-gray-500">
            Passe o mouse ou toque nos fios, nos pontos ou nos números. Fio grosso = evidência forte; pontilhado = relação possível. As setas mostram a direção que a ciência
            sugere, não uma prova de causa no seu caso.
          </p>
        </div>
      </div>
    </div>
  );
}
