
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCentres } from "@/lib/db/queries";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import MadagascarMap from "@/components/MadagascarMap";
import CenterHistory1 from "@/components/CenterHistory1";
import CenterHistory2 from "@/components/CenterHistory2";
import CenterHistory3 from "@/components/CenterHistory3";
import CenterHistory4 from "@/components/CenterHistory4";
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
      return await getCentres();
    }
  });

  // Transform database centres to match the expected format
  const centers: Center[] = dbCentres.map((centreData: any, index) => {
    const centre: DatabaseCenter = {
      ...centreData,
      image_url: centreData.image_url ?? centreData.imageUrl ?? "/placeholder.svg",
      hero: centreData.hero ?? null,
      videos: centreData.videos ?? null,
      directors: centreData.directors ?? [],
    };
    const videos = centre.videos;
    const directors = (centre.directors || []).map((d) => ({
      ...d,
      image_url: d.image_url ?? (d as any).imageUrl ?? "/placeholder.svg",
    }));

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
      name: centre.name || "Centre sans nom",
      description: centre.description || "Centre de développement communautaire",
      image_url: centre.image_url,
      services: ["Éducation", "Formation", "Aide sociale"], // Default services
      beneficiaries: Math.floor(Math.random() * 300) + 100, // Mock data
      programs: Math.floor(Math.random() * 10) + 5, // Mock data
      location: centre.address || "Madagascar",
      coordinates: getCoordinates(centre.name || "", index),
      contact: {
        phone: centre.phone || "+261 20 22 123 45",
        email: centre.email || "contact@fcra.mg",
        address: centre.address || "Madagascar"
      },
      images: [
        centre.hero?.image_url ??
          (centre.hero as any)?.imageUrl ??
          centre.image_url ??
          "/placeholder.svg",
      ],
      video: (() => {
        const youtubeId = videos
          ? (videos as any).youtube_id ?? (videos as any).youtubeId
          : undefined;
        if (youtubeId) {
          return `https://www.youtube.com/embed/${youtubeId}`;
        }
        const videoUrl = (videos as any)?.videoUrl;
        return videoUrl ? videoUrl : undefined;
      })(),
      fullDescription: centre.description || "Ce centre propose une approche holistique du développement communautaire.",
      achievements: [
        "Programmes de formation professionnelle",
        "Accompagnement des familles vulnérables",
        "Partenariats avec les entreprises locales",
        "Centre de santé communautaire"
      ],
      directors
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

            {/* Missions, Vision, Values Section */}
            <section className="mb-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre Engagement
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Chaque centre FCRA s'engage à offrir un accompagnement holistique 
                  et personnalisé pour l'épanouissement de chaque individu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">Notre Mission</h3>
                    <p className="text-gray-600">
                      <ul className="list-disc list-inside">
                        <li>Offrir un accompagnement éducatif et spirituel aux enfants et aux jeunes</li>
                        <li>Soutenir les familles en situation de vulnérabilité à travers des actions de solidarité</li>
                        <li>Promouvoir les valeurs de paix, de respect et d'entraide entre les membres de la communauté</li>
                        <li>Créer un espace d'échange, de dialogue, d'ouverture et de cohésion sociale</li>
                      </ul>
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
                    <p className="text-gray-600">
                      Bâtir une société solidaire, éclairée et harmonieuse, où chaque individu 
                      trouve sa place et peut contribuer au bien commun. Nous rêvons d'un monde où les valeurs humaines et spirituelles guident l'action sociale, où l'éducation est un levier d'émancipation, 
                      et où la fraternité dépasse les différences.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-4">Nos Valeurs</h3>
                    <p className="text-gray-600">
                      <ul className="list-disc list-inside">
                        <li><span className="font-bold">Solidarité :</span> L'union et le soutien mutuel sont au cœur de toutes nos actions.</li>
                        <li><span className="font-bold">Respect :</span> Nous valorisons la dignité de chaque personne, sans distinction.</li>
                        <li><span className="font-bold">Foi et spiritualité :</span> Nous nous inspirons des principes moraux pour orienter nos engagements.</li>
                        <li><span className="font-bold">Engagement :</span> Nous travaillons avec sincérité, persévérance et responsabilité.</li>
                        <li><span className="font-bold">Éducation :</span> L'accès à la connaissance est la clé du changement et de la liberté.</li>
                      </ul>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* History and Video Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dynamic History Component */}
                {(() => {
                  const sortOrder =
                    dbCentres.find((c: any) => c.id === selectedCenter.id)?.sort_order ??
                    dbCentres.find((c: any) => c.id === selectedCenter.id)?.sortOrder ??
                    1;
                  switch (sortOrder) {
                    case 1:
                      return <CenterHistory1 />;
                    case 2:
                      return <CenterHistory2 />;
                    case 3:
                      return <CenterHistory3 />;
                    case 4:
                      return <CenterHistory4 />;
                    default:
                      return <CenterHistory1 />;
                  }
                })()}

                {/* Video */}
                {selectedCenter.video && (
                  <div className="col-span-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Présentation Vidéo
                    </h3>
                    <div className="aspect-video">
                      <iframe
                        src={selectedCenter.video}
                        title={`Vidéo de ${selectedCenter.name}`}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

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


          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Centres
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez nos centres d'excellence répartis à travers Madagascar, chacun dédié au développement communautaire et à l'accompagnement des familles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {centers.map((center) => (
              <Card key={center.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${center.image_url})` }}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{center.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {center.description.substring(0, 150)}{center.description.length > 150 ? '...' : ''}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCenterClick(center.id)}
                  >
                    Découvrir ce centre
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Centres;
