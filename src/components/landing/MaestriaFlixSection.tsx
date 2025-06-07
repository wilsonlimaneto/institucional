'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

const MaestriaFlixSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])

  const [visibleSlides, setVisibleSlides] = useState<number[]>([])

  const updateVisibleSlides = useCallback((api: any) => {
    if (!api) return
    setVisibleSlides(api.slidesInView(true))
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    updateVisibleSlides(emblaApi)
    emblaApi.on('select', updateVisibleSlides)
    emblaApi.on('reInit', updateVisibleSlides)

    return () => {
      emblaApi.off('select', updateVisibleSlides)
      emblaApi.off('reInit', updateVisibleSlides)
    }
  }, [emblaApi, updateVisibleSlides])

  const isSlideCentered = (index: number) => {
    if (!emblaApi) return false;
    const selectedScrollSnap = emblaApi.selectedScrollSnap();
    // In a looping carousel, the "active" slide might not be the one in the middle
    // of the visible slides array. The `selectedScrollSnap` is more reliable.
    return selectedScrollSnap === index;
  };
  
  const videos = [
    {
      id: 1,
      thumbnail: 'https://placehold.co/600x400/1B1B1B/FFFFFF?text=Video+1',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 2,
      thumbnail: 'https://placehold.co/600x400/1B1B1B/FFFFFF?text=Video+2',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 3,
      thumbnail: 'https://placehold.co/600x400/1B1B1B/FFFFFF?text=Video+3',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 4,
      thumbnail: 'https://placehold.co/600x400/1B1B1B/FFFFFF?text=Video+4',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 5,
        thumbnail: 'https://placehold.co/600x400/1B1B1B/FFFFFF?text=Video+5',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-12">
          MaestriaFlix
        </h2>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {videos.map((video, index) => (
              <div
                className="embla__slide basis-full sm:basis-1/2 lg:basis-1/3 min-w-0 px-4"
                key={video.id}
              >
                <div
                  className={`relative aspect-video rounded-lg overflow-hidden transition-opacity duration-300 ease-in-out ${
                    isSlideCentered(index) ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <Link href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={video.thumbnail}
                        alt={`Video ${video.id}`}
                        layout="fill"
                        objectFit="cover"
                      />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MaestriaFlixSection
