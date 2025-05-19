import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Tagline */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <div className="relative h-12 w-48">
                <Image 
                  src="/images/neosapiens-logo.svg" 
                  alt="NeoSapiens" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 italic">
              "Despertando propósitos, elevando potencialidades"
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#crise" className="text-gray-300 hover:text-white transition-colors duration-300">
                  A Crise Invisível
                </Link>
              </li>
              <li>
                <Link href="#pilares" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Os Três Pilares
                </Link>
              </li>
              <li>
                <Link href="#metodologia" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Metodologia Integrativa
                </Link>
              </li>
              <li>
                <Link href="#jornada" className="text-gray-300 hover:text-white transition-colors duration-300">
                  A Jornada NeoSapiens
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Sobre o Capitão
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Recursos */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/manifesto" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Manifesto NeoSapiens
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/glossario" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Glossário NeoSapiens
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contato e Redes Sociais */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Contato</h3>
            <p className="text-gray-300 mb-2">apoio@neosapiens.com.br</p>
            
            <h4 className="text-purple-300 font-medium mt-6 mb-2">Siga-nos</h4>
            <div className="flex space-x-4">
              {/* Instagram */}
              <Link href="https://instagram.com/neosapiens" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {/* YouTube */}
              <Link href="https://youtube.com/neosapiens" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </Link>
              
              {/* Spotify */}
              <Link href="https://spotify.com/neosapiens" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Linha de Separação */}
        <div className="border-t border-indigo-800 my-8"></div>
        
        {/* Copyright e Links de Políticas */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} NeoSapiens. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap justify-center space-x-4">
            <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Política de Privacidade
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;