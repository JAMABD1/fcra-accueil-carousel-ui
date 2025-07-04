
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Activites = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Activités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos diverses activités et programmes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 text-xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Programmes Éducatifs</h3>
                <p className="text-gray-600">
                  Cours et formations pour tous les niveaux d'éducation
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 text-xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Actions Sociales</h3>
                <p className="text-gray-600">
                  Aide et soutien aux communautés locales
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Projets Spéciaux</h3>
                <p className="text-gray-600">
                  Initiatives innovantes pour le développement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activites;
