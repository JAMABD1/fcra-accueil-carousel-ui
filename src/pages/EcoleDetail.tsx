import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowLeft, MapPin, Phone, Mail, Users, GraduationCap, Building } from "lucide-react";

interface School {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  capacity: number;
  programs: string[];
  facilities: string[];
  image_url: string;
  images: string[];
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const EcoleDetail = () => {
  const { id } = useParams();

  // Fetch school from Supabase
  const { data: school, isLoading } = useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data as School;
    },
    enabled: !!id
  });

  const { data: relatedSchools = [] } = useQuery({
    queryKey: ['related-schools', school?.type],
    queryFn: async () => {
      if (!school) return [];
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('status', 'published')
        .eq('type', school.type)
        .neq('id', school.id)
        .limit(3);
      
      if (error) throw error;
      return data as School[];
    },
    enabled: !!school,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!school) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">École non trouvée</h1>
            <Link to="/ecoles">
              <Button className="bg-green-600 hover:bg-green-700">
                Retour aux écoles
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/ecoles">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux écoles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* School Header */}
              <Card className="overflow-hidden mb-8">
                {/* Image Carousel */}
                {school.images && school.images.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {school.images.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="h-96 bg-cover bg-center relative">
                            <img 
                              src={imageUrl} 
                              alt={`${school.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {school.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <div className="h-96 bg-cover bg-center relative">
                    <img 
                      src={school.image_url} 
                      alt={school.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                )}

                {/* School Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-600 text-white">
                      {school.type}
                    </Badge>
                    {school.featured && (
                      <Badge className="bg-yellow-600 text-white">
                        École vedette
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {school.name}
                  </h1>
                  <p className="text-lg opacity-90">
                    {school.director && `Dirigé par ${school.director}`}
                  </p>
                </div>
              </Card>

              {/* School Details */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {school.description}
                  </p>
                  
                  {/* Programs */}
                  {school.programs && school.programs.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Programmes offerts
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {school.programs.map((program, index) => (
                          <Badge key={index} variant="secondary">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  {school.facilities && school.facilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Installations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {school.facilities.map((facility, index) => (
                          <Badge key={index} variant="outline">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Information */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Informations de contact</h3>
                  <div className="space-y-3">
                    {school.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{school.address}</span>
                      </div>
                    )}
                    {school.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{school.phone}</span>
                      </div>
                    )}
                    {school.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{school.email}</span>
                      </div>
                    )}
                    {school.capacity && (
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">Capacité: {school.capacity} élèves</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Related Schools */}
              {relatedSchools.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Autres écoles similaires</h3>
                    <div className="space-y-4">
                      {relatedSchools.map((relatedSchool) => (
                        <Link 
                          key={relatedSchool.id} 
                          to={`/ecoles/${relatedSchool.id}`}
                          className="block"
                        >
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div 
                              className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                              style={{ backgroundImage: `url(${relatedSchool.image_url})` }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                                {relatedSchool.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {relatedSchool.type}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EcoleDetail; 