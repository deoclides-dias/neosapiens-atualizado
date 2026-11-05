// src/components/report/ReportDocument.tsx
// Relatório NeoSapiens: todas as análises da pessoa numa página só, pronta
// para imprimir ou salvar em PDF. É a própria pessoa quem gera e decide com
// quem compartilhar (nenhum acesso de administrador aos dados).

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { DISPLAY_FONT, Card, CardTitle, Eyebrow } from '../../components/traditions/ui';
import IntegrationReport from '../../components/integration/IntegrationReport';
import WesternTab from '../../components/traditions/WesternTab';
import ChineseTab from '../../components/traditions/ChineseTab';
import NumerologyTab from '../../components/traditions/NumerologyTab';
import IntegrationTab from '../../components/traditions/IntegrationTab';
import BodyReportView from '../../components/body/BodyReportView';
import PersonalityProfile from '../../components/psych/PersonalityProfile';
import MindReport from '../../components/mind/MindReport';
import PurposeReport from '../../components/purpose/PurposeReport';
import { bodyFromSaved } from '../../lib/body/scoring';
import { mindFromSaved } from '../../lib/mind/mind';
import { resultFromSaved } from '../../lib/psych/miniIpip';
import { purposeFromSaved } from '../../lib/purpose/purpose';
import { birthInputFromSaved, computeTraditions } from '../../lib/astro';
import { FLIGHT_DAYS, addDays, flightFromSaved } from '../../lib/flight/flight';
import { practiceById, rumoById } from '../../lib/flight/library';
import { LIFE_AREAS } from '../../lib/purpose/purpose';
import { formatPersonName } from '../../utils/names';
import { formatDateBR } from '../../utils/dates';
import type { Sources } from '../../lib/integration/integration';

const HAN_TEXT = encodeURIComponent('木火土金水');

function Section({ n, title, sub, children, first = false }: { n: number; title: string; sub?: string; children: React.ReactNode; first?: boolean }) {
  return (
    <section className={`flex flex-col gap-5 ${first ? '' : 'rel-break'}`}>
      <header className="flex flex-col gap-1 border-b border-white/20 pb-3">
        <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">Parte {n}</p>
        <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
          {title}
        </h2>
        {sub && <p className="m-0 text-[15px] text-purple-100">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

export default function ReportDocument({ row, email, error = null }: { row: any; email?: string; error?: string | null }) {
  // Na impressão, abre todos os "Como calculamos" e listas recolhidas
  useEffect(() => {
    const open = () => document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''));
    window.addEventListener('beforeprint', open);
    return () => window.removeEventListener('beforeprint', open);
  }, []);

  const input = useMemo(() => (row ? birthInputFromSaved(row.birth_data) : null), [row]);
  const sources: Sources | null = useMemo(() => {
    if (!row) return null;
    let traditions = null;
    try {
      traditions = input ? computeTraditions(input) : null;
    } catch {
      traditions = null;
    }
    return {
      body: bodyFromSaved(row.biohacking_data),
      mind: mindFromSaved(row.cognitive_data),
      psych: resultFromSaved(row.psychological_data),
      purpose: purposeFromSaved(row.purpose_data),
      traditions
    };
  }, [row, input]);
  const flight = useMemo(() => (row ? flightFromSaved(row.flight_data) : null), [row]);

  const today = new Date();
  const generated = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const name = input?.fullName ? formatPersonName(input.fullName) : email ?? '';
  const modules = sources
    ? [
        { label: 'Tradições', done: Boolean(sources.traditions) },
        { label: 'Corpo', done: Boolean(sources.body?.concluidoEm) },
        { label: 'Personalidade', done: Boolean(sources.psych) },
        { label: 'Mente', done: Boolean(sources.mind?.concluidoEm) },
        { label: 'Propósito', done: Boolean(sources.purpose?.concluidoEm) },
        { label: 'Plano de Voo', done: Boolean(flight) }
      ]
    : [];
  let part = 1;

  return (
    <>
      <Head>
        <title>{name ? `Relatório NeoSapiens — ${name}` : 'Relatório NeoSapiens'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Symbols:wght@400;600&display=swap"
        />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=${HAN_TEXT}&display=swap`} />
      </Head>
      <style jsx global>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          html,
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .rel-no-print {
            display: none !important;
          }
          .rel-break {
            break-before: page;
          }
          .rel-root {
            min-height: 0 !important;
          }
          li,
          svg {
            break-inside: avoid;
          }
          .rel-root button {
            display: none !important;
          }
        }
      `}</style>

      <div className="rel-root min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-10">
          <div className="rel-no-print flex flex-col gap-4">
            <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
              <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
            </Link>
            <div className="rounded-2xl bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex flex-col gap-1">
                <p className="m-0 font-semibold text-gray-900">Seu relatório completo está pronto</p>
                <p className="m-0 text-sm text-gray-600">
                  Toque em “Salvar em PDF” e, na janela que abrir, escolha <strong>Salvar como PDF</strong> como destino. Depois é só enviar o arquivo para quem você quiser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={!sources}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 shrink-0"
              >
                <Printer className="w-5 h-5" /> Salvar em PDF
              </button>
            </div>
          </div>

          {row === undefined && <p className="text-purple-100">Montando seu relatório...</p>}
          {row !== undefined && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}

          {sources && (
            <>
              {/* Capa */}
              <header className="flex flex-col gap-4">
                <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Relatório de análises</p>
                <h1 className="m-0 text-5xl sm:text-6xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
                  {name || 'Relatório NeoSapiens'}
                </h1>
                <p className="m-0 text-[15px] text-purple-100">
                  Gerado em {generated}
                  {input ? ` · nascimento em ${formatDateBR(input.date)} às ${input.time}${input.placeName ? `, ${input.placeName}` : ''}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {modules.map((m) => (
                    <span key={m.label} className={`px-3 py-1 rounded-full text-sm ${m.done ? 'bg-white/10 text-purple-50' : 'border border-dashed border-white/30 text-purple-300'}`}>
                      {m.done ? '✓' : '○'} {m.label}
                    </span>
                  ))}
                </div>
                <p className="m-0 text-sm text-purple-200 max-w-[70ch]">
                  Este relatório reúne as medidas científicas e as leituras das tradições, sempre separadas e com a origem de cada número. Não é diagnóstico: é uma bússola
                  para o autoconhecimento.
                </p>
              </header>

              <Section n={part++} title="Mapa NeoSapiens" sub="A integração de todos os módulos" first>
                <IntegrationReport sources={sources} />
              </Section>

              {sources.traditions && (
                <Section n={part++} title="Mapa das Tradições" sub="Mapa natal, astrologia chinesa e numerologia">
                  <WesternTab chart={sources.traditions.western} />
                  <ChineseTab chart={sources.traditions.chinese} />
                  <NumerologyTab n={sources.traditions.numerology} />
                  <IntegrationTab result={sources.traditions} />
                </Section>
              )}

              {sources.body?.concluidoEm && (
                <Section n={part++} title="Seu Corpo" sub="Sono, movimento, alimentação, digestão e bem-estar">
                  <BodyReportView answers={sources.body.respostas} quality={sources.body.qualidade} />
                </Section>
              )}

              {sources.psych && (
                <Section n={part++} title="Sua Personalidade" sub="Cinco Grandes Fatores · Mini-IPIP">
                  <PersonalityProfile result={sources.psych} />
                </Section>
              )}

              {sources.mind?.concluidoEm && (
                <Section n={part++} title="Sua Mente" sub="Atenção, memória, foco, flexibilidade, criatividade e curiosidade">
                  <MindReport data={sources.mind} />
                </Section>
              )}

              {sources.purpose?.concluidoEm && (
                <Section n={part++} title="Seu Propósito" sub="Valores, sentido e vida valorizada">
                  <PurposeReport answers={sources.purpose.respostas} />
                </Section>
              )}

              {flight && (
                <Section n={part++} title="Plano de Voo" sub={`Voo de Experiência de ${FLIGHT_DAYS} dias · início em ${formatDateBR(flight.inicio)}`}>
                  <Card>
                    <Eyebrow>Rumo escolhido</Eyebrow>
                    <CardTitle>
                      {flight.rumo === 'area'
                        ? `Viver mais: ${LIFE_AREAS.find((a) => a.id === flight.area)?.label.toLowerCase() ?? flight.area}`
                        : rumoById(flight.rumo)?.title ?? flight.rumo}
                    </CardTitle>
                    {flight.porque.length > 0 && (
                      <ul className="m-0 pl-5 text-sm text-gray-700 flex flex-col gap-1">
                        {flight.porque.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    )}
                    {flight.destino && (
                      <p className="m-0 text-[15px] text-gray-800">
                        <strong>Destino:</strong> {flight.destino}
                      </p>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-gray-800">
                      <p className="m-0">
                        <strong>Desejo:</strong> {flight.woop.desejo}
                      </p>
                      <p className="m-0">
                        <strong>Resultado:</strong> {flight.woop.resultado || '—'}
                      </p>
                      <p className="m-0">
                        <strong>Obstáculo:</strong> {flight.woop.obstaculo}
                      </p>
                      <p className="m-0">
                        <strong>Plano:</strong> {flight.woop.plano}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="m-0 text-sm font-semibold text-gray-900">Práticas</p>
                      {flight.praticas.map((p) => (
                        <p key={p.id} className="m-0 text-sm text-gray-800">
                          Depois de {p.ancora.replace(/^depois de\s*/i, '')}, eu vou <strong>{practiceById(p.id)?.text ?? p.id}</strong>.
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="m-0 text-sm font-semibold text-gray-900">Diário de bordo</p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: FLIGHT_DAYS }, (_, i) => {
                          const d = addDays(flight.inicio, i);
                          const log = flight.diario[d];
                          const done = log?.feitas.length ?? 0;
                          return (
                            <div key={d} className={`rounded-lg border p-2 text-center text-xs ${done ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
                              <div className="font-semibold text-gray-900">{d.slice(8)}/{d.slice(5, 7)}</div>
                              <div className="text-gray-600">{log ? `${done}/${flight.praticas.length}` : '—'}</div>
                              {log?.energia ? <div className="text-gray-500">energia {log.energia}/5</div> : null}
                            </div>
                          );
                        })}
                      </div>
                      {Object.entries(flight.diario)
                        .filter(([, l]) => l.nota)
                        .map(([d, l]) => (
                          <p key={d} className="m-0 text-sm text-gray-700">
                            <strong>{formatDateBR(d)}:</strong> {l.nota}
                          </p>
                        ))}
                    </div>
                    {flight.revisao && (
                      <p className="m-0 text-sm text-gray-800">
                        <strong>Revisão de Voo</strong> feita em {formatDateBR(flight.revisao.data.slice(0, 10))}
                        {flight.revisao.comentario ? `: ${flight.revisao.comentario}` : '.'}
                      </p>
                    )}
                  </Card>
                </Section>
              )}

              <p className="m-0 text-xs text-purple-200">
                Relatório gerado pelo NeoSapiens a pedido da própria pessoa. As escalas e testes são creditados em cada parte. Não substitui avaliação de profissional de saúde.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
