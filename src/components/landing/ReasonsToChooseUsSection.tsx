
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Clock, BadgeCheck, CreditCard, Users, MousePointerClick } from 'lucide-react';

const reasons = [
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: 'Sem necessidade de cartão de crédito',
    description: 'Plataformas internacionais como o ChatGPT, cobram em dólar.',
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: 'Substitua o ChatGPT e encontre jurisprudência certificada',
    description: 'Nossa IA especializada supera o ChatGPT em contextos jurídicos, entregando resultados extremamente mais precisos e uma pesquisa de Jurisprudência sem risco de ser inventada.',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Sem necessidade de aprender prompts',
    description: 'Entendemos os desafios da sua rotina e criamos uma ferramenta que entende seu contexto de atuação e trabalha fácil e naturalmente, sem precisar aprender prompts',
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: 'Economize Tempo Precioso',
    description: 'Automatize a pesquisa de jurisprudência e a elaboração de petições, liberando horas para você ganhar mais causas.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Tecnologia Confiável',
    description: 'Construído com parcerias de renome sobre uma infraestrutura robusta e moderna, garantindo performance, segurança e disponibilidade para sua prática jurídica.',
  },
  {
    icon: <MousePointerClick className="h-10 w-10 text-primary" />,
    title: 'Mais Fácil de Usar',
    description: 'Interface intuitiva e fluxo de trabalho simplificado, projetado para advogados economizarem tempo e não quebrarem a cabeça com tecnologia.',
  },
];

const ReasonsToChooseUsSection = () => {
  return (
    <section id="motivos" className="py-8 md:py-12 lg:py-16 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Motivos para nos Escolher</h2>
          <p className="mt-4 text-xl text-foreground/80 max-w-2xl mx-auto">
            Descubra por que advogados de todo o Brasil confiam na maestria. para otimizar seu trabalho.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card">
              <CardHeader className="items-center text-center">
                {reason.icon}
                <CardTitle className="mt-4 font-headline text-xl text-card-foreground">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-card-foreground/80">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReasonsToChooseUsSection;
