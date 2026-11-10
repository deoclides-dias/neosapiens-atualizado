// src/components/legal/LegalLayout.tsx
// Moldura comum das páginas públicas /privacidade e /termos.

import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { LEGAL_VERSION_LABEL, PRIVACY_EMAIL } from '../../lib/legal';

const SERIF = "'Cormorant Garamond', Georgia, serif";

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-2xl font-bold text-indigo-950" style={{ fontFamily: SERIF }}>
        {titulo}
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export function Tabela({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm border-collapse min-w-[480px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="text-left font-semibold text-gray-900 bg-purple-50 border-b border-purple-200 px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className="border-b border-gray-100 px-3 py-2 text-gray-700">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Email = ({ to = PRIVACY_EMAIL }: { to?: string }) => (
  <a href={`mailto:${to}`} className="text-purple-700 font-semibold underline break-all">
    {to}
  </a>
);

export default function LegalLayout({
  title,
  description,
  other,
  children
}: {
  title: string;
  description: string;
  other: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{title} — NeoSapiens</title>
        <meta name="description" content={description} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-black/25 p-6 sm:p-10 flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">NeoSapiens</p>
            <h1 className="m-0 text-4xl font-bold text-indigo-950" style={{ fontFamily: SERIF }}>
              {title}
            </h1>
            <p className="m-0 text-sm text-gray-600">Versão de {LEGAL_VERSION_LABEL}</p>
          </header>
          {children}
          <footer className="pt-6 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-purple-700 font-semibold">
              Voltar ao NeoSapiens
            </Link>
            <Link href={other.href} className="text-purple-700 font-semibold">
              {other.label}
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}
