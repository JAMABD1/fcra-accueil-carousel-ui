import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSections, getTags } from "@/lib/db/queries";
import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

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

interface Tag {
  id: string;
  name: string;
  color: string;
}

const Sections = () => {
  const navigate = useNavigate();

  // Fetch sections data
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections-public'],
    queryFn: async () => {
      return await getSections();
    }
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  const getTagsBadges = (tagIds: string[], tagName: string | null) => {
    const badges = [];
    
    // Show legacy tag_name if exists
    if (tagName) {
      badges.push(
        <Badge key="legacy" variant="outline" className="text-xs">
          {tagName}
        </Badge>
      );
    }
    
    // Show new tag system tags
    if (tagIds && tagIds.length > 0) {
      tagIds.slice(0, 3).forEach(tagId => {
        const tag = tags.find(t => t.id === tagId);
        if (tag) {
          badges.push(
            <Badge 
              key={tagId} 
              variant="outline"
              style={{ 
                borderColor: tag.color,
                color: tag.color
              }}
              className="text-xs"
            >
              {tag.name}
            </Badge>
          );
        }
      });
      
      if (tagIds.length > 3) {
        badges.push(
          <Badge key="more" variant="outline" className="text-xs">
            +{tagIds.length - 3}
          </Badge>
        );
      }
    }
    
    if (badges.length === 0) {
      return null;
    }
    
    return <div className="flex flex-wrap gap-1">{badges}</div>;
  };

  // Get all unique tag names for hero filtering
  const allTagNames = sections.reduce((acc: string[], section) => {
    const sectionTagNames: string[] = [];
    
    // Handle tag_ids array (may be undefined or null)
    if (section.tag_ids && Array.isArray(section.tag_ids)) {
      section.tag_ids
        .map(tagId => tags.find(tag => tag.id === tagId)?.name)
        .filter(Boolean)
        .forEach(name => {
          if (name && !sectionTagNames.includes(name)) {
            sectionTagNames.push(name);
          }
        });
    }
    
    if (section.tag_name) {
      sectionTagNames.push(section.tag_name);
    }
    
    sectionTagNames.forEach(tagName => {
      if (!acc.includes(tagName)) {
        acc.push(tagName);
      }
    });
    
    return acc;
  }, []);

  if (sectionsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        eyebrow="Programmes"
        title="Nos Sections"
        subtitle="Découvrez tous nos domaines d'activité et programmes dédiés à l'éducation et au développement social."
        icon={<Layers className="h-8 w-8 text-green-600 shrink-0" />}
      />

      {/* Sections List */}
      <section className="py-16 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <ScrollReveal key={section.id} delay={index * 0.06}>
                <Card className="group overflow-hidden border-gray-200/80 card-lift hover:shadow-xl hover:border-green-200/60 transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 bg-cover bg-center bg-gray-200 flex items-center justify-center" style={{
                    backgroundImage: section.image_url ? `url(${section.image_url})` : undefined
                  }}>
                    {!section.image_url && (
                      <Layers className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                    {section.subtitle && (
                      <p className="text-sm text-gray-500 mb-3">{section.subtitle}</p>
                    )}
                    {section.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        <div dangerouslySetInnerHTML={{
                          __html: section.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }} />
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-auto"
                      onClick={() => navigate(`/sections/${section.slug}`)}
                    >
                      Découvrir cette section
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sections; 