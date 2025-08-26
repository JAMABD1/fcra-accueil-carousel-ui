import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface EcolesDetail4Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const EcolesDetail4 = ({ missionPhotos, historyPhotos }: EcolesDetail4Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Mission Universitaire
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école universitaire se consacre à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>L'excellence académique et la recherche</li>
              <li>La formation des futurs leaders</li>
              <li>L'innovation et la créativité intellectuelle</li>
              <li>Le développement de la pensée critique</li>
            </ul>
            <p className="text-gray-600">
              Un centre d'enseignement supérieur qui forme les élites de demain.
            </p>
          </div>

          {/* Mission Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={missionPhotos || []} 
              title="Mission Universitaire de l'École"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Vision Universitaire
            </h3>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🎓 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Notre école universitaire accueille :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Étudiants brillants et motivés</li>
              <li>Professionnels en formation continue</li>
              <li>Chercheurs et enseignants</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Des milliers d'étudiants diplômés depuis sa création.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🏛️ Infrastructures universitaires</h4>
            <p className="text-gray-600 mb-3">L'école dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Amphithéâtres et salles de cours modernes</li>
              <li>Laboratoires de recherche avancés</li>
              <li>Centres de documentation et bibliothèques</li>
              <li>Espaces de coworking et d'innovation</li>
              <li>Ressources numériques et bases de données</li>
              <li>Infrastructures sportives et culturelles</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Un environnement universitaire de premier plan pour l'excellence académique.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">Nos Valeurs Universitaires</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Excellence académique</li>
                  <li>Liberté de pensée</li>
                  <li>Innovation et créativité</li>
                  <li>Ouverture internationale</li>
                  <li>Responsabilité sociale</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* History Text */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Histoire de l'École Universitaire
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école universitaire est née de la vision de créer un centre d'excellence académique qui rivalise avec les meilleures institutions internationales.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Date de création</h4>
            <p className="text-gray-600 mb-4">
              Créée en 2020, l'école s'est imposée comme une référence dans l'enseignement supérieur malgache.
            </p>

          </div>

          {/* History Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={historyPhotos || []} 
              title="Histoire de l'École Universitaire"
            />
          </div>
        </div>
      </section>

      {/* Activités Universitaires Principales Section */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🎓 Activités Universitaires Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Formation</h4>
              <p className="text-gray-600 text-sm">Programmes universitaires complets</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Recherche</h4>
              <p className="text-gray-600 text-sm">Projets de recherche innovants</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">International</h4>
              <p className="text-gray-600 text-sm">Partenariats internationaux</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Innovation</h4>
              <p className="text-gray-600 text-sm">Centres d'innovation et incubateurs</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default EcolesDetail4;
