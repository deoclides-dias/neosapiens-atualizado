// src/pages/results/integrated.tsx
// O Mapa NeoSapiens: integração dos cinco módulos (Tradições, Corpo,
// Personalidade, Mente e Propósito), calculada a partir dos dados salvos.

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DISPLAY_FONT } from '../../components/traditions/ui';
import IntegrationReport from '../../components/integration/IntegrationReport';
import { bodyFromSaved } from '../../lib/body/scoring';
import { mindFromSaved } from '../../lib/mind/mind';
import { resultFromSaved } from '../../lib/psych/miniIpip';
import { purposeFromSaved } from '../../lib/purpose/purpose';
import { birthInputFromSaved, computeTraditions } from '../../lib/astro';
import type { Sources } from '../../lib/integration/integration';

const HAN_TEXT = encodeURIComponent('木火土金水');

export default function IntegratedResults() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('birth_data, biohacking_data, psychological_data, cognitive_data, purpose_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRow(data?.[0] ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar seus dados.');
        setRow(null);
      }
    })();
  }, [user]);

  const sources: Sources | null = useMemo(() => {
    if (!row) return null;
    const input = birthInputFromSaved(row.birth_data);
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
  }, [row]);

  const modules = sources
    ? [
        { label: 'Tradições', done: Boolean(sources.traditions), href: '/analysis/birth' },
        { label: 'Corpo', done: Boolean(sources.body?.concluidoEm), href: '/analysis/biohacking' },
        { label: 'Personalidade', done: Boolean(sources.psych), href: '/analysis/psychological' },
        { label: 'Mente', done: Boolean(sources.mind?.concluidoEm), href: '/analysis/cognitive' },
        { label: 'Propósito', done: Boolean(sources.purpose?.concluidoEm), href: '/analysis/purpose' }
      ]
    : [];
  const doneCount = modules.filter((m) => m.done).length;

  return (
    <>
      <Head>
        <title>Seu Mapa NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=${HAN_TEXT}&display=swap`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
          <header className="flex flex-col gap-3">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Integração</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Seu Mapa NeoSapiens
            </h1>
            {sources && (
              <div className="flex flex-wrap gap-2">
                {modules.map((m) =>
                  m.done ? (
                    <span key={m.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-50 text-sm">
                      <Check className="w-3.5 h-3.5" /> {m.label}
                    </span>
                  ) : (
                    <Link key={m.label} href={m.href} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-white/30 text-purple-200 text-sm hover:text-white">
                      {m.label} · responder
                    </Link>
                  )
                )}
              </div>
            )}
            {sources && doneCount < 5 && (
              <p className="m-0 text-sm text-purple-200">O mapa usa o que já foi respondido; os módulos que faltam aparecem vazios.</p>
            )}
          </header>
          {row === undefined && <p className="text-purple-100">Carregando...</p>}
          {row !== undefined && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}
          {sources && <IntegrationReport sources={sources} />}
        </div>
      </div>
    </>
  );
}
