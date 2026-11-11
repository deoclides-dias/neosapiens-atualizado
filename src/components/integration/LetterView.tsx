// src/components/integration/LetterView.tsx
// A Carta ao Navegante: envelope com lacre → convite → carta aberta.
// Tudo montado por regras (lib/integration/letter.ts); cada frase sobre a
// pessoa tem um "por que dizemos isso?" com o número de onde veio.

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ELEMENT_HAN } from '../../lib/astro';
import { ELEMENT_MEANING, Letter, listPt } from '../../lib/integration/letter';
import { DISPLAY_FONT } from '../traditions/ui';

const PAPER = '#fbf7ee';
const INK = '#2b2340';
const SEAL = '#9f1239';

function Seal({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <radialGradient id="seal-g" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor={SEAL} />
        </radialGradient>
      </defs>
      <path d="M40 4 L48 10 L58 8 L62 18 L72 22 L70 32 L76 40 L70 48 L72 58 L62 62 L58 72 L48 70 L40 76 L32 70 L22 72 L18 62 L8 58 L10 48 L4 40 L10 32 L8 22 L18 18 L22 8 L32 10 Z" fill="url(#seal-g)" />
      <circle cx="40" cy="40" r="22" fill="none" stroke="#fecdd3" strokeOpacity={0.7} strokeWidth={1.5} />
      {/* bússola */}
      <path d="M40 22 L44 40 L40 58 L36 40 Z" fill="#fff1f2" opacity={0.95} />
      <path d="M22 40 L40 36 L58 40 L40 44 Z" fill="#fecdd3" opacity={0.75} />
      <circle cx="40" cy="40" r="2.5" fill={SEAL} />
    </svg>
  );
}

function Ship() {
  return (
    <svg width="54" height="34" viewBox="0 0 54 34" aria-hidden="true">
      <path d="M4 24 H50 L44 32 H10 Z" fill={INK} opacity={0.85} />
      <path d="M27 2 V24" stroke={INK} strokeWidth={1.6} />
      <path d="M27 4 L44 20 H27 Z" fill={INK} opacity={0.35} />
      <path d="M27 6 L14 20 H27 Z" fill={INK} opacity={0.2} />
    </svg>
  );
}

function Why({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-1.5 text-[13px]">
      <summary className="cursor-pointer list-none inline-flex items-center gap-1 text-purple-700 font-semibold">
        por que dizemos isso? <span className="group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="mt-2 rounded-lg border border-purple-200/70 bg-white/70 p-3 text-gray-700 flex flex-col gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </div>
    </details>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200">
        <div className="h-1.5 rounded-full" style={{ width: `${Math.max(3, value)}%`, background: color }} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-100/70 rounded-full px-2 py-0.5 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{children}</span>;
}

export default function LetterView({
  letter,
  firstName,
  onFeedback,
  initialFeedback
}: {
  letter: Letter;
  firstName: string;
  onFeedback: (resposta: string, texto: string) => Promise<boolean>;
  initialFeedback?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [resposta, setResposta] = useState<string | null>(initialFeedback ?? null);
  const [texto, setTexto] = useState('');
  const [sent, setSent] = useState(Boolean(initialFeedback));
  const [saving, setSaving] = useState(false);
  const { strengths, central, lever, bridge, headings, psique } = letter;
  const voo = (rumo: string, area?: string) => `/jornada?rumo=${encodeURIComponent(rumo)}${area ? `&area=${encodeURIComponent(area)}` : ''}`;

  const send = async () => {
    if (!resposta) return;
    setSaving(true);
    const ok = await onFeedback(resposta, texto.trim());
    setSaving(false);
    if (ok) setSent(true);
  };

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Envelope */}
        <div className="relative w-full max-w-[420px] aspect-[3/2] rounded-xl shadow-2xl overflow-hidden" style={{ background: '#f3ead6' }}>
          <svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0 L150 112 L300 0" fill="#e9dcc0" stroke="#d6c39c" strokeWidth={1.5} />
            <path d="M0 200 L120 96 M300 200 L180 96" stroke="#d6c39c" strokeWidth={1.5} />
          </svg>
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-10">
            <Seal />
          </div>
          <p className="absolute bottom-3 left-0 right-0 text-center text-sm italic m-0" style={{ fontFamily: DISPLAY_FONT, color: INK }}>
            Ao Navegante{firstName ? ` ${firstName}` : ''}
          </p>
        </div>

        <div className="max-w-[560px] flex flex-col gap-3 text-center">
          <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
            Navegante, você olhou para dentro com coragem.
          </h2>
          <p className="m-0 text-[15px] leading-relaxed text-purple-100">
            Respondeu sobre o seu corpo, a sua mente, o seu jeito de ser e o que dá sentido à sua vida. Até aqui, o NeoSapiens só segurou o espelho: os números são seus,
            e a leitura também.
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-purple-100">
            Agora, se você quiser, podemos dizer o que <strong className="text-white">nós</strong> vemos nesse mapa: as suas forças, o ponto onde você parece travar e
            por onde talvez valha começar. É uma leitura, não uma sentença. Você vai poder dizer se ela faz sentido.
          </p>
        </div>
        <div className="flex justify-center w-full max-w-[560px]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto sm:px-12 min-h-[52px] rounded-xl font-semibold text-white shadow-lg hover:brightness-110"
            style={{ background: SEAL }}
          >
            Ler a Carta
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      className="relative rounded-2xl shadow-2xl px-5 sm:px-12 py-10 sm:py-14 flex flex-col gap-7 animate-[carta_0.7s_ease-out]"
      style={{ background: PAPER, color: INK, fontFamily: DISPLAY_FONT }}
    >
      <style jsx>{`
        @keyframes carta {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          article {
            animation: none !important;
          }
        }
      `}</style>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <Seal size={64} />
      </div>
      <p className="m-0 text-2xl sm:text-3xl font-semibold">Ao Navegante{firstName ? ` ${firstName}` : ''},</p>

      {/* O que vemos em você */}
      <section className="flex flex-col gap-5 text-[19px] leading-relaxed">
        {strengths.length > 0 && (
          <div>
            <p className="m-0">
              O que mais se destaca no seu mapa é <strong>{listPt(strengths.map((s) => s.label.toLowerCase()))}</strong>. Isso não é pouco: é a parte de você que já funciona e
              que pode puxar o resto.
            </p>
            <Why>
              {strengths.map((s) => (
                <Bar key={s.id} label={`${s.label} · ${s.from}`} value={s.value as number} color="#059669" />
              ))}
            </Why>
          </div>
        )}

        {central && (
          <div>
            <p className="m-0">
              O ponto onde você parece travar é <strong>{central.axis.toLowerCase()}</strong>. {central.detail} Essa distância não é defeito: é o lugar onde mora a sua
              maior vontade de mudar.
            </p>
            <Why>
              <Bar label={central.wantLabel} value={central.want} color="#d97706" />
              <Bar label={central.isLabel} value={central.is} color="#7c3aed" />
              <span className="text-xs text-gray-500">Do radar das contradições, no Mapa NeoSapiens (módulo {central.module}).</span>
            </Why>
          </div>
        )}

        {lever && (
          <div>
            <p className="m-0">
              Se fosse para mexer em uma coisa só, o seu mapa aponta para <strong>{lever.node.label.toLowerCase()}</strong>. Esse ponto está ligado a{' '}
              {lever.neighbors.length} outras áreas da sua vida, e cuidar dele costuma mover todas juntas.
            </p>
            <Why>
              {[lever.node, ...lever.neighbors].map((n) =>
                n.value !== null ? <Bar key={n.id} label={`${n.label} · ${n.from}`} value={n.value} color={n.value >= 70 ? '#059669' : n.value >= 45 ? '#d97706' : '#e11d48'} /> : null
              )}
              <span className="text-xs text-gray-500">Da rede de ressonâncias: o ponto com mais ligações de efeito cascata ou tensão.</span>
            </Why>
          </div>
        )}

        {bridge && (
          <div>
            <p className="m-0">
              E um detalhe curioso: no elemento <strong>{bridge.element}</strong> ({ELEMENT_HAN[bridge.element]}), a ciência e as tradições chegaram ao mesmo lugar por
              caminhos diferentes. Vale olhar com carinho para o que ele representa: {ELEMENT_MEANING[bridge.element]}.
            </p>
            <Why>
              <span>Tradições que o citam: {bridge.traditionSources.join(', ')}.</span>
              {bridge.science !== null && <Bar label="Média das medidas ligadas a ele" value={bridge.science} color="#7c3aed" />}
              <span className="text-xs text-gray-500">Da Ponte, no Mapa NeoSapiens. Não é um resultado científico: é uma conversa entre duas leituras.</span>
            </Why>
          </div>
        )}
      </section>

      {/* Os outros olhares (Mapa da Psique) */}
      {psique && (
        <>
        <div className="flex items-center gap-3 text-purple-300" aria-hidden="true">
          <span className="flex-1 h-px bg-current" /> ✦ <span className="flex-1 h-px bg-current" />
        </div>
        <section className="flex flex-col gap-6 text-[18px] leading-relaxed">
          <h3 className="m-0 text-2xl sm:text-3xl font-semibold">Os outros olhares</h3>
          {psique.dever && (
            <div>
              <p className="m-0">
                Quando você respondeu pensando em como <em>deveria</em> ser, a maior distância apareceu em <strong>{psique.dever.trait.toLowerCase()}</strong>: você sente que
                deveria ter {psique.dever.dever > psique.dever.today ? 'bem mais' : 'bem menos'} do que se reconhece hoje. Vale perguntar de quem é essa régua, e se ela
                ainda serve a você.
              </p>
              <Why>
                <Bar label="Hoje" value={psique.dever.today} color="#7c3aed" />
                <Bar label="Como acha que deveria ser" value={psique.dever.dever} color="#64748b" />
                <span className="text-xs text-gray-500">
                  Mini-IPIP respondido duas vezes. Higgins (1987): a distância da régua do dever costuma vir com culpa e ansiedade. Só citamos diferenças de 16 pontos ou mais.
                </span>
              </Why>
            </div>
          )}
          {psique.blind && (
            <div>
              <p className="m-0">
                {psique.blind.modo === 'com_alguem' ? (
                  <>
                    {psique.blind.relacao ? <>Segundo {psique.blind.relacao}</> : <>Segundo quem respondeu com você</>}, você tem{' '}
                    {psique.blind.other > psique.blind.self ? 'mais' : 'menos'} <strong>{psique.blind.trait.toLowerCase()}</strong> do que você mesmo enxerga.
                  </>
                ) : (
                  <>
                    Você imagina que os outros veem {psique.blind.other > psique.blind.self ? 'mais' : 'menos'} <strong>{psique.blind.trait.toLowerCase()}</strong> em você
                    do que você mesmo enxerga.
                  </>
                )}{' '}
                Nenhum dos dois olhares está certo sozinho: a diferença é só um convite para conversar.
              </p>
              <Why>
                <Bar label="Como você se vê" value={psique.blind.self} color="#7c3aed" />
                <Bar label={psique.blind.modo === 'com_alguem' ? 'Como o outro vê você' : 'Como acha que os outros veem'} value={psique.blind.other} color="#9ca3af" />
                <span className="text-xs text-gray-500">Janela de Johari (Luft e Ingham, 1955), com as mesmas 20 frases. Só citamos diferenças de 16 pontos ou mais.</span>
              </Why>
            </div>
          )}
          {!psique.dever && !psique.blind && (psique.missing.dever || psique.missing.outro) && (
            <p className="m-0">
              Ainda faltam dois olhares sobre você: como acha que deveria ser e como os outros veem você.{' '}
              <Link href="/analysis/psique" className="text-purple-800 underline">
                Responder agora
              </Link>
              .
            </p>
          )}
          {psique.compass && (
            <div>
              <Tag>uma pergunta do seu mapa natal · reflexão</Tag>
              <p className="m-0 italic">{psique.compass.text}</p>
              <p className="m-0 mt-2 text-base text-gray-700">
                Ela vem da pergunta “{psique.compass.question}”, no{' '}
                <Link href="/results/psique" className="text-purple-800 underline">
                  Mapa da Psique
                </Link>
                . O símbolo não responde: ele só pergunta.
              </p>
            </div>
          )}
        </section>
        </>
      )}

      <div className="flex items-center gap-3 text-purple-300" aria-hidden="true">
        <span className="flex-1 h-px bg-current" /> ✦ <span className="flex-1 h-px bg-current" />
      </div>

      {/* A luta que todos travamos */}
      <section className="flex flex-col gap-6 text-[18px] leading-relaxed">
        <h3 className="m-0 text-2xl sm:text-3xl font-semibold">A luta que todos travamos</h3>
        <div>
          <Tag>uma ideia de Jung · reflexão</Tag>
          <p className="m-0">
            O psiquiatra Carl Jung chamou de <strong>sombra</strong> as partes de nós que não reconhecemos, ou que preferimos não ver: vontades, medos e impulsos que agem
            por baixo, mesmo quando decidimos o contrário. Para Jung, a sombra não é inimiga. Ela só fica mais forte quando fingimos que não existe.
          </p>
          {central && (
            <p className="m-0 mt-3">
              O desencontro que o seu mapa mostrou em <strong>{central.axis.toLowerCase()}</strong> talvez seja um retrato dessa sombra: o lugar onde a sua vontade diz uma
              coisa e os seus dias fazem outra.
            </p>
          )}
        </div>
        <div>
          <Tag>a herança dos instintos · ciência</Tag>
          <p className="m-0">
            O nosso cérebro foi moldado ao longo de centenas de milhares de anos num mundo de escassez, onde guardar energia, comer doce e gordura e ficar atento a qualquer
            ameaça significava sobreviver. Hoje vivemos cercados de comida fácil, sofá e telas que nunca acabam, e aqueles mesmos instintos continuam puxando com força. Os
            pesquisadores chamam isso de <strong>desajuste evolutivo</strong>. Por isso a luta é difícil para todo mundo. Não é fraqueza de caráter: é herança.
          </p>
        </div>
        <div>
          <Tag>perdoar-se para mudar · ciência</Tag>
          <p className="m-0">
            Parece contraintuitivo, mas a pesquisa mostra que bater em si mesmo não ajuda a mudar. Em experimentos da Universidade da Califórnia, pessoas que trataram um
            erro com <strong>autocompaixão</strong> (gentileza consigo, lembrar que errar é humano, olhar o erro sem drama) se dedicaram <em>mais</em> a melhorar do que as
            que só tentaram levantar a autoestima.
          </p>
          <p className="m-0 mt-3">
            Então, antes de tudo: perdoe-se por ser movido por essas forças. Todos somos. O navegante que se perdoa volta ao leme mais rápido do que o que se pune.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3 text-purple-300" aria-hidden="true">
        <span className="flex-1 h-px bg-current" /> ✦ <span className="flex-1 h-px bg-current" />
      </div>

      {/* O que sugerimos */}
      {headings.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="m-0 text-2xl sm:text-3xl font-semibold">O que sugerimos</h3>
          <p className="m-0 text-[18px] leading-relaxed">Com tudo isso, este é o caminho que o seu mapa sugere, do mais forte para o mais leve:</p>
          <div className="flex flex-col gap-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {headings.map((h, i) => (
              <Link
                key={`${h.rumo}-${h.area ?? ''}`}
                href={voo(h.rumo, h.area)}
                className="flex items-start gap-3 rounded-xl border border-purple-200 bg-white/80 hover:bg-white hover:border-purple-400 p-4 no-underline transition-colors"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center text-white text-sm font-bold shrink-0" style={{ background: i === 0 ? SEAL : '#7c3aed' }}>
                  {i + 1}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">{h.title}</span>
                  {h.reasons[0] && <span className="text-sm text-gray-600">{h.reasons[0]}</span>}
                </span>
                <span className="ml-auto text-purple-600 self-center" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
          <p className="m-0 text-[18px] leading-relaxed">
            Você não precisa fazer tudo. Escolha um, por sete dias, e veja o que acontece. A bússola aponta; o timoneiro é você.
          </p>
        </section>
      )}

      <div className="flex items-center gap-3 text-purple-300" aria-hidden="true">
        <span className="flex-1 h-px bg-current" /> ✦ <span className="flex-1 h-px bg-current" />
      </div>

      {/* Uma palavra final */}
      <section className="flex flex-col gap-3 text-[18px] leading-relaxed">
        <h3 className="m-0 text-2xl sm:text-3xl font-semibold">Uma palavra final</h3>
        <p className="m-0">
          Esta carta seguiu procedimentos técnicos e, no que cabe, científicos, com cada regra à vista. Ainda assim, não cabe ao NeoSapiens interpretar quem você é, nem
          quem quer que seja. Se você viu semelhanças entre os números, os símbolos e a sua vida, elas são suas para pensar.
        </p>
        <p className="m-0 text-xl font-semibold">Nada nem ninguém nos define. É o propósito que nos guia.</p>
      </section>

      <div className="flex flex-col items-end gap-1 pt-2">
        <Ship />
        <p className="m-0 text-xl italic">— A tripulação do NeoSapiens</p>
      </div>

      {/* Isso faz sentido? */}
      <section className="rounded-2xl bg-white/80 border border-purple-200 p-5 flex flex-col gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className="m-0 font-semibold text-gray-900">Esta leitura foi feita a partir dos seus números, mas quem conhece a sua vida é você. Ela faz sentido?</p>
        {sent ? (
          <p className="m-0 text-sm text-emerald-700">Obrigado por responder. A sua resposta ajuda o NeoSapiens a ler melhor cada navegante.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Faz muito sentido', 'Em parte', 'Não me reconheço'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResposta(r)}
                  aria-pressed={resposta === r}
                  className="min-h-[44px] rounded-lg border text-sm font-semibold"
                  style={resposta === r ? { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed' } : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="(opcional) O que nós não vimos?"
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm"
            />
            <button
              type="button"
              disabled={!resposta || saving}
              onClick={send}
              className="min-h-[44px] rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 w-full sm:w-fit sm:px-6"
            >
              {saving ? 'Enviando…' : 'Enviar'}
            </button>
          </>
        )}
      </section>
    </article>
  );
}
