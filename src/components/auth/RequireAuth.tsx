// src/components/auth/RequireAuth.tsx
// Protege páginas que exigem sessão do Supabase.
// Enquanto a sessão carrega, mostra um indicador; sem usuário, redireciona
// para /auth/login guardando a página de destino em ?next=.

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import TermsGate from '../legal/TermsGate';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [leaving, setLeaving] = useState(false);

  const sair = async () => {
    setLeaving(true);
    try {
      await signOut();
    } finally {
      router.replace('/auth/login');
    }
  };

  useEffect(() => {
    if (!loading && !user && !leaving) {
      const next = encodeURIComponent(router.asPath);
      router.replace(`/auth/login?next=${next}`);
    }
  }, [loading, user, router, leaving]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {loading ? 'Verificando sua sessão...' : 'Redirecionando para o login...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-indigo-950 text-purple-100 text-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-between gap-3">
          <Link href="/results" className="font-semibold text-white no-underline">
            NeoSapiens
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <span className="truncate text-purple-200 hidden sm:inline">{user.email}</span>
            <button
              type="button"
              onClick={sair}
              disabled={leaving}
              className="shrink-0 rounded-full border border-white/25 px-3.5 h-8 font-semibold text-white hover:bg-white/10 disabled:opacity-60"
            >
              {leaving ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        </div>
      </div>
      <TermsGate user={user}>{children}</TermsGate>
    </>
  );
}
