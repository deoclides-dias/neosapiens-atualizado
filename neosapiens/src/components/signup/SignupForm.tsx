import { useState } from 'react';

type SignupFormProps = {
  onSubmit: (email: string, name?: string) => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
  }>({});
  
  // Validar email
  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Gerenciar mudanças no campo de email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Limpar erro se o campo não estiver vazio
    if (e.target.value.trim() !== '') {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };
  
  // Gerenciar mudanças no campo de nome
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    
    // Não é obrigatório então não precisa validar
  };
  
  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      name?: string;
    } = {};
    
    // Validar email
    if (email.trim() === '') {
      newErrors.email = 'O email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor, insira um email válido';
    }
    
    // Atualizar erros
    setErrors(newErrors);
    
    // Retornar true se não houver erros
    return Object.keys(newErrors).length === 0;
  };
  
  // Gerenciar envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
      return;
    }
    
    // Simular carregamento
    setIsLoading(true);
    
    // Enviar dados
    setTimeout(() => {
      onSubmit(email, name || undefined);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-1">
            Email <span className="text-red-300">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="seu@email.com"
            className={`
              w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-indigo-200
              border-2 focus:outline-none focus:ring-2 transition-all duration-200
              ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-transparent focus:border-indigo-300 focus:ring-indigo-500'}
            `}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-red-300 text-sm">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-white font-medium mb-1">
            Nome (opcional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Como podemos te chamar?"
            className="
              w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-indigo-200
              border-2 border-transparent focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500
              transition-all duration-200
            "
            disabled={isLoading}
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3 rounded-lg font-medium transition-all duration-300
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando...</span>
              </div>
            ) : (
              'Iniciar minha jornada'
            )}
          </button>
        </div>
        
        <div className="text-center text-indigo-200 text-sm">
          <p>
            Ao se cadastrar, você concorda com nossa {' '}
            <a href="/privacidade" className="text-white underline hover:text-indigo-100 transition-colors duration-200">
              Política de Privacidade
            </a>
            {' '} e {' '}
            <a href="/termos" className="text-white underline hover:text-indigo-100 transition-colors duration-200">
              Termos de Uso
            </a>.
          </p>
          <p className="mt-2">
            Nós respeitamos sua privacidade. Você pode cancelar a inscrição a qualquer momento.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;