// =============================================================================
// ANALYSIS PROGRESS HOOK - VERSÃO COMPLETA COM COGNITIVE
// =============================================================================
// Hook: Controle de progresso das 4 análises do NeoSapiens
// Versão: 2.0 (com Cognitive integrado)
// Data: 2025-01-03

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

interface AnalysisProgress {
  birth: { 
    completed: boolean; 
    completedAt?: Date; 
    data?: any 
  };
  biohacking: { 
    completed: boolean; 
    completedAt?: Date; 
    data?: any 
  };
  psychological: { 
    completed: boolean; 
    completedAt?: Date; 
    data?: any 
  };
  cognitive: { 
    completed: boolean; 
    completedAt?: Date; 
    data?: any 
  };
  overallProgress: number;
  canAccessResults: boolean;
}

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

function useAnalysisProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AnalysisProgress>({
    birth: { completed: false },
    biohacking: { completed: false },
    psychological: { completed: false },
    cognitive: { completed: false },
    overallProgress: 0,
    canAccessResults: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // MÉTODO: CARREGAR PROGRESSO
  // ===========================================================================
  
  const loadProgress = async () => {
    if (!user?.id) return;

    setLoading(true);
    
    try {
      console.log('🔍 Carregando progresso para user:', user.id);

      const { data: arrayData, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('⚠️ Erro ao carregar:', error);
        throw error;
      }

      const onboardingData = arrayData && arrayData.length > 0 ? arrayData[0] : null;

      if (!onboardingData) {
        console.log('📝 Nenhum progresso encontrado, criando inicial...');
        
        setProgress({
          birth: { completed: false },
          biohacking: { completed: false },
          psychological: { completed: false },
          cognitive: { completed: false },
          overallProgress: 0,
          canAccessResults: false
        });
        
        setLoading(false);
        return;
      }

      console.log('📊 Registro encontrado:', onboardingData);

      // Parse dos dados JSON se existir
      let dataJson: any = {};
      if (onboardingData.data && typeof onboardingData.data === 'object') {
        dataJson = onboardingData.data;
      }

      // ✅ DETECÇÃO BIRTH
      const birthCompleted = Boolean(
        onboardingData.birth_data_complete || 
        dataJson.birth ||
        (dataJson.fullName && dataJson.birthDate)
      );

      // ✅ DETECÇÃO BIOHACKING
      const biohackingCompleted = Boolean(
        onboardingData.biohacking_data_complete || 
        dataJson.biohacking ||
        (dataJson.sleep && dataJson.nutrition)
      );

      // ✅ DETECÇÃO PSYCHOLOGICAL
      const psychologicalCompleted = Boolean(
        onboardingData.psychological_data_complete || 
        dataJson.psychological ||
        (dataJson.bigFive && dataJson.workStyle)
      );

      // ✅ DETECÇÃO COGNITIVE - NOVA!
      const cognitiveCompleted = Boolean(
        onboardingData.cognitive_data_complete || 
        dataJson.cognitive ||
        (dataJson.learningStyles && dataJson.processingStyles) ||
        (dataJson.visual_learning && dataJson.creative_thinking)
      );

      // ✅ CALCULAR PROGRESSO GERAL (4 análises)
      const completedCount = [
        birthCompleted,
        biohackingCompleted, 
        psychologicalCompleted,
        cognitiveCompleted
      ].filter(Boolean).length;

      const overallProgress = Math.round((completedCount / 4) * 100);
      const canAccessResults = completedCount === 4;

      console.log('✅ Progresso calculado:', {
        birthCompleted,
        biohackingCompleted, 
        psychologicalCompleted,
        cognitiveCompleted,
        overallProgress,
        canAccessResults
      });

      // Atualizar estado
      setProgress({
        birth: {
          completed: birthCompleted,
          completedAt: birthCompleted ? new Date(onboardingData.updated_at) : undefined,
          data: birthCompleted ? dataJson.birth || { completed: true } : undefined
        },
        biohacking: {
          completed: biohackingCompleted,
          completedAt: biohackingCompleted ? new Date(onboardingData.updated_at) : undefined,
          data: biohackingCompleted ? dataJson.biohacking || { completed: true } : undefined
        },
        psychological: {
          completed: psychologicalCompleted,
          completedAt: psychologicalCompleted ? new Date(onboardingData.updated_at) : undefined,
          data: psychologicalCompleted ? dataJson.psychological || { completed: true } : undefined
        },
        cognitive: {
          completed: cognitiveCompleted,
          completedAt: cognitiveCompleted ? new Date(onboardingData.updated_at) : undefined,
          data: cognitiveCompleted ? dataJson.cognitive || { completed: true } : undefined
        },
        overallProgress,
        canAccessResults
      });

      setError(null);

    } catch (err) {
      console.error('❌ Erro ao carregar progresso:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      setProgress({
        birth: { completed: false },
        biohacking: { completed: false },
        psychological: { completed: false },
        cognitive: { completed: false },
        overallProgress: 0,
        canAccessResults: false
      });
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================
  // MÉTODO: MARCAR ANÁLISE COMO COMPLETA
  // ===========================================================================
  
  const markAnalysisComplete = async (
    analysisType: 'birth' | 'biohacking' | 'psychological' | 'cognitive',
    data: any
  ): Promise<boolean> => {
    if (!user) {
      console.warn('⚠️ Usuário não logado');
      return false;
    }

    try {
      console.log(`💾 Marcando ${analysisType} como completo...`);

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      switch (analysisType) {
        case 'birth':
          updateData.birth_data_complete = true;
          updateData.birth_data = data;
          break;
        case 'biohacking':
          updateData.biohacking_data_complete = true;
          updateData.biohacking_data = data;
          break;
        case 'psychological':
          updateData.psychological_data_complete = true;
          updateData.psychological_data = data;
          break;
        case 'cognitive':
          updateData.cognitive_data_complete = true;
          updateData.cognitive_data = data;
          break;
      }

      // Buscar a linha do usuário (não há UNIQUE em user_id, então pegamos a mais recente)
      const { data: existing, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.warn('⚠️ Erro ao buscar progresso:', fetchError);
        throw fetchError;
      }

      // UPDATE sozinho não cria linha: para usuário novo ele afeta 0 linhas
      // e não retorna erro. Por isso atualizamos pelo id ou inserimos.
      const { error } = existing && existing.length > 0
        ? await supabase
            .from('onboarding_progress')
            .update(updateData)
            .eq('id', existing[0].id)
        : await supabase
            .from('onboarding_progress')
            .insert({ user_id: user.id, ...updateData });

      if (error) {
        console.warn('⚠️ Erro ao salvar progresso:', error);
        throw error;
      }

      console.log(`✅ ${analysisType} atualizado com sucesso`);
      await loadProgress();
      return true;

    } catch (err) {
      console.error(`❌ Erro ao marcar ${analysisType}:`, err);
      return false;
    }
  };

  // ===========================================================================
  // MÉTODO: VERIFICAR SE ANÁLISE ESTÁ DESBLOQUEADA
  // ===========================================================================
  
  const isAnalysisUnlocked = (analysisType: 'birth' | 'biohacking' | 'psychological' | 'cognitive'): boolean => {
    if (analysisType === 'birth') return true;
    if (analysisType === 'biohacking') return progress.birth.completed;
    if (analysisType === 'psychological') return progress.birth.completed && progress.biohacking.completed;
    if (analysisType === 'cognitive') return progress.birth.completed && progress.biohacking.completed && progress.psychological.completed;
    return false;
  };

  // ===========================================================================
  // MÉTODO: OBTER PRÓXIMA ANÁLISE
  // ===========================================================================
  
  const getNextAnalysis = (): string | null => {
    if (!progress.birth.completed) return 'birth';
    if (!progress.biohacking.completed) return 'biohacking';
    if (!progress.psychological.completed) return 'psychological';
    if (!progress.cognitive.completed) return 'cognitive';
    return null;
  };

  // ===========================================================================
  // MÉTODO: OBTER ANÁLISE ANTERIOR
  // ===========================================================================
  
  const getPreviousAnalysis = (currentAnalysis: 'birth' | 'biohacking' | 'psychological' | 'cognitive'): string | null => {
    const order = ['birth', 'biohacking', 'psychological', 'cognitive'];
    const currentIndex = order.indexOf(currentAnalysis);
    return currentIndex > 0 ? order[currentIndex - 1] : null;
  };

  // ===========================================================================
  // MÉTODO: OBTER ESTATÍSTICAS DE PROGRESSO
  // ===========================================================================
  
  const getProgressStats = () => {
    const completedAnalyses = [
      progress.birth.completed,
      progress.biohacking.completed,
      progress.psychological.completed,
      progress.cognitive.completed
    ].filter(Boolean).length;

    return {
      total: 4,
      completed: completedAnalyses,
      remaining: 4 - completedAnalyses,
      percentage: progress.overallProgress,
      canAccessResults: progress.canAccessResults,
      nextAnalysis: getNextAnalysis(),
      isComplete: completedAnalyses === 4
    };
  };

  // ===========================================================================
  // MÉTODO: RESETAR PROGRESSO (para desenvolvimento/debug)
  // ===========================================================================
  
  const resetProgress = async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          birth_data_complete: false,
          biohacking_data_complete: false,
          psychological_data_complete: false,
          cognitive_data_complete: false,
          birth_data: null,
          biohacking_data: null,
          psychological_data: null,
          cognitive_data: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await loadProgress();
      return true;
    } catch (error) {
      console.error('❌ Erro ao resetar progresso:', error);
      return false;
    }
  };

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  useEffect(() => {
    if (user?.id) {
      console.log('👤 Usuário detectado, carregando progresso...');
      loadProgress();
    } else {
      console.log('👤 Sem usuário, resetando...');
      setProgress({
        birth: { completed: false },
        biohacking: { completed: false },
        psychological: { completed: false },
        cognitive: { completed: false },
        overallProgress: 0,
        canAccessResults: false
      });
      setLoading(false);
    }
  }, [user?.id]);

  // ===========================================================================
  // INTERFACE PÚBLICA
  // ===========================================================================

  return {
    // Estado principal
    progress,
    loading,
    error,
    
    // Métodos principais
    loadProgress,
    markAnalysisComplete,
    
    // Validações e checagens
    isAnalysisUnlocked,
    isAnalysisAvailable: isAnalysisUnlocked, // Alias
    
    // Navegação
    getNextAnalysis,
    getPreviousAnalysis,
    
    // Estatísticas
    getProgressStats,
    
    // Getters úteis
    hasCompletedAny: progress.overallProgress > 0,
    isComplete: progress.overallProgress === 100,
    completedCount: [
      progress.birth.completed,
      progress.biohacking.completed,
      progress.psychological.completed,
      progress.cognitive.completed
    ].filter(Boolean).length,
    
    // Debug/Dev
    resetProgress
  };
}

export default useAnalysisProgress;