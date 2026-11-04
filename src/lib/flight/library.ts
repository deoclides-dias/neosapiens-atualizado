// src/lib/flight/library.ts
// Biblioteca do Plano de Voo: os rumos possíveis e as práticas de cada um.
// Cada prática é um hábito mínimo, com a evidência por trás e, quando cabe,
// a leitura da tradição. Texto do NeoSapiens, para revisão do Deoclides.

export type Evidence = 'forte' | 'moderada' | 'tradição';

export interface Practice {
  id: string;
  text: string; // a ação, no infinitivo curto: "pegar 10 minutos de sol"
  why: string;
  evidence: Evidence;
  tradition?: string; // leitura da MTC, quando houver
  anchors: string[]; // sugestões de “depois de…”
}

export interface Rumo {
  id: string;
  title: string;
  short: string;
  practices: Practice[];
}

const MORNING = ['acordar', 'escovar os dentes de manhã', 'tomar o café da manhã'];
const LUNCH = ['almoçar', 'voltar do almoço'];
const NIGHT = ['jantar', 'escovar os dentes à noite', 'deitar'];

export const RUMOS: Rumo[] = [
  {
    id: 'sono',
    title: 'Dormir melhor',
    short: 'sono',
    practices: [
      { id: 'sono_luz', text: 'pegar 10 minutos de luz do dia ao ar livre', why: 'A luz da manhã é o sinal mais forte para acertar o relógio biológico e antecipar o sono da noite.', evidence: 'forte', anchors: MORNING },
      { id: 'sono_cafe', text: 'tomar a última dose de cafeína até as 14h', why: 'Cafeína até 6 horas antes de dormir reduz o sono em quase 1 hora, mesmo sem a pessoa perceber.', evidence: 'forte', anchors: LUNCH },
      { id: 'sono_horario', text: 'deitar no mesmo horário, com no máximo 30 minutos de diferença', why: 'Horários regulares estão ligados a sono de melhor qualidade e a mais disposição durante o dia.', evidence: 'moderada', tradition: 'Na MTC, dormir antes das 23h respeita as horas da Vesícula Biliar e do Fígado, quando o sangue “volta ao Fígado” para se renovar.', anchors: NIGHT },
      { id: 'sono_telas', text: 'deixar o celular fora do quarto na última hora antes de dormir', why: 'Telas à noite atrasam o sono pela luz e, principalmente, pelo estímulo.', evidence: 'moderada', anchors: NIGHT },
      { id: 'sono_quarto', text: 'deixar o quarto escuro, silencioso e fresco', why: 'Escuro e temperatura mais baixa facilitam pegar no sono e reduzem despertares.', evidence: 'moderada', anchors: NIGHT }
    ]
  },
  {
    id: 'movimento',
    title: 'Movimentar o corpo',
    short: 'movimento',
    practices: [
      { id: 'mov_caminhada', text: 'caminhar 10 minutos', why: 'Caminhar depois das refeições reduz o pico de glicose e soma minutos para os 150 semanais recomendados.', evidence: 'forte', anchors: [...LUNCH, 'jantar'] },
      { id: 'mov_pausa', text: 'levantar e andar 2 minutos a cada hora sentado(a)', why: 'Quebrar o tempo sentado melhora glicose e circulação, mesmo em quem faz exercício.', evidence: 'moderada', anchors: ['começar a trabalhar', 'cada reunião ou aula'] },
      { id: 'mov_forca', text: 'fazer 10 vezes o movimento de sentar e levantar da cadeira', why: 'Força nas pernas é um dos melhores marcadores de saúde e autonomia com a idade.', evidence: 'forte', anchors: MORNING },
      { id: 'mov_escada', text: 'usar a escada em vez do elevador', why: 'Pequenos esforços intensos ao longo do dia contam para a saúde do coração.', evidence: 'moderada', anchors: ['chegar ao trabalho', 'chegar em casa'] }
    ]
  },
  {
    id: 'alimentacao',
    title: 'Comer com mais qualidade',
    short: 'alimentação',
    practices: [
      { id: 'ali_fruta', text: 'comer uma fruta', why: 'Frutas inteiras trazem fibra e saciedade; é uma das recomendações centrais do Guia Alimentar.', evidence: 'forte', anchors: ['tomar o café da manhã', 'lanchar à tarde'] },
      { id: 'ali_metade', text: 'encher metade do prato com verduras e legumes', why: 'Mais vegetais no prato aumenta fibras e micronutrientes e reduz naturalmente os ultraprocessados.', evidence: 'forte', anchors: ['servir o almoço', 'servir o jantar'] },
      { id: 'ali_agua', text: 'trocar refrigerante ou suco de caixinha por água', why: 'Bebidas açucaradas são uma das maiores fontes de açúcar escondido na dieta.', evidence: 'forte', anchors: LUNCH },
      { id: 'ali_mesa', text: 'comer sentado(a) à mesa, sem tela', why: 'Comer com atenção ajuda a perceber a saciedade; o Guia Alimentar recomenda comer com calma e em ambiente apropriado.', evidence: 'moderada', anchors: ['servir o almoço', 'servir o jantar'] },
      { id: 'ali_horario', text: 'fazer as refeições principais em horários regulares', why: 'Horários regulares ajudam o relógio biológico do corpo e reduzem o beliscar.', evidence: 'moderada', tradition: 'Na MTC, refeições regulares fortalecem a Terra (Baço e Estômago), a base que enraíza os outros elementos.', anchors: MORNING }
    ]
  },
  {
    id: 'digestao',
    title: 'Cuidar da digestão',
    short: 'digestão',
    practices: [
      { id: 'dig_agua', text: 'beber 2 copos de água', why: 'Hidratação adequada ajuda o funcionamento do intestino e deixa as fezes mais macias.', evidence: 'moderada', anchors: ['acordar'] },
      { id: 'dig_mastigar', text: 'mastigar devagar, pousando os talheres entre as garfadas', why: 'Comer devagar melhora a saciedade e pode reduzir desconforto digestivo.', evidence: 'moderada', tradition: 'Na MTC, comer com calma protege o Baço, que se enfraquece com pressa e preocupação.', anchors: ['servir o almoço', 'servir o jantar'] },
      { id: 'dig_feijao', text: 'incluir feijão, lentilha ou grão-de-bico', why: 'Leguminosas estão entre as melhores fontes de fibra para o intestino.', evidence: 'forte', anchors: ['servir o almoço'] },
      { id: 'dig_caminhada', text: 'caminhar 10 minutos', why: 'Movimento leve depois de comer ajuda o esvaziamento do estômago e o trânsito intestinal.', evidence: 'moderada', anchors: ['jantar', 'almoçar'] },
      { id: 'dig_diario', text: 'anotar o que comi e como me senti depois', why: 'Um diário de 1 a 2 semanas é a forma mais simples de descobrir o que provoca inchaço ou gases.', evidence: 'moderada', anchors: ['jantar'] }
    ]
  },
  {
    id: 'bemestar',
    title: 'Mais energia e bom humor',
    short: 'bem-estar',
    practices: [
      { id: 'bem_tres', text: 'escrever 3 coisas boas que aconteceram hoje', why: 'O exercício das “três coisas boas” tem efeito comprovado sobre bem-estar em poucas semanas.', evidence: 'moderada', anchors: ['jantar', 'deitar'] },
      { id: 'bem_arlivre', text: 'passar 10 minutos ao ar livre', why: 'Natureza e luz do dia estão ligadas a mais disposição e menos estresse.', evidence: 'moderada', anchors: [...LUNCH, 'chegar em casa'] },
      { id: 'bem_contato', text: 'mandar uma mensagem ou ligar para alguém querido', why: 'Contato social é um dos fatores mais consistentes de bem-estar.', evidence: 'forte', anchors: ['almoçar', 'chegar em casa'] },
      { id: 'bem_respira', text: 'respirar devagar por 5 minutos (inspirar 4, soltar 6)', why: 'Respiração lenta acalma o sistema nervoso e reduz a sensação de estresse.', evidence: 'moderada', tradition: 'Na MTC, a respiração fortalece o Metal (Pulmão) e o Po, o espírito ligado ao corpo e ao desapego.', anchors: ['acordar', 'deitar'] }
    ]
  },
  {
    id: 'foco',
    title: 'Ganhar foco',
    short: 'foco',
    practices: [
      { id: 'foco_blocos', text: 'trabalhar 25 minutos numa só tarefa, com o celular longe', why: 'Interrupções custam minutos de retomada; blocos protegidos aumentam o que se produz.', evidence: 'moderada', anchors: ['começar a trabalhar'] },
      { id: 'foco_quarto', text: 'deixar o celular carregando fora do quarto', why: 'A simples presença do celular por perto disputa atenção, mesmo desligado.', evidence: 'moderada', anchors: ['deitar'] },
      { id: 'foco_tres', text: 'escolher as 3 tarefas mais importantes do dia seguinte', why: 'Decidir de véspera reduz a dispersão da manhã.', evidence: 'moderada', anchors: ['terminar o trabalho', 'jantar'] }
    ]
  },
  {
    id: 'emocoes',
    title: 'Mais calma e estabilidade',
    short: 'estabilidade emocional',
    practices: [
      { id: 'emo_respira', text: 'respirar devagar por 5 minutos (inspirar 4, soltar 6)', why: 'A respiração lenta é uma das formas mais rápidas de reduzir a ativação do estresse.', evidence: 'moderada', anchors: ['acordar', 'deitar'] },
      { id: 'emo_nomear', text: 'parar e dar nome ao que estou sentindo, quando me irritar', why: 'Nomear a emoção reduz a sua intensidade; é uma técnica com boa base em estudos.', evidence: 'moderada', anchors: ['sentir irritação', 'receber uma má notícia'] },
      { id: 'emo_escrita', text: 'escrever por 10 minutos o que me preocupa', why: 'A escrita expressiva ajuda a organizar preocupações e a dormir melhor.', evidence: 'moderada', anchors: ['jantar'] },
      {
        id: 'emo_terra',
        text: 'caminhar descalço(a) na grama ou na terra por alguns minutos',
        why: 'Contato com a natureza está ligado a menos estresse; os efeitos específicos de “aterramento” ainda são pouco estudados.',
        evidence: 'tradição',
        tradition: 'Na MTC, fortalecer a Terra dá raiz à Madeira e acalma o vento interno.',
        anchors: ['chegar em casa', 'acordar']
      }
    ]
  },
  {
    id: 'organizacao',
    title: 'Mais organização',
    short: 'organização',
    practices: [
      { id: 'org_tres', text: 'escrever as 3 prioridades do dia seguinte', why: 'Planos curtos e concretos aumentam a chance de fazer o que importa.', evidence: 'moderada', anchors: ['jantar', 'terminar o trabalho'] },
      { id: 'org_cinco', text: 'arrumar um espaço por 5 minutos', why: 'Começar pequeno é o que transforma intenção em hábito.', evidence: 'moderada', anchors: ['chegar em casa'] },
      { id: 'org_agora', text: 'fazer na hora qualquer tarefa que leve menos de 2 minutos', why: 'Evita o acúmulo de pequenas pendências que pesam na cabeça.', evidence: 'moderada', anchors: ['abrir o e-mail', 'chegar em casa'] }
    ]
  },
  {
    id: 'relacoes',
    title: 'Viver mais as relações',
    short: 'relações',
    practices: [
      { id: 'rel_mensagem', text: 'mandar uma mensagem sincera para alguém importante', why: 'Pequenos gestos frequentes mantêm os vínculos que mais protegem a saúde.', evidence: 'forte', anchors: ['almoçar', 'chegar em casa'] },
      { id: 'rel_refeicao', text: 'fazer uma refeição sem tela com quem mora comigo', why: 'Refeições compartilhadas fortalecem a convivência; o Guia Alimentar recomenda comer em companhia.', evidence: 'moderada', anchors: ['servir o jantar'] },
      { id: 'rel_escuta', text: 'perguntar a alguém como foi o dia e só ouvir', why: 'A escuta atenta é o que faz uma conversa aproximar as pessoas.', evidence: 'moderada', anchors: ['chegar em casa', 'jantar'] }
    ]
  },
  {
    id: 'area',
    title: 'Viver mais o que importa',
    short: 'o que importa',
    practices: [
      { id: 'area_15', text: 'dedicar 15 minutos a esta área da vida', why: 'Valores ganham força quando viram ação concreta, por menor que seja; é o centro das terapias baseadas em valores.', evidence: 'moderada', anchors: ['acordar', 'almoçar', 'jantar'] },
      { id: 'area_passo', text: 'dar um passo pequeno e concreto nesta área', why: 'Passos pequenos e diários sustentam a mudança melhor do que grandes planos.', evidence: 'moderada', anchors: ['acordar', 'terminar o trabalho'] }
    ]
  }
];

export const rumoById = (id: string) => RUMOS.find((r) => r.id === id);
export const practiceById = (id: string) => RUMOS.flatMap((r) => r.practices).find((p) => p.id === id);

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  forte: 'Evidência forte',
  moderada: 'Evidência moderada',
  tradição: 'Tradição'
};
