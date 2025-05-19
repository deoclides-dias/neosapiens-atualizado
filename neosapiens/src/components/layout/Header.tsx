import { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Efeito para detectar scroll e mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-indigo-900 bg-opacity-95 shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo SVG em vez da imagem */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <svg viewBox="0 0 50 50" className="w-full h-full">
                {/* Círculo externo */}
                <circle cx="25" cy="25" r="23" fill="none" stroke="#fff" strokeWidth="1.5" />
                
                {/* Triângulo central estilizado */}
                <path 
                  d="M25,9 L38,36 L12,36 Z" 
                  fill="none" 
                  stroke="#fff" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                
                {/* Pontos das três dimensões */}
                <circle cx="25" cy="9" r="3" fill="#9333EA" /> {/* Propósito */}
                <circle cx="12" cy="36" r="3" fill="#22C55E" /> {/* Corpo */}
                <circle cx="38" cy="36" r="3" fill="#3B82F6" /> {/* Mente */}
                
                {/* Pequeno círculo central */}
                <circle cx="25" cy="25" r="2" fill="#fff" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold tracking-wider">NeoSapiens</span>
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="#crise">A Crise</NavLink>
          <NavLink href="#pilares">Os Pilares</NavLink>
          <NavLink href="#metodologia">Metodologia</NavLink>
          <NavLink href="#avaliacao">Avaliação</NavLink>
          <NavLink href="#plano-de-voo">Plano de Voo</NavLink>
          <NavLink href="#jornada">Jornada</NavLink>
          <NavLink href="#sobre">Sobre</NavLink>
          <button 
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            onClick={() => {
              document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Iniciar Jornada
          </button>
        </nav>

        {/* Menu Mobile - Botão Hambúrguer */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Mobile - Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-900 bg-opacity-95">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink href="#crise" onClick={() => setMenuOpen(false)}>A Crise</MobileNavLink>
            <MobileNavLink href="#pilares" onClick={() => setMenuOpen(false)}>Os Pilares</MobileNavLink>
            <MobileNavLink href="#metodologia" onClick={() => setMenuOpen(false)}>Metodologia</MobileNavLink>
            <MobileNavLink href="#avaliacao" onClick={() => setMenuOpen(false)}>Avaliação</MobileNavLink>
            <MobileNavLink href="#plano-de-voo" onClick={() => setMenuOpen(false)}>Plano de Voo</MobileNavLink>
            <MobileNavLink href="#jornada" onClick={() => setMenuOpen(false)}>Jornada</MobileNavLink>
            <MobileNavLink href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</MobileNavLink>
            <button 
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              onClick={() => {
                document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              Iniciar Jornada
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Componente para links de navegação na versão desktop
const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link 
    href={href}
    className="text-white hover:text-purple-300 transition-colors duration-300 font-medium"
    onClick={(e) => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    {children}
  </Link>
);

// Componente para links de navegação na versão mobile
const MobileNavLink = ({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) => (
  <Link 
    href={href}
    className="text-white hover:text-purple-300 transition-colors duration-300 font-medium py-2 block text-center"
    onClick={(e) => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      onClick();
    }}
  >
    {children}
  </Link>
);

export default Header;