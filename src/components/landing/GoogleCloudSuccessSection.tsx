
import Image from 'next/image';

const GoogleCloudSuccessSection = () => {
  return (
    <section id="google-cloud-success" className="py-9 md:py-12 lg:py-14 bg-[hsl(217,90%,40%)] text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center md:text-left"> {/* Reduced space-y */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Impulsionados pela Google Cloud
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/90">
              Na maestria., utilizamos o poder da Google Cloud Platform para oferecer uma plataforma robusta, escalável e inteligente, processando dados jurídicos com velocidade e segurança, e usando IA avançada para pesquisa de jurisprudência.
            </p>
            <ul className="space-y-1.5 text-left list-disc list-inside text-primary-foreground/80 text-sm md:text-base"> {/* Reduced space-y */}
              <li>Escalabilidade para atender advogados em todo o Brasil.</li>
              <li>Segurança de ponta para proteger dados sensíveis.</li>
              <li>Inovação contínua com as mais recentes tecnologias de IA.</li>
            </ul>
          </div>
          <div className="relative aspect-[5/4] md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl flex items-center justify-center p-4 sm:p-6 bg-white/15">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Cloud_logo.svg/1024px-Google_Cloud_logo.svg.png"
                alt="Google Cloud Platform Logo"
                layout="fill"
                objectFit="contain"
                data-ai-hint="google cloud logo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleCloudSuccessSection;
