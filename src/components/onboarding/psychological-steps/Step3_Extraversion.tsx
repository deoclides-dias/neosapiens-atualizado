// src/components/onboarding/psychological-steps/Step3_Extraversion.tsx
// ============================================================================
// STEP 3: EXTROVERSÃO (Big Five)
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Users, Zap, MessageCircle, PartyPopper } from 'lucide-react';
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

interface ExtraversionQuestion {
  id: number;
  text: string;
  hint?: string;
  reversed?: boolean;
}

// ============================================================================
// QUESTÕES DO BIG FIVE - EXTROVERSÃO
// ============================================================================

const EXTRAVERSION_QUESTIONS: ExtraversionQuestion[] = [
  {
    id: 1,
    text: "Eu me sinto energizado quando estou cercado de pessoas.",
    hint: "Reflita se a presença de outras pessoas te dá energia ou te drena."
  },
  {
    id: 2,
    text: "Eu gosto de ser o centro das atenções em grupos sociais.",
    hint: "Pense na sua reação quando todas as atenções se voltam para você."
  },
  {
    id: 3,
    text: "Eu prefiro atividades silenciosas e solitárias.",
    hint: "Considere se você busca momentos de quietude ou de interação social.",
    reversed: true
  },
  {
    id: 4,
    text: "Eu inicio conversas facilmente com pessoas desconhecidas.",
    hint: "Avalie sua facilidade para quebrar o gelo em situações sociais."
  },
  {
    id: 5,
    text: "Eu me sinto confortável falando em público ou em grupos grandes.",
    hint: "Reflita sobre sua reação ao se expressar diante de muitas pessoas."
  },
  {
    id: 6,
    text: "Eu preciso de tempo sozinho para recarregar minhas energias.",
    hint: "Pense se você se recupera melhor na solidão ou na companhia de outros.",
    reversed: true
  },
  {
    id: 7,
    text: "Eu sou animado e entusiasmado na maior parte do tempo.",
    hint: "Considere seu nível natural de energia e entusiasmo no dia a dia."
  },
  {
    id: 8,
    text: "Eu procuro ativamente eventos sociais e festas.",
    hint: "Avalie se você busca oportunidades de socialização ou prefere evitá-las."
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step3_Extraversion: React.FC<StepProps> = ({
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
    if (questionIndex < EXTRAVERSION_QUESTIONS.length - 1 && value > 0) {
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
    if (index >= 0 && index < EXTRAVERSION_QUESTIONS.length) {
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

  const progress = (answers.filter(answer => answer > 0).length / EXTRAVERSION_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular score de extroversão (com questões reversas)
  const calculateExtraversionScore = () => {
    if (!isComplete) return 0;
    
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const question = EXTRAVERSION_QUESTIONS[index];
      const score = question.reversed ? (6 - answer) : answer;
      totalScore += score;
    });
    
    // Converter para escala 0-100
    return Math.round((totalScore / 40) * 100);
  };

  // Interface para interpretação
  interface ExtraversionInterpretation {
    type: string;
    description: string;
    characteristics: string[];
  }

  // Interpretação do score
  const interpretExtraversionScore = (score: number): ExtraversionInterpretation => {
    if (score >= 80) return {
      type: "ALTAMENTE EXTROVERTIDO",
      description: "Você é energizado pelo contato social e prospera em ambientes com muitas pessoas.",
      characteristics: ["Sociável", "Expressivo", "Assertivo", "Entusiasmado"]
    };
    if (score >= 60) return {
      type: "EXTROVERTIDO",
      description: "Você gosta de interação social mas também aprecia momentos de quietude.",
      characteristics: ["Comunicativo", "Sociável", "Confiante", "Energético"]
    };
    if (score >= 40) return {
      type: "AMBIVERTIDO",
      description: "Você equilibra bem momentos sociais e solitários, adaptando-se ao contexto.",
      characteristics: ["Flexível", "Adaptável", "Equilibrado", "Versátil"]
    };
    if (score >= 20) return {
      type: "INTROVERTIDO",
      description: "Você prefere ambientes mais quietos e grupos menores de pessoas próximas.",
      characteristics: ["Reflexivo", "Observador", "Profundo", "Concentrado"]
    };
    return {
      type: "ALTAMENTE INTROVERTIDO",
      description: "Você é energizado pela solidão e prefere atividades que permitam reflexão profunda.",
      characteristics: ["Introspectivo", "Independente", "Contemplativo", "Reservado"]
    };
  };

  const score = calculateExtraversionScore();
  const interpretation = interpretExtraversionScore(score);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Extroversão
          </h2>
        </div>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Explore como você interage com o mundo social e de onde vem sua energia.
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">
          {answers.filter(answer => answer > 0).length} de {EXTRAVERSION_QUESTIONS.length} questões respondidas
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {EXTRAVERSION_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`
              w-8 h-8 rounded-full transition-all duration-300 text-sm font-medium
              ${currentQuestion === index
                ? 'bg-blue-500 text-white scale-110'
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
          questionText={EXTRAVERSION_QUESTIONS[currentQuestion].text}
          category="Extroversão"
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={EXTRAVERSION_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfil social identificado (se completo) */}
      {isComplete && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-4 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            Perfil Social Identificado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-blue-600 font-medium mb-2">{interpretation.type}</h4>
              <p className="text-gray-700 text-sm mb-4">{interpretation.description}</p>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{score}/100</div>
                <div className="text-gray-600 text-sm">Score de Extroversão</div>
              </div>
            </div>
            <div>
              <h5 className="text-gray-900 font-medium mb-3">Características Identificadas:</h5>
              <div className="grid grid-cols-2 gap-2">
                {interpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${canProceed
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          Próximo
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3_Extraversion;