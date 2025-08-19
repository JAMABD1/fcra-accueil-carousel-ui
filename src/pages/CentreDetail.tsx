import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import CenterDetail1 from "@/components/CenterHistory1";
import CenterDetail2 from "@/components/CenterHistory2";
import CenterDetail3 from "@/components/CenterHistory3";
import CenterDetail4 from "@/components/CenterHistory4";
import Counter from "@/components/Counter";
import { fetchPhotosByTags } from "@/lib/utils";

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

interface Tag {
  id: string;
  name: string;
  color: string;
}

const CentreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch center details
  const { data: centre, isLoading: centreLoading } = useQuery({
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
      return data as DatabaseCenter;
    },
    enabled: !!id
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

  // Fetch photos for different sections based on center tag
  const { data: missionPhotos = [] } = useQuery({
    queryKey: ['mission-photos', centre?.tag_id],
    queryFn: async () => {
      if (!centre || !centre.tag_id) {
        return [];
      }
      // Get the center tag name first
      const centerTag = tags.find(tag => tag.id === centre.tag_id);
      if (!centerTag) return [];
      
      // Create mission tag name
      const missionTagName = `${centerTag.name}-mission`;
      const missionTag = tags.find(tag => tag.name === missionTagName);
      
      if (missionTag) {
        return await fetchPhotosByTags([missionTag.id], 5);
      }
      return [];
    },
    enabled: !!centre && !!centre.tag_id && tags.length > 0
  });

  const { data: historyPhotos = [] } = useQuery({
    queryKey: ['history-photos', centre?.tag_id],
    queryFn: async () => {
      if (!centre || !centre.tag_id) {
        return [];
      }
      // Get the center tag name first
      const centerTag = tags.find(tag => tag.id === centre.tag_id);
      if (!centerTag) return [];
      
      // Create history tag name
      const historyTagName = `${centerTag.name}-histoire`;
      const historyTag = tags.find(tag => tag.name === historyTagName);
      
      if (historyTag) {
        return await fetchPhotosByTags([historyTag.id], 5);
      }
      return [];
    },
    enabled: !!centre && !!centre.tag_id && tags.length > 0
  });

  // Fetch related impacts based on center tag
  const { data: relatedImpacts = [] } = useQuery({
    queryKey: ['related-impacts', centre?.tag_id],
    queryFn: async () => {
      if (!centre || !centre.tag_id) return [];
      
      const { data, error } = await supabase
        .from('impact')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      // Filter impacts that match the center's tag
      const filteredImpacts = data.filter((impact: any) => {
        // Check if impact has the same tag_id as center
        if (impact.tags_id === centre.tag_id) return true;
        
        // Check if impact has tag_ids array containing center's tag_id
        if (impact.tag_ids && Array.isArray(impact.tag_ids)) {
          return impact.tag_ids.includes(centre.tag_id);
        }
        
        return false;
      });
      
      return filteredImpacts;
    },
    enabled: !!centre
  });

  // Fetch latest articles
  const { data: latestArticles = [] } = useQuery({
    queryKey: ['latest-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  if (centreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!centre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Centre non trouvé</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Get center tag name for hero filtering
  const centerTag = tags.find(tag => tag.id === centre.tag_id);
  const centerTagNames = centerTag ? [centerTag.name] : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        {centerTagNames.length > 0 && (
          <TaggedHeroCarousel 
            filterTags={centerTagNames}
            showButtons={false}
            heightClass="h-96 md:h-[500px]"
          />
        )}

        {/* Center Header */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {centre.name}
              </h1>
              {centre.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {centre.description}
                </p>
              )}
            </div>

            {/* Center Info Cards */}
            <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
              {centre.address && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Adresse</h3>
                    <p className="text-gray-600">{centre.address}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Center Detail Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dynamic Component with Missions, Vision, Values and History */}
            {(() => {
              const sortOrder = centre.sort_order || 1;
              
              switch (sortOrder) {
                case 1:
                  return <CenterDetail1 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
                case 2:
                  return <CenterDetail2 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
                case 3:
                  return <CenterDetail3 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
                case 4:
                  return <CenterDetail4 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
                default:
                  return <CenterDetail1 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
              }
            })()}
          </div>
        </section>

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

        {/* Directors Section */}
        {centre.directors && centre.directors.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre Équipe
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {centre.directors.map((director) => (
                  <Card key={director.id} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                        {director.image_url ? (
                          <img
                            src={director.image_url}
                            alt={director.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-2xl">
                              {director.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{director.name}</h3>
                      <p className="text-gray-600">{director.job}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CentreDetail; 