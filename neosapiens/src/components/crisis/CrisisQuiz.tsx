import { useState } from 'react';

// Definição das perguntas e respostas
const quizQuestions = [
  {
    id: 1,
    question: "Com que frequência você se pega fazendo atividades no 'piloto automático', sem real presença?",
    options: [
      { value: 'rarely', label: 'Raramente' },
      { value: 'sometimes', label: 'Algumas vezes' },
      { value: 'often', label: 'Frequentemente' },
      { value: 'very_often', label: 'Muito frequentemente' }
    ]
  },
  {
    id: 2,
    question: "Como você avaliaria sua conexão com um propósito claro em sua vida atual?",
    options: [
      { value: 'strong', label: 'Forte e clara' },
      { value: 'moderate', label: 'Moderada' },
      { value: 'weak', label: 'Fraca ou inconsistente' },
      { value: 'absent', label: 'Ausente ou confusa' }
    ]
  },
  {
    id: 3,
    question: "Quando foi a última vez que você sentiu verdadeira sintonia entre o que faz, quem é, e como se sente?",
    options: [
      { value: 'today', label: 'Hoje ou ontem' },
      { value: 'week', label: 'Na última semana' },
      { value: 'month', label: 'No último mês' },
      { value: 'longer', label: 'Há mais tempo' }
    ]
  }
];

// Interpretações baseadas nas respostas
const interpretations: Record<string, Record<string, string>> = {
  rarely: { text: "Você parece ter uma boa capacidade de presença consciente.", color: "text-green-600" },
  sometimes: { text: "Você tem momentos de presença, mas também períodos de desconexão.", color: "text-yellow-600" },
  often: { text: "O piloto automático parece ser um padrão significativo em sua vida.", color: "text-orange-600" },
  very_often: { text: "Você vive grande parte do tempo em piloto automático, sem real presença.", color: "text-red-600" },
  
  strong: { text: "Você tem uma conexão forte com seu propósito, o que é raro atualmente.", color: "text-green-600" },
  moderate: { text: "Você tem alguma noção de propósito, mas pode haver espaço para clarificação.", color: "text-yellow-600" },
  weak: { text: "Sua conexão com propósito parece estar frágil e inconsistente atualmente.", color: "text-orange-600" },
  absent: { text: "Você parece estar experimentando uma significativa crise de propósito.", color: "text-red-600" },
  
  today: { text: "Você tem momentos frequentes de sintonia e integração, o que é excelente.", color: "text-green-600" },
  week: { text: "Você experimenta sintonia com alguma regularidade, o que é positivo.", color: "text-yellow-600" },
  month: { text: "Episódios de verdadeira sintonia são relativamente raros para você.", color: "text-orange-600" },
  longer: { text: "Você tem vivido um período prolongado de desintegração e dessintonia.", color: "text-red-600" }
};

const CrisisQuiz = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  // Gerenciar mudança nas respostas
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Verificar se todas as perguntas foram respondidas
  const allQuestionsAnswered = quizQuestions.every(q => answers[q.id]);
  
  // Calcular resultados
  const calculateResults = () => {
    setShowResults(true);
  };
  
  // Reiniciar o quiz
  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto mb-12">
      <h3 className="text-xl font-semibold text-indigo-900 mb-6 text-center">
        Quiz Rápido: Avalie Sua Conexão
      </h3>
      
      {!showResults ? (
        <>
          <div className="space-y-8">
            {quizQuestions.map((question) => (
              <div key={question.id} className="quiz-question">
                <p className="text-gray-800 font-medium mb-3">{question.question}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((option) => (
                    <label 
                      key={option.value} 
                      className={`
                        flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${answers[question.id] === option.value 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleAnswerChange(question.id, option.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={calculateResults}
              disabled={!allQuestionsAnswered}
              className={`
                px-6 py-2 rounded-full font-medium transition-all duration-300
                ${allQuestionsAnswered 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Ver Resultados
            </button>
          </div>
        </>
      ) : (
        <div className="result-container space-y-6">
          <h4 className="text-lg font-medium text-indigo-800 mb-4">Suas Respostas Indicam:</h4>
          
          <div className="space-y-4">
            {quizQuestions.map((question) => (
              <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-2">{question.question}</p>
                <p className={interpretations[answers[question.id]]?.color || "text-gray-800"}>
                  {interpretations[answers[question.id]]?.text || "Sem resposta"}
                </p>
              </div>
            ))}
          </div>
          
          <div className="p-5 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
            <p className="text-indigo-900 font-medium">
              Sua experiência espelha a de muitas pessoas na sociedade contemporânea. A abordagem NeoSapiens foi desenvolvida especificamente para abordar estes desafios de integração.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={resetQuiz}
              className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200"
            >
              Refazer Quiz
            </button>
            
            <button
              onClick={() => {
                document.getElementById('pilares')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              Descubra a Solução
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisQuiz;