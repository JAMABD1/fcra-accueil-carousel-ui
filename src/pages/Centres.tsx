
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import MadagascarMap from "@/components/MadagascarMap";
import { MapPin, Users, BookOpen, Heart, ArrowLeft, Play, Calendar, User, ExternalLink, Phone, Mail, Building2, Target, TrendingUp, Award } from "lucide-react";

interface DatabaseCenter {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  hero_id: string | null;
  video_id: string | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  hero?: {
    id: string;
    title: string;
    image_url: string;
  } | null;
  videos?: {
    id: string;
    title: string;
    video_type: string;
    youtube_id: string;
  } | null;
  directors?: {
    id: string;
    name: string;
    job: string;
    image_url: string;
  }[];
}

interface Center {
  id: string;
  name: string;
  description: string;
  image: string;
  services: string[];
  beneficiaries: number;
  programs: number;
  location: string;
  coordinates: {
    x: number;
    y: number;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  images: string[];
  video?: string;
  fullDescription: string;
  achievements: string[];
  directors: Array<{
    id: string;
    name: string;
    job: string;
    image_url: string;
  }>;
}

const Centres = () => {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  // Fetch centres from database
  const { data: dbCentres = [], isLoading, error } = useQuery({
    queryKey: ['centres-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centres')
        .select(`
          *,
          hero (
            id,
            title,
            image_url
          ),
          videos (
            id,
            title,
            video_type,
            youtube_id
          ),
          directors (
            id,
            name,
            job,
            image_url
          )
        `)
        .eq('active', true)
        .order('sort_order')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DatabaseCenter[];
    }
  });

  // Transform database centres to match the expected format
  const centers: Center[] = dbCentres.map((centre, index) => {
    // Generate mock coordinates based on centre name or index
    const getCoordinates = (name: string, index: number) => {
      if (name.toLowerCase().includes('antananarivo')) return { x: 430, y: 205 };
      if (name.toLowerCase().includes('toamasina')) return { x: 520, y: 280 };
      if (name.toLowerCase().includes('fianarantsoa')) return { x: 450, y: 350 };
      if (name.toLowerCase().includes('mahajanga')) return { x: 380, y: 150 };
      if (name.toLowerCase().includes('antsirabe')) return { x: 420, y: 250 };
      // Default coordinates with some variation
      return { x: 400 + (index * 30), y: 200 + (index * 40) };
    };

    return {
      id: centre.id,
      name: centre.name,
      description: centre.description || "Centre de développement communautaire",
      image: centre.hero?.image_url || "/placeholder.svg",
      services: ["Éducation", "Formation", "Aide sociale"], // Default services
      beneficiaries: Math.floor(Math.random() * 300) + 100, // Mock data
      programs: Math.floor(Math.random() * 10) + 5, // Mock data
      location: centre.address || "Madagascar",
      coordinates: getCoordinates(centre.name, index),
      contact: {
        phone: centre.phone || "+261 20 22 123 45",
        email: centre.email || "contact@fcra.mg",
        address: centre.address || "Madagascar"
      },
      images: centre.hero?.image_url ? [centre.hero.image_url] : ["/placeholder.svg"],
      video: centre.videos?.youtube_id ? `https://www.youtube.com/embed/${centre.videos.youtube_id}` : undefined,
      fullDescription: centre.description || "Ce centre propose une approche holistique du développement communautaire.",
      achievements: [
        "Programmes de formation professionnelle",
        "Accompagnement des familles vulnérables",
        "Partenariats avec les entreprises locales",
        "Centre de santé communautaire"
      ],
      directors: centre.directors || []
    };
  });

  const globalStats = {
    totalBeneficiaries: centers.reduce((sum, center) => sum + center.beneficiaries, 0),
    totalPrograms: centers.reduce((sum, center) => sum + center.programs, 0),
    totalCenters: centers.length,
    totalEmployees: centers.reduce((sum, center) => sum + center.directors.length, 0)
  };

  const handleCenterClick = (centerId: string) => {
    const center = centers.find(c => c.id === centerId);
    if (center) {
      setSelectedCenter(center);
    }
  };

  const handleBackClick = () => {
    setSelectedCenter(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">
                Erreur lors du chargement des centres. Veuillez réessayer plus tard.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedCenter) {
    return (
      <Layout>
        <div className="py-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux centres
            </Button>

            {/* Center Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={selectedCenter.image} 
                    alt={selectedCenter.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedCenter.name}
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {selectedCenter.fullDescription}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span>{selectedCenter.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <span>{selectedCenter.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>{selectedCenter.contact.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedCenter.beneficiaries}</div>
                  <div className="text-sm text-gray-600">Bénéficiaires</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedCenter.programs}</div>
                  <div className="text-sm text-gray-600">Programmes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedCenter.services.length}</div>
                  <div className="text-sm text-gray-600">Services</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{selectedCenter.directors.length}</div>
                  <div className="text-sm text-gray-600">Personnel</div>
                </CardContent>
              </Card>
            </div>

            {/* Services */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Services Offerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Réalisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedCenter.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Team */}
            {selectedCenter.directors.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedCenter.directors.map((director) => (
                      <div key={director.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={director.image_url || "/placeholder.svg"} 
                          alt={director.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{director.name}</div>
                          <div className="text-sm text-gray-600">{director.job}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {selectedCenter.video && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Présentation Vidéo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={selectedCenter.video}
                      title={`Vidéo de ${selectedCenter.name}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Centres FCRA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos centres à travers Madagascar et leur impact sur les communautés locales
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{globalStats.totalCenters}</div>
                <div className="text-sm text-gray-600">Centres Actifs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{globalStats.totalBeneficiaries}</div>
                <div className="text-sm text-gray-600">Bénéficiaires</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{globalStats.totalPrograms}</div>
                <div className="text-sm text-gray-600">Programmes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{globalStats.totalEmployees}</div>
                <div className="text-sm text-gray-600">Employés</div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Localisation de nos Centres
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <MadagascarMap
                centers={centers}
                onCenterClick={handleCenterClick}
              />
            </div>
          </div>

          {/* Centers Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Découvrez nos Centres
            </h2>
            
            {centers.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Aucun centre actif pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {centers.map((center) => (
                  <Card 
                    key={center.id} 
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleCenterClick(center.id)}
                  >
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${center.image})` }}
                    />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {center.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {center.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-green-600" />
                          <span>{center.beneficiaries} bénéficiaires</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span>{center.programs} programmes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span>{center.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {center.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        En savoir plus
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Centres;
