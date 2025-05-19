import { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../components/layout/Layout';
import HeroSection from '../components/hero/HeroSection';
import CrisisSection from '../components/crisis/CrisisSection';
import PillarsSection from '../components/pillars/PillarsSection';
import MethodologySection from '../components/methodology/MethodologySection';
import JourneySection from '../components/journey/JourneySection';
import AboutSection from '../components/about/AboutSection';
import SignupSection from '../components/signup/SignupSection';

// Dynamic imports for performance optimization
const QuestionnaireSection = dynamic(
  () => import('../components/questionnaire/QuestionnaireSection'),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 text-center text-gray-500">Carregando questionário...</div>
    ),
  }
);

// New components with dynamic imports for better performance
const AssessmentSection = dynamic(
  () => import('../components/assessment/AssessmentSection'),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 text-center text-gray-500">Carregando avaliação...</div>
    ),
  }
);

const FlightPlanSection = dynamic(
  () => import('../components/flight-plan/FlightPlanSection'),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 text-center text-gray-500">Carregando plano de voo...</div>
    ),
  }
);

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
          section.classList.add('visible');
        }
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>NeoSapiens | Desperte seu potencial tridimensional</title>
        <meta name="description" content="NeoSapiens é uma metodologia tridimensional que integra clareza de propósito, vitalidade corporal e maestria mental em um sistema coerente de desenvolvimento." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%3E%3Crect%20width='32'%20height='32'%20fill='white'/%3E%3Ctext%20x='16'%20y='22'%20font-size='24'%20text-anchor='middle'%20fill='%234F46E5'%3E%E2%88%9E%3C/text%3E%3C/svg%3E" />
        <meta property="og:description" content="Uma metodologia tridimensional que integra propósito, corpo e mente." />
        <meta property="og:image" content="https://via.placeholder.com/1200x630/4F46E5/FFFFFF/?text=NeoSapiens+OG+Image" />
        <meta property="og:url" content="https://neosapiens.com.br" />
        <meta property="og:type" content="website" />
      </Head>

      <Layout>
        <HeroSection />
        <main>
          <CrisisSection />
          <PillarsSection />
          <MethodologySection />
          <AssessmentSection /> {/* Nova seção de Avaliação */}
          <FlightPlanSection /> {/* Nova seção de Plano de Voo */}
          <JourneySection />
          <AboutSection />
          <QuestionnaireSection /> {/* Já existente */}
          <SignupSection />
        </main>
      </Layout>
    </>
  );
}