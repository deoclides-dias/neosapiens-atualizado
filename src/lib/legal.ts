// src/lib/legal.ts
// Versões e contatos da Política de Privacidade e dos Termos de Uso.
// Ao mudar o texto de /privacidade ou /termos, atualize LEGAL_VERSION:
// quem já tem conta verá o aviso pedindo o aceite da versão nova.

export const LEGAL_VERSION = '2026-11-09';
export const LEGAL_VERSION_LABEL = '9 de novembro de 2026';
export const PRIVACY_EMAIL = 'privacidade@souneosapiens.com.br';
export const CONTACT_EMAIL = 'contato@souneosapiens.com.br';

export interface TermsAcceptance {
  version: string;
  acceptedAt: string;
}

export interface ResearchConsent {
  ok: boolean;
  version: string;
  at: string;
}

export const termsAccepted = (meta: any) => meta?.termos?.version === LEGAL_VERSION;
