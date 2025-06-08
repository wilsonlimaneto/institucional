
'use client'

import { Instagram } from 'lucide-react';
import Link from 'next/link';

const MaestriaFlixSection = () => {
  const reels = [
    {
      id: 1,
      title: 'Reel Destaque 1',
      instagramLink: 'https://www.instagram.com/maestria.ai', // Placeholder link
      aiHint: 'instagram reel social media',
    },
    {
      id: 2,
      title: 'Reel Destaque 2',
      instagramLink: 'https://www.instagram.com/maestria.ai', // Placeholder link
      aiHint: 'instagram reel marketing',
    },
  ];

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-24 lg:pb-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-8 text-primary">
          Maestria Reels
        </h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-12 md:mb-16 text-center">
          Acompanhe nossos últimos reels com dicas, insights e novidades diretamente do Instagram. Em breve, você poderá assistir os vídeos aqui mesmo!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {reels.map((reel) => (
            <Link 
              href={reel.instagramLink} 
              key={reel.id} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Assistir ${reel.title} no Instagram`}
            >
              <div 
                className="bg-card rounded-xl shadow-lg w-full aspect-[9/16] flex flex-col items-center justify-center p-6 border border-border group-hover:shadow-primary/10 group-hover:border-primary/30 transition-all duration-300 ease-in-out group-hover:scale-[1.02]"
                data-ai-hint={reel.aiHint}
              >
                <Instagram className="w-16 h-16 text-primary group-hover:text-primary/90 transition-colors duration-300 mb-6" />
                <p className="text-card-foreground font-semibold text-xl text-center mb-3 group-hover:text-primary transition-colors duration-300">
                  {reel.title}
                </p>
                <p className="text-card-foreground/70 text-sm text-center mb-auto">
                  Clique para assistir no Instagram
                </p>
                <p className="text-xs text-muted-foreground mt-4 pt-4">
                  (Integração de embed em breve)
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaestriaFlixSection;
