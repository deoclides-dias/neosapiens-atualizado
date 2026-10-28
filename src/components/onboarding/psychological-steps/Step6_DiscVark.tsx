// src/components/onboarding/psychological-steps/Step6_DiscVark.tsx
// ============================================================================
// STEP 6: DISC + VARK (Perfil Comportamental + Estilo de Aprendizagem)
// VERSÃO UNIFICADA COMPLETA
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Target, Eye, Ear, BookOpen, Hand, CheckCircle } from 'lucide-react';
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

interface DiscVarkQuestion {
  id: number;
  text: string;
  hint?: string;
  category: 'DISC_D' | 'DISC_I' | 'DISC_S' | 'DISC_C' | 'VARK_V' | 'VARK_A' | 'VARK_R' | 'VARK_K';
  subcategory: string;
}

// ============================================================================
// QUESTÕES DISC + VARK (24 questões total)
// ============================================================================

const DISC_VARK_QUESTIONS: DiscVarkQuestion[] = [
  // === DISC - DOMINÂNCIA (3 questões) ===
  {
    id: 1,
    text: "Eu gosto de assumir o controle e liderar situações desafiadoras.",
    hint: "Avalie sua tendência natural para assumir liderança em momentos críticos.",
    category: 'DISC_D',
    subcategory: 'Dominância'
  },
  {
    id: 2,
    text: "Eu sou direto e assertivo ao comunicar minhas opiniões.",
    hint: "Reflita sobre seu estilo de comunicação: diplomático ou direto.",
    category: 'DISC_D',
    subcategory: 'Dominância'
  },
  {
    id: 3,
    text: "Eu me sinto confortável tomando decisões rápidas sob pressão.",
    hint: "Pense na sua reação natural diante de prazos apertados e decisões urgentes.",
    category: 'DISC_D',
    subcategory: 'Dominância'
  },

  // === DISC - INFLUÊNCIA (3 questões) ===
  {
    id: 4,
    text: "Eu consigo facilmente entusiasmar e motivar outras pessoas.",
    hint: "Considere sua capacidade de inspirar e energizar grupos.",
    category: 'DISC_I',
    subcategory: 'Influência'
  },
  {
    id: 5,
    text: "Eu gosto de trabalhar em equipe e colaborar com outros.",
    hint: "Avalie sua preferência por atividades colaborativas versus individuais.",
    category: 'DISC_I',
    subcategory: 'Influência'
  },
  {
    id: 6,
    text: "Eu sou naturalmente otimista e vejo o lado positivo das situações.",
    hint: "Reflita sobre sua perspectiva geral: otimista, realista ou cautelosa.",
    category: 'DISC_I',
    subcategory: 'Influência'
  },

  // === DISC - ESTABILIDADE (3 questões) ===
  {
    id: 7,
    text: "Eu prefiro ambientes de trabalho estáveis e previsíveis.",
    hint: "Pense na sua preferência por rotina versus mudanças constantes.",
    category: 'DISC_S',
    subcategory: 'Estabilidade'
  },
  {
    id: 8,
    text: "Eu sou paciente e consigo manter a calma em situações tensas.",
    hint: "Avalie sua capacidade natural de manter equilíbrio emocional.",
    category: 'DISC_S',
    subcategory: 'Estabilidade'
  },
  {
    id: 9,
    text: "Eu valorizo relacionamentos harmoniosos e evito conflitos.",
    hint: "Considere sua abordagem diante de tensões interpessoais.",
    category: 'DISC_S',
    subcategory: 'Estabilidade'
  },

  // === DISC - CONFORMIDADE (3 questões) ===
  {
    id: 10,
    text: "Eu presto atenção aos detalhes e busco precisão em tudo que faço.",
    hint: "Reflita sobre sua tendência a ser meticuloso versus focado no panorama geral.",
    category: 'DISC_C',
    subcategory: 'Conformidade'
  },
  {
    id: 11,
    text: "Eu gosto de seguir processos estabelecidos e regras claras.",
    hint: "Pense na sua preferência por estrutura versus flexibilidade.",
    category: 'DISC_C',
    subcategory: 'Conformidade'
  },
  {
    id: 12,
    text: "Eu analiso cuidadosamente antes de tomar qualquer decisão importante.",
    hint: "Avalie seu processo decisório: intuitivo e rápido ou analítico e cuidadoso.",
    category: 'DISC_C',
    subcategory: 'Conformidade'
  },

  // === VARK - VISUAL (3 questões) ===
  {
    id: 13,
    text: "Eu aprendo melhor quando posso ver gráficos, diagramas ou imagens.",
    hint: "Considere como você processa informação: através de elementos visuais.",
    category: 'VARK_V',
    subcategory: 'Visual'
  },
  {
    id: 14,
    text: "Eu prefiro mapas mentais e esquemas para organizar ideias complexas.",
    hint: "Pense na sua preferência por representações visuais de conceitos.",
    category: 'VARK_V',
    subcategory: 'Visual'
  },
  {
    id: 15,
    text: "Eu me lembro melhor de informações quando elas são coloridas ou destacadas visualmente.",
    hint: "Reflita sobre como cores e destaque visual afetam sua memória.",
    category: 'VARK_V',
    subcategory: 'Visual'
  },

  // === VARK - AUDITIVO (3 questões) ===
  {
    id: 16,
    text: "Eu compreendo melhor quando ouço explicações em voz alta.",
    hint: "Avalie sua preferência por informação transmitida oralmente.",
    category: 'VARK_A',
    subcategory: 'Auditivo'
  },
  {
    id: 17,
    text: "Eu gosto de discutir ideias em grupo para processar informações.",
    hint: "Considere como conversas e discussões ajudam no seu aprendizado.",
    category: 'VARK_A',
    subcategory: 'Auditivo'
  },
  {
    id: 18,
    text: "Eu frequentemente falo comigo mesmo quando estou pensando ou estudando.",
    hint: "Reflita sobre seu uso da verbalização como ferramenta de processamento.",
    category: 'VARK_A',
    subcategory: 'Auditivo'
  },

  // === VARK - READING/WRITING (3 questões) ===
  {
    id: 19,
    text: "Eu prefiro ler textos detalhados para compreender conceitos complexos.",
    hint: "Pense na sua preferência por material textual denso e detalhado.",
    category: 'VARK_R',
    subcategory: 'Leitura/Escrita'
  },
  {
    id: 20,
    text: "Eu gosto de tomar notas escritas para organizar e reter informações.",
    hint: "Avalie como o ato de escrever contribui para seu aprendizado.",
    category: 'VARK_R',
    subcategory: 'Leitura/Escrita'
  },
  {
    id: 21,
    text: "Eu me sinto confortável aprendendo através de listas, glossários e textos estruturados.",
    hint: "Considere sua afinidade com informação organizada em formato textual.",
    category: 'VARK_R',
    subcategory: 'Leitura/Escrita'
  },

  // === VARK - KINESTÉSICO (3 questões) ===
  {
    id: 22,
    text: "Eu aprendo melhor quando posso praticar e experimentar na prática.",
    hint: "Reflita sobre a importância da experiência hands-on no seu aprendizado.",
    category: 'VARK_K',
    subcategory: 'Kinestésico'
  },
  {
    id: 23,
    text: "Eu preciso me mover ou gesticular quando estou processando informações complexas.",
    hint: "Pense na relação entre movimento físico e seu processo de pensamento.",
    category: 'VARK_K',
    subcategory: 'Kinestésico'
  },
  {
    id: 24,
    text: "Eu compreendo melhor conceitos quando posso relacioná-los com experiências reais.",
    hint: "Avalie como exemplos práticos e vivências facilitam sua compreensão.",
    category: 'VARK_K',
    subcategory: 'Kinestésico'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step6_DiscVark: React.FC<StepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  // Estados locais
  const [answers, setAnswers] = useState<number[]>(data || new Array(24).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSection, setCurrentSection] = useState<'DISC' | 'VARK'>('DISC');

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
    if (questionIndex < DISC_VARK_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setCurrentQuestion(nextIndex);
        
        // Mudar seção automaticamente quando necessário
        if (nextIndex >= 12 && currentSection === 'DISC') {
          setCurrentSection('VARK');
        }
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete, currentSection]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < DISC_VARK_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
        
        // Atualizar seção baseado na questão
        if (index < 12) {
          setCurrentSection('DISC');
        } else {
          setCurrentSection('VARK');
        }
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

  const progress = (answers.filter(answer => answer > 0).length / DISC_VARK_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular scores DISC
  const calculateDiscScores = () => {
    if (!isComplete) return { D: 0, I: 0, S: 0, C: 0 };
    
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    answers.slice(0, 12).forEach((answer, index) => {
      const question = DISC_VARK_QUESTIONS[index];
      const category = question.category.split('_')[1] as 'D' | 'I' | 'S' | 'C';
      scores[category] += answer;
    });
    
    // Converter para percentual
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / 15) * 100);
    });
    
    return scores;
  };

  // Calcular scores VARK
  const calculateVarkScores = () => {
    if (!isComplete) return { V: 0, A: 0, R: 0, K: 0 };
    
    const scores = { V: 0, A: 0, R: 0, K: 0 };
    
    answers.slice(12, 24).forEach((answer, index) => {
      const question = DISC_VARK_QUESTIONS[index + 12];
      const category = question.category.split('_')[1] as 'V' | 'A' | 'R' | 'K';
      scores[category] += answer;
    });
    
    // Converter para percentual
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / 15) * 100);
    });
    
    return scores;
  };

  // Interpretações
  const interpretDiscProfile = (scores: { D: number; I: number; S: number; C: number }) => {
    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b);
    
    switch (dominant[0]) {
      case 'D':
        return {
          type: "DOMINANTE",
          description: "Você é orientado a resultados, direto e gosta de desafios.",
          characteristics: ["Líder natural", "Tomada de decisão rápida", "Orientado a resultados", "Direto"]
        };
      case 'I':
        return {
          type: "INFLUENTE",
          description: "Você é sociável, otimista e inspira outras pessoas.",
          characteristics: ["Comunicativo", "Entusiasmado", "Persuasivo", "Colaborativo"]
        };
      case 'S':
        return {
          type: "ESTÁVEL",
          description: "Você valoriza harmonia, é confiável e prefere estabilidade.",
          characteristics: ["Paciente", "Leal", "Colaborativo", "Consistente"]
        };
      case 'C':
        return {
          type: "CONSCIENCIOSO",
          description: "Você é analítico, preciso e segue padrões de qualidade.",
          characteristics: ["Detalhista", "Analítico", "Preciso", "Sistemático"]
        };
      default:
        return {
          type: "EQUILIBRADO",
          description: "Você apresenta características balanceadas entre os estilos.",
          characteristics: ["Versátil", "Adaptável", "Flexível", "Multifacetado"]
        };
    }
  };

  const interpretVarkProfile = (scores: { V: number; A: number; R: number; K: number }) => {
    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b);
    
    switch (dominant[0]) {
      case 'V':
        return {
          type: "VISUAL",
          description: "Você aprende melhor através de recursos visuais e gráficos.",
          characteristics: ["Mapas mentais", "Gráficos", "Cores", "Diagramas"]
        };
      case 'A':
        return {
          type: "AUDITIVO",
          description: "Você processa informação melhor através da audição e discussão.",
          characteristics: ["Discussões", "Explicações orais", "Música", "Repetição verbal"]
        };
      case 'R':
        return {
          type: "LEITURA/ESCRITA",
          description: "Você prefere informação em formato textual e escrito.",
          characteristics: ["Listas", "Notas", "Textos", "Glossários"]
        };
      case 'K':
        return {
          type: "KINESTÉSICO",
          description: "Você aprende melhor através da prática e experiência.",
          characteristics: ["Prática hands-on", "Experiências", "Movimento", "Simulações"]
        };
      default:
        return {
          type: "MULTIMODAL",
          description: "Você utiliza múltiplos estilos de aprendizagem.",
          characteristics: ["Versátil", "Adaptável", "Múltiplas abordagens", "Flexível"]
        };
    }
  };

  const discScores = calculateDiscScores();
  const varkScores = calculateVarkScores();
  const discInterpretation = interpretDiscProfile(discScores);
  const varkInterpretation = interpretVarkProfile(varkScores);

  // ============================================================================
  // HELPERS PARA SEÇÕES
  // ============================================================================

  const getSectionProgress = (section: 'DISC' | 'VARK') => {
    const startIndex = section === 'DISC' ? 0 : 12;
    const endIndex = section === 'DISC' ? 12 : 24;
    const sectionAnswers = answers.slice(startIndex, endIndex);
    return (sectionAnswers.filter(answer => answer > 0).length / 12) * 100;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-orange-500/20 p-3 rounded-xl">
            {currentSection === 'DISC' ? (
              <Target className="w-8 h-8 text-orange-600" />
            ) : (
              <BookOpen className="w-8 h-8 text-orange-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {currentSection === 'DISC' ? 'Perfil DISC' : 'Estilo VARK'}
          </h2>
        </div>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          {currentSection === 'DISC' 
            ? 'Descubra como você se comporta em ambientes de trabalho e liderança.'
            : 'Identifique seu estilo preferido de aprendizagem e processamento de informação.'
          }
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">
          {answers.filter(answer => answer > 0).length} de {DISC_VARK_QUESTIONS.length} questões respondidas
        </p>
      </div>

      {/* Seção Switcher */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setCurrentSection('DISC');
            if (currentQuestion >= 12) goToQuestion(0);
          }}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${currentSection === 'DISC'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Target className="w-5 h-5 mr-2" />
          DISC ({Math.round(getSectionProgress('DISC'))}%)
        </button>
        <button
          onClick={() => {
            setCurrentSection('VARK');
            if (currentQuestion < 12) goToQuestion(12);
          }}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${currentSection === 'VARK'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <BookOpen className="w-5 h-5 mr-2" />
          VARK ({Math.round(getSectionProgress('VARK'))}%)
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {DISC_VARK_QUESTIONS.map((_, index) => {
          const isCurrentSection = currentSection === 'DISC' ? index < 12 : index >= 12;
          if (!isCurrentSection) return null;
          
          return (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`
                w-8 h-8 rounded-full transition-all duration-300 text-sm font-medium
                ${currentQuestion === index
                  ? 'bg-orange-500 text-white scale-110'
                  : answers[index] > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {(index % 12) + 1}
            </button>
          );
        })}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={DISC_VARK_QUESTIONS[currentQuestion].text}
          category={DISC_VARK_QUESTIONS[currentQuestion].subcategory}
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={DISC_VARK_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfis identificados (se completo) */}
      {isComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Perfil DISC */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center">
              <Target className="w-5 h-5 text-orange-600 mr-2" />
              Perfil DISC Identificado
            </h3>
            <div>
              <h4 className="text-orange-600 font-medium mb-2">{discInterpretation.type}</h4>
              <p className="text-gray-700 text-sm mb-4">{discInterpretation.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-red-600 text-2xl font-bold">D: {discScores.D}%</div>
                  <div className="text-amber-600 text-2xl font-bold">I: {discScores.I}%</div>
                </div>
                <div>
                  <div className="text-green-600 text-2xl font-bold">S: {discScores.S}%</div>
                  <div className="text-blue-600 text-2xl font-bold">C: {discScores.C}%</div>
                </div>
              </div>
              <div className="space-y-2">
                {discInterpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Perfil VARK */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-orange-600 mr-2" />
              Estilo VARK Identificado
            </h3>
            <div>
              <h4 className="text-orange-600 font-medium mb-2">{varkInterpretation.type}</h4>
              <p className="text-gray-700 text-sm mb-4">{varkInterpretation.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-purple-600 text-2xl font-bold flex items-center">
                    <Eye className="w-5 h-5 mr-1" />
                    V: {varkScores.V}%
                  </div>
                  <div className="text-blue-600 text-2xl font-bold flex items-center">
                    <Ear className="w-5 h-5 mr-1" />
                    A: {varkScores.A}%
                  </div>
                </div>
                <div>
                  <div className="text-green-600 text-2xl font-bold flex items-center">
                    <BookOpen className="w-5 h-5 mr-1" />
                    R: {varkScores.R}%
                  </div>
                  <div className="text-orange-600 text-2xl font-bold flex items-center">
                    <Hand className="w-5 h-5 mr-1" />
                    K: {varkScores.K}%
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {varkInterpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
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
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
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

export default Step6_DiscVark;