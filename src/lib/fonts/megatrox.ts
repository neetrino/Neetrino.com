import localFont from 'next/font/local';

/** Megatrox display face — Figma brand titles (node 1:1136 and related). */
export const megatroxFont = localFont({
  src: '../../../static/fonts/Megatrox-Regular.woff',
  variable: '--font-megatrox',
  display: 'swap',
  weight: '400',
});
