import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { AppProviders } from './_components/app-providers';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './_components/home-constants';
import { siteFontVariablesClassName } from '@/lib/fonts/site-fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neetrino',
  description: 'Neetrino full stack web application',
};

/** Keep mobile at device width / 1:1 — no canvas or browser zoom-out. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Sets --home-canvas-scale before first paint via a <style> tag (not html[style]),
 * so React hydration does not see a mismatched style attribute on <html>.
 */
const CANVAS_SCALE_BOOT_SCRIPT = `(function(){var m=${HOME_DESKTOP_MIN_WIDTH},d=${HOME_DESIGN_WIDTH},w=window.innerWidth,s=w>=m?String(w/d):'1';if(document.querySelector('style[data-canvas-scale-boot]'))return;var el=document.createElement('style');el.setAttribute('data-canvas-scale-boot','');el.textContent=':root{--home-canvas-scale:'+s+'}';document.head.appendChild(el);})();`;

/**
 * Applies stored locale to <html lang> before paint so hy/ru typography tokens
 * activate without a flash of Inter fallback for Armenian glyphs.
 */
const LOCALE_LANG_BOOT_SCRIPT = `(function(){try{var p=location.pathname;var admin=p==='/admin'||p.indexOf('/admin/')===0||p.indexOf('/admin-login')===0;var k=admin?'neetrino.admin.locale':'neetrino.home.locale';var v=localStorage.getItem(k);if(v==='hy'||v==='ru'||v==='en')document.documentElement.lang=v;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    // Boot script may set lang from localStorage before hydrate; mismatch is intentional.
    <html lang="en" className={`${siteFontVariablesClassName} antialiased`} suppressHydrationWarning>
      <body className="flex flex-col">
        <Script id="canvas-scale-boot" strategy="beforeInteractive">
          {CANVAS_SCALE_BOOT_SCRIPT}
        </Script>
        <Script id="locale-lang-boot" strategy="beforeInteractive">
          {LOCALE_LANG_BOOT_SCRIPT}
        </Script>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
