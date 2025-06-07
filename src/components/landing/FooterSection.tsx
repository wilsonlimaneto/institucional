import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Star } from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-16 bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
              <span className="font-headline text-2xl font-bold text-primary">Maestria</span>
            </Link>
            <p className="text-sm text-foreground/70 text-center md:text-left">
              Crafting exceptional digital experiences.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
             <h3 className="font-headline text-lg font-semibold mb-3 text-foreground">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-foreground/70 hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-headline text-lg font-semibold mb-3 text-foreground">Proudly Supported By</h3>
            <div className="flex items-center gap-2 text-foreground/70">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold">Google for Startups</span>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {currentYear} Maestria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
