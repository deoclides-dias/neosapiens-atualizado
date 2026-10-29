// src/components/psych/MiniIpipQuestionnaire.tsx
// Uma frase por tela, cinco respostas, avanço automático.
// Guarda um rascunho no navegador para continuar depois e, no fim,
// confere a qualidade das respostas antes de salvar.

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AlertTriangle, RotateCcw } from 'lucide-react';
import { ITEMS, SCALE, Answers, Timings, buildResult, checkQuality, PsychologicalResult, QualityReport } from '../../lib/psych/miniIpip';

interface Props {
  draftKey: string;
  onComplete: (result: PsychologicalResult) => void;
}

interface Draft {
  answers: Answers;
  timings: Timings;
  index: number;
}

const readDraft = (key: string): Draft | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
};
const writeDraft = (key: string, d: Draft | null) => {
  try {
    if (d) window.localStorage.setItem(key, JSON.stringify(d));
    else window.localStorage.removeItem(key);
  } catch {
    /* navegador sem armazenamento: segue sem rascunho */
  }
};

export default function MiniIpipQuestionnaire({ draftKey, onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [timings, setTimings] = useState<Timings>({});
  const [index, setIndex] = useState(0);
  const [review, setReview] = useState<QualityReport | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const shownAt = useRef<number>(0);
  const advancing = useRef(false);

  useEffect(() => {
    const d = readDraft(draftKey);
    if (d && Object.keys(d.answers).length > 0) setHasDraft(true);
  }, [draftKey]);

  useEffect(() => {
    shownAt.current = Date.now();
    advancing.current = false;
  }, [index, started]);

  const start = (resume: boolean) => {
    const d = resume ? readDraft(draftKey) : null;
    setAnswers(d?.answers ?? {});
    setTimings(d?.timings ?? {});
    setIndex(d ? Math.min(d.index, ITEMS.length - 1) : 0);
    if (!resume) writeDraft(draftKey, null);
    setReview(null);
    setStarted(true);
  };

  const finish = (a: Answers, t: Timings) => {
    const quality = checkQuality(a, t);
    if (quality.status === 'ok') {
      writeDraft(draftKey, null);
      onComplete(buildResult(a, t));
    } else {
      setReview(quality);
    }
  };

  const answer = (value: number) => {
    if (advancing.current) return;
    advancing.current = true;
    const item = ITEMS[index];
    const elapsed = Date.now() - shownAt.current;
    const a = { ...answers, [item.id]: value };
    // Guarda só o tempo da primeira resposta (voltar e mudar não conta como leitura)
    const t = timings[item.id] ? timings : { ...timings, [item.id]: elapsed };
    setAnswers(a);
    setTimings(t);

    const next = index + 1;
    writeDraft(draftKey, { answers: a, timings: t, index: Math.min(next, ITEMS.length - 1) });
    window.setTimeout(() => {
      if (next >= ITEMS.length) finish(a, t);
      else setIndex(next);
    }, 220);
  };

  // ---------- Tela inicial ----------
  if (!started) {
    return (
      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Como você é hoje</h2>
        <p className="m-0 text-[15px] leading-relaxed text-gray-700">
          São <strong>20 frases curtas</strong> (e 2 de atenção), cerca de <strong>4 minutos</strong>.
          Para cada uma, diga o quanto ela tem a ver com você <strong>como você é hoje, na maioria das situações</strong>,
          e não como gostaria de ser. Não há respostas certas. A primeira impressão costuma ser a mais fiel.
        </p>
        <p className="m-0 text-sm text-gray-600">
          Se precisar parar, suas respostas ficam guardadas neste navegador e você continua de onde parou.
        </p>
        <div className="flex flex-wrap gap-3">
          {hasDraft && (
            <button type="button" onClick={() => start(true)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700">
              Continuar de onde parei
            </button>
          )}
          <button
            type="button"
            onClick={() => start(false)}
            className={`min-h-[48px] px-6 rounded-lg font-semibold ${hasDraft ? 'border border-purple-300 text-purple-800 hover:bg-purple-50' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            {hasDraft ? 'Começar do zero' : 'Começar'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Revisão de qualidade ----------
  if (review) {
    const invalid = review.status === 'invalido';
    return (
      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-xl font-bold text-gray-900">
              {invalid ? 'Suas respostas parecem apressadas' : 'Uma das verificações chamou atenção'}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-gray-700">
              Antes de mostrar o resultado, conferimos se as respostas refletem leitura atenta.
              {invalid
                ? ' Desta vez, o resultado provavelmente não representaria você. Vale refazer com calma: são só 4 minutos.'
                : ' Pode ser só o seu jeito de responder, mas, se você acelerou em algum trecho, refazer deixa o resultado mais fiel.'}
            </p>
          </div>
        </div>
        <ul className="m-0 p-0 list-none flex flex-col gap-2">
          {review.checks.map((c) => (
            <li key={c.id} className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${c.ok ? 'border-gray-200 text-gray-700' : 'border-amber-300 bg-amber-50 text-amber-900'}`}>
              <span className="font-bold w-5 shrink-0" aria-hidden="true">{c.ok ? '✓' : '!'}</span>
              <span><strong>{c.label}:</strong> {c.detail}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => start(false)} className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700">
            <RotateCcw className="w-4 h-4" /> Refazer com calma
          </button>
          <button
            type="button"
            onClick={() => {
              writeDraft(draftKey, null);
              onComplete(buildResult(answers, timings));
            }}
            className="min-h-[48px] px-6 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Salvar assim mesmo
          </button>
        </div>
      </div>
    );
  }

  // ---------- Pergunta ----------
  const item = ITEMS[index];
  const current = answers[item.id];
  const pct = Math.round((index / ITEMS.length) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>Frase {index + 1} de {ITEMS.length}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-2 rounded-full bg-purple-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="m-0 text-xs uppercase tracking-wider font-semibold text-purple-700">Como você é hoje</p>
      <h2 key={item.id} className="m-0 text-2xl sm:text-[28px] leading-snug font-semibold text-gray-900 min-h-[72px]">
        {item.text}
      </h2>

      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Quanto esta frase tem a ver com você">
        {SCALE.map((s) => {
          const selected = current === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => answer(s.value)}
              className={`flex items-center gap-3 min-h-[52px] px-4 rounded-xl border text-left font-medium transition-colors ${
                selected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-800 [@media(hover:hover)]:hover:border-purple-300 [@media(hover:hover)]:hover:bg-purple-50'
              }`}
            >
              <span className={`w-7 h-7 rounded-full grid place-items-center text-sm font-bold shrink-0 ${selected ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                {s.value}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        {current !== undefined && index < ITEMS.length - 1 && (
          <button type="button" onClick={() => setIndex((i) => i + 1)} className="min-h-[44px] px-3 rounded-lg text-sm font-semibold text-purple-700 hover:text-purple-900">
            Avançar
          </button>
        )}
      </div>
    </div>
  );
}
