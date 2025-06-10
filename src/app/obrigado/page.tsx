
'use client';

import Header from '@/components/landing/Header';
import FooterSection from '@/components/landing/FooterSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import ContactModal from '@/components/landing/ContactModal';

export default function ObrigadoPage() {
  // The "Obrigado" page doesn't need to open a new contact modal via its header.
  // The Header component is robust enough if onOpenContactModal is not provided.
  // However, if we wanted the modal available here too, we'd manage its state.
  // For now, the Header's "Contato" button will link to the homepage's contact area.
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenContactModal={() => setIsContactModalOpen(true)} />
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
      {/* ContactModal is included in case the Header on this page needs to open it,
          though typically on a thank you page, primary CTAs are for returning home.
          If onOpenContactModal in Header is set to a no-op or links home, this isn't strictly needed.
          Keeping it for consistency if user interacts with header's contact button. */}
      <ContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </div>
  );
}
