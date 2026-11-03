// src/pages/results/biohacking.tsx
// Resultado do módulo Corpo, calculado no navegador a partir do biohacking_data salvo.

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { BLOCKS } from '../../lib/body/questions';
import { BodyData, bodyFromSaved } from '../../lib/body/scoring';
import { DISPLAY_FONT, Card, CardTitle } from '../../components/traditions/ui';
import BodyReportView from '../../components/body/BodyReportView';

export default function BodyResults() {
  const { user } = useAuth();
  const [raw, setRaw] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('biohacking_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRaw(data?.[0]?.biohacking_data ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados do corpo:', err);
        setError('Não foi possível carregar seus dados.');
        setRaw(null);
      }
    })();
  }, [user]);

  const body: BodyData | null = raw ? bodyFromSaved(raw) : null;
  const finished = Boolean(body?.concluidoEm);
  const loading = raw === undefined;
  const date = body?.concluidoEm ? new Date(body.concluidoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Head>
        <title>Seu Corpo Hoje — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Corpo</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Seu Corpo Hoje
            </h1>
            {finished && <p className="m-0 text-[15px] text-purple-100">Sono, movimento, alimentação, digestão e bem-estar · respondido em {date}</p>}
          </header>

          {loading && <p className="text-purple-100">Carregando...</p>}
          {!loading && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}

          {!loading && !error && !finished && (
            <Card className="max-w-xl">
              <CardTitle>{body ? 'Faltam alguns blocos' : raw ? 'O questionário mudou' : 'Você ainda não respondeu'}</CardTitle>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                {body
                  ? `Você concluiu ${body.blocosConcluidos.length} de ${BLOCKS.length} blocos. Termine os outros para ver o resultado.`
                  : raw
                    ? 'Trocamos o formulário antigo por 7 blocos curtos, com instrumentos científicos e a conta à mostra. Responda de novo para ver seu resultado: leva uns 15 minutos, e você pode fazer em partes.'
                    : 'São 7 blocos curtos, uns 15 minutos no total, e você pode fazer em partes.'}
              </p>
              <Link href="/analysis/biohacking" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                {body ? 'Continuar' : 'Responder agora'}
              </Link>
            </Card>
          )}

          {finished && body && <BodyReportView answers={body.respostas} quality={body.qualidade} />}
        </div>
      </div>
    </>
  );
}
