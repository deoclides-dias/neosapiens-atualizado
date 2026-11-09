// src/pages/carta.tsx
// Carta ao Navegante: a ponte entre o Mapa NeoSapiens e o Plano de Voo.
// Lê os mesmos dados do Mapa e monta a leitura por regras (lib/integration/letter.ts).

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import LetterView from '../components/integration/LetterView';
import { bodyFromSaved } from '../lib/body/scoring';
import { mindFromSaved } from '../lib/mind/mind';
import { resultFromSaved } from '../lib/psych/miniIpip';
import { purposeFromSaved } from '../lib/purpose/purpose';
import { birthInputFromSaved, computeTraditions } from '../lib/astro';
import { Sources, compute } from '../lib/integration/integration';
import { buildLetter } from '../lib/integration/letter';

export default function CartaPage() {
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

  const letter = useMemo(() => (sources ? buildLetter(sources, compute(sources)) : null), [sources]);
  const firstName = useMemo(() => {
    const full = (birthInputFromSaved(row?.birth_data)?.fullName || (user?.user_metadata as any)?.full_name || '').trim();
    const first = full.split(/\s+/)[0] ?? '';
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
  }, [row, user]);
  const empty = letter && !letter.strengths.length && !letter.central && !letter.lever && !letter.headings.length;

  const saveFeedback = async (resposta: string, texto: string) => {
    const { error: e } = await supabase.auth.updateUser({ data: { carta_feedback: { resposta, texto, em: new Date().toISOString() } } });
    if (e) {
      alert('Não foi possível enviar. Tente novamente.');
      return false;
    }
    return true;
  };

  return (
    <>
      <Head>
        <title>Carta ao Navegante — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8 pb-16 flex flex-col gap-10">
          <Link href="/results/integrated" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Mapa NeoSapiens
          </Link>
          {row === undefined && <p className="text-purple-100">Carregando...</p>}
          {row !== undefined && error && <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>}
          {row === null && !error && (
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              Responda os módulos da análise para receber a sua Carta. <Link href="/results" className="text-purple-700 font-semibold">Ir aos módulos</Link>
            </div>
          )}
          {letter && empty && (
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              Ainda há poucas respostas para escrevermos uma leitura honesta. Complete os módulos de Corpo, Personalidade, Mente e Propósito e volte aqui.{' '}
              <Link href="/results" className="text-purple-700 font-semibold">Ir aos módulos</Link>
            </div>
          )}
          {letter && !empty && (
            <LetterView letter={letter} firstName={firstName} onFeedback={saveFeedback} initialFeedback={(user?.user_metadata as any)?.carta_feedback?.resposta ?? null} />
          )}
        </div>
      </div>
    </>
  );
}
