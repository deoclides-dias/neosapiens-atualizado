// src/lib/psique/psique.ts
// Mapa da Psique: o motor de proeminência das quatro perguntas e a Janela de
// Johari. Especificação no documento "Mapa e Psique" (seções 6 a 8).
// Regras fixas e visíveis; o símbolo nunca explica o teste, só pergunta.

import type { PlanetId, PlanetPosition, WesternChart } from '../astro/types';
import { PLANETS, SIGNS, TRADITIONAL_RULER } from '../astro/western';
import { SIGN_KEYWORDS } from '../astro/interpretation';
import { PsychologicalResult, scoreTraits, TraitId, TRAITS, GAP_THRESHOLD } from '../psych/miniIpip';

export const ORB_TIGHT = 3;
export const ORB_MODERATE = 6;
export const ORB_ANGLE = 5;

const norm = (x: number) => ((x % 360) + 360) % 360;
const dist = (a: number, b: number) => {
  const d = Math.abs(norm(a) - norm(b));
  return d > 180 ? 360 - d : d;
};
const name = (id: PlanetId) => PLANETS.find((p) => p.id === id)!.name;
const art = (id: PlanetId) => (id === 'Sun' ? 'o Sol' : id === 'Moon' ? 'a Lua' : name(id));

export const PLANET_MEANING: Record<PlanetId, string> = {
  Sun: 'a identidade que você busca',
  Moon: 'as necessidades que pedem cuidado',
  Mercury: 'o jeito de pensar e de contar a própria história',
  Venus: 'o desejo e o modo de se vincular',
  Mars: 'o impulso, a coragem e a raiva',
  Jupiter: 'os ideais e o que faz crescer',
  Saturn: 'a lei, o limite e a cobrança',
  Uranus: 'a rebeldia e a necessidade de liberdade',
  Neptune: 'o sonho e a dissolução das fronteiras',
  Pluto: 'a intensidade e a transformação'
};

export const HOUSE_MEANING: Record<number, string> = {
  1: 'o corpo e o jeito de chegar',
  2: 'os recursos e o que você valoriza',
  3: 'a fala e o entorno próximo',
  4: 'o lar e as raízes',
  5: 'a criação e o prazer',
  6: 'a rotina e o cuidado',
  7: 'as parcerias e o outro',
  8: 'a intimidade e as crises',
  9: 'as crenças e os horizontes',
  10: 'a vocação e a imagem pública',
  11: 'os grupos e os projetos',
  12: 'o que fica nos bastidores'
};

const ASPECT_NAME: Record<string, string> = {
  conjuncao: 'conjunção',
  oposicao: 'oposição',
  quadratura: 'quadratura',
  trigono: 'trígono',
  sextil: 'sextil',
  quintil: 'quintil'
};

export interface Indicator {
  /** Rótulo curto ("Sol em Peixes na casa 1") */
  label: string;
  /** Leitura em linguagem de hipótese */
  reading: string;
}

export type BlockId = 'eu' | 'outros' | 'cultura' | 'pulsa';

export interface PsiqueBlock {
  id: BlockId;
  question: string;
  instance: string;
  protagonist: Indicator;
  modulators: Indicator[];
  compass: string;
  /** "Como escolhemos": a regra que levou ao destaque */
  rule: string;
}

const placed = (p: PlanetPosition) => `${p.name} em ${p.sign} na casa ${p.house}`;
const planetReading = (p: PlanetPosition) =>
  `Na leitura simbólica, ${PLANET_MEANING[p.id]} se expressa com ${SIGN_KEYWORDS[p.sign]}, sobretudo em ${HOUSE_MEANING[p.house]}.`;

function angleOf(p: PlanetPosition, c: WesternChart): string | null {
  const angles: [string, number][] = [
    ['Ascendente', c.ascendant.lon],
    ['Meio do Céu', c.midheaven.lon],
    ['Descendente', norm(c.ascendant.lon + 180)],
    ['Fundo do Céu', norm(c.midheaven.lon + 180)]
  ];
  const hit = angles.map(([n, lon]) => ({ n, d: dist(p.lon, lon) })).filter((x) => x.d <= ORB_ANGLE).sort((a, b) => a.d - b.d)[0];
  return hit ? hit.n : null;
}

/** Aspectos de um planeta, com o outro planeta, ordenados por órbita (mais apertado primeiro) */
function aspectsOf(id: PlanetId, c: WesternChart, types: string[], maxOrb: number) {
  return c.aspects
    .filter((a) => (a.a === id || a.b === id) && types.includes(a.type) && a.orb <= maxOrb)
    .map((a) => ({ other: (a.a === id ? a.b : a.a) as PlanetId, type: a.type, orb: a.orb }))
    .sort((x, y) => x.orb - y.orb);
}

const TENSE = ['quadratura', 'oposicao'];
const orbTxt = (o: number) => `${o.toFixed(1).replace('.', ',')}°`;

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function psiqueBlocks(c: WesternChart): PsiqueBlock[] {
  const P = (id: PlanetId) => c.planets.find((p) => p.id === id)!;
  const sun = P('Sun');
  const moon = P('Moon');
  const mars = P('Mars');
  const saturn = P('Saturn');
  const jupiter = P('Jupiter');

  // 1. Como você se vê: Sol
  const eu: Indicator[] = [];
  aspectsOf('Sun', c, ['conjuncao'], ORB_ANGLE).slice(0, 1).forEach((x) =>
    eu.push({ label: `${name(x.other)} junto ao Sol (${orbTxt(x.orb)})`, reading: `${cap(PLANET_MEANING[x.other])} se mistura à identidade: difícil separar uma coisa da outra.` })
  );
  aspectsOf('Sun', c, TENSE, ORB_MODERATE).slice(0, 1).forEach((x) =>
    eu.push({ label: `${cap(ASPECT_NAME[x.type])} entre o Sol e ${art(x.other)} (${orbTxt(x.orb)})`, reading: `Um atrito simbólico entre a identidade e ${PLANET_MEANING[x.other]}.` })
  );
  if (eu.length < 2) {
    const merc = P('Mercury');
    eu.push({ label: placed(merc), reading: `Mercúrio fala do jeito de contar a própria história: aqui, com ${SIGN_KEYWORDS[merc.sign]}.` });
  }
  const blockEu: PsiqueBlock = {
    id: 'eu',
    question: 'Como você se vê',
    instance: 'Eu',
    protagonist: { label: placed(sun), reading: planetReading(sun) },
    modulators: eu.slice(0, 2),
    compass: 'Quando você se sente mais você, o que está fazendo?',
    rule: 'O Sol é sempre o protagonista. Moduladores: um planeta em conjunção com o Sol (até 5°), depois a quadratura ou oposição mais apertada ao Sol (até 6°), e Mercúrio para completar.'
  };

  // 2. Como os outros veem você: Ascendente + regente
  const rulerId = TRADITIONAL_RULER[c.ascendant.signIndex];
  const ruler = P(rulerId);
  const outros: Indicator[] = [
    { label: `Regente do Ascendente: ${placed(ruler)}`, reading: `O \"porta-voz\" da primeira impressão: ${PLANET_MEANING[rulerId]}, levado para ${HOUSE_MEANING[ruler.house]}.` }
  ];
  c.planets
    .filter((p) => p.id !== rulerId)
    .map((p) => ({ p, a: angleOf(p, c) }))
    .filter((x) => x.a === 'Ascendente' || x.a === 'Descendente')
    .slice(0, 1)
    .forEach(({ p, a }) =>
      outros.push({
        label: `${p.name} junto ao ${a}`,
        reading:
          a === 'Ascendente'
            ? `${PLANET_MEANING[p.id]} fica à flor da pele: costuma ser visto antes de você dizer qualquer coisa.`
            : `${PLANET_MEANING[p.id]} aparece no outro: é o que você tende a buscar, ou a enxergar, nas pessoas próximas.`
      })
    );
  if (outros.length < 2) {
    const h7 = c.planets.filter((p) => p.house === 7 && p.id !== rulerId)[0] ?? c.planets.filter((p) => p.house === 1 && p.id !== rulerId)[0];
    if (h7) outros.push({ label: placed(h7), reading: h7.house === 7 ? `Na casa das parcerias, ${PLANET_MEANING[h7.id]} tende a ser vivido através do outro.` : `Na casa 1, ${PLANET_MEANING[h7.id]} faz parte da sua presença.` });
  }
  const blockOutros: PsiqueBlock = {
    id: 'outros',
    question: 'Como os outros veem você',
    instance: 'Persona, a fronteira eu–outro',
    protagonist: { label: `Ascendente em ${c.ascendant.sign}`, reading: `Na leitura simbólica, a sua \"máscara social\" e a primeira impressão têm o tom de ${SIGN_KEYWORDS[c.ascendant.sign]}.` },
    modulators: outros.slice(0, 2),
    compass: 'O que as pessoas costumam perceber em você antes de você dizer qualquer coisa?',
    rule: 'O Ascendente e o seu regente tradicional são os protagonistas. Moduladores: um planeta a até 5° do Ascendente ou do Descendente; senão, um planeta na casa 7 ou na casa 1.'
  };

  // 3. Como a cultura pesa em você: Saturno (se ativado) ou Meio do Céu
  const satAngle = angleOf(saturn, c);
  const satLum = aspectsOf('Saturn', c, ['conjuncao', 'quadratura', 'oposicao'], ORB_TIGHT).filter((x) => x.other === 'Sun' || x.other === 'Moon');
  const satAc = [0, 90, 180].some((k) => Math.abs(dist(saturn.lon, c.ascendant.lon) - k) <= ORB_TIGHT);
  const satRules = TRADITIONAL_RULER[c.ascendant.signIndex] === 'Saturn' || TRADITIONAL_RULER[c.midheaven.signIndex] === 'Saturn';
  const satActive = Boolean(satAngle) || satLum.length > 0 || satAc || satRules;
  const satWhy = satAngle ? `junto ao ${satAngle}` : satLum.length ? `em ${ASPECT_NAME[satLum[0].type]} com ${art(satLum[0].other)} (${orbTxt(satLum[0].orb)})` : satAc ? 'em aspecto apertado com o Ascendente' : 'regente do Ascendente ou do Meio do Céu';
  const mcRuler = P(TRADITIONAL_RULER[c.midheaven.signIndex]);
  const cultura: Indicator[] = [];
  if (satActive) {
    cultura.push({ label: `Meio do Céu em ${c.midheaven.sign}`, reading: `O ideal que o mundo parece pedir tem o tom de ${SIGN_KEYWORDS[c.midheaven.sign]}.` });
  } else {
    cultura.push({ label: `Regente do Meio do Céu: ${placed(mcRuler)}`, reading: `O caminho até esse ideal passa por ${HOUSE_MEANING[mcRuler.house]}.` });
  }
  aspectsOf('Saturn', c, TENSE, ORB_MODERATE).slice(0, 1).forEach((x) =>
    cultura.push({ label: `${cap(ASPECT_NAME[x.type])} entre Saturno e ${art(x.other)} (${orbTxt(x.orb)})`, reading: `Um ponto simbólico onde a regra interna aperta ${PLANET_MEANING[x.other]}.` })
  );
  if (cultura.length < 2 && angleOf(jupiter, c)) cultura.push({ label: `Júpiter junto ao ${angleOf(jupiter, c)}`, reading: 'Os ideais ganham destaque: o que você acredita que deveria alcançar.' });
  const blockCultura: PsiqueBlock = {
    id: 'cultura',
    question: 'Como a cultura pesa em você',
    instance: 'Supereu cultural e Ideal do Eu',
    protagonist: satActive
      ? { label: `Saturno em ${saturn.sign} na casa ${saturn.house}, ${satWhy}`, reading: `Na leitura simbólica, a voz da regra interna está em destaque, com o tom de ${SIGN_KEYWORDS[saturn.sign]}.` }
      : { label: `Meio do Céu em ${c.midheaven.sign}`, reading: `Na leitura simbólica, o ideal que o mundo parece pedir tem o tom de ${SIGN_KEYWORDS[c.midheaven.sign]}.` },
    modulators: cultura.slice(0, 2),
    compass: satActive ? 'De quem é a voz que cobra você por dentro?' : 'Quem você gostaria que se orgulhasse do seu caminho?',
    rule: 'Saturno é o protagonista quando está ativado: a até 5° de um ângulo, em conjunção, quadratura ou oposição a até 3° do Sol, da Lua ou do Ascendente, ou regendo o Ascendente ou o Meio do Céu. Senão, o Meio do Céu.'
  };

  // 4. O que pulsa por baixo: Lua ou Marte (o mais tensionado)
  const tension = (id: PlanetId) => aspectsOf(id, c, TENSE, ORB_MODERATE).length;
  const pulse = tension('Mars') > tension('Moon') ? mars : moon;
  const pulsa: Indicator[] = [];
  const hard = c.patterns.find((p) => (p.type === 'tQuadrada' || p.type === 'grandeCruz') && p.planets.some((x) => ['Moon', 'Mars', 'Venus'].includes(x)));
  if (hard) {
    pulsa.push({
      label: `${hard.type === 'tQuadrada' ? 'T-Quadrada' : 'Grande Cruz'} com ${hard.planets.map(name).join(', ')}`,
      reading: 'Uma configuração de muita tensão simbólica: forças que se puxam em direções diferentes e pedem algum arranjo.'
    });
  } else {
    aspectsOf(pulse.id, c, TENSE, ORB_TIGHT).slice(0, 1).forEach((x) =>
      pulsa.push({ label: `${cap(ASPECT_NAME[x.type])} entre ${art(pulse.id)} e ${art(x.other)} (${orbTxt(x.orb)})`, reading: `Um atrito simbólico apertado entre ${PLANET_MEANING[pulse.id]} e ${PLANET_MEANING[x.other]}.` })
    );
  }
  const h12 = c.planets.filter((p) => p.house === 12 && !['Uranus', 'Neptune', 'Pluto'].includes(p.id));
  const ic = c.planets.find((p) => angleOf(p, c) === 'Fundo do Céu');
  if (h12.length) pulsa.push({ label: `${h12.map((p) => p.name).join(', ')} na casa 12`, reading: 'Na tradição, a casa 12 guarda o que fica nos bastidores: forças que agem sem ser vistas.' });
  else if (ic) pulsa.push({ label: `${ic.name} junto ao Fundo do Céu`, reading: `${cap(PLANET_MEANING[ic.id])} ligado às raízes e à família de origem.` });
  const blockPulsa: PsiqueBlock = {
    id: 'pulsa',
    question: 'O que pulsa por baixo',
    instance: 'Isso e defesas',
    protagonist: { label: placed(pulse), reading: planetReading(pulse) },
    modulators: pulsa.slice(0, 2),
    compass: pulse.id === 'Moon' ? 'O que acalma você quando ninguém está olhando?' : 'Onde a sua raiva tem razão, e onde ela só protege?',
    rule: 'Protagonista: a Lua ou Marte, o que tiver mais quadraturas e oposições até 6° (empate: a Lua). Moduladores: uma T-Quadrada ou Grande Cruz envolvendo Lua, Marte ou Vênus (ou a tensão mais apertada, até 3°); depois planetas pessoais ou sociais na casa 12, ou um planeta junto ao Fundo do Céu.'
  };

  return [blockEu, blockOutros, blockCultura, blockPulsa];
}

// ---------------------------------------------------------------------------
// Janela de Johari (Luft e Ingham, 1955)
// ---------------------------------------------------------------------------

export interface JohariTrait {
  id: TraitId;
  name: string;
  self: number;
  other: number;
  diff: number;
}

export interface Johari {
  mode: 'com_alguem' | 'sozinho';
  relation?: string;
  open: JohariTrait[];
  blind: JohariTrait[];
  hidden: JohariTrait[];
}

/** Diferença de pelo menos 16 pontos (margem da diferença entre dois escores) */
export function johari(r: PsychologicalResult): Johari | null {
  if (!r.outro) return null;
  const self = scoreTraits(r.respostas);
  const other = scoreTraits(r.outro.respostas);
  const rows: JohariTrait[] = TRAITS.map((t) => {
    const s = self.find((x) => x.id === t.id)!.score;
    const o = other.find((x) => x.id === t.id)!.score;
    return { id: t.id, name: t.name, self: s, other: o, diff: o - s };
  });
  return {
    mode: r.outro.modo,
    relation: r.outro.relacao,
    open: rows.filter((x) => Math.abs(x.diff) < GAP_THRESHOLD),
    blind: rows.filter((x) => x.diff >= GAP_THRESHOLD),
    hidden: rows.filter((x) => x.diff <= -GAP_THRESHOLD)
  };
}

export const signName = (i: number) => SIGNS[i];
