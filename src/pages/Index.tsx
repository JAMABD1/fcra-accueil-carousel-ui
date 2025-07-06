import Layout from "@/components/Layout";
import HeroCarousel from "@/components/HeroCarousel";
import Counter from "@/components/Counter";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
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

  return (
    <Layout>
      {/* Hero Carousel */}
      <HeroCarousel />

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
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
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
            {impacts.map((impact) => (
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Sections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{
                  backgroundImage: `url(${section.image_url})`
                }}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                  {section.subtitle && (
                    <p className="text-sm text-gray-500 mb-2">{section.subtitle}</p>
                  )}
                  {section.description && (
                    <p className="text-gray-600 mb-4">{section.description}</p>
                  )}
                  <Button variant="outline" className="w-full">
                    Visitez Nous
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Derniers Actualités
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos dernières publications et apprenez-en plus sur notre engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Cérémonie de Remise des Diplômes</h3>
                <p className="text-gray-600 text-sm">
                  Une nouvelle promotion d'étudiants diplômés rejoint notre communauté d'anciens.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=200&fit=crop)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Nouveau Programme d'Éducation</h3>
                <p className="text-gray-600 text-sm">
                  Lancement d'un nouveau programme éducatif pour soutenir les communautés locales.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
              Découvrez Toutes les articles
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />
    </Layout>
  );
};

export default Index;
