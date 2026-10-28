// src/components/onboarding/psychological-steps/Step4_Agreeableness.tsx
// ============================================================================
// STEP 4: AMABILIDADE (Big Five)
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Heart, Users, Shield, Smile } from 'lucide-react';
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

interface AgreeablenessQuestion {
  id: number;
  text: string;
  hint?: string;
  reversed?: boolean;
}

// ============================================================================
// QUESTÕES DO BIG FIVE - AMABILIDADE
// ============================================================================

const AGREEABLENESS_QUESTIONS: AgreeablenessQuestion[] = [
  {
    id: 1,
    text: "Eu genuinamente me preocupo com o bem-estar dos outros.",
    hint: "Reflita se você sente empatia real pelas dificuldades e alegrias alheias."
  },
  {
    id: 2,
    text: "Eu confio nas pessoas até que me deem motivos para não confiar.",
    hint: "Pense na sua tendência inicial: confiança ou desconfiança natural?"
  },
  {
    id: 3,
    text: "Eu tendo a ser cético em relação às intenções das pessoas.",
    hint: "Considere se você questiona automaticamente os motivos dos outros.",
    reversed: true
  },
  {
    id: 4,
    text: "Eu evito conflitos e prefiro manter a harmonia nos relacionamentos.",
    hint: "Avalie sua reação diante de desentendimentos e tensões sociais."
  },
  {
    id: 5,
    text: "Eu coloco as necessidades dos outros antes das minhas próprias.",
    hint: "Reflita sobre sua tendência natural de priorizar o outro ou a si mesmo."
  },
  {
    id: 6,
    text: "Eu tendo a ser direto e franco, mesmo que isso possa magoar alguém.",
    hint: "Pense na sua abordagem: diplomacia versus honestidade brutal.",
    reversed: true
  },
  {
    id: 7,
    text: "Eu perdoo facilmente quando alguém me prejudica ou magoa.",
    hint: "Considere sua capacidade natural de perdoar e esquecer ofensas."
  },
  {
    id: 8,
    text: "Eu me esforço para ajudar pessoas necessitadas, mesmo sem recompensa.",
    hint: "Avalie sua motivação para atos altruístas e de voluntariado."
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step4_Agreeableness: React.FC<StepProps> = ({
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
    if (questionIndex < AGREEABLENESS_QUESTIONS.length - 1 && value > 0) {
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
    if (index >= 0 && index < AGREEABLENESS_QUESTIONS.length) {
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

  const progress = (answers.filter(answer => answer > 0).length / AGREEABLENESS_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular score de amabilidade (com questões reversas)
  const calculateAgreeablenessScore = () => {
    if (!isComplete) return 0;
    
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const question = AGREEABLENESS_QUESTIONS[index];
      const score = question.reversed ? (6 - answer) : answer;
      totalScore += score;
    });
    
    // Converter para escala 0-100
    return Math.round((totalScore / 40) * 100);
  };

  // Interface para interpretação
  interface AgreeablenessInterpretation {
    type: string;
    description: string;
    characteristics: string[];
  }

  // Interpretação do score
  const interpretAgreeablenessScore = (score: number): AgreeablenessInterpretation => {
    if (score >= 80) return {
      type: "ALTAMENTE ALTRUÍSTA",
      description: "Você é naturalmente empático, confiante e prioriza o bem-estar coletivo.",
      characteristics: ["Empático", "Confiante", "Altruísta", "Harmonioso"]
    };
    if (score >= 60) return {
      type: "COLABORATIVO",
      description: "Você valoriza relacionamentos e cooperação, mas mantém limites saudáveis.",
      characteristics: ["Cooperativo", "Diplomático", "Compreensivo", "Leal"]
    };
    if (score >= 40) return {
      type: "EQUILIBRADO",
      description: "Você equilibra bem os interesses próprios com os dos outros.",
      characteristics: ["Equilibrado", "Pragmático", "Justo", "Realista"]
    };
    if (score >= 20) return {
      type: "COMPETITIVO",
      description: "Você é mais focado em seus objetivos e tende a ser direto nas relações.",
      characteristics: ["Direto", "Independente", "Objetivo", "Assertivo"]
    };
    return {
      type: "ALTAMENTE COMPETITIVO",
      description: "Você prioriza seus interesses e é naturalmente cético sobre as intenções alheias.",
      characteristics: ["Cético", "Independente", "Competitivo", "Franco"]
    };
  };

  const score = calculateAgreeablenessScore();
  const interpretation = interpretAgreeablenessScore(score);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-pink-500/20 p-3 rounded-xl">
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Amabilidade
          </h2>
        </div>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Explore como você se relaciona com outras pessoas, sua empatia e cooperação.
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">
          {answers.filter(answer => answer > 0).length} de {AGREEABLENESS_QUESTIONS.length} questões respondidas
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {AGREEABLENESS_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`
              w-8 h-8 rounded-full transition-all duration-300 text-sm font-medium
              ${currentQuestion === index
                ? 'bg-pink-500 text-white scale-110'
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
          questionText={AGREEABLENESS_QUESTIONS[currentQuestion].text}
          category="Amabilidade"
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={AGREEABLENESS_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfil relacional identificado (se completo) */}
      {isComplete && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-4 flex items-center">
            <Users className="w-5 h-5 text-pink-600 mr-2" />
            Perfil Relacional Identificado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-pink-600 font-medium mb-2">{interpretation.type}</h4>
              <p className="text-gray-700 text-sm mb-4">{interpretation.description}</p>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">{score}/100</div>
                <div className="text-gray-600 text-sm">Score de Amabilidade</div>
              </div>
            </div>
            <div>
              <h5 className="text-gray-900 font-medium mb-3">Características Identificadas:</h5>
              <div className="grid grid-cols-2 gap-2">
                {interpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    <Shield className="w-4 h-4 mr-2" />
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
              ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white'
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

export default Step4_Agreeableness;