// src/pages/santuario.tsx
// Santuário do Navegante: sessão guiada de autohipnose (Sessão 1).
// Aviso de segurança → nota de relaxamento antes → áudio → nota depois.
// As notas ficam no perfil da própria pessoa (metadados da conta), para
// mostrar a evolução sessão a sessão.

import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { DISPLAY_FONT } from '../components/traditions/ui';
import FormCard from '../components/ui/FormCard';

const AUDIO = '/audio/santuario-sessao-1.mp3';

interface SessionLog {
  data: string; // ISO
  sessao: 1;
  antes: number;
  depois: number;
}

type Step = 'aviso' | 'antes' | 'ouvir' | 'depois' | 'fim';

function Scale({ value, onChange, low, high }: { value: number | null; onChange: (n: number) => void; low: string; high: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            style={value === n ? { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed' } : undefined}
            className={`h-11 rounded-lg text-sm font-semibold border transition-colors ${
              value === n ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-800 border-gray-200 hover:border-purple-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0 · {low}</span>
        <span>{high} · 10</span>
      </div>
    </div>
  );
}

function History({ logs }: { logs: SessionLog[] }) {
  if (!logs.length) return null;
  const last = logs.slice(-8);
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-sm font-semibold text-gray-900">Suas sessões</p>
      <div className="flex items-end gap-3 overflow-x-auto pb-1">
        {last.map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[44px]">
            <div className="flex items-end gap-1 h-24">
              <div className="w-3 rounded-t bg-gray-300" style={{ height: `${Math.max(4, l.antes * 10)}%` }} title={`Antes: ${l.antes}`} />
              <div className="w-3 rounded-t bg-purple-600" style={{ height: `${Math.max(4, l.depois * 10)}%` }} title={`Depois: ${l.depois}`} />
            </div>
            <span className="text-[11px] text-gray-500">
              {l.data.slice(8, 10)}/{l.data.slice(5, 7)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" /> antes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" /> depois
        </span>
      </div>
    </div>
  );
}

export default function Santuario() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('aviso');
  const [ok, setOk] = useState(false);
  const [antes, setAntes] = useState<number | null>(null);
  const [depois, setDepois] = useState<number | null>(null);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const saved = (user?.user_metadata as any)?.santuario;
    if (Array.isArray(saved)) setLogs(saved);
  }, [user]);

  const save = async () => {
    if (antes === null || depois === null) return;
    setSaving(true);
    setError(null);
    const next = [...logs, { data: new Date().toISOString(), sessao: 1 as const, antes, depois }].slice(-60);
    const { error: e } = await supabase.auth.updateUser({ data: { santuario: next } });
    setSaving(false);
    if (e) {
      setError('Não foi possível salvar agora. Tente de novo.');
      return;
    }
    setLogs(next);
    setStep('fim');
  };

  const avg = useMemo(() => (logs.length ? logs.reduce((s, l) => s + (l.depois - l.antes), 0) / logs.length : null), [logs]);

  return (
    <>
      <Head>
        <title>Santuário do Navegante — NeoSapiens</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col gap-7">
          <Link href="/voo" className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Plano de Voo
          </Link>
          <header className="flex flex-col gap-2.5">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">NeoSapiens · Sessão 1 · 11 minutos</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              Santuário do Navegante
            </h1>
            <p className="m-0 text-[15px] text-purple-100">
              Um relaxamento guiado para construir o seu lugar interno de calma e força, e uma âncora para voltar a ele no dia a dia.
            </p>
          </header>

          <FormCard>
            {step === 'aviso' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col gap-2">
                    <h2 className="m-0 text-xl font-bold text-gray-900">Antes de começar</h2>
                    <p className="m-0 text-sm leading-relaxed text-gray-700">
                      Esta é uma prática de relaxamento profundo. Ouça sentado ou deitado, num lugar tranquilo, com fone de ouvido se puder.{' '}
                      <strong>Nunca ouça dirigindo ou operando máquinas.</strong> Você fica consciente o tempo todo e pode abrir os olhos quando quiser.
                    </p>
                    <p className="m-0 text-sm leading-relaxed text-gray-700">
                      Não é indicada sem acompanhamento profissional para quem tem epilepsia, psicose, transtorno dissociativo ou está passando por uma crise
                      emocional forte. A autohipnose ajuda no relaxamento e no foco, mas não substitui tratamento de saúde.
                    </p>
                  </div>
                </div>
                <label className="flex items-start gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 cursor-pointer">
                  <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-0.5 w-5 h-5 accent-purple-600" />
                  <span className="text-sm text-gray-900">Li e entendi. Estou num lugar seguro para relaxar.</span>
                </label>
                <button
                  type="button"
                  disabled={!ok}
                  onClick={() => setStep('antes')}
                  className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
                >
                  Continuar
                </button>
                <History logs={logs} />
              </div>
            )}

            {step === 'antes' && (
              <div className="flex flex-col gap-5">
                <h2 className="m-0 text-xl font-bold text-gray-900">Como você está agora?</h2>
                <p className="m-0 text-sm text-gray-700">De 0 a 10, quão relaxado(a) você se sente neste momento? Não pense muito: a primeira resposta é a melhor.</p>
                <Scale value={antes} onChange={setAntes} low="muito tenso" high="totalmente relaxado" />
                <button
                  type="button"
                  disabled={antes === null}
                  onClick={() => setStep('ouvir')}
                  className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
                >
                  Ir para a sessão
                </button>
              </div>
            )}

            {step === 'ouvir' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Headphones className="w-7 h-7 text-purple-600" aria-hidden="true" />
                  <h2 className="m-0 text-xl font-bold text-gray-900">Aperte o play e feche os olhos</h2>
                </div>
                <audio ref={audio} controls preload="auto" src={AUDIO} onEnded={() => setStep('depois')} className="w-full">
                  Seu navegador não toca áudio.
                </audio>
                <ul className="m-0 pl-5 text-sm text-gray-700 flex flex-col gap-1">
                  <li>Deixe o volume confortável, nem alto nem baixo.</li>
                  <li>Se o celular estiver por perto, coloque no modo silencioso.</li>
                  <li>Ao final, a página pergunta como você está.</li>
                </ul>
                <button type="button" onClick={() => setStep('depois')} className="text-sm font-semibold text-purple-700 w-fit min-h-[40px]">
                  Já terminei a sessão
                </button>
              </div>
            )}

            {step === 'depois' && (
              <div className="flex flex-col gap-5">
                <h2 className="m-0 text-xl font-bold text-gray-900">Bem-vindo de volta, navegante</h2>
                <p className="m-0 text-sm text-gray-700">E agora, de 0 a 10, quão relaxado(a) você se sente?</p>
                <Scale value={depois} onChange={setDepois} low="muito tenso" high="totalmente relaxado" />
                {error && <p className="m-0 text-sm text-rose-700">{error}</p>}
                <button
                  type="button"
                  disabled={depois === null || saving}
                  onClick={save}
                  className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
                >
                  {saving ? 'Salvando…' : 'Salvar'}
                </button>
              </div>
            )}

            {step === 'fim' && antes !== null && depois !== null && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-amber-500" aria-hidden="true" />
                  <h2 className="m-0 text-xl font-bold text-gray-900">Sessão registrada</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center rounded-xl bg-gray-100 px-5 py-3">
                    <span className="text-xs text-gray-500">Antes</span>
                    <span className="text-3xl font-bold text-gray-700">{antes}</span>
                  </div>
                  <span className="text-2xl text-gray-400">→</span>
                  <div className="flex flex-col items-center rounded-xl bg-purple-100 px-5 py-3">
                    <span className="text-xs text-purple-700">Depois</span>
                    <span className="text-3xl font-bold text-purple-700">{depois}</span>
                  </div>
                  <span className={`text-lg font-semibold ${depois - antes > 0 ? 'text-emerald-700' : depois - antes < 0 ? 'text-rose-700' : 'text-gray-600'}`}>
                    {depois - antes > 0 ? '+' : ''}
                    {depois - antes}
                  </span>
                </div>
                <p className="m-0 text-sm text-gray-700">
                  Lembre da âncora: sempre que juntar o polegar e o indicador e respirar fundo, um pouco desta calma volta com você.
                  {avg !== null && logs.length > 1 && ` Em ${logs.length} sessões, a sua mudança média foi de ${avg > 0 ? '+' : ''}${avg.toFixed(1).replace('.', ',')} ponto(s).`}
                </p>
                <History logs={logs} />
                <Link href="/voo" className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 flex items-center justify-center">
                  Voltar ao Plano de Voo
                </Link>
              </div>
            )}
          </FormCard>

          <p className="m-0 text-xs text-purple-200">
            Voz gerada por inteligência artificial (Google Gemini). Roteiro NeoSapiens. As suas notas antes e depois ficam guardadas só na sua conta.
          </p>
        </div>
      </div>
    </>
  );
}
