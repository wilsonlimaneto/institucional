import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Award, BarChart3, DownloadCloud, Rocket, ShieldCheck, Users } from 'lucide-react';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />, // Adjusted icon size for accordion trigger
    title: 'Blazing Fast Load Speeds',
    description: 'Optimized for performance, ensuring your visitors have a seamless experience.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Secure & Reliable',
    description: 'Built with top-notch security features to protect your data and build trust.',
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'High Conversion Design',
    description: 'Modern, aesthetically pleasing designs focused on maximizing user engagement.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Community & Support',
    description: 'Access to a supportive community and resources to help you succeed.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Analytics Integration',
    description: 'Easily track your performance and make data-driven decisions.',
  },
  {
    icon: <DownloadCloud className="h-8 w-8 text-primary" />,
    title: 'Valuable Resources',
    description: 'Get access to exclusive content like ebooks and guides to grow your business.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Core Features & Benefits</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            LandingVerse is packed with features designed to help you create stunning and effective landing pages.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {features.map((feature, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="bg-card border-border/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
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
                  <p className="text-card-foreground/80 text-base">{feature.description}</p>
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
