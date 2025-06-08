
import Image from 'next/image';

const GoogleCloudSuccessSection = () => {
  return (
    <section id="google-cloud-success" className="py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Impulsionados pela Google Cloud
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Na maestria., utilizamos o poder e a inovação da Google Cloud Platform para oferecer uma plataforma robusta, escalável e inteligente. A infraestrutura global da Google Cloud nos permite processar grandes volumes de dados jurídicos com velocidade e segurança, enquanto suas avançadas ferramentas de Inteligência Artificial e Machine Learning são o motor por trás da nossa assertividade em pesquisa de jurisprudência e geração de documentos.
            </p>
            <ul className="space-y-3 text-left list-disc list-inside text-primary-foreground/80">
              <li>Escalabilidade para atender advogados em todo o Brasil.</li>
              <li>Segurança de ponta para proteger dados sensíveis.</li>
              <li>Inovação contínua com as mais recentes tecnologias de IA.</li>
              <li>Alta disponibilidade e confiabilidade dos nossos serviços.</li>
            </ul>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl flex items-center justify-center p-4 sm:p-8 bg-white/20">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
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
