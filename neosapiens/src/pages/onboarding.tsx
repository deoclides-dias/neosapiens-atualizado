import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import BirthDataForm from '../components/onboarding/BirthDataForm';
import { OnboardingService } from '../services/onboardingService';
import { BirthData } from '../types/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Carregar dados existentes se houver
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;
    
    const existingData = await OnboardingService.getBirthData(user.id);
    if (existingData) {
      setBirthData(existingData);
    }
  };

  const handleBirthDataComplete = async (data: BirthData) => {
    if (!user) return;

    const result = await OnboardingService.saveBirthData(user.id, data);
    
    if (result.success) {
      setBirthData(data);
      setCurrentStep(2); // Próxima etapa: questionário psicológico
      
      // TODO: Processar análises das tradições ancestrais
      console.log('Dados salvos, processando tradições ancestrais...');
      
    } else {
      alert('Erro ao salvar dados. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {currentStep === 1 && (
        <BirthDataForm
          onComplete={handleBirthDataComplete}
          initialData={birthData || undefined}
        />
      )}
      
      {currentStep === 2 && (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-xl">
            Próxima etapa: Questionário Psicológico (em desenvolvimento)
          </div>
        </div>
      )}
    </div>
  );
}
