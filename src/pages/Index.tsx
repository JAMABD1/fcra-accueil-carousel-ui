import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import Coordonnees from "@/components/ContactForm";
import Counter from "@/components/Counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch impact data
  const { data: impacts = [] } = useQuery({
    queryKey: ['impacts-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch sections data
  const { data: sections = [] } = useQuery({
    queryKey: ['sections-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch all tags for mapping tag_ids to tag names
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Filter impacts to only those with tag 'home'
  const homeTag = tags.find(t => t.name === 'home');
  const impactsHome = homeTag
    ? impacts.filter(impact => {
        let tagIds: string[] = [];
        const impactAny = impact as any;
        if (Array.isArray(impactAny.tag_ids)) {
          tagIds = impactAny.tag_ids;
        } else if (impactAny.tags_id) {
          tagIds = [impactAny.tags_id];
        }
        return tagIds.includes(homeTag.id);
      })
    : [];

  // Filter sections to only those with tag 'home'
  const sectionsHome = homeTag
    ? sections.filter(section => {
        let tagIds: string[] = [];
        const sectionAny = section as any;
        if (Array.isArray(sectionAny.tag_ids)) {
          tagIds = sectionAny.tag_ids;
        } else if (sectionAny.tags_id) {
          tagIds = [sectionAny.tags_id];
        }
        return tagIds.includes(homeTag.id);
      })
    : [];

  // Fetch articles from database
  const { data: articles = [] } = useQuery({
    queryKey: ['articles-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Transform articles for display
  const transformedArticles = articles.map(article => ({
    id: article.id,
    title: article.title,
    date: new Date(article.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    author: article.author || 'Admin FCRA',
    image: article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg',
    excerpt: article.excerpt || article.content.substring(0, 200) + '...',
    tags: article.tags || [],
    content: article.content,
    featured: article.featured || false
  }));

  // Get 3 most recent articles
  const latestArticles = transformedArticles.slice(0, 3);

  // Get 3 articles tagged 'home' (by tag name)
  const homeArticles = transformedArticles.filter(article => article.tags.includes('home')).slice(0, 3);

  // Merge, ensuring no duplicates (by id)
  const articleIds = new Set();
  const combinedArticles = [...latestArticles, ...homeArticles].filter(article => {
    if (articleIds.has(article.id)) return false;
    articleIds.add(article.id);
    return true;
  });

  return (
    <Layout>
      {/* Hero Carousel */}
      <TaggedHeroCarousel filterTags={["home"]} />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de FCRA
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              FCRA est une organisation à but non lucratif qui se consacre à aider les
              communautés locales à travers des initiatives éducatives et sociales. Notre
              mission est de créer un impact durable en offrant des ressources et un
              soutien à ceux qui en ont besoin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Mission</h3>
                <p className="text-gray-600">
                  Notre mission est d'offrir des opportunités d'éducation et de
                  développement aux jeunes et adultes dans des situations
                  vulnérables. Nous croyons en un avenir où chaque individu
                  a accès à des ressources pour atteindre son potentiel.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
                <p className="text-gray-600">
                  FCRA envisage un monde où l'éducation est accessible à
                  tous, où les jeunes trouvent des opportunités égales pour réussir
                  et où la communauté s'entraide pour construire un avenir
                  meilleur.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              onClick={() => {
                const section = document.getElementById('sections');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Découvrez nos projets
            </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {impactsHome.map((impact) => (
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

      {/* Sections */}
      <section id="sections" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center md:text-left w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Sections
              </h2>
            </div>
            <div className="hidden md:block ml-4">
              <Button 
                variant="link" 
                className="text-green-600 hover:text-green-700"
                onClick={() => navigate('/sections')}
              >
                Voir toutes les sections
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectionsHome.map((section) => (
              <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{
                  backgroundImage: `url(${section.image_url})`
                }}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                  {section.subtitle && (
                    <p className="text-sm text-gray-500 mb-2">{section.subtitle}</p>
                  )}
                
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/sections/${section.id}`)}
                  >
                    Voir Plus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center md:text-left w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Derniers Actualités
              </h2>
              <p className="text-lg text-gray-600 text-center md:text-center">
                Découvrez nos dernières publications et apprenez-en plus sur notre engagement.
              </p>
            </div>
            <div className="hidden md:block ml-4">
              <Button 
                variant="link" 
                className="text-green-600 hover:text-green-700"
                onClick={() => navigate('/actualites')}
              >
                Voir tous les actualités
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {combinedArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{
                  backgroundImage: `url(${article.image})`
                }}></div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{article.date} — {article.author}</p>
                  <p className="text-gray-600 text-sm">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <Coordonnees />
    </Layout>
  );
};

export default Index;
