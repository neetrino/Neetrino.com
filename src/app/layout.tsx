import type { Metadata } from 'next';
import { Audiowide, DM_Sans, Inter } from 'next/font/google';
import { AppProviders } from './_components/app-providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const audiowide = Audiowide({
  variable: '--font-megatrox',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Neetrino',
  description: 'Neetrino full stack web application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${audiowide.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
