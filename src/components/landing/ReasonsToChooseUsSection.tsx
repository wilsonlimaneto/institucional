
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Clock, BadgeCheck, PiggyBank } from 'lucide-react';

const reasons = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'IA Especializada para Advogados',
    description: 'Nossa Inteligência Artificial é treinada especificamente para o contexto jurídico brasileiro, garantindo precisão e relevância incomparáveis.',
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: 'Economize Tempo Precioso',
    description: 'Automatize a pesquisa de jurisprudência e a elaboração de petições, liberando horas para você focar em estratégias e clientes.',
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: 'Feito por Advogados, para Advogados',
    description: 'Entendemos os desafios da sua rotina e criamos uma ferramenta que realmente atende às suas necessidades diárias.',
  },
  {
    icon: <PiggyBank className="h-10 w-10 text-primary" />,
    title: 'Custo-Benefício em Reais',
    description: 'Diferente de plataformas internacionais como o ChatGPT, nossos custos são em moeda local, sem surpresas com a variação cambial do dólar.',
  },
];

const ReasonsToChooseUsSection = () => {
  return (
    <section id="motivos" className="py-16 md:py-24 lg:py-32 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Motivos para nos Escolher</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Descubra por que advogados de todo o Brasil confiam na maestria. para otimizar seu trabalho.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
