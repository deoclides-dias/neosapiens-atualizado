// src/pages/results/psychological.tsx
// Perfil de personalidade (Mini-IPIP): cinco traços de 0 a 100, com margem
// de incerteza, verificação de qualidade e a conta de cada traço à mostra.

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { resultFromSaved } from '../../lib/psych/miniIpip';
import { DISPLAY_FONT, Card, CardTitle } from '../../components/traditions/ui';
import PersonalityProfile from '../../components/psych/PersonalityProfile';

export default function PsychologicalResults() {
  const { user } = useAuth();
  const [raw, setRaw] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('psychological_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRaw(data?.[0]?.psychological_data ?? null);
      } catch (err) {
        console.error('Erro ao carregar perfil psicológico:', err);
        setError('Não foi possível carregar seu perfil.');
        setRaw(null);
      }
    })();
  }, [user]);

  const result = useMemo(() => resultFromSaved(raw), [raw]);
  const loading = raw === undefined;
  const date = result ? new Date(result.concluidoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Head>
        <title>Perfil de Personalidade — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>

          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Mente</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>Seu Perfil de Personalidade</h1>
            {result && <p className="m-0 text-[15px] text-purple-100">Cinco Grandes Fatores · Mini-IPIP · respondido em {date}</p>}
          </header>

          {loading && <p className="text-purple-100">Carregando seu perfil...</p>}
          {!loading && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}

          {!loading && !error && !result && (
            <Card className="max-w-xl">
              <CardTitle>{raw ? 'O questionário mudou' : 'Você ainda não respondeu'}</CardTitle>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                {raw
                  ? 'Trocamos as 96 perguntas antigas por um questionário científico curto, de 20 frases, com verificação de qualidade. Responda de novo para ver seu perfil: leva uns 4 minutos.'
                  : 'São 20 frases curtas, cerca de 4 minutos.'}
              </p>
              <Link href="/analysis/psychological" className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                Responder agora
              </Link>
            </Card>
          )}

          {result && <PersonalityProfile result={result} />}
        </div>
      </div>
    </>
  );
}
