import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import BirthDataForm from '../components/onboarding/BirthDataForm';
import { OnboardingService } from '../services/onboardingService';
import { TraditionsAnalysisService } from '../services/traditionsAnalysisService';
import { BirthData } from '../types/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleBirthDataComplete = async (data: BirthData) => {
    if (!user) return;

    console.log('🔮 Iniciando processo completo...');
    setIsProcessing(true);

    try {
      // 1. Salvar dados de nascimento
      console.log('💾 Salvando dados de nascimento...');
      const saveResult = await OnboardingService.saveBirthData(user.id, data);
      
      if (!saveResult.success) {
        throw new Error('Erro ao salvar dados de nascimento');
      }

      setBirthData(data);
      
      // 2. Processar análises das tradições
      console.log('🔮 Processando análises das tradições ancestrais...');
      const analysisResult = await TraditionsAnalysisService.processFullAnalysis(user.id, data);
      
      console.log('✨ Análise completa:', analysisResult);
      setAnalysisResults(analysisResult);
      
      // 3. Avançar para próxima etapa
      setCurrentStep(2);
      
    } catch (error) {
      console.error('❌ Erro no processo:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
      
      {isProcessing && (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Processando Análises...</h2>
            <p className="text-blue-200">
              Calculando seu mapa astral, zodíaco chinês e numerologia...
            </p>
          </div>
        </div>
      )}
      
      {currentStep === 2 && analysisResults && (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white text-center mb-8">
              🎉 Suas Análises Estão Prontas!
            </h1>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">🌟 Astrologia Ocidental</h3>
                <div className="text-blue-200 space-y-2">
                  <p><strong>Sol:</strong> {analysisResults.westernAstrology?.summary?.sunSign || 'Processando...'}</p>
                  <p><strong>Lua:</strong> {analysisResults.westernAstrology?.summary?.moonSign || 'Processando...'}</p>
                  <p><strong>Ascendente:</strong> {analysisResults.westernAstrology?.summary?.ascendant || 'Processando...'}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">🐉 Astrologia Chinesa</h3>
                <div className="text-blue-200 space-y-2">
                  <p><strong>Animal:</strong> {analysisResults.chineseAstrology?.summary?.zodiacSign || 'Processando...'}</p>
                  <p><strong>Elemento:</strong> {analysisResults.chineseAstrology?.summary?.element || 'Processando...'}</p>
                  <p><strong>Polaridade:</strong> {analysisResults.chineseAstrology?.summary?.polarity || 'Processando...'}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">🔢 Numerologia</h3>
                <div className="text-blue-200 space-y-2">
                  <p><strong>Caminho de Vida:</strong> {analysisResults.numerology?.summary?.lifePathNumber || 'Processando...'}</p>
                  <p><strong>Expressão:</strong> {analysisResults.numerology?.summary?.expressionNumber || 'Processando...'}</p>
                  <p><strong>Alma:</strong> {analysisResults.numerology?.summary?.soulNumber || 'Processando...'}</p>
                </div>
              </div>
            </div>

            {analysisResults.integratedInsights && analysisResults.integratedInsights.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-purple-300/30">
                <h3 className="text-xl font-semibold text-white mb-4">✨ Insights Integrados</h3>
                <div className="space-y-4">
                  {analysisResults.integratedInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="text-blue-100">
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <p className="text-sm">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}