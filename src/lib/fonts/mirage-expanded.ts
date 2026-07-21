import localFont from 'next/font/local';

/**
 * Mirage Expanded — display titles for hy/ru (Armenian + Latin uppercase).
 * Cyrillic glyphs fall through to the configured fallback stack.
 */
export const mirageExpandedFont = localFont({
  src: '../../../static/fonts/Mirage-Expanded.otf',
  variable: '--font-mirage-expanded',
  display: 'swap',
  weight: '400',
});
