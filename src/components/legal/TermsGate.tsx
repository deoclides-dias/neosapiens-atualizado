// src/components/legal/TermsGate.tsx
// Aceite dos Termos de Uso e da Política de Privacidade para quem entrou
// sem a caixa do cadastro (login com Google, contas antigas) ou quando a
// versão muda. Guarda versão e data no user_metadata do Supabase.

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LEGAL_VERSION, LEGAL_VERSION_LABEL, termsAccepted } from '../../lib/legal';

export default function TermsGate({ user, children }: { user: User; children: ReactNode }) {
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hadOld = Boolean((user.user_metadata as any)?.termos);

  if (done || termsAccepted(user.user_metadata)) return <>{children}</>;

  const accept = async () => {
    setSaving(true);
    setError(null);
    const { error: e } = await supabase.auth.updateUser({ data: { termos: { version: LEGAL_VERSION, acceptedAt: new Date().toISOString() } } });
    setSaving(false);
    if (e) setError('Não foi possível registrar o aceite. Tente novamente.');
    else setDone(true);
  };

  return (
    <div className="min-h-[calc(100vh-44px)] bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-12 flex items-start sm:items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-xl font-bold text-gray-900">{hadOld ? 'Atualizamos os nossos termos' : 'Antes de continuar'}</h1>
            <p className="m-0 text-sm leading-relaxed text-gray-700">
              {hadOld
                ? `Os Termos de Uso e a Política de Privacidade ganharam uma versão nova (${LEGAL_VERSION_LABEL}). Leia com calma e confirme para seguir.`
                : `Para usar o NeoSapiens, precisamos que você leia e aceite os Termos de Uso e a Política de Privacidade (versão de ${LEGAL_VERSION_LABEL}).`}
            </p>
          </div>
        </div>
        <ul className="m-0 pl-5 list-disc text-sm text-gray-700 flex flex-col gap-1">
          <li>O NeoSapiens é uma bússola para reflexão, não faz diagnóstico de saúde.</li>
          <li>As tradições aparecem sempre separadas da ciência e não são científicas.</li>
          <li>Os seus dados não são vendidos nem usados para publicidade, e você pode pedir a exclusão quando quiser.</li>
        </ul>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link href="/termos" target="_blank" className="text-purple-700 font-semibold underline">
            Ler os Termos de Uso
          </Link>
          <Link href="/privacidade" target="_blank" className="text-purple-700 font-semibold underline">
            Ler a Política de Privacidade
          </Link>
        </div>
        <label className="flex items-start gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 w-5 h-5 accent-purple-600 shrink-0" />
          <span className="text-sm text-gray-900">Tenho 18 anos ou mais e li e aceito os Termos de Uso e a Política de Privacidade.</span>
        </label>
        {error && <p className="m-0 text-sm text-red-700">{error}</p>}
        <button
          type="button"
          disabled={!checked || saving}
          onClick={accept}
          className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Registrando…' : 'Aceitar e continuar'}
        </button>
      </div>
    </div>
  );
}
