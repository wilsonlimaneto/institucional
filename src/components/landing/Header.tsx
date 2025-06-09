
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenContactModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenContactModal }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-shrink-0 items-center" prefetch={false}>
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
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <Link href="#diferenciais" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap" prefetch={false}>
            Diferenciais Exclusivos
          </Link>
          <Link href="#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap" prefetch={false}>
            Funcionalidades
          </Link>
          <Link href="#depoimentos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap" prefetch={false}>
            Depoimentos
          </Link>
          <Link href="#ebook" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap" prefetch={false}>
            E-Book
          </Link>
          {/* <Link href="#blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap" prefetch={false}>
            Blog
          </Link> */}
          <Button variant="link" onClick={onOpenContactModal} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap p-0 h-auto">
            Contato
          </Button>
          <Button asChild size="sm">
            <Link href="#ebook" className="whitespace-nowrap">Cadastre-se Grátis</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <SheetClose asChild>
                  <Link href="#diferenciais" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                    Diferenciais Exclusivos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                    Funcionalidades
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#depoimentos" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                    Depoimentos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#ebook" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                    E-Book
                  </Link>
                </SheetClose>
                {/* <SheetClose asChild>
                  <Link href="#blog" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                    Blog
                  </Link>
                </SheetClose> */}
                <SheetClose asChild>
                  <Button variant="link" onClick={onOpenContactModal} className="text-lg font-medium hover:text-primary transition-colors justify-start p-0 h-auto">
                    Contato
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button asChild className="w-full mt-4">
                        <Link href="#ebook">Cadastre-se Grátis</Link>
                    </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
export default Header;
