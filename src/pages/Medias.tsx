
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Medias = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Médias
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Galerie photos, vidéos et ressources multimédias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + item * 1000000}?w=400&h=300&fit=crop)` 
                  }}
                ></div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Événement {item}</h3>
                  <p className="text-gray-600 text-sm">
                    Description de l'événement ou de l'activité
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Medias;
