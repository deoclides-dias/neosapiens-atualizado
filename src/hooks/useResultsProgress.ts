import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export interface ResultsProgress {
  astrologyComplete: boolean;
  biohackingComplete: boolean;
  psychologicalComplete: boolean;
  cognitiveComplete: boolean;
  integratedComplete: boolean;
  overallProgress: number;
  availableResults: string[];
}

function useResultsProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ResultsProgress>({
    astrologyComplete: false,
    biohackingComplete: false,
    psychologicalComplete: false,
    cognitiveComplete: false,
    integratedComplete: false,
    overallProgress: 0,
    availableResults: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResultsProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Carregando resultados para user:', user.id);
      
      const { data: onboardingArray, error: onboardingError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (onboardingError) {
        console.warn('⚠️ Erro ao buscar onboarding:', onboardingError);
      }

      const onboardingData = onboardingArray && onboardingArray.length > 0 ? onboardingArray[0] : null;

      const { data: traditionsData, error: traditionsError } = await supabase
        .from('traditions_analysis')
        .select('*')
        .eq('user_id', user.id);

      if (traditionsError) {
        console.warn('⚠️ Erro ao buscar tradições:', traditionsError);
      }

      console.log('📊 Dados encontrados:', {
        onboardingData: !!onboardingData,
        traditionsCount: traditionsData?.length || 0
      });

      // A tabela traditions_analysis ainda não existe no banco; a análise
      // astrológica é calculada na hora a partir de birth_data.
      const astrologyComplete = Boolean(onboardingData?.birth_data_complete);
      
      const biohackingComplete = Boolean(
        onboardingData?.biohacking_data_complete
      );
      
      const psychologicalComplete = Boolean(
        onboardingData?.psychological_data_complete
      );
      
      const cognitiveComplete = Boolean(
        onboardingData?.cognitive_data_complete
      );

      const completedModules = [
        astrologyComplete,
        biohackingComplete, 
        psychologicalComplete,
        cognitiveComplete
      ].filter(Boolean).length;

      const integratedComplete = completedModules >= 2;

      const availableResults: string[] = [];
      if (astrologyComplete) availableResults.push('astrology');
      if (biohackingComplete) availableResults.push('biohacking');
      if (psychologicalComplete) availableResults.push('psychological');
      if (cognitiveComplete) availableResults.push('cognitive');
      if (integratedComplete) availableResults.push('integrated');

      const overallProgress = Math.round(
        (availableResults.length / 5) * 100
      );

      console.log('✅ Progresso resultados calculado:', {
        astrologyComplete,
        biohackingComplete,
        psychologicalComplete,
        cognitiveComplete,
        integratedComplete,
        overallProgress,
        availableResults
      });

      setProgress({
        astrologyComplete,
        biohackingComplete,
        psychologicalComplete,
        cognitiveComplete,
        integratedComplete,
        overallProgress,
        availableResults
      });

      setError(null);

    } catch (err) {
      console.error('❌ Erro ao carregar resultados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      setProgress({
        astrologyComplete: false,
        biohackingComplete: false,
        psychologicalComplete: false,
        cognitiveComplete: false,
        integratedComplete: false,
        overallProgress: 0,
        availableResults: []
      });
    } finally {
      setLoading(false);
    }
  };

  const markResultViewed = async (resultType: string): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log(`👁️ Marcando ${resultType} como visualizado...`);

      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          [`${resultType}_result_viewed`]: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('⚠️ Erro ao marcar visualizado:', error);
        return false;
      }
      
      await loadResultsProgress();
      return true;
      
    } catch (err) {
      console.error(`❌ Erro ao marcar ${resultType}:`, err);
      return false;
    }
  };

  const isResultAvailable = (resultType: string): boolean => {
    return progress.availableResults.includes(resultType);
  };

  const getNextRecommendedResult = (): string | null => {
    const priorities = ['astrology', 'psychological', 'biohacking', 'cognitive', 'integrated'];
    
    for (const result of priorities) {
      if (isResultAvailable(result)) {
        return result;
      }
    }
    
    return null;
  };

  useEffect(() => {
    if (user?.id) {
      console.log('👤 Usuário detectado, carregando resultados...');
      loadResultsProgress();
    } else {
      console.log('👤 Sem usuário, resetando resultados...');
      setProgress({
        astrologyComplete: false,
        biohackingComplete: false,
        psychologicalComplete: false,
        cognitiveComplete: false,
        integratedComplete: false,
        overallProgress: 0,
        availableResults: []
      });
      setLoading(false);
    }
  }, [user?.id]);

  return {
    progress,
    loading,
    error,
    loadResultsProgress,
    markResultViewed,
    isResultAvailable,
    getNextRecommendedResult,
    hasAnyResults: progress.availableResults.length > 0,
    canAccessIntegrated: progress.integratedComplete
  };
}

export default useResultsProgress;