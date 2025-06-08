
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const GoogleCloudSuccessSection = () => {
  return (
    <section id="google-cloud-success" className="py-9 md:py-12 lg:py-14 text-primary-foreground bg-[hsl(217,90%,40%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-1 gap-8 items-center">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Somos Caso de Sucesso Google Cloud
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/90 text-[1.15em]">
              Na maestria., utilizamos o poder da Google Cloud Platform para oferecer uma plataforma robusta, escalável e inteligente, processando dados jurídicos com velocidade e segurança, e usando IA avançada para pesquisa de jurisprudência.
            </p>
            <ul className="space-y-1.5 text-left list-disc list-inside text-primary-foreground/80 text-sm md:text-base">
              <li>Escalabilidade para atender advogados em todo o Brasil.</li>
              <li>Segurança de ponta para proteger dados sensíveis.</li>
              <li>Inovação contínua com as mais recentes tecnologias de IA.</li>
            </ul>
            <div className="pt-4 text-center md:text-left">
              <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 text-primary-foreground font-semibold">
                <Link href="#">
                  Clique aqui para conhecer o Caso de Sucesso
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleCloudSuccessSection;

