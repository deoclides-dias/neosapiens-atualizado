// src/components/ui/AnalysisLayout.tsx
// Moldura padrão das páginas de análise do NeoSapiens:
// fundo escuro (identidade "ancestral") com cabeçalho translúcido.
// O conteúdo de leitura vai dentro de um <FormCard> claro.

import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

interface AnalysisLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backHref?: string;
  backLabel?: string;
  rightSlot?: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
  children: ReactNode;
}

const WIDTHS = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
};

export default function AnalysisLayout({
  title,
  subtitle,
  icon,
  backHref = '/analysis',
  backLabel = 'Voltar ao Hub',
  rightSlot,
  maxWidth = 'lg',
  children
}: AnalysisLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className={`${WIDTHS[maxWidth]} mx-auto px-4 py-4 flex items-center justify-between gap-4`}>
          <button
            onClick={() => router.push(backHref)}
            className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>

          <div className="flex items-center gap-3 min-w-0">
            {icon && <span className="text-purple-300 shrink-0">{icon}</span>}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-white truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-purple-200 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="text-sm text-purple-200 min-w-0 truncate">{rightSlot}</div>
        </div>
      </header>

      <main className={`${WIDTHS[maxWidth]} mx-auto px-4 py-8`}>{children}</main>
    </div>
  );
}
