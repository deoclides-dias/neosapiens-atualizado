// src/pages/onboarding.tsx
// Rota legada: o fluxo de onboarding foi consolidado no hub /analysis.
// Mantida apenas para redirecionar links antigos.

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/analysis');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecionando para a Central de Análises...</p>
      </div>
    </div>
  );
}
