
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Ecoles = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Écoles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos établissements scolaires et programmes éducatifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop)" }}
              ></div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">École Primaire</h3>
                <p className="text-gray-600 mb-4">
                  Éducation de base solide pour les enfants de 6 à 12 ans.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Plus d'informations
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop)" }}
              ></div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">École Secondaire</h3>
                <p className="text-gray-600 mb-4">
                  Préparation aux études supérieures et à la vie professionnelle.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Plus d'informations
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Nos Programmes Spécialisés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">💻</span>
                  </div>
                  <h4 className="font-semibold mb-2">Informatique</h4>
                  <p className="text-gray-600 text-sm">
                    Formation aux technologies modernes
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">🔬</span>
                  </div>
                  <h4 className="font-semibold mb-2">Sciences</h4>
                  <p className="text-gray-600 text-sm">
                    Laboratoires et recherche scientifique
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">🎨</span>
                  </div>
                  <h4 className="font-semibold mb-2">Arts & Culture</h4>
                  <p className="text-gray-600 text-sm">
                    Expression artistique et patrimoine culturel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ecoles;
