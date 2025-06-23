import { useState } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleStartJourney = () => {
    router.push('/auth/signup');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NS</span>
            </div>
            <span className="text-white font-semibold text-xl">NeoSapiens</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sobre" className="text-white/90 hover:text-white transition-colors">
              Sobre
            </a>
            <a href="#metodologia" className="text-white/90 hover:text-white transition-colors">
              Metodologia
            </a>
            <a href="#questionario" className="text-white/90 hover:text-white transition-colors">
              Avaliação
            </a>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Login
            </button>
          </div>

          {/* CTA Button */}
          <button
            className="hidden md:block px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            onClick={handleStartJourney}
          >
            Iniciar Jornada
          </button>

          {/* Menu Mobile - Botão Hambúrguer */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </nav>

        {/* Menu Mobile - Dropdown */}
        <div className={`md:hidden transition-all duration-300 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4 border-t border-white/10">
            <a href="#sobre" className="block text-white/90 hover:text-white transition-colors">
              Sobre
            </a>
            <a href="#metodologia" className="block text-white/90 hover:text-white transition-colors">
              Metodologia
            </a>
            <a href="#questionario" className="block text-white/90 hover:text-white transition-colors">
              Avaliação
            </a>
            <button
              onClick={() => {
                router.push('/auth/login');
                setMenuOpen(false);
              }}
              className="block text-white/90 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              className="w-full text-left px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              onClick={() => {
                handleStartJourney();
                setMenuOpen(false);
              }}
            >
              Iniciar Jornada
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
