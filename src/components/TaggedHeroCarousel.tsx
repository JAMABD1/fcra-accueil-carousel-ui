import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getHeroItems, getTags } from "@/lib/db/queries";

interface TaggedHeroCarouselProps {
  filterTags?: string[]; // Tag names to filter by
  showButtons?: boolean; // Whether to show action buttons
  height?: string; // Custom height, defaults to 70vh
  className?: string; // Additional CSS classes
  heightClass?: string; // Tailwind height class
  onLearnMore?: () => void; // Click handler for "En savoir plus"
  onJoinUs?: () => void; // Click handler for "Nous rejoindre"
}

const TaggedHeroCarousel = ({ 
  filterTags = [], 
  showButtons = true, 
  height = "70vh",
  className = "",
  heightClass = "",
  onLearnMore,
  onJoinUs,
}: TaggedHeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch heroes and tags
  const { data: allData = { heroes: [], tags: [] }, isLoading } = useQuery({
    queryKey: ['heroes-tagged', filterTags],
    queryFn: async () => {
      // First get all active heroes
      const heroes = await getHeroItems();

      // Get all tags
      const tags = await getTags();

      return {
        heroes: heroes,
        tags: tags
      };
    }
  });

  const heroes = allData.heroes || [];
  const tags = allData.tags || [];

  // Default buttons for all slides
  const defaultButtons = [
    { text: "En savoir plus", variant: "outline" as const },
    { text: "Nous rejoindre", variant: "default" as const },
  ];

  const slides = heroes.map(hero => ({
    image: hero.image_url,
    title: hero.title,
    subtitle: hero.subtitle || '',
    buttons: showButtons ? defaultButtons : [],
  }));

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  // Determine height styling
  const heightStyle = heightClass ? {} : { height };
  const heightClasses = heightClass ? heightClass : "";

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className} ${heightClasses}`} style={heightStyle}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // No slides available
  if (slides.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className} ${heightClasses}`} style={heightStyle}>
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">Aucune image hero disponible</h2>
          <p>
            {filterTags.length > 0 
              ? `Aucun hero trouvé pour les tags: ${filterTags.join(', ')}`
              : 'Les images seront affichées ici une fois configurées.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className} ${heightClasses}`} style={heightStyle}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">
                  {slide.subtitle}
                </p>
                {showButtons && slide.buttons.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                    {slide.buttons.map((button, btnIndex) => (
                      <Button
                        key={btnIndex}
                        variant={button.variant}
                        size="lg"
                        className={`px-8 py-3 text-lg ${
                          button.variant === "default"
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-white text-black hover:bg-white hover:text-gray-900"
                        }`}
                        onClick={() => {
                          if (button.text === "En savoir plus") {
                            onLearnMore && onLearnMore();
                          } else if (button.text === "Nous rejoindre") {
                            onJoinUs && onJoinUs();
                          }
                        }}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaggedHeroCarousel; 