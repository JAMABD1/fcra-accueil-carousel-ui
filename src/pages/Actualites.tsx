
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Actualites = () => {
  const news = [
    {
      id: 1,
      title: "Cérémonie de Remise des Diplômes 2024",
      date: "15 Décembre 2024",
      image: "/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png",
      excerpt: "Une cérémonie exceptionnelle pour célébrer la réussite de nos étudiants diplômés.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 2,
      title: "Nouveau Programme d'Aide aux Orphelins",
      date: "10 Décembre 2024",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      excerpt: "Lancement d'un programme innovant pour soutenir les enfants orphelins.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 3,
      title: "Formation Professionnelle RVS",
      date: "5 Décembre 2024",
      image: "https://images.unsplash.com/photo-1581091870632-5a5ad36db9c6?w=600&h=400&fit=crop",
      excerpt: "Nouveaux ateliers de formation pour développer les compétences professionnelles.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    }
  ];

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Actualités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos dernières nouvelles, événements et réalisations
            </p>
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div 
                    className="h-64 md:h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${news[0].image})` }}
                  ></div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="text-sm text-green-600 font-semibold mb-2">
                    {news[0].date}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {news[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {news[0].excerpt}
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Lire la suite
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(1).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.image})` }}
                ></div>
                <CardContent className="p-6">
                  <div className="text-sm text-green-600 font-semibold mb-2">
                    {article.date}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <Button variant="outline" size="sm">
                    Lire plus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              Charger plus d'articles
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Actualites;
