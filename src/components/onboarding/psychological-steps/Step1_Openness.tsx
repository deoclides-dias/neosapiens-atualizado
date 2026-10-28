// src/components/onboarding/psychological-steps/Step1_Openness.tsx
// ============================================================================
// STEP 1: ABERTURA À EXPERIÊNCIA (Big Five)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Lightbulb, Sparkles, Eye, Brain } from 'lucide-react';
import { QuestionCardWithScale } from './ScaleSystem';

// ============================================================================
// INTERFACES
// ============================================================================

interface StepProps {
  data: number[];
  onDataChange: (data: number[]) => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepComplete?: () => void;
}

interface OpennessQuestion {
  id: number;
  text: string;
  hint?: string;
  reversed?: boolean; // Para questões que precisam ser invertidas na pontuação
}

// ============================================================================
// QUESTÕES DO BIG FIVE - ABERTURA À EXPERIÊNCIA
// ============================================================================

const OPENNESS_QUESTIONS: OpennessQuestion[] = [
  {
    id: 1,
    text: "Eu tenho uma imaginação muito ativa e criativa.",
    hint: "Pense se você frequentemente imagina cenários, cria histórias mentais ou visualiza situações."
  },
  {
    id: 2,
    text: "Eu gosto de explorar ideias novas e conceitos abstratos.",
    hint: "Considere se você se sente atraído por teorias, filosofias ou conceitos complexos."
  },
  {
    id: 3,
    text: "Eu prefiro rotinas conhecidas a experiências novas.",
    hint: "Pense na sua reação quando surge algo completamente diferente do habitual.",
    reversed: true
  },
  {
    id: 4,
    text: "Eu aprecio arte, música e literatura de vanguarda ou experimental.",
    hint: "Considere se você busca expressões artísticas inovadoras ou prefere o clássico."
  },
  {
    id: 5,
    text: "Eu gosto de questionar tradições e autoridades estabelecidas.",
    hint: "Reflita sobre sua tendência a aceitar ou questionar 'como as coisas sempre foram feitas'."
  },
  {
    id: 6,
    text: "Eu me interesso por culturas e perspectivas diferentes da minha.",
    hint: "Pense no seu interesse genuíno por conhecer outros modos de vida e pensamento."
  },
  {
    id: 7,
    text: "Eu tenho dificuldade para entender conceitos abstratos ou teóricos.",
    hint: "Considere como você lida com ideias que não são concretas ou práticas.",
    reversed: true
  },
  {
    id: 8,
    text: "Eu busco ativamente novas experiências e aventuras.",
    hint: "Reflita sobre sua disposição para sair da zona de conforto e experimentar o desconhecido."
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step1_Openness: React.FC<StepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  // Estados locais
  const [answers, setAnswers] = useState<number[]>(data || new Array(8).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const handleAnswerChange = useCallback(async (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    
    // Salvar automaticamente
    await onDataChange(newAnswers);
    
    // Auto-avançar para próxima questão (se não for a última)
    if (questionIndex < OPENNESS_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < OPENNESS_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleNext = async () => {
    const allAnswered = answers.every(answer => answer > 0);
    if (allAnswered) {
      await onNext();
    }
  };

  // ============================================================================
  // CÁLCULOS E VALIDAÇÕES
  // ============================================================================

  const progress = (answers.filter(answer => answer > 0).length / OPENNESS_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular score de abertura (com questões reversas)
  const calculateOpennessScore = () => {
    if (!isComplete) return 0;
    
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const question = OPENNESS_QUESTIONS[index];
      const score = question.reversed ? (6 - answer) : answer;
      totalScore += score;
    });
    
    // Converter para escala 0-100
    return Math.round((totalScore / 40) * 100);
  };

  const opennessScore = calculateOpennessScore();

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header do Step */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Abertura à Experiência
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Como você se relaciona com ideias novas, criatividade e experiências diferentes?
        </p>
        
        {/* Barra de Progresso */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Progresso do Step</span>
            <span className="text-gray-600 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Score atual (se completo) */}
        {isComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-center space-x-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 font-medium">
                Seu Score de Abertura: <span className="text-2xl font-bold text-purple-700">{opennessScore}</span>/100
              </span>
              <Brain className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        )}
      </div>

      {/* Navegação entre questões */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {OPENNESS_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`
              w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
              ${index === currentQuestion
                ? 'bg-purple-500 text-white scale-110'
                : answers[index] > 0
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={OPENNESS_QUESTIONS[currentQuestion].text}
          category="Abertura à Experiência"
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={OPENNESS_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Navegação entre questões */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={() => goToQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === 0
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Questão Anterior
        </button>

        <div className="text-gray-600 text-sm">
          Questão {currentQuestion + 1} de {OPENNESS_QUESTIONS.length}
        </div>

        <button
          onClick={() => goToQuestion(Math.min(OPENNESS_QUESTIONS.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === OPENNESS_QUESTIONS.length - 1}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === OPENNESS_QUESTIONS.length - 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          Próxima Questão
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Botões de navegação do step */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Step Anterior
        </button>

        <div className="text-center">
          <div className="text-gray-600 text-sm mb-1">
            {answers.filter(a => a > 0).length} de {OPENNESS_QUESTIONS.length} questões respondidas
          </div>
          {!canProceed && (
            <div className="text-amber-600 text-xs">
              ⚠️ Responda todas as questões para continuar
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Próximo Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step1_Openness;