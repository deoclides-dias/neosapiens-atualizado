// src/components/legal/ResearchConsentCard.tsx
// Autorização opcional (desmarcada) para usar as respostas, anonimizadas e
// agregadas, em pesquisa. Fica no fim do Mapa NeoSapiens e pode ser mudada.

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LEGAL_VERSION } from '../../lib/legal';

export default function ResearchConsentCard({ user }: { user: User }) {
  const saved = (user.user_metadata as any)?.pesquisa;
  const [ok, setOk] = useState<boolean>(Boolean(saved?.ok));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const change = async (v: boolean) => {
    setOk(v);
    setStatus('saving');
    const { error } = await supabase.auth.updateUser({ data: { pesquisa: { ok: v, version: LEGAL_VERSION, at: new Date().toISOString() } } });
    setStatus(error ? 'error' : 'saved');
    if (error) setOk(!v);
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/5 p-5 flex flex-col gap-3 text-purple-50">
      <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">Opcional · pesquisa</p>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={ok}
          disabled={status === 'saving'}
          onChange={(e) => change(e.target.checked)}
          className="mt-0.5 w-5 h-5 accent-purple-400 shrink-0"
        />
        <span className="text-sm leading-relaxed">
          Autorizo o uso das minhas respostas, de forma anonimizada e junto com as de outras pessoas, para pesquisas que melhorem o NeoSapiens. Ninguém poderá
          me identificar.
        </span>
      </label>
      <p className="m-0 text-xs text-purple-200">
        {status === 'saving' && 'Salvando…'}
        {status === 'saved' && (ok ? 'Obrigado! Você pode desmarcar quando quiser.' : 'Pronto: suas respostas servem só para os seus resultados.')}
        {status === 'error' && 'Não foi possível salvar. Tente novamente.'}
        {status === 'idle' && (
          <>
            Sem esta autorização, suas respostas servem só para os seus resultados. Veja a{' '}
            <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline text-purple-100">
              Política de Privacidade
            </a>
            .
          </>
        )}
      </p>
    </section>
  );
}
