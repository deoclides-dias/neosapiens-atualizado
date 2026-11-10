// src/pages/index.tsx
// Página inicial pública do NeoSapiens: o que é, como funciona, ciência e
// tradições lado a lado, quem faz, privacidade e o convite para começar.

import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CompassRose, SampleRadar, SampleStar } from '../components/landing/Illustrations';
import { CONTACT_EMAIL } from '../lib/legal';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const HAN_TEXT = encodeURIComponent('木火土金水');

const MODULES = [
  {
    icon: '🌌',
    title: 'Nascimento',
    tag: 'tradições',
    text: 'Seu mapa astral, o seu animal e elemento chinês, os seus números e a leitura da Medicina Tradicional Chinesa.',
    credit: 'Astrologia ocidental e chinesa, numerologia e MTC: leituras simbólicas, não científicas'
  },
  {
    icon: '🧬',
    title: 'Corpo',
    tag: 'ciência',
    text: 'Sono, movimento, alimentação, digestão, álcool, tabaco e bem-estar, com escalas usadas no mundo todo.',
    credit: 'IPAQ, Índice de Bem-Estar OMS-5, AUDIT-C, Escala de Bristol'
  },
  {
    icon: '🎭',
    title: 'Personalidade',
    tag: 'ciência',
    text: 'Os cinco grandes traços, como você é hoje e como gostaria de ser.',
    credit: 'Mini-IPIP (Donnellan e colegas, 2006), modelo dos Cinco Grandes Fatores'
  },
  {
    icon: '⚡',
    title: 'Mente',
    tag: 'ciência',
    text: 'Testes feitos na hora, no próprio navegador: atenção, memória, foco, flexibilidade, criatividade e curiosidade.',
    credit: 'Versões curtas de PVT, extensão de dígitos, Stroop, Trilhas, usos alternativos e NCS-6'
  },
  {
    icon: '🧭',
    title: 'Propósito',
    tag: 'ciência',
    text: 'Seus valores, o sentido que você dá à vida, como andam as áreas da sua vida e o quanto você floresce.',
    credit: 'MLQ (Steger e colegas, 2006), Escala de Florescimento (Diener e colegas, 2010), valores inspirados em Gouveia'
  }
];

const STEPS = [
  { n: '1', title: 'Responda no seu ritmo', text: 'Cinco módulos, em qualquer ordem. Pode parar e voltar: o que já respondeu fica guardado.' },
  {
    n: '2',
    title: 'Receba o Mapa NeoSapiens',
    text: 'Onde a sua vontade e a sua rotina se desencontram, o que puxa o quê na sua vida, e o que as tradições dizem, sempre separado da ciência.'
  },
  { n: '3', title: 'Leia a Carta ao Navegante', text: 'Uma leitura breve do que vemos em você: as suas forças, onde parece travar e por onde talvez valha começar.' },
  {
    n: '4',
    title: 'Faça o seu Plano de Voo',
    text: 'Você escolhe um rumo e vive sete dias de experiência, com uma ou duas práticas pequenas, um diário de bordo e o Santuário para relaxar.'
  }
];

const FAQ = [
  {
    q: 'O NeoSapiens é terapia ou diagnóstico?',
    a: 'Não. É uma ferramenta de autoconhecimento e reflexão. Não faz diagnóstico médico, psicológico ou nutricional e não substitui um profissional de saúde.'
  },
  {
    q: 'Astrologia e numerologia são tratadas como ciência?',
    a: 'Não. As tradições aparecem sempre separadas, com o aviso de que não são científicas. Só quando várias delas dizem a mesma coisa é que elas ganham destaque, e A Ponte mostra, com as regras à vista, onde ciência e tradição concordam ou não.'
  },
  {
    q: 'Preciso saber a hora em que nasci?',
    a: 'Ajuda, porque o ascendente e algumas leituras dependem dela. Se não souber, o mapa é feito do mesmo jeito, e o que depende da hora é marcado.'
  },
  {
    q: 'Quanto custa?',
    a: 'Durante a fase de testes, o NeoSapiens é gratuito. Se um dia houver planos pagos, isso será dito com clareza antes de qualquer cobrança.'
  },
  {
    q: 'O que acontece com as minhas respostas?',
    a: 'Elas servem para gerar os seus resultados. Não são vendidas nem usadas para publicidade, e você pode pedir a exclusão quando quiser. Para pesquisa, só com a sua autorização e de forma anônima.'
  }
];

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`m-0 text-[13px] tracking-[0.14em] uppercase font-semibold ${light ? 'text-purple-200' : 'text-purple-700'}`}>{children}</p>;
}

function H2({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`m-0 text-4xl sm:text-5xl leading-[1.08] font-semibold ${light ? 'text-white' : 'text-indigo-950'}`} style={{ fontFamily: SERIF }}>
      {children}
    </h2>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const primary = user ? { href: '/results', label: 'Continuar minha jornada' } : { href: '/auth/signup', label: 'Tornar-me Neonavegante' };

  return (
    <>
      <Head>
        <title>NeoSapiens — uma bússola, não um manual</title>
        <meta
          name="description"
          content="Autoconhecimento com ciência e tradição: um mapa de você em cinco dimensões, com cada cálculo à vista, e um Plano de Voo para o próximo rumo."
        />
        <meta property="og:title" content="NeoSapiens — uma bússola, não um manual" />
        <meta property="og:description" content="Um mapa de você em cinco dimensões, com ciência creditada e tradições à parte. Gratuito durante a fase de testes." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=${HAN_TEXT}&display=swap`} />
      </Head>

      <div className="bg-[#0d0b24] text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* ---------- Topo ---------- */}
        <header className="bg-gradient-to-br from-indigo-950 via-purple-950 to-[#0d0b24] text-white overflow-hidden">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
            <Link href="/" className="text-2xl font-semibold text-white no-underline" style={{ fontFamily: SERIF }}>
              NeoSapiens
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-purple-100">
              <a href="#como-funciona" className="hover:text-white">
                Como funciona
              </a>
              <a href="#ciencia-e-tradicoes" className="hover:text-white">
                Ciência e tradições
              </a>
              <a href="#quem-somos" className="hover:text-white">
                Quem somos
              </a>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {!user && (
                <Link href="/auth/login" className="hidden sm:inline-flex min-h-[40px] items-center px-4 text-sm font-semibold text-purple-100 hover:text-white">
                  Entrar
                </Link>
              )}
              <Link href={primary.href} className="inline-flex min-h-[40px] items-center px-4 rounded-full bg-white text-indigo-950 text-sm font-semibold hover:bg-purple-50">
                {user ? 'Minha jornada' : 'Começar'}
              </Link>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="flex flex-col gap-6">
              <Kicker light>Autoconhecimento com ciência e tradição</Kicker>
              <h1 className="m-0 text-5xl sm:text-7xl leading-[1.02] font-semibold" style={{ fontFamily: SERIF }}>
                Uma bússola,
                <br />
                <em className="text-amber-200 font-medium">não um manual.</em>
              </h1>
              <p className="m-0 text-lg leading-relaxed text-purple-100 max-w-xl">
                Um mapa de você em cinco dimensões, do corpo ao propósito, passando pelas tradições do seu nascimento, com cada cálculo à vista. Para você
                enxergar onde está e escolher, com clareza, o próximo rumo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={primary.href}
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-xl bg-amber-400 text-indigo-950 font-semibold hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                >
                  {primary.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#como-funciona" className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-xl border border-white/25 text-purple-50 font-semibold hover:bg-white/10">
                  Como funciona
                </a>
              </div>
              <p className="m-0 text-sm text-purple-200">Gratuito durante a fase de testes · no seu ritmo · seus dados não são vendidos</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <CompassRose size={400} />
            </div>
          </div>
        </header>

        {/* ---------- Manifesto ---------- */}
        <section className="bg-[#0d0b24] text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col gap-6 text-center">
            <Kicker light>O manifesto</Kicker>
            <p className="m-0 text-3xl sm:text-4xl leading-snug" style={{ fontFamily: SERIF }}>
              Uma nova espécie de ser humano está surgindo. Não por mutação genética, mas por <em className="text-amber-200">evolução consciente</em>: gente que
              decide se conhecer por inteiro, corpo, mente e propósito, e navegar a própria vida em vez de ser levada por ela.
            </p>
            <p className="m-0 text-base leading-relaxed text-purple-200">
              O NeoSapiens não diz quem você deve ser. Ele mostra, com o máximo de honestidade que a ciência e as tradições permitem, onde você está, e deixa o
              leme com você.
            </p>
          </div>
        </section>

        {/* ---------- Os cinco módulos ---------- */}
        <section className="bg-[#faf7f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col gap-10">
            <div className="flex flex-col gap-3 max-w-2xl">
              <Kicker>O que olhamos</Kicker>
              <H2>Cinco dimensões, um só mapa</H2>
              <p className="m-0 text-lg text-gray-700 leading-relaxed">
                Cada módulo usa instrumentos publicados, com o crédito de quem os criou. As tradições entram como leitura simbólica, sempre identificadas.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULES.map((m) => (
                <article key={m.title} className="rounded-2xl bg-white border border-gray-200 p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">
                      {m.icon}
                    </span>
                    <h3 className="m-0 text-2xl font-semibold text-indigo-950" style={{ fontFamily: SERIF }}>
                      {m.title}
                    </h3>
                    <span
                      className={`ml-auto text-[11px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                        m.tag === 'ciência' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p className="m-0 text-[15px] text-gray-700 leading-relaxed">{m.text}</p>
                  <p className="m-0 mt-auto text-xs text-gray-500 leading-relaxed">{m.credit}</p>
                </article>
              ))}
              <article className="rounded-2xl bg-indigo-950 text-white p-6 flex flex-col gap-3 justify-center">
                <h3 className="m-0 text-2xl font-semibold" style={{ fontFamily: SERIF }}>
                  E depois, a integração
                </h3>
                <p className="m-0 text-[15px] text-purple-100 leading-relaxed">
                  O que nenhum teste mostra sozinho: como o seu sono puxa a sua atenção, como os seus valores conversam com a sua rotina, e onde você está pronto
                  para mudar.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- Como funciona ---------- */}
        <section id="como-funciona" className="bg-white scroll-mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <Kicker>Como funciona</Kicker>
                <H2>Do mapa ao primeiro passo</H2>
              </div>
              <ol className="m-0 p-0 list-none flex flex-col gap-6">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="w-10 h-10 rounded-full bg-indigo-950 text-amber-200 grid place-items-center font-semibold shrink-0" style={{ fontFamily: SERIF, fontSize: 20 }}>
                      {s.n}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="m-0 text-lg font-semibold text-gray-900">{s.title}</h3>
                      <p className="m-0 text-[15px] text-gray-700 leading-relaxed">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-gray-200 p-5 sm:p-6 flex flex-col gap-2 bg-gray-50/60">
                <p className="m-0 text-sm font-semibold text-gray-900">Exemplo: o radar das contradições</p>
                <p className="m-0 text-sm text-gray-600">Onde a vontade (tracejado) e a rotina (cheio) se afastam, mora a sua maior vontade de mudar.</p>
                <SampleRadar />
              </div>
              <div className="rounded-2xl p-6 sm:p-7 shadow-lg border border-amber-100" style={{ background: '#fbf7ee', fontFamily: SERIF, color: '#2b2340' }}>
                <p className="m-0 text-xs uppercase tracking-wider text-purple-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Trecho de uma Carta ao Navegante
                </p>
                <p className="m-0 mt-3 text-xl leading-relaxed">
                  “Se fosse para mexer em uma coisa só, o seu mapa aponta para o <strong>sono</strong>. Esse ponto está ligado a três outras áreas da sua vida, e
                  cuidar dele costuma mover todas juntas.”
                </p>
                <p className="m-0 mt-3 text-sm text-purple-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  por que dizemos isso? ▾
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Ciência e tradições ---------- */}
        <section id="ciencia-e-tradicoes" className="bg-gradient-to-br from-indigo-950 via-purple-950 to-[#0d0b24] text-white scroll-mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col gap-12">
            <div className="flex flex-col gap-3 max-w-2xl">
              <Kicker light>O nosso compromisso</Kicker>
              <H2 light>Ciência e tradição, lado a lado, sem confusão</H2>
              <p className="m-0 text-lg text-purple-100 leading-relaxed">
                A gente acredita que as duas têm algo a dizer sobre você. Mas cada uma fala a sua língua, e a gente nunca mistura as duas sem avisar.
              </p>
            </div>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-3">
                <p className="m-0 text-xs uppercase tracking-wider text-purple-200 font-semibold">Ciência</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] text-purple-50">
                  {[
                    'instrumentos publicados, com crédito aos autores',
                    'cada conta aparece, passo a passo',
                    'margens de erro mostradas, sem promessas',
                    'testes de qualidade das próprias respostas'
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="w-4 h-4 mt-1 text-emerald-300 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 px-2">
                <div className="w-[230px] max-w-full">
                  <SampleStar />
                </div>
                <p className="m-0 text-sm text-center text-purple-200 max-w-[230px]">
                  <strong className="text-white">A Ponte</strong> mostra onde as duas leituras concordam, e onde não.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-3">
                <p className="m-0 text-xs uppercase tracking-wider text-amber-200 font-semibold">Tradições</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] text-purple-50">
                  {[
                    'sempre identificadas como não científicas',
                    'só ganham destaque quando várias dizem o mesmo',
                    'leituras simbólicas, para reflexão',
                    'astrologia ocidental e chinesa, numerologia e Medicina Tradicional Chinesa'
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-amber-200 shrink-0" aria-hidden="true">
                        ✦
                      </span>{' '}
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Quem somos ---------- */}
        <section id="quem-somos" className="bg-[#faf7f0] scroll-mt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid sm:grid-cols-[auto_1fr] gap-8 items-start">
            <img
              src="/images/deoclides.jpg"
              alt="Deoclides Dias, fundador do NeoSapiens"
              width={140}
              height={140}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-lg ring-4 ring-white"
            />
            <div className="flex flex-col gap-4">
              <Kicker>Quem somos</Kicker>
              <H2>Deoclides Dias, fundador</H2>
              <p className="m-0 text-lg text-gray-700 leading-relaxed">
                Farmacêutico clínico e bioquímico, terapeuta ortomolecular e acupunturista, com especializações em Psicanálise, Neuropsicanálise, Hipnose Clínica
                e PNL. Mestre e doutorando em Desenvolvimento e Meio Ambiente.
              </p>
              <p className="m-0 text-[15px] text-gray-600 leading-relaxed">
                Também advogado, gestor ambiental e engenheiro agrônomo, um olhar que atravessa áreas. O NeoSapiens nasceu dessa travessia: juntar o que a ciência
                mede, o que as tradições contam e o que cada pessoa vive, num mapa honesto e fácil de ler.
              </p>
              <p className="m-0 text-[15px] text-gray-600">
                Fale com a gente:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-purple-700 font-semibold underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Perguntas ---------- */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Kicker>Perguntas frequentes</Kicker>
              <H2>Antes de zarpar</H2>
            </div>
            <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none flex items-center gap-4 font-semibold text-gray-900 text-[17px]">
                    {f.q}
                    <span className="ml-auto text-purple-600 group-open:rotate-45 transition-transform text-2xl leading-none" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="m-0 mt-3 text-[15px] text-gray-700 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="m-0 text-sm text-gray-600">
              Os detalhes estão na{' '}
              <Link href="/privacidade" className="text-purple-700 font-semibold underline">
                Política de Privacidade
              </Link>{' '}
              e nos{' '}
              <Link href="/termos" className="text-purple-700 font-semibold underline">
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ---------- Convite final ---------- */}
        <section className="bg-gradient-to-br from-indigo-950 via-purple-950 to-[#0d0b24] text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center gap-6 text-center">
            <h2 className="m-0 text-4xl sm:text-6xl leading-tight font-semibold" style={{ fontFamily: SERIF }}>
              O mapa é seu.
              <br />
              <em className="text-amber-200 font-medium">O leme também.</em>
            </h2>
            <Link
              href={primary.href}
              className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-xl bg-amber-400 text-indigo-950 font-semibold hover:bg-amber-300"
            >
              {primary.label} <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="m-0 text-sm text-purple-200">Gratuito durante a fase de testes</p>
          </div>
        </section>

        <footer className="bg-[#0d0b24] text-purple-200 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-center text-sm">
            <span className="text-white text-lg" style={{ fontFamily: SERIF }}>
              NeoSapiens
            </span>
            <span className="text-purple-300">Uma bússola, não um manual.</span>
            <div className="sm:ml-auto flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
              <Link href="/termos" className="hover:text-white">
                Termos de Uso
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                Contato
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
