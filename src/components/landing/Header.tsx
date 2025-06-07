import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-headline text-3xl font-bold text-primary">Maestria</span>
        </Link>
        {/* <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-foreground hover:text-primary transition-colors" prefetch={false}>
            Features
          </Link>
          <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors" prefetch={false}>
            Testimonials
          </Link>
          <Link href="#blog" className="text-foreground hover:text-primary transition-colors" prefetch={false}>
            Blog
          </Link>
          <Link href="#ebook" className="text-foreground hover:text-primary transition-colors" prefetch={false}>
            Ebook
          </Link>
        </nav> */}
      </div>
    </header>
  );
};
export default Header;
