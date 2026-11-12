// src/components/purpose/PurposeFlow.tsx
// Fluxo do módulo Propósito: 5 blocos curtos, salvos um a um.

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import {
  AGREE5,
  AGREE7,
  Answers,
  FLOURISH_ITEMS,
  LIFE_AREAS,
  MLQ_ITEMS,
  PURPOSE_STEPS,
  PURPOSE_VERSION,
  PurposeData,
  PurposeStep,
  SHEN_ITEMS,
  TRUE_SCALE,
  VALUE_ITEMS,
  VALUE_SCALE
} from '../../lib/purpose/purpose';

interface Props {
  initial: PurposeData | null;
  onSave: (data: PurposeData, complete: boolean) => Promise<boolean>;
  onFinished: () => void;
}

const pill = (on: boolean) =>
  `min-h-[44px] rounded-xl border text-sm font-semibold text-center transition-colors ${
    on ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-800 [@media(hover:hover)]:hover:border-purple-300'
  }`;

/** Escala numerada de 1 a N com os rótulos das pontas e o rótulo escolhido */
function NumberScale({ value, onChange, scale }: { value?: number; onChange: (v: number) => void; scale: { value: number; label: string }[] }) {
  const chosen = scale.find((s) => s.value === value);
  return (
    <div className="flex flex-col gap-1">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${scale.length}, minmax(0, 1fr))` }} role="radiogroup">
        {scale.map((s) => (
          <button key={s.value} type="button" role="radio" aria-checked={value === s.value} aria-label={s.label || String(s.value)} onClick={() => onChange(s.value)} className={pill(value === s.value)}>
            {s.value}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-gray-500 gap-2">
        <span>{scale[0].label}</span>
        <span className="font-semibold text-purple-700 text-center">{chosen?.label && chosen.value !== scale[0].value && chosen.value !== scale[scale.length - 1].value ? chosen.label : ''}</span>
        <span className="text-right">{scale[scale.length - 1].label}</span>
      </div>
    </div>
  );
}

function Slider10({ value, onChange, label, low, high }: { value?: number; onChange: (v: number) => void; label: string; low: string; high: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-xs font-semibold text-gray-600">{label}</span>
        <input
          type="range"
          min={1}
          max={10}
          value={value ?? 5}
          onChange={(e) => onChange(Number(e.target.value))}
          onClick={(e) => onChange(Number((e.target as HTMLInputElement).value))}
          aria-label={label}
          className={`flex-1 accent-purple-600 h-7 ${value === undefined ? 'opacity-50' : ''}`}
        />
        <span className={`w-7 text-right font-bold ${value === undefined ? 'text-gray-300' : 'text-purple-700'}`}>{value ?? '–'}</span>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 pl-[108px] pr-10">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

const required: Record<PurposeStep, string[]> = {
  valores: VALUE_ITEMS.map((i) => i.id),
  sentido: MLQ_ITEMS.map((i) => i.id),
  vida: LIFE_AREAS.flatMap((x) => [`imp_${x.id}`, `coe_${x.id}`]),
  florescer: [...FLOURISH_ITEMS.map((i) => i.id), ...SHEN_ITEMS.map((i) => i.id)],
  meta: []
};

export default function PurposeFlow({ initial, onSave, onFinished }: Props) {
  const [a, setA] = useState<Answers>(initial?.respostas ?? {});
  const [done, setDone] = useState<string[]>(initial?.etapasConcluidas ?? []);
  const [current, setCurrent] = useState<PurposeStep | null>(null);
  const [saving, setSaving] = useState(false);
  const [missing, setMissing] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const set = (id: string, v: number | string) => setA((p) => ({ ...p, [id]: v }));
  const isMissing = (id: string) => missing && typeof a[id] !== 'number';
  const ring = (id: string) => (isMissing(id) ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : '');

  useEffect(() => {
    setMissing(false);
    if (current) top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [current]);

  const complete = async () => {
    if (!current) return;
    const lacking = required[current].filter((id) => typeof a[id] !== 'number');
    if (lacking.length) {
      setMissing(true);
      document.getElementById(`q-${lacking[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const d = done.includes(current) ? done : [...done, current];
    const next = PURPOSE_STEPS.find((s) => !d.includes(s.id));
    const data: PurposeData = { versao: PURPOSE_VERSION, respostas: a, etapasConcluidas: d, ...(next ? {} : { concluidoEm: new Date().toISOString() }) };
    setSaving(true);
    const ok = await onSave(data, !next);
    setSaving(false);
    if (!ok) return;
    setDone(d);
    if (next) setCurrent(next.id);
    else onFinished();
  };

  if (saving)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Salvando...</p>
        </div>
      </div>
    );

  if (current) {
    const index = PURPOSE_STEPS.findIndex((s) => s.id === current);
    const step = PURPOSE_STEPS[index];
    return (
      <div ref={top} className="flex flex-col gap-6 max-w-2xl mx-auto scroll-mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>
              Bloco {index + 1} de {PURPOSE_STEPS.length}
            </span>
            <span>~{step.minutes} min</span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {PURPOSE_STEPS.map((s, i) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full ${done.includes(s.id) || i < index ? 'bg-purple-600' : i === index ? 'bg-purple-300' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
        <h2 className="m-0 text-2xl font-bold text-gray-900">{step.title}</h2>

        {current === 'valores' && (
          <>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">Quanto cada um destes é importante como princípio que guia a sua vida? Tente usar a escala toda.</p>
            {VALUE_ITEMS.map((i) => (
              <div key={i.id} id={`q-${i.id}`} className={`flex flex-col gap-2 scroll-mt-24 ${ring(i.id)}`}>
                <p className="m-0 text-[16px] text-gray-900">
                  <strong>{i.name}.</strong> {i.text}
                </p>
                <NumberScale value={a[i.id] as number} onChange={(v) => set(i.id, v)} scale={VALUE_SCALE} />
              </div>
            ))}
          </>
        )}

        {current === 'sentido' && (
          <>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">Pense no que faz a sua vida parecer importante para você. Responda o mais sinceramente possível.</p>
            {MLQ_ITEMS.map((i) => (
              <div key={i.id} id={`q-${i.id}`} className={`flex flex-col gap-2 scroll-mt-24 ${ring(i.id)}`}>
                <p className="m-0 text-[16px] font-semibold text-gray-900">{i.text}</p>
                <NumberScale value={a[i.id] as number} onChange={(v) => set(i.id, v)} scale={TRUE_SCALE} />
              </div>
            ))}
          </>
        )}

        {current === 'vida' && (
          <>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">
              Para cada área da vida, diga <strong>quanto ela é importante</strong> para você e <strong>quanto você viveu de acordo</strong> com isso nas últimas duas semanas. Não
              existe resposta certa: cada pessoa valoriza áreas diferentes.
            </p>
            {LIFE_AREAS.map((x) => (
              <div key={x.id} id={`q-imp_${x.id}`} className={`flex flex-col gap-2 rounded-xl border border-gray-100 p-3 scroll-mt-24 ${isMissing(`imp_${x.id}`) || isMissing(`coe_${x.id}`) ? 'ring-2 ring-amber-400' : ''}`}>
                <p className="m-0 text-[16px] font-semibold text-gray-900">
                  {x.label} {x.hint && <span className="font-normal text-sm text-gray-500">· {x.hint}</span>}
                </p>
                <Slider10 label="Importância" low="nada" high="muito" value={a[`imp_${x.id}`] as number} onChange={(v) => set(`imp_${x.id}`, v)} />
                <Slider10 label="Vivi de acordo" low="nada" high="totalmente" value={a[`coe_${x.id}`] as number} onChange={(v) => set(`coe_${x.id}`, v)} />
              </div>
            ))}
          </>
        )}

        {current === 'florescer' && (
          <>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">Quanto você concorda com cada frase?</p>
            {FLOURISH_ITEMS.map((i) => (
              <div key={i.id} id={`q-${i.id}`} className={`flex flex-col gap-2 scroll-mt-24 ${ring(i.id)}`}>
                <p className="m-0 text-[16px] font-semibold text-gray-900">{i.text}</p>
                <NumberScale value={a[i.id] as number} onChange={(v) => set(i.id, v)} scale={AGREE7} />
              </div>
            ))}
            <h3 className="m-0 mt-2 text-lg font-bold text-gray-900">Mais cinco frases</h3>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">Quanto cada uma descreve você hoje?</p>
            {SHEN_ITEMS.map((i) => (
              <div key={i.id} id={`q-${i.id}`} className={`flex flex-col gap-2 scroll-mt-24 ${ring(i.id)}`}>
                <p className="m-0 text-[16px] font-semibold text-gray-900">{i.text}</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {AGREE5.map((o) => (
                    <button key={o.value} type="button" aria-pressed={a[i.id] === o.value} onClick={() => set(i.id, o.value)} className={`${pill(a[i.id] === o.value)} text-xs leading-tight px-1`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {current === 'meta' && (
          <>
            <p className="m-0 -mt-3 text-[15px] text-gray-700">Sem nota e sem certo ou errado. Escreva com calma: estas respostas vão alimentar a sua Primeira Jornada.</p>
            {[
              { id: 'meta_dia', q: 'Imagine que, daqui a 5 anos, tudo deu certo. Como é um dia seu? Onde você está, com quem, fazendo o quê?', ph: 'Acordo e…' },
              { id: 'meta_legado', q: 'Em uma frase: o que você quer deixar no mundo?', ph: 'Quero…' }
            ].map((t) => (
              <label key={t.id} className="flex flex-col gap-2">
                <span className="text-[16px] font-semibold text-gray-900">{t.q}</span>
                <textarea
                  value={(a[t.id] as string) ?? ''}
                  onChange={(e) => set(t.id, e.target.value.slice(0, 1500))}
                  placeholder={t.ph}
                  rows={t.id === 'meta_dia' ? 6 : 3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-y"
                />
              </label>
            ))}
          </>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={() => setCurrent(null)} className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Blocos
          </button>
          <button type="button" onClick={complete} className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 whitespace-nowrap">
            {PURPOSE_STEPS.some((s) => !done.includes(s.id) && s.id !== current) ? 'Salvar e continuar' : 'Concluir'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {missing && <p className="m-0 -mt-4 text-sm font-semibold text-amber-700 text-right">Faltam respostas marcadas em amarelo.</p>}
      </div>
    );
  }

  const next = PURPOSE_STEPS.find((s) => !done.includes(s.id));
  const remaining = PURPOSE_STEPS.filter((s) => !done.includes(s.id)).reduce((t, s) => t + s.minutes, 0);
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Seu propósito hoje</h2>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          Cinco blocos sobre o que é importante para você, o sentido que você enxerga na vida, o quanto você vive de acordo com o que valoriza e para onde quer ir.
          {remaining > 0 && (
            <>
              {' '}
              Faltam cerca de <strong>{remaining} minutos</strong>.
            </>
          )}
        </p>
        <p className="m-0 text-sm text-gray-600">Cada bloco fica salvo ao terminar: você pode parar e continuar outro dia.</p>
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {PURPOSE_STEPS.map((s, i) => {
          const isDone = done.includes(s.id);
          return (
            <li key={s.id}>
              <button type="button" onClick={() => setCurrent(s.id)} className="w-full flex items-center gap-3 min-h-[56px] px-4 rounded-xl border border-gray-200 text-left hover:border-purple-300 hover:bg-purple-50">
                <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold shrink-0 ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-900">{s.title}</span>
                <span className="text-xs text-gray-500">{isDone ? 'Feito · rever' : `~${s.minutes} min`}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {next ? (
        <button type="button" onClick={() => setCurrent(next.id)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          {done.length ? `Continuar: ${next.title}` : 'Começar'}
        </button>
      ) : (
        <button type="button" onClick={onFinished} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          Ver meu resultado
        </button>
      )}
    </div>
  );
}
