// src/components/forms/PlaceAutocomplete.tsx
// Campo de cidade com sugestões do Google (Places API New).
// Ao escolher uma cidade, devolve nome, cidade/estado/país, coordenadas e
// fuso horário. Se o Google não estiver disponível, cai para digitação manual.

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader, X } from 'lucide-react';
import { hasMapsKey, loadGoogleMaps } from '../../lib/googleMaps';
import { timezoneFromCoordinates } from '../../utils/timezone';

export interface BirthPlace {
  name?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
}

interface Suggestion {
  placeId: string;
  main: string;
  secondary: string;
  prediction: any;
}

interface PlaceAutocompleteProps {
  value: BirthPlace;
  onChange: (place: BirthPlace) => void;
  inputClass: string;
  labelClass: string;
}

const pickComponent = (components: any[], type: string, short = false) => {
  const c = components?.find((x: any) => x.types?.includes(type));
  return c ? (short ? c.shortText : c.longText) || '' : '';
};

export default function PlaceAutocomplete({ value, onChange, inputClass, labelClass }: PlaceAutocompleteProps) {
  const [mode, setMode] = useState<'loading' | 'google' | 'manual'>(hasMapsKey() ? 'loading' : 'manual');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placesLib = useRef<any>(null);
  const sessionToken = useRef<any>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  const hasCoordinates = typeof value.latitude === 'number' && typeof value.longitude === 'number';

  // Carregar a biblioteca Places
  useEffect(() => {
    if (mode !== 'loading') return;
    let cancelled = false;

    // O Google chama esta função quando a chave é recusada (ex.: site não autorizado)
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps recusou a chave neste endereço; usando digitação manual');
      if (!cancelled) setMode('manual');
    };

    loadGoogleMaps()
      .then(async (google) => {
        const lib = await google.maps.importLibrary('places');
        if (cancelled) return;
        placesLib.current = lib;
        sessionToken.current = new lib.AutocompleteSessionToken();
        setMode('google');
      })
      .catch((err) => {
        console.warn('Autocomplete indisponível:', err);
        if (!cancelled) setMode('manual');
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  // Buscar sugestões enquanto a pessoa digita
  useEffect(() => {
    if (mode !== 'google') return;
    if (debounce.current) clearTimeout(debounce.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounce.current = setTimeout(async () => {
      const id = ++requestId.current;
      try {
        const { suggestions: result } =
          await placesLib.current.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: sessionToken.current,
            language: 'pt-BR',
            includedPrimaryTypes: ['(cities)']
          });
        if (id !== requestId.current) return;

        setSuggestions(
          (result || [])
            .filter((s: any) => s.placePrediction)
            .slice(0, 6)
            .map((s: any) => ({
              placeId: s.placePrediction.placeId,
              main: s.placePrediction.mainText?.toString() || s.placePrediction.text.toString(),
              secondary: s.placePrediction.secondaryText?.toString() || '',
              prediction: s.placePrediction
            }))
        );
        setActive(0);
        setOpen(true);
        setError(null);
      } catch (err) {
        console.warn('Erro ao buscar sugestões:', err);
        setError('Não foi possível buscar sugestões agora.');
      }
    }, 250);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, mode]);

  const choose = async (s: Suggestion) => {
    setBusy(true);
    setOpen(false);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ['location', 'addressComponents', 'formattedAddress', 'displayName'] });

      const lat = place.location?.lat();
      const lng = place.location?.lng();
      const comps = place.addressComponents || [];

      const city =
        pickComponent(comps, 'locality') ||
        pickComponent(comps, 'administrative_area_level_2') ||
        place.displayName ||
        s.main;

      const state = pickComponent(comps, 'administrative_area_level_1', true);
      const country = pickComponent(comps, 'country');

      onChange({
        // formattedAddress traz CEP ("Pinheiro, MA, 65200-000"); montamos o nome limpo
        name: [city, state, country].filter(Boolean).join(', ') || `${s.main}, ${s.secondary}`,
        city,
        state,
        country,
        latitude: typeof lat === 'number' ? Number(lat.toFixed(6)) : undefined,
        longitude: typeof lng === 'number' ? Number(lng.toFixed(6)) : undefined,
        timezone:
          typeof lat === 'number' && typeof lng === 'number'
            ? timezoneFromCoordinates(lat, lng) || undefined
            : undefined,
        placeId: s.placeId
      });

      setQuery('');
      setSuggestions([]);
      // Nova sessão para a próxima busca (cobrança por sessão no Google)
      sessionToken.current = new placesLib.current.AutocompleteSessionToken();
    } catch (err) {
      console.warn('Erro ao obter detalhes do lugar:', err);
      setError('Não foi possível obter as coordenadas dessa cidade. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    onChange({ city: '', state: '', country: 'Brasil' });
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Modo manual (sem Google): os três campos de antes
  // ---------------------------------------------------------------------------
  if (mode === 'manual') {
    const set = (field: 'city' | 'state' | 'country', v: string) =>
      onChange({ ...value, [field]: v, latitude: undefined, longitude: undefined, timezone: undefined, name: undefined });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cidade</label>
          <input type="text" value={value.city} onChange={(e) => set('city', e.target.value)} className={inputClass} placeholder="Ex: São Luís" required />
        </div>
        <div>
          <label className={labelClass}>Estado/Região</label>
          <input type="text" value={value.state} onChange={(e) => set('state', e.target.value)} className={inputClass} placeholder="Ex: MA" required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>País</label>
          <input type="text" value={value.country} onChange={(e) => set('country', e.target.value)} className={inputClass} placeholder="Brasil" required />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Cidade já escolhida
  // ---------------------------------------------------------------------------
  if (hasCoordinates && value.city) {
    return (
      <div>
        <label className={labelClass}>Cidade de nascimento</label>
        <div className="flex items-start justify-between gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <div className="flex items-start gap-3 min-w-0">
            <MapPin className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{value.name || `${value.city}, ${value.state}, ${value.country}`}</p>
              <p className="text-xs text-gray-600">
                {value.latitude!.toFixed(4)}, {value.longitude!.toFixed(4)}
                {value.timezone ? ` · ${value.timezone}` : ''}
              </p>
            </div>
          </div>
          <button type="button" onClick={clear} className="text-sm text-purple-700 hover:text-purple-900 shrink-0">
            Trocar
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Busca com sugestões
  // ---------------------------------------------------------------------------
  return (
    <div className="relative">
      <label className={labelClass}>Cidade de nascimento</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={`${inputClass} pr-10`}
          placeholder={mode === 'loading' ? 'Carregando sugestões...' : 'Comece a digitar a cidade'}
          disabled={mode === 'loading' || busy}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          required={!hasCoordinates}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {mode === 'loading' || busy ? <Loader className="w-4 h-4 animate-spin" /> : query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpar">
              <X className="w-4 h-4" />
            </button>
          )}
        </span>
      </div>

      {open && suggestions.length > 0 && (
        <ul role="listbox" className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(s)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 ${i === active ? 'bg-purple-50' : ''}`}
            >
              <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.main}</p>
                {s.secondary && <p className="text-xs text-gray-500 truncate">{s.secondary}</p>}
              </div>
            </li>
          ))}
          <li className="px-4 py-1.5 text-right text-[10px] text-gray-400">powered by Google</li>
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        Escolha a cidade na lista para salvarmos as coordenadas e o fuso horário.{' '}
        <button type="button" className="underline hover:text-gray-700" onClick={() => setMode('manual')}>
          Prefiro digitar
        </button>
      </p>
    </div>
  );
}
