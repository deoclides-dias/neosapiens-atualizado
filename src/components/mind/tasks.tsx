// src/components/mind/tasks.tsx
// As cinco tarefas do módulo Mente, feitas no navegador:
// tempo de reação, sequência de números, cores e palavras (Stroop),
// trilhas e usos criativos. Cada uma tem instrução, execução e fim.

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import { CreativityResult, DigitResult, LAPSE_MS, ReactionResult, StroopResult, StroopTrial, TrailsResult, uniqueIdeas } from '../../lib/mind/mind';

interface TaskProps<T> {
  onDone: (r: T) => void;
  onSkip: () => void;
}

const btn = 'min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700';
const btnGhost = 'min-h-[44px] px-4 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900';

function Intro({ title, children, onStart, onSkip, startLabel = 'Começar' }: { title: string; children: ReactNode; onStart: () => void; onSkip: () => void; startLabel?: string }) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <h2 className="m-0 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="flex flex-col gap-2 text-[15px] leading-relaxed text-gray-700">{children}</div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onStart} className={btn}>
          {startLabel}
        </button>
        <button type="button" onClick={onSkip} className={btnGhost}>
          Pular este teste
        </button>
      </div>
    </div>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// =====================================================================
// 1. Tempo de reação (versão curta do PVT, 60 s)
// =====================================================================

const PVT_SECONDS = 60;

export function ReactionTask({ onDone, onSkip }: TaskProps<ReactionResult>) {
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [state, setState] = useState<'wait' | 'go' | 'early' | 'shown'>('wait');
  const [shownMs, setShownMs] = useState(0);
  const [counter, setCounter] = useState(0);
  const [left, setLeft] = useState(PVT_SECONDS);
  const rts = useRef<number[]>([]);
  const falseStarts = useRef(0);
  const onset = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const raf = useRef<number>();
  const endAt = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const device: ReactionResult['device'] = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches ? 'toque' : 'mouse';

  const finish = useCallback(() => {
    clearTimeout(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    setPhase('done');
  }, []);

  const schedule = useCallback(() => {
    if (performance.now() >= endAt.current) return finish();
    setState('wait');
    timer.current = setTimeout(() => {
      setState('go');
      raf.current = requestAnimationFrame(() => {
        onset.current = performance.now();
        const tick = () => {
          setCounter(Math.round(performance.now() - onset.current));
          raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      });
    }, rand(1500, 4500));
  }, [finish]);

  useEffect(() => {
    if (phase !== 'run') return;
    endAt.current = performance.now() + PVT_SECONDS * 1000;
    const iv = setInterval(() => setLeft(Math.max(0, Math.ceil((endAt.current - performance.now()) / 1000))), 250);
    schedule();
    return () => {
      clearInterval(iv);
      clearTimeout(timer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase, schedule]);

  const press = () => {
    const s = stateRef.current;
    if (s === 'wait') {
      falseStarts.current++;
      clearTimeout(timer.current);
      setState('early');
      setTimeout(schedule, 900);
    } else if (s === 'go' && onset.current) {
      const rt = performance.now() - onset.current;
      if (raf.current) cancelAnimationFrame(raf.current);
      onset.current = 0;
      // Abaixo de 100 ms ninguém reage de verdade: conta como antecipação (regra do PVT)
      if (rt < 100) {
        falseStarts.current++;
        setState('early');
        setTimeout(schedule, 900);
        return;
      }
      rts.current.push(Math.round(rt));
      setShownMs(Math.round(rt));
      setState('shown');
      setTimeout(schedule, 700);
    }
  };

  if (phase === 'intro')
    return (
      <Intro title="Tempo de reação" onStart={() => setPhase('run')} onSkip={onSkip}>
        <p className="m-0">
          Durante <strong>1 minuto</strong>, um círculo vai aparecer de surpresa na área cinza. Toque nele (ou clique) <strong>o mais rápido que puder</strong>.
        </p>
        <p className="m-0">Não toque antes do círculo aparecer. Faça em um lugar calmo, sem interrupções.</p>
      </Intro>
    );

  if (phase === 'done') {
    const n = rts.current.length;
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Pronto!</h2>
        <p className="m-0 text-[15px] text-gray-700">
          {n} respostas registradas{falseStarts.current ? ` e ${falseStarts.current} antecipação(ões)` : ''}. O resultado aparece no final.
        </p>
        <button type="button" className={`${btn} w-fit`} onClick={() => onDone({ rts: rts.current, falseStarts: falseStarts.current, device })}>
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto select-none">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>Toque quando o círculo aparecer</span>
        <span>{left} s</span>
      </div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Área do teste de reação"
        onPointerDown={(e) => {
          e.preventDefault();
          press();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            press();
          }
        }}
        className="relative h-72 sm:h-80 rounded-2xl bg-gray-100 grid place-items-center cursor-pointer touch-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        {state === 'go' && (
          <div className="w-32 h-32 rounded-full bg-purple-600 grid place-items-center text-white text-2xl font-bold tabular-nums">{counter}</div>
        )}
        {state === 'shown' && <div className="text-3xl font-bold text-gray-800 tabular-nums">{shownMs} ms</div>}
        {state === 'early' && <div className="text-xl font-bold text-amber-700">Cedo demais!</div>}
        {state === 'wait' && <div className="text-gray-400 text-sm">aguarde…</div>}
      </div>
      <p className="m-0 text-xs text-gray-500">No computador, também vale apertar a barra de espaço. Respostas de {LAPSE_MS} ms ou mais contam como lapso.</p>
    </div>
  );
}

// =====================================================================
// 2. Sequência de números (span de dígitos, ordem direta e inversa)
// =====================================================================

const makeSeq = (n: number) => {
  const out: number[] = [];
  while (out.length < n) {
    const d = Math.floor(Math.random() * 10);
    if (d !== out[out.length - 1]) out.push(d);
  }
  return out;
};

export function DigitSpanTask({ onDone, onSkip }: TaskProps<DigitResult>) {
  const [phase, setPhase] = useState<'intro' | 'introB' | 'show' | 'input' | 'feedback' | 'done'>('intro');
  const [mode, setMode] = useState<'direta' | 'inversa'>('direta');
  const [length, setLength] = useState(3);
  const [attempt, setAttempt] = useState(0); // 0 ou 1 no mesmo tamanho
  const [seq, setSeq] = useState<number[]>([]);
  const [shown, setShown] = useState<number | null>(null);
  const [typed, setTyped] = useState<number[]>([]);
  const [lastOk, setLastOk] = useState<boolean | null>(null);
  const trials = useRef<DigitResult['trials']>([]);
  const fails = useRef(0); // erros no tamanho atual
  const best = useRef({ direta: 0, inversa: 0 });

  const present = useCallback(async (n: number) => {
    const s = makeSeq(n);
    setSeq(s);
    setTyped([]);
    setPhase('show');
    await sleep(600);
    for (const d of s) {
      setShown(d);
      await sleep(900);
      setShown(null);
      await sleep(250);
    }
    setPhase('input');
  }, []);

  const startMode = (m: 'direta' | 'inversa') => {
    setMode(m);
    const start = m === 'direta' ? 3 : 2;
    setLength(start);
    setAttempt(0);
    fails.current = 0;
    present(start);
  };

  const submit = async () => {
    const target = mode === 'direta' ? seq : [...seq].reverse();
    const ok = typed.length === target.length && typed.every((d, i) => d === target[i]);
    trials.current.push({ mode, length, ok });
    if (ok) best.current[mode] = Math.max(best.current[mode], length);
    else fails.current++;
    setLastOk(ok);
    setPhase('feedback');
    await sleep(900);

    const max = mode === 'direta' ? 9 : 8;
    if (attempt === 0) {
      setAttempt(1);
      present(length);
      return;
    }
    // Fim das 2 tentativas neste tamanho
    if (fails.current >= 2 || length >= max) {
      if (mode === 'direta') {
        setPhase('introB');
      } else {
        setPhase('done');
      }
      return;
    }
    fails.current = 0;
    setAttempt(0);
    setLength(length + 1);
    present(length + 1);
  };

  if (phase === 'intro')
    return (
      <Intro title="Sequência de números" onStart={() => startMode('direta')} onSkip={onSkip}>
        <p className="m-0">Números vão aparecer um de cada vez. Quando terminar, digite a sequência <strong>na mesma ordem</strong>.</p>
        <p className="m-0">As sequências vão ficando maiores. Não anote nada: o teste mede a memória de trabalho.</p>
      </Intro>
    );

  if (phase === 'introB')
    return (
      <Intro title="Agora, de trás para frente" startLabel="Começar a ordem inversa" onStart={() => startMode('inversa')} onSkip={() => onDone({ forward: best.current.direta, backward: 0, trials: trials.current })}>
        <p className="m-0">
          Mesma ideia, mas agora digite a sequência <strong>de trás para frente</strong>. Se aparecer 3 · 8 · 1, digite 1 · 8 · 3.
        </p>
      </Intro>
    );

  if (phase === 'done')
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Pronto!</h2>
        <p className="m-0 text-[15px] text-gray-700">O resultado aparece no final.</p>
        <button type="button" className={`${btn} w-fit`} onClick={() => onDone({ forward: best.current.direta, backward: best.current.inversa, trials: trials.current })}>
          Continuar
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto select-none">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>{mode === 'direta' ? 'Ordem direta' : 'Ordem inversa'}</span>
        <span>{length} números</span>
      </div>
      <div className="h-40 rounded-2xl bg-gray-100 grid place-items-center">
        {phase === 'show' && <span className="text-7xl font-bold text-gray-900 tabular-nums">{shown ?? ''}</span>}
        {phase === 'input' && (
          <span className="text-3xl font-bold tracking-[0.3em] text-gray-900 tabular-nums">{typed.length ? typed.join('') : <span className="text-gray-300 text-base tracking-normal">digite…</span>}</span>
        )}
        {phase === 'feedback' && <span className={`text-2xl font-bold ${lastOk ? 'text-emerald-600' : 'text-rose-600'}`}>{lastOk ? 'Certo!' : 'Não foi dessa vez'}</span>}
      </div>
      <div className={`grid grid-cols-3 gap-2 ${phase === 'input' ? '' : 'opacity-30 pointer-events-none'}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} type="button" onClick={() => setTyped((t) => (t.length < 12 ? [...t, d] : t))} className="h-14 rounded-xl border border-gray-200 text-2xl font-semibold text-gray-900 active:bg-purple-100">
            {d}
          </button>
        ))}
        <button type="button" aria-label="Apagar" onClick={() => setTyped((t) => t.slice(0, -1))} className="h-14 rounded-xl border border-gray-200 grid place-items-center text-gray-600">
          <Delete className="w-6 h-6" />
        </button>
        <button type="button" onClick={() => setTyped((t) => (t.length < 12 ? [...t, 0] : t))} className="h-14 rounded-xl border border-gray-200 text-2xl font-semibold text-gray-900 active:bg-purple-100">
          0
        </button>
        <button type="button" onClick={submit} disabled={!typed.length} className="h-14 rounded-xl bg-purple-600 text-white font-semibold disabled:opacity-40">
          OK
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// 3. Cores e palavras (Stroop)
// =====================================================================

const COLORS = [
  { id: 'vermelho', label: 'VERMELHO', hex: '#dc2626' },
  { id: 'azul', label: 'AZUL', hex: '#2563eb' },
  { id: 'verde', label: 'VERDE', hex: '#15803d' },
  { id: 'amarelo', label: 'AMARELO', hex: '#ca8a04' }
];
const STROOP_N = 32;
const STROOP_PRACTICE = 4;
const STROOP_TIMEOUT = 3000;

function makeStroopTrials(n: number) {
  const half = n / 2;
  const list: { word: number; ink: number; congruent: boolean }[] = [];
  for (let i = 0; i < half; i++) {
    const c = i % 4;
    list.push({ word: c, ink: c, congruent: true });
    const w = i % 4;
    let ink = (w + 1 + Math.floor(Math.random() * 3)) % 4;
    if (ink === w) ink = (w + 1) % 4;
    list.push({ word: w, ink, congruent: false });
  }
  return shuffle(list);
}

export function StroopTask({ onDone, onSkip }: TaskProps<StroopResult>) {
  const [phase, setPhase] = useState<'intro' | 'practice' | 'ready' | 'run' | 'done'>('intro');
  const [list, setList] = useState(() => makeStroopTrials(STROOP_N));
  const [practice] = useState(() => makeStroopTrials(STROOP_PRACTICE));
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fb, setFb] = useState<null | boolean>(null);
  const onset = useRef(0);
  const results = useRef<StroopTrial[]>([]);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const busy = useRef(false);

  const current = phase === 'practice' ? practice[i] : list[i];

  const show = useCallback(async () => {
    setVisible(false);
    await sleep(450);
    setVisible(true);
    busy.current = false;
    requestAnimationFrame(() => (onset.current = performance.now()));
  }, []);

  useEffect(() => {
    if (phase !== 'practice' && phase !== 'run') return;
    show();
  }, [phase, i, show]);

  const answer = useCallback(
    async (color: number | null) => {
      if (busy.current || !visible) return;
      busy.current = true;
      clearTimeout(timeout.current);
      const rt = performance.now() - onset.current;
      const correct = color === current.ink;
      if (phase === 'practice') {
        setFb(correct);
        await sleep(600);
        setFb(null);
        if (i + 1 >= practice.length) {
          setI(0);
          setPhase('ready');
        } else setI(i + 1);
        return;
      }
      results.current.push({ congruent: current.congruent, correct, rt: Math.round(rt) });
      if (i + 1 >= list.length) setPhase('done');
      else setI(i + 1);
    },
    [current, i, list.length, phase, practice.length, visible]
  );

  // Tempo máximo por palavra
  useEffect(() => {
    if (!visible || (phase !== 'run' && phase !== 'practice')) return;
    timeout.current = setTimeout(() => answer(null), STROOP_TIMEOUT);
    return () => clearTimeout(timeout.current);
  }, [visible, phase, i, answer]);

  if (phase === 'intro')
    return (
      <Intro
        title="Cores e palavras"
        onStart={() => {
          setI(0);
          setPhase('practice');
        }}
        onSkip={onSkip}
      >
        <p className="m-0">
          Vão aparecer nomes de cores pintados de cores diferentes. Toque no botão da <strong>cor da tinta</strong>, não da palavra escrita.
        </p>
        <p className="m-0">
          Exemplo: <strong style={{ color: COLORS[1].hex }}>VERMELHO</strong> escrito em azul → toque em <strong>azul</strong>. Responda rápido, mas sem errar.
        </p>
        <p className="m-0 text-sm text-gray-500">Primeiro, 4 palavras de treino. Se você tem dificuldade para distinguir cores, pode pular este teste.</p>
      </Intro>
    );

  if (phase === 'ready')
    return (
      <Intro
        title="Treino concluído"
        startLabel="Começar o teste"
        onStart={() => {
          setList(makeStroopTrials(STROOP_N));
          setI(0);
          setPhase('run');
        }}
        onSkip={onSkip}
      >
        <p className="m-0">Agora são {STROOP_N} palavras, sem aviso de certo ou errado. Lembre: a cor da tinta.</p>
      </Intro>
    );

  if (phase === 'done')
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h2 className="m-0 text-2xl font-bold text-gray-900">Pronto!</h2>
        <p className="m-0 text-[15px] text-gray-700">O resultado aparece no final.</p>
        <button type="button" className={`${btn} w-fit`} onClick={() => onDone({ trials: results.current })}>
          Continuar
        </button>
      </div>
    );

  const total = phase === 'practice' ? practice.length : list.length;
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto select-none">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>{phase === 'practice' ? 'Treino' : 'Cor da tinta'}</span>
        <span>
          {i + 1} de {total}
        </span>
      </div>
      <div className="h-36 rounded-2xl bg-gray-50 border border-gray-100 grid place-items-center">
        {fb !== null ? (
          <span className={`text-xl font-bold ${fb ? 'text-emerald-600' : 'text-rose-600'}`}>{fb ? 'Certo!' : 'Era a cor da tinta'}</span>
        ) : visible && current ? (
          <span className="text-4xl sm:text-5xl font-black tracking-wide" style={{ color: COLORS[current.ink].hex }}>
            {COLORS[current.word].label}
          </span>
        ) : (
          <span className="text-3xl text-gray-300">+</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {COLORS.map((c, k) => (
          <button
            key={c.id}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              answer(k);
            }}
            className="h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center gap-2 font-semibold text-gray-900 active:scale-[0.98]"
          >
            <span className="w-5 h-5 rounded-full" style={{ background: c.hex }} aria-hidden="true" />
            {c.label.charAt(0) + c.label.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// 4. Trilhas (A: 1-2-3…; B: 1-A-2-B…)
// =====================================================================

const A_LABELS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const B_LABELS = Array.from({ length: 6 }, (_, i) => [String(i + 1), 'ABCDEF'[i]]).flat();

function layout(n: number) {
  for (let tries = 0; tries < 400; tries++) {
    const pts: { x: number; y: number }[] = [];
    let guard = 0;
    while (pts.length < n && guard++ < 3000) {
      const p = { x: rand(0.09, 0.91), y: rand(0.09, 0.91) };
      if (pts.every((q) => Math.hypot(p.x - q.x, p.y - q.y) > 0.2)) pts.push(p);
    }
    if (pts.length === n) return pts;
  }
  return Array.from({ length: n }, (_, i) => ({ x: 0.1 + (i % 4) * 0.27, y: 0.1 + Math.floor(i / 4) * 0.27 }));
}

function TrailBoard({ labels, onFinish }: { labels: string[]; onFinish: (ms: number, errors: number) => void }) {
  const [pts] = useState(() => layout(labels.length));
  const [next, setNext] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(0);
  const errors = useRef(0);

  useEffect(() => {
    if (!start.current || next >= labels.length) return;
    const iv = setInterval(() => setElapsed(performance.now() - start.current), 100);
    return () => clearInterval(iv);
  }, [next, labels.length]);

  const tap = (k: number) => {
    if (k === next) {
      if (k === 0) start.current = performance.now();
      const n = next + 1;
      setNext(n);
      if (n >= labels.length) onFinish(Math.round(performance.now() - start.current), errors.current);
    } else if (k > next) {
      if (next > 0) errors.current++;
      setWrong(k);
      setTimeout(() => setWrong(null), 350);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>Próximo: {labels[Math.min(next, labels.length - 1)]}</span>
        <span className="tabular-nums">{(elapsed / 1000).toFixed(1).replace('.', ',')} s</span>
      </div>
      <div className="relative w-full aspect-square rounded-2xl bg-gray-50 border border-gray-100 touch-none select-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {pts.slice(0, Math.max(0, next)).map((p, k) =>
            k === 0 ? null : <line key={k} x1={pts[k - 1].x * 100} y1={pts[k - 1].y * 100} x2={p.x * 100} y2={p.y * 100} stroke="#7c3aed" strokeWidth="0.8" strokeLinecap="round" />
          )}
        </svg>
        {pts.map((p, k) => {
          const done = k < next;
          return (
            <button
              key={k}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                tap(k);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-[13%] aspect-square rounded-full border-2 text-sm sm:text-base font-bold grid place-items-center transition-colors ${
                wrong === k ? 'bg-rose-500 border-rose-500 text-white' : done ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-400 text-gray-900'
              }`}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              {labels[k]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TrailsTask({ onDone, onSkip }: TaskProps<TrailsResult>) {
  const [phase, setPhase] = useState<'intro' | 'a' | 'introB' | 'b' | 'done'>('intro');
  const res = useRef<TrailsResult>({ aMs: 0, bMs: 0, aErrors: 0, bErrors: 0 });

  if (phase === 'intro')
    return (
      <Intro title="Trilhas" startLabel="Começar a parte A" onStart={() => setPhase('a')} onSkip={onSkip}>
        <p className="m-0">
          <strong>Parte A:</strong> toque nos círculos em ordem, <strong>1 → 2 → 3…</strong> até o 12, o mais rápido que puder. O tempo começa no toque no 1.
        </p>
        <p className="m-0">Se tocar no círculo errado, ele fica vermelho e você continua de onde estava.</p>
      </Intro>
    );
  if (phase === 'a')
    return (
      <div className="max-w-md mx-auto w-full">
        <TrailBoard
          labels={A_LABELS}
          onFinish={(ms, e) => {
            res.current.aMs = ms;
            res.current.aErrors = e;
            setTimeout(() => setPhase('introB'), 500);
          }}
        />
      </div>
    );
  if (phase === 'introB')
    return (
      <Intro title="Parte B" startLabel="Começar a parte B" onStart={() => setPhase('b')} onSkip={() => onDone({ ...res.current, bMs: 0 })}>
        <p className="m-0">
          Agora alterne <strong>número e letra</strong>: <strong>1 → A → 2 → B → 3 → C…</strong> até o F, o mais rápido que puder.
        </p>
      </Intro>
    );
  if (phase === 'b')
    return (
      <div className="max-w-md mx-auto w-full">
        <TrailBoard
          labels={B_LABELS}
          onFinish={(ms, e) => {
            res.current.bMs = ms;
            res.current.bErrors = e;
            setTimeout(() => setPhase('done'), 500);
          }}
        />
      </div>
    );
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <h2 className="m-0 text-2xl font-bold text-gray-900">Pronto!</h2>
      <p className="m-0 text-[15px] text-gray-700">O resultado aparece no final.</p>
      <button type="button" className={`${btn} w-fit`} onClick={() => onDone(res.current)}>
        Continuar
      </button>
    </div>
  );
}

// =====================================================================
// 5. Usos criativos (fluência, 2 minutos)
// =====================================================================

const AUT_SECONDS = 120;
const AUT_OBJECT = 'um tijolo';

export function CreativityTask({ onDone, onSkip }: TaskProps<CreativityResult>) {
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [left, setLeft] = useState(AUT_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== 'run') return;
    const end = performance.now() + AUT_SECONDS * 1000;
    inputRef.current?.focus();
    const iv = setInterval(() => {
      const s = Math.max(0, Math.ceil((end - performance.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        clearInterval(iv);
        setPhase('done');
      }
    }, 250);
    return () => clearInterval(iv);
  }, [phase]);

  const add = () => {
    const t = text.trim();
    if (t.length >= 2) setIdeas((xs) => [...xs, t]);
    setText('');
    inputRef.current?.focus();
  };

  if (phase === 'intro')
    return (
      <Intro title="Usos criativos" onStart={() => setPhase('run')} onSkip={onSkip}>
        <p className="m-0">
          Em <strong>2 minutos</strong>, escreva o maior número possível de <strong>usos diferentes para {AUT_OBJECT}</strong>, além do óbvio (construir parede). Vale tudo:
          prático, engraçado, inusitado.
        </p>
        <p className="m-0">Escreva uma ideia de cada vez e aperte “Adicionar” (ou Enter).</p>
      </Intro>
    );

  const unique = uniqueIdeas(ideas).length;
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <span>Usos para {AUT_OBJECT}</span>
        <span className="tabular-nums">{phase === 'done' ? 'tempo esgotado' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</span>
      </div>
      {phase === 'run' && (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex.: peso de porta"
            maxLength={80}
            className="flex-1 min-h-[48px] px-3 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
          <button type="submit" className="min-h-[48px] px-4 rounded-lg bg-purple-600 text-white font-semibold">
            Adicionar
          </button>
        </form>
      )}
      <ol className="m-0 pl-6 list-decimal text-[15px] text-gray-800 flex flex-col gap-1">
        {ideas.map((t, k) => (
          <li key={k}>{t}</li>
        ))}
      </ol>
      {phase === 'done' && (
        <>
          <p className="m-0 text-[15px] text-gray-700">
            {unique} ideia(s) diferente(s). O resultado aparece no final.
          </p>
          <button type="button" className={`${btn} w-fit`} onClick={() => onDone({ object: AUT_OBJECT, ideas, seconds: AUT_SECONDS })}>
            Continuar
          </button>
        </>
      )}
    </div>
  );
}
