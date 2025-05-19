import '@/styles/globals.css'; // Isso importa o seu CSS
import '@/styles/questionnaire-animations.css'; // Adicione esta linha

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}