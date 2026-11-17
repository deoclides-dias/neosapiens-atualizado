// src/pages/jornada/sessao/[dia].tsx
// Sessão guiada de um dia da Primeira Jornada:
// aviso → nota antes (0 a 10) → áudio → nota depois → registro no Diário.
// As notas ficam em user_metadata.jornada.sessoes.

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bell, Castle, DoorClosed, Headphones, Landmark, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import JornadaShell from '../../../components/jornada/JornadaShell';
import FormCard from '../../../components/ui/FormCard';
import useJornada from '../../../hooks/useJornada';
import { DIA_PALACIO, DIA_SABIO, DIA_SANTUARIO, PalacioNota, PORTAS, SantuarioNota, SESSOES, sessaoStatus, today } from '../../../lib/jornada';

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

function SantuarioCard({ nota, titulo }: { nota: SantuarioNota; titulo: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-purple-200 bg-purple-50 p-4">
      <div className="flex items-center gap-2">
        <Landmark className="w-5 h-5 text-purple-700" aria-hidden="true" />
        <h3 className="m-0 text-sm font-bold text-gray-900">{titulo}</h3>
      </div>
      {nota.texto && <p className="m-0 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">{nota.texto}</p>}
      {nota.detalhe && (
        <p className="m-0 text-sm text-purple-800">
          <strong>O detalhe:</strong> {nota.detalhe}
        </p>
      )}
    </div>
  );
}

function PalacioCard({ nota, titulo }: { nota: PalacioNota; titulo: string }) {
  const portas = PORTAS.filter((p) => nota.portas[p.key]);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex items-center gap-2">
        <Castle className="w-5 h-5 text-indigo-700" aria-hidden="true" />
        <h3 className="m-0 text-sm font-bold text-gray-900">{titulo}</h3>
      </div>
      {nota.texto && <p className="m-0 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">{nota.texto}</p>}
      {portas.length > 0 && (
        <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
          {portas.map((p) => (
            <li key={p.key} className="flex items-start gap-2 text-sm text-gray-800">
              <DoorClosed className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>{p.nome}:</strong> {nota.portas[p.key]}
              </span>
            </li>
          ))}
        </ul>
      )}
      {nota.sala && (
        <p className="m-0 text-sm text-indigo-900">
          <strong>A primeira sala de guardar:</strong> {nota.sala}
        </p>
      )}
    </div>
  );
}

const CONQUISTAS = [
  'Relaxar fundo, de olhos fechados, no convés do veleiro',
  'A chave do relaxamento, e depois a chave profunda',
  'O seu Santuário, o lugar seguro que só você conhece',
  'O seu Sábio, que agora mora no seu Palácio',
  'O seu Palácio Mental, com três portas e a primeira sala de guardar'
];

export default function SessaoDia() {
  const router = useRouter();
  const dia = Number(router.query.dia);
  const sessao = SESSOES.find((s) => s.dia === dia);
  const { jornada, update } = useJornada();
  const [step, setStep] = useState<Step>('aviso');
  const [ok, setOk] = useState(false);
  const [antes, setAntes] = useState<number | null>(null);
  const [depois, setDepois] = useState<number | null>(null);
  const [santTexto, setSantTexto] = useState('');
  const [santDetalhe, setSantDetalhe] = useState('');
  const [sabioTexto, setSabioTexto] = useState('');
  const [palTexto, setPalTexto] = useState('');
  const [palPortas, setPalPortas] = useState<PalacioNota['portas']>({ perdao: '', cofre: '', sabedoria: '' });
  const [palSala, setPalSala] = useState('');
  const [avisar, setAvisar] = useState<'idle' | 'saving' | 'ok' | 'erro'>('idle');
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
    const texto = santTexto.trim();
    const detalhe = santDetalhe.trim();
    const santuario = dia === DIA_SANTUARIO && (texto || detalhe) ? { santuario: { texto, detalhe, em: today() } } : {};
    const sabio = dia === DIA_SABIO && sabioTexto.trim() ? { sabio: { texto: sabioTexto.trim(), em: today() } } : {};
    const portas = { perdao: palPortas.perdao.trim(), cofre: palPortas.cofre.trim(), sabedoria: palPortas.sabedoria.trim() };
    const temPalacio = palTexto.trim() || palSala.trim() || portas.perdao || portas.cofre || portas.sabedoria;
    const palacio = dia === DIA_PALACIO && temPalacio ? { palacio: { texto: palTexto.trim(), portas, sala: palSala.trim(), em: today() } } : {};
    const okSave = await update({ sessoes: logs.slice(-60), ...santuario, ...sabio, ...palacio });
    setSaving(false);
    if (!okSave) return setError('Não foi possível salvar agora. Tente de novo.');
    setStep('fim');
  };

  const pedirAviso = async () => {
    setAvisar('saving');
    setAvisar((await update({ listaApp: today() })) ? 'ok' : 'erro');
  };

  const feitas = (jornada?.sessoes ?? []).filter((l) => l.depois !== null);
  const media = (k: 'antes' | 'depois') => (feitas.length ? (feitas.reduce((a, l) => a + (l[k] ?? 0), 0) / feitas.length).toFixed(1).replace('.', ',') : null);

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
                      {dia >= 2 && dia <= 7 ? (
                        <>Hoje, de preferência, ouça <strong>sentado ou recostado</strong>, para chegar até o fim da sessão. </>
                      ) : (
                        <>Ouça sentado ou deitado. </>
                      )}
                      Escolha um lugar tranquilo e use fone de ouvido se puder. <strong>Nunca ouça dirigindo ou operando máquinas.</strong> Você
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
                {dia > DIA_SANTUARIO && jornada.santuario && <SantuarioCard nota={jornada.santuario} titulo="Lembre o seu Santuário antes de começar" />}
                {dia > DIA_SABIO && jornada.sabio?.texto && (
                  <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-amber-700" aria-hidden="true" />
                      <h3 className="m-0 text-sm font-bold text-gray-900">O seu Sábio espera você</h3>
                    </div>
                    <p className="m-0 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">{jornada.sabio.texto}</p>
                  </div>
                )}
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
                {dia === DIA_SANTUARIO && (
                  <div className="flex flex-col gap-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-purple-700" aria-hidden="true" />
                      <h3 className="m-0 text-base font-bold text-gray-900">Como é o seu Santuário?</h3>
                    </div>
                    <p className="m-0 text-sm text-gray-700">
                      Escreva agora, enquanto a imagem está fresca: o lugar, as cores, os sons, o que você sentiu na pele. Poucas palavras bastam. Nos
                      próximos dias, você vai ler isto antes de cada sessão, e o lugar fica cada vez mais nítido.
                    </p>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">O meu Santuário</span>
                      <textarea
                        value={santTexto}
                        onChange={(e) => setSantTexto(e.target.value.slice(0, 600))}
                        rows={4}
                        placeholder="Ex.: uma cabana de madeira na beira de um lago, com a luz da manhã entrando pela janela…"
                        className="rounded-lg border border-gray-300 bg-white p-3 text-[15px] text-gray-900 focus:border-purple-500 focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">O detalhe que você guardou</span>
                      <input
                        value={santDetalhe}
                        onChange={(e) => setSantDetalhe(e.target.value.slice(0, 120))}
                        placeholder="Uma cor, um som ou um cheiro"
                        className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:border-purple-500 focus:outline-none"
                      />
                    </label>
                  </div>
                )}
                {dia === DIA_SABIO && (
                  <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-amber-700" aria-hidden="true" />
                      <h3 className="m-0 text-base font-bold text-gray-900">Como era o seu Sábio?</h3>
                    </div>
                    <p className="m-0 text-sm text-gray-700">
                      O que você viu, ouviu ou sentiu: uma luz, um rosto, uma voz, uma sensação. Poucas palavras bastam. Amanhã, antes do encontro, você vai ler
                      isto.
                    </p>
                    <textarea
                      value={sabioTexto}
                      onChange={(e) => setSabioTexto(e.target.value.slice(0, 600))}
                      rows={4}
                      placeholder="Ex.: um senhor de barba branca, sentado à beira da água, com um olhar muito calmo…"
                      className="rounded-lg border border-gray-300 bg-white p-3 text-[15px] text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}
                {dia === DIA_PALACIO && (
                  <div className="flex flex-col gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                    <div className="flex items-center gap-2">
                      <Castle className="w-5 h-5 text-indigo-700" aria-hidden="true" />
                      <h3 className="m-0 text-base font-bold text-gray-900">Como é o seu Palácio?</h3>
                    </div>
                    <p className="m-0 text-sm text-gray-700">
                      Escreva agora, enquanto a imagem está fresca. Poucas palavras bastam: na próxima visita, você lê isto antes de entrar, e o Palácio
                      fica cada vez mais nítido.
                    </p>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">O grande salão: a cor, o som, o cheiro</span>
                      <textarea
                        value={palTexto}
                        onChange={(e) => setPalTexto(e.target.value.slice(0, 600))}
                        rows={4}
                        placeholder="Ex.: paredes de pedra clara, chão de madeira, cheiro de incenso, uma janela grande que dá para a baía…"
                        className="rounded-lg border border-gray-300 bg-white p-3 text-[15px] text-gray-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </label>
                    <fieldset className="m-0 p-0 border-0 flex flex-col gap-3">
                      <legend className="text-sm font-semibold text-gray-800 mb-1">Um detalhe de cada porta</legend>
                      {PORTAS.map((p) => (
                        <label key={p.key} className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-sm text-gray-800">
                            <DoorClosed className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                            {p.nome}
                          </span>
                          <input
                            value={palPortas[p.key]}
                            onChange={(e) => setPalPortas({ ...palPortas, [p.key]: e.target.value.slice(0, 120) })}
                            placeholder={p.dica}
                            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:border-indigo-500 focus:outline-none"
                          />
                        </label>
                      ))}
                    </fieldset>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">A sua primeira sala de guardar, e o que ficou nela</span>
                      <input
                        value={palSala}
                        onChange={(e) => setPalSala(e.target.value.slice(0, 200))}
                        placeholder="Ex.: uma biblioteca com estantes de madeira; guardei um verso de que gosto"
                        className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 text-[15px] text-gray-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </label>
                  </div>
                )}
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
                {dia === DIA_SANTUARIO && jornada.santuario && <SantuarioCard nota={jornada.santuario} titulo="O seu Santuário, guardado no Diário" />}
                {dia < 7 ? (
                  <p className="m-0 text-sm text-gray-700">A sessão do Dia {dia + 1} se abre amanhã. Até lá, siga a prática do seu rumo.</p>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 p-5 text-white">
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-100">Primeira Jornada completa</span>
                      <p className="m-0 text-lg font-bold leading-snug">Você chegou, navegante. Sete dias, sete sessões.</p>
                      {media('antes') && media('depois') && (
                        <p className="m-0 text-sm text-purple-100">
                          Nas suas sessões, você começou em média em <strong className="text-white">{media('antes')}</strong> e terminou em{' '}
                          <strong className="text-white">{media('depois')}</strong>.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="m-0 text-base font-bold text-gray-900">O que você leva desta Jornada</h3>
                      <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                        {CONQUISTAS.map((c) => (
                          <li key={c} className="flex items-start gap-2 text-sm text-gray-800">
                            <span className="text-emerald-600 font-bold" aria-hidden="true">✓</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {jornada.palacio && <PalacioCard nota={jornada.palacio} titulo="O seu Palácio, guardado no Diário" />}
                    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
                      <h3 className="m-0 text-base font-bold text-gray-900">Voltar ao Palácio</h3>
                      <p className="m-0 text-sm text-gray-700">
                        O Palácio cresce a cada visita. A <strong>Visita ao Palácio</strong>, um áudio de uns 10 minutos para voltar sempre que quiser, chega aqui
                        em breve. Até lá, você pode ouvir de novo a sessão de hoje.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-700" aria-hidden="true" />
                        <h3 className="m-0 text-base font-bold text-gray-900">O app NeoSapiens está a caminho</h3>
                      </div>
                      <p className="m-0 text-sm text-gray-700">Com as próximas portas, as visitas guiadas e o seu Diário sempre à mão. Quer ser avisado(a) quando ele chegar?</p>
                      {jornada.listaApp || avisar === 'ok' ? (
                        <p className="m-0 text-sm font-semibold text-emerald-700">✓ Combinado. Você está na lista e vai ser avisado(a) pelo e-mail da sua conta.</p>
                      ) : (
                        <button
                          type="button"
                          disabled={avisar === 'saving'}
                          onClick={pedirAviso}
                          className="min-h-[44px] w-fit px-5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50"
                        >
                          {avisar === 'saving' ? 'Salvando…' : 'Quero ser avisado(a)'}
                        </button>
                      )}
                      {avisar === 'erro' && <p className="m-0 text-sm text-rose-700">Não foi possível salvar agora. Tente de novo.</p>}
                    </div>
                  </div>
                )}
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
