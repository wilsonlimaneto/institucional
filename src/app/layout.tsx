
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
  title: 'Maestria Law - Tecnologia Jurídica Eficaz e Confiável',
  description: 'IA Jurídica para quem não acredita em hype',
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
 <script
 type="text/javascript"
 dangerouslySetInnerHTML={{
            __html: `
 (function(c,l,a,r,i,t,y){
 c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
 t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/rkmzjdrdhj";
 y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
 })(window, document, "clarity", "script", "rkmzjdrdhj");
 `,
          }}
 />
 {/* Google Tag Manager */}
 <script type="text/javascript"
 dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 })(window,document,'script','dataLayer','GTM-WL9R9DLN');`,
          }}
 />
 </head>
 <body className="font-sans antialiased">
 {children}
 <Toaster />
 <WhatsAppButton />
 </body>
    </html>
  );
}
