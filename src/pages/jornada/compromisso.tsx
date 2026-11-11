// src/pages/jornada/compromisso.tsx
// Passo 2 da Primeira Jornada: o termo de compromisso, assinado com "eu concordo".

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import JornadaShell from '../../components/jornada/JornadaShell';
import useJornada from '../../hooks/useJornada';
import { COMPROMISSO_FRASES, JORNADA_VERSION, isAgreement, today } from '../../lib/jornada';
import { DISPLAY_FONT } from '../../components/traditions/ui';

export default function Compromisso() {
  const router = useRouter();
  const { user, jornada, update } = useJornada();
  const [texto, setTexto] = useState('');
  const [saving, setSaving] = useState(false);
  const qs = router.asPath.includes('?') ? router.asPath.slice(router.asPath.indexOf('?')) : '';
  const name = ((user?.user_metadata as any)?.full_name || '').trim().split(/\s+/)[0] || '';

  const sign = async () => {
    setSaving(true);
    const s = await update({ compromisso: { texto: texto.trim(), em: new Date().toISOString(), version: JORNADA_VERSION }, renovacoes: [today()] });
    setSaving(false);
    if (!s) return alert('Não foi possível salvar agora. Tente de novo.');
    router.push(`/jornada${qs}`);
  };

  return (
    <JornadaShell back={`/jornada${qs}`} backLabel="Voltar à Primeira Jornada" eyebrow="Primeira Jornada · passo 2" title="O compromisso">
      {jornada && !jornada.saber ? (
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
          <p className="m-0 text-gray-800">Antes do compromisso, leia o que você precisa saber.</p>
          <Link href={`/jornada/saber${qs}`} className="text-purple-700 font-semibold underline">
            Ir para o passo 1
          </Link>
        </div>
      ) : (
        <section className="rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-6 text-gray-900" style={{ background: '#fbf7ef' }}>
          <h2 className="m-0 text-3xl font-semibold text-center" style={{ fontFamily: DISPLAY_FONT }}>
            Termo da Primeira Jornada
          </h2>
          <p className="m-0 text-[17px] leading-relaxed" style={{ fontFamily: DISPLAY_FONT, fontSize: 21 }}>
            Eu{name ? `, ${name},` : ''} navegante do NeoSapiens, assumo comigo mesmo(a) este compromisso:
          </p>
          <ol className="m-0 pl-6 list-decimal flex flex-col gap-3" style={{ fontFamily: DISPLAY_FONT, fontSize: 20 }}>
            {COMPROMISSO_FRASES.map((f) => (
              <li key={f} className="leading-snug">
                {f}
              </li>
            ))}
          </ol>
          {jornada?.compromisso ? (
            <p className="m-0 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800 font-semibold">
              Assinado em {new Date(jornada.compromisso.em).toLocaleDateString('pt-BR')}: &quot;{jornada.compromisso.texto}&quot;
            </p>
          ) : (
            <div className="flex flex-col gap-3 border-t border-amber-200 pt-5">
              <label className="flex flex-col gap-2 text-[15px] text-gray-700">
                <span>
                  Para assinar, escreva <strong>eu concordo</strong>:
                </span>
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value.slice(0, 40))}
                  className="px-4 py-3 rounded-lg border border-amber-300 bg-white text-xl italic"
                  style={{ fontFamily: DISPLAY_FONT }}
                  placeholder="eu concordo"
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                disabled={!isAgreement(texto) || saving}
                onClick={sign}
                className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 w-full sm:w-fit"
              >
                {saving ? 'Salvando…' : 'Assinar e seguir'}
              </button>
            </div>
          )}
        </section>
      )}
    </JornadaShell>
  );
}
