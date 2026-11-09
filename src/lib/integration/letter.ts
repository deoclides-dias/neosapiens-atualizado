// src/lib/integration/letter.ts
// Carta ao Navegante: monta, por regras, a leitura que o NeoSapiens faz do
// mapa da pessoa. Cada trecho guarda de onde veio ("por que dizemos isso").

import type { ChineseElement } from '../astro';
import { compassHeadings, Heading } from '../flight/flight';
import { elementBridge, ElementBridge } from './bridge';
import {
  Computed,
  Contradiction,
  contradictions,
  elementMentions,
  RadarAxis,
  radarAxes,
  ResNode,
  ResNodeId,
  resonanceNodes,
  Resonance,
  resonances,
  Sources
} from './integration';

export interface Lever {
  node: ResNode;
  neighbors: ResNode[];
}

export interface Letter {
  strengths: RadarAxis[];
  central: Contradiction | null;
  lever: Lever | null;
  bridge: ElementBridge | null;
  headings: Heading[];
}

/** Ponto de alavanca: o nó com mais vizinhos em fios de cascata ou tensão */
export function leverPoint(nodes: ResNode[], items: Resonance[]): Lever | null {
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
  if (!best) return null;
  const b = best as { id: ResNodeId; n: ResNodeId[] };
  const find = (id: ResNodeId) => nodes.find((n) => n.id === id)!;
  return { node: find(b.id), neighbors: b.n.map(find) };
}

export const ELEMENT_MEANING: Record<ChineseElement, string> = {
  Madeira: 'crescimento, planos e movimento',
  Fogo: 'alegria, vínculos e presença',
  Terra: 'digestão, rotina e enraizamento',
  Metal: 'respiração, limites e desapego',
  Água: 'reservas, descanso e intuição'
};

export function buildLetter(s: Sources, c: Computed): Letter {
  const axes = radarAxes(s, c);
  const strengths = axes
    .filter((a) => typeof a.value === 'number' && (a.value as number) >= 65)
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 3);
  const contr = contradictions(c);
  const central = contr.length ? [...contr].sort((a, b) => b.size - a.size)[0] : null;
  const lever = leverPoint(resonanceNodes(s, c), resonances(s, c));
  const bridge = elementBridge(s, c, elementMentions(s, c)).find((e) => e.verdict === 'converge') ?? null;
  const headings = compassHeadings(s, c).slice(0, 3);
  return { strengths, central, lever, bridge, headings };
}

/** Lista em português: "a, b e c" */
export const listPt = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}` : xs[0] ?? '');
