// src/components/auth/InAppBrowserNotice.tsx
// Aviso exibido no login quando a página está dentro do WhatsApp, Instagram etc.

import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { chromeIntentUrl, InAppInfo } from '../../utils/inAppBrowser';

export default function InAppBrowserNotice({ info }: { info: InAppInfo }) {
  const [copied, setCopied] = useState(false);
  const where = info.app ? `no navegador do ${info.app}` : 'no navegador interno de um aplicativo';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="m-0 font-semibold">Você está {where}.</p>
      <p className="mt-1 mb-3">
        O Google não permite entrar por aqui. Abra o NeoSapiens no seu navegador
        {info.platform === 'ios' ? ' (Safari)' : info.platform === 'android' ? ' (Chrome)' : ''} para usar "Continuar com Google".
        O login com e-mail e senha funciona normalmente.
      </p>

      {info.platform === 'android' && (
        <a
          href={chromeIntentUrl(window.location.href)}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700"
        >
          <ExternalLink className="w-4 h-4" /> Abrir no Chrome
        </a>
      )}

      {info.platform === 'ios' && (
        <p className="m-0 mb-3">
          Toque no menu <strong>⋯</strong> ou no ícone de compartilhar e escolha <strong>Abrir no Safari</strong>
          {info.app === 'WhatsApp' ? ' (ou "Abrir no navegador")' : ''}.
        </p>
      )}

      <button
        type="button"
        onClick={copy}
        className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-amber-400 font-semibold hover:bg-amber-100 ${info.platform === 'android' ? 'ml-2' : ''}`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Link copiado' : 'Copiar link'}
      </button>
    </div>
  );
}
