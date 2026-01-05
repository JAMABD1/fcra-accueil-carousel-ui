import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { schools, videos } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import EcolesDetail1 from "@/components/EcolesHistory1";
import EcolesDetail2 from "@/components/EcolesHistory2";
import EcolesDetail3 from "@/components/EcolesHistory3";
import EcolesDetail4 from "@/components/EcolesHistory4";
import Counter from "@/components/Counter";
import { fetchPhotosByTags } from "@/lib/utils";
import { getImpactItems, getArticles, getTags } from "@/lib/db/queries";

interface School {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl: string;
  tagId: string | null;
  videoId: string | null;
  active: boolean | null;
  sortOrder: number | null;
  subtitle: string | null;
  coordonneId: string | null;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed
}

// Coordonne interface for type safety
interface Coordonne {
  id: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  tags_id: string | null;
  google_map_url: string | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

const EcoleDetail = () => {
  const { id } = useParams();

  // Fetch school from database (with joined video)
  const { data: school, isLoading } = useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const result = await db
        .select({
          school: schools,
          video: videos,
        })
        .from(schools)
        .leftJoin(videos, eq(schools.videoId, videos.id))
        .where(eq(schools.id, id!))
        .limit(1);

      if (!result[0]) return null;

      const { school: schoolData, video } = result[0];
      return {
        id: schoolData.id,
        name: schoolData.name,
        description: schoolData.description,
        type: schoolData.type,
        imageUrl: schoolData.imageUrl,
        tagId: schoolData.tagId,
        videoId: schoolData.videoId,
        active: schoolData.active,
        sortOrder: schoolData.sortOrder,
        subtitle: schoolData.subtitle,
        coordonneId: schoolData.coordonneId,
        createdAt: schoolData.createdAt,
        updatedAt: schoolData.updatedAt,
        video: video || null,
      } as School;
    },
    enabled: !!id
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { getTags } = await import("@/lib/db/queries");
      return await getTags();
    }
  });

  // Fetch coordonnees for this school
  const { data: coordonne } = useQuery({
    queryKey: ['coordonne', school?.coordonneId],
    queryFn: async () => {
      if (!school?.coordonneId) return null;
      const { getCoordonnes } = await import("@/lib/db/queries");
      const coordonnes = await getCoordonnes();
      return coordonnes.find(c => c.id === school.coordonneId) || null;
    },
    enabled: !!school?.coordonneId,
  });

  const { data: relatedSchools = [] } = useQuery({
    queryKey: ['related-schools', school?.type],
    queryFn: async () => {
      if (!school) return [];
      const { getSchools } = await import("@/lib/db/queries");
      const schools = await getSchools({ status: 'published' });
      return schools
        .filter(s => s.type === school.type && s.id !== school.id)
        .slice(0, 3);
    },
    enabled: !!school,
  });

  // Fetch impacts with the same tag as the school
  const { data: relatedImpacts = [] } = useQuery({
    queryKey: ['impacts-by-tag', school?.tagId],
    queryFn: async () => {
      if (!school?.tagId) return [];
      const impacts = await getImpactItems(true);
      // Filter impacts that have the same tagId in their tagIds array
      return impacts.filter((impact: any) => {
        let tagIds: string[] = [];
        if (impact.tagIds) {
          if (typeof impact.tagIds === 'string') {
            try { tagIds = JSON.parse(impact.tagIds); } catch { tagIds = []; }
          } else if (Array.isArray(impact.tagIds)) {
            tagIds = impact.tagIds;
          }
        }
        // Also support legacy tagsId field
        if (tagIds.length === 0 && impact.tagsId) tagIds = [impact.tagsId];
        return tagIds.includes(school.tagId);
      });
    },
    enabled: !!school?.tagId
  });

  // Fetch photos for different sections based on school tag
  const { data: missionPhotos = [] } = useQuery({
    queryKey: ['mission-photos', school?.tagId],
    queryFn: async () => {
      if (!school || !school.tagId) {
        return [];
      }
      // Get the school tag name first
      const schoolTag = tags.find(tag => tag.id === school.tagId);
      if (!schoolTag) return [];
      
      // Create mission tag name
      const missionTagName = `${schoolTag.name}-mission`;
      const missionTag = tags.find(tag => tag.name === missionTagName);
      
      if (missionTag) {
        return await fetchPhotosByTags([missionTag.id], 5);
      }
      return [];
    },
    enabled: !!school && !!school.tagId && tags.length > 0
  });

  const { data: historyPhotos = [] } = useQuery({
    queryKey: ['history-photos', school?.tagId],
    queryFn: async () => {
      if (!school || !school.tagId) {
        return [];
      }
      // Get the school tag name first
      const schoolTag = tags.find(tag => tag.id === school.tagId);
      if (!schoolTag) return [];
      
      // Create history tag name
      const historyTagName = `${schoolTag.name}-histoire`;
      const historyTag = tags.find(tag => tag.name === historyTagName);
      
      if (historyTag) {
        return await fetchPhotosByTags([historyTag.id], 5);
      }
      return [];
    },
    enabled: !!school && !!school.tagId && tags.length > 0
  });

  // Fetch up to 3 latest articles with the same tag as the school
  const { data: latestArticles = [] } = useQuery({
    queryKey: ['latest-articles-by-tag', school?.tagId],
    queryFn: async () => {
      if (!school?.tagId) return [];
      const articles = await getArticles({ status: 'published', limit: 20 });
      // Filter articles that have the same tagId in their tags array
      return articles.filter((article: any) => {
        const articleTags = article.tags || [];
        return Array.isArray(articleTags) && articleTags.includes(school.tagId);
      }).slice(0, 3);
    },
    enabled: !!school?.tagId
  });

  // Remove the relatedVideos query (no longer needed)

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

  const video: any = school && school.video && typeof school.video === 'object' && !('code' in school.video) ? school.video : null;

  // Get school tag name for hero filtering
  const schoolTag = tags.find(tag => tag.id === school.tagId);
  const schoolTagNames = schoolTag ? [schoolTag.name] : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        {schoolTagNames.length > 0 && (
          <TaggedHeroCarousel 
            filterTags={schoolTagNames}
            showButtons={false}
            heightClass="h-96 md:h-[500px]"
          />
        )}

      

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de l'école
            </h2>
            {school.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {school.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Ecoles Detail Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dynamic Component with Missions, Vision, Values and History */}
          {(() => {
            const sortOrder = school.sort_order || 1;
            
            switch (sortOrder) {
              case 1:
                return <EcolesDetail1 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
              case 2:
                return <EcolesDetail2 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
              case 3:
                return <EcolesDetail3 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
              case 4:
                return <EcolesDetail4 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
              default:
                return <EcolesDetail1 missionPhotos={missionPhotos} historyPhotos={historyPhotos} />;
            }
          })()}
        </div>
      </section>

      {/* Video Section (joined video like centre) */}
      {video && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Découvrez notre école
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                {video.video_type === "youtube" && video.youtube_id && (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
                {video.video_type === "upload" && video.video_url && (
                  <video
                    src={video.video_url}
                    controls
                    className="w-full h-full"
                    title={video.title}
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
                    <p className="text-gray-600">{impact.subtitle}</p>
                  )}
                </div>
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
            {coordonne?.address && (
              <div className="p-6 text-center bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600">{coordonne.address}</p>
              </div>
            )}
            {coordonne?.phone && (
              <div className="p-6 text-center bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600">{coordonne.phone}</p>
              </div>
            )}
            {coordonne?.email && (
              <div className="p-6 text-center bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">{coordonne.email}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notre Localisation Section (like homepage) */}
      {coordonne?.google_map_url && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Notre Localisation
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Trouvez-nous sur la carte ci-dessous.
              </p>
              <div className="w-full flex justify-center mb-8">
                <iframe
                  src={coordonne.google_map_url}
                  width="100%"
                  height="450"
                  style={{ border: 0, maxWidth: '800px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Schools Section */}
      {relatedSchools.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Autres écoles similaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {relatedSchools.map((relatedSchool) => (
                <Link 
                  key={relatedSchool.id} 
                  to={`/ecoles/${relatedSchool.id}`}
                  className="block"
                >
                  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
                    <div 
                      className="w-24 h-24 bg-cover bg-center rounded-full mb-4"
                      style={{ backgroundImage: `url(${relatedSchool.image_url})` }}
                    />
                    <h4 className="font-medium text-gray-900 line-clamp-2 text-lg mb-2">
                      {relatedSchool.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {relatedSchool.type}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Derniers Articles Section */}
      {latestArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Derniers articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {latestArticles.map((article: any) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg'})` }}></div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{new Date(article.created_at).toLocaleDateString('fr-FR')}</p>
                    <p className="text-gray-600 text-sm">{article.excerpt || (article.content && article.content.substring(0, 150) + '...')}</p>
                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" asChild>
                      <a href={`/actualites/${article.id}`}>Lire l'article</a>
                    </Button>
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

export default EcoleDetail; 