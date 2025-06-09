
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CallToActionSectionProps {
  onOpenContactModal?: () => void; // Optional prop for now, if not all instances use it
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onOpenContactModal }) => {
  return (
    <section className="py-10 md:py-14 bg-secondary/20"> {/* Padding reduzido para menor altura */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
          Você já entendeu a diferença. Venha ver na prática.
        </h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
          Acesse a IA de Alta Performance para profissionais exigentes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-semibold">
            <Link href="#ebook">
              Cadastre-se Grátis
            </Link>
          </Button>
          {onOpenContactModal ? (
            <Button size="lg" variant="outline" className="font-semibold" onClick={onOpenContactModal}>
              Fale Conosco
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link href="https://wa.me/5511930991110" target="_blank" rel="noopener noreferrer">
                Fale Conosco
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
