import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";

interface Section {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
}

interface SectionsGalleryProps {
  sections: Section[];
}

const SectionsGallery = ({ sections }: SectionsGalleryProps) => {
  if (sections.length === 0) return null;

  return (
    <ScrollReveal>
      <Carousel
        opts={{ align: "start", loop: sections.length > 3 }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {sections.map((section) => (
            <CarouselItem
              key={section.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Card className="overflow-hidden card-lift hover:shadow-xl h-full">
                <div
                  className="h-52 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${section.image_url || "/placeholder.svg"})`,
                  }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {section.subtitle}
                    </p>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/sections/${section.slug}`}>Voir plus</Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {sections.length > 1 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </>
        )}
      </Carousel>
    </ScrollReveal>
  );
};

export default SectionsGallery;
