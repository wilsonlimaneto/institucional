
'use client';

import Header from '@/components/landing/Header';
import FooterSection from '@/components/landing/FooterSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
// Removed useState and ContactModal import as they are no longer needed here

export default function ObrigadoPage() {
  // Removed state for ContactModal as it's not used on this page directly
  // The Header will use its default behavior for the "Contato" link (to /#ebook)
  // because onOpenContactModal is not passed to it.

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header /> {/* onOpenContactModal is not passed, Header handles this gracefully */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center justify-center">
        <CheckCircle className="h-20 w-20 sm:h-24 sm:w-24 text-green-500 mb-6 sm:mb-8" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6">
          Obrigado!
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 mb-8 sm:mb-10 max-w-lg sm:max-w-xl">
          Sua solicitação foi enviada com sucesso. Nossa equipe agradece seu contato e retornará o mais breve possível.
        </p>
        <Button asChild size="lg" className="font-semibold">
          <Link href="/">Voltar para a Página Inicial</Link>
        </Button>
      </main>
      <FooterSection />
      {/* ContactModal instance removed from here */}
    </div>
  );
}

    