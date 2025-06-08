
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 md:gap-12 items-start">
          {/* Left Column: Text content */}
          <div className="space-y-8 text-center md:text-left md:col-span-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Gere minutas de <span className="text-primary">documentos jurídicos</span> com <span className="text-primary">Jurisprudência real</span> com qualidade insuperável.
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80">
              <span style={{ fontSize: '115%' }}>Automatize GRATUITAMENTE a sua rotina de edição de documentos, resumos de processos e pesquisa de jurisprudência.</span>
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-semibold">
                <Link href="#use-agora">Use agora mesmo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link href="#saiba-mais">Saiba Mais</Link>
              </Button>
            </div>
            
            {/* Google for Startups Logo */}
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground/80 mb-1">
                Startup apoiada pelo
              </p>
              <div className="relative h-[5.6rem] w-full max-w-[22.4rem] mx-auto md:ml-0 -mt-[20px]">
                 <Image
                    src="/gfs_h.png"
                    alt="Google for Startups Logo"
                    layout="fill"
                    objectFit="contain"
                  />
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="md:col-span-3 space-y-8">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/fast_demo_maestria.webp"
                alt="Maestria logo"
                width={1280} 
                height={720}
                sizes="(min-width: 768px) 60vw, 100vw"
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
      </div>
    </section>
  );
};

export default HeroSection;
