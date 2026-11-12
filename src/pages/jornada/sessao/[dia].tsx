// src/pages/jornada/sessao/[dia].tsx
// Sessão guiada de um dia da Primeira Jornada:
// aviso → nota antes (0 a 10) → áudio → nota depois → registro no Diário.
// As notas ficam em user_metadata.jornada.sessoes.

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import JornadaShell from '../../../components/jornada/JornadaShell';
import FormCard from '../../../components/ui/FormCard';
import useJornada from '../../../hooks/useJornada';
import { SESSOES, sessaoStatus, today } from '../../../lib/jornada';

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

export default function SessaoDia() {
  const router = useRouter();
  const dia = Number(router.query.dia);
  const sessao = SESSOES.find((s) => s.dia === dia);
  const { jornada, update } = useJornada();
  const [step, setStep] = useState<Step>('aviso');
  const [ok, setOk] = useState(false);
  const [antes, setAntes] = useState<number | null>(null);
  const [depois, setDepois] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = jornada && sessao ? sessaoStatus(jornada, dia) : null;
  const signed = Boolean(jornada?.saber && jornada?.compromisso);
  const blocked = !signed ? 'Antes das sessões, faça os passos 1 e 2 da Primeira Jornada.' : status === 'amanha' ? 'Esta sessão se abre amanhã. O corpo aprende melhor com um dia de intervalo.' : status === 'fechada' ? `Faça antes a sessão do Dia ${dia - 1}.` : status === 'gravacao' ? 'O áudio desta sessão ainda está sendo gravado. Em breve ele chega aqui.' : null;

  const start = async () => {
    if (antes === null || !jornada) return;
    setSaving(true);
    setError(null);
    const okSave = await update({ sessoes: [...(jornada.sessoes ?? []), { dia, data: today(), antes, depois: null }].slice(-60) });
    setSaving(false);
    if (!okSave) return setError('Não foi possível salvar agora. Tente de novo.');
    setStep('ouvir');
  };

  const save = async () => {
    if (antes === null || depois === null || !jornada) return;
    setSaving(true);
    setError(null);
    const logs = [...(jornada.sessoes ?? [])];
    const i = logs.map((l) => l.dia === dia && l.depois === null).lastIndexOf(true);
    if (i >= 0) logs[i] = { ...logs[i], depois };
    else logs.push({ dia, data: today(), antes, depois });
    const okSave = await update({ sessoes: logs.slice(-60) });
    setSaving(false);
    if (!okSave) return setError('Não foi possível salvar agora. Tente de novo.');
    setStep('fim');
  };

  return (
    <JornadaShell
      back="/voo"
      backLabel="Voltar à Primeira Jornada"
      eyebrow={sessao ? `Primeira Jornada · Dia ${dia} · ${sessao.minutos} minutos` : 'Primeira Jornada'}
      title={sessao ? sessao.titulo : 'Sessão'}
      intro={sessao?.resumo}
    >
      <FormCard>
        {!jornada || !sessao ? (
          <p className="m-0 text-gray-700">{!sessao && router.isReady ? 'Sessão não encontrada.' : 'Carregando...'}</p>
        ) : blocked ? (
          <div className="flex flex-col gap-4">
            <p className="m-0 text-[15px] text-gray-800">{blocked}</p>
            <Link href={signed ? '/voo' : '/jornada'} className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
              Voltar
            </Link>
          </div>
        ) : (
          <>
            {step === 'aviso' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col gap-2">
                    <h2 className="m-0 text-xl font-bold text-gray-900">Antes de começar</h2>
                    <p className="m-0 text-sm leading-relaxed text-gray-700">
                      Ouça sentado ou deitado, num lugar tranquilo, com fone de ouvido se puder. <strong>Nunca ouça dirigindo ou operando máquinas.</strong> Você
                      fica consciente o tempo todo e pode abrir os olhos quando quiser.
                    </p>
                    <p className="m-0 text-sm leading-relaxed text-gray-700">
                      Não é indicada sem acompanhamento profissional para quem tem epilepsia, psicose, transtorno dissociativo ou está passando por uma crise
                      emocional forte. É uma prática de autoconhecimento e relaxamento, não um tratamento.
                    </p>
                  </div>
                </div>
                <label className="flex items-start gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 cursor-pointer">
                  <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-0.5 w-5 h-5 accent-purple-600" />
                  <span className="text-sm text-gray-900">Li e entendi. Estou num lugar seguro para relaxar.</span>
                </label>
                <button type="button" disabled={!ok} onClick={() => setStep('antes')} className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40">
                  Continuar
                </button>
              </div>
            )}

            {step === 'antes' && (
              <div className="flex flex-col gap-5">
                <h2 className="m-0 text-xl font-bold text-gray-900">Como você está agora?</h2>
                <p className="m-0 text-sm text-gray-700">De 0 a 10, quão relaxado(a) você se sente neste momento? A primeira resposta é a melhor.</p>
                <Scale value={antes} onChange={setAntes} low="muito tenso" high="totalmente relaxado" />
                {error && <p className="m-0 text-sm text-rose-700">{error}</p>}
                <button type="button" disabled={antes === null || saving} onClick={start} className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40">
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
                <audio controls preload="auto" src={sessao.audio ?? undefined} onEnded={() => setStep('depois')} className="w-full">
                  Seu navegador não toca áudio.
                </audio>
                <ul className="m-0 pl-5 list-disc text-sm text-gray-700 flex flex-col gap-1">
                  <li>Deixe o volume confortável, nem alto nem baixo.</li>
                  <li>Coloque o celular no modo silencioso.</li>
                  <li>Se for dormir depois da sessão, tudo bem: ela já fica marcada como feita.</li>
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
                <button type="button" disabled={depois === null || saving} onClick={save} className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40">
                  {saving ? 'Salvando…' : 'Registrar no Diário de Bordo'}
                </button>
              </div>
            )}

            {step === 'fim' && antes !== null && depois !== null && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-amber-500" aria-hidden="true" />
                  <h2 className="m-0 text-xl font-bold text-gray-900">Dia {dia} registrado</h2>
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
                </div>
                <p className="m-0 text-sm text-gray-700">{dia < 7 ? `A sessão do Dia ${dia + 1} se abre amanhã. Até lá, siga a prática do seu rumo.` : 'Você completou a Primeira Jornada.'}</p>
                <Link href="/voo" className="min-h-[48px] rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 flex items-center justify-center">
                  Voltar à Primeira Jornada
                </Link>
              </div>
            )}
          </>
        )}
      </FormCard>
      <p className="m-0 text-xs text-purple-200">Voz gerada por inteligência artificial (Google Gemini). Roteiro NeoSapiens. As suas notas ficam guardadas só na sua conta.</p>
    </JornadaShell>
  );
}
