// src/pages/results/purpose.tsx
// Resultado do módulo Propósito, calculado a partir do purpose_data salvo.

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { PURPOSE_STEPS, purposeFromSaved } from '../../lib/purpose/purpose';
import { DISPLAY_FONT, Card, CardTitle } from '../../components/traditions/ui';
import PurposeReport from '../../components/purpose/PurposeReport';

const HAN_TEXT = encodeURIComponent('木火土金水');

export default function PurposeResults() {
  const { user } = useAuth();
  const [raw, setRaw] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('purpose_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRaw(data?.[0]?.purpose_data ?? null);
      } catch (err) {
        console.error('Erro ao carregar propósito:', err);
        setError('Não foi possível carregar seus dados.');
        setRaw(null);
      }
    })();
  }, [user]);

  const p = raw ? purposeFromSaved(raw) : null;
  const finished = Boolean(p?.concluidoEm);
  const date = p?.concluidoEm ? new Date(p.concluidoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Head>
        <title>Seu Propósito Hoje — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=${HAN_TEXT}&display=swap`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Propósito</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Seu Propósito Hoje
            </h1>
            {finished && <p className="m-0 text-[15px] text-purple-100">Potencial, estado atual e meta · respondido em {date}</p>}
          </header>
          {raw === undefined && <p className="text-purple-100">Carregando...</p>}
          {raw !== undefined && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}
          {raw !== undefined && !error && !finished && (
            <Card className="max-w-xl">
              <CardTitle>{p ? 'Faltam alguns blocos' : 'Você ainda não respondeu'}</CardTitle>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                {p ? `Você concluiu ${p.etapasConcluidas.length} de ${PURPOSE_STEPS.length} blocos.` : 'São 5 blocos curtos, uns 13 minutos no total, e você pode fazer em partes.'}
              </p>
              <Link href="/analysis/purpose" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                {p ? 'Continuar' : 'Começar'}
              </Link>
            </Card>
          )}
          {finished && p && <PurposeReport answers={p.respostas} />}
        </div>
      </div>
    </>
  );
}
