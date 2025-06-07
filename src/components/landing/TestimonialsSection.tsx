import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Marketing Manager, Tech Solutions Inc.',
    quote: "LandingVerse helped us increase our conversion rates by 30% in just one month! The designs are modern and effective.",
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'professional woman',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example link
    rating: 5,
  },
  {
    name: 'John B.',
    title: 'Founder, Creative Startup Co.',
    quote: "The ease of use and the quality of the landing pages are outstanding. Highly recommended for any startup!",
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'startup founder',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    rating: 5,
  },
  {
    name: 'Alice M.',
    title: 'Digital Strategist, Alpha Agency',
    quote: "Our clients are thrilled with the results we've achieved using LandingVerse. It's a game-changer for campaign performance.",
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'smiling person',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Loved by Our Customers</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Hear what our satisfied users have to say about their experience with LandingVerse.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={testimonial.aiHint}
                  />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-foreground/70">{testimonial.title}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <blockquote className="italic text-foreground/80">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
              <CardFooter className="p-6">
                <Button asChild variant="ghost" className="text-accent hover:text-accent/90">
                  <Link href={testimonial.videoUrl} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-2 h-5 w-5" /> Watch Video Testimonial
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
