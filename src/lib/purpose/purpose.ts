// src/lib/purpose/purpose.ts
// Módulo Propósito em três camadas:
// potencial (valores), estado atual (sentido de vida, florescimento,
// vida valorizada) e meta (textos livres), mais a leitura dos Cinco
// Espíritos da Medicina Tradicional Chinesa. Perguntas, formatos e cálculos.

export type Answers = Record<string, number | string>;

// ---------- 1. Valores (inspirado na teoria funcionalista de Gouveia) ----------
// Frases do NeoSapiens; não é o Questionário dos Valores Básicos oficial.

export const VALUE_GROUPS = [
  { id: 'experimentacao', label: 'Experimentação', color: '#ea580c', desc: 'novidade, prazer e intensidade' },
  { id: 'realizacao', label: 'Realização', color: '#2563eb', desc: 'conquista, influência e reconhecimento' },
  { id: 'existencia', label: 'Existência', color: '#0891b2', desc: 'segurança, saúde e o básico garantido' },
  { id: 'suprapessoal', label: 'Além de si', color: '#7c3aed', desc: 'conhecimento, beleza e maturidade' },
  { id: 'interativa', label: 'Relações', color: '#db2777', desc: 'afeto, apoio e convivência' },
  { id: 'normativa', label: 'Normas', color: '#4d7c0f', desc: 'tradição, fé e dever' }
] as const;
export type ValueGroup = (typeof VALUE_GROUPS)[number]['id'];

export const VALUE_ITEMS: { id: string; name: string; text: string; group: ValueGroup }[] = [
  { id: 'v_emocao', name: 'Emoção', group: 'experimentacao', text: 'Viver experiências intensas e desafiadoras' },
  { id: 'v_exito', name: 'Êxito', group: 'realizacao', text: 'Alcançar meus objetivos e ser bem-sucedido(a)' },
  { id: 'v_saude', name: 'Saúde', group: 'existencia', text: 'Cuidar da saúde e estar bem fisicamente' },
  { id: 'v_conhecimento', name: 'Conhecimento', group: 'suprapessoal', text: 'Aprender e entender cada vez mais sobre o mundo' },
  { id: 'v_afetividade', name: 'Afetividade', group: 'interativa', text: 'Ter relações de amor e intimidade profundas' },
  { id: 'v_tradicao', name: 'Tradição', group: 'normativa', text: 'Respeitar as tradições e os costumes da minha comunidade' },
  { id: 'v_prazer', name: 'Prazer', group: 'experimentacao', text: 'Aproveitar a vida e satisfazer meus desejos' },
  { id: 'v_poder', name: 'Poder', group: 'realizacao', text: 'Ter influência e capacidade de decidir sobre as coisas' },
  { id: 'v_estabilidade', name: 'Estabilidade', group: 'existencia', text: 'Ter uma vida organizada, segura e previsível' },
  { id: 'v_beleza', name: 'Beleza', group: 'suprapessoal', text: 'Apreciar a arte, a natureza e o que é belo' },
  { id: 'v_apoio', name: 'Apoio', group: 'interativa', text: 'Saber que posso contar com as pessoas' },
  { id: 'v_religiosidade', name: 'Espiritualidade', group: 'normativa', text: 'Viver de acordo com a minha fé ou espiritualidade' },
  { id: 'v_novidade', name: 'Novidade', group: 'experimentacao', text: 'Buscar o novo e sair da rotina' },
  { id: 'v_prestigio', name: 'Prestígio', group: 'realizacao', text: 'Ser reconhecido(a) e admirado(a) pelo que faço' },
  { id: 'v_sobrevivencia', name: 'Segurança material', group: 'existencia', text: 'Ter garantidas as necessidades básicas (casa, comida, renda)' },
  { id: 'v_maturidade', name: 'Maturidade', group: 'suprapessoal', text: 'Crescer como pessoa e dar sentido à própria vida' },
  { id: 'v_convivencia', name: 'Convivência', group: 'interativa', text: 'Fazer parte de grupos e conviver com os outros' },
  { id: 'v_dever', name: 'Dever', group: 'normativa', text: 'Cumprir meus deveres e respeitar as regras' }
];

export const VALUE_SCALE = [
  { value: 1, label: 'Nada importante' },
  { value: 2, label: '' },
  { value: 3, label: '' },
  { value: 4, label: 'Mais ou menos' },
  { value: 5, label: '' },
  { value: 6, label: '' },
  { value: 7, label: 'Extremamente importante' }
];

// ---------- 2. Sentido de vida (MLQ, Steger et al., 2006) ----------
// Tradução do NeoSapiens. P = presença de sentido; B = busca de sentido.

export const MLQ_ITEMS: { id: string; text: string; dim: 'presenca' | 'busca'; reversed?: boolean }[] = [
  { id: 'm1', dim: 'presenca', text: 'Eu entendo o sentido da minha vida.' },
  { id: 'm2', dim: 'busca', text: 'Estou procurando algo que faça a minha vida ter sentido.' },
  { id: 'm3', dim: 'busca', text: 'Estou sempre buscando encontrar o propósito da minha vida.' },
  { id: 'm4', dim: 'presenca', text: 'A minha vida tem um propósito claro.' },
  { id: 'm5', dim: 'presenca', text: 'Tenho uma boa noção do que dá sentido à minha vida.' },
  { id: 'm6', dim: 'presenca', text: 'Descobri um propósito de vida que me satisfaz.' },
  { id: 'm7', dim: 'busca', text: 'Estou sempre procurando algo que torne a minha vida significativa.' },
  { id: 'm8', dim: 'busca', text: 'Estou buscando um propósito ou uma missão para a minha vida.' },
  { id: 'm9', dim: 'presenca', reversed: true, text: 'A minha vida não tem um propósito claro.' },
  { id: 'm10', dim: 'busca', text: 'Estou procurando um sentido para a minha vida.' }
];

export const TRUE_SCALE = [
  { value: 1, label: 'Totalmente falso' },
  { value: 2, label: 'Quase sempre falso' },
  { value: 3, label: 'Um pouco falso' },
  { value: 4, label: 'Nem falso nem verdadeiro' },
  { value: 5, label: 'Um pouco verdadeiro' },
  { value: 6, label: 'Quase sempre verdadeiro' },
  { value: 7, label: 'Totalmente verdadeiro' }
];

// ---------- 3. Vida valorizada (método de Wilson et al., 2010; perguntas próprias) ----------

export const LIFE_AREAS = [
  { id: 'familia', label: 'Família', hint: 'pais, irmãos e outros parentes' },
  { id: 'casal', label: 'Relação amorosa', hint: 'casamento ou namoro' },
  { id: 'filhos', label: 'Filhos e cuidado', hint: 'criar filhos ou cuidar de alguém' },
  { id: 'amizades', label: 'Amizades', hint: '' },
  { id: 'trabalho', label: 'Trabalho', hint: '' },
  { id: 'estudo', label: 'Estudo e crescimento', hint: 'aprender, se desenvolver' },
  { id: 'lazer', label: 'Lazer', hint: 'diversão, hobbies, descanso' },
  { id: 'espiritualidade', label: 'Espiritualidade', hint: 'como você a entende' },
  { id: 'comunidade', label: 'Comunidade', hint: 'cidadania, ajudar o próximo' },
  { id: 'saude', label: 'Saúde e corpo', hint: 'sono, alimentação, movimento' }
] as const;

// ---------- 4. Florescimento (Diener et al., 2010) ----------

export const FLOURISH_ITEMS = [
  { id: 'f1', text: 'Levo uma vida com propósito e sentido.' },
  { id: 'f2', text: 'Minhas relações sociais me apoiam e me fazem bem.' },
  { id: 'f3', text: 'Sou envolvido(a) e interessado(a) nas minhas atividades do dia a dia.' },
  { id: 'f4', text: 'Contribuo ativamente para a felicidade e o bem-estar dos outros.' },
  { id: 'f5', text: 'Sou competente e capaz nas atividades que são importantes para mim.' },
  { id: 'f6', text: 'Sou uma boa pessoa e levo uma boa vida.' },
  { id: 'f7', text: 'Sou otimista em relação ao meu futuro.' },
  { id: 'f8', text: 'As pessoas me respeitam.' }
];

export const AGREE7 = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 2, label: 'Discordo' },
  { value: 3, label: 'Discordo um pouco' },
  { value: 4, label: 'Nem concordo nem discordo' },
  { value: 5, label: 'Concordo um pouco' },
  { value: 6, label: 'Concordo' },
  { value: 7, label: 'Concordo totalmente' }
];

// ---------- 5. Cinco Espíritos (Wu Shen, Medicina Tradicional Chinesa) ----------

export const SHEN_ITEMS = [
  { id: 's_hun', spirit: 'Hun', element: 'Madeira', organ: 'Fígado', aspect: 'visão e direção', text: 'Tenho clareza de para onde quero ir na vida.' },
  { id: 's_shen', spirit: 'Shen', element: 'Fogo', organ: 'Coração', aspect: 'alegria e consciência', text: 'Sinto alegria e entusiasmo com o que vivo.' },
  { id: 's_yi', spirit: 'Yi', element: 'Terra', organ: 'Baço', aspect: 'intenção e foco', text: 'Consigo manter o foco e transformar ideias em ação.' },
  { id: 's_po', spirit: 'Po', element: 'Metal', organ: 'Pulmão', aspect: 'presença no corpo e desapego', text: 'Consigo deixar ir o que já não me serve.' },
  { id: 's_zhi', spirit: 'Zhi', element: 'Água', organ: 'Rim', aspect: 'força de vontade', text: 'Tenho força de vontade para persistir no que importa.' }
] as const;

export const AGREE5 = [
  { value: 1, label: 'Nada' },
  { value: 2, label: 'Pouco' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Bastante' },
  { value: 5, label: 'Totalmente' }
];

// ---------- Blocos ----------

export const PURPOSE_STEPS = [
  { id: 'valores', title: 'O que é importante para você', minutes: 3 },
  { id: 'sentido', title: 'Sentido de vida', minutes: 2 },
  { id: 'vida', title: 'O que você valoriza × como você vive', minutes: 3 },
  { id: 'florescer', title: 'Como você está florescendo', minutes: 2 },
  { id: 'meta', title: 'Para onde você quer ir', minutes: 3 }
] as const;
export type PurposeStep = (typeof PURPOSE_STEPS)[number]['id'];

export const PURPOSE_VERSION = 'proposito-v1';

export interface PurposeData {
  versao: typeof PURPOSE_VERSION;
  respostas: Answers;
  etapasConcluidas: string[];
  concluidoEm?: string;
}

export function purposeFromSaved(raw: any): PurposeData | null {
  if (!raw || raw.versao !== PURPOSE_VERSION) return null;
  return raw as PurposeData;
}

// ---------- Cálculos ----------

const num = (a: Answers, id: string) => (typeof a[id] === 'number' ? (a[id] as number) : null);
const s1 = (n: number) => n.toFixed(1).replace('.', ',');
const pct = (mean: number, min: number, max: number) => Math.round(((mean - min) / (max - min)) * 100);

export interface ValueProfile {
  groups: { id: ValueGroup; label: string; color: string; desc: string; mean: number; score: number; relative: number }[];
  overall: number;
  top: string[]; // ids dos grupos mais altos em relação à média pessoal
  topItems: { name: string; value: number }[];
}

export function valueProfile(a: Answers): ValueProfile | null {
  if (!VALUE_ITEMS.every((i) => num(a, i.id) !== null)) return null;
  const overall = VALUE_ITEMS.reduce((s, i) => s + (num(a, i.id) as number), 0) / VALUE_ITEMS.length;
  const groups = VALUE_GROUPS.map((g) => {
    const its = VALUE_ITEMS.filter((i) => i.group === g.id);
    const mean = its.reduce((s, i) => s + (num(a, i.id) as number), 0) / its.length;
    return { ...g, mean, score: pct(mean, 1, 7), relative: mean - overall };
  });
  const top = [...groups].sort((x, y) => y.relative - x.relative).slice(0, 2).map((g) => g.id);
  const topItems = VALUE_ITEMS.map((i) => ({ name: i.name, value: num(a, i.id) as number }))
    .sort((x, y) => y.value - x.value)
    .slice(0, 5);
  return { groups, overall, top, topItems };
}

export interface MlqScore {
  presence: number; // 5–35
  search: number; // 5–35
  quadrant: 'tem_e_busca' | 'tem' | 'busca' | 'nenhum';
  steps: string[];
}

export function mlqScore(a: Answers): MlqScore | null {
  if (!MLQ_ITEMS.every((i) => num(a, i.id) !== null)) return null;
  const used = (i: (typeof MLQ_ITEMS)[number]) => (i.reversed ? 8 - (num(a, i.id) as number) : (num(a, i.id) as number));
  const p = MLQ_ITEMS.filter((i) => i.dim === 'presenca');
  const b = MLQ_ITEMS.filter((i) => i.dim === 'busca');
  const presence = p.reduce((s, i) => s + used(i), 0);
  const search = b.reduce((s, i) => s + used(i), 0);
  const hiP = presence > 24;
  const hiB = search > 24;
  return {
    presence,
    search,
    quadrant: hiP && hiB ? 'tem_e_busca' : hiP ? 'tem' : hiB ? 'busca' : 'nenhum',
    steps: [
      `Presença de sentido: frases ${p.map((i) => i.id.slice(1)).join(', ')} (a 9 entra invertida: 8 − resposta) = ${p.map(used).join(' + ')} = ${presence} de 35.`,
      `Busca de sentido: frases ${b.map((i) => i.id.slice(1)).join(', ')} = ${b.map(used).join(' + ')} = ${search} de 35.`,
      'Acima de 24 pontos conta como alto, o ponto de corte sugerido pelo autor da escala.'
    ]
  };
}

export interface AreaGap {
  id: string;
  label: string;
  importance: number;
  coherence: number;
  gap: number;
}

export function lifeAreas(a: Answers): { areas: AreaGap[]; composite: number } | null {
  if (!LIFE_AREAS.every((x) => num(a, `imp_${x.id}`) !== null && num(a, `coe_${x.id}`) !== null)) return null;
  const areas = LIFE_AREAS.map((x) => {
    const importance = num(a, `imp_${x.id}`) as number;
    const coherence = num(a, `coe_${x.id}`) as number;
    return { id: x.id, label: x.label, importance, coherence, gap: importance - coherence };
  });
  const composite = Math.round(areas.reduce((s, x) => s + x.importance * x.coherence, 0) / areas.length);
  return { areas, composite };
}

export function flourishScore(a: Answers): { total: number; score: number } | null {
  if (!FLOURISH_ITEMS.every((i) => num(a, i.id) !== null)) return null;
  const total = FLOURISH_ITEMS.reduce((s, i) => s + (num(a, i.id) as number), 0);
  return { total, score: pct(total / 8, 1, 7) };
}

export function shenProfile(a: Answers) {
  if (!SHEN_ITEMS.every((i) => num(a, i.id) !== null)) return null;
  return SHEN_ITEMS.map((i) => ({ ...i, value: num(a, i.id) as number }));
}

export const fmt = s1;
