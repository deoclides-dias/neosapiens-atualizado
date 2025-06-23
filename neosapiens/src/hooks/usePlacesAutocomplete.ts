import { useState, useCallback } from 'react';
import { PlaceSuggestion } from '../types/onboarding';

export const usePlacesAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implementar Google Places API real
      // Por enquanto, mock data
      const mockSuggestions: PlaceSuggestion[] = [
        {
          name: `${query}, São Paulo, SP, Brasil`,
          coordinates: { lat: -23.5505, lng: -46.6333 },
          timezone: 'America/Sao_Paulo',
          city: query,
          state: 'São Paulo',
          country: 'Brasil'
        },
        {
          name: `${query}, Rio de Janeiro, RJ, Brasil`, 
          coordinates: { lat: -22.9068, lng: -43.1729 },
          timezone: 'America/Sao_Paulo',
          city: query,
          state: 'Rio de Janeiro', 
          country: 'Brasil'
        }
      ];

      // Simular delay da API
      setTimeout(() => {
        setSuggestions(mockSuggestions);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Erro ao buscar lugares:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  }, []);

  return {
    suggestions,
    isLoading,
    searchPlaces
  };
};
