import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
}

interface DirectHeroCarouselProps {
  heroes: HeroSlide[];
  heightClass?: string;
  className?: string;
}

const DirectHeroCarousel = ({ heroes, heightClass = "h-80 md:h-[480px]", className = "" }: DirectHeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide(0);
  }, [heroes.length]);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroes.length]);

  if (heroes.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", heightClass, className)}>
      {heroes.map((heroItem, index) => {
        const slideSrc = heroItem.imageUrl || heroItem.image_url || "/placeholder.svg";
        return (
          <div
            key={heroItem.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 bg-cover bg-center",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            style={{ backgroundImage: `url(${slideSrc})` }}
            aria-hidden={index !== currentSlide}
          >
            <div className="absolute inset-0 bg-warm-vignette" />
            <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{heroItem.title}</h2>
                {heroItem.subtitle && (
                  <p className="text-lg md:text-xl text-white/90">{heroItem.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {heroes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentSlide ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectHeroCarousel;
