
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PlayCircle, ArrowLeft, Volume2, VolumeX } from 'lucide-react'; // Added Volume icons
import { useMobile } from '@/hooks/use-mobile'; // Import useMobile

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Marketing Manager, Tech Solutions Inc.',
    videoUrl: 'https://www.youtube.com/watch?v=wN2e1aRXNU0',
    aiHint: 'video thumbnail marketing',
  },
  {
    name: 'John B.',
    title: 'Founder, Creative Startup Co.',
    videoUrl: 'https://www.youtube.com/watch?v=Ni26TutiOrA',
    aiHint: 'video thumbnail startup',
  },
  {
    name: 'Alice M.',
    title: 'Digital Strategist, Alpha Agency',
    videoUrl: 'https://www.youtube.com/watch?v=FZwUYt-vuBo',
    aiHint: 'video thumbnail strategy',
  },
];

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1).split('?')[0];
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
      if (!videoId && urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1].split('?')[0];
      }
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    if (typeof url === 'string' && !url.includes('/') && !url.includes('.')) {
        videoId = url;
    }
  }
  return videoId;
}


const TestimonialsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoName, setSelectedVideoName] = useState<string | null>(null);
  const [showVolumeAlert, setShowVolumeAlert] = useState(false);
  const isMobile = useMobile(); // Initialize useMobile

  const openModal = useCallback((videoUrl: string, name: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoName(name);
    setIsModalOpen(true);
    setShowVolumeAlert(true); // Show alert when modal opens
  }, [setSelectedVideoUrl, setSelectedVideoName, setIsModalOpen, setShowVolumeAlert]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setShowVolumeAlert(false); // Hide alert when modal closes
    setTimeout(() => {
      setSelectedVideoUrl(null);
      setSelectedVideoName(null);
    }, 300); 
  }, [setIsModalOpen, setShowVolumeAlert, setSelectedVideoUrl, setSelectedVideoName]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    if (showVolumeAlert) {
      timer = setTimeout(() => {
        // Don't auto-hide if it's the mobile clickable alert, 
        // only if it's the desktop auto-hiding one.
        // User will click to dismiss mobile.
        if (!isMobile) {
          setShowVolumeAlert(false);
        }
      }, 5000); 
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showVolumeAlert, isMobile]); // Add isMobile to dependency array

  const currentVideoIdForModal = selectedVideoUrl ? extractYouTubeVideoId(selectedVideoUrl) : null;

  return (
    <>
      <section id="depoimentos" className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32 bg-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Profissionais Reais. Histórias Reais.</h2>
            <p className="mt-4 text-xl text-foreground/80 max-w-2xl mx-auto">
              Sem atalhos, sem números fabricados. O que você verá a seguir são depoimentos autênticos de advogados que validam nosso trabalho no dia a dia. Ouça o que eles têm a dizer sobre a transformação em seus escritórios.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const videoId = extractYouTubeVideoId(testimonial.videoUrl);
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : 'https://placehold.co/600x400.png';

              return (
                <Card
                  key={index}
                  className="group flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card"
                  onClick={() => openModal(testimonial.videoUrl, testimonial.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openModal(testimonial.videoUrl, testimonial.name)}
                  aria-label={`Watch video testimonial from ${testimonial.name}`}
                >
                  <div className="relative aspect-video w-full">
                      <Image
                        src={thumbnailUrl}
                        alt={`Video testimonial from ${testimonial.name}`}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={testimonial.aiHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                        <Image
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/64px-YouTube_full-color_icon_%282017%29.svg.png"
                          alt="YouTube Logo"
                          width={28}
                          height={20}
                          className="opacity-90"
                        />
                      </div>
                    </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) closeModal(); else setIsModalOpen(true); }}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl !p-0 border-0 bg-transparent shadow-none overflow-hidden">
          <DialogTitle className="sr-only">{selectedVideoName || "Video Testimonial"}</DialogTitle>

          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {currentVideoIdForModal ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideoIdForModal}?autoplay=1&mute=1&modestbranding=1&rel=0&showinfo=0&controls=1`} title={selectedVideoName || "YouTube video player"} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>) : (<div className="w-full h-full flex items-center justify-center">
                <p className="text-white">Loading video...</p>
              </div>)}

            {showVolumeAlert && (
              isMobile ? (
                <div
                  className="absolute inset-0 flex items-center justify-center p-4 z-[60] cursor-pointer"
                  onClick={() => setShowVolumeAlert(false)} 
                >
                  <div
                    className="bg-black/85 text-white rounded-lg shadow-xl p-5 text-center w-auto max-w-[90%] sm:max-w-xs animate-alert-pop-in-center flex flex-col items-center gap-3"
                    onClick={(e) => e.stopPropagation()} // Prevent click on toast from closing if parent handles it broadly
                  >
                    <VolumeX className="h-8 w-8 text-primary" />
                    <p className="text-sm leading-relaxed">
                      Para ouvir desative o mudo do vídeo e aumente o volume do celular.
                    </p>
                     <button 
                        onClick={() => setShowVolumeAlert(false)} 
                        className="mt-2 px-4 py-2 text-xs bg-primary/80 hover:bg-primary text-primary-foreground rounded-md"
                      >
                        Entendido
                      </button>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-max max-w-[90%] animate-alert-slide-in-bottom-center p-3 bg-black/70 text-white rounded-md shadow-lg flex items-center space-x-2 text-xs z-[60]">
                  <ArrowLeft className="h-5 w-5 animate-arrow-vibrate text-primary" />
                  <span>O vídeo iniciará sem som. Aumente o volume para ouvir.</span>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialsSection;

    