
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/lovable-uploads/36b49c92-9231-4224-b594-e4f46ff08417.png",
      title: "Bienvenue sur FCRA",
      subtitle: "Une association à but non lucratif au service de la communauté.",
      buttons: [
        { text: "En savoir plus", variant: "outline" as const },
        { text: "Nous rejoindre", variant: "default" as const },
      ],
    },
    {
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&h=600&fit=crop",
      title: "Notre Mission",
      subtitle: "Créer un impact durable en offrant des ressources et un soutien à ceux qui en ont besoin.",
      buttons: [
        { text: "Découvrir", variant: "outline" as const },
        { text: "Participer", variant: "default" as const },
      ],
    },
    {
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      title: "Nos Valeurs",
      subtitle: "L'éducation accessible à tous, où les jeunes trouvent des opportunités égales pour réussir.",
      buttons: [
        { text: "Nos programmes", variant: "outline" as const },
        { text: "S'engager", variant: "default" as const },
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[70vh] overflow-hidden">
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                  {slide.buttons.map((button, btnIndex) => (
                    <Button
                      key={btnIndex}
                      variant={button.variant}
                      size="lg"
                      className={`px-8 py-3 text-lg ${
                        button.variant === "default"
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-white text-white hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
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
    </div>
  );
};

export default HeroCarousel;
