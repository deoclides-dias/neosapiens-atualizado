// src/components/onboarding/BirthDataForm.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, User, ChevronRight, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface BirthDataFormProps {
  onComplete: (data: BirthData) => void;
  onBack?: () => void;
  initialData?: Partial<BirthData>;
}

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

interface PlaceSuggestion {
  name: string;
  coordinates: { lat: number; lng: number; };
  timezone: string;
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ 
  onComplete, 
  onBack, 
  initialData 
}) => {
  const [formData, setFormData] = useState<BirthData>({
    fullName: initialData?.fullName || '',
    birthDate: initialData?.birthDate || '',
    birthTime: initialData?.birthTime || '',
    hasExactTime: initialData?.hasExactTime ?? true,
    birthPlace: initialData?.birthPlace || '',
    coordinates: initialData?.coordinates || null,
    timezone: initialData?.timezone || ''
  });

  const [validation, setValidation] = useState({
    fullName: false,
    birthDate: false,
    birthPlace: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaceLoading, setIsPlaceLoading] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

  // Simulação do Google Places API
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setPlaceSuggestions([]);
      setShowPlaceSuggestions(false);
      return;
    }

    setIsPlaceLoading(true);
    setShowPlaceSuggestions(true);
    
    // Simulação de delay da API
    setTimeout(() => {
      const mockSuggestions: PlaceSuggestion[] = [
        {
          name: `${query}, São Paulo, SP, Brasil`,
          coordinates: { lat: -23.5505, lng: -46.6333 },
          timezone: 'America/Sao_Paulo'
        },
        {
          name: `${query}, Rio de Janeiro, RJ, Brasil`,
          coordinates: { lat: -22.9068, lng: -43.1729 },
          timezone: 'America/Sao_Paulo'
        },
        {
          name: `${query}, Fortaleza, CE, Brasil`,
          coordinates: { lat: -3.7172, lng: -38.5434 },
          timezone: 'America/Fortaleza'
        },
        {
          name: `${query}, Porto Alegre, RS, Brasil`,
          coordinates: { lat: -30.0346, lng: -51.2177 },
          timezone: 'America/Sao_Paulo'
        }
      ];
      setPlaceSuggestions(mockSuggestions);
      setIsPlaceLoading(false);
    }, 800);
  };

  const handleInputChange = (field: keyof BirthData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validação em tempo real
    validateField(field, value);

    // Busca de lugares
    if (field === 'birthPlace' && typeof value === 'string') {
      searchPlaces(value);
    }
  };

  const validateField = (field: keyof BirthData, value: any) => {
    let isValid = false;

    switch (field) {
      case 'fullName':
        isValid = typeof value === 'string' && value.trim().length >= 3 && value.includes(' ');
        break;
      case 'birthDate':
        isValid = typeof value === 'string' && value.length === 10 && new Date(value).getTime() < Date.now();
        break;
      case 'birthPlace':
        isValid = typeof value === 'string' && value.trim().length >= 3;
        break;
    }

    setValidation(prev => ({
      ...prev,
      [field]: isValid
    }));
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: place.name,
      coordinates: place.coordinates,
      timezone: place.timezone
    }));
    setShowPlaceSuggestions(false);
    setPlaceSuggestions([]);
    validateField('birthPlace', place.name);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return validation.fullName;
      case 2:
        return validation.birthDate;
      case 3:
        return validation.birthPlace;
      case 4:
        return true; // Horário é opcional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalizar e enviar dados
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Qual é o seu nome completo?";
      case 2: return "Quando você nasceu?";
      case 3: return "Onde você nasceu?";
      case 4: return "A que horas você nasceu?";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "Nome e sobrenome como registrado no documento";
      case 2: return "Data completa de nascimento";
      case 3: return "Cidade e estado/país de nascimento";
      case 4: return "Horário exato (se souber) para análise astrológica precisa";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-white/20">
        
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Dados de Nascimento</h1>
            <div className="text-sm text-blue-200">
              {currentStep}/4
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Título da etapa */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-blue-200 text-sm">
            {getStepSubtitle()}
          </p>
        </div>

        {/* Formulário por etapas */}
        <div className="space-y-6">
          
          {/* Etapa 1: Nome Completo */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ex: Maria Silva Santos"
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {validation.fullName && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
              </div>
              
              {formData.fullName && !validation.fullName && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Digite seu nome completo (nome e sobrenome)
                </div>
              )}
            </div>
          )}

          {/* Etapa 2: Data de Nascimento */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [color-scheme:dark]"
                />
                {validation.birthDate && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
              </div>
              
              {formData.birthDate && !validation.birthDate && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Selecione uma data válida no passado
                </div>
              )}
            </div>
          )}

          {/* Etapa 3: Local de Nascimento */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  placeholder="Ex: São Paulo, SP, Brasil"
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {validation.birthPlace && formData.coordinates && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
                {isPlaceLoading && (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 animate-spin" />
                )}
              </div>

              {/* Sugestões de lugares */}
              {showPlaceSuggestions && placeSuggestions.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                  {placeSuggestions.map((place, index) => (
                    <button
                      key={index}
                      onClick={() => selectPlace(place)}
                      className="w-full p-3 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-300" />
                        {place.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {formData.birthPlace && !formData.coordinates && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Selecione uma localização da lista de sugestões
                </div>
              )}
            </div>
          )}

          {/* Etapa 4: Horário de Nascimento */}
          {currentStep === 4 && (
            <div className="space-y-6">
              
              {/* Pergunta se sabe o horário exato */}
              <div className="space-y-4">
                <p className="text-white font-medium">Você sabe o horário exato do seu nascimento?</p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleInputChange('hasExactTime', true)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.hasExactTime === true
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 bg-white/10 text-blue-200 hover:border-blue-400'
                    }`}
                  >
                    Sim, sei o horário
                  </button>
                  
                  <button
                    onClick={() => handleInputChange('hasExactTime', false)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.hasExactTime === false
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 bg-white/10 text-blue-200 hover:border-blue-400'
                    }`}
                  >
                    Não sei
                  </button>
                </div>
              </div>

              {/* Campo de horário (se souber) */}
              {formData.hasExactTime === true && (
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [color-scheme:dark]"
                  />
                </div>
              )}

              {/* Informação sobre precisão */}
              {formData.hasExactTime === false && (
                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Sem problema!</strong> Ainda conseguiremos fazer uma análise muito precisa com sua data e local de nascimento. 
                    O horário só é necessário para alguns detalhes específicos da astrologia.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
          >
            Voltar
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              canProceedToNextStep()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === 4 ? 'Continuar para Análises' : 'Próximo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de dados coletados */}
        {currentStep === 4 && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-400/30 rounded-lg">
            <h3 className="text-green-300 font-medium mb-2">Dados coletados para análise:</h3>
            <ul className="text-green-200 text-sm space-y-1">
              <li>✓ Nome: {formData.fullName}</li>
              <li>✓ Data: {new Date(formData.birthDate).toLocaleDateString('pt-BR')}</li>
              <li>✓ Local: {formData.birthPlace}</li>
              <li>✓ Horário: {formData.hasExactTime ? formData.birthTime || 'A definir' : 'Não necessário'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthDataForm;