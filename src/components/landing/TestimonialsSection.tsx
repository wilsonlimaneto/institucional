
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlayCircle, ArrowUp } from 'lucide-react';
// Removed useToast as it's no longer used here

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Marketing Manager, Tech Solutions Inc.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aiHint: 'video thumbnail',
  },
  {
    name: 'John B.',
    title: 'Founder, Creative Startup Co.',
    videoUrl: 'https://www.youtube.com/watch?v=ZyDbq-lEKBQ',
    aiHint: 'video thumbnail',
  },
  {
    name: 'Alice M.',
    title: 'Digital Strategist, Alpha Agency',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    aiHint: 'video thumbnail',
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
    if (!url.includes('/') && !url.includes('.')) {
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

  const openModal = useCallback((videoUrl: string, name: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoName(name);
    setIsModalOpen(true);
    setShowVolumeAlert(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setShowVolumeAlert(false); 
    setTimeout(() => {
      setSelectedVideoUrl(null);
      setSelectedVideoName(null);
    }, 300);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVolumeAlert) {
      timer = setTimeout(() => {
        setShowVolumeAlert(false);
      }, 5000); // Alert visible for 5 seconds
    }
    return () => clearTimeout(timer);
  }, [showVolumeAlert]);

  const currentVideoIdForModal = selectedVideoUrl ? extractYouTubeVideoId(selectedVideoUrl) : null;

  return (
    <>
      <section id="testimonials" className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32 bg-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Loved by Our Customers</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Hear what our satisfied users have to say about their experience with LandingVerse.
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-headline text-lg font-semibold text-card-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-card-foreground/70 line-clamp-2">{testimonial.title}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) closeModal(); else setIsModalOpen(true); }}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl !p-0 overflow-hidden border-0 bg-transparent shadow-none relative">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedVideoName || "Video Testimonial"}</DialogTitle>
          </DialogHeader>
          {currentVideoIdForModal ? (
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideoIdForModal}?autoplay=1&mute=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
                title={selectedVideoName || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center bg-black rounded-lg">
              <p className="text-white">Loading video...</p>
            </div>
          )}
          {showVolumeAlert && (
            <div className="animate-alert-slide-in-bottom-left absolute bottom-4 left-4 p-3 bg-black/70 text-white rounded-md shadow-lg flex items-center space-x-2 text-xs z-[60]">
              <ArrowUp className="h-5 w-5 animate-arrow-vibrate text-primary" />
              <span>O vídeo iniciará sem som. Aumente o volume para ouvir.</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialsSection;
