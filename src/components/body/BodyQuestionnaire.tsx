// src/components/body/BodyQuestionnaire.tsx
// Módulo Corpo em 7 blocos curtos. Cada bloco é salvo ao concluir,
// então a pessoa pode parar e continuar outro dia.

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, ChevronRight, RotateCcw } from 'lucide-react';
import { Answer, BLOCKS, Block, BodyAnswers, Question, isAnswered, visibleQuestions } from '../../lib/body/questions';
import { BODY_VERSION, BodyData, BodyQuality, checkBodyQuality } from '../../lib/body/scoring';

interface Props {
  initial: BodyData | null;
  defaults?: BodyAnswers;
  /** Salva o andamento; `complete` = última etapa */
  onSave: (data: BodyData, complete: boolean) => Promise<boolean>;
  onFinished: () => void;
}

const pill = (selected: boolean) =>
  `min-h-[44px] px-3.5 rounded-xl border text-left text-sm font-medium transition-colors ${
    selected
      ? 'border-purple-600 bg-purple-600 text-white'
      : 'border-gray-200 text-gray-800 [@media(hover:hover)]:hover:border-purple-300 [@media(hover:hover)]:hover:bg-purple-50'
  }`;

const ROW_COLS: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4', 5: 'grid-cols-2 sm:grid-cols-5' };

const timeInput = 'min-h-[44px] px-3 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none';

function Field({
  q,
  value,
  onChange,
  all,
  setOther
}: {
  q: Question;
  value: Answer | undefined;
  onChange: (v: Answer) => void;
  all: BodyAnswers;
  setOther: (id: string, v: Answer) => void;
}) {
  if (q.kind === 'timepair') {
    return (
      <div className="grid grid-cols-2 gap-3 max-w-sm">
        {q.ids.map((id, i) => (
          <label key={id} className="flex flex-col gap-1 text-sm text-gray-600">
            {q.labels[i]}
            <input type="time" value={typeof all[id] === 'string' ? (all[id] as string) : ''} onChange={(e) => setOther(id, e.target.value || null)} className={timeInput} />
          </label>
        ))}
      </div>
    );
  }

  if (q.kind === 'choice') {
    return (
      <div className={q.layout === 'row' ? `grid gap-2 ${ROW_COLS[q.options.length] ?? 'grid-cols-3 sm:grid-cols-5'}` : 'flex flex-col gap-2'} role="radiogroup" aria-label={q.text}>
        {q.options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`${pill(value === o.value)} ${q.layout === 'row' ? '!px-1.5 !text-center leading-tight sm:!text-[13px] break-words min-w-0' : ''}`}
          >
            {o.hint ? (
              <span className="flex flex-col py-1.5">
                <span className="font-semibold">{o.label}</span>
                <span className={value === o.value ? 'text-purple-100' : 'text-gray-600'}>{o.hint}</span>
              </span>
            ) : (
              o.label
            )}
          </button>
        ))}
      </div>
    );
  }

  if (q.kind === 'number' && q.unit === 'dias') {
    return (
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={q.text}>
        {Array.from({ length: 8 }, (_, d) => (
          <button key={d} type="button" role="radio" aria-checked={value === d} onClick={() => onChange(d)} className={`${pill(value === d)} w-12 text-center`}>
            {d}
          </button>
        ))}
      </div>
    );
  }

  if (q.kind === 'number') {
    return (
      <label className="inline-flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={q.min}
          max={q.max}
          step={q.step ?? 1}
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => {
            const v = e.target.value === '' ? null : Number(e.target.value.replace(',', '.'));
            onChange(v !== null && !Number.isNaN(v) && v >= q.min && v <= q.max ? v : v === null ? null : v);
          }}
          className="w-28 min-h-[44px] px-3 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
        />
        <span className="text-sm text-gray-600">{q.unit}</span>
      </label>
    );
  }

  if (q.kind === 'time') {
    return (
      <input
        type="time"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="min-h-[44px] px-3 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
      />
    );
  }

  if (q.kind === 'duration') {
    const total = typeof value === 'number' ? value : null;
    const h = total === null ? '' : Math.floor(total / 60);
    const m = total === null ? 0 : total % 60;
    const set = (hh: number, mm: number) => onChange(hh * 60 + mm);
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={20}
          aria-label="horas"
          value={h}
          onChange={(e) => (e.target.value === '' ? onChange(null) : set(Math.min(20, Math.max(0, Number(e.target.value))), m))}
          className="w-20 min-h-[44px] px-3 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
        />
        <span className="text-sm text-gray-600">h</span>
        <select
          aria-label="minutos"
          value={m}
          onChange={(e) => set(typeof h === 'number' ? h : 0, Number(e.target.value))}
          className="min-h-[44px] px-3 rounded-lg border border-gray-300 text-base bg-white focus:border-purple-500 outline-none"
        >
          {[0, 10, 15, 20, 30, 40, 45, 50].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600">min</span>
      </div>
    );
  }

  if (q.kind === 'multi') {
    const list = Array.isArray(value) ? value : [];
    const none = list.includes('nenhum');
    const toggle = (v: string) => {
      if (v === 'nenhum') return onChange(none ? [] : ['nenhum']);
      const base = list.filter((x) => x !== 'nenhum');
      onChange(base.includes(v) ? base.filter((x) => x !== v) : [...base, v]);
    };
    return (
      <div className="flex flex-wrap gap-2">
        {q.options.map((o) => {
          const on = list.includes(String(o.value));
          return (
            <button key={String(o.value)} type="button" aria-pressed={on} onClick={() => toggle(String(o.value))} className={pill(on)}>
              {on && <Check className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />}
              {o.label}
            </button>
          );
        })}
        <button type="button" aria-pressed={none} onClick={() => toggle('nenhum')} className={pill(none)}>
          {q.noneLabel}
        </button>
      </div>
    );
  }

  // slider 0–10
  const v = typeof value === 'number' ? value : null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={v ?? 5}
          onChange={(e) => onChange(Number(e.target.value))}
          onClick={(e) => onChange(Number((e.target as HTMLInputElement).value))}
          aria-label={q.text}
          className={`flex-1 accent-purple-600 h-8 ${v === null ? 'opacity-50' : ''}`}
        />
        <span className={`w-10 text-right text-lg font-bold ${v === null ? 'text-gray-300' : 'text-purple-700'}`}>{v ?? '–'}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 pr-[52px]">
        <span>0 · {q.low}</span>
        <span>{q.high} · 10</span>
      </div>
    </div>
  );
}

export default function BodyQuestionnaire({ initial, defaults, onSave, onFinished }: Props) {
  const [answers, setAnswers] = useState<BodyAnswers>({ ...(defaults ?? {}), ...(initial?.respostas ?? {}) });
  const [done, setDone] = useState<string[]>(initial?.blocosConcluidos ?? []);
  const [times, setTimes] = useState<Record<string, number>>(initial?.tempos ?? {});
  const [current, setCurrent] = useState<Block | null>(null);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState<BodyQuality | null>(null);
  const [showMissing, setShowMissing] = useState(false);
  const startedAt = useRef(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (current) {
      startedAt.current = Date.now();
      setShowMissing(false);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [current]);

  const data = (a: BodyAnswers, d: string[], t: Record<string, number>, extra: Partial<BodyData> = {}): BodyData => ({
    versao: BODY_VERSION,
    respostas: a,
    blocosConcluidos: d,
    tempos: t,
    ...extra
  });

  const finish = async (a: BodyAnswers, d: string[], t: Record<string, number>, force = false) => {
    const quality = checkBodyQuality(a, t);
    if (!quality.ok && !force) {
      setReview(quality);
      return;
    }
    setSaving(true);
    const ok = await onSave(data(a, d, t, { qualidade: quality, concluidoEm: new Date().toISOString() }), true);
    setSaving(false);
    if (ok) onFinished();
  };

  const completeBlock = async () => {
    if (!current) return;
    const missing = visibleQuestions(current, answers).filter((q) => !isAnswered(q, answers[q.id], answers));
    if (missing.length) {
      setShowMissing(true);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const t = { ...times, [current.id]: Date.now() - startedAt.current };
    const d = done.includes(current.id) ? done : [...done, current.id];
    setTimes(t);
    setDone(d);
    const next = BLOCKS.find((b) => !d.includes(b.id));
    if (!next) {
      setCurrent(null);
      await finish(answers, d, t);
      return;
    }
    setSaving(true);
    const ok = await onSave(data(answers, d, t), false);
    setSaving(false);
    if (ok) setCurrent(next);
  };

  if (saving) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Salvando...</p>
        </div>
      </div>
    );
  }

  // ---------- Revisão de qualidade ----------
  if (review) {
    return (
      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-xl font-bold text-gray-900">A parte de alimentação parece apressada</h2>
            <ul className="m-0 pl-5 list-disc text-sm text-gray-700">
              {review.issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setReview(null);
              setDone(done.filter((x) => x !== 'alimentacao'));
              setCurrent(BLOCKS.find((b) => b.id === 'alimentacao')!);
            }}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            <RotateCcw className="w-4 h-4" /> Revisar a alimentação
          </button>
          <button
            type="button"
            onClick={() => {
              setReview(null);
              finish(answers, done, times, true);
            }}
            className="min-h-[48px] px-6 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Salvar assim mesmo
          </button>
        </div>
      </div>
    );
  }

  // ---------- Um bloco ----------
  if (current) {
    const qs = visibleQuestions(current, answers);
    const index = BLOCKS.findIndex((b) => b.id === current.id);
    return (
      <div ref={topRef} className="flex flex-col gap-6 max-w-2xl mx-auto scroll-mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>
              Bloco {index + 1} de {BLOCKS.length}
            </span>
            <span>~{current.minutes} min</span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {BLOCKS.map((b, i) => (
              <div key={b.id} className={`h-1.5 flex-1 rounded-full ${done.includes(b.id) || i < index ? 'bg-purple-600' : i === index ? 'bg-purple-300' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-2xl font-bold text-gray-900">{current.title}</h2>
          {current.intro && <p className="m-0 text-[15px] text-gray-700">{current.intro}</p>}
        </div>

        <ol className="m-0 p-0 list-none flex flex-col gap-6">
          {qs.map((q) => {
            const missing = showMissing && !isAnswered(q, answers[q.id], answers);
            return (
              <li key={q.id} id={`q-${q.id}`} className={`flex flex-col gap-2.5 scroll-mt-24 ${missing ? 'rounded-xl ring-2 ring-amber-400 ring-offset-4' : ''}`}>
                <p className="m-0 text-[17px] leading-snug font-semibold text-gray-900">{q.text}</p>
                {q.help && <p className="m-0 text-sm leading-relaxed text-gray-600">{q.help}</p>}
                <Field
                  q={q}
                  value={answers[q.id]}
                  all={answers}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  setOther={(id, v) => setAnswers((prev) => ({ ...prev, [id]: v }))}
                />
                {missing && <p className="m-0 text-sm font-semibold text-amber-700">Falta responder esta.</p>}
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={() => setCurrent(null)} className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Blocos
          </button>
          <button type="button" onClick={completeBlock} className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 whitespace-nowrap">
            {BLOCKS.filter((b) => !done.includes(b.id) && b.id !== current.id).length ? 'Salvar e continuar' : 'Concluir'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---------- Visão dos blocos ----------
  const next = BLOCKS.find((b) => !done.includes(b.id));
  const remaining = BLOCKS.filter((b) => !done.includes(b.id)).reduce((s, b) => s + b.minutes, 0);
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Seu corpo hoje</h2>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          São 7 blocos curtos sobre medidas, sono, movimento, alimentação, intestino, hábitos e bem-estar. Cada bloco fica salvo ao terminar: você pode parar e continuar
          outro dia. {remaining > 0 && <>Faltam cerca de <strong>{remaining} minutos</strong>.</>}
        </p>
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {BLOCKS.map((b, i) => {
          const isDone = done.includes(b.id);
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => setCurrent(b)}
                className="w-full flex items-center gap-3 min-h-[56px] px-4 rounded-xl border border-gray-200 text-left hover:border-purple-300 hover:bg-purple-50"
              >
                <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold shrink-0 ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-900">{b.title}</span>
                <span className="text-xs text-gray-500">{isDone ? 'Feito · rever' : `~${b.minutes} min`}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {next ? (
        <button type="button" onClick={() => setCurrent(next)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          {done.length ? `Continuar: ${next.title}` : 'Começar'}
        </button>
      ) : (
        <button type="button" onClick={() => finish(answers, done, times)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
          Ver meu resultado
        </button>
      )}
    </div>
  );
}
