
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import MadagascarMap from "@/components/MadagascarMap";
import { MapPin, Users, BookOpen, Heart, ArrowLeft, Play, Calendar, User, ExternalLink, Phone, Mail, Building2, Target, TrendingUp, Award, Search, Building } from "lucide-react";

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
  image_url: string;
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
  image_url: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
      image_url: centre.image_url || "/placeholder.svg",
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

  // Statistics
  const totalCenters = centers.length;
  const totalBeneficiaries = centers.reduce((sum, center) => sum + center.beneficiaries, 0);
  const totalPrograms = centers.reduce((sum, center) => sum + center.programs, 0);
  const totalEmployees = centers.reduce((sum, center) => sum + center.directors.length, 0);
  const avgBeneficiaries = totalCenters > 0 ? Math.round(totalBeneficiaries / totalCenters) : 0;

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCenterClick = (centerId: string) => {
    navigate(`/centres/${centerId}`);
  };

  const handleBackClick = () => {
    setSelectedCenter(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
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
        <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
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
                    src={selectedCenter.image_url} 
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
      <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Nos Centres
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Découvrez nos centres d'excellence répartis à travers Madagascar, 
              chacun dédié au développement communautaire et à l'accompagnement des familles
            </p>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Centres Actifs</CardTitle>
                <Building className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalCenters}</div>
                <p className="text-xs text-gray-500">À travers Madagascar</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bénéficiaires</CardTitle>
                <Users className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalBeneficiaries.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Familles accompagnées</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Programmes</CardTitle>
                <BookOpen className="h-6 w-6 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalPrograms}</div>
                <p className="text-xs text-gray-500">Programmes actifs</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Équipe</CardTitle>
                <Target className="h-6 w-6 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalEmployees}</div>
                <p className="text-xs text-gray-500">Collaborateurs dédiés</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un centre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>
          </div>

          {/* Interactive Map */}
        

          {/* Centers Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Découvrez nos Centres
            </h2>
            
            {filteredCenters.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun centre trouvé
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm 
                    ? "Aucun centre ne correspond à votre recherche."
                    : "Aucun centre actif pour le moment."}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm("")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Afficher tous les centres
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCenters.map((center) => (
                  <Card 
                    key={center.id} 
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg transform hover:-translate-y-1"
                    onClick={() => handleCenterClick(center.id)}
                  >
                    <div 
                      className="h-64 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${center.image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2">{center.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{center.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {center.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{center.beneficiaries}</div>
                          <div className="text-xs text-gray-500">Bénéficiaires</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{center.programs}</div>
                          <div className="text-xs text-gray-500">Programmes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{center.directors.length}</div>
                          <div className="text-xs text-gray-500">Équipe</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {center.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {center.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{center.services.length - 3} autres
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-lg">
                        Découvrir le centre
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12">
                <Award className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Rejoignez Notre Mission
                </h3>
                <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
                  Découvrez comment nos centres peuvent vous accompagner dans votre développement 
                  personnel et communautaire
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-green-600 hover:bg-gray-100 border-0 shadow-lg"
                  >
                    Nous Contacter
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    Nos Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Centres;
