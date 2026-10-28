// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  useEffect(() => {
    // Obter usuário atual
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('Erro ao obter usuário:', error);
        }
        setAuthState({ user, loading: false });
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthState({ user: null, loading: false });
      }
    };

    getCurrentUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({ 
          user: session?.user ?? null, 
          loading: false 
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/analysis`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro no login com email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/analysis`
        }
      });

      if (error) throw error;

      // session é null quando o Supabase exige confirmação de email
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    isAuthenticated: !!authState.user
  };
}