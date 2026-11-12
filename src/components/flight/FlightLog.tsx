// src/components/flight/FlightLog.tsx
// Diário de bordo dos 7 dias e a Revisão da Jornada (antes × depois).

import { useMemo, useState } from 'react';
import { Anchor, Check, Compass, Flag, Sparkles } from 'lucide-react';
import { practiceById, rumoById } from '../../lib/flight/library';
import { FLIGHT_DAYS, FlightData, addDays, dayIndex, isoDay, reviewQuestions, reviewScores } from '../../lib/flight/flight';
import { LIFE_AREAS } from '../../lib/purpose/purpose';

interface Props {
  flight: FlightData;
  onSave: (f: FlightData) => Promise<boolean>;
  onNewFlight: () => void;
}

const ENERGY = ['Muito baixa', 'Baixa', 'Média', 'Boa', 'Ótima'];
const fmtDay = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }).replace('.', '');
};

export default function FlightLog({ flight, onSave, onNewFlight }: Props) {
  const today = isoDay(new Date());
  const idx = Math.max(0, dayIndex(flight.inicio, today));
  const days = Array.from({ length: FLIGHT_DAYS }, (_, i) => addDays(flight.inicio, i));
  const [selected, setSelected] = useState(days[Math.min(idx, FLIGHT_DAYS - 1)]);
  const [draft, setDraft] = useState(flight.diario[selected] ?? { feitas: [] });
  const [saving, setSaving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>(flight.revisao?.respostas ?? {});
  const rumo = rumoById(flight.rumo);
  const title = flight.rumo === 'area' ? `Viver mais: ${LIFE_AREAS.find((a) => a.id === flight.area)?.label.toLowerCase()}` : rumo?.title;
  const practices = flight.praticas.map((p) => ({ ...p, practice: practiceById(p.id)! })).filter((p) => p.practice);
  const questions = useMemo(() => reviewQuestions(flight), [flight]);
  const canReview = idx >= FLIGHT_DAYS - 1;

  const pick = (d: string) => {
    setSelected(d);
    setDraft(flight.diario[d] ?? { feitas: [] });
  };

  const saveDay = async () => {
    setSaving(true);
    await onSave({ ...flight, diario: { ...flight.diario, [selected]: draft } });
    setSaving(false);
  };

  const done = days.filter((d) => (flight.diario[d]?.feitas.length ?? 0) > 0).length;
  const energies = days.map((d) => flight.diario[d]?.energia);

  // ---------- Resultado da revisão ----------
  if (flight.revisao) {
    const before = reviewScores(flight, flight.baseline);
    const after = reviewScores(flight, flight.revisao.respostas);
    const specLabel =
      flight.rumo === 'emocoes'
        ? 'Estabilidade emocional'
        : flight.rumo === 'organizacao'
          ? 'Organização'
          : flight.rumo === 'foco'
            ? 'Foco (sua avaliação)'
            : flight.rumo === 'relacoes' || flight.rumo === 'area'
              ? 'Vivido de acordo com o que importa'
              : `Satisfação com ${rumo?.short ?? 'o rumo'}`;
    const dropped = typeof before.specific === 'number' && typeof after.specific === 'number' && after.specific < before.specific;
    const rows = [
      { label: specLabel, b: before.specific, a: after.specific },
      { label: 'Bem-estar (OMS-5)', b: before.wellbeing, a: after.wellbeing }
    ].filter((r) => r.a !== null);
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <Flag className="w-8 h-8 text-purple-600 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-2xl font-bold text-gray-900">Revisão da Jornada</h2>
            <p className="m-0 text-[15px] text-gray-700">
              Você praticou em <strong>{done} de {FLIGHT_DAYS} dias</strong> no rumo “{title?.toLowerCase()}”.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900">{r.label}</span>
                <span className="text-gray-700">
                  {r.b ?? '–'} → <strong className="text-gray-900">{r.a}</strong>
                  {typeof r.b === 'number' && typeof r.a === 'number' && (
                    <span className={r.a - r.b > 0 ? 'text-emerald-700' : r.a - r.b < 0 ? 'text-rose-700' : 'text-gray-500'}>
                      {' '}
                      ({r.a - r.b > 0 ? '+' : ''}
                      {r.a - r.b})
                    </span>
                  )}
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-gray-100">
                {typeof r.b === 'number' && <div className="absolute inset-y-0 left-0 rounded-full bg-gray-300" style={{ width: `${r.b}%` }} title={`Antes: ${r.b}`} />}
                <div className="absolute top-[3px] h-1.5 left-0 rounded-full bg-purple-600" style={{ width: `${r.a}%` }} title={`Agora: ${r.a}`} />
              </div>
            </div>
          ))}
          <p className="m-0 text-xs text-gray-500">Barra cinza: antes da Jornada (respostas dos módulos). Barra roxa: agora. De 0 a 100.</p>
        </div>
        {dropped && (
          <p className="m-0 text-[15px] leading-relaxed text-gray-800">
            A nota de {specLabel.toLowerCase()} caiu. Isso é comum na primeira semana: quando a gente presta atenção num rumo, passa a enxergá-lo com mais clareza, e a nota
            fica mais realista.
          </p>
        )}
        <p className="m-0 text-[15px] leading-relaxed text-gray-800">
          Sete dias são pouco para mudanças grandes, mas suficientes para descobrir o que funciona para você. Hábitos costumam levar algumas semanas, às vezes meses,
          para ficar automáticos; o que conta é a regularidade, não a perfeição.
        </p>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950 to-purple-900 p-5 text-white flex flex-col gap-3">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-200">Próxima viagem</p>
          <p className="m-0 text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Seja um Argonauta
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-purple-100">
            Rotas de 30 e 90 dias, com até três rumos, práticas que evoluem a cada semana e o seu Mapa refeito no fim da viagem.
          </p>
          {flight.argonauta ? (
            <p className="m-0 text-sm font-semibold text-emerald-300">Anotado! Avisaremos você quando as Rotas abrirem.</p>
          ) : (
            <button type="button" onClick={() => onSave({ ...flight, argonauta: true })} className="min-h-[44px] px-5 rounded-lg bg-white text-indigo-950 font-semibold w-fit">
              Quero ser avisado(a)
            </button>
          )}
        </div>
        <button type="button" onClick={onNewFlight} className="min-h-[44px] px-4 rounded-lg border border-purple-300 text-purple-800 font-semibold hover:bg-purple-50 w-fit">
          Começar uma nova Jornada
        </button>
      </div>
    );
  }

  // ---------- Perguntas da revisão ----------
  if (reviewing) {
    const complete = questions.every((q) => typeof answers[q.id] === 'number');
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-2xl font-bold text-gray-900">Revisão da Jornada</h2>
          <p className="m-0 text-[15px] text-gray-700">Algumas perguntas que você já respondeu nos módulos, para comparar o antes e o agora. Pense nos últimos dias.</p>
        </div>
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-2">
            <p className="m-0 text-[16px] font-semibold text-gray-900">{q.text}</p>
            <div className={`grid gap-1.5 ${q.scale.length > 6 ? 'grid-cols-6 sm:grid-cols-11' : q.scale.length === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-5'}`}>
              {q.scale.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [q.id]: o.value })}
                  aria-pressed={answers[q.id] === o.value}
                  className={`min-h-[44px] px-2 rounded-xl border text-sm font-medium leading-tight ${answers[q.id] === o.value ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-800'}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <button type="button" onClick={() => setReviewing(false)} className="min-h-[44px] px-3 rounded-lg text-sm font-semibold text-gray-600">
            Voltar ao diário
          </button>
          <button
            type="button"
            disabled={!complete || saving}
            onClick={async () => {
              setSaving(true);
              await onSave({ ...flight, revisao: { respostas: answers, data: today } });
              setSaving(false);
            }}
            className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
          >
            Ver o antes e o depois
          </button>
        </div>
      </div>
    );
  }

  // ---------- Diário ----------
  const selIdx = days.indexOf(selected);
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-start gap-3">
        <Compass className="w-8 h-8 text-purple-600 shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">Primeira Jornada · rumo</p>
          <h2 className="m-0 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="m-0 text-sm text-gray-600">
            {idx < FLIGHT_DAYS ? `Dia ${idx + 1} de ${FLIGHT_DAYS}` : 'Os 7 dias terminaram'} · praticou em {done} dia(s)
          </p>
        </div>
      </div>

      {/* Os 7 dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const log = flight.diario[d];
          const did = (log?.feitas.length ?? 0) > 0;
          const future = i > idx;
          return (
            <button
              key={d}
              type="button"
              disabled={future}
              onClick={() => pick(d)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 border-2 text-xs ${d === selected ? 'border-purple-600' : 'border-transparent'} ${future ? 'opacity-40' : ''}`}
            >
              <span className="text-gray-500">{fmtDay(d)}</span>
              <span className={`w-8 h-8 rounded-full grid place-items-center font-bold ${did ? 'bg-purple-600 text-white' : log ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                {did ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              {typeof energies[i] === 'number' && <span className="text-[10px] text-gray-500">energia {energies[i]}</span>}
            </button>
          );
        })}
      </div>

      {/* Registro do dia selecionado */}
      <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-4">
        <p className="m-0 font-semibold text-gray-900">{selected === today ? 'Hoje' : `Dia ${selIdx + 1} (${fmtDay(selected)})`}</p>
        {practices.map((p) => {
          const on = draft.feitas.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setDraft({ ...draft, feitas: on ? draft.feitas.filter((x) => x !== p.id) : [...draft.feitas, p.id] })}
              aria-pressed={on}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left ${on ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}
            >
              <span className={`w-6 h-6 mt-0.5 rounded-md border-2 grid place-items-center shrink-0 ${on ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'}`}>{on && <Check className="w-4 h-4" />}</span>
              <span className="text-[15px] text-gray-900">
                Depois de {p.ancora}, eu {on ? 'fui' : 'vou'} <strong>{p.practice.text}</strong>.
              </span>
            </button>
          );
        })}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-800">Como estava a sua energia?</span>
          <div className="grid grid-cols-5 gap-1.5">
            {ENERGY.map((l, i) => (
              <button
                key={l}
                type="button"
                onClick={() => setDraft({ ...draft, energia: i + 1 })}
                className={`min-h-[44px] rounded-xl border text-xs font-medium leading-tight px-1 ${draft.energia === i + 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-200 text-gray-800'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={draft.nota ?? ''}
          onChange={(e) => setDraft({ ...draft, nota: e.target.value.slice(0, 500) })}
          rows={2}
          placeholder="Uma nota sobre o dia (opcional)"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
        />
        <button type="button" onClick={saveDay} disabled={saving} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit disabled:opacity-40">
          {saving ? 'Salvando…' : 'Registrar no diário'}
        </button>
      </div>

      {/* Lembretes do plano */}
      <div className="rounded-2xl bg-purple-50 p-4 flex flex-col gap-2 text-[15px] text-gray-800">
        <p className="m-0 flex items-center gap-2 font-semibold text-purple-900">
          <Anchor className="w-4 h-4" /> Seu plano de bordo
        </p>
        <p className="m-0">
          <strong>Desejo:</strong> {flight.woop.desejo}
        </p>
        {flight.woop.resultado && (
          <p className="m-0">
            <strong>Resultado:</strong> {flight.woop.resultado}
          </p>
        )}
        <p className="m-0">
          <strong>Se</strong> {flight.woop.obstaculo.replace(/\.$/, '').toLowerCase()}, <strong>então</strong> {flight.woop.plano.replace(/^se .*?, ?então /i, '')}
        </p>
        {flight.destino && (
          <p className="m-0 text-sm text-gray-600">
            <strong>Destino:</strong> {flight.destino}
          </p>
        )}
      </div>

      {canReview ? (
        <button type="button" onClick={() => setReviewing(true)} className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-indigo-950 text-white font-semibold w-fit">
          <Sparkles className="w-4 h-4" /> Fazer a Revisão da Jornada
        </button>
      ) : (
        <p className="m-0 text-sm text-gray-600">A Revisão da Jornada abre no 7º dia ({fmtDay(days[FLIGHT_DAYS - 1])}).</p>
      )}
    </div>
  );
}
