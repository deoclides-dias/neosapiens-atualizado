// src/pages/results/astrology.tsx
// Mapa das Tradições: Mapa Natal, Astrologia Chinesa, Numerologia e
// Integração, calculados no navegador a partir do birth_data salvo.

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { birthInputFromSaved, computeTraditions } from '../../lib/astro';
import { formatDateBR } from '../../utils/dates';
import { formatPersonName } from '../../utils/names';
import WesternTab from '../../components/traditions/WesternTab';
import ChineseTab from '../../components/traditions/ChineseTab';
import NumerologyTab from '../../components/traditions/NumerologyTab';
import IntegrationTab from '../../components/traditions/IntegrationTab';
import { DISPLAY_FONT } from '../../components/traditions/ui';

const TABS = [
  { id: 'natal', label: 'Mapa Natal' },
  { id: 'chinesa', label: 'Astrologia Chinesa' },
  { id: 'numerologia', label: 'Numerologia' },
  { id: 'integracao', label: 'Integração' }
] as const;
type TabId = (typeof TABS)[number]['id'];

// Subconjunto de caracteres chineses usados (troncos, ramos e elementos)
const HAN_TEXT = encodeURIComponent('甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水');

const formatOffset = (min: number) => {
  const sign = min < 0 ? '−' : '+';
  const a = Math.abs(min);
  return `UTC ${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
};

export default function TraditionsResults() {
  const router = useRouter();
  const { user } = useAuth();
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryTab = typeof router.query.aba === 'string' ? (router.query.aba as TabId) : null;
  const [tab, setTab] = useState<TabId>('natal');
  useEffect(() => {
    if (queryTab && TABS.some((t) => t.id === queryTab)) setTab(queryTab);
  }, [queryTab]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('birth_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRaw(data?.[0]?.birth_data ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados de nascimento:', err);
        setError('Não foi possível carregar seus dados de nascimento.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const input = useMemo(() => birthInputFromSaved(raw), [raw]);
  const result = useMemo(() => (input ? computeTraditions(input) : null), [input]);

  const selectTab = (id: TabId) => {
    setTab(id);
    router.replace({ pathname: router.pathname, query: { aba: id } }, undefined, { shallow: true, scroll: false });
  };

  return (
    <>
      <Head>
        <title>Mapa das Tradições — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Symbols:wght@400;600&display=swap"
        />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=${HAN_TEXT}&display=swap`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/results" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar aos resultados
          </Link>

          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Tradições Ancestrais</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>Seu Mapa das Tradições</h1>
            {input && (
              <p className="m-0 text-[15px] text-purple-100">
                {formatPersonName(input.fullName)} · {formatDateBR(input.date)} às {input.time} ({formatOffset(input.utcOffsetMinutes)}) · {input.placeName} · {input.latitude.toFixed(4).replace('.', ',')}°, {input.longitude.toFixed(4).replace('.', ',')}°
              </p>
            )}
          </header>

          {loading && <p className="text-purple-100">Calculando seu mapa...</p>}

          {!loading && error && (
            <div className="bg-white rounded-2xl p-6 text-gray-800">{error}</div>
          )}

          {!loading && !error && !result && (
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 max-w-xl">
              <h2 className="m-0 text-2xl font-bold text-indigo-950" style={{ fontFamily: DISPLAY_FONT }}>Faltam as coordenadas do nascimento</h2>
              <p className="m-0 text-sm leading-relaxed text-gray-700">
                Para calcular o Ascendente, as casas e o fuso horário, precisamos da cidade de nascimento escolhida na lista de sugestões.
                {raw?.birthDate ? ' Seus dados foram salvos antes dessa melhoria.' : ''}
              </p>
              <Link href="/analysis/birth" className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
                Atualizar dados de nascimento
              </Link>
            </div>
          )}

          {result && (
            <>
              <div role="tablist" aria-label="Tradições" className="flex flex-wrap gap-2">
                {TABS.map((t) => {
                  const active = t.id === tab;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      id={`aba-${t.id}`}
                      aria-selected={active}
                      aria-controls={`painel-${t.id}`}
                      onClick={() => selectTab(t.id)}
                      className={`min-h-[44px] px-5 rounded-full text-[15px] transition-colors ${
                        active ? 'bg-white text-indigo-950 font-semibold' : 'border border-white/25 text-purple-50 font-medium hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" id={`painel-${tab}`} aria-labelledby={`aba-${tab}`}>
                {tab === 'natal' && <WesternTab chart={result.western} />}
                {tab === 'chinesa' && <ChineseTab chart={result.chinese} />}
                {tab === 'numerologia' && <NumerologyTab n={result.numerology} />}
                {tab === 'integracao' && <IntegrationTab result={result} />}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
