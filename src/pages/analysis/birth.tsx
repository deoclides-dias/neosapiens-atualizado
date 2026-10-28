// src/pages/analysis/birth.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Clock, MapPin, Save } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: {
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

const BirthAnalysis = () => {
  const router = useRouter();
  const { markAnalysisComplete } = useAnalysisProgress();

  const [formData, setFormData] = useState<BirthData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: {
      city: '',
      state: '',
      country: 'Brasil'
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('💾 Salvando dados de nascimento:', formData);
      
      const success = await markAnalysisComplete('birth', formData);
      
      if (success) {
        console.log('✅ Dados salvos com sucesso');
        router.push('/analysis'); // Voltar para o hub
      } else {
        setError('Erro ao salvar dados. Tente novamente.');
      }
    } catch (err) {
      console.error('❌ Erro ao salvar:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: {
        ...prev.birthPlace,
        [field]: value
      }
    }));
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

  return (
    <AnalysisLayout
      title="Dados de Nascimento"
      subtitle="Base para a análise astrológica e numerológica"
      icon={<Calendar className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <FormCard className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Informações Pessoais
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={inputClass}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <Clock className="w-4 h-4 text-purple-600" />
                    Horário de Nascimento
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Procure no documento de nascimento ou pergunte aos familiares.
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Local de Nascimento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cidade</label>
                <input
                  type="text"
                  value={formData.birthPlace.city}
                  onChange={(e) => handlePlaceChange('city', e.target.value)}
                  className={inputClass}
                  placeholder="Ex: São Luís"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Estado/Região</label>
                <input
                  type="text"
                  value={formData.birthPlace.state}
                  onChange={(e) => handlePlaceChange('state', e.target.value)}
                  className={inputClass}
                  placeholder="Ex: MA"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>País</label>
                <input
                  type="text"
                  value={formData.birthPlace.country}
                  onChange={(e) => handlePlaceChange('country', e.target.value)}
                  className={inputClass}
                  placeholder="Brasil"
                  required
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar e Continuar
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs">
            💡 Suas informações são usadas apenas para os cálculos da análise.
          </p>
        </FormCard>
      </form>
    </AnalysisLayout>
  );
};

export default BirthAnalysis;