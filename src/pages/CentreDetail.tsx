import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BookOpen, Phone, Mail, Building2, Target, TrendingUp, Award, Calendar, User, Play } from "lucide-react";
import { useState, useEffect } from "react";
import Counter from "@/components/Counter";

interface DatabaseCenter {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  tag_id: string | null;
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
    video_url: string;
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
          videos (
            id,
            title,
            video_type,
            youtube_id,
            video_url
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
      return {
        id: data.id,
        name: data.name,
        description: data.description ?? null,
        address: data.address ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        image_url: data?.image_url ?? null,
        tag_id: data?.tag_id ?? null,
        video_id: data.video_id ?? null,
        sort_order: data.sort_order ?? null,
        active: data.active ?? null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        videos: data.videos ?? null,
        directors: data.directors ?? [],
      } as DatabaseCenter;
    },
    enabled: !!id
  });

  // Fetch related impacts with the same tag
  const { data: relatedImpacts = [] } = useQuery({
    queryKey: ['impacts-by-tag', centre?.tag_id],
    queryFn: async () => {
      if (!centre?.tag_id) return [];
      const { data, error } = await supabase
        .from('impact')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      // Filter impacts that have the same tag_id in their tag_ids array
      return (data || []).filter((impact: any) => {
        let tagIds: string[] = [];
        if (impact.tag_ids) {
          if (typeof impact.tag_ids === 'string') {
            try { tagIds = JSON.parse(impact.tag_ids); } catch { tagIds = []; }
          } else if (Array.isArray(impact.tag_ids)) {
            tagIds = impact.tag_ids;
          }
        }
        // Also support legacy tags_id field
        if (tagIds.length === 0 && impact.tags_id) tagIds = [impact.tags_id];
        return tagIds.includes(centre.tag_id);
      });
    },
    enabled: !!centre?.tag_id
  });

  // Fetch the latest article with the same tag as the centre
  const { data: latestArticle } = useQuery({
    queryKey: ['latest-article-by-tag', centre?.tag_id],
    queryFn: async () => {
      if (!centre?.tag_id) return null;
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, content, created_at')
        .contains('tags', [centre.tag_id])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!centre?.tag_id
  });

  // Fetch up to 3 latest articles with the same tag as the centre
  const { data: latestArticles = [] } = useQuery({
    queryKey: ['latest-articles-by-tag', centre?.tag_id],
    queryFn: async () => {
      if (!centre?.tag_id) return [];
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', [centre.tag_id])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!centre?.tag_id
  });

  console.log("latestArticle", latestArticle);
  // Fetch heroes with the same tag as the centre for the hero section images
  const { data: heroImages = [] } = useQuery({
    queryKey: ['hero-images-by-tag', centre?.tag_id],
    queryFn: async () => {
      if (!centre?.tag_id) return [];
      const { data, error } = await supabase
        .from('hero')
        .select('image_url,tag_ids')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      // Filter heroes that have the same tag_id in their tag_ids array
      return (data || []).filter((hero: any) => {
        let tagIds: string[] = [];
        if (hero.tag_ids) {
          if (typeof hero.tag_ids === 'string') {
            try { tagIds = JSON.parse(hero.tag_ids); } catch { tagIds = []; }
          } else if (Array.isArray(hero.tag_ids)) {
            tagIds = hero.tag_ids;
          }
        }
        // Also support legacy tags_id field
        if (tagIds.length === 0 && hero.tags_id) tagIds = [hero.tags_id];
        return tagIds.includes(centre.tag_id);
      });
    },
    enabled: !!centre?.tag_id
  });

  // Use hero images for the hero section carousel
  const images = (heroImages.length > 0
    ? heroImages.map((hero: any) => hero.image_url || '/placeholder.svg')
    : [centre?.image_url || '/placeholder.svg']
  ).filter(Boolean);

  // Auto-scroll hero images like a carousel
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

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
        </div>
      </section>

      {/* Video Section */}
      {centre.videos && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Découvrez notre centre
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                {centre.videos.video_type === "youtube" && centre.videos.youtube_id && (
                  <iframe
                    src={`https://www.youtube.com/embed/${centre.videos.youtube_id}`}
                    title={centre.videos.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
                {centre.videos.video_type === "upload" && centre.videos.video_url && (
                  <video
                    src={centre.videos.video_url}
                    controls
                    className="w-full h-full"
                    title={centre.videos.title}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Impact Section with Animated Counters */}
      {relatedImpacts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Notre Impact en Chiffres
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedImpacts.map((impact: any) => (
                <div key={impact.id} className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Counter end={impact.number} suffix="+" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{impact.title}</h3>
                  {impact.subtitle && (
                    <p className="text-gray-600 mb-3">{impact.subtitle}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Derniers Articles Section */}
      {latestArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="text-center md:text-left w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Derniers articles
                </h2>
              </div>
              <div className="hidden md:block ml-4">
                <Button 
                  variant="link" 
                  className="text-green-600 hover:text-green-700"
                  onClick={() => navigate('/actualites')}
                >
                  Voir tous les articles
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article: any) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg'})` }}></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt || (article.content?.substring(0, 150) + '...')}</p>
                    <Button asChild variant="outline" className="w-full mt-2">
                      <a href={`/actualites/${article.id}`}>Lire l'article</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Article Section */}
      {latestArticle && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Dernière Actualité liée à ce centre
              </h2>
            </div>
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-2xl mb-2">{latestArticle.title}</h3>
                <p className="text-gray-600 mb-4">{latestArticle.excerpt || latestArticle.content?.substring(0, 150) + '...'}</p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href={`/actualites/${latestArticle.id}`}>Lire l'article</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

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