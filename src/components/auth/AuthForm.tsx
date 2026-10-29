// src/components/auth/AuthForm.tsx - VERSÃO CORRIGIDA
// ============================================================================
// 🔧 CORREÇÃO: Usar useAuth hook ao invés de imports diretos que não existem
// ============================================================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth'; // ✅ USAR O HOOK
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import InAppBrowserNotice from './InAppBrowserNotice';
import { detectInAppBrowser, InAppInfo } from '../../utils/inAppBrowser';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  
  // ✅ USAR O HOOK useAuth QUE JÁ TEM TODAS AS FUNÇÕES
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  
  // Estados locais do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Destino após autenticar: ?next= (definido pelo RequireAuth) ou o hub
  const nextParam = typeof router.query.next === 'string' ? router.query.next : '';
  const redirectTo =
    nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/analysis';

  // Navegador interno (WhatsApp, Instagram…): o Google bloqueia o login ali
  const [inApp, setInApp] = useState<InAppInfo | null>(null);
  useEffect(() => {
    const info = detectInAppBrowser();
    if (info.inApp) setInApp(info);
  }, []);

  // Já autenticado (inclusive voltando do Google): segue para o destino
  useEffect(() => {
    if (!authLoading && user && router.isReady) {
      router.replace(redirectTo);
    }
  }, [authLoading, user, router, redirectTo]);

  // Erro devolvido no retorno do OAuth (?error_description= ou #error_description=)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search + '&' + window.location.hash.replace(/^#/, ''));
    const desc = params.get('error_description');
    if (desc) {
      console.error('Erro no retorno do login com Google:', desc);
      setError(`Não foi possível entrar com o Google: ${desc.replace(/\+/g, ' ')}`);
    }
  }, []);

  // ============================================================================
  // HANDLER: LOGIN/SIGNUP COM EMAIL
  // ============================================================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validações básicas
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (mode === 'signup') {
        // Validações adicionais para signup
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }

        // ✅ USAR A FUNÇÃO DO HOOK
        const { session } = await signUpWithEmail(email, password);

        if (!session) {
          // Confirmação de email ativa no Supabase: ainda não há sessão
          setSuccess('Conta criada! Enviamos um link de confirmação para o seu email. Confirme e depois faça login.');
          return;
        }

        setSuccess('Conta criada com sucesso! Redirecionando...');

        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
        
      } else {
        // Login
        // ✅ USAR A FUNÇÃO DO HOOK
        await signInWithEmail(email, password);
        
        setSuccess('Login realizado! Redirecionando...');
        
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      }

    } catch (err: any) {
      console.error('❌ Erro na autenticação:', err);
      
      // Traduzir erros comuns do Supabase
      let errorMessage = err.message;
      
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (err.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // HANDLER: LOGIN COM GOOGLE
  // ============================================================================
  
  const handleGoogleSignIn = async () => {
    setError('');
    if (inApp) {
      setError('O Google não permite entrar pelo navegador deste aplicativo. Use o aviso acima para abrir no navegador.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setGoogleLoading(true);

    try {
      // ✅ USAR A FUNÇÃO DO HOOK
      await signInWithGoogle(redirectTo);
      
      // O redirect é automático via OAuth
      // Não precisa fazer nada aqui
      
    } catch (err: any) {
      console.error('❌ Erro no login com Google:', err);
      setError('Erro ao fazer login com Google. Tente novamente.');
      setGoogleLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        
        {inApp && <InAppBrowserNotice info={inApp} />}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar sua conta'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Entre para continuar sua jornada' 
              : 'Comece sua jornada de evolução'}
          </p>
        </div>

        {/* Mensagens de erro/sucesso */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          {/* Confirmar senha (apenas signup) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>
          )}

          {/* Botão submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              mode === 'login' ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Botão Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {googleLoading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </>
          )}
        </button>

        {/* Link para trocar modo */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/signup')}
                  className="text-purple-600 font-semibold hover:text-purple-700"
                  disabled={loading || googleLoading}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="text-purple-600 font-semibold hover:text-purple-700"
                  disabled={loading || googleLoading}
                >
                  Fazer login
                </button>
              </>
            )}
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            Ao continuar, você concorda com a{' '}
            <a href="/privacidade" className="text-purple-600 underline hover:text-purple-700">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
