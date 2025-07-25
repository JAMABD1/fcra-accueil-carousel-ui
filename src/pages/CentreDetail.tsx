import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BookOpen, Phone, Mail, Building2, Target, TrendingUp, Award, Calendar, User, Play } from "lucide-react";
import { useState } from "react";
import Counter from "@/components/Counter";

interface DatabaseCenter {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
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

const CentreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch centre details
  const { data: centre, isLoading } = useQuery({
    queryKey: ['centre', id],
    queryFn: async () => {
      if (!id) throw new Error('Centre ID is required');
      
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
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as DatabaseCenter;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!centre) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Centre non trouvé</h2>
            <Button onClick={() => navigate('/centres')}>
              Retour aux Centres
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = [
    centre.hero?.image_url || centre.image_url || '/placeholder.svg',
    '/placeholder.svg', // Additional placeholder images
    '/placeholder.svg'
  ].filter(Boolean);

  const mockStats = [
    { title: 'Bénéficiaires', value: 250, suffix: '+', icon: Users },
    { title: 'Programmes', value: 8, suffix: '', icon: BookOpen },
    { title: 'Années d\'expérience', value: 15, suffix: '', icon: Calendar },
    { title: 'Employés', value: centre.directors?.length || 12, suffix: '', icon: User }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000">
          <img 
            src={images[activeImageIndex]} 
            alt={centre.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {centre.name}
          </h1>
          {centre.address && (
            <p className="text-lg md:text-xl mb-6 max-w-2xl flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              {centre.address}
            </p>
          )}
        </div>
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos du centre
            </h2>
            {centre.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {centre.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Notre Mission
                </h3>
                <p className="text-gray-600">
                  Ce centre se consacre à offrir des opportunités d'éducation et de
                  développement aux communautés locales. Nous croyons en un avenir où
                  chaque individu a accès à des ressources pour atteindre son potentiel.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Nos Services
                </h3>
                <p className="text-gray-600">
                  Nous proposons une gamme complète de services incluant la formation
                  professionnelle, l'accompagnement des familles, et des programmes
                  de développement communautaire adaptés aux besoins locaux.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section with Animated Counters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Impact en Chiffres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {mockStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-center">
                    <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directors Section */}
      {centre.directors && centre.directors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Notre Équipe
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {centre.directors.map((director) => (
                <Card key={director.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={director.image_url || '/placeholder.svg'} 
                      alt={director.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-2">{director.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {director.job}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {centre.videos?.youtube_id && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Découvrez notre centre
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${centre.videos.youtube_id}`}
                  title={centre.videos.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nous Contacter
            </h2>
            <p className="text-lg text-gray-600">
              N'hésitez pas à nous contacter pour plus d'informations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {centre.address && (
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Adresse</h3>
                  <p className="text-gray-600">{centre.address}</p>
                </CardContent>
              </Card>
            )}

            {centre.phone && (
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
                  <p className="text-gray-600">{centre.phone}</p>
                </CardContent>
              </Card>
            )}

            {centre.email && (
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">{centre.email}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/centres')}
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
            >
              Retour aux Centres
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CentreDetail; 