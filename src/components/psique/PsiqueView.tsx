// src/components/psique/PsiqueView.tsx
// Mapa da Psique: quatro perguntas, cada uma com duas colunas lado a lado,
// "o que o símbolo sugere" (mapa natal) e "o que a medida mostrou" (Mini-IPIP),
// e a Janela de Johari. Um lado nunca explica o outro.

import { ReactNode, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DISPLAY_FONT } from '../traditions/ui';
import { birthInputFromSaved, computeWestern } from '../../lib/astro';
import { resultFromSaved, scoreTraits, TRAITS, GAP_THRESHOLD, PsychologicalResult, INSTRUMENT } from '../../lib/psych/miniIpip';
import { johari, psiqueBlocks, PsiqueBlock, BlockId } from '../../lib/psique/psique';

function Card({ children }: { children: ReactNode }) {
  return <section className="bg-white rounded-2xl shadow-xl shadow-black/25 p-5 sm:p-7 flex flex-col gap-5 text-gray-900">{children}</section>;
}

function ColTitle({ children }: { children: ReactNode }) {
  return <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">{children}</p>;
}

function CTA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 w-fit">
      {children}
    </Link>
  );
}

function Bar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="w-20 shrink-0 text-xs text-gray-600">{label}</span>}
      <div className="flex-1 h-2.5 rounded-full bg-gray-100">
        <div className="h-2.5 rounded-full" style={{ width: `${Math.max(2, value)}%`, background: color }} />
      </div>
      <span className="w-8 text-right text-xs font-bold">{value}</span>
    </div>
  );
}

function SymbolCol({ b }: { b: PsiqueBlock }) {
  return (
    <div className="flex flex-col gap-3">
      <ColTitle>O que o símbolo sugere</ColTitle>
      <div>
        <p className="m-0 font-semibold">{b.protagonist.label}</p>
        <p className="m-0 mt-1 text-sm leading-relaxed text-gray-700">{b.protagonist.reading}</p>
      </div>
      {b.modulators.map((m) => (
        <div key={m.label} className="pl-3 border-l-2 border-purple-200">
          <p className="m-0 text-sm font-semibold">{m.label}</p>
          <p className="m-0 mt-0.5 text-sm leading-relaxed text-gray-700">{m.reading}</p>
        </div>
      ))}
      <p className="m-0 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[15px] italic text-amber-950" style={{ fontFamily: DISPLAY_FONT, fontSize: 19 }}>
        {b.compass}
      </p>
      <details className="group text-xs text-gray-600">
        <summary className="cursor-pointer list-none font-semibold text-purple-700">Como escolhemos ▾</summary>
        <p className="m-0 mt-1.5 leading-relaxed">{b.rule}</p>
      </details>
    </div>
  );
}

function MeasureCol({ id, r }: { id: BlockId; r: PsychologicalResult | null }) {
  if (!r)
    return (
      <div className="flex flex-col gap-3">
        <ColTitle>O que a medida mostrou</ColTitle>
        <p className="m-0 text-sm text-gray-700">Esta coluna usa a avaliação de personalidade (Mini-IPIP).</p>
        <CTA href="/analysis/psychological">Fazer a avaliação</CTA>
      </div>
    );
  const real = scoreTraits(r.respostas);
  const score = (rr: any, t: string) => (rr ? scoreTraits(rr.respostas).find((x) => x.id === t)!.score : null);

  if (id === 'eu')
    return (
      <div className="flex flex-col gap-3">
        <ColTitle>O que a medida mostrou · como você se descreve hoje</ColTitle>
        {TRAITS.map((t) => (
          <Bar key={t.id} label={t.name} value={real.find((x) => x.id === t.id)!.score} color={t.color} />
        ))}
        <p className="m-0 text-xs text-gray-500">Mini-IPIP, de 0 a 100, margem de ±11.</p>
      </div>
    );

  if (id === 'outros') {
    if (!r.outro)
      return (
        <div className="flex flex-col gap-3">
          <ColTitle>O que a medida mostrou</ColTitle>
          <p className="m-0 text-sm text-gray-700">Responda as mesmas frases junto com alguém próximo, ou como acha que os outros veem você.</p>
          <CTA href="/analysis/psique">Responder agora</CTA>
        </div>
      );
    const who = r.outro.modo === 'com_alguem' ? (r.outro.relacao ? `segundo ${r.outro.relacao}` : 'segundo alguém próximo') : 'como você acha que os outros veem você';
    return (
      <div className="flex flex-col gap-3">
        <ColTitle>O que a medida mostrou · você × {who}</ColTitle>
        {TRAITS.map((t) => (
          <div key={t.id} className="flex flex-col gap-1">
            <span className="text-xs font-semibold">{t.name}</span>
            <Bar label="você" value={real.find((x) => x.id === t.id)!.score} color={t.color} />
            <Bar label={r.outro!.modo === 'com_alguem' ? 'o outro' : 'imagina'} value={score(r.outro, t.id)!} color="#9ca3af" />
          </div>
        ))}
      </div>
    );
  }

  if (id === 'cultura') {
    if (!r.ideal && !r.dever)
      return (
        <div className="flex flex-col gap-3">
          <ColTitle>O que a medida mostrou</ColTitle>
          <p className="m-0 text-sm text-gray-700">Responda as mesmas frases pensando em como acha que deveria ser.</p>
          <CTA href="/analysis/psique">Responder agora</CTA>
        </div>
      );
    const rows = TRAITS.map((t) => {
      const today = real.find((x) => x.id === t.id)!.score;
      return { t, today, ideal: score(r.ideal, t.id), dever: score(r.dever, t.id) };
    });
    const gaps = (k: 'ideal' | 'dever') => rows.filter((x) => x[k] !== null && Math.abs((x[k] as number) - x.today) >= GAP_THRESHOLD);
    return (
      <div className="flex flex-col gap-3">
        <ColTitle>O que a medida mostrou · hoje, gostaria e deveria</ColTitle>
        {rows.map(({ t, today, ideal, dever }) => (
          <div key={t.id} className="flex flex-col gap-1">
            <span className="text-xs font-semibold">{t.name}</span>
            <Bar label="hoje" value={today} color={t.color} />
            {ideal !== null && <Bar label="gostaria" value={ideal} color="#f59e0b" />}
            {dever !== null && <Bar label="deveria" value={dever} color="#64748b" />}
          </div>
        ))}
        <p className="m-0 text-sm leading-relaxed text-gray-700">
          {r.ideal && <>Distâncias do <strong>Ideal do Eu</strong> (gostaria): {gaps('ideal').map((x) => x.t.name.toLowerCase()).join(', ') || 'nenhuma acima da margem'}. </>}
          {r.dever ? (
            <>Distâncias da <strong>régua do dever</strong> (deveria): {gaps('dever').map((x) => x.t.name.toLowerCase()).join(', ') || 'nenhuma acima da margem'}.</>
          ) : (
            <Link href="/analysis/psique" className="text-purple-700 font-semibold underline">Falta o &quot;como acho que deveria ser&quot;</Link>
          )}
        </p>
        <p className="m-0 text-xs text-gray-500">
          Higgins (1987): a distância do ideal costuma vir com frustração; a do dever, com culpa e ansiedade. Só contam diferenças de 16 pontos ou mais.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ColTitle>O que a medida mostrou</ColTitle>
      <p className="m-0 text-sm leading-relaxed text-gray-700">
        Esta coluna vai receber o questionário de estilos de defesa (DSQ-40), que mede como cada pessoa lida com os próprios conflitos: estilos maduro, neurótico
        e imaturo. Ele está aguardando a autorização dos autores.
      </p>
      <p className="m-0 text-xs text-gray-500">Até lá, esta pergunta fica só com a leitura simbólica e a pergunta da bússola.</p>
    </div>
  );
}

export default function PsiqueView({ row }: { row: any }) {
  const chart = useMemo(() => {
    const input = birthInputFromSaved(row?.birth_data);
    try {
      return input ? computeWestern(input) : null;
    } catch {
      return null;
    }
  }, [row]);
  const psych = useMemo(() => resultFromSaved(row?.psychological_data), [row]);
  const blocks = useMemo(() => (chart ? psiqueBlocks(chart) : null), [chart]);
  const jo = psych ? johari(psych) : null;
  const meta = jo?.mode === 'sozinho';

  return (
    <>
      <Head>
        <title>Mapa da Psique — NeoSapiens</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8 pb-16 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
          <header className="flex flex-col gap-3">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Freud, Jung e o seu mapa</p>
            <h1 className="m-0 text-4xl sm:text-5xl font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Seu Mapa da Psique
            </h1>
            <p className="m-0 max-w-3xl text-[15px] leading-relaxed text-purple-100">
              Quatro perguntas. Em cada uma, duas colunas lado a lado: <strong className="text-white">o que o símbolo sugere</strong>, lido no seu mapa natal, e{' '}
              <strong className="text-white">o que a medida mostrou</strong>, nas suas respostas. Uma não explica a outra: quem tira conclusão é você.
            </p>
            <Link href="/analysis/psique" className="inline-flex items-center min-h-[44px] px-4 rounded-full bg-white text-indigo-950 text-sm font-semibold w-fit">
              Responder ou refazer os olhares
            </Link>
          </header>

          {row === undefined && <p className="text-purple-100">Carregando...</p>}
          {row !== undefined && !blocks && (
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 max-w-xl">
              <p className="m-0 text-[15px] text-gray-800">A coluna do símbolo precisa da data, da hora e do local exatos do seu nascimento.</p>
              <CTA href="/analysis/birth">Informar dados de nascimento</CTA>
            </div>
          )}

          {row !== undefined &&
            (blocks ?? []).map((b, i) => (
              <Card key={b.id}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-bold text-purple-700">{i + 1}</span>
                  <h2 className="m-0 text-3xl font-semibold" style={{ fontFamily: DISPLAY_FONT }}>
                    {b.question}
                  </h2>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{b.instance}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                  <SymbolCol b={b} />
                  <MeasureCol id={b.id} r={psych} />
                </div>
              </Card>
            ))}

          {row !== undefined && (
            <Card>
              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-3xl font-semibold" style={{ fontFamily: DISPLAY_FONT }}>
                  A sua Janela de Johari
                </h2>
                <p className="m-0 text-sm text-gray-600">
                  Luft e Ingham (1955): o que você sabe de si cruzado com o que os outros sabem.{' '}
                  {jo && (meta ? 'Aqui, o olhar dos outros é o que você imagina que eles veem.' : `O olhar do outro veio ${jo.relation ? `de ${jo.relation}` : 'de alguém próximo'}.`)}
                </p>
              </div>
              {!jo ? (
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-sm text-gray-700">A janela precisa do olhar dos outros: as mesmas frases, respondidas com alguém próximo ou como você acha que os outros veem você.</p>
                  <CTA href="/analysis/psique">Responder agora</CTA>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { t: 'Aberto', s: 'você vê e os outros veem', list: jo.open, tone: 'bg-emerald-50 border-emerald-200' },
                    { t: meta ? 'O que você acha que os outros veem a mais' : 'Ponto cego', s: meta ? 'você imagina que os outros enxergam mais do que você' : 'o outro vê mais do que você', list: jo.blind, tone: 'bg-amber-50 border-amber-200' },
                    { t: meta ? 'O que você acha que guarda' : 'Escondido', s: meta ? 'você vê em si, mas imagina que os outros não' : 'você vê mais do que o outro', list: jo.hidden, tone: 'bg-sky-50 border-sky-200' },
                    { t: 'Desconhecido', s: 'nem você nem os outros', list: null, tone: 'bg-purple-50 border-purple-200' }
                  ].map((q) => (
                    <div key={q.t} className={`rounded-xl border p-4 flex flex-col gap-2 ${q.tone}`}>
                      <p className="m-0 font-semibold">{q.t}</p>
                      <p className="m-0 text-xs text-gray-600">{q.s}</p>
                      {q.list ? (
                        q.list.length ? (
                          <ul className="m-0 pl-4 text-sm flex flex-col gap-0.5">
                            {q.list.map((x) => (
                              <li key={x.id}>
                                {x.name}: você {x.self}, {meta ? 'acha que veem' : 'o outro'} {x.other}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="m-0 text-sm text-gray-500">Nenhum traço aqui.</p>
                        )
                      ) : (
                        <p className="m-0 text-sm text-gray-700">
                          Nenhum questionário chega aqui. É o lugar das perguntas da bússola acima, dos símbolos e da{' '}
                          <Link href="/carta" className="text-purple-700 font-semibold underline">Carta ao Navegante</Link>.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="m-0 text-xs text-gray-500">Um traço só sai do &quot;Aberto&quot; com diferença de 16 pontos ou mais. Vazire (2010): os outros costumam perceber melhor alguns traços que se mostram, e você, os internos.</p>
            </Card>
          )}

          {row !== undefined && blocks && (
            <Link href="/carta" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-white text-indigo-950 font-semibold hover:bg-purple-50 w-fit">
              Ler a Carta ao Navegante
            </Link>
          )}

          <p className="m-0 text-xs text-purple-200 leading-relaxed">
            Leitura simbólica inspirada em Freud e Jung, ao lado de uma medida científica ({INSTRUMENT.name}, domínio público). Para autoconhecimento: não é avaliação
            psicológica nem diagnóstico. As regras de cada destaque estão em &quot;Como escolhemos&quot;.
          </p>
        </div>
      </div>
    </>
  );
}
