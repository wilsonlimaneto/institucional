import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" prefetch={false}>
          <Image
            src="/maestria-logo.png"
            alt="maestria. logo"
            width={150}
            height={31}
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="#funcionalidades" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" prefetch={false}>
            Funcionalidades
          </Link>
          <Link href="#tecnologia" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" prefetch={false}>
            Tecnologia
          </Link>
          <Button asChild size="sm">
            <Link href="#use-gratuitamente">Use Gratuitamente</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
export default Header;
