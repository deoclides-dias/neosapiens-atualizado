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

export default function FlightPage() {
  const { user } = useAuth();
  const router = useRouter();
  const preselect = typeof router.query.rumo === 'string' ? { rumo: router.query.rumo, area: typeof router.query.area === 'string' ? router.query.area : undefined } : null;
  const { markAnalysisComplete } = useAnalysisProgress();
  const [row, setRow] = useState<any>(undefined);
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [newFlight, setNewFlight] = useState(false);

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
        <title>Plano de Voo — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results/integrated" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Mapa NeoSapiens
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Plano de Voo</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              {flight && !newFlight ? 'Diário de Bordo' : 'Voo de Experiência'}
            </h1>
            {(!flight || newFlight) && <p className="m-0 text-[15px] text-purple-100">Sete dias, um rumo, uma ou duas práticas pequenas. A bússola aponta; o timoneiro é você.</p>}
          </header>
          <FormCard>
            {row === undefined ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
            ) : flight && !newFlight ? (
              <FlightLog flight={flight} onSave={save} onNewFlight={() => setNewFlight(true)} />
            ) : (
              <FlightSetup headings={headings} vision={vision} baseline={sources ? baselineFrom(sources) : {}} onStart={save} preselect={preselect} />
            )}
          </FormCard>
          <Link
            href="/santuario"
            className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 p-5 no-underline text-purple-50 transition-colors"
          >
            <span className="text-3xl" aria-hidden="true">
              🌊
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold text-white">Santuário do Navegante</span>
              <span className="text-sm text-purple-200">Uma sessão guiada de relaxamento profundo (11 min) para ancorar o seu Voo. Use fones e um lugar tranquilo.</span>
            </span>
            <span className="ml-auto text-purple-200" aria-hidden="true">
              →
            </span>
          </Link>
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
