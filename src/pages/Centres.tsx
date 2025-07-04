
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Centres = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Centres
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos différents centres d'activités et leurs services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop)" }}
              ></div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Centre Éducatif</h3>
                <p className="text-gray-600 mb-4">
                  Notre centre principal offre des programmes éducatifs complets pour tous les âges.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop)" }}
              ></div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Centre de Formation</h3>
                <p className="text-gray-600 mb-4">
                  Formation professionnelle et développement des compétences techniques.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Centres;
