import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import DirectHeroCarousel from "@/components/DirectHeroCarousel";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import ContactInfoGrid from "@/components/ContactInfoGrid";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import CenterDetail1 from "@/components/CenterHistory1";
import CenterDetail2 from "@/components/CenterHistory2";
import CenterDetail3 from "@/components/CenterHistory3";
import CenterDetail4 from "@/components/CenterHistory4";
import Counter from "@/components/Counter";

interface DatabaseCenter {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  tag_id: string | null;
  video_id: string | null;
  hero_ids: string[] | null;
  mission_images: string[] | null;
  history_images: string[] | null;
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
  heroes?: {
    id: string;
    title: string;
    subtitle?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
  }[];
}

const CentreDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch center details (includes heroes/missionImages/historyImages/directors)
  const { data: centre, isLoading: centreLoading } = useQuery({
    queryKey: ['centre', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Centre slug is required');

      const { getCentres } = await import("@/lib/db/queries");
      const allCentres = await getCentres();
      return allCentres.find((c: any) => c.slug === slug || c.id === slug) as DatabaseCenter | undefined ?? null;
    },
    enabled: !!slug
  });

  const missionPhotos = centre?.mission_images || [];
  const historyPhotos = centre?.history_images || [];
  const centreHeroes = centre?.heroes || [];

  // Fetch related impacts based on center tag
  const { data: relatedImpacts = [] } = useQuery({
    queryKey: ['related-impacts', centre?.tag_id],
    queryFn: async () => {
      if (!centre || !centre.tag_id) return [];

      const { getImpactItems } = await import("@/lib/db/queries");
      const impacts = await getImpactItems();

      // Filter impacts that match the center's tag
      const filteredImpacts = impacts.filter((impact: any) => {
        // Check if impact has the same tag_id as center
        if (impact.tagsId === centre.tag_id) return true;

        // Check if impact has tag_ids array containing center's tag_id
        if (impact.tagIds && Array.isArray(impact.tagIds)) {
          return impact.tagIds.includes(centre.tag_id);
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
      const { getArticles } = await import("@/lib/db/queries");
      return await getArticles({ status: 'published', limit: 6 });
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        {centreHeroes.length > 0 && (
          <DirectHeroCarousel heroes={centreHeroes} heightClass="h-96 md:h-[500px]" />
        )}

        {/* Center Header */}
        <section className="py-12 lg:py-14 bg-white relative overflow-hidden">
          <div className="grain-overlay pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-8">
                <p className="eyebrow-label mb-3">Centre FCRA</p>
                <h1 className="text-section font-bold text-gray-900 mb-4">{centre.name}</h1>
                {centre.description && (
                  <p className="text-lg text-gray-600 leading-relaxed">{centre.description}</p>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Dynamic Center Detail Section */}
        <section className="py-12 lg:py-14 bg-gray-50">
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
          <section className="py-12 lg:py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading title="Notre impact en chiffres" align="center" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {relatedImpacts.map((impact: any) => (
                  <div key={impact.id} className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
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

        <ContactInfoGrid address={centre.address} phone={centre.phone} email={centre.email} />

        {/* Derniers Articles Section */}
        {latestArticles.length > 0 && (
          <section className="py-12 lg:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <SectionHeading eyebrow="Actualités" title="Derniers articles" align="left" className="mb-0" />
                <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 shrink-0">
                  <Link to="/actualites">Voir tous les articles</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
          </section>
        )}

        {/* Directors Section */}
        {centre.directors && centre.directors.length > 0 && (
          <section className="py-12 lg:py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Équipe" title="Notre équipe" align="center" className="mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {centre.directors.map((director, index) => (
                  <ScrollReveal key={director.id} delay={index * 0.08}>
                    <Card className="text-center border-gray-100 card-lift overflow-hidden">
                      <CardContent className="p-6">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-green-50">
                          {director.image_url ? (
                            <img
                              src={director.image_url}
                              alt={director.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-green-50 flex items-center justify-center">
                              <span className="text-green-600 text-2xl font-bold">
                                {director.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{director.name}</h3>
                        <p className="text-gray-600 text-sm">{director.job}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
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