import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import Coordonnees from "@/components/ContactForm";
import Counter from "@/components/Counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// YouTube Video Component
const YouTubeVideo = ({ videoId }: { videoId: string }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

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

  // Filter sections to only those with tag 'featured'
  const featuredTag = tags.find(t => t.name === 'featured');
  const sectionsFeatured = featuredTag
    ? sections.filter(section => {
        let tagIds: string[] = [];
        const sectionAny = section as any;
        if (Array.isArray(sectionAny.tag_ids)) {
          tagIds = sectionAny.tag_ids;
        } else if (sectionAny.tags_id) {
          tagIds = [sectionAny.tags_id];
        }
        return tagIds.includes(featuredTag.id);
      })
    : [];

  // Fetch articles from database
  const { data: articles = [] } = useQuery({
    queryKey: ['articles-public'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err: any) {
        // Fallback when published_at column doesn't exist yet
        if (err?.code === 'PGRST204' || String(err?.message || '').includes('published_at')) {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data;
        }
        throw err;
      }
    }
  });

  // Transform articles for display
  const transformedArticles = articles.map(article => {
    const publishedAt = (article as any).published_at ?? article.created_at;
    return {
      id: article.id,
      title: article.title,
      date: new Date(publishedAt).toLocaleDateString('fr-FR', {
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
    };
  });

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
      <TaggedHeroCarousel 
        filterTags={["home"]}
        onLearnMore={() => {
          const about = document.getElementById('apropos');
          if (about) {
            const rect = about.getBoundingClientRect();
            const offset = 100; // scroll to a bit below the top
            window.scrollTo({ top: window.scrollY + rect.top - offset, behavior: 'smooth' });
          }
        }}
        onJoinUs={() => navigate('/administrations')}
      />

      {/* About Section */}
      <section id="apropos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de FCRA
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fifanampiana Centre Rassoul Akram (FCRA) est un centre à but 
            non lucratif dédié à l’entraide, à l’éducation, au développement 
            humain et à la promotion des valeurs de solidarité. Fondé avec la
             conviction que chaque individu mérite une chance équitable de s’épanouir, notre centre œuvre pour un avenir meilleur à travers des actions concrètes 
            dans les domaines éducatif, social, spirituel et communautaire.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous accueillons les enfants, les jeunes et les familles dans un environnement bienveillant, où l’écoute, le respect et
             la transmission des savoirs sont au cœur de notre engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Missions</h3>
                <p className="text-gray-600">
                 <ul className="list-disc list-inside">
                  <li>Offrir un accompagnement éducatif et spirituel aux enfants et aux jeunes</li>
                  <li>Soutenir les familles en situation de vulnérabilité à travers des actions de solidarité</li>
                  <li>Promouvoir les valeurs de paix, de respect et d’entraide entre les membres de la communauté</li>
                  <li>Créer un espace d’échange, de dialogue, d’ouverture et de cohésion sociale</li>
      
                 </ul>
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
                <p className="text-gray-600">
                Bâtir une société solidaire, éclairée et harmonieuse, où chaque individu 
                trouve sa place et peut contribuer au bien commun. Nous rêvons d’un monde où les valeurs humaines et spirituelles guident l’action sociale, où l’éducation est un levier d’émancipation, 
                et où la fraternité dépasse les différences.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Valeurs</h3>
                <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li ><span className="font-bold">Solidarité :</span> L’union et le soutien mutuel sont au cœur de toutes nos actions.</li>
                  <li > <span className="font-bold">Respect :</span> Nous valorisons la dignité de chaque personne, sans distinction.</li>
                  <li > <span className="font-bold">Foi et spiritualité :</span> Nous nous inspirons des principes moraux pour orienter nos engagements.</li>
                  
                  <li > <span className="font-bold">Engagement :</span> Nous travaillons avec sincérité, persévérance et responsabilité.</li>
                  <li > <span className="font-bold">Éducation :</span> L’accès à la connaissance est la clé du changement et de la liberté.</li>
                  
                </ul>
                </p>
              </CardContent>
            </Card>

          </div>

          <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Notre Histoire
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
       <div className="col-span-1">
      
     <p className="text-gray-600">
     Fondé en 2009, le Fifanampiana Centre Rassoul Akram (FCRA) est né d’une volonté profonde de répondre aux besoins urgents de la communauté en matière d’éducation, d’entraide 
     sociale, et de développement humain.
     </p>
     <p className="text-gray-600">
     Depuis sa création, le FCRA s’engage à transmettre les valeurs universelles de sagesse, de solidarité et de paix, 
     en s’appuyant sur quatre piliers fondamentaux :
     </p>
     <ul className="list-disc list-inside m-3">
       <li>Le soutien aux orphelins et aux familles vulnérables, à travers des actions concrètes d’aide humanitaire et sociale ;</li>
     <li>La formation des jeunes, pour les préparer à devenir des citoyens responsables, instruits et engagés ;</li>
     <li>Le dialogue interreligieux, dans un esprit d’ouverture, de respect et de cohésion sociale ;</li>
     <li>Les projets communautaires durables, visant à renforcer l’autonomie et la résilience des populations locales.</li>
     </ul>
     <p className="text-gray-600">
     Les projets communautaires durables, visant à renforcer l’autonomie et la résilience des populations locales.
     </p>
      </div>

            <div className="col-span-1">
            <YouTubeVideo videoId="bklq4ZVkfIk" />
            </div>
            </div>


            <Button 
              className="bg-green-600 hover:bg-green-700 px-8 py-3 mt-4 "
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
            {sectionsFeatured.map((section) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {combinedArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{
                  backgroundImage: `url(${article.image})`
                }}></div>
                <CardContent className="p-6">
                  <h3
                    className="text-lg font-semibold mb-2 cursor-pointer text-green-700 hover:underline"
                    onClick={() =>
                      navigate(`/actualites/${article.id}`, {
                        state: { focus: 'images' }
                      })
                    }
                  >
                    {article.title}
                  </h3>
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
