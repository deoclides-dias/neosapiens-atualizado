// src/lib/astro/interpretation.ts
// Textos curtos (v1) e regras da Integração. Tudo aqui é leitura simbólica
// das tradições; as regras de integração são explícitas para revisão.

import type {
  ChartPattern, ChineseChart, ChineseElement, NumerologyChart, PlanetId,
  TraditionsResult, WesternChart, WesternElement
} from './types';
import { PLANETS, SIGN_ELEMENTS } from './western';

const planetName = (id: PlanetId) => PLANETS.find((p) => p.id === id)?.name || id;
/** "o Sol", "a Lua", "Mercúrio"… (Sol e Lua levam artigo) */
const withArticle = (id: PlanetId) => (id === 'Sun' ? 'o Sol' : id === 'Moon' ? 'a Lua' : planetName(id));
const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;

// ---------------------------------------------------------------------------
// Ocidental
// ---------------------------------------------------------------------------
export const SIGN_KEYWORDS: Record<string, string> = {
  Áries: 'iniciativa e coragem', Touro: 'estabilidade e sensorialidade', Gêmeos: 'curiosidade e comunicação',
  Câncer: 'cuidado e memória afetiva', Leão: 'expressão e generosidade', Virgem: 'análise e aperfeiçoamento',
  Libra: 'equilíbrio e relação', Escorpião: 'intensidade e transformação', Sagitário: 'expansão e sentido',
  Capricórnio: 'estrutura e realização', Aquário: 'originalidade e visão coletiva', Peixes: 'sensibilidade e imaginação'
};

export const WESTERN_ELEMENT_TEXT: Record<WesternElement, string> = {
  Fogo: 'ação, entusiasmo, impulso', Terra: 'concretude, constância, corpo',
  Ar: 'ideias, conexões, linguagem', Água: 'emoção, intuição, empatia'
};

export function sunHorizonText(chart: WesternChart): string {
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  if (sun.house === 12 || sun.house === 1) {
    return sun.house === 1
      ? 'O Sol estava logo abaixo do horizonte leste: você nasceu pouco antes do nascer do Sol.'
      : 'O Sol tinha acabado de nascer no horizonte leste.';
  }
  if (sun.house === 6 || sun.house === 7) return 'O Sol estava próximo do horizonte oeste, perto do pôr do sol.';
  return sun.house >= 7 ? 'Nascimento diurno: o Sol estava acima do horizonte.' : 'Nascimento noturno: o Sol estava abaixo do horizonte.';
}

/** Junta Grandes Trígonos que só diferem por um planeta em conjunção. */
export function groupedPatterns(chart: WesternChart): ChartPattern[] {
  const out: ChartPattern[] = [];
  chart.patterns.forEach((p) => {
    if (p.type === 'grandeTrigono') {
      const same = out.find((q) => q.type === 'grandeTrigono' && q.planets.filter((id) => p.planets.includes(id)).length >= 2);
      if (same) {
        same.planets = Array.from(new Set([...same.planets, ...p.planets]));
        return;
      }
    }
    out.push({ ...p, planets: [...p.planets] });
  });
  return out;
}

export function patternTitle(p: ChartPattern): string {
  switch (p.type) {
    case 'grandeTrigono': return p.detail ? `Grande Trígono em ${p.detail}` : 'Grande Trígono';
    case 'pipa': return `Pipa apontando para ${withArticle(p.focus!)}`;
    case 'tQuadrada': return `T-Quadrada com ${planetName(p.focus!)} no ápice`;
    case 'grandeCruz': return 'Grande Cruz';
    case 'stellium': return `Stellium em ${p.detail}`;
  }
}

export function patternText(p: ChartPattern, chart: WesternChart): string {
  const names = list(p.planets.map(planetName));
  switch (p.type) {
    case 'grandeTrigono':
      return `${names} se ligam por trígonos, formando um triângulo de fluxo fácil${p.detail ? ` no elemento ${p.detail}` : ''}.`;
    case 'pipa': {
      const op = p.planets.filter((id) => id !== p.focus);
      return `${planetName(p.focus!)} faz oposição a um vértice do trígono (${list(op.map(planetName))}) e sextil aos outros dois: é a ponta que dá direção ao triângulo.`;
    }
    case 'tQuadrada':
      return `${list(p.planets.filter((id) => id !== p.focus).map(planetName))} estão em oposição, e ${planetName(p.focus!)} faz quadratura aos dois: um ponto de tensão que pede ação.`;
    case 'grandeCruz':
      return `${names} formam duas oposições cruzadas em quadratura: muita tensão, muita força.`;
    case 'stellium': {
      const sign = chart.planets.find((x) => x.id === p.planets[0])!.sign;
      return `${names} concentrados em ${sign}: ${SIGN_KEYWORDS[sign]} em destaque.`;
    }
  }
}

// ---------------------------------------------------------------------------
// Chinesa
// ---------------------------------------------------------------------------
export const ANIMAL_TEXT: Record<string, string> = {
  Rato: 'engenhosidade e senso de oportunidade', Boi: 'persistência e confiabilidade', Tigre: 'coragem e independência',
  Coelho: 'diplomacia e sensibilidade', Dragão: 'vitalidade e ambição', Serpente: 'sabedoria e discrição',
  Cavalo: 'liberdade e movimento', Cabra: 'criatividade e gentileza', Macaco: 'inteligência e versatilidade',
  Galo: 'precisão e franqueza', Cão: 'lealdade e senso de justiça', Porco: 'generosidade e prazer de viver'
};

const STEM_TEXT: Record<string, string> = {
  'Madeira-Yang': 'a da árvore: crescimento reto, firme e de longo prazo',
  'Madeira-Yin': 'a da trepadeira e do bambu: flexível, persistente, cresce contornando obstáculos',
  'Fogo-Yang': 'a do Sol: calor generoso que ilumina tudo ao redor',
  'Fogo-Yin': 'a da vela: luz delicada, focada e íntima',
  'Terra-Yang': 'a da montanha: estável, protetora, difícil de mover',
  'Terra-Yin': 'a do campo cultivado: nutridora, receptiva e fértil',
  'Metal-Yang': 'a do machado: decidido, justo e direto',
  'Metal-Yin': 'a da joia: refinado, exigente e preciso',
  'Água-Yang': 'a do rio: força que flui e não para',
  'Água-Yin': 'a do orvalho: sutil, intuitiva e adaptável'
};

export function dayMasterText(c: ChineseChart): string {
  return `No Bāzì, o tronco do dia representa a própria pessoa. A ${c.day.stemElement} ${c.day.yin ? 'Yin' : 'Yang'} é ${STEM_TEXT[`${c.day.stemElement}-${c.day.yin ? 'Yin' : 'Yang'}`]}.`;
}

const GENERATES: Record<ChineseElement, ChineseElement> = { Madeira: 'Fogo', Fogo: 'Terra', Terra: 'Metal', Metal: 'Água', Água: 'Madeira' };
const CONTROLS: Record<ChineseElement, ChineseElement> = { Madeira: 'Terra', Terra: 'Água', Água: 'Fogo', Fogo: 'Metal', Metal: 'Madeira' };

export function chineseBalanceText(c: ChineseChart): string {
  const entries = Object.entries(c.elements) as [ChineseElement, number][];
  const [top] = [...entries].sort((a, b) => b[1] - a[1]);
  const absent = entries.filter(([, n]) => n === 0).map(([e]) => e);
  const nourisher = (Object.keys(GENERATES) as ChineseElement[]).find((e) => GENERATES[e] === top[0])!;
  const controller = (Object.keys(CONTROLS) as ChineseElement[]).find((e) => CONTROLS[e] === top[0])!;

  // Fogo e Metal são masculinos; Madeira, Terra e Água, femininos
  const masc = top[0] === 'Fogo' || top[0] === 'Metal';
  const art = masc ? 'O' : 'A', pron = masc ? 'o' : 'a';
  let text = `${art} ${top[0]} ocupa ${top[1]} dos 8 caracteres.`;
  if (absent.length) {
    const notes: string[] = [];
    if (absent.includes(nourisher)) notes.push(`${nourisher}, que ${pron} nutre,`);
    if (absent.includes(controller)) notes.push(`${controller}, que ${pron} contém,`);
    const others = absent.filter((e) => e !== nourisher && e !== controller);
    const all = [...notes, ...others];
    const verb = absent.length > 1 ? 'estão ausentes' : 'está ausente';
    // "Água, que a nutre, e Metal, que a contém, estão ausentes."
    text += ` ${list(all)} ${verb}.`.replace(/,,/g, ',').replace(/,( e |, )/g, ',$1').replace(/,,/g, ',');
  }
  return text;
}

// ---------------------------------------------------------------------------
// Numerologia
// ---------------------------------------------------------------------------
export const NUMBER_TEXT: Record<number, { title: string; text: string }> = {
  1: { title: 'o Pioneiro', text: 'iniciativa, independência e liderança' },
  2: { title: 'o Mediador', text: 'cooperação, escuta e sensibilidade' },
  3: { title: 'o Comunicador', text: 'expressão, criatividade e alegria' },
  4: { title: 'o Construtor', text: 'método, disciplina e fundação sólida' },
  5: { title: 'o Explorador', text: 'liberdade, mudança e curiosidade' },
  6: { title: 'o Guardião', text: 'cuidado, responsabilidade e harmonia' },
  7: { title: 'o Investigador', text: 'introspecção, estudo e busca de sentido' },
  8: { title: 'o Realizador', text: 'gestão, poder e recursos materiais' },
  9: { title: 'o Humanitário', text: 'compaixão, visão ampla e encerramento de ciclos' },
  11: { title: 'o Iluminador', text: 'intuição e inspiração; a sensibilidade do 2 em uma oitava mais alta' },
  22: { title: 'o Mestre Construtor', text: 'grandes obras concretas; o método do 4 em escala coletiva' },
  33: { title: 'o Mestre Mentor', text: 'serviço e ensino; o cuidado do 6 em escala ampliada' }
};

export const PERSONAL_YEAR_TEXT: Record<number, string> = {
  1: 'novos começos', 2: 'parcerias e paciência', 3: 'expressão e criatividade', 4: 'construção e trabalho',
  5: 'mudanças e liberdade', 6: 'cuidado e família', 7: 'introspecção e estudo', 8: 'colheita e realização', 9: 'fechamento de ciclo'
};

export const ARROW_TEXT: Record<string, string> = {
  '123': 'organizar ideias e planejar antes de agir',
  '456': 'força de vontade e persistência',
  '789': 'capacidade de pôr os planos em prática',
  '369': 'boa memória e raciocínio',
  '258': 'equilíbrio emocional e sensibilidade artística',
  '147': 'habilidade com as mãos e com o mundo concreto',
  '159': 'persistência para levar os projetos até o fim',
  '357': 'serenidade, compaixão e espiritualidade'
};

export const MISSING_TEXT: Record<number, string> = {
  1: 'autoafirmação', 2: 'cooperação', 3: 'expressão', 4: 'organização prática',
  5: 'liberdade e adaptação', 6: 'cuidado e responsabilidade com os outros',
  7: 'introspecção', 8: 'gestão de recursos e poder', 9: 'idealismo e visão ampla'
};

// ---------------------------------------------------------------------------
// Integração: regras explícitas (v1)
// ---------------------------------------------------------------------------
export interface ThemeEvidence {
  supports: boolean;
  text: string;
}

export interface IntegrationTheme {
  id: string;
  title: string;
  western: ThemeEvidence;
  chinese: ThemeEvidence;
  numerology: ThemeEvidence;
  /** Quantas tradições confirmam (0–3) */
  strength: number;
  /** Alguma tradição diverge das outras */
  divergent: boolean;
  /** Ponte sugerida para a dimensão psicológica */
  bridge: string;
}

const pct = (n: number, total: number) => (total ? n / total : 0);

export function integrationThemes(r: TraditionsResult): IntegrationTheme[] {
  const w = r.western, c = r.chinese, n = r.numerology;
  const wp = w.elementPoints;
  const core = [n.lifePath, n.expression];
  const sun = w.planets.find((p) => p.id === 'Sun')!;
  const moon = w.planets.find((p) => p.id === 'Moon')!;
  const isWater = (signIndex: number) => SIGN_ELEMENTS[signIndex % 4] === 'Água';
  const arrow = (id: string) => n.arrows.find((a) => a.id === id)?.complete;

  const themes: Omit<IntegrationTheme, 'strength' | 'divergent'>[] = [
    {
      id: 'movimento',
      title: 'Mente em movimento',
      // Ar + Fogo ≥ 50% · Madeira + Fogo ≥ 4 de 8 · Caminho ou Expressão em 1, 3 ou 5
      western: { supports: pct(w.elements.Ar + w.elements.Fogo, wp) >= 0.5, text: `Ar e Fogo em ${w.elements.Ar + w.elements.Fogo} de ${wp} pontos` },
      chinese: { supports: c.elements.Madeira + c.elements.Fogo >= 4, text: `Madeira e Fogo em ${c.elements.Madeira + c.elements.Fogo} de 8 caracteres` },
      numerology: { supports: core.some((x) => [1, 3, 5].includes(x)), text: `Caminho ${n.lifePath} · Expressão ${n.expression}` },
      bridge: 'Abertura à experiência (Big Five)'
    },
    {
      id: 'intuicao',
      title: 'Intuição e sensibilidade',
      // Água ≥ 25% ou Sol/Lua/AC em Água · Água ≥ 2 ou Mestre do Dia Yin · 2, 7, 9, 11 ou 33
      western: {
        supports: pct(w.elements.Água, wp) >= 0.25 || isWater(sun.signIndex) || isWater(moon.signIndex) || isWater(w.ascendant.signIndex),
        text: `Água em ${w.elements.Água} de ${wp} pontos · Sol em ${sun.sign}, Lua em ${moon.sign}, AC em ${w.ascendant.sign}`
      },
      chinese: { supports: c.elements.Água >= 2 || c.day.yin, text: `Mestre do Dia ${c.day.stemElement} ${c.day.yin ? 'Yin' : 'Yang'} · Água ${c.elements.Água}` },
      numerology: { supports: core.some((x) => [2, 7, 9, 11, 33].includes(x)), text: `Caminho ${n.lifePath} · Expressão ${n.expression}` },
      bridge: 'Amabilidade e sensibilidade emocional (Big Five)'
    },
    {
      id: 'raiz',
      title: 'Enraizamento e estrutura',
      // Terra ≥ 25% · Terra + Metal ≥ 3 · seta 1-4-7 completa ou 4, 8 ou 22 no núcleo
      western: { supports: pct(w.elements.Terra, wp) >= 0.25, text: `Terra em ${w.elements.Terra} de ${wp} pontos` },
      chinese: { supports: c.elements.Terra + c.elements.Metal >= 3, text: `Terra ${c.elements.Terra} · Metal ${c.elements.Metal}` },
      numerology: {
        supports: Boolean(arrow('147')) || core.some((x) => [4, 8, 22].includes(x)),
        text: arrow('147') ? 'Seta 1·4·7 completa (praticidade)' : `Caminho ${n.lifePath} · Expressão ${n.expression}`
      },
      bridge: 'Conscienciosidade (Big Five)'
    }
  ];

  return themes.map((t) => {
    const votes = [t.western.supports, t.chinese.supports, t.numerology.supports];
    const strength = votes.filter(Boolean).length;
    return { ...t, strength, divergent: strength > 0 && strength < 3 };
  });
}
