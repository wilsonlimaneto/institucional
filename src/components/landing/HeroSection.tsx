
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-12 items-start"> {/* Changed md:gap-16 to md:gap-12 and items-center to items-start */}
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Gere minutas de <span className="text-primary">documentos jurídicos</span> com <span className="text-primary">Jurisprudência Real</span> usando o modelo de IA mais assertivo do mercado.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80">
              <span style={{ fontSize: '115%' }}>Automatize GRATUITAMENTE a sua rotina de edição de documentos, resumos de processos e pesquisa de jurisprudência.</span>
            </p>
            
            <div>
              <p className="text-sm md:text-base text-foreground/80 font-medium">
                A única ferramenta que entrega:
              </p>
              <ul className="mt-2 ml-0 md:ml-4 list-disc list-inside text-sm md:text-base text-foreground/70 space-y-1.5" data-ai-hint="List of features including semantic search for real jurisprudence">
                <li>Jurisprudência reais, já verificadas e com <em className="italic text-foreground/80">busca semântica</em></li>
                <li>Editor de documentos com o DNA do seu escritório</li>
                <li>Resuma dados de longos documentos</li>
                <li>Parceria com empresas e tecnologias reconhecidas internacionalmente</li>
              </ul>
            </div>

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
              <div className="relative h-[5.6rem] w-[22.4rem] inline-block -ml-[10px] -mt-[20px]">
                 <Image
                    src="/gfs_h.png"
                    alt="Google for Startups Logo"
                    layout="fill"
                    objectFit="contain"
                  />
              </div>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/fast_demo_maestria.webp"
              alt="Maestria logo"
              width={1280} 
              height={720}
              sizes="(min-width: 768px) 50vw, 100vw"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
              data-ai-hint="legal tech demo"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
