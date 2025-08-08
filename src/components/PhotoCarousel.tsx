import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface PhotoCarouselProps {
  photos: string[];
  title?: string;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const PhotoCarousel = ({ 
  photos, 
  title, 
  className = "", 
  autoPlay = true, 
  interval = 4000 
}: PhotoCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const displayPhotos = photos && photos.length > 0 ? photos : [];

  // Update count when photos change and reset to beginning
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    // Reset to first slide when photos change
    api.scrollTo(0);
  }, [api, displayPhotos]);

  // Handle carousel select
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality with looping
  useEffect(() => {
    if (!isPlaying || !api || displayPhotos.length <= 1) return;

    const timer = setInterval(() => {
      // Check if we're at the last slide, if so, go back to first
      if (current >= displayPhotos.length) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, api, displayPhotos.length, interval, current]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    if (autoPlay) setIsPlaying(false);
  }, [autoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) setIsPlaying(true);
  }, [autoPlay]);

  // Handle dot click
  const handleDotClick = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  }, [api]);

  // Show loading state when no photos are available
  if (displayPhotos.length === 0) {
    return (
      <div 
        className={`relative aspect-video rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative aspect-video rounded-lg overflow-hidden shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Carousel */}
      <Carousel 
        className="w-full h-full"
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {displayPhotos.map((photo, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="h-full w-full">
                <img
                  src={photo}
                  alt={title ? `${title} - Photo ${index + 1}` : `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        {displayPhotos.length > 1 && (
          <>
            <CarouselPrevious 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10" 
            />
            <CarouselNext 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
            />
          </>
        )}
      </Carousel>

      {/* Dots Navigation */}
      {displayPhotos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {displayPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current - 1
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {displayPhotos.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
          {current} / {displayPhotos.length}
        </div>
      )}

      {/* Play/Pause Button */}
      {displayPhotos.length > 1 && autoPlay && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 bg-black/50 text-white hover:bg-black/70 z-10"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
      )}
    </div>
  );
};

export default PhotoCarousel;
