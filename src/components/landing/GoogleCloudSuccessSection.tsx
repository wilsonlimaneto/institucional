
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const GoogleCloudSuccessSection = () => {
  return (
    <section id="google-cloud-success" className="py-9 md:py-12 lg:py-14 text-primary-foreground bg-[hsl(217,90%,40%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Somos Caso de Sucesso Google Cloud
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/90 text-[1.15em]">
              Por meio da cloud Google, possibilitamos uma infraestrutura robusta e tecnologias em rápido avanço para atender aos mais exigentes requisitos de qualidade do mercado jurídico.
            </p>
            <div className="pt-4 text-center md:text-left">
              <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 text-primary-foreground font-semibold">
                <Link href="#">
                  Clique aqui para conhecer o Caso de Sucesso
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:flex justify-center items-center md:justify-end">
            <Image
              src="https://placehold.co/300x100.png" 
              alt="Google Cloud Logo"
              width={300}
              height={100}
              objectFit="contain"
              data-ai-hint="google cloud logo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleCloudSuccessSection;
