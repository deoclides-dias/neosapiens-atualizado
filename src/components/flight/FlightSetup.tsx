// src/components/flight/FlightSetup.tsx
// Montagem da Primeira Jornada: Bússola → Destino → Plano de bordo (WOOP)
// → Práticas (“depois de…, eu vou…”) → Zarpar.

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Compass, Sailboat } from 'lucide-react';
import { EVIDENCE_LABEL, RUMOS, rumoById } from '../../lib/flight/library';
import { FLIGHT_DAYS, FLIGHT_VERSION, FlightData, Heading, isoDay } from '../../lib/flight/flight';
import { LIFE_AREAS } from '../../lib/purpose/purpose';

interface Props {
  headings: Heading[];
  vision?: string;
  baseline: Record<string, number>;
  onStart: (f: FlightData) => Promise<boolean>;
  /** Rumo vindo da Carta ao Navegante (?rumo=…&area=…) */
  preselect?: { rumo: string; area?: string } | null;
}

const STEPS = ['Bússola', 'Destino', 'Plano de bordo', 'Práticas'] as const;
const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none';
const areaLabel = (id?: string) => LIFE_AREAS.find((a) => a.id === id)?.label;
const headingTitle = (h: Heading) => (h.rumo === 'area' ? `Viver mais: ${areaLabel(h.area)?.toLowerCase()}` : rumoById(h.rumo)?.title ?? h.rumo);

export default function FlightSetup({ headings, vision, baseline, onStart, preselect }: Props) {
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [heading, setHeading] = useState<Heading | null>(null);
  const [destino, setDestino] = useState('');
  const [woop, setWoop] = useState({ desejo: '', resultado: '', obstaculo: '', plano: '' });
  const [chosen, setChosen] = useState<{ id: string; ancora: string }[]>([]);
  const [saving, setSaving] = useState(false);

  // Rumos sugeridos + os demais, para quem quiser escolher outro
  const options = useMemo(() => {
    const suggested = headings.slice(0, 3);
    const rest: Heading[] = RUMOS.filter((r) => r.id !== 'area' && !suggested.some((h) => h.rumo === r.id)).map((r) => ({ rumo: r.id, title: r.title, reasons: [], score: 0 }));
    return { suggested, rest };
  }, [headings]);

  // Vindo da Carta: já marca o rumo escolhido lá (uma vez só)
  const [preApplied, setPreApplied] = useState(false);
  useEffect(() => {
    if (preApplied || !preselect || heading) return;
    const h =
      options.suggested.find((x) => x.rumo === preselect.rumo && (x.area ?? '') === (preselect.area ?? '')) ??
      options.rest.find((x) => x.rumo === preselect.rumo);
    if (h) {
      choose(h);
      if (!options.suggested.includes(h)) setShowAll(true);
    }
    setPreApplied(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselect, options]);

  const rumo = heading ? rumoById(heading.rumo) : null;
  const choose = (h: Heading) => {
    setHeading(h);
    setChosen([]);
    // O desejo acompanha o rumo: se o texto ainda é o sugerido (ou está vazio), troca junto
    setWoop((w) => {
      const auto = heading ? `Nesta semana, quero ${headingTitle(heading).toLowerCase()}.` : '';
      const keep = w.desejo.trim() && w.desejo !== auto;
      return { ...w, desejo: keep ? w.desejo : `Nesta semana, quero ${headingTitle(h).toLowerCase()}.` };
    });
  };
  const toggle = (id: string) => {
    const has = chosen.find((c) => c.id === id);
    if (has) setChosen(chosen.filter((c) => c.id !== id));
    else if (chosen.length < 2) setChosen([...chosen, { id, ancora: rumo!.practices.find((p) => p.id === id)!.anchors[0] }]);
  };

  const canNext = [Boolean(heading), true, woop.desejo.trim() && woop.obstaculo.trim() && woop.plano.trim(), chosen.length > 0 && chosen.every((c) => c.ancora.trim())][step];

  const start = async () => {
    if (!heading) return;
    setSaving(true);
    const ok = await onStart({
      versao: FLIGHT_VERSION,
      rumo: heading.rumo,
      area: heading.area,
      porque: heading.reasons,
      destino: destino.trim() || undefined,
      woop,
      praticas: chosen,
      inicio: isoDay(new Date()),
      diario: {},
      baseline
    });
    setSaving(false);
    return ok;
  };

  const HeadingCard = ({ h, rank }: { h: Heading; rank?: number }) => {
    const on = heading?.rumo === h.rumo && heading?.area === h.area;
    return (
      <button
        type="button"
        onClick={() => choose(h)}
        aria-pressed={on}
        className={`w-full text-left rounded-xl border-2 p-4 flex gap-3 transition-colors ${on ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
      >
        <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold shrink-0 ${on ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {on ? <Check className="w-4 h-4" /> : rank ?? '·'}
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900">{headingTitle(h)}</span>
          {h.reasons.map((r) => (
            <span key={r} className="text-sm text-gray-600">
              {r}
            </span>
          ))}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>
            Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
          </span>
          <span>Primeira Jornada · {FLIGHT_DAYS} dias</span>
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-purple-600' : i === step ? 'bg-purple-300' : 'bg-gray-100'}`} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <>
          <div className="flex items-start gap-3">
            <Compass className="w-8 h-8 text-purple-600 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-2xl font-bold text-gray-900">A Bússola</h2>
              <p className="m-0 text-[15px] leading-relaxed text-gray-700">
                Pelo seu Mapa, estes são os rumos com mais força para mudar agora. A bússola aponta; quem escolhe o rumo é você, o timoneiro.
              </p>
            </div>
          </div>
          {options.suggested.length ? (
            <div className="flex flex-col gap-2.5">
              {options.suggested.map((h, i) => (
                <HeadingCard key={`${h.rumo}-${h.area ?? ''}`} h={h} rank={i + 1} />
              ))}
            </div>
          ) : (
            <p className="m-0 text-sm text-gray-600">Responda os módulos para a bússola sugerir rumos. Enquanto isso, você pode escolher um abaixo.</p>
          )}
          {heading && options.suggested.length > 0 && !(options.suggested[0].rumo === heading.rumo && options.suggested[0].area === heading.area) && (
            <p className="m-0 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-sm text-amber-900">
              A bússola indicou <strong>{headingTitle(options.suggested[0]).toLowerCase()}</strong> em primeiro lugar, e você escolheu{' '}
              <strong>{headingTitle(heading).toLowerCase()}</strong>. Tudo bem: o timoneiro é você. Só vale saber que o seu Mapa aponta outro caminho como o de mais força.
            </p>
          )}
          <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm font-semibold text-purple-700 w-fit min-h-[40px]">
            {showAll ? 'Esconder os outros rumos' : 'Prefiro outro rumo'}
          </button>
          {showAll && (
            <div className="flex flex-col gap-2">
              {options.rest.map((h) => (
                <HeadingCard key={h.rumo} h={h} />
              ))}
            </div>
          )}
        </>
      )}

      {step === 1 && heading && (
        <>
          <h2 className="m-0 text-2xl font-bold text-gray-900">O Destino</h2>
          {vision ? (
            <blockquote className="m-0 rounded-xl bg-purple-50 p-4 text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-700 mb-1">O dia que você imaginou daqui a 5 anos</span>
              {vision}
            </blockquote>
          ) : (
            <p className="m-0 text-[15px] text-gray-700">Imagine como seria a sua vida se você avançasse de verdade neste rumo.</p>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-[16px] font-semibold text-gray-900">O que mudaria {vision ? 'nesse dia' : 'na sua vida'} se você avançasse em “{headingTitle(heading).toLowerCase()}”?</span>
            <textarea value={destino} onChange={(e) => setDestino(e.target.value.slice(0, 800))} rows={4} className={input} placeholder="Eu teria mais…" />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-2xl font-bold text-gray-900">O Plano de bordo</h2>
            <p className="m-0 text-[15px] leading-relaxed text-gray-700">
              Um método simples e testado (WOOP, de Gabriele Oettingen): sonhar, mas também prever o obstáculo e decidir antes o que fazer quando ele aparecer.
            </p>
          </div>
          {[
            { k: 'desejo', l: `Desejo: o que eu quero nesta semana em “${headingTitle(heading!).toLowerCase()}”?`, ph: '' },
            { k: 'resultado', l: 'Resultado: como vou me sentir se conseguir?', ph: 'Vou me sentir…' },
            { k: 'obstaculo', l: 'Obstáculo: o que, dentro de mim, pode me atrapalhar?', ph: 'Cansaço à noite, preguiça, esquecer…' },
            { k: 'plano', l: 'Plano: se esse obstáculo aparecer, então eu vou…', ph: 'Se eu estiver cansado(a), então eu vou fazer só 5 minutos.' }
          ].map((f) => (
            <label key={f.k} className="flex flex-col gap-2">
              <span className="text-[16px] font-semibold text-gray-900">{f.l}</span>
              <textarea
                value={(woop as any)[f.k]}
                onChange={(e) => setWoop({ ...woop, [f.k]: e.target.value.slice(0, 400) })}
                rows={2}
                className={input}
                placeholder={f.ph}
              />
            </label>
          ))}
        </>
      )}

      {step === 3 && rumo && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-2xl font-bold text-gray-900">As Práticas</h2>
            <p className="m-0 text-[15px] leading-relaxed text-gray-700">
              Escolha <strong>uma ou duas</strong> práticas pequenas e prenda cada uma a algo que você já faz todo dia. Pequeno e preso a uma rotina é o que vira hábito.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {rumo.practices.map((p) => {
              const c = chosen.find((x) => x.id === p.id);
              const full = !c && chosen.length >= 2;
              return (
                <div key={p.id} className={`rounded-xl border-2 p-4 flex flex-col gap-2 ${c ? 'border-purple-600 bg-purple-50/60' : 'border-gray-200'} ${full ? 'opacity-50' : ''}`}>
                  <button type="button" onClick={() => toggle(p.id)} disabled={full} className="flex items-start gap-3 text-left">
                    <span className={`w-6 h-6 mt-0.5 rounded-md border-2 grid place-items-center shrink-0 ${c ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'}`}>
                      {c && <Check className="w-4 h-4" />}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-900 first-letter:uppercase">{p.text}</span>
                      <span className="text-sm text-gray-600">{p.why}</span>
                      {p.tradition && <span className="text-sm text-amber-800">{p.tradition}</span>}
                      <span className={`text-[11px] font-semibold w-fit px-2 py-0.5 rounded-full ${p.evidence === 'forte' ? 'bg-emerald-50 text-emerald-800' : p.evidence === 'moderada' ? 'bg-amber-50 text-amber-800' : 'bg-orange-50 text-orange-800'}`}>
                        {EVIDENCE_LABEL[p.evidence]}
                      </span>
                    </span>
                  </button>
                  {c && (
                    <div className="flex flex-col gap-2 pl-9">
                      <span className="text-sm font-semibold text-gray-800">Depois de…</span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.anchors.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => setChosen(chosen.map((x) => (x.id === p.id ? { ...x, ancora: a } : x)))}
                            className={`px-3 min-h-[36px] rounded-full border text-sm ${c.ancora === a ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-gray-700'}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                      <input
                        value={c.ancora}
                        onChange={(e) => setChosen(chosen.map((x) => (x.id === p.id ? { ...x, ancora: e.target.value.slice(0, 80) } : x)))}
                        className={input}
                        aria-label="Depois de quê"
                      />
                      <p className="m-0 text-[15px] text-purple-900">
                        <strong>Depois de {c.ancora || '…'}, eu vou {p.text}.</strong>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40">
            Continuar
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext || saving}
            onClick={start}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40"
          >
            <Sailboat className="w-4 h-4" /> {saving ? 'Salvando…' : 'Zarpar'}
          </button>
        )}
      </div>
    </div>
  );
}
