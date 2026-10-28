// src/components/ui/FormCard.tsx
// Cartão claro para conteúdo de leitura (questionários, formulários).
// Texto escuro sobre fundo branco garante contraste em leituras longas.

import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export default function FormCard({ children, className = '', padded = true }: FormCardProps) {
  return (
    <div
      className={`bg-white text-gray-900 rounded-2xl shadow-xl shadow-black/20 ring-1 ring-black/5 ${
        padded ? 'p-6 sm:p-8' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
