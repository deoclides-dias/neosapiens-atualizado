// src/pages/analysis/psychological.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Brain } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import { useAuth } from '../../hooks/useAuth';
import PsychologicalForm from '../../components/onboarding/PsychologicalForm';

const PsychologicalAnalysisPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: any) => {
    if (!user?.id) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('💾 Salvando dados psicológicos:', data);

      // Gravação centralizada em useAnalysisProgress (atualiza ou cria a linha)
      const success = await markAnalysisComplete('psychological', data);
      if (!success) {
        throw new Error('Falha ao salvar no Supabase');
      }

      router.push('/analysis');
    } catch (error) {
      console.error('❌ Erro ao salvar dados psicológicos:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/analysis');
  };

  // Verificar autenticação
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <FormCard className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para acessar esta página.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Fazer Login
          </button>
        </div>
        </FormCard>
      </div>
    );
  }

  return (
    <AnalysisLayout
      title="Avaliação Psicológica"
      subtitle="Big Five & Padrões Mentais"
      icon={<Brain className="w-5 h-5" />}
      rightSlot={<span className="hidden md:inline">{user.email}</span>}
    >
      <FormCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Salvando sua avaliação psicológica...</p>
            </div>
          </div>
        ) : (
          <PsychologicalForm
            onComplete={handleComplete}
          />
        )}
      </FormCard>
    </AnalysisLayout>
  );
};

export default PsychologicalAnalysisPage;