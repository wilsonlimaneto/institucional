
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Marketing Manager, Tech Solutions Inc.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example: Rick Astley
    aiHint: 'video thumbnail marketing',
  },
  {
    name: 'John B.',
    title: 'Founder, Creative Startup Co.',
    videoUrl: 'https://www.youtube.com/watch?v=ZyDbq-lEKBQ', // Example: Another short video
    aiHint: 'video thumbnail startup',
  },
  {
    name: 'Alice M.',
    title: 'Digital Strategist, Alpha Agency',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', // Example: Short tech review
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
  const { toast } = useToast();


  const openModal = useCallback((videoUrl: string, name: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoName(name);
    setIsModalOpen(true);
    setShowVolumeAlert(true); 
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setShowVolumeAlert(false);
    // Delay resetting video URL to allow fade-out animation of DialogContent
    setTimeout(() => {
      setSelectedVideoUrl(null);
      setSelectedVideoName(null);
    }, 300); // Corresponds to DialogContent animation duration
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVolumeAlert) {
      timer = setTimeout(() => {
        setShowVolumeAlert(false);
      }, 5000); // Alert disappears after 5 seconds
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
            <p className="mt-4 text-xl text-foreground/80 max-w-2xl mx-auto">
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
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl !p-0 border-0 bg-transparent shadow-none overflow-hidden">
          <DialogTitle className="sr-only">{selectedVideoName || "Video Testimonial"}</DialogTitle>
          
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {currentVideoIdForModal ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideoIdForModal}?autoplay=1&mute=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
                title={selectedVideoName || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white">Loading video...</p>
              </div>
            )}

            {showVolumeAlert && (
              <div className="animate-alert-slide-in-bottom-left absolute bottom-[-4px] left-[146px] p-3 bg-black/70 text-white rounded-md shadow-lg flex items-center space-x-2 text-xs z-[60]">
                <ArrowLeft className="h-5 w-5 animate-arrow-vibrate text-primary" />
                <span>O vídeo iniciará sem som. Aumente o volume para ouvir.</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialsSection;
