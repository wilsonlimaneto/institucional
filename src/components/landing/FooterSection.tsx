
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Linkedin, Instagram, MessageSquare } from 'lucide-react'; // Changed Facebook, Twitter to Youtube, Instagram

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-16 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
              <div className="relative w-[120px] h-[25px] md:w-[150px] md:h-[31px]">
                <Image
                    src="/maestrialogo.png"
                    alt="maestria. logo"
                    layout="fill"
                    objectFit="contain"
                    priority
                />
              </div>
            </Link>
            <p className="text-sm text-foreground/70 text-center md:text-left">
              Tecnologia Jurídica Eficaz.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
             <h3 className="font-headline text-lg font-semibold mb-3 text-foreground">Siga nossas redes</h3>
            <div className="flex space-x-4">
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-foreground/70 hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
            <Link href="mailto:feedback@maestria.ai" className="flex items-center gap-2 mt-4 text-sm text-foreground/70 hover:text-primary transition-colors">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-headline text-lg font-semibold mb-3 text-foreground">Apoiado por</h3>
            <div className="relative h-12 w-48 -mt-2.5"> {/* Added negative margin-top */}
              <Image
                src="/gfs_h.png"
                alt="Google for Startups Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {currentYear} Maestria. Direitos Reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
