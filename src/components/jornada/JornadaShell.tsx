// src/components/jornada/JornadaShell.tsx
import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DISPLAY_FONT } from '../traditions/ui';

export default function JornadaShell({ back, backLabel, eyebrow, title, intro, children }: { back: string; backLabel: string; eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <Head>
        <title>{`${title} — NeoSapiens`}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-8 pb-16 flex flex-col gap-7">
          <Link href={back} className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white w-fit min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>
          <header className="flex flex-col gap-3">
            <p className="m-0 text-[13px] tracking-[0.12em] uppercase text-purple-200 font-semibold">{eyebrow}</p>
            <h1 className="m-0 text-4xl sm:text-5xl leading-tight font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
              {title}
            </h1>
            {intro && <div className="m-0 max-w-2xl text-[15px] leading-relaxed text-purple-100">{intro}</div>}
          </header>
          {children}
        </div>
      </div>
    </>
  );
}
