// src/pages/laboratorio.tsx
// Laboratório de Ideias: página pública onde o NeoSapiens mostra os projetos de
// impacto social que apoia, da ideia até ganharem estrutura própria.
// Ligada ao pilar Propósito (eixo Contribuição). Para incluir um projeto novo,
// acrescente um item na lista PROJETOS.
//
// Sigilo (Instituto Florar): a página mostra O QUE o projeto faz, nunca COMO.
// Tubetes e proteína alternativa aparecem só pelo nome. Parceiros só por perfil.

import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, ExternalLink, FlaskConical, Lightbulb, Sailboat, Sprout } from 'lucide-react';
import { CONTACT_EMAIL } from '../lib/legal';

const SERIF = "'Cormorant Garamond', Georgia, serif";

/** Domínio próprio do Instituto Florar. Enquanto estiver vazio, o botão mostra "Site próprio em breve". */
const FLORAR_SITE = '';

type Etapa = 'semente' | 'incubacao' | 'autonomia';
type StatusMarco = 'feito' | 'andamento' | 'proximo';

const ETAPAS: { id: Etapa; titulo: string; texto: string; Icone: typeof Sprout; cor: string }[] = [
  { id: 'semente', titulo: 'Semente', texto: 'Uma ideia que pode mudar a vida de muita gente, ainda no papel.', Icone: Sprout, cor: 'text-emerald-600' },
  {
    id: 'incubacao',
    titulo: 'Incubação',
    texto: 'O NeoSapiens ajuda a dar forma: prévia, parceiros, documentos e primeiros passos.',
    Icone: FlaskConical,
    cor: 'text-indigo-600'
  },
  { id: 'autonomia', titulo: 'Autonomia', texto: 'O projeto ganha casa própria e segue com as próprias velas.', Icone: Sailboat, cor: 'text-purple-600' }
];

const SELO: Record<Etapa, string> = {
  semente: 'bg-emerald-50 text-emerald-800',
  incubacao: 'bg-indigo-50 text-indigo-800',
  autonomia: 'bg-purple-50 text-purple-800'
};

const MARCO: Record<StatusMarco, { rotulo: string; Icone: typeof Sprout; cor: string }> = {
  feito: { rotulo: 'Concluído', Icone: CheckCircle2, cor: 'text-emerald-600' },
  andamento: { rotulo: 'Em andamento', Icone: Clock, cor: 'text-amber-600' },
  proximo: { rotulo: 'Próximo passo', Icone: Circle, cor: 'text-gray-400' }
};

type Projeto = {
  nome: string;
  subtitulo?: string;
  resumo: string;
  etapa: Etapa;
  fase: string;
  marcos: { texto: string; status: StatusMarco }[];
  transparencia: string;
  /** Botão principal: prévia ou site do projeto. Sem href, aparece o texto de "em breve". */
  acesso?: { rotulo: string; href: string; externo?: boolean; emBreve?: string };
  Vitrine?: () => ReactElement;
  participar: string[];
};

/**
 * Vitrine do Instituto Florar, com a identidade do próprio instituto (Montserrat 800,
 * verdes e amarelo) para marcar que não é um produto do NeoSapiens.
 * Mostra só o que se aproveita do coco, nunca como.
 */
function VitrineFlorar() {
  const camadas = [
    { nome: 'Epicarpo', cor: '#9A6A3E', texto: 'Fibras e embalagens biodegradáveis' },
    { nome: 'Mesocarpo', cor: '#E8D3A8', texto: 'Farinhas e ingredientes para alimentação' },
    { nome: 'Endocarpo', cor: '#B78A62', texto: 'Energia renovável' },
    { nome: 'Amêndoa', cor: '#F6EEDC', texto: 'Óleos para cosméticos e nutrição' }
  ];
  const linhas = ['Tubetes biodegradáveis', 'Cosméticos com bioativos', 'Extratos naturais', 'Proteína alternativa', 'Economia circular'];

  return (
    <figure className="m-0 rounded-2xl overflow-hidden" style={{ background: '#17351D', color: '#F3EEDF', fontFamily: 'Manrope, Inter, sans-serif' }}>
      <div className="text-center text-xs px-4 py-2" style={{ background: '#F2B705', color: '#17351D' }}>
        Projeto do Instituto Florar · identidade e marca próprias do instituto
      </div>
      <div className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <svg width="150" height="28" viewBox="0 44 640 116" role="img" aria-label="FLORAR">
            <text x="200" y="150" textAnchor="end" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={140} fill="#FFFFFF">
              FL
            </text>
            <circle cx="253" cy="101" r="40" fill="none" stroke="#FFFFFF" strokeWidth={17} />
            <path d="M253 102 C 257 86, 266 79, 276 80 C 274 92, 266 100, 253 102 Z" fill="#8CC63F" />
            <path d="M253 106 C 248 94, 239 88, 231 89 C 232 99, 242 106, 253 106 Z" fill="#F2B705" />
            <text x="306" y="150" textAnchor="start" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={140} fill="#FFFFFF">
              RAR
            </text>
          </svg>
          <span className="text-sm font-bold tracking-[0.12em] uppercase" style={{ color: '#F2B705', fontFamily: 'Montserrat, sans-serif' }}>
            Biorrefinaria Integral do Babaçu
          </span>
        </div>

        <p className="m-0 text-[15px] leading-relaxed" style={{ color: '#DCE5D6' }}>
          O babaçu é muito mais do que óleo. Cada camada do coco vira produto de valor, sem desperdício e com a floresta em pé.
        </p>

        <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {camadas.map((c) => (
            <li key={c.nome} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: '#21452A' }}>
              <span className="block w-10 h-2 rounded" style={{ background: c.cor }} aria-hidden="true" />
              <span className="font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {c.nome}
              </span>
              <span className="text-sm leading-snug" style={{ color: '#CFDAC8' }}>
                {c.texto}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] uppercase" style={{ color: '#F2B705' }}>
            Linhas de inovação em desenvolvimento
          </p>
          <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
            {linhas.map((l) => (
              <li key={l} className="text-sm font-semibold px-3 py-1.5 rounded-full border" style={{ borderColor: '#3C6345', color: '#FFFFFF' }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="px-5 sm:px-6 pb-5 text-sm leading-relaxed" style={{ color: '#CFDAC8' }}>
        Com as quebradeiras de coco, o Florar busca uma parceria construtiva: mais renda, menos esforço físico e mais valor para quem conhece a palmeira há
        gerações.
      </figcaption>
    </figure>
  );
}

/**
 * Um caso de exemplo da prévia do Conecta Raras (sinal de alerta, versão para famílias),
 * com a paleta do próprio projeto para marcar que não é um produto do NeoSapiens.
 * Texto copiado da prévia; é rascunho até a validação do comitê científico.
 */
function ExemploConectaRaras() {
  const verde = '#0B6B64';
  const rotulo = 'm-0 text-xs font-semibold tracking-[0.06em] uppercase';
  return (
    <figure className="m-0 rounded-2xl overflow-hidden border border-[#DCE3DF]" style={{ background: '#F6F7F4', color: '#13242B' }}>
      <div className="text-center text-xs px-4 py-2" style={{ background: '#13242B', color: '#E9EFEC' }}>
        Exemplo da prévia · conteúdo em rascunho, ainda sem validação do comitê científico
      </div>
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
            <circle cx="12" cy="17" r="8" fill={verde} />
            <circle cx="22" cy="17" r="8" fill="none" stroke={verde} strokeWidth="3" />
          </svg>
          <span className="font-bold text-lg">Conecta Raras</span>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#E3F1EF', color: '#0A5550' }}>
            Sinais e sintomas · para famílias
          </span>
        </div>

        <div className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ background: '#E3F1EF', color: '#0A5550' }}>
          <strong>Estas informações não servem para diagnóstico.</strong> Elas ajudam a perceber quando vale procurar a UBS e a contar o que foi observado.
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE3DF] p-5 flex flex-col gap-4">
          <h4 className="m-0 text-xl font-semibold leading-tight">Cai muito e está perdendo força</h4>
          <div className="flex flex-col gap-1.5">
            <p className={rotulo} style={{ color: verde }}>
              O que você pode perceber
            </p>
            <ul className="m-0 pl-5 list-disc text-[15px] leading-relaxed">
              <li>Cai com frequência, tem dificuldade para correr, pular ou subir escadas</li>
              <li>Para se levantar do chão, apoia as mãos nas pernas ou em móveis</li>
              <li>Está perdendo força que já tinha, ou as panturrilhas parecem grossas e duras</li>
            </ul>
          </div>
          <div className="rounded-xl p-4 flex flex-col gap-1" style={{ background: '#E3F1EF' }}>
            <p className={rotulo} style={{ color: verde }}>
              O que fazer
            </p>
            <span className="text-[15px] leading-relaxed">
              Procure a UBS. Se puder, grave um vídeo da criança se levantando do chão e subindo um degrau e mostre na consulta.
            </span>
          </div>
          <div className="rounded-xl p-4 text-[15px] leading-relaxed" style={{ background: '#FBE4E1', color: '#7A1F14' }}>
            <strong>Atenção:</strong> dificuldade para respirar, engasgos frequentes ou dificuldade para engolir: emergência.
          </div>
          <div className="rounded-xl p-4 flex flex-col gap-1.5 border border-dashed border-[#B9C6C0]">
            <p className={rotulo} style={{ color: verde }}>
              Leve isto à consulta
            </p>
            <ul className="m-0 pl-5 list-disc text-sm leading-relaxed">
              <li>Desde quando você percebeu? O que mudou desde então?</li>
              <li>Alguém na família tem ou teve algo parecido?</li>
              <li>Fotos ou vídeos que mostrem o que acontece</li>
              <li>Caderneta de saúde, cartão de vacina e exames anteriores</li>
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="px-5 sm:px-6 pb-5 text-sm leading-relaxed" style={{ color: '#3F5058' }}>
        A prévia tem 11 sinais de alerta como este, cada um com uma versão para famílias e um roteiro clínico para profissionais, além de protocolos,
        capacitação, mapa por estado e teleconsultoria. Use o botão “Testar a plataforma” para navegar por tudo.
      </figcaption>
    </figure>
  );
}

// Ordem: do projeto mais avançado para o mais novo.
const PROJETOS: Projeto[] = [
  {
    nome: 'Instituto Florar',
    subtitulo: 'Biorrefinaria Integral do Babaçu',
    resumo:
      'Uma organização rural de Codó (MA), atuando desde 2005, desenvolve uma biorrefinaria pioneira que aproveita o coco babaçu por inteiro, com inovação que gera renda para as comunidades extrativistas e mantém a floresta em pé. A NeoSapiens apoia a criação da identidade, do site e das primeiras parcerias.',
    etapa: 'incubacao',
    fase: 'Identidade visual e site prontos. Agora o instituto busca as primeiras parcerias para chegar à unidade-piloto.',
    marcos: [
      { texto: 'Identidade visual', status: 'feito' },
      { texto: 'Site institucional', status: 'feito' },
      { texto: 'Primeiras parcerias', status: 'andamento' },
      { texto: 'Unidade-piloto', status: 'proximo' }
    ],
    transparencia:
      'O Instituto Florar é uma organização da sociedade civil independente, com CNPJ e direção próprios. O NeoSapiens apoia a criação da identidade, do site e das primeiras parcerias, sem contrapartida.',
    acesso: { rotulo: 'Conhecer o projeto', href: FLORAR_SITE, externo: true, emBreve: 'Site próprio em breve' },
    Vitrine: VitrineFlorar,
    participar: [
      'Comunidades extrativistas e quebradeiras de coco: vamos construir juntos um modelo justo.',
      'Universidades, laboratórios e pesquisadores: ajudem a validar processos e bioativos.',
      'Fomento, investimento de impacto e indústria: apoiem a unidade-piloto e conheçam os ingredientes do babaçu.',
      'Viveiristas e produtores: testem em campo as novas soluções para mudas.'
    ]
  },
  {
    nome: 'Conecta Raras',
    resumo:
      'Informação e capacitação sobre doenças raras para as equipes da atenção primária (UBS). Conteúdo para todo o Brasil, com o Maranhão como estado piloto. Uma ideia nascida entre farmacêuticos.',
    etapa: 'incubacao',
    fase: 'Prévia conceitual em construção, buscando parceiros e o comitê científico. O conteúdo clínico é rascunho até a validação do comitê.',
    marcos: [
      { texto: 'Prévia conceitual', status: 'andamento' },
      { texto: 'Parceiros e comitê científico', status: 'andamento' },
      { texto: 'Instituto independente', status: 'proximo' }
    ],
    transparencia:
      'O Conecta Raras será conduzido por um instituto independente, com comitê científico próprio. O SouNeoSapiens apoia a fase de desenvolvimento. O apoio de empresas vai para um fundo comum e a plataforma não mostra produtos de nenhum apoiador.',
    acesso: { rotulo: 'Testar a plataforma', href: '/laboratorio/conecta-raras/inicio.html' },
    Vitrine: ExemploConectaRaras,
    participar: [
      'Profissionais de saúde: ajudem a revisar os conteúdos e a testar a plataforma.',
      'Famílias e associações de pacientes: contem o que faz falta no dia a dia.',
      'Quem quiser ajudar: parcerias, divulgação e apoio ao futuro instituto.'
    ]
  }
];

function Marcos({ marcos }: { marcos: Projeto['marcos'] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="m-0 text-sm font-semibold text-gray-900">Marcos da incubação</h4>
      <ol className="m-0 p-0 list-none flex flex-wrap gap-2">
        {marcos.map(({ texto, status }) => {
          const { rotulo, Icone, cor } = MARCO[status];
          return (
            <li
              key={texto}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                status === 'feito' ? 'border-emerald-200 bg-emerald-50' : status === 'andamento' ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
              }`}
            >
              <Icone className={`w-4 h-4 ${cor}`} aria-hidden="true" />
              <span className="text-gray-900">{texto}</span>
              <span className="sr-only">({rotulo})</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Laboratorio() {
  return (
    <>
      <Head>
        <title>Laboratório de Ideias — NeoSapiens</title>
        <meta name="description" content="Projetos de impacto social que o NeoSapiens apoia, da ideia até ganharem estrutura própria." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&family=Manrope:wght@400;600&display=swap"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-2xl font-semibold text-white no-underline" style={{ fontFamily: SERIF }}>
            NeoSapiens
          </Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-purple-100 hover:text-white">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar ao início
          </Link>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16 flex flex-col gap-10">
          {/* Abertura */}
          <header className="flex flex-col gap-4 max-w-3xl">
            <p className="m-0 text-[13px] tracking-[0.14em] uppercase font-semibold text-purple-200">Pilar Propósito · Contribuição</p>
            <h1 className="m-0 text-5xl sm:text-6xl leading-[1.05] font-semibold text-white" style={{ fontFamily: SERIF }}>
              Laboratório de Ideias
            </h1>
            <p className="m-0 text-xl leading-relaxed text-purple-100" style={{ fontFamily: SERIF }}>
              Onde o NeoSapiens ajuda ideias de impacto social a crescer, até ganharem vida própria.
            </p>
            <p className="m-0 text-[15px] leading-relaxed text-purple-200">
              Propósito também é contribuir. Aqui o NeoSapiens empresta tempo, ferramentas e experiência a projetos que cuidam de outras pessoas. Quando um
              projeto fica de pé, ele segue o próprio caminho.
            </p>
          </header>

          {/* Como funciona */}
          <section aria-labelledby="como-funciona" className="flex flex-col gap-4">
            <h2 id="como-funciona" className="m-0 text-3xl font-semibold text-white" style={{ fontFamily: SERIF }}>
              Como funciona
            </h2>
            <ol className="m-0 p-0 list-none grid gap-4 sm:grid-cols-3">
              {ETAPAS.map(({ id, titulo, texto, Icone, cor }, i) => (
                <li key={id} className="bg-white rounded-2xl p-5 flex flex-col gap-2 shadow-lg shadow-black/20">
                  <div className="flex items-center gap-2">
                    <Icone className={`w-6 h-6 ${cor}`} aria-hidden="true" />
                    <span className="text-xs font-semibold text-gray-500">Etapa {i + 1}</span>
                  </div>
                  <h3 className="m-0 text-2xl font-bold text-indigo-950" style={{ fontFamily: SERIF }}>
                    {titulo}
                  </h3>
                  <p className="m-0 text-sm leading-relaxed text-gray-700">{texto}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Projetos */}
          <section aria-labelledby="projetos" className="flex flex-col gap-6">
            <h2 id="projetos" className="m-0 text-3xl font-semibold text-white" style={{ fontFamily: SERIF }}>
              Projetos
            </h2>
            {PROJETOS.map((p) => (
              <article key={p.nome} className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-xl shadow-black/25">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 text-3xl font-bold text-indigo-950" style={{ fontFamily: SERIF }}>
                      {p.nome}
                      {p.subtitulo && <span className="font-semibold text-indigo-700"> · {p.subtitulo}</span>}
                    </h3>
                    <p className="m-0 text-[15px] text-gray-700">{p.resumo}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${SELO[p.etapa]}`}>
                    Em {ETAPAS.find((e) => e.id === p.etapa)?.titulo.toLowerCase()}
                  </span>
                </div>

                <p className="m-0 text-[15px] text-gray-800">
                  <strong>Fase atual:</strong> {p.fase}
                </p>

                <Marcos marcos={p.marcos} />

                {p.Vitrine && <p.Vitrine />}

                <div className="flex flex-col gap-2">
                  <h4 className="m-0 text-sm font-semibold text-gray-900">Como participar</h4>
                  <ul className="m-0 pl-5 list-disc flex flex-col gap-1.5 text-sm leading-relaxed text-gray-700">
                    {p.participar.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>

                <p className="m-0 text-sm leading-relaxed text-gray-600 border-l-2 border-purple-300 pl-3">{p.transparencia}</p>

                <div className="flex flex-wrap gap-3">
                  {p.acesso &&
                    (p.acesso.href ? (
                      <a
                        href={p.acesso.href}
                        {...(p.acesso.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex min-h-[44px] items-center gap-2 px-5 rounded-full bg-indigo-950 text-white text-sm font-semibold hover:bg-indigo-900"
                      >
                        {p.acesso.rotulo}
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="inline-flex min-h-[44px] items-center px-5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                        {p.acesso.emBreve ?? 'Em breve'}
                      </span>
                    ))}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Quero participar: ${p.nome}`)}`}
                    className="inline-flex min-h-[44px] items-center px-5 rounded-full border border-indigo-200 text-indigo-950 text-sm font-semibold hover:bg-indigo-50"
                  >
                    Quero participar
                  </a>
                </div>
              </article>
            ))}
          </section>

          {/* Convite */}
          <section className="rounded-2xl border border-dashed border-purple-300/50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-200 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="m-0 text-lg font-semibold text-white">Tem uma ideia de impacto?</p>
                <p className="m-0 text-sm text-purple-200">Conte para a gente. Se fizer sentido, ela pode ser a próxima semente do laboratório.</p>
              </div>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Ideia para o Laboratório de Ideias')}`}
              className="sm:ml-auto inline-flex min-h-[44px] items-center justify-center px-5 rounded-full bg-white text-indigo-950 text-sm font-semibold hover:bg-purple-50"
            >
              Fale com a gente
            </a>
          </section>
        </main>
      </div>
    </>
  );
}
