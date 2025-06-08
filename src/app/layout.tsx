
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import { Poppins, PT_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'LandingVerse',
  description: 'A modern landing page showcasing core features and offerings for LandingVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${pt_sans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <WhatsAppButton />
      </body>
    </html>
  );
}
