import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import DirectHeroCarousel from "@/components/DirectHeroCarousel";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import ContactInfoGrid from "@/components/ContactInfoGrid";
import EntityListingCard from "@/components/EntityListingCard";
import NewsCard from "@/components/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EcolesDetail1 from "@/components/EcolesHistory1";
import EcolesDetail2 from "@/components/EcolesHistory2";
import EcolesDetail3 from "@/components/EcolesHistory3";
import EcolesDetail4 from "@/components/EcolesHistory4";
import Counter from "@/components/Counter";
import { getImpactItems, getArticles } from "@/lib/db/queries";

interface School {
  id: string;
  name: string;
  slug: string;
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
  sort_order?: number | null;
  missionImages?: string[] | null;
  historyImages?: string[] | null;
  video?: any;
  heroes?: {
    id: string;
    title: string;
    subtitle?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
  }[];
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
  const { slug } = useParams();

  // Fetch school from database (includes joined video/coordonne/heroes/missionImages/historyImages)
  const { data: school, isLoading } = useQuery({
    queryKey: ['school', slug],
    queryFn: async () => {
      const { getSchools } = await import("@/lib/db/queries");
      const allSchools = await getSchools();
      const found = allSchools.find((s: any) => s.slug === slug || s.id === slug);
      return (found as any as School) ?? null;
    },
    enabled: !!slug
  });

  const missionPhotos = (school as any)?.missionImages || [];
  const historyPhotos = (school as any)?.historyImages || [];
  const schoolHeroes = (school as any)?.heroes || [];
  const coordonne = (school as any)?.coordonnes || null;

  const { data: relatedSchools = [] } = useQuery({
    queryKey: ['related-schools', school?.type],
    queryFn: async () => {
      if (!school) return [];
      const { getSchools } = await import("@/lib/db/queries");
      const schools = await getSchools({ status: 'published' });
      return schools
        .filter(s => s.type === school.type && s.slug !== school.slug)
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        {schoolHeroes.length > 0 && (
          <DirectHeroCarousel heroes={schoolHeroes} heightClass="h-96 md:h-[500px]" />
        )}

      

      {/* About Section */}
      <section className="py-12 lg:py-14 bg-white relative overflow-hidden">
        <div className="grain-overlay pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              {school.type && (
                <Badge className="mb-4 bg-green-600 text-white border-0 capitalize">{school.type}</Badge>
              )}
              <p className="eyebrow-label mb-3">Établissement scolaire</p>
              <h1 className="text-section font-bold text-gray-900 mb-3">{school.name}</h1>
              {school.subtitle && <p className="text-green-700 font-medium mb-4">{school.subtitle}</p>}
              {school.description && (
                <p className="text-lg text-gray-600 leading-relaxed">{school.description}</p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Dynamic Ecoles Detail Section */}
      <section className="py-12 lg:py-14 bg-gray-50">
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
        <section className="py-12 lg:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Vidéo" title="Découvrez notre école" align="center" className="mb-8" />
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100">
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
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Impact Section with Animated Counters */}
      {relatedImpacts.length > 0 && (
        <section className="py-12 lg:py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Notre impact en chiffres" align="center" className="mb-8" />
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

      <ContactInfoGrid address={coordonne?.address} phone={coordonne?.phone} email={coordonne?.email} />

      {/* Notre Localisation Section (like homepage) */}
      {coordonne?.google_map_url && (
        <section className="py-12 lg:py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Localisation"
              title="Notre localisation"
              subtitle="Trouvez-nous sur la carte ci-dessous."
              align="center"
              className="mb-8"
            />
            <ScrollReveal>
              <div className="w-full flex justify-center">
                <iframe
                  src={coordonne.google_map_url}
                  width="100%"
                  height="450"
                  style={{ border: 0, maxWidth: '800px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl shadow-xl border border-gray-100"
                  title="Carte de localisation"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Related Schools Section */}
      {relatedSchools.length > 0 && (
        <section className="py-12 lg:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Similaires" title="Autres écoles similaires" align="center" className="mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedSchools.map((relatedSchool, index) => (
                <ScrollReveal key={relatedSchool.id} delay={index * 0.06}>
                  <EntityListingCard
                    id={relatedSchool.id}
                    name={relatedSchool.name}
                    badge={relatedSchool.type}
                    subtitle={relatedSchool.subtitle}
                    imageUrl={relatedSchool.imageUrl}
                    href={`/ecoles/${relatedSchool.slug}`}
                    ctaLabel="Voir l'école"
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Derniers Articles Section */}
      {latestArticles.length > 0 && (
        <section className="py-12 lg:py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Actualités" title="Derniers articles" align="center" className="mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {latestArticles.map((article: any, index: number) => (
                <ScrollReveal key={article.id} delay={index * 0.06}>
                  <NewsCard
                    id={article.id}
                    slug={article.slug}
                    title={article.title}
                    date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    author={article.author ?? undefined}
                    image={article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg'}
                    excerpt={article.excerpt || `${(article.content ?? '').substring(0, 140)}...`}
                    tags={article.tags ?? []}
                  />
                </ScrollReveal>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" asChild>
                <Link to="/actualites">Voir tous les articles</Link>
              </Button>
            </div>
          </div>
        </section>
              )}
      </div>
    </Layout>
    );
  };

export default EcoleDetail; 