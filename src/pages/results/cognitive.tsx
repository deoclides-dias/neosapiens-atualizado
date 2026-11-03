// src/pages/results/cognitive.tsx
// Resultado do módulo Mente, calculado a partir do cognitive_data salvo.

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { STEPS, mindFromSaved } from '../../lib/mind/mind';
import { DISPLAY_FONT, Card, CardTitle } from '../../components/traditions/ui';
import MindReport from '../../components/mind/MindReport';

export default function MindResults() {
  const { user } = useAuth();
  const [raw, setRaw] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('cognitive_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRaw(data?.[0]?.cognitive_data ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados da mente:', err);
        setError('Não foi possível carregar seus dados.');
        setRaw(null);
      }
    })();
  }, [user]);

  const mind = raw ? mindFromSaved(raw) : null;
  const finished = Boolean(mind?.concluidoEm);
  const date = mind?.concluidoEm ? new Date(mind.concluidoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Head>
        <title>Sua Mente Hoje — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Mente</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Sua Mente Hoje
            </h1>
            {finished && <p className="m-0 text-[15px] text-purple-100">Atenção, memória, foco, flexibilidade, criatividade e curiosidade · feito em {date}</p>}
          </header>

          {raw === undefined && <p className="text-purple-100">Carregando...</p>}
          {raw !== undefined && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}
          {raw !== undefined && !error && !finished && (
            <Card className="max-w-xl">
              <CardTitle>{mind ? 'Faltam algumas etapas' : raw ? 'O módulo mudou' : 'Você ainda não fez'}</CardTitle>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                {mind
                  ? `Você concluiu ${mind.etapasConcluidas.length} de ${STEPS.length} etapas.`
                  : 'São uma autoavaliação e cinco testes curtos no navegador, uns 13 minutos no total. Dá para fazer em partes.'}
              </p>
              <Link href="/analysis/cognitive" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                {mind ? 'Continuar' : 'Começar'}
              </Link>
            </Card>
          )}
          {finished && mind && <MindReport data={mind} />}
        </div>
      </div>
    </>
  );
}
