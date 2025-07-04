
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Administrations = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Administrations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre structure administrative et nos équipes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Direction Générale</h3>
                <p className="text-gray-600">
                  Supervision générale et orientation stratégique de l'organisation
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestion Financière</h3>
                <p className="text-gray-600">
                  Gestion des ressources financières et comptabilité
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Coordination Pédagogique</h3>
                <p className="text-gray-600">
                  Supervision des programmes éducatifs et formation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Administrations;
