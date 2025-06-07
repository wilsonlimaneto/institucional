import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: 'Mastering SEO for Landing Pages',
    description: 'Learn the best practices to optimize your landing pages for search engines and drive organic traffic.',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'seo analytics',
    link: 'https://example.com/blog/mastering-seo',
  },
  {
    title: 'The Psychology of Color in Web Design',
    description: 'Discover how color choices can impact user perception and conversion rates on your website.',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'color palette',
    link: 'https://example.com/blog/psychology-of-color',
  },
  {
    title: 'A/B Testing Your Way to Higher Conversions',
    description: 'A practical guide to implementing A/B tests that improve your landing page performance.',
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'data chart',
    link: 'https://example.com/blog/ab-testing-guide',
  },
];

const BlogReferralSection = () => {
  return (
    <section id="blog" className="py-16 md:py-24 lg:py-32 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Valuable Insights from Our Blog</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Explore our latest articles and guides to help you build better online experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden bg-card">
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={post.aiHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 space-y-3">
                <CardTitle className="font-headline text-xl text-card-foreground">{post.title}</CardTitle>
                <p className="text-card-foreground/70 text-sm line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="link" className="p-0 h-auto text-primary font-semibold">
                  <Link href={post.link} target="_blank" rel="noopener noreferrer">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
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

export default BlogReferralSection;
