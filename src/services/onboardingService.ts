// ============================================================================
// SERVIÇO UNIFICADO DE ONBOARDING - SEM CONFLITOS
// Arquivo: src/services/onboardingService.ts
// ============================================================================

import { supabase } from '../lib/supabase';
import type { 
  PersonalData, 
  BirthData, 
  BiohackingData, 
  PsychologicalData, 
  CognitiveData,
  OnboardingProgress 
} from '../types/onboarding';

export class OnboardingService {

  // ============================================================================
  // HELPER: Carregar progresso atual do usuário
  // ============================================================================
  
  private static async getProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();  // ✅ NÃO quebra se não tiver dados

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar progresso:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erro na query:', error);
      return null;
    }
  }

  // ============================================================================
  // HELPER: Salvar ou atualizar progresso
  // ============================================================================
  
  private static async upsertProgress(
    userId: string,
    updates: Partial<OnboardingProgress>
  ): Promise<OnboardingProgress | null> {
    try {
      const existing = await this.getProgress(userId);

      const payload = {
        user_id: userId,
        ...existing,
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Se não existe, adiciona created_at
      if (!existing) {
        payload.created_at = new Date().toISOString();
        payload.started_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert(payload, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar:', error);
        return null;
      }

      console.log('✅ Progresso salvo:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no upsert:', error);
      return null;
    }
  }

  // ============================================================================
  // ETAPA 1: SALVAR DADOS PESSOAIS (SEM birthDate!)
  // ============================================================================
  
  static async savePersonalData(
    userId: string,
    personalData: PersonalData
  ): Promise<boolean> {
    console.log('👤 Salvando dados pessoais:', personalData);

    const result = await this.upsertProgress(userId, {
      personal_data: personalData,
      personal_data_complete: true,
      step: 2  // Próximo: Birth Data
    });

    return !!result;
  }

  // ============================================================================
  // ETAPA 2: SALVAR DADOS DE NASCIMENTO (COM birthDate!)
  // ============================================================================
  
  static async saveBirthData(
    userId: string,
    birthData: BirthData
  ): Promise<boolean> {
    console.log('🌟 Salvando dados de nascimento:', birthData);

    const result = await this.upsertProgress(userId, {
      birth_data: birthData,
      birth_data_complete: true,
      step: 3  // Próximo: Biohacking
    });

    return !!result;
  }

  // ============================================================================
  // ETAPA 3: SALVAR DADOS DE BIOHACKING
  // ============================================================================
  
  static async saveBiohackingData(
    userId: string,
    biohackingData: BiohackingData
  ): Promise<boolean> {
    console.log('💪 Salvando dados de biohacking:', biohackingData);

    const result = await this.upsertProgress(userId, {
      biohacking_data: biohackingData,
      biohacking_data_complete: true,
      step: 4  // Próximo: Psychological
    });

    return !!result;
  }

  // ============================================================================
  // ETAPA 4: SALVAR DADOS PSICOLÓGICOS
  // ============================================================================
  
  static async savePsychologicalData(
    userId: string,
    psychologicalData: PsychologicalData
  ): Promise<boolean> {
    console.log('🧠 Salvando dados psicológicos:', psychologicalData);

    const result = await this.upsertProgress(userId, {
      psychological_data: psychologicalData,
      psychological_data_complete: true,
      step: 5  // Próximo: Cognitive
    });

    return !!result;
  }

  // ============================================================================
  // ETAPA 5: SALVAR DADOS COGNITIVOS
  // ============================================================================
  
  static async saveCognitiveData(
    userId: string,
    cognitiveData: CognitiveData
  ): Promise<boolean> {
    console.log('⚡ Salvando dados cognitivos:', cognitiveData);

    const result = await this.upsertProgress(userId, {
      cognitive_data: cognitiveData,
      cognitive_data_complete: true,
      step: 6,  // Concluído!
      completed_at: new Date().toISOString()
    });

    return !!result;
  }

  // ============================================================================
  // HELPER: Verificar se onboarding está completo
  // ============================================================================
  
  static async isOnboardingComplete(userId: string): Promise<boolean> {
    const progress = await this.getProgress(userId);
    
    if (!progress) return false;

    return !!(
      progress.personal_data_complete &&
      progress.birth_data_complete &&
      progress.biohacking_data_complete &&
      progress.psychological_data_complete &&
      progress.cognitive_data_complete
    );
  }

  // ============================================================================
  // HELPER: Obter dados completos do usuário
  // ============================================================================
  
  static async getUserData(userId: string): Promise<OnboardingProgress | null> {
    return await this.getProgress(userId);
  }
}

export default OnboardingService;
