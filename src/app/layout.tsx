import type { Metadata, Viewport } from 'next';
import { DM_Sans, Inter, Noto_Sans_Armenian } from 'next/font/google';
import { AppProviders } from './_components/app-providers';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${notoArmenian.variable} ${megatroxFont.variable} antialiased`}
    >
      <body className="flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
