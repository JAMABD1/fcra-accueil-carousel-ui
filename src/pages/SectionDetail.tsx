import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { sections } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Target, Newspaper, ImageIcon } from "lucide-react";
import OrphelinatSection from "@/components/OrphelinatSection";
import EducationSection from "@/components/EducationSection";
import SanteSection from "@/components/SanteSection";
import ReligionSection from "@/components/ReligionSection";
import InfoproSection from "@/components/InfoproSection";
import UniversitesSection from "@/components/UniversitesSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import Counter from "@/components/Counter";
import { fetchPhotosByTags } from "@/lib/utils";
import { getTags, getImpactItems, getArticles, getPartners } from "@/lib/db/queries";

interface Section {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  hero_id: string | null;
  tag_name: string | null;
  tag_ids: string[] | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface Hero {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  tag_ids: string[];
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface Impact {
  id: string;
  title: string;
  subtitle: string | null;
  number: number;
  tag_ids: string[];
  tags_id: string | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

const SectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch section details
  const { data: section, isLoading: sectionLoading } = useQuery({
    queryKey: ['section', id],
    queryFn: async () => {
      if (!id) throw new Error('Section ID is required');

      const result = await db.select().from(sections).where(eq(sections.id, id)).limit(1);
      return result[0];
    },
    enabled: !!id
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Fetch photos based on section tags
  const { data: sectionPhotos = [] } = useQuery({
    queryKey: ['section-photos', section?.tag_ids],
    queryFn: async () => {
      if (!section || !section.tag_ids || section.tag_ids.length === 0) {
        return [];
      }
      return await fetchPhotosByTags(section.tag_ids, 10);
    },
    enabled: !!section && !!section.tag_ids && section.tag_ids.length > 0
  });

  // Fetch related impacts based on shared tags
  const { data: relatedImpacts = [] } = useQuery({
    queryKey: ['related-impacts', section?.tag_ids],
    queryFn: async () => {
      if (!section || !section.tag_ids || section.tag_ids.length === 0) return [];
      
      const impacts = await getImpactItems(true);
      
      // Process impacts to handle tagIds properly
      const processedImpacts = impacts.map((impact: any) => {
        let tagIds = [];
        
        // Handle both JSON string and array formats for tagIds (check both snake_case and camelCase)
        const impactTagIds = impact.tag_ids || impact.tagIds;
        if (impactTagIds) {
          if (typeof impactTagIds === 'string') {
            try {
              tagIds = JSON.parse(impactTagIds);
            } catch (e) {
              console.error('Error parsing impact tagIds:', e);
              tagIds = [];
            }
          } else if (Array.isArray(impactTagIds)) {
            tagIds = impactTagIds;
          }
        }
        
        // If no tagIds but has tagsId, add it to the array
        if (tagIds.length === 0 && (impact.tags_id || impact.tagsId)) {
          tagIds = [impact.tags_id || impact.tagsId];
        }
        
        return {
          ...impact,
          tagIds: tagIds,
        };
      });
      
      // Filter impacts that share at least one tag with the section
      const filteredImpacts = processedImpacts.filter((impact: any) => {
        return section.tag_ids.some(tagId => impact.tagIds.includes(tagId));
      });
      
      return filteredImpacts as Impact[];
    },
    enabled: !!section
  });

  // Fetch related articles based on shared tags - last 6 articles
  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['related-articles', section?.tag_ids],
    queryFn: async () => {
      if (!section || !section.tag_ids || section.tag_ids.length === 0) return [];
      
      const articles = await getArticles({ status: 'published', limit: 20 });
      
      // Get tag names from section
      const sectionTagNames = section.tag_ids
        .map(tagId => tags.find(tag => tag.id === tagId)?.name)
        .filter(Boolean);
      
      if (sectionTagNames.length === 0) return [];
      
      // Filter articles that have at least one matching tag
      const filteredArticles = articles.filter((article: any) => {
        const articleTags = article.tags || [];
        return sectionTagNames.some(tagName => 
          articleTags.includes(tagName)
        );
      });
      
      // Return only the last 6 articles
      return filteredArticles.slice(0, 6) as Article[];
    },
    enabled: !!section && !!tags.length
  });

  const getTagsBadges = (tagIds: string[]) => {
    if (!tagIds || tagIds.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {tagIds.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? (
            <Badge 
              key={tagId} 
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </Badge>
          ) : null;
        })}
      </div>
    );
  };

  const getSharedTags = (itemTagIds: string[]) => {
    if (!section || !section.tag_ids) return [];
    return section.tag_ids.filter(tagId => itemTagIds.includes(tagId));
  };

  if (sectionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Section non trouvée</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Get tag names for filtering heroes
  const sectionTagNames = (section?.tag_ids && Array.isArray(section.tag_ids))
    ? section.tag_ids
        .map(tagId => tags.find(tag => tag.id === tagId)?.name)
        .filter(Boolean) as string[]
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel - Show heroes with matching tags */}
        {sectionTagNames.length > 0 && (
          <TaggedHeroCarousel 
            filterTags={sectionTagNames}
            showButtons={false}
            heightClass="h-96 md:h-[500px]"
          />
        )}

      {/* Section Content */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <ImageIcon className="h-8 w-8 text-green-600" />
              {section.title}
            </h2>
          </div>
          
          {/* Conditional rendering based on sort_order */}
          {section.sort_order === 1 ? (
            <OrphelinatSection photos={sectionPhotos} />
          ) : section.sort_order === 2 ? (
            <EducationSection photos={sectionPhotos} />
          ) : section.sort_order === 4 ? (
            <SanteSection photos={sectionPhotos} />
          ) : section.sort_order === 5 ? (
            <ReligionSection photos={sectionPhotos} />
          ) : section.sort_order === 6 ? (
            <InfoproSection photos={sectionPhotos} />
          ) : section.sort_order === 7 ? (
            <UniversitesSection photos={sectionPhotos} />
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: section.description || '' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

       

        {/* Related Impacts */}
        {relatedImpacts.length > 0 && (
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                  <Target className="h-8 w-8 text-green-600" />
                  Impacts associés
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedImpacts.map((impact) => (
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
          </div>
        )}

        {/* Partners Carousel */}
        <PartnersCarousel 
          filterTags={sectionTagNames}
          maxPartners={8}
        />

        {/* Related Articles - Derniers Actualités */}
        {relatedArticles.length > 0 && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                  <Newspaper className="h-8 w-8 text-green-600" />
                  Derniers Actualités
                </h2>
                <p className="text-lg text-gray-600">
                  Les dernières nouvelles et actualités liées à cette section
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {article.images && article.images.length > 0 ? (
                        <img 
                          src={article.images[0]} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Newspaper className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                        {article.author && (
                          <>
                            <span>•</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      )}
                      <Button asChild variant="outline" className="w-full">
                        <a href={`/actualites/${article.id}`}>Lire l'article</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SectionDetail; 