// src/utils/inAppBrowser.ts
// Detecta navegadores internos de apps (WhatsApp, Instagram, Facebook…),
// onde o Google bloqueia o login ("Este navegador ou app pode não ser seguro").

export interface InAppInfo {
  inApp: boolean;
  app: string | null;
  platform: 'android' | 'ios' | 'other';
}

const APPS: [RegExp, string][] = [
  [/WhatsApp/i, 'WhatsApp'],
  [/Instagram/i, 'Instagram'],
  [/FBAN|FBAV|FB_IAB|FBIOS/i, 'Facebook'],
  [/Messenger/i, 'Messenger'],
  [/LinkedInApp/i, 'LinkedIn'],
  [/Twitter/i, 'X (Twitter)'],
  [/TikTok|musical_ly|BytedanceWebview/i, 'TikTok'],
  [/Telegram/i, 'Telegram'],
  [/\bLine\//i, 'Line'],
  [/Snapchat/i, 'Snapchat']
];

export function detectInAppBrowser(ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : ''): InAppInfo {
  const platform: InAppInfo['platform'] = /Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) ? 'ios' : 'other';
  const named = APPS.find(([re]) => re.test(ua));
  if (named) return { inApp: true, app: named[1], platform };

  // WebView genérico: Android marca "; wv)"; no iOS, WKWebView não traz "Safari/"
  const androidWebView = platform === 'android' && /; wv\)/i.test(ua);
  const iosWebView = platform === 'ios' && /AppleWebKit/i.test(ua) && !/Safari\//i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
  return { inApp: androidWebView || iosWebView, app: null, platform };
}

/** Link que pede ao Android para abrir a página atual no Chrome. */
export function chromeIntentUrl(href: string): string {
  const url = new URL(href);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${url.protocol.replace(':', '')};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
}
