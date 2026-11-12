// src/pages/voo.tsx
// Plano de Voo: a Bússola sugere rumos a partir do Mapa NeoSapiens, a pessoa
// monta o Voo de Experiência (7 dias), registra o diário e faz a revisão.

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAnalysisProgress from '../hooks/useAnalysisProgress';
import { supabase } from '../lib/supabase';
import FormCard from '../components/ui/FormCard';
import { DISPLAY_FONT } from '../components/traditions/ui';
import FlightSetup from '../components/flight/FlightSetup';
import FlightLog from '../components/flight/FlightLog';
import { bodyFromSaved } from '../lib/body/scoring';
import { mindFromSaved } from '../lib/mind/mind';
import { resultFromSaved } from '../lib/psych/miniIpip';
import { purposeFromSaved } from '../lib/purpose/purpose';
import { Sources, compute } from '../lib/integration/integration';
import { FlightData, baselineFrom, compassHeadings, flightFromSaved } from '../lib/flight/flight';
import useJornada from '../hooks/useJornada';
import { SESSOES, renewedToday, sessaoStatus, today } from '../lib/jornada';

export default function FlightPage() {
  const { user } = useAuth();
  const router = useRouter();
  const preselect = typeof router.query.rumo === 'string' ? { rumo: router.query.rumo, area: typeof router.query.area === 'string' ? router.query.area : undefined } : null;
  const { markAnalysisComplete } = useAnalysisProgress();
  const [row, setRow] = useState<any>(undefined);
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [newFlight, setNewFlight] = useState(false);
  const { jornada, update: updateJornada } = useJornada();
  const signed = Boolean(jornada?.saber && jornada?.compromisso);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('onboarding_progress')
          .select('biohacking_data, psychological_data, cognitive_data, purpose_data, flight_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (error) throw error;
        setRow(data?.[0] ?? null);
        setFlight(flightFromSaved(data?.[0]?.flight_data));
      } catch (err) {
        console.error('Erro ao carregar o Plano de Voo:', err);
        setRow(null);
      }
    })();
  }, [user]);

  const sources: Sources | null = useMemo(
    () =>
      row === undefined
        ? null
        : {
            body: bodyFromSaved(row?.biohacking_data),
            mind: mindFromSaved(row?.cognitive_data),
            psych: resultFromSaved(row?.psychological_data),
            purpose: purposeFromSaved(row?.purpose_data),
            traditions: null
          },
    [row]
  );
  const computed = useMemo(() => (sources ? compute(sources) : null), [sources]);
  const headings = useMemo(() => (sources && computed ? compassHeadings(sources, computed) : []), [sources, computed]);
  const vision = typeof sources?.purpose?.respostas?.meta_dia === 'string' ? (sources.purpose.respostas.meta_dia as string) : undefined;

  const save = async (f: FlightData) => {
    const ok = await markAnalysisComplete('flight', f, false);
    if (ok) {
      setFlight(f);
      setNewFlight(false);
    } else alert('Erro ao salvar. Tente novamente.');
    return ok;
  };

  return (
    <>
      <Head>
        <title>Primeira Jornada — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/jornada" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar à Primeira Jornada
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Primeira Jornada</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              {flight && !newFlight ? 'Diário de Bordo' : 'Primeira Jornada'}
            </h1>
            {(!flight || newFlight) && <p className="m-0 text-[15px] text-purple-100">Sete dias, um rumo, uma ou duas práticas pequenas. A bússola aponta; o timoneiro é você.</p>}
          </header>
          <FormCard>
            {row === undefined || jornada === null ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
            ) : !signed && !flight ? (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[15px] text-gray-800">A Primeira Jornada começa por dois passos: saber o que ela é e assinar o seu compromisso.</p>
                <Link href={`/jornada${router.asPath.includes('?') ? router.asPath.slice(router.asPath.indexOf('?')) : ''}`} className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                  Ir para a Primeira Jornada
                </Link>
              </div>
            ) : flight && !newFlight && jornada && !renewedToday(jornada) ? (
              <div className="flex flex-col gap-4 items-start">
                <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">Antes do Diário de hoje</p>
                <p className="m-0 text-2xl leading-snug text-gray-900" style={{ fontFamily: DISPLAY_FONT, fontSize: 26 }}>
                  Hoje, dia {Math.min(7, Math.max(1, Math.floor((Date.parse(today()) - Date.parse(flight.inicio.slice(0, 10))) / 864e5) + 1))}, eu renovo o meu compromisso com a minha Primeira Jornada.
                </p>
                <button
                  type="button"
                  disabled={renewing}
                  onClick={async () => {
                    setRenewing(true);
                    const ok = await updateJornada({ renovacoes: [...(jornada.renovacoes ?? []), today()].slice(-30) });
                    setRenewing(false);
                    if (!ok) alert('Não foi possível salvar agora. Tente de novo.');
                  }}
                  className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
                >
                  {renewing ? 'Salvando…' : 'Eu renovo'}
                </button>
              </div>
            ) : row === undefined ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
            ) : flight && !newFlight ? (
              <FlightLog flight={flight} onSave={save} onNewFlight={() => setNewFlight(true)} />
            ) : (
              <FlightSetup headings={headings} vision={vision} baseline={sources ? baselineFrom(sources) : {}} onStart={save} preselect={preselect} />
            )}
          </FormCard>
          {signed && (
            <section className="bg-white rounded-2xl shadow-xl shadow-black/25 p-5 sm:p-6 flex flex-col gap-3">
              <h2 className="m-0 text-xl font-bold text-gray-900">As sessões guiadas</h2>
              <p className="m-0 text-sm text-gray-600">Uma por dia, de preferência à noite. Cada uma se abre no dia seguinte ao da anterior.</p>
              <ol className="m-0 p-0 list-none flex flex-col gap-2">
                {SESSOES.map((s) => {
                  const st = jornada ? sessaoStatus(jornada, s.dia) : 'fechada';
                  const label = { feita: '✓ feita · ouvir de novo', aberta: 'disponível hoje', amanha: 'abre amanhã', gravacao: 'em gravação', fechada: '🔒' }[st];
                  const open = st === 'feita' || st === 'aberta';
                  const inner = (
                    <>
                      <span className={`w-9 h-9 rounded-full grid place-items-center text-sm font-bold shrink-0 ${open ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s.dia}</span>
                      <span className="flex flex-col flex-1">
                        <span className="font-semibold text-gray-900">{s.titulo}</span>
                        <span className="text-xs text-gray-500">{s.resumo}</span>
                      </span>
                      <span className={`text-xs font-semibold shrink-0 ${st === 'aberta' ? 'text-purple-700' : st === 'feita' ? 'text-emerald-700' : 'text-gray-400'}`}>{label}</span>
                    </>
                  );
                  return (
                    <li key={s.dia}>
                      {open ? (
                        <Link href={`/jornada/sessao/${s.dia}`} className="flex items-center gap-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 p-3 no-underline">
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 opacity-70">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
          {(!flight || newFlight) && row !== undefined && !preselect && (
            <Link href="/carta" className="text-sm text-purple-200 hover:text-white w-fit">
              ✉️ Ainda não leu a Carta ao Navegante? Ela explica por que a bússola aponta esses rumos.
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
