import { useState } from 'react';
import SignupForm from './SignupForm';

const SignupSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Simular envio de formulário
  const handleSubmit = (email: string, name?: string) => {
    // Em produção, aqui faria a conexão com a API para cadastro
    console.log('Formulário enviado:', { email, name });
    
    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <section id="signup" className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {!isSubmitted ? (
            // Formulário de Cadastro
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Junte-se aos Neo-Navegantes
                </h2>
                
                <p className="text-lg text-indigo-200 leading-relaxed">
                  Cadastre-se para receber seu Plano de Voo personalizado e iniciar sua jornada de desenvolvimento integrado nas três dimensões fundamentais do ser.
                </p>
              </div>
              
              <SignupForm onSubmit={handleSubmit} />
            </>
          ) : (
            // Mensagem de Sucesso após Envio
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Parabéns pela decisão!
              </h2>
              
              <p className="text-lg text-indigo-200 leading-relaxed mb-8">
                Seu cadastro foi recebido com sucesso. Em breve você receberá um email com os próximos passos para iniciar sua jornada NeoSapiens.
              </p>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Próximos Passos:</h3>
                
                <ol className="list-decimal list-inside space-y-3 text-left">
                  <li className="text-indigo-100">
                    Verifique sua caixa de entrada (e pasta de spam) para encontrar o email de boas-vindas
                  </li>
                  <li className="text-indigo-100">
                    Clique no link para acessar o questionário tridimensional completo
                  </li>
                  <li className="text-indigo-100">
                    Complete a avaliação (leva aproximadamente 20-30 minutos)
                  </li>
                  <li className="text-indigo-100">
                    Receba seu Plano de Voo personalizado em até 24 horas
                  </li>
                  <li className="text-indigo-100">
                    Inicie o protocolo de 7 dias para experimentar a abordagem NeoSapiens
                  </li>
                </ol>
              </div>
              
              <div className="mt-8">
                <p className="text-indigo-200 mb-4">
                  Enquanto isso, você pode nos seguir nas redes sociais:
                </p>
                
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://instagram.com/neosapiens" 
                    className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  
                  <a 
                    href="https://twitter.com/neosapiens" 
                    className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  
                  <a 
                    href="https://youtube.com/neosapiens" 
                    className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignupSection;