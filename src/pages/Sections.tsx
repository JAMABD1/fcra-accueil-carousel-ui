import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface Section {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  hero_id: string | null;
  hero_ids: string[];
  tag_name: string | null;
  tag_ids: string[];
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
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      // Process sections to handle JSON fields
      return data.map((section: any) => {
        let heroIds = [];
        let tagIds = [];
        
        if (section.hero_ids) {
          if (typeof section.hero_ids === 'string') {
            try {
              heroIds = JSON.parse(section.hero_ids);
            } catch (e) {
              console.error('Error parsing hero_ids:', e);
              heroIds = [];
            }
          } else if (Array.isArray(section.hero_ids)) {
            heroIds = section.hero_ids;
          }
        }
        
        if (section.tag_ids) {
          if (typeof section.tag_ids === 'string') {
            try {
              tagIds = JSON.parse(section.tag_ids);
            } catch (e) {
              console.error('Error parsing tag_ids:', e);
              tagIds = [];
            }
          } else if (Array.isArray(section.tag_ids)) {
            tagIds = section.tag_ids;
          }
        }
        
        return {
          ...section,
          hero_ids: heroIds,
          tag_ids: tagIds,
        };
      }) as Section[];
    }
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
    const sectionTagNames = section.tag_ids
      .map(tagId => tags.find(tag => tag.id === tagId)?.name)
      .filter(Boolean) as string[];
    
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
      {/* Hero Carousel - Show heroes with any section-related tags */}
      {allTagNames.length > 0 && (
        <TaggedHeroCarousel 
          filterTags={allTagNames}
          showButtons={true}
          heightClass="h-96 md:h-[500px]"
        />
      )}

      {/* Sections List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Layers className="h-8 w-8 text-green-600" />
              Nos Sections
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez tous nos domaines d'activité et programmes dédiés à l'éducation et au développement social.
            </p>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune section disponible</h3>
              <p className="text-gray-500">Les sections seront affichées ici une fois configurées.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => (
                <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={section.image_url || '/placeholder.svg'} 
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
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
                    
                    {/* Tags */}
                    <div className="mb-4">
                      {getTagsBadges(section.tag_ids, section.tag_name)}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/sections/${section.id}`)}
                    >
                      Découvrir cette section
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Sections; 