import { DM_Sans, Inter, Noto_Sans_Armenian } from 'next/font/google';
import { megatroxFont } from '@/lib/fonts/megatrox';

/**
 * Site font stack (next/font).
 *
 * - Inter: Latin + Cyrillic UI (en / ru)
 * - Noto Sans Armenian (variable + wdth): Armenian script; condensed width
 *   matches Inter’s compact metrics more closely than the default full width
 * - DM Sans: Latin-only accent UI (en); hy/ru fall back to --font-ui tokens
 * - Megatrox: brand display (Latin); script fallbacks via --font-display
 */
export const interFont = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const dmSansFont = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const notoArmenianFont = Noto_Sans_Armenian({
  variable: '--font-noto-armenian',
  subsets: ['armenian', 'latin'],
  axes: ['wdth'],
  display: 'swap',
});

export const siteFontVariablesClassName = [
  interFont.variable,
  dmSansFont.variable,
  notoArmenianFont.variable,
  megatroxFont.variable,
].join(' ');
