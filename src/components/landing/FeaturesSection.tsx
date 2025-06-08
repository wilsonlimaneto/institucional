
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Link2, MessageSquare, Rocket, ScrollText } from 'lucide-react';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />, 
    title: 'Busca de Jurisprudência Real com tecnologia Semântica®',
    description: 'Chega de garimpar ementas com palavras-chave. Nossa busca semântica encontra os julgados decisivos para sua causa, permitindo que você construa teses irrefutáveis e aumente sua taxa de vitórias. Além disto, pergunte diretamente ao inteiro teor, receba julgados de todo o Brasil, bem como os precedentes qualificados do CPC.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Gerador nativo de minutas jurídicas',
    description: 'Nossa plataforma lê e interpreta os documentos do processo, garantindo que cada petição seja contextualmente informada e estrategicamente superior. Incorporamos seu ativo mais valioso: um estilo de escrita e persuasão único, forjado em anos de prática.\n\nPare de apenas gerar texto. Comece a construir teses vitoriosas com um clique.',
  },
  {
    icon: <ScrollText className="h-8 w-8 text-primary" />,
    title: 'Resuma Documentos Longos ou Processos',
    description: 'Transforme horas de leitura em minutos de clareza. Analisamos documentos e processos extensos para extrair os fatos e argumentos essenciais, permitindo que você domine o caso em tempo recorde.',
  },
  {
    icon: <Link2 className="h-8 w-8 text-primary" />,
    title: 'Integração Google Docs e MS Office',
    description: 'No 2o semestre de 2025 seus documentos poderão ser gerados dentro do seu editor de texto de preferência, mediante integração entre nossa tecnologia e a dos principais players de mercado.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Suporte Humano por WhatsApp',
    description: 'Ficou com alguma dúvida? Basta acionar nosso suporte via WhatsApp e teremos o prazer de ajudar',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Funcionalidades</h2>
          <p className="mt-4 text-xl text-foreground/80 max-w-2xl mx-auto">
            Deixe os prompts para os engenheiros. Nossas funcionalidades entregam IA de forma natural para os advogados, projetada para maximizar a produtividade e o sucesso em suas causas.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {features.map((feature, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="bg-card border-border/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group font-headline text-lg text-card-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 text-primary group-hover:text-primary/90 transition-colors">
                      {feature.icon}
                    </span>
                    <span className="font-headline text-lg text-card-foreground group-hover:text-card-foreground/90 transition-colors">
                      {feature.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <p className="text-card-foreground/80 text-base whitespace-pre-line">{feature.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
