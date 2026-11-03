// src/lib/body/questions.ts
// Perguntas do módulo Corpo, em 7 blocos curtos.
// Fontes dos instrumentos (detalhes em SOURCES, no fim do arquivo):
// - Movimento: IPAQ versão curta (CC BY 4.0)
// - Alimentação: escala de práticas do Guia Alimentar (Gabe & Jaime), material público
// - Bem-estar: Índice de Bem-Estar OMS-5 (uso livre)
// - Álcool: AUDIT-C (OMS)
// - Digestão: Escala de Bristol
// - Sono: perguntas próprias sobre as 6 dimensões da saúde do sono (Buysse, 2014)
// - Testes: Sentar-Levantar (Araújo) e apoio em um pé por 10 s (Araújo et al., 2022)

export type Answer = number | string | string[] | null;
export type BodyAnswers = Record<string, Answer>;

export interface Option {
  value: number | string;
  label: string;
  hint?: string;
  /** Desenho ao lado da opção */
  visual?: { kind: 'bristol' | 'urina'; value: number };
}

interface Base {
  id: string;
  text: string;
  help?: string;
  optional?: boolean;
  showIf?: (a: BodyAnswers) => boolean;
}

export type Question =
  | (Base & { kind: 'choice'; options: Option[]; layout?: 'row' | 'column'; expected?: number | string })
  | (Base & { kind: 'number'; unit: string; min: number; max: number; step?: number })
  | (Base & { kind: 'time' })
  /** Dois horários na mesma pergunta (dormir e acordar); cada um salvo no seu id */
  | (Base & { kind: 'timepair'; ids: [string, string]; labels: [string, string] })
  | (Base & { kind: 'duration' })
  | (Base & { kind: 'multi'; options: Option[]; noneLabel: string })
  | (Base & { kind: 'slider'; low: string; high: string });

export interface Block {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  intro?: string;
  questions: Question[];
}

const num = (a: BodyAnswers, id: string) => (typeof a[id] === 'number' ? (a[id] as number) : 0);

// ---------- Janelas de despertar noturno ----------
// Faixas de 2 horas, como no relógio dos órgãos da Medicina Tradicional
// Chinesa; ficam guardadas para a análise das tradições.
export const WAKE_WINDOWS = [
  {
    start: 21,
    label: 'Entre 21h e 23h',
    organ: 'Triplo Aquecedor',
    of: 'do Triplo Aquecedor',
    element: 'Fogo',
    reading: 'a integração entre as funções do corpo e a circulação dos líquidos'
  },
  {
    start: 23,
    label: 'Entre 23h e 1h',
    organ: 'Vesícula Biliar',
    of: 'da Vesícula Biliar',
    element: 'Madeira',
    reading: 'a capacidade de decidir e a coragem para agir'
  },
  {
    start: 1,
    label: 'Entre 1h e 3h',
    organ: 'Fígado',
    of: 'do Fígado',
    element: 'Madeira',
    reading: 'o livre fluxo da energia e das emoções, em especial a irritação e a frustração'
  },
  {
    start: 3,
    label: 'Entre 3h e 5h',
    organ: 'Pulmão',
    of: 'do Pulmão',
    element: 'Metal',
    reading: 'a respiração e a defesa do corpo, e também a tristeza e o luto'
  },
  {
    start: 5,
    label: 'Entre 5h e 7h',
    organ: 'Intestino Grosso',
    of: 'do Intestino Grosso',
    element: 'Metal',
    reading: 'a eliminação e a capacidade de soltar o que não serve mais'
  }
];

// ---------- Escalas reutilizadas ----------

const FREQ5: Option[] = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Raramente' },
  { value: 2, label: 'Às vezes' },
  { value: 3, label: 'Frequentemente' },
  { value: 4, label: 'Sempre' }
];

// Gabe & Jaime (2022): nunca, raramente, muitas vezes, sempre
const GUIA_FREQ: Option[] = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Raramente' },
  { value: 2, label: 'Muitas vezes' },
  { value: 3, label: 'Sempre' }
];

const DAYS: Option[] = [
  { value: 0, label: 'Nenhum dia' },
  { value: 1.5, label: '1 a 2 dias' },
  { value: 3.5, label: '3 a 4 dias' },
  { value: 5.5, label: '5 a 6 dias' },
  { value: 7, label: 'Todos os dias' }
];

const SYMPTOM: Option[] = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: '1 vez por semana' },
  { value: 2, label: '2 a 3 vezes por semana' },
  { value: 3, label: 'Quase todo dia' }
];

const EFFORT: Option[] = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Às vezes' },
  { value: 2, label: 'Frequentemente' },
  { value: 3, label: 'Quase sempre' }
];

const WHO5: Option[] = [
  { value: 5, label: 'O tempo todo' },
  { value: 4, label: 'A maior parte do tempo' },
  { value: 3, label: 'Mais da metade do tempo' },
  { value: 2, label: 'Menos da metade do tempo' },
  { value: 1, label: 'De vez em quando' },
  { value: 0, label: 'Nunca' }
];

const dayCount = (id: string, text: string, help?: string): Question => ({
  id,
  kind: 'number',
  unit: 'dias',
  min: 0,
  max: 7,
  text,
  help
});

// ---------- Escala do Guia Alimentar (24 itens) ----------
// reversed = prática contrária ao Guia (nunca = 3 pontos)
export const GUIA_ITEMS: { id: string; text: string; reversed?: boolean }[] = [
  { id: 'g01', text: 'Quando faço pequenos lanches ao longo do dia, costumo comer frutas ou castanhas.' },
  { id: 'g02', text: 'Quando escolho frutas, verduras e legumes, dou preferência aos de produção local.' },
  { id: 'g03', text: 'Quando escolho frutas, legumes e verduras, dou preferência aos orgânicos.' },
  { id: 'g04', text: 'Procuro fazer as refeições com calma.' },
  { id: 'g05', text: 'Na minha casa é comum usarmos farinha de trigo integral.' },
  { id: 'g06', text: 'Na minha casa compartilhamos as tarefas de preparo e consumo das refeições.' },
  { id: 'g07', text: 'Costumo participar do preparo dos alimentos na minha casa.' },
  { id: 'g08', text: 'Costumo variar o feijão com ervilha, lentilha ou grão-de-bico.' },
  { id: 'g09', text: 'Costumo planejar as refeições que farei no dia.' },
  { id: 'g10', text: 'Costumo levar algum alimento comigo para o caso de sentir fome ao longo do dia.' },
  { id: 'g11', text: 'Costumo fazer minhas refeições sentado(a) à mesa.' },
  { id: 'g12', text: 'Costumo comprar alimentos em feiras livres ou de rua.' },
  { id: 'g13', text: 'Costumo comer fruta no café da manhã.' },
  { id: 'g14', reversed: true, text: 'Tenho o hábito de beliscar no intervalo entre as refeições.' },
  { id: 'g15', reversed: true, text: 'Quando bebo café ou chá, costumo colocar açúcar.' },
  { id: 'g16', reversed: true, text: 'Costumo trocar o almoço ou o jantar por sanduíches, salgados ou pizza.' },
  { id: 'g17', reversed: true, text: 'Costumo pular pelo menos uma das refeições principais (almoço ou jantar).' },
  { id: 'g18', reversed: true, text: 'Costumo frequentar restaurantes fast-food ou lanchonetes.' },
  { id: 'g19', reversed: true, text: 'Costumo fazer as refeições no sofá da sala ou na cama.' },
  { id: 'g20', reversed: true, text: 'Costumo fazer as refeições na mesa de trabalho ou de estudo.' },
  { id: 'g21', reversed: true, text: 'Costumo comer balas, chocolates e outras guloseimas.' },
  { id: 'g22', reversed: true, text: 'Costumo beber sucos industrializados (de caixinha, em pó, garrafa ou lata).' },
  { id: 'g23', reversed: true, text: 'Costumo beber refrigerante.' },
  { id: 'g24', reversed: true, text: 'Aproveito o horário das refeições para resolver outras coisas e acabo deixando de comer.' }
];

export const GUIA_ATTENTION = { id: 'g_at', expected: 1 };

// Itens do Guia com o item de atenção no meio
const guiaQuestions: Question[] = GUIA_ITEMS.flatMap((g, i) => {
  const q: Question = { id: g.id, kind: 'choice', text: g.text, options: GUIA_FREQ, layout: 'row' };
  if (i === 11) {
    return [
      q,
      {
        id: GUIA_ATTENTION.id,
        kind: 'choice',
        layout: 'row',
        options: GUIA_FREQ,
        expected: GUIA_ATTENTION.expected,
        text: 'Para mostrar que está lendo com atenção, escolha “Raramente” nesta frase.'
      } as Question
    ];
  }
  return [q];
});

export const SIGNALS: Option[] = [
  { value: 'unhas', label: 'Unhas fracas ou quebradiças' },
  { value: 'cabelo', label: 'Queda de cabelo acima do normal' },
  { value: 'caimbras', label: 'Cãibras' },
  { value: 'aftas', label: 'Aftas frequentes' },
  { value: 'pele', label: 'Pele muito seca' },
  { value: 'cansaco', label: 'Cansaço que não melhora com descanso' },
  { value: 'formigamento', label: 'Formigamento em mãos ou pés' },
  { value: 'cicatrizacao', label: 'Feridas que demoram a cicatrizar' }
];

export const PRIORITY_AREAS = [
  { id: 'sono', label: 'sono' },
  { id: 'movimento', label: 'atividade física' },
  { id: 'alimentacao', label: 'alimentação' },
  { id: 'digestao', label: 'digestão e intestino' },
  { id: 'energia', label: 'energia e disposição' }
] as const;

// ---------- Blocos ----------

export const BLOCKS: Block[] = [
  {
    id: 'medidas',
    title: 'Seu corpo em números',
    subtitle: 'Medidas',
    minutes: 1,
    questions: [
      {
        id: 'sexo',
        kind: 'choice',
        layout: 'row',
        text: 'Sexo biológico',
        help: 'Usado só nos valores de referência da cintura e do consumo de álcool.',
        options: [
          { value: 'F', label: 'Feminino' },
          { value: 'M', label: 'Masculino' }
        ]
      },
      { id: 'idade', kind: 'number', unit: 'anos', min: 14, max: 110, text: 'Idade' },
      { id: 'altura', kind: 'number', unit: 'cm', min: 120, max: 230, text: 'Altura' },
      { id: 'peso', kind: 'number', unit: 'kg', min: 30, max: 300, step: 0.1, text: 'Peso' },
      {
        id: 'cintura',
        kind: 'number',
        unit: 'cm',
        min: 40,
        max: 200,
        optional: true,
        text: 'Circunferência da cintura',
        help: 'Meça na altura do umbigo, sem apertar a fita, ao fim de uma expiração normal. Se não tiver fita agora, pode pular.'
      }
    ]
  },
  {
    id: 'sono',
    title: 'Sono e ritmo',
    subtitle: 'Sono',
    minutes: 3,
    intro: 'Pense no último mês.',
    questions: [
      {
        id: 'horario_trab',
        kind: 'timepair',
        ids: ['dorme_trab', 'acorda_trab'],
        labels: ['Apago a luz às', 'Acordo às'],
        text: 'Em dias de trabalho ou estudo, a que horas você costuma apagar a luz para dormir e a que horas acorda?'
      },
      {
        id: 'horario_livre',
        kind: 'timepair',
        ids: ['dorme_livre', 'acorda_livre'],
        labels: ['Apago a luz às', 'Acordo às'],
        text: 'E em dias livres?'
      },
      {
        id: 'latencia',
        kind: 'choice',
        text: 'Depois de apagar a luz, quanto tempo costuma levar para pegar no sono?',
        options: [
          { value: 10, label: 'Até 15 minutos' },
          { value: 23, label: '16 a 30 minutos' },
          { value: 45, label: '31 a 60 minutos' },
          { value: 75, label: 'Mais de 1 hora' }
        ]
      },
      {
        id: 'despertar',
        kind: 'choice',
        text: 'Você costuma acordar durante a noite?',
        options: [
          { value: 'nao', label: 'Não, durmo direto' },
          { value: 'variado', label: 'Sim, em horários variados' },
          { value: 'mesmo', label: 'Sim, quase sempre no mesmo horário' }
        ]
      },
      {
        id: 'despertar_horario',
        kind: 'choice',
        showIf: (a) => a.despertar === 'mesmo',
        text: 'Em que faixa de horário você costuma acordar?',
        options: WAKE_WINDOWS.map((w) => ({ value: w.start, label: w.label }))
      },
      {
        id: 'acordado_noite',
        kind: 'choice',
        showIf: (a) => a.despertar === 'variado' || a.despertar === 'mesmo',
        text: 'Somando as vezes que acorda, quanto tempo costuma ficar acordado(a)?',
        options: [
          { value: 5, label: 'Quase nada, volto a dormir logo' },
          { value: 15, label: 'Uns 15 minutos' },
          { value: 30, label: 'Uns 30 minutos' },
          { value: 60, label: '1 hora ou mais' }
        ]
      },
      { id: 'regularidade', kind: 'choice', layout: 'row', options: FREQ5, text: 'Você dorme e acorda em horários parecidos todos os dias?' },
      {
        id: 'sonolencia',
        kind: 'choice',
        layout: 'row',
        options: FREQ5,
        text: 'Com que frequência você luta contra o sono ou cochila sem querer durante o dia?'
      },
      {
        id: 'satisfacao_sono',
        kind: 'choice',
        layout: 'row',
        text: 'Quão satisfeito(a) você está com o seu sono?',
        options: [
          { value: 0, label: 'Nada' },
          { value: 1, label: 'Pouco' },
          { value: 2, label: 'Mais ou menos' },
          { value: 3, label: 'Satisfeito(a)' },
          { value: 4, label: 'Muito' }
        ]
      },
      {
        id: 'cafeina_qtd',
        kind: 'choice',
        text: 'Quantas xícaras ou latas de bebidas com cafeína você toma por dia?',
        help: 'Café, chá preto, chá-mate, chimarrão, energético ou refrigerante de cola.',
        options: [
          { value: 0, label: 'Nenhuma' },
          { value: 1.5, label: '1 a 2' },
          { value: 3.5, label: '3 a 4' },
          { value: 5, label: '5 ou mais' }
        ]
      },
      {
        id: 'cafeina_ultima',
        kind: 'choice',
        text: 'Normalmente, a última dose de cafeína do dia é em que horário?',
        showIf: (a) => num(a, 'cafeina_qtd') > 0,
        options: [
          { value: 12, label: 'Até o meio-dia' },
          { value: 13.5, label: 'Entre 12h e 15h' },
          { value: 16.5, label: 'Entre 15h e 18h' },
          { value: 20, label: 'Depois das 18h' }
        ]
      },
      {
        id: 'luz_manha',
        kind: 'choice',
        text: 'Em quantos dias da semana você pega pelo menos 10 minutos de luz do dia ao ar livre na primeira metade da manhã?',
        options: [
          { value: 0, label: 'Nenhum' },
          { value: 1.5, label: '1 a 2 dias' },
          { value: 3.5, label: '3 a 4 dias' },
          { value: 6, label: '5 a 7 dias' }
        ]
      },
      {
        id: 'ar_livre',
        kind: 'choice',
        text: 'Em média, quanto tempo por dia você passa ao ar livre?',
        options: [
          { value: 15, label: 'Menos de 30 minutos' },
          { value: 45, label: '30 minutos a 1 hora' },
          { value: 90, label: '1 a 2 horas' },
          { value: 150, label: 'Mais de 2 horas' }
        ]
      },
      {
        id: 'telas',
        kind: 'choice',
        layout: 'row',
        options: FREQ5,
        text: 'Com que frequência você usa celular, computador ou TV na última hora antes de dormir?'
      }
    ]
  },
  {
    id: 'movimento',
    title: 'Movimento',
    subtitle: 'Atividade física',
    minutes: 3,
    intro: 'Pense nos últimos 7 dias. Conte só as atividades feitas por pelo menos 10 minutos seguidos.',
    questions: [
      dayCount(
        'vig_dias',
        'Em quantos dias você fez atividades VIGOROSAS?',
        'Atividades que fazem a respiração e o coração acelerarem MUITO: correr, pedalar rápido, jogar futebol, ginástica aeróbica, carregar peso pesado.'
      ),
      { id: 'vig_min', kind: 'duration', text: 'Nesses dias, quanto tempo no total, por dia?', showIf: (a) => num(a, 'vig_dias') > 0 },
      dayCount(
        'mod_dias',
        'Em quantos dias você fez atividades MODERADAS?',
        'Atividades que aceleram um pouco a respiração e o coração: pedalar leve, nadar, dançar, carregar pesos leves, varrer, cuidar do jardim. Não conte caminhada.'
      ),
      { id: 'mod_min', kind: 'duration', text: 'Nesses dias, quanto tempo no total, por dia?', showIf: (a) => num(a, 'mod_dias') > 0 },
      dayCount('cam_dias', 'Em quantos dias você CAMINHOU?', 'Em casa, no trabalho, como transporte, por lazer ou como exercício.'),
      { id: 'cam_min', kind: 'duration', text: 'Nesses dias, quanto tempo no total, por dia?', showIf: (a) => num(a, 'cam_dias') > 0 },
      {
        id: 'sentado_semana',
        kind: 'duration',
        text: 'Em um dia de semana, quanto tempo no total você passa sentado(a)?',
        help: 'No trabalho, estudando, no transporte, vendo TV ou no celular.'
      },
      { id: 'sentado_fds', kind: 'duration', text: 'E em um dia de fim de semana?' },
      {
        id: 'teste_sentar',
        kind: 'choice',
        optional: true,
        text: 'Teste de Sentar-Levantar (opcional)',
        help:
          'Descalço(a), em espaço livre e perto de uma parede ou de alguém, sente-se no chão de pernas cruzadas e levante-se usando o mínimo de apoio. Comece com 10 pontos: perca 1 ponto a cada apoio (mão, joelho, antebraço ou lateral da perna), na descida ou na subida, e meio ponto se perder o equilíbrio. Não faça se tiver dor ou limitação nos joelhos, quadril ou coluna.',
        options: [
          { value: 10, label: '10 pontos (sem nenhum apoio)' },
          { value: 9, label: '8 a 9,5 pontos' },
          { value: 7, label: '6 a 7,5 pontos' },
          { value: 4.5, label: '3,5 a 5,5 pontos' },
          { value: 1.5, label: '0 a 3 pontos' },
          { value: 'pulei', label: 'Preferi não fazer' }
        ]
      },
      {
        id: 'teste_pe',
        kind: 'choice',
        optional: true,
        text: 'Equilíbrio em um pé só por 10 segundos (opcional)',
        help:
          'Perto de uma parede, fique em um pé só, com o outro pé apoiado atrás da perna de apoio, braços ao longo do corpo e olhando para a frente. Você tem até 3 tentativas.',
        options: [
          { value: 2, label: 'Consegui com as duas pernas' },
          { value: 1, label: 'Consegui só com uma' },
          { value: 0, label: 'Não consegui' },
          { value: 'pulei', label: 'Preferi não fazer' }
        ]
      }
    ]
  },
  {
    id: 'alimentacao',
    title: 'Alimentação',
    subtitle: 'Hábitos alimentares',
    minutes: 5,
    intro: 'Pense nos seus hábitos dos últimos meses. Responda com que frequência cada frase acontece com você.',
    questions: [
      ...guiaQuestions,
      { id: 'f_frutas', kind: 'choice', options: DAYS, layout: 'row', text: 'Na última semana, em quantos dias você comeu frutas (inteiras, não em suco)?' },
      { id: 'f_verduras', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu verduras ou legumes (crus ou cozidos)?' },
      { id: 'f_feijao', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu feijão, lentilha, grão-de-bico ou ervilha?' },
      {
        id: 'f_integrais',
        kind: 'choice',
        options: DAYS,
        layout: 'row',
        text: 'Em quantos dias comeu arroz, pão ou massa integral, aveia ou outros grãos integrais?'
      },
      { id: 'f_fermentados', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu iogurte natural, kefir, coalhada ou outros fermentados?' },
      {
        id: 'f_ultra',
        kind: 'choice',
        options: DAYS,
        layout: 'row',
        text: 'Em quantos dias comeu biscoito recheado, salgadinho de pacote, macarrão instantâneo, salsicha, presunto ou refeição pronta congelada?'
      },
      { id: 'f_proteina', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu carne, frango, peixe ou ovos?' },
      { id: 'f_laticinios', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias tomou leite ou comeu queijo?' },
      { id: 'f_castanhas', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu castanhas, amendoim, sementes ou abacate?' },
      { id: 'f_frituras', kind: 'choice', options: DAYS, layout: 'row', text: 'Em quantos dias comeu frituras (pastel, batata frita, salgado frito)?' }
    ]
  },
  {
    id: 'digestao',
    title: 'Digestão, intestino e urina',
    subtitle: 'Digestão',
    minutes: 2,
    questions: [
      {
        id: 'evacuacoes',
        kind: 'choice',
        text: 'Com que frequência você evacua?',
        options: [
          { value: 1, label: 'Menos de 3 vezes por semana' },
          { value: 2, label: '3 a 6 vezes por semana' },
          { value: 3, label: '1 vez por dia' },
          { value: 4, label: '2 a 3 vezes por dia' },
          { value: 5, label: 'Mais de 3 vezes por dia' }
        ]
      },
      {
        id: 'bristol',
        kind: 'choice',
        text: 'Qual destes formatos é o mais comum nas suas fezes?',
        help: 'Escala de Bristol, usada no mundo todo por médicos e nutricionistas.',
        options: [
          { value: 1, label: 'Tipo 1', visual: { kind: 'bristol', value: 1 }, hint: 'Caroços duros e separados, como bolinhas' },
          { value: 2, label: 'Tipo 2', visual: { kind: 'bristol', value: 2 }, hint: 'Formato de salsicha, mas encaroçada' },
          { value: 3, label: 'Tipo 3', visual: { kind: 'bristol', value: 3 }, hint: 'Formato de salsicha, com rachaduras na superfície' },
          { value: 4, label: 'Tipo 4', visual: { kind: 'bristol', value: 4 }, hint: 'Formato de salsicha ou cobra, lisa e macia' },
          { value: 5, label: 'Tipo 5', visual: { kind: 'bristol', value: 5 }, hint: 'Pedaços macios, com bordas bem definidas' },
          { value: 6, label: 'Tipo 6', visual: { kind: 'bristol', value: 6 }, hint: 'Pedaços moles e pastosos, de bordas irregulares' },
          { value: 7, label: 'Tipo 7', visual: { kind: 'bristol', value: 7 }, hint: 'Totalmente líquidas, sem pedaços sólidos' }
        ]
      },
      { id: 'esforco', kind: 'choice', layout: 'row', options: EFFORT, text: 'Com que frequência você precisa fazer muito esforço para evacuar?' },
      { id: 'incompleta', kind: 'choice', layout: 'row', options: EFFORT, text: 'Com que frequência fica a sensação de não ter esvaziado por completo?' },
      { id: 'inchaco', kind: 'choice', options: SYMPTOM, layout: 'row', text: 'Nas últimas 2 semanas, com que frequência teve inchaço na barriga?' },
      { id: 'azia', kind: 'choice', options: SYMPTOM, layout: 'row', text: 'E azia ou refluxo?' },
      { id: 'gases', kind: 'choice', options: SYMPTOM, layout: 'row', text: 'E gases que incomodam?' },
      {
        id: 'urina',
        kind: 'choice',
        text: 'Durante o dia, qual a cor mais comum da sua urina?',
        help: 'Pense na urina do meio do dia, não na primeira da manhã, que costuma ser mais escura.',
        options: [
          { value: 1, label: 'Quase transparente', visual: { kind: 'urina', value: 1 } },
          { value: 2, label: 'Amarelo bem claro, cor de palha', visual: { kind: 'urina', value: 2 } },
          { value: 3, label: 'Amarelo', visual: { kind: 'urina', value: 3 } },
          { value: 4, label: 'Amarelo-escuro', visual: { kind: 'urina', value: 4 } },
          { value: 5, label: 'Âmbar, cor de mel', visual: { kind: 'urina', value: 5 } },
          { value: 6, label: 'Marrom ou alaranjado-escuro', visual: { kind: 'urina', value: 6 } }
        ]
      },
      {
        id: 'agua',
        kind: 'choice',
        text: 'Quantos copos de água (250 ml) você bebe por dia, sem contar outras bebidas?',
        options: [
          { value: 3, label: 'Menos de 4' },
          { value: 5, label: '4 a 6' },
          { value: 8, label: '7 a 9' },
          { value: 10, label: '10 ou mais' }
        ]
      }
    ]
  },
  {
    id: 'habitos',
    title: 'Hábitos e sinais',
    subtitle: 'Hábitos',
    minutes: 2,
    questions: [
      {
        id: 'alc1',
        kind: 'choice',
        text: 'Com que frequência você toma bebidas alcoólicas?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Uma vez por mês ou menos' },
          { value: 2, label: '2 a 4 vezes por mês' },
          { value: 3, label: '2 a 3 vezes por semana' },
          { value: 4, label: '4 ou mais vezes por semana' }
        ]
      },
      {
        id: 'alc2',
        kind: 'choice',
        showIf: (a) => num(a, 'alc1') > 0,
        text: 'Nos dias em que bebe, quantas doses costuma tomar?',
        help: '1 dose = 1 lata de cerveja (350 ml), 1 taça de vinho (150 ml) ou 1 dose de destilado (40 ml).',
        options: [
          { value: 0, label: '1 ou 2' },
          { value: 1, label: '3 ou 4' },
          { value: 2, label: '5 ou 6' },
          { value: 3, label: '7 a 9' },
          { value: 4, label: '10 ou mais' }
        ]
      },
      {
        id: 'alc3',
        kind: 'choice',
        showIf: (a) => num(a, 'alc1') > 0,
        text: 'Com que frequência toma 5 ou mais doses em uma mesma ocasião?',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de uma vez por mês' },
          { value: 2, label: 'Uma vez por mês' },
          { value: 3, label: 'Uma vez por semana' },
          { value: 4, label: 'Todos ou quase todos os dias' }
        ]
      },
      {
        id: 'tabaco',
        kind: 'choice',
        text: 'Sobre cigarro e nicotina:',
        options: [
          { value: 'nunca', label: 'Nunca fumei' },
          { value: 'parou', label: 'Já fumei e parei' },
          { value: 'cigarro', label: 'Fumo cigarro' },
          { value: 'vape', label: 'Uso cigarro eletrônico (vape)' },
          { value: 'outro', label: 'Uso outro (narguilé, charuto, fumo de rolo)' }
        ]
      },
      {
        id: 'sinais',
        kind: 'multi',
        text: 'Nos últimos 3 meses, você notou algum destes sinais com frequência?',
        help: 'Marque todos os que se aplicam.',
        options: SIGNALS,
        noneLabel: 'Nenhum destes'
      }
    ]
  },
  {
    id: 'bemestar',
    title: 'Bem-estar e prioridades',
    subtitle: 'Bem-estar',
    minutes: 2,
    intro: 'Nas últimas duas semanas…',
    questions: [
      { id: 'w1', kind: 'choice', options: WHO5, text: '…eu me senti alegre e de bom humor.' },
      { id: 'w2', kind: 'choice', options: WHO5, text: '…eu me senti calmo(a) e tranquilo(a).' },
      { id: 'w3', kind: 'choice', options: WHO5, text: '…eu me senti ativo(a) e com energia.' },
      { id: 'w4', kind: 'choice', options: WHO5, text: '…eu acordei me sentindo descansado(a) e revigorado(a).' },
      { id: 'w5', kind: 'choice', options: WHO5, text: '…meu dia a dia foi preenchido com coisas que me interessam.' },
      ...PRIORITY_AREAS.flatMap(
        (p): Question[] => [
          { id: `sat_${p.id}`, kind: 'slider', text: `Quão satisfeito(a) você está hoje com seu(sua) ${p.label}?`, low: 'Nada', high: 'Totalmente' },
          { id: `imp_${p.id}`, kind: 'slider', text: `Quanto melhorar ${p.label} é importante para você agora?`, low: 'Nada', high: 'Muito' }
        ]
      )
    ]
  }
];

export const visibleQuestions = (block: Block, a: BodyAnswers) => block.questions.filter((q) => !q.showIf || q.showIf(a));

export const isAnswered = (q: Question, v: Answer | undefined, all: BodyAnswers = {}) => {
  if (q.kind === 'timepair') return q.ids.every((id) => typeof all[id] === 'string' && all[id] !== '');
  if (q.optional) return v === undefined || v === null || v === '' || q.kind !== 'number' || (typeof v === 'number' && v >= q.min && v <= q.max);
  if (v === undefined || v === null || v === '') return false;
  if (q.kind === 'multi') return Array.isArray(v) && v.length > 0;
  if (q.kind === 'number') return typeof v === 'number' && v >= q.min && v <= q.max;
  return true;
};

export const SOURCES = [
  {
    label: 'IPAQ, versão curta',
    text: 'International Physical Activity Questionnaire. Licença CC BY 4.0. Versão brasileira: Matsudo et al. (2001), Revista Brasileira de Atividade Física & Saúde.',
    url: 'https://sites.google.com/view/ipaq'
  },
  {
    label: 'Escala de práticas alimentares do Guia Alimentar',
    text: 'Gabe, K. T., & Jaime, P. C. (2022). Revista Brasileira de Epidemiologia, 25, e220009. Divulgada pelo Ministério da Saúde como “Como está sua alimentação?”.',
    url: 'https://scielosp.org/article/rbepid/2022.v25/e220009/en'
  },
  {
    label: 'Índice de Bem-Estar OMS-5',
    text: 'Organização Mundial da Saúde, 1998. Uso livre. Topp et al. (2015), revisão sistemática, Psychotherapy and Psychosomatics.',
    url: 'https://doi.org/10.1159/000376585'
  },
  {
    label: 'AUDIT-C',
    text: 'Três primeiras perguntas do AUDIT (Organização Mundial da Saúde).',
    url: 'https://www.who.int/publications/i/item/WHO-MSD-MSB-01.6a'
  },
  {
    label: 'Saúde do sono',
    text: 'Buysse, D. J. (2014). Sleep health: can we define it? Does it matter? Sleep, 37(1), 9–17. As perguntas e as regras de cálculo são do NeoSapiens.',
    url: 'https://doi.org/10.5665/sleep.3298'
  },
  {
    label: 'Teste de Sentar-Levantar e equilíbrio em um pé',
    text: 'Brito, L. B. B. et al. (2012), European Journal of Preventive Cardiology, doi 10.1177/2047487312471759; Araújo, C. G. et al. (2022), British Journal of Sports Medicine.',
    url: 'https://doi.org/10.1136/bjsports-2021-105360'
  },
  {
    label: 'Cor da urina',
    text: 'Armstrong, L. E. et al. (1994). Urinary indices of hydration status. International Journal of Sport Nutrition, 4(3), 265–279. As amostras de cor do NeoSapiens são aproximadas.',
    url: 'https://doi.org/10.1123/ijsn.4.3.265'
  },
  {
    label: 'Cafeína e sono',
    text: 'Drake, C. et al. (2013). Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed. Journal of Clinical Sleep Medicine, 9(11), 1195–1200.',
    url: 'https://doi.org/10.5664/jcsm.3170'
  }
];
