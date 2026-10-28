// src/pages/_app.tsx
import '@/styles/globals.css';
import '@/styles/questionnaire-animations.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import RequireAuth from '../components/auth/RequireAuth';

// Rotas que só podem ser acessadas com sessão ativa
const PROTECTED_PREFIXES = ['/analysis', '/results', '/results-hub'];

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (isProtected(router.pathname)) {
    return (
      <RequireAuth>
        <Component {...pageProps} />
      </RequireAuth>
    );
  }

  return <Component {...pageProps} />;
}
