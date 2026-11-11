// src/lib/psique/summary.ts
// Resumo do Mapa da Psique para o Mapa NeoSapiens (ao lado da Ponte) e para a Carta.
// Só frases curtas e regras à vista: o símbolo pergunta, a medida mostra.

import { WesternChart } from '../astro/types';
import { GAP_THRESHOLD, PsychologicalResult, TRAITS, scoreTraits } from '../psych/miniIpip';
import { BlockId, johari, psiqueBlocks } from './psique';

export interface PsiqueRow {
  id: BlockId;
  question: string;
  symbol: string | null; // protagonista do mapa natal
  measure: string; // o que a medida mostrou, em uma frase
  compass: string | null;
  tension: number; // tamanho da maior distância medida (0 se não há medida)
}

export interface PsiqueSummary {
  rows: PsiqueRow[];
  /** Maior distância entre "hoje" e "deveria" (régua do dever) */
  dever: { trait: string; today: number; dever: number } | null;
  /** Traço que o outro vê mais (ou menos) do que você */
  blind: { trait: string; self: number; other: number; modo: 'com_alguem' | 'sozinho'; relacao?: string } | null;
  /** Pergunta da bússola do bloco com mais tensão medida */
  compass: { question: string; text: string } | null;
  missing: { dever: boolean; outro: boolean };
}

const lower = (s: string) => s.toLowerCase();

export function psiqueSummary(chart: WesternChart | null, r: PsychologicalResult | null): PsiqueSummary | null {
  if (!chart && !r) return null;
  const blocks = chart ? psiqueBlocks(chart) : null;
  const real = r ? scoreTraits(r.respostas) : null;
  const name = (id: string) => TRAITS.find((t) => t.id === id)!.name;

  // Régua do dever: a maior distância acima da margem
  let dever: PsiqueSummary['dever'] = null;
  if (r?.dever && real) {
    const d = scoreTraits(r.dever.respostas);
    const best = real
      .map((x) => ({ trait: name(x.id), today: x.score, dever: d.find((y) => y.id === x.id)!.score }))
      .sort((a, b) => Math.abs(b.dever - b.today) - Math.abs(a.dever - a.today))[0];
    if (best && Math.abs(best.dever - best.today) >= GAP_THRESHOLD) dever = best;
  }

  // Johari: o traço com a maior diferença fora do "Aberto"
  let blind: PsiqueSummary['blind'] = null;
  const jo = r ? johari(r) : null;
  if (jo) {
    const pick = [...jo.blind, ...jo.hidden].sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0];
    if (pick) blind = { trait: pick.name, self: pick.self, other: pick.other, modo: jo.mode, relacao: jo.relation };
  }

  const ids: BlockId[] = ['eu', 'outros', 'cultura', 'pulsa'];
  const rows: PsiqueRow[] = ids.map((id) => {
    const b = blocks?.find((x) => x.id === id) ?? null;
    let measure = '';
    let tension = 0;
    if (!r) measure = 'Falta a avaliação de personalidade.';
    else if (id === 'eu') {
      const s = [...real!].sort((a, b) => b.score - a.score);
      measure = `Você se descreve com mais ${lower(name(s[0].id))} (${s[0].score}) e menos ${lower(name(s[s.length - 1].id))} (${s[s.length - 1].score}).`;
    } else if (id === 'outros') {
      if (!jo) measure = 'Falta o olhar dos outros.';
      else if (blind) {
        tension = Math.abs(blind.other - blind.self);
        const who = blind.modo === 'com_alguem' ? (blind.relacao ? blind.relacao : 'quem respondeu com você') : 'você imagina que os outros';
        measure = `${who.charAt(0).toUpperCase() + who.slice(1)} ${blind.modo === 'com_alguem' ? 'vê' : 'veem'} ${blind.other > blind.self ? 'mais' : 'menos'} ${lower(blind.trait)} do que você (${blind.other} × ${blind.self}).`;
      } else measure = 'O olhar dos outros ficou parecido com o seu em todos os traços.';
    } else if (id === 'cultura') {
      if (dever) {
        tension = Math.abs(dever.dever - dever.today);
        measure = `Você sente que deveria ter ${dever.dever > dever.today ? 'bem mais' : 'bem menos'} ${lower(dever.trait)} do que tem hoje (${dever.dever} × ${dever.today}).`;
      } else if (!r.dever) measure = 'Falta o "como acho que deveria ser".';
      else measure = 'O que você sente que deveria ser ficou perto de como você é hoje.';
    } else measure = 'A medida dos estilos de defesa (DSQ-40) chega em breve.';
    return { id, question: b?.question ?? '', symbol: b?.protagonist.label ?? null, measure, compass: b?.compass ?? null, tension };
  });

  const top = [...rows].filter((x) => x.compass).sort((a, b) => b.tension - a.tension)[0];
  const compass = top?.compass ? { question: top.question, text: top.compass } : null;

  return { rows, dever, blind, compass, missing: { dever: !r?.dever, outro: !r?.outro } };
}
