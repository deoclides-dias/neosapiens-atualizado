// src/lib/integration/integration.ts
// O caldeirão: junta os cinco módulos em quatro camadas.
// 1) Radar NeoSapiens de 12 eixos (Propósito, Corpo, Mente)
// 2) Mapa das contradições (o que a pessoa diz × o que as respostas mostram)
// 3) Ressonâncias (padrões que aparecem em mais de um módulo)
// 4) O que as tradições repetem (elementos que se repetem em várias fontes)

import { BodyData, BodyReport, buildReport } from '../body/scoring';
import { WAKE_WINDOWS } from '../body/questions';
import { MindData, AxisScore, mindAxes } from '../mind/mind';
import { PsychologicalResult, TRAITS, scoreTraits, traitGaps } from '../psych/miniIpip';
import { PurposeData, flourishScore, lifeAreas, mlqScore, shenProfile, valueProfile } from '../purpose/purpose';
import type { ChineseElement, TraditionsResult } from '../astro';
import { integrationThemes, IntegrationTheme } from '../astro/interpretation';

export interface Sources {
  body: BodyData | null;
  mind: MindData | null;
  psych: PsychologicalResult | null;
  purpose: PurposeData | null;
  traditions: TraditionsResult | null;
}

const avg = (xs: (number | null | undefined)[]) => {
  const v = xs.filter((x): x is number => typeof x === 'number');
  return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length) : null;
};
const to100 = (v: number, min: number, max: number) => Math.round(((v - min) / (max - min)) * 100);

// ---------------------------------------------------------------------------
// Camada 1: Radar de 12 eixos
// ---------------------------------------------------------------------------

export type Pillar = 'proposito' | 'corpo' | 'mente';

export interface RadarAxis {
  id: string;
  label: string;
  pillar: Pillar;
  value: number | null;
  from: string; // de onde vem, em linguagem simples
}

export const PILLARS: { id: Pillar; label: string; emoji: string; color: string }[] = [
  { id: 'proposito', label: 'Propósito', emoji: '🧭', color: '#7c3aed' },
  { id: 'corpo', label: 'Corpo', emoji: '🧬', color: '#059669' },
  { id: 'mente', label: 'Mente', emoji: '📚', color: '#2563eb' }
];

export interface Computed {
  body: BodyReport | null;
  mind: AxisScore[] | null;
  traits: ReturnType<typeof scoreTraits> | null;
  gaps: ReturnType<typeof traitGaps>;
  mlq: ReturnType<typeof mlqScore>;
  life: ReturnType<typeof lifeAreas>;
  flourish: ReturnType<typeof flourishScore>;
  values: ReturnType<typeof valueProfile>;
  shen: ReturnType<typeof shenProfile>;
}

export function compute(s: Sources): Computed {
  const pa = s.purpose?.concluidoEm ? s.purpose.respostas : null;
  return {
    body: s.body?.concluidoEm ? buildReport(s.body.respostas) : null,
    mind: s.mind?.concluidoEm ? mindAxes(s.mind) : null,
    traits: s.psych ? scoreTraits(s.psych.respostas) : null,
    gaps: s.psych ? traitGaps(s.psych) : [],
    mlq: pa ? mlqScore(pa) : null,
    life: pa ? lifeAreas(pa) : null,
    flourish: pa ? flourishScore(pa) : null,
    values: pa ? valueProfile(pa) : null,
    shen: pa ? shenProfile(pa) : null
  };
}

export function radarAxes(s: Sources, c: Computed): RadarAxis[] {
  const area = (id: string) => c.body?.areas.find((a) => a.id === id)?.score ?? null;
  const mind = (id: string) => c.mind?.find((a) => a.id === id)?.score ?? null;
  const trait = (id: string) => c.traits?.find((t) => t.id === id)?.score ?? null;
  const pa = s.purpose?.respostas;
  const f4 = typeof pa?.f4 === 'number' ? to100(pa.f4 as number, 1, 7) : null;
  const comunidade = typeof pa?.coe_comunidade === 'number' ? to100(pa.coe_comunidade as number, 1, 10) : null;

  return [
    { id: 'proposito_claro', pillar: 'proposito', label: 'Propósito claro', value: c.mlq ? to100(c.mlq.presence, 5, 35) : null, from: 'Sentido de vida (presença)' },
    { id: 'alinhamento', pillar: 'proposito', label: 'Alinhamento', value: c.life ? c.life.composite : null, from: 'O que você valoriza × como você vive' },
    { id: 'significado', pillar: 'proposito', label: 'Significado', value: c.flourish?.score ?? null, from: 'Florescimento' },
    { id: 'contribuicao', pillar: 'proposito', label: 'Contribuição', value: c.life || c.flourish ? avg([f4, comunidade]) : null, from: '“Contribuo para o bem dos outros” e a área Comunidade' },
    { id: 'vitalidade', pillar: 'corpo', label: 'Vitalidade', value: c.body ? avg([area('bemestar'), area('digestao')]) : null, from: 'Bem-estar (OMS-5) e digestão' },
    { id: 'nutricao', pillar: 'corpo', label: 'Nutrição', value: area('alimentacao'), from: 'Alimentação' },
    { id: 'sono', pillar: 'corpo', label: 'Sono', value: area('sono'), from: 'Sono' },
    { id: 'exercicio', pillar: 'corpo', label: 'Exercício', value: area('movimento'), from: 'Movimento' },
    { id: 'aprendizado', pillar: 'mente', label: 'Aprendizado', value: avg([mind('curiosidade'), mind('memoria')]), from: 'Curiosidade (NCS-6) e memória' },
    { id: 'foco', pillar: 'mente', label: 'Foco', value: avg([mind('atencao'), mind('controle')]), from: 'Testes de reação e de cores' },
    { id: 'criatividade', pillar: 'mente', label: 'Criatividade', value: avg([mind('criatividade'), trait('I')]), from: 'Teste de usos e Abertura' },
    { id: 'sabedoria', pillar: 'mente', label: 'Sabedoria', value: avg([mind('flexibilidade'), trait('N')]), from: 'Flexibilidade e Estabilidade emocional' }
  ];
}

// ---------------------------------------------------------------------------
// Camada 2: Mapa das contradições
// ---------------------------------------------------------------------------

export interface Contradiction {
  id: string;
  module: 'Personalidade' | 'Corpo' | 'Mente' | 'Propósito';
  title: string;
  detail: string;
  size: number; // 0–100, para ordenar
  kind: 'quer_mudar' | 'se_ve_melhor' | 'se_ve_pior' | 'valoriza_nao_vive';
  /** Nome curto para o eixo do radar */
  axis: string;
  /** O que a pessoa quer ou acredita (0–100) */
  want: number;
  /** O que as respostas mostram hoje (0–100) */
  is: number;
  wantLabel: string;
  isLabel: string;
}

export function contradictions(c: Computed): Contradiction[] {
  const out: Contradiction[] = [];

  for (const g of c.gaps.filter((x) => x.meaningful)) {
    const t = TRAITS.find((x) => x.id === g.id)!;
    out.push({
      id: `psy-${g.id}`,
      module: 'Personalidade',
      kind: 'quer_mudar',
      title: `Quer ser ${g.gap > 0 ? t.wantMore : t.wantLess}`,
      detail: `${t.name}: hoje ${g.real}, como gostaria de ser ${g.ideal} (${g.gap > 0 ? '+' : '−'}${Math.abs(g.gap)}).`,
      size: Math.abs(g.gap),
      axis: t.name,
      want: g.ideal,
      is: g.real,
      wantLabel: 'como gostaria de ser',
      isLabel: 'como você é hoje'
    });
  }

  for (const p of c.body?.priorities.filter((x) => x.mismatch) ?? []) {
    out.push({
      id: `body-${p.id}`,
      module: 'Corpo',
      kind: p.mismatch as 'se_ve_melhor' | 'se_ve_pior',
      title: p.mismatch === 'se_ve_melhor' ? `Você vê seu(sua) ${p.label} melhor do que as respostas mostram` : `Você é mais exigente com seu(sua) ${p.label} do que os números`,
      detail: `Você se deu ${p.satisfaction} de 10; as respostas indicam ${p.measured} de 100.`,
      size: Math.abs(p.satisfaction * 10 - (p.measured ?? 0)),
      axis: p.label.charAt(0).toUpperCase() + p.label.slice(1),
      want: p.satisfaction * 10,
      is: p.measured ?? 0,
      wantLabel: 'como você se vê',
      isLabel: 'o que as respostas mostram'
    });
  }

  for (const a of c.mind?.filter((x) => x.score !== null && x.self !== undefined && Math.abs((x.self as number) - (x.score as number)) >= 30) ?? []) {
    const better = (a.self as number) > (a.score as number);
    out.push({
      id: `mind-${a.id}`,
      module: 'Mente',
      kind: better ? 'se_ve_melhor' : 'se_ve_pior',
      title: better ? `${a.label}: o teste ficou abaixo da sua impressão` : `${a.label}: você pode estar se subestimando`,
      detail: `Você se deu ${(a.self as number) / 10} de 10; o teste deu ${a.score} de 100.`,
      size: Math.abs((a.self as number) - (a.score as number)),
      axis: a.label,
      want: a.self as number,
      is: a.score as number,
      wantLabel: 'como você se vê',
      isLabel: 'o que o teste mostrou'
    });
  }

  for (const x of c.life?.areas.filter((x) => x.gap >= 3) ?? []) {
    out.push({
      id: `life-${x.id}`,
      module: 'Propósito',
      kind: 'valoriza_nao_vive',
      title: `${x.label}: importa mais do que tem sido vivido`,
      detail: `Importância ${x.importance} de 10; viveu de acordo ${x.coherence} de 10.`,
      size: x.gap * 11,
      axis: x.label,
      want: Math.round(((x.importance - 1) / 9) * 100),
      is: Math.round(((x.coherence - 1) / 9) * 100),
      wantLabel: 'o quanto importa',
      isLabel: 'o quanto tem vivido'
    });
  }

  return out.sort((a, b) => b.size - a.size);
}

// ---------------------------------------------------------------------------
// Camada 3: Ressonâncias entre módulos
// ---------------------------------------------------------------------------

export type ResNodeId =
  | 'sono' | 'movimento' | 'bemestar'
  | 'atencao' | 'memoria' | 'criatividade' | 'curiosidade'
  | 'estabilidade' | 'abertura' | 'organizacao'
  | 'sentido' | 'vida' | 'relacoes' | 'saude';

export interface ResNode {
  id: ResNodeId;
  label: string;
  module: 'Corpo' | 'Mente' | 'Personalidade' | 'Propósito';
  value: number | null;
  from: string;
}

export interface Resonance {
  id: string;
  title: string;
  kind: 'cascata' | 'forca' | 'tensao';
  modules: string[];
  seen: string;
  why: string;
  strength: 'forte' | 'moderada' | 'possível';
  /** Ligações na rede (na cascata, a seta vai de `from` para `to`) */
  links: { from: ResNodeId; to: ResNodeId }[];
}

/** Os pontos da rede de ressonâncias, na ordem do círculo (agrupados por módulo) */
export function resonanceNodes(s: Sources, c: Computed): ResNode[] {
  const area = (id: string) => c.body?.areas.find((a) => a.id === id)?.score ?? null;
  const mind = (id: string) => c.mind?.find((a) => a.id === id)?.score ?? null;
  const trait = (id: string) => c.traits?.find((t) => t.id === id)?.score ?? null;
  const rel = c.life?.areas.filter((x) => ['familia', 'casal', 'amizades'].includes(x.id));
  const health = s.purpose?.respostas?.v_saude;
  return [
    { id: 'sono', label: 'Sono', module: 'Corpo', value: area('sono'), from: 'questionário do corpo' },
    { id: 'movimento', label: 'Movimento', module: 'Corpo', value: area('movimento'), from: 'IPAQ (questionário do corpo)' },
    { id: 'bemestar', label: 'Bem-estar', module: 'Corpo', value: area('bemestar'), from: 'OMS-5 (questionário do corpo)' },
    { id: 'atencao', label: 'Atenção', module: 'Mente', value: mind('atencao'), from: 'teste de reação e Stroop' },
    { id: 'memoria', label: 'Memória', module: 'Mente', value: mind('memoria'), from: 'teste de dígitos' },
    { id: 'criatividade', label: 'Criatividade', module: 'Mente', value: mind('criatividade'), from: 'teste de usos alternativos' },
    { id: 'curiosidade', label: 'Curiosidade', module: 'Mente', value: mind('curiosidade'), from: 'NCS-6' },
    { id: 'estabilidade', label: 'Estabilidade', module: 'Personalidade', value: trait('N'), from: 'Mini-IPIP' },
    { id: 'abertura', label: 'Abertura', module: 'Personalidade', value: trait('I'), from: 'Mini-IPIP' },
    { id: 'organizacao', label: 'Organização', module: 'Personalidade', value: trait('C'), from: 'Mini-IPIP' },
    { id: 'sentido', label: 'Sentido', module: 'Propósito', value: c.mlq ? to100(c.mlq.presence, 5, 35) : null, from: 'MLQ (presença de sentido)' },
    { id: 'vida', label: 'Vida valorizada', module: 'Propósito', value: c.life ? c.life.composite : null, from: 'importância × vivência das áreas da vida' },
    {
      id: 'relacoes',
      label: 'Relações',
      module: 'Propósito',
      value: rel && rel.length ? avg(rel.map((x) => to100(x.coherence, 1, 10))) : null,
      from: 'vivência em família, casal e amizades'
    },
    { id: 'saude', label: 'Saúde (valor)', module: 'Propósito', value: typeof health === 'number' ? to100(health, 1, 7) : null, from: 'importância da saúde nos valores' }
  ];
}

export function resonances(s: Sources, c: Computed): Resonance[] {
  const out: Resonance[] = [];
  const area = (id: string) => c.body?.areas.find((a) => a.id === id)?.score;
  const mind = (id: string) => c.mind?.find((a) => a.id === id)?.score ?? undefined;
  const trait = (id: string) => c.traits?.find((t) => t.id === id)?.score;
  const sleep = area('sono');
  const move = area('movimento');
  const well = area('bemestar');
  const attention = mind('atencao');
  const memory = mind('memoria');
  const stability = trait('N');
  const openness = trait('I');
  const lt = (v: number | undefined | null, n: number) => typeof v === 'number' && v < n;
  const ge = (v: number | undefined | null, n: number) => typeof v === 'number' && v >= n;

  if (lt(sleep, 50) && (lt(attention, 50) || lt(memory, 50))) {
    out.push({
      id: 'sono-mente',
      kind: 'cascata',
      title: 'O sono está pesando na mente',
      modules: ['Corpo', 'Mente'],
      strength: 'forte',
      seen: `Sono em ${sleep} e ${lt(attention, 50) ? `atenção em ${attention}` : `memória em ${memory}`} nos testes.`,
      why: 'Dormir pouco ou mal reduz atenção e memória de trabalho já no dia seguinte; é um dos efeitos mais bem documentados da ciência do sono.',
      links: [...(lt(attention, 50) ? [{ from: 'sono' as ResNodeId, to: 'atencao' as ResNodeId }] : []), ...(lt(memory, 50) ? [{ from: 'sono' as ResNodeId, to: 'memoria' as ResNodeId }] : [])]
    });
  }
  if (lt(sleep, 50) && typeof well === 'number' && well <= 50) {
    out.push({
      id: 'sono-humor',
      kind: 'cascata',
      title: 'Sono e bem-estar caminhando juntos',
      modules: ['Corpo'],
      strength: 'forte',
      seen: `Sono em ${sleep} e bem-estar em ${well}.`,
      why: 'Sono ruim e humor baixo se alimentam um do outro; melhorar o sono costuma melhorar o humor.',
      links: [{ from: 'sono', to: 'bemestar' }]
    });
  }
  if (lt(move, 50) && ((typeof well === 'number' && well <= 50) || lt(stability, 40))) {
    out.push({
      id: 'movimento-emocao',
      kind: 'cascata',
      title: 'Pouco movimento e emoções mais pesadas',
      modules: ['Corpo', 'Personalidade'],
      strength: 'forte',
      seen: `Movimento em ${move}${typeof well === 'number' && well <= 50 ? `, bem-estar em ${well}` : ''}${lt(stability, 40) ? `, estabilidade emocional em ${stability}` : ''}.`,
      why: 'Atividade física regular é um dos recursos com melhor evidência para humor e ansiedade, com efeito já em caminhadas.',
      links: [...(typeof well === 'number' && well <= 50 ? [{ from: 'movimento' as ResNodeId, to: 'bemestar' as ResNodeId }] : []), ...(lt(stability, 40) ? [{ from: 'movimento' as ResNodeId, to: 'estabilidade' as ResNodeId }] : [])]
    });
  }
  const wake = s.body?.respostas?.despertar === 'mesmo';
  if (lt(stability, 40) && wake) {
    out.push({
      id: 'emocao-despertar',
      kind: 'tensao',
      title: 'Emoções intensas e despertares no mesmo horário',
      modules: ['Personalidade', 'Corpo'],
      strength: 'moderada',
      seen: `Estabilidade emocional em ${stability} e despertar recorrente durante a noite.`,
      why: 'Estresse e preocupação ativam o sistema de alerta e podem antecipar o despertar, sobretudo na segunda metade da noite.',
      links: [{ from: 'estabilidade', to: 'sono' }]
    });
  }
  if (ge(openness, 65) && (ge(mind('criatividade'), 60) || ge(mind('curiosidade'), 60))) {
    out.push({
      id: 'abertura-criatividade',
      kind: 'forca',
      title: 'Uma força que se confirma: abertura e criatividade',
      modules: ['Personalidade', 'Mente'],
      strength: 'forte',
      seen: `Abertura em ${openness}${ge(mind('criatividade'), 60) ? `, criatividade em ${mind('criatividade')}` : ''}${ge(mind('curiosidade'), 60) ? `, curiosidade em ${mind('curiosidade')}` : ''}.`,
      why: 'Abertura a experiências é o traço de personalidade mais ligado à criatividade e ao gosto por aprender.',
      links: [...(ge(mind('criatividade'), 60) ? [{ from: 'abertura' as ResNodeId, to: 'criatividade' as ResNodeId }] : []), ...(ge(mind('curiosidade'), 60) ? [{ from: 'abertura' as ResNodeId, to: 'curiosidade' as ResNodeId }] : [])]
    });
  }
  const orgGap = c.gaps.find((g) => g.id === 'C');
  if (orgGap && orgGap.gap >= 16 && c.life && c.life.composite < 50) {
    out.push({
      id: 'organizacao-alinhamento',
      kind: 'tensao',
      title: 'Querer mais organização e viver longe do que importa',
      modules: ['Personalidade', 'Propósito'],
      strength: 'possível',
      seen: `Você quer ser mais organizado(a) (+${orgGap.gap}) e o índice de vida valorizada está em ${c.life.composite}.`,
      why: 'Organizar a rotina em torno do que é importante é um caminho prático para aproximar valores e ações.',
      links: [{ from: 'organizacao', to: 'vida' }]
    });
  }
  if (c.values && c.life) {
    const rel = c.values.groups.find((g) => g.id === 'interativa');
    const relGaps = c.life.areas.filter((x) => ['familia', 'casal', 'amizades'].includes(x.id) && x.gap >= 3);
    if (rel && c.values.top.includes('interativa') && relGaps.length) {
      out.push({
        id: 'relacoes',
        kind: 'tensao',
        title: 'Relações no topo dos valores, mas pouco vividas',
        modules: ['Propósito'],
        strength: 'moderada',
        seen: `Relações estão entre os seus valores mais fortes, e ${relGaps.map((x) => x.label.toLowerCase()).join(' e ')} ${relGaps.length > 1 ? 'têm' : 'tem'} distância de 3 ou mais entre importância e vivência.`,
        why: 'Relações próximas estão entre os fatores mais consistentes de bem-estar e saúde ao longo da vida.',
        links: [{ from: 'relacoes', to: 'vida' }]
      });
    }
    const health = s.purpose?.respostas?.v_saude;
    const bodyAvg = c.body ? avg(c.body.areas.map((a) => a.score)) : null;
    if (typeof health === 'number' && health >= 6 && typeof bodyAvg === 'number' && bodyAvg < 55) {
      out.push({
        id: 'valor-saude',
        kind: 'tensao',
        title: 'A saúde é um valor alto, e o corpo está pedindo',
        modules: ['Propósito', 'Corpo'],
        strength: 'possível',
        seen: `Você deu ${health} de 7 para saúde como valor, e a média das áreas do corpo está em ${bodyAvg}.`,
        why: 'Quando um valor importante já está claro, a mudança de hábito costuma vir com mais força; a questão é o primeiro passo.',
        links: (() => {
          const ids = (['sono', 'movimento', 'bemestar'] as ResNodeId[]).filter((id) => typeof area(id) === 'number');
          const low = ids.filter((id) => lt(area(id), 55));
          const pick = low.length ? low : ids.sort((x, y) => (area(x) as number) - (area(y) as number)).slice(0, 1);
          return pick.map((to) => ({ from: 'saude' as ResNodeId, to }));
        })()
      });
    }
  }
  if (c.mlq && c.mlq.presence <= 20 && typeof well === 'number' && well <= 50) {
    out.push({
      id: 'sentido-bemestar',
      kind: 'cascata',
      title: 'Sentido e bem-estar baixos ao mesmo tempo',
      modules: ['Propósito', 'Corpo'],
      strength: 'moderada',
      seen: `Presença de sentido em ${c.mlq.presence} de 35 e bem-estar em ${well}.`,
      why: 'Sentir que a vida tem sentido está associado a mais bem-estar; os dois costumam melhorar juntos.',
      links: [{ from: 'sentido', to: 'bemestar' }]
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Camada 4: O que as tradições repetem (Cinco Elementos)
// ---------------------------------------------------------------------------

export type AnyElement = ChineseElement | 'Ar';

export interface ElementMention {
  element: AnyElement;
  source: string;
  note: string;
  sign: 'forte' | 'atencao';
}

const WAKE_ELEMENT: Record<number, ChineseElement> = { 21: 'Fogo', 23: 'Madeira', 1: 'Madeira', 3: 'Metal', 5: 'Metal' };

export function elementMentions(s: Sources, c: Computed): ElementMention[] {
  const out: ElementMention[] = [];
  const ch = s.traditions?.chinese;
  if (ch) {
    const entries = Object.entries(ch.elements) as [ChineseElement, number][];
    const max = Math.max(...entries.map(([, v]) => v));
    entries
      .filter(([, v]) => v === max && v > 0)
      .forEach(([e, v]) => out.push({ element: e, source: 'Mapa chinês', note: `elemento mais presente (${v} vezes nos quatro pilares)`, sign: 'forte' }));
    entries.filter(([, v]) => v === 0).forEach(([e]) => out.push({ element: e, source: 'Mapa chinês', note: 'elemento ausente nos quatro pilares', sign: 'atencao' }));
  }
  if (c.shen) {
    const sorted = [...c.shen].sort((a, b) => a.value - b.value);
    const min = sorted[0].value;
    const max = sorted[sorted.length - 1].value;
    if (max > min) {
      sorted.filter((x) => x.value === min).forEach((x) => out.push({ element: x.element as ChineseElement, source: 'Cinco Espíritos', note: `${x.spirit} mais fraco (${x.aspect})`, sign: 'atencao' }));
      sorted.filter((x) => x.value === max).forEach((x) => out.push({ element: x.element as ChineseElement, source: 'Cinco Espíritos', note: `${x.spirit} mais forte (${x.aspect})`, sign: 'forte' }));
    }
  }
  // Astrologia ocidental: elemento dominante e elementos com pouca presença
  const w = s.traditions?.western;
  if (w && w.elementPoints > 0) {
    const entries = Object.entries(w.elements) as ['Fogo' | 'Terra' | 'Ar' | 'Água', number][];
    const max = Math.max(...entries.map(([, v]) => v));
    entries
      .filter(([, v]) => v === max)
      .forEach(([e, v]) => {
        out.push({ element: e, source: 'Mapa natal', note: `elemento mais forte (${v} de ${w.elementPoints} pontos)`, sign: 'forte' });
        // Ponte: o Ar ocidental conversa com o vento, que na MTC pertence à Madeira
        if (e === 'Ar') out.push({ element: 'Madeira', source: 'Mapa natal (Ar ↔ vento)', note: `Ar em destaque (${v} de ${w.elementPoints} pontos), lido como vento da Madeira`, sign: 'forte' });
      });
    entries
      .filter(([, v]) => v / w.elementPoints <= 0.125)
      .forEach(([e, v]) => out.push({ element: e, source: 'Mapa natal', note: `pouco presente (${v} de ${w.elementPoints} pontos)`, sign: 'atencao' }));
  }
  // Numerologia: os três temas que ela confirma ou não
  if (s.traditions) {
    for (const t of integrationThemes(s.traditions)) {
      const el: ChineseElement = t.id === 'raiz' ? 'Terra' : t.id === 'intuicao' ? 'Água' : 'Fogo';
      if (t.numerology.supports) out.push({ element: el, source: 'Numerologia', note: `confirma “${t.title.toLowerCase()}” (${t.numerology.text})`, sign: 'forte' });
      else if (t.id === 'raiz') out.push({ element: 'Terra', source: 'Numerologia', note: `não confirma “enraizamento e estrutura” (${t.numerology.text})`, sign: 'atencao' });
    }
  }
  const b = s.body?.respostas;
  if (b?.despertar === 'mesmo' && typeof b.despertar_horario === 'number') {
    const w = WAKE_WINDOWS.find((x) => x.start === b.despertar_horario);
    const e = WAKE_ELEMENT[b.despertar_horario as number];
    if (w && e) out.push({ element: e, source: 'Relógio dos órgãos', note: `despertar ${w.label.toLowerCase()} (${w.organ})`, sign: 'atencao' });
  }
  const digest = typeof b?.inchaco === 'number' ? (b.inchaco as number) + ((b.azia as number) ?? 0) + ((b.gases as number) ?? 0) : 0;
  if (digest >= 4) out.push({ element: 'Terra', source: 'Digestão', note: 'inchaço, azia ou gases frequentes (Baço e Estômago)', sign: 'atencao' });
  return out;
}

export interface ElementEcho {
  element: AnyElement;
  mentions: ElementMention[];
  attention: number;
  strength: number;
}

/** Elementos citados por duas ou mais fontes diferentes */
export function elementEchoes(mentions: ElementMention[]): ElementEcho[] {
  const els: AnyElement[] = ['Madeira', 'Fogo', 'Terra', 'Metal', 'Água', 'Ar'];
  return els
    .map((e) => {
      const m = mentions.filter((x) => x.element === e);
      return { element: e, mentions: m, attention: m.filter((x) => x.sign === 'atencao').length, strength: m.filter((x) => x.sign === 'forte').length };
    })
    .filter((x) => new Set(x.mentions.map((m) => m.source)).size >= 2)
    .sort((a, b) => b.mentions.length - a.mentions.length);
}

/** Os três temas das tradições (ocidental, chinesa e numerologia), com os votos de cada uma */
export function traditionThemes(s: Sources): IntegrationTheme[] {
  return s.traditions ? integrationThemes(s.traditions) : [];
}

// ---------------------------------------------------------------------------
// Padrão “muito vento, pouca raiz” (Ar/Madeira em destaque e Terra fraca)
// ---------------------------------------------------------------------------

export interface WindRootPattern {
  windSources: string[];
  rootSources: string[];
  stability?: number;
  /** Despertar recorrente nas horas da Madeira (23h–1h Vesícula, 1h–3h Fígado) */
  woodWake?: string;
}

export function windRootPattern(mentions: ElementMention[], c: Computed, s?: Sources): WindRootPattern | null {
  const wind = mentions.filter((m) => m.sign === 'forte' && (m.element === 'Ar' || m.element === 'Madeira'));
  const root = mentions.filter((m) => m.sign === 'atencao' && m.element === 'Terra');
  const windSources = Array.from(new Set(wind.map((m) => m.source.replace(' (Ar ↔ vento)', ''))));
  const rootSources = Array.from(new Set(root.map((m) => m.source)));
  if (!windSources.length || rootSources.length < 2) return null;
  const b = s?.body?.respostas;
  const w = b?.despertar === 'mesmo' ? WAKE_WINDOWS.find((x) => x.start === b.despertar_horario && (x.start === 23 || x.start === 1)) : undefined;
  return {
    windSources,
    rootSources,
    stability: c.traits?.find((t) => t.id === 'N')?.score,
    woodWake: w ? `${w.label.toLowerCase()}, o horário ${w.of}` : undefined
  };
}
