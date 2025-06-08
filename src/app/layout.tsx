
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import { Noto_Sans } from 'next/font/google';

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans', // Optional: if you prefer to use it as a CSS variable
});

export const metadata: Metadata = {
  title: 'maestria.',
  description: 'Encontre Jurisprudência verificada com assistente de IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${noto_sans.className} antialiased`}>
        {children}
        <Toaster />
        <WhatsAppButton />
      </body>
    </html>
  );
}
