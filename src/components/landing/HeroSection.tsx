
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  onOpenContactModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContactModal }) => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content: Text on left, Image + Buttons on right */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-12 items-center mb-12 md:mb-16">
          {/* Left Column: Text content */}
          <div className="space-y-8 text-center md:text-left md:col-span-2 md:-translate-y-8">
            <h1 className="text-[1.65rem] sm:text-[2.0625rem] lg:text-[2.475rem] font-bold tracking-tight text-foreground">
              Alavanque sua produtividade criando <span className="text-primary">minutas</span> automáticas com <span className="text-primary">jurisprudência real</span> que o <u><span className="text-primary">ChatGPT não consegue encontrar</span></u>.
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80">
              <span style={{ fontSize: '115%' }}>Automatize GRATUITAMENTE a sua rotina de edição de documentos, resumos de processos e pesquisa de <u>jurisprudência verdadeira</u>.</span>
            </p>
          </div>

          {/* Right Column: Image, then Buttons */}
          <div className="md:col-span-3 flex flex-col items-center space-y-8">
            {/* Image */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl w-full md:w-5/6 md:mx-auto">
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
            
            {/* Action Buttons - MOVED HERE & CENTERED */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-6">
              <Button asChild size="lg" className="font-semibold">
                <Link href="#ebook">
                  Cadastre-se Grátis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-semibold" onClick={onOpenContactModal}>
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>

        {/* Google for Startups Logo - MOVED HERE & CENTERED */}
        <div className="text-center">
          <p className="text-sm text-foreground/80 mb-1">
            Startup apoiada pelo
          </p>
          <div className="relative h-[5.6rem] w-full max-w-[22.4rem] mx-auto -mt-[20px]">
             <Image
                src="/gfs_h.png"
                alt="Google for Startups Logo"
                layout="fill"
                objectFit="contain"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
