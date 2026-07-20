import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { DM_Sans, Inter, Noto_Sans_Armenian } from 'next/font/google';
import { AppProviders } from './_components/app-providers';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './_components/home-constants';
import { megatroxFont } from '@/lib/fonts/megatrox';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const notoArmenian = Noto_Sans_Armenian({
  variable: '--font-noto-armenian',
  subsets: ['armenian'],
  weight: ['300', '400', '500', '600', '700'],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${notoArmenian.variable} ${megatroxFont.variable} antialiased`}
    >
      <body className="flex flex-col">
        <Script id="canvas-scale-boot" strategy="beforeInteractive">
          {CANVAS_SCALE_BOOT_SCRIPT}
        </Script>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
