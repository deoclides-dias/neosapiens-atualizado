// src/pages/analysis/psychological.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Brain } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Hub
            </button>
            
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Avaliação Psicológica
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>👤 {user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-64">
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
      </div>
    </div>
  );
};

export default PsychologicalAnalysisPage;