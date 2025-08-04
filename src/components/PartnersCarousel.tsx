import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Users } from "lucide-react";

interface Partner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  tag_ids: string[] | null;
  sort_order: number | null;
  active: boolean | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface PartnersCarouselProps {
  filterTags?: string[];
  maxPartners?: number;
  className?: string;
}

const PartnersCarousel = ({ 
  filterTags = [], 
  maxPartners = 10,
  className = ""
}: PartnersCarouselProps) => {
  const [api, setApi] = useState<any>();

  // Fetch partners
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners-public', filterTags],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Partner[];
    }
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Tag[];
    }
  });

  // Filter partners based on tags if provided
  const filteredPartners = partners.filter(partner => {
    if (filterTags.length === 0) return true;
    
    const partnerTagNames = partner.tag_ids
      ?.map(tagId => tags.find(tag => tag.id === tagId)?.name)
      .filter(Boolean) || [];
    
    return filterTags.some(filterTag => 
      partnerTagNames.includes(filterTag)
    );
  }).slice(0, maxPartners);



  // Loading state
  if (isLoading) {
    return (
      <div className={`py-16 bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              Nos Partenaires
            </h2>
          </div>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // No partners available
  if (filteredPartners.length === 0) {
    return null;
  }

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-green-600" />
            Nos Partenaires
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos partenaires qui nous accompagnent dans notre mission
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredPartners.map((partner) => (
              <CarouselItem key={partner.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div 
                  className="text-center cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                >
                  {/* Partner Logo - Large Round Image */}
                  <div className="mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <img 
                        src={partner.image_url}   
                        alt={partner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Partner Name */}
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    {partner.title}
                  </h3>

                  {/* Partner Subtitle */}
                  {partner.subtitle && (
                    <p className="text-gray-600 text-sm">
                      {partner.subtitle}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default PartnersCarousel; 