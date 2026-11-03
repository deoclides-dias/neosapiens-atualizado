// src/components/body/BodyCharts.tsx
// Gráficos do resultado do Corpo, em SVG próprio (sem biblioteca):
// radar medido × percepção, linha do sono, minutos de movimento,
// Guia Alimentar e fibras, Bristol e urina, bem-estar e matriz de prioridades.
// Cada marca tem <title> (dica ao passar o mouse) e os valores ficam escritos.

import { BodyAnswers, WAKE_WINDOWS } from '../../lib/body/questions';
import { ActivityCalc, Priority, SleepCalc, foodProfile, guiaCalc, hhmm, hours, toMin } from '../../lib/body/scoring';
import { BristolIcon, Swatch, URINE_COLORS } from './Visuals';

const INK = '#111827';
const INK2 = '#4b5563';
const MUTED = '#6b7280';
const GRID = '#e5e7eb';
const PURPLE = '#7c3aed';
const AMBER = '#d97706';
const GOOD = '#059669';
const STATUS = { bom: '#059669', medio: '#d97706', atencao: '#e11d48' } as const;

const statusOf = (v: number, cut = 45): keyof typeof STATUS => (v >= 70 ? 'bom' : v >= cut ? 'medio' : 'atencao');

function Legend({ items }: { items: { label: string; swatch: JSX.Element }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          {i.swatch}
          {i.label}
        </span>
      ))}
    </div>
  );
}
const dot = (c: string) => <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />;
const dash = (c: string) => (
  <svg width="22" height="8" aria-hidden="true">
    <line x1="0" y1="4" x2="22" y2="4" stroke={c} strokeWidth="2" strokeDasharray="4 3" />
  </svg>
);
const block = (c: string) => <span className="w-3.5 h-3 rounded-sm inline-block" style={{ background: c }} />;

// ---------- Radar: medido × como você se vê ----------

export function AreaRadar({
  axes,
  label = 'Radar das cinco áreas: medido e como você se vê',
  single = false,
  measuredLabel = 'Medido pelas respostas',
  selfLabel = 'Como você se vê (satisfação × 10)'
}: {
  axes: { label: string; measured: number; self?: number }[];
  label?: string;
  single?: boolean;
  measuredLabel?: string;
  selfLabel?: string;
}) {
  const size = 300;
  const c = size / 2;
  const R = 100;
  const n = axes.length;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * (R * v) / 100, c + Math.sin(a) * (R * v) / 100];
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');
  const hasSelf = axes.every((a) => a.self !== undefined);

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <svg viewBox={`-100 -14 ${size + 200} ${size + 28}`} className="w-full max-w-[440px]" role="img" aria-label={label}>
        {[25, 50, 75, 100].map((r) => (
          <polygon key={r} points={poly(axes.map(() => r))} fill="none" stroke={GRID} strokeWidth="1" />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(i, 100);
          return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke={GRID} strokeWidth="1" />;
        })}
        <polygon points={poly(axes.map((a) => a.measured))} fill={PURPLE} fillOpacity="0.12" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
        {hasSelf && (
          <polygon points={poly(axes.map((a) => a.self!))} fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="5 4" strokeLinejoin="round" />
        )}
        {axes.map((a, i) => {
          const [x, y] = pt(i, a.measured);
          return (
            <circle key={a.label} cx={x} cy={y} r="5" fill={PURPLE} stroke="#fff" strokeWidth="2">
              <title>{`${a.label}: medido ${a.measured}${a.self !== undefined ? `, como você se vê ${a.self}` : ''}`}</title>
            </circle>
          );
        })}
        {hasSelf &&
          axes.map((a, i) => {
            const [x, y] = pt(i, a.self!);
            return (
              <circle key={`s${a.label}`} cx={x} cy={y} r="4" fill="#fff" stroke={AMBER} strokeWidth="2">
                <title>{`${a.label}: como você se vê ${a.self}`}</title>
              </circle>
            );
          })}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 120);
          const anchor = Math.abs(x - c) < 8 ? 'middle' : x > c ? 'start' : 'end';
          return (
            <text key={`l${a.label}`} x={x} y={y - 6} textAnchor={anchor} dominantBaseline="middle" fontSize="15" fill={INK}>
              <tspan fontWeight="600">{a.label}</tspan>
              <tspan x={x} dy="18" fill={MUTED} fontSize="14">
                {a.measured}
                {a.self !== undefined ? ` · ${a.self}` : ''}
              </tspan>
            </text>
          );
        })}
      </svg>
      {!single && <Legend
        items={[
          { label: measuredLabel, swatch: block(PURPLE) },
          ...(hasSelf ? [{ label: selfLabel, swatch: dash(AMBER) }] : [])
        ]}
      />}
    </figure>
  );
}

// ---------- Linha do sono ----------

const T0 = 20 * 60; // eixo começa às 20h
const SPAN = 16 * 60; // até 12h
const tx = (t: number, w: number) => (((t - T0 + 1440) % 1440) / SPAN) * w;

export function SleepTimeline({ a, c }: { a: BodyAnswers; c: SleepCalc }) {
  const W = 320;
  const rows = [
    { label: 'Trabalho', off: toMin(a.dorme_trab)!, wake: toMin(a.acorda_trab)!, mid: c.midWork, dur: c.durWork },
    { label: 'Livres', off: toMin(a.dorme_livre)!, wake: toMin(a.acorda_livre)!, mid: c.midFree, dur: c.durFree }
  ];
  const lat = typeof a.latencia === 'number' ? a.latencia : 0;
  const win = a.despertar === 'mesmo' ? WAKE_WINDOWS.find((w) => w.start === a.despertar_horario) : undefined;
  const ticks = [20, 22, 0, 2, 4, 6, 8, 10, 12];
  const top = 18;
  const rowH = 34;
  const H = top + rows.length * rowH + 24;

  return (
    <figure className="m-0 flex flex-col gap-2">
      <svg viewBox={`-62 0 ${W + 72} ${H}`} className="w-full" role="img" aria-label="Horários de sono em dias de trabalho e livres">
        {/* janela ideal do meio do sono */}
        <rect x={tx(120, W)} y={top - 6} width={tx(240, W) - tx(120, W)} height={rows.length * rowH + 4} fill={GOOD} opacity="0.08" rx="4" />
        <text x={(tx(120, W) + tx(240, W)) / 2} y={top - 9} textAnchor="middle" fontSize="10" fill={MUTED}>
          meio ideal
        </text>
        {win && (
          <g>
            <rect x={tx(win.start * 60, W)} y={top - 6} width={tx((win.start * 60 + 120) % 1440, W) - tx(win.start * 60, W)} height={rows.length * rowH + 4} fill={AMBER} opacity="0.12" rx="4">
              <title>{`Você costuma acordar ${win.label.toLowerCase()}`}</title>
            </rect>
          </g>
        )}
        {ticks.map((h) => {
          const x = tx(h * 60, W);
          return (
            <g key={h}>
              <line x1={x} y1={top - 4} x2={x} y2={top + rows.length * rowH} stroke={GRID} strokeWidth="1" />
              <text x={x} y={H - 6} textAnchor="middle" fontSize="11" fill={MUTED}>
                {h}h
              </text>
            </g>
          );
        })}
        {rows.map((r, i) => {
          const y = top + i * rowH + 6;
          const x1 = tx(r.off, W);
          let x2 = tx(r.wake, W);
          if (x2 < x1) x2 = W;
          const xl = tx(r.off + lat, W);
          const xm = tx(r.mid, W);
          return (
            <g key={r.label}>
              <text x={-8} y={y + 11} textAnchor="end" fontSize="12" fontWeight="600" fill={INK}>
                {r.label}
              </text>
              <rect x={x1} y={y} width={Math.max(2, x2 - x1)} height="22" rx="4" fill={PURPLE} opacity="0.25">
                <title>{`Na cama: ${hhmm(r.off)} às ${hhmm(r.wake)}`}</title>
              </rect>
              <rect x={xl} y={y} width={Math.max(2, x2 - xl)} height="22" rx="4" fill={PURPLE}>
                <title>{`Dormindo: cerca de ${hours(r.dur)}`}</title>
              </rect>
              <circle cx={xm} cy={y + 11} r="5" fill="#fff" stroke={INK} strokeWidth="2">
                <title>{`Meio do sono: ${hhmm(r.mid)}`}</title>
              </circle>
              <text x={Math.min(W + 6, x2 + 6)} y={y + 15} fontSize="11" fill={INK2}>
                {hours(r.dur)}
              </text>
            </g>
          );
        })}
      </svg>
      <Legend
        items={[
          { label: 'Na cama, ainda sem dormir', swatch: block('#d8c4fb') },
          { label: 'Dormindo', swatch: block(PURPLE) },
          {
            label: 'Meio do sono',
            swatch: <span className="w-3 h-3 rounded-full inline-block border-2 border-gray-900 bg-white" />
          },
          ...(win ? [{ label: 'Faixa em que você costuma acordar', swatch: block('#f8deb5') }] : [])
        ]}
      />
    </figure>
  );
}

// ---------- Onda do sono (esquema) ----------
// Desenho ilustrativo de uma noite em dia de trabalho, montado a partir das
// respostas: demora para dormir, ciclos de ~90 min (mais profundos no começo
// da noite, mais leves no fim), despertares e hora de acordar.
// Não é medição: estágios reais só com polissonografia ou sensores.

export function SleepWave({ a, c }: { a: BodyAnswers; c: SleepCalc }) {
  const off = toMin(a.dorme_trab);
  const wake = toMin(a.acorda_trab);
  if (off === null || wake === null) return null;
  const lat = typeof a.latencia === 'number' ? a.latencia : 0;
  const waso = a.despertar === 'nao' ? 0 : typeof a.acordado_noite === 'number' ? a.acordado_noite : 0;
  const inBed = ((wake - off + 1440) % 1440) || 1440;
  const pad = 30;
  const total = inBed + 2 * pad;
  const W = 340;
  const H = 168;
  const top = 26;
  const bottom = H - 30;
  const UP = 0.4; // altura da vigília acima do eixo
  const yZero = top + ((bottom - top) * UP) / (1 + UP);
  const xOf = (m: number) => (m / total) * W; // m = minutos desde (luz apagada − 30)
  const onset = pad + lat;
  const end = pad + inBed;

  // Momentos dos despertares (minutos desde o início do eixo)
  const wakes: { t: number; w: number }[] = [];
  if (a.despertar === 'mesmo' && typeof a.despertar_horario === 'number') {
    const center = ((a.despertar_horario as number) * 60 + 60 - (off - pad) + 1440) % 1440;
    if (center > onset + 30 && center < end - 20) wakes.push({ t: center, w: Math.max(6, waso / 2) });
  } else if (a.despertar === 'variado') {
    const sleepLen = end - onset;
    [0.4, 0.72].forEach((f) => wakes.push({ t: onset + sleepLen * f, w: Math.max(5, waso / 4) }));
  }

  // Profundidade do sono (0 a 1) em ciclos de ~90 min
  const AMP = [1, 0.85, 0.62, 0.45, 0.36, 0.3, 0.28];
  const depth = (m: number) => {
    if (m <= onset || m >= end) return 0;
    const t = m - onset;
    const k = Math.min(AMP.length - 1, Math.floor(t / 90));
    const ph = (t % 90) / 90;
    let d = 0.14 + (AMP[k] - 0.14) * Math.pow(Math.sin(Math.PI * ph), 2);
    d *= Math.min(1, t / 20) * Math.min(1, (end - m) / 15);
    for (const w of wakes) d *= 1 - Math.exp(-Math.pow((m - w.t) / w.w, 2));
    return Math.max(0, d);
  };
  // Vigília (0 a 1): acordado antes de dormir, depois de acordar e nos despertares
  const awake = (m: number) => {
    let v = m < onset ? 1 : m > end ? 1 : Math.max(Math.exp(-(m - onset) / 5), Math.exp(-(end - m) / 5));
    for (const w of wakes) v = Math.max(v, Math.exp(-Math.pow((m - w.t) / (w.w * 0.7), 2)));
    return v;
  };
  const value = (m: number) => UP * awake(m) - depth(m); // acima de 0 = acordado(a); abaixo = dormindo
  const yOf = (v: number) => yZero - v * ((yZero - top) / UP);
  const pts: string[] = [];
  for (let m = 0; m <= total; m += 2) pts.push(`${xOf(m).toFixed(1)},${yOf(value(m)).toFixed(1)}`);
  const line = `M${pts.join(' L')}`;
  const area = `${line} L${W},${yZero} L0,${yZero} Z`;

  // Marcas de hora cheia
  const startClock = off - pad;
  const ticks: { x: number; h: number }[] = [];
  const firstHour = Math.ceil(startClock / 60) * 60;
  for (let t = firstHour; t <= startClock + total; t += 120) {
    ticks.push({ x: xOf(t - startClock), h: ((t / 60) % 24 + 24) % 24 });
  }

  return (
    <figure className="m-0 flex flex-col gap-1.5">
      <figcaption className="text-xs text-gray-600">Como seria uma noite em dia de trabalho (esquema)</figcaption>
      <svg viewBox={`-92 0 ${W + 100} ${H}`} className="w-full" role="img" aria-label="Esquema da noite: vigília acima do eixo e sono abaixo">
        <defs>
          <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.08" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.5" />
          </linearGradient>
          <clipPath id="aboveZero">
            <rect x="0" y="0" width={W} height={yZero} />
          </clipPath>
          <clipPath id="belowZero">
            <rect x="0" y={yZero} width={W} height={H} />
          </clipPath>
        </defs>
        {[
          { v: UP, l: 'acordado(a)' },
          { v: -0.5, l: 'sono leve' },
          { v: -1, l: 'sono profundo' }
        ].map((g) => (
          <g key={g.l}>
            <line x1="0" y1={yOf(g.v)} x2={W} y2={yOf(g.v)} stroke={GRID} strokeWidth="1" />
            <text x="-6" y={yOf(g.v) + 4} textAnchor="end" fontSize="10.5" fill={MUTED}>
              {g.l}
            </text>
          </g>
        ))}
        <path d={area} fill={AMBER} opacity="0.28" clipPath="url(#aboveZero)" />
        <path d={area} fill="url(#sleepFill)" clipPath="url(#belowZero)" />
        <line x1="0" y1={yZero} x2={W} y2={yZero} stroke={INK2} strokeWidth="1" />
        <text x="-6" y={yZero + 4} textAnchor="end" fontSize="10.5" fill={INK2}>
          adormecer
        </text>
        <path d={line} fill="none" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
        {wakes.map((w) => (
          <circle key={w.t} cx={xOf(w.t)} cy={yOf(value(w.t))} r="4.5" fill={AMBER} stroke="#fff" strokeWidth="2">
            <title>{`Despertar por volta de ${hhmm(startClock + w.t)}`}</title>
          </circle>
        ))}
        <g>
          <line x1={xOf(pad)} y1={top} x2={xOf(pad)} y2={bottom} stroke={INK2} strokeWidth="1" strokeDasharray="3 3" />
          <text x={xOf(pad)} y={top - 10} textAnchor="middle" fontSize="10" fill={INK2}>
            luz apagada
          </text>
          <line x1={xOf(end)} y1={top} x2={xOf(end)} y2={bottom} stroke={INK2} strokeWidth="1" strokeDasharray="3 3" />
          <text x={xOf(end)} y={top - 10} textAnchor="middle" fontSize="10" fill={INK2}>
            acorda
          </text>
        </g>
        {ticks.map((t) => (
          <text key={t.x} x={t.x} y={H - 10} textAnchor="middle" fontSize="11" fill={MUTED}>
            {t.h}h
          </text>
        ))}
      </svg>
      <p className="m-0 text-xs leading-relaxed text-gray-500">
        Acima da linha, acordado(a); abaixo, dormindo. Cada vale é um ciclo de cerca de 90 minutos: os primeiros vão mais fundo e os do fim da noite ficam mais
        rasos.
        {wakes.length > 0 && ' Os pontos laranja marcam os despertares que você relatou.'} É uma ilustração feita com as suas respostas, não uma medição.
      </p>
    </figure>
  );
}

// ---------- Movimento ----------

const WALK = '#a78bfa';
const MOD = '#7c3aed';
const VIG = '#4c1d95';

export function MovementBar({ c }: { c: ActivityCalc }) {
  const W = 320;
  const max = Math.max(330, c.whoMinutes * 1.08);
  const x = (m: number) => (m / max) * W;
  const segs = [
    { label: 'Caminhada', v: c.walk, color: WALK },
    { label: 'Moderada', v: c.mod, color: MOD },
    { label: 'Vigorosa (conta em dobro)', v: 2 * c.vig, raw: c.vig, color: VIG }
  ].filter((s) => s.v > 0) as { label: string; v: number; raw?: number; color: string }[];
  let acc = 0;
  const sitH = c.sittingAvg / 60;
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox={`0 0 ${W} 74`} className="w-full" role="img" aria-label={`Minutos semanais equivalentes: ${c.whoMinutes}`}>
        <rect x={x(150)} y="14" width={x(300) - x(150)} height="30" fill={GOOD} opacity="0.08" />
        <rect x="0" y="22" width={W} height="14" rx="4" fill="#f3f4f6" />
        {segs.map((s, i) => {
          const x0 = x(acc);
          acc += s.v;
          const w = Math.max(0, x(s.v) - (i < segs.length - 1 ? 2 : 0));
          return (
            <rect key={s.label} x={x0} y="22" width={w} height="14" rx={i === segs.length - 1 ? 4 : 0} fill={s.color}>
              <title>{`${s.label}: ${s.v} min`}</title>
            </rect>
          );
        })}
        {[150, 300].map((m) => (
          <g key={m}>
            <line x1={x(m)} y1="14" x2={x(m)} y2="44" stroke={INK2} strokeWidth="1" />
            <text x={x(m)} y="10" textAnchor="middle" fontSize="10" fill={MUTED}>
              {m} min
            </text>
          </g>
        ))}
        <text x={x(c.whoMinutes) > W - 110 ? x(c.whoMinutes) : x(c.whoMinutes) + 4} y="62" textAnchor={x(c.whoMinutes) > W - 110 ? 'end' : 'start'} fontSize="12" fontWeight="700" fill={INK}>
          {c.whoMinutes} min/semana
        </text>
      </svg>
      <Legend items={segs.map((s) => ({ label: `${s.label}: ${s.raw ?? s.v} min`, swatch: block(s.color) }))} />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Tempo sentado por dia</span>
          <span className="font-semibold text-gray-900">{hours(c.sittingAvg)}</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-gray-100">
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, (sitH / 14) * 100)}%`, background: sitH >= 8 ? STATUS.atencao : '#9ca3af' }} />
          <div className="absolute -top-1 -bottom-1 w-px bg-gray-700" style={{ left: `${(8 / 14) * 100}%` }} title="8 horas" />
        </div>
        <div className="relative h-4 text-[10px] text-gray-500">
          <span className="absolute -translate-x-1/2" style={{ left: `${(8 / 14) * 100}%` }}>
            8 h
          </span>
        </div>
      </div>
    </figure>
  );
}

// ---------- Alimentação ----------

export function FoodCharts({ a }: { a: BodyAnswers }) {
  const g = guiaCalc(a);
  const profile = foodProfile(a);
  const pct = (g.total / 72) * 100;
  const ref = (44.1 / 72) * 100;
  return (
    <div className="flex flex-col gap-4">
      {profile.length >= 5 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Seu prato em 10 dimensões (0 a 100, quanto mais para fora, melhor)</span>
          <AreaRadar single label="Radar da alimentação" axes={profile.map((p) => ({ label: p.label, measured: p.value }))} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Práticas do Guia Alimentar</span>
          <span className="font-semibold text-gray-900">{g.total} de 72</span>
        </div>
        <div className="relative h-3 rounded-full bg-gray-100">
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: STATUS[statusOf(pct)] }} />
          <div className="absolute -top-1.5 -bottom-1.5 w-0.5 bg-gray-800" style={{ left: `${ref}%` }} title="Média brasileira no estudo: 44,1" />
        </div>
        <div className="relative h-4 text-[10px] text-gray-500">
          <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${ref}%` }}>
            média no Brasil: 44
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Bristol e urina ----------

export function DigestionCharts({ a }: { a: BodyAnswers }) {
  const b = typeof a.bristol === 'number' ? a.bristol : 0;
  const u = typeof a.urina === 'number' ? a.urina : 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-gray-600">Escala de Bristol: o seu tipo</span>
        <div className="grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((t) => {
            const ideal = t === 3 || t === 4;
            const me = t === b;
            return (
              <div
                key={t}
                className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 ${ideal ? 'bg-emerald-50' : 'bg-gray-50'} ${me ? 'ring-2 ring-purple-600' : ''}`}
                title={`Tipo ${t}${ideal ? ' (faixa ideal)' : ''}${me ? ' — o seu' : ''}`}
              >
                <BristolIcon type={t} width={40} />
                <span className={`text-[11px] ${me ? 'font-bold text-purple-800' : 'text-gray-600'}`}>{t}</span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
          <span className="col-span-2 text-gray-500">mais duras</span>
          <span className="col-span-2 text-emerald-700 font-semibold">ideal</span>
          <span className="col-span-3 text-gray-500">mais moles</span>
        </div>
      </div>
      {u > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-600">Cor da urina durante o dia</span>
          <div className="grid grid-cols-6 gap-1">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <div key={c} className={`flex justify-center rounded-lg py-1 ${c <= 3 ? 'bg-emerald-50' : 'bg-gray-50'} ${c === u ? 'ring-2 ring-purple-600' : ''}`} title={c === u ? 'A sua' : undefined}>
                <Swatch color={URINE_COLORS[c]} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1 text-[10px] text-center">
            <span className="col-span-3 text-emerald-700 font-semibold">hidratado(a)</span>
            <span className="col-span-3 text-gray-500">falta de água</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Bem-estar ----------

export function WellbeingGauge({ score }: { score: number }) {
  const r = 70;
  const cx = 90;
  const cy = 86;
  const arc = (from: number, to: number) => {
    const p = (v: number) => {
      const ang = Math.PI * (1 - v / 100);
      return [cx + r * Math.cos(ang), cy - r * Math.sin(ang)];
    };
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const color = score > 50 ? (score >= 70 ? STATUS.bom : STATUS.medio) : STATUS.atencao;
  const ang = Math.PI * (1 - 50 / 100);
  return (
    <svg viewBox="0 0 180 104" className="w-full max-w-[240px] mx-auto" role="img" aria-label={`Bem-estar ${score} de 100`}>
      <path d={arc(0, 100)} stroke="#f3f4f6" strokeWidth="14" fill="none" strokeLinecap="round" />
      {score > 0 && <path d={arc(0, Math.max(1, score))} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" />}
      <line x1={cx + (r - 12) * Math.cos(ang)} y1={cy - (r - 12) * Math.sin(ang)} x2={cx + (r + 12) * Math.cos(ang)} y2={cy - (r + 12) * Math.sin(ang)} stroke={INK2} strokeWidth="1.5" />
      <text x={cx} y={cy - r - 16} textAnchor="middle" fontSize="9" fill={MUTED}>
        50
      </text>
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
        {score}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill={MUTED}>
        de 100
      </text>
    </svg>
  );
}

// ---------- Matriz de prioridades ----------



export function PriorityMatrix({ items }: { items: Priority[] }) {
  const W = 300;
  const H = 230;
  const m = { l: 34, r: 12, t: 12, b: 34 };
  const x = (v: number) => m.l + (v / 10) * (W - m.l - m.r);
  const y = (v: number) => H - m.b - (v / 10) * (H - m.t - m.b);
  // Pontos numerados pela ordem de prioridade; pontos no mesmo lugar ficam lado a lado
  const seen: Record<string, number> = {};
  const placed = items.map((p, idx) => {
    const key = `${p.satisfaction}-${p.importance}`;
    const k = (seen[key] = (seen[key] ?? -1) + 1);
    return { ...p, n: idx + 1, px: x(p.satisfaction) + k * 17, py: y(p.importance) };
  });
  return (
    <figure className="m-0 flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]" role="img" aria-label="Importância e satisfação por área">
        <rect x={x(0)} y={y(10)} width={x(5) - x(0)} height={y(5) - y(10)} fill={PURPLE} opacity="0.07" />
        <text x={x(0) + 6} y={y(10) + 14} fontSize="10" fontWeight="600" fill={PURPLE}>
          começar por aqui
        </text>
        {[0, 5, 10].map((v) => (
          <g key={v}>
            <line x1={x(v)} y1={y(0)} x2={x(v)} y2={y(10)} stroke={GRID} strokeWidth="1" />
            <line x1={x(0)} y1={y(v)} x2={x(10)} y2={y(v)} stroke={GRID} strokeWidth="1" />
            <text x={x(v)} y={H - m.b + 14} textAnchor="middle" fontSize="10" fill={MUTED}>
              {v}
            </text>
            <text x={m.l - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill={MUTED}>
              {v}
            </text>
          </g>
        ))}
        <text x={(x(0) + x(10)) / 2} y={H - 4} textAnchor="middle" fontSize="10" fill={INK2}>
          satisfação hoje →
        </text>
        <text x={10} y={(y(0) + y(10)) / 2} textAnchor="middle" fontSize="10" fill={INK2} transform={`rotate(-90 10 ${(y(0) + y(10)) / 2})`}>
          importância →
        </text>
        {placed.map((p) => (
          <g key={p.id}>
            <circle cx={p.px} cy={p.py} r="8" fill={PURPLE} stroke="#fff" strokeWidth="2">
              <title>{`${p.n}. ${p.label}: importância ${p.importance}, satisfação ${p.satisfaction}`}</title>
            </circle>
            <text x={p.px} y={p.py + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" pointerEvents="none">
              {p.n}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
