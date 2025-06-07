import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-headline text-3xl font-bold text-foreground">maestria.</span>
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
