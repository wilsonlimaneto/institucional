
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const GoogleCloudSuccessSection = () => {
  return (
    <section id="google-cloud-success" className="py-9 md:py-12 lg:py-14 text-primary-foreground bg-[hsl(217,90%,32%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Somos Caso de Sucesso Google Cloud
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/90">
              Por meio da cloud Google, possibilitamos uma infraestrutura robusta e tecnologias em rápido avanço para atender aos mais exigentes requisitos de qualidade do mercado jurídico.
            </p>
            <div className="pt-4 text-center md:text-left">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 text-primary-foreground font-semibold"
              >
                <Link href="#">
                  Conheça o Caso de Sucesso
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center items-center mt-8 md:mt-0 w-full">
            <Image
              src="/google-cloud-logo-4.png"
              alt="Google Cloud Logo"
              width={390}
              height={130}
              objectFit="contain"
              data-ai-hint="google cloud logo"
              className="h-auto w-auto max-w-[280px] sm:max-w-[320px] md:max-w-[390px] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleCloudSuccessSection;
