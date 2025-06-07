import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              Elevate Your Brand with LandingVerse
            </h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Discover the power of compelling landing pages. We craft experiences that convert visitors into loyal customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-headline text-lg">
                <Link href="#ebook">Get Started Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-headline text-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="https://placehold.co/800x450.png"
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint="abstract technology"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
