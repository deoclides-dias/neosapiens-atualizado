// src/components/mind/MindFlow.tsx
// Fluxo do módulo Mente: lista de etapas, autoavaliação inicial e os testes.
// Cada etapa é salva ao terminar (dá para parar e continuar outro dia).

import { useState } from 'react';
import { Check } from 'lucide-react';
import { MIND_VERSION, MindData, NCS_ITEMS, NCS_SCALE, SELF_ITEMS, STEPS, StepId } from '../../lib/mind/mind';
import { CreativityTask, DigitSpanTask, ReactionTask, StroopTask, TrailsTask } from './tasks';

interface Props {
  initial: MindData | null;
  onSave: (data: MindData, complete: boolean) => Promise<boolean>;
  onFinished: () => void;
}

const empty = (): MindData => ({ versao: MIND_VERSION, autoavaliacao: {}, ncs: {}, contexto: {}, testes: {}, etapasConcluidas: [] });

const pill = (on: boolean) =>
  `min-h-[44px] px-2 rounded-xl border text-sm font-medium text-center leading-tight transition-colors ${
    on ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-800 [@media(hover:hover)]:hover:border-purple-300'
  }`;

const SLEEP_OPTIONS = [
  { v: 4.5, l: 'Menos de 5 h' },
  { v: 5.5, l: '5 a 6 h' },
  { v: 6.5, l: '6 a 7 h' },
  { v: 7.5, l: '7 a 8 h' },
  { v: 8.5, l: 'Mais de 8 h' }
];

function StartStep({ data, onDone }: { data: MindData; onDone: (d: MindData) => void }) {
  const [self, setSelf] = useState(data.autoavaliacao);
  const [ncs, setNcs] = useState(data.ncs);
  const [ctx, setCtx] = useState(data.contexto);
  const [missing, setMissing] = useState(false);
  const complete =
    SELF_ITEMS.every((s) => typeof self[s.id] === 'number') &&
    NCS_ITEMS.every((i) => typeof ncs[i.id] === 'number') &&
    typeof ctx.sonoHoras === 'number' &&
    typeof ctx.cafeinaHoje === 'boolean';

  return (
    <div className="flex flex-col gap-7 max-w-2xl mx-auto">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-2xl font-bold text-gray-900">Como você se vê</h2>
          <p className="m-0 text-[15px] text-gray-700">De 0 a 10, como você avalia hoje…</p>
        </div>
        {SELF_ITEMS.map((s) => {
          const v = self[s.id];
          return (
            <div key={s.id} className={`flex flex-col gap-1.5 ${missing && typeof v !== 'number' ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : ''}`}>
              <p className="m-0 text-[16px] font-semibold text-gray-900">{s.text}</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={typeof v === 'number' ? v : 5}
                  onChange={(e) => setSelf({ ...self, [s.id]: Number(e.target.value) })}
                  onClick={(e) => setSelf({ ...self, [s.id]: Number((e.target as HTMLInputElement).value) })}
                  aria-label={s.text}
                  className={`flex-1 accent-purple-600 h-8 ${typeof v === 'number' ? '' : 'opacity-50'}`}
                />
                <span className={`w-8 text-right text-lg font-bold ${typeof v === 'number' ? 'text-purple-700' : 'text-gray-300'}`}>{typeof v === 'number' ? v : '–'}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-xl font-bold text-gray-900">Seu jeito de pensar</h2>
          <p className="m-0 text-[15px] text-gray-700">Quanto cada frase tem a ver com você?</p>
        </div>
        {NCS_ITEMS.map((i) => (
          <div key={i.id} className={`flex flex-col gap-2 ${missing && typeof ncs[i.id] !== 'number' ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : ''}`}>
            <p className="m-0 text-[16px] font-semibold text-gray-900">{i.text}</p>
            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-5">
              {NCS_SCALE.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={ncs[i.id] === o.value}
                  onClick={() => setNcs({ ...ncs, [i.id]: o.value })}
                  className={`${pill(ncs[i.id] === o.value)} !text-left sm:!text-center px-3 sm:text-xs`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-xl font-bold text-gray-900">Para entender os testes de hoje</h2>
        <div className={`flex flex-col gap-2 ${missing && typeof ctx.sonoHoras !== 'number' ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : ''}`}>
          <p className="m-0 text-[16px] font-semibold text-gray-900">Quanto você dormiu na última noite?</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {SLEEP_OPTIONS.map((o) => (
              <button key={o.v} type="button" onClick={() => setCtx({ ...ctx, sonoHoras: o.v })} className={pill(ctx.sonoHoras === o.v)}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <div className={`flex flex-col gap-2 ${missing && typeof ctx.cafeinaHoje !== 'boolean' ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : ''}`}>
          <p className="m-0 text-[16px] font-semibold text-gray-900">Tomou café ou outra bebida com cafeína nas últimas 3 horas?</p>
          <div className="grid grid-cols-2 gap-1.5 max-w-xs">
            {[
              { v: true, l: 'Sim' },
              { v: false, l: 'Não' }
            ].map((o) => (
              <button key={o.l} type="button" onClick={() => setCtx({ ...ctx, cafeinaHoje: o.v })} className={pill(ctx.cafeinaHoje === o.v)}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => (complete ? onDone({ ...data, autoavaliacao: self, ncs, contexto: ctx }) : setMissing(true))}
        className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit"
      >
        Salvar e ir para os testes
      </button>
      {missing && !complete && <p className="m-0 -mt-4 text-sm font-semibold text-amber-700">Faltam respostas marcadas em amarelo.</p>}
    </div>
  );
}

export default function MindFlow({ initial, onSave, onFinished }: Props) {
  const [data, setData] = useState<MindData>(initial ?? empty());
  const [current, setCurrent] = useState<StepId | null>(null);
  const [saving, setSaving] = useState(false);

  const advance = async (d: MindData, step: StepId) => {
    const done = d.etapasConcluidas.includes(step) ? d.etapasConcluidas : [...d.etapasConcluidas, step];
    const next = STEPS.find((s) => !done.includes(s.id));
    const all = !next;
    const updated: MindData = { ...d, etapasConcluidas: done, ...(all ? { concluidoEm: new Date().toISOString() } : {}) };
    setSaving(true);
    const ok = await onSave(updated, all);
    setSaving(false);
    if (!ok) return;
    setData(updated);
    if (all) onFinished();
    else setCurrent(next!.id);
  };

  const withTest = <K extends keyof MindData['testes']>(key: K, step: StepId) => ({
    onDone: (r: MindData['testes'][K]) => advance({ ...data, testes: { ...data.testes, [key]: r } }, step),
    onSkip: () => advance({ ...data, testes: { ...data.testes, [key]: undefined } }, step)
  });

  if (saving)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Salvando...</p>
        </div>
      </div>
    );

  if (current === 'inicio') return <StartStep data={data} onDone={(d) => advance(d, 'inicio')} />;
  if (current === 'reacao') return <ReactionTask key="r" {...withTest('reacao', 'reacao')} />;
  if (current === 'digitos') return <DigitSpanTask key="d" {...withTest('digitos', 'digitos')} />;
  if (current === 'stroop') return <StroopTask key="s" {...withTest('stroop', 'stroop')} />;
  if (current === 'trilhas') return <TrailsTask key="t" {...withTest('trilhas', 'trilhas')} />;
  if (current === 'criatividade') return <CreativityTask key="c" {...withTest('criatividade', 'criatividade')} />;

  const next = STEPS.find((s) => !data.etapasConcluidas.includes(s.id));
  const remaining = STEPS.filter((s) => !data.etapasConcluidas.includes(s.id)).reduce((t, s) => t + s.minutes, 0);
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Sua mente hoje</h2>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          Primeiro, como você se vê. Depois, cinco testes curtos de verdade: atenção, memória, foco, flexibilidade e criatividade. No fim, comparamos o que você
          acha com o que os testes mostram. {remaining > 0 && <>Faltam cerca de <strong>{remaining} minutos</strong>.</>}
        </p>
        <p className="m-0 text-sm text-gray-600">Faça num lugar calmo, sem interrupções. Cada etapa fica salva ao terminar.</p>
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {STEPS.map((s, i) => {
          const isDone = data.etapasConcluidas.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setCurrent(s.id)}
                className="w-full flex items-center gap-3 min-h-[56px] px-4 rounded-xl border border-gray-200 text-left hover:border-purple-300 hover:bg-purple-50"
              >
                <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold shrink-0 ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-900">{s.title}</span>
                <span className="text-xs text-gray-500">{isDone ? 'Feito · refazer' : `~${s.minutes} min`}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {next ? (
        <button type="button" onClick={() => setCurrent(next.id)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          {data.etapasConcluidas.length ? `Continuar: ${next.title}` : 'Começar'}
        </button>
      ) : (
        <button type="button" onClick={onFinished} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          Ver meu resultado
        </button>
      )}
    </div>
  );
}
