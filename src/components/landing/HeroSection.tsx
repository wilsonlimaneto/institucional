'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Gere <span className="text-primary">quaisquer documentos jurídicos</span> e inclua também <span className="text-primary">Jurisprudência Real e Verificada</span> da forma mais assertiva do mercado.
            </h1>
            <p className={`text-lg md:text-xl text-foreground/80 ${isMounted ? 'animate-fade-in' : 'opacity-0'}`}>
              Automatize, de forma GRATUITA, a sua rotina de edição de documentos e pesquisa de jurisprudência.
            </p>
            <p className="text-sm md:text-base text-foreground/80">
              Suporte via WhatsApp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-semibold">
                <Link href="#use-agora">Use agora mesmo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link href="#saiba-mais">Saiba Mais</Link>
              </Button>
            </div>
            <div className="mt-8 text-center md:text-left">
              <p className="text-sm text-foreground/80 mb-1">
                Startup apoiada pelo
              </p>
              <div className="relative h-[5.6rem] w-[22.4rem] inline-block -ml-[10px] -mt-[10px]">
                 <Image
                    src="/gfs_h.png"
                    alt="Google for Startups Logo"
                    layout="fill"
                    objectFit="contain"
                  />
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/maestrialogo.png"
              alt="Maestria logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
