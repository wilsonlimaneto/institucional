import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Encontre <span className="text-primary">Jurisprudência verificada</span>, por meio de um assistente de IA que entrega exatamente o julgado que você precisa.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Unimos a facilidade do ChatGPT a julgados verdadeiros e verificados. Experimente o poder de compreensão da busca jurisprudencial semântica:
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Encontre jurisprudência no TRF2 sobre tril"
                  className="pl-10 w-full"
                />
              </div>
              <Button type="submit" size="lg" className="font-semibold">
                Buscar
              </Button>
            </form>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl group">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Google for Startups Logo"
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint="google startups logo"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
              <p className="text-sm text-center text-foreground/90 font-medium">Startup selecionada pelo Google</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
