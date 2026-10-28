// src/lib/googleMaps.ts
// Carrega o Google Maps JavaScript API uma única vez (Places API New).
// A chave é a pública NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, restrita por site
// no Google Cloud (produção e localhost).

// Acesso sem tipagem: src/types/global.d.ts já declara um `window.google` antigo
const w = () => window as unknown as { google?: any; __neoMapsReady?: () => void };

let loadingPromise: Promise<any> | null = null;

export function hasMapsKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

export function loadGoogleMaps(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps só carrega no navegador'));
  }
  if (w().google?.maps?.importLibrary) {
    return Promise.resolve(w().google);
  }
  if (loadingPromise) return loadingPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.reject(new Error('Chave do Google Maps não configurada'));

  loadingPromise = new Promise((resolve, reject) => {
    w().__neoMapsReady = () => resolve(w().google);

    const script = document.createElement('script');
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&v=weekly&loading=async&language=pt-BR&region=BR&callback=__neoMapsReady`;
    script.async = true;
    script.onerror = () => {
      loadingPromise = null;
      reject(new Error('Falha ao carregar o Google Maps'));
    };
    document.head.appendChild(script);
  });

  return loadingPromise;
}
