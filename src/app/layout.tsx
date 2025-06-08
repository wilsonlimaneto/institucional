
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: 'LandingVerse',
  description: 'A modern landing page showcasing core features and offerings for LandingVerse.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${notoSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.setAttribute("data-cookieconsent", "ignore");' }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <WhatsAppButton />
      </body>
    </html>
  );
}
