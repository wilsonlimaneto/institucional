import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart3, DownloadCloud, Rocket, ShieldCheck, Users } from 'lucide-react';

const features = [
  {
    icon: <Rocket className="h-10 w-10 text-accent" />,
    title: 'Blazing Fast Load Speeds',
    description: 'Optimized for performance, ensuring your visitors have a seamless experience.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent" />,
    title: 'Secure & Reliable',
    description: 'Built with top-notch security features to protect your data and build trust.',
  },
  {
    icon: <Award className="h-10 w-10 text-accent" />,
    title: 'High Conversion Design',
    description: 'Modern, aesthetically pleasing designs focused on maximizing user engagement.',
  },
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: 'Community & Support',
    description: 'Access to a supportive community and resources to help you succeed.',
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-accent" />,
    title: 'Analytics Integration',
    description: 'Easily track your performance and make data-driven decisions.',
  },
  {
    icon: <DownloadCloud className="h-10 w-10 text-accent" />,
    title: 'Valuable Resources',
    description: 'Get access to exclusive content like ebooks and guides to grow your business.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Core Features & Benefits</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            LandingVerse is packed with features designed to help you create stunning and effective landing pages.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="items-center text-center">
                {feature.icon}
                <CardTitle className="mt-4 font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-foreground/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
