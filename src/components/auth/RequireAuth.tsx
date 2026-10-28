// src/components/auth/RequireAuth.tsx
// Protege páginas que exigem sessão do Supabase.
// Enquanto a sessão carrega, mostra um indicador; sem usuário, redireciona
// para /auth/login guardando a página de destino em ?next=.

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(router.asPath);
      router.replace(`/auth/login?next=${next}`);
    }
  }, [loading, user, router]);

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

  return <>{children}</>;
}
