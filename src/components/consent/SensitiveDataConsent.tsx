// src/components/consent/SensitiveDataConsent.tsx
// Consentimento específico e destacado para dados pessoais sensíveis
// (LGPD, art. 11, I). Mostra o formulário só depois do aceite e entrega
// o registro do consentimento para ser salvo junto com os dados.

import { ReactNode, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

/** Versão da Política de Privacidade (data de atualização em /privacidade). */
export const PRIVACY_POLICY_VERSION = '2026-10-28';

export interface ConsentRecord {
  acceptedAt: string;
  policyVersion: string;
  scope: string;
}

interface SensitiveDataConsentProps {
  /** Ex.: "informações de saúde" */
  dataLabel: string;
  /** Lista curta do que será coletado */
  items: string[];
  scope: string;
  children: (consent: ConsentRecord) => ReactNode;
}

export default function SensitiveDataConsent({ dataLabel, items, scope, children }: SensitiveDataConsentProps) {
  const [checked, setChecked] = useState(false);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);

  if (consent) return <>{children(consent)}</>;

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-xl font-bold text-gray-900">Antes de começar: seus dados sensíveis</h2>
          <p className="m-0 text-sm leading-relaxed text-gray-700">
            Esta avaliação coleta {dataLabel}, que a Lei Geral de Proteção de Dados considera dados pessoais sensíveis.
            Eles são usados só para gerar os seus resultados no NeoSapiens. Não são vendidos nem usados para publicidade.
          </p>
        </div>
      </div>

      <ul className="m-0 pl-5 list-disc text-sm text-gray-700 flex flex-col gap-1">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>

      <p className="m-0 text-sm text-gray-700">
        Os dados ficam guardados no Supabase (servidores nos Estados Unidos). Você pode pedir a exclusão a qualquer momento.
        Detalhes na{' '}
        <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-purple-700 font-semibold underline">Política de Privacidade</a>.
      </p>

      <label className="flex items-start gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 w-5 h-5 accent-purple-600 shrink-0"
        />
        <span className="text-sm text-gray-900">
          Concordo com a coleta e o uso das minhas {dataLabel} para gerar os meus resultados, nos termos da Política de Privacidade.
        </span>
      </label>

      <button
        type="button"
        disabled={!checked}
        onClick={() => setConsent({ acceptedAt: new Date().toISOString(), policyVersion: PRIVACY_POLICY_VERSION, scope })}
        className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar para a avaliação
      </button>
    </div>
  );
}
