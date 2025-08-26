import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface EcolesDetail1Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const EcolesDetail1 = ({ missionPhotos, historyPhotos }: EcolesDetail1Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Mission Éducative
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école a pour vocation de promouvoir :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>L'excellence académique</li>
              <li>Le développement personnel</li>
              <li>L'épanouissement des talents</li>
              <li>Les valeurs de respect et de solidarité</li>
            </ul>
            <p className="text-gray-600">
              C'est un lieu d'apprentissage, de découverte et de construction de l'avenir pour chaque élève.
            </p>
          </div>

          {/* Mission Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={missionPhotos || []} 
              title="Mission de l'École"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Vision Pédagogique
            </h3>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">👨‍🎓 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Notre école s'adresse à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Élèves de tous niveaux</li>
              <li>Familles soucieuses de l'éducation</li>
              <li>Communauté éducative locale</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Des centaines d'élèves ont été formés depuis sa création.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🏫 Infrastructures</h4>
            <p className="text-gray-600 mb-3">L'école dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Salles de classe modernes et équipées</li>
              <li>Laboratoires scientifiques et informatiques</li>
              <li>Bibliothèque et centre de ressources</li>
              <li>Espaces sportifs et culturels</li>
              <li>Cantine scolaire et services de transport</li>
              <li>Équipements numériques et technologiques</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Un environnement d'apprentissage optimal pour le succès de chaque élève.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">Nos Valeurs Éducatives</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Excellence académique</li>
                  <li>Respect et tolérance</li>
                  <li>Innovation pédagogique</li>
                  <li>Développement du potentiel</li>
                  <li>Ouverture sur le monde</li>
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
              Histoire de l'École
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école est un établissement d'excellence qui s'est construit au fil des années pour devenir une référence dans l'éducation à Madagascar.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Date de création</h4>
            <p className="text-gray-600 mb-4">
              Fondée en 2010, l'école a formé des générations d'élèves et continue d'innover dans ses méthodes pédagogiques.
            </p>

          </div>

          {/* History Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={historyPhotos || []} 
              title="Histoire de l'École"
            />
          </div>
        </div>
      </section>

      {/* Activités Principales Section */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📚 Activités Éducatives Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Enseignement</h4>
              <p className="text-gray-600 text-sm">Programmes académiques complets</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Activités scientifiques</h4>
              <p className="text-gray-600 text-sm">Expérimentation et découverte</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Arts et culture</h4>
              <p className="text-gray-600 text-sm">Expression créative et artistique</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Sports et loisirs</h4>
              <p className="text-gray-600 text-sm">Développement physique et social</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default EcolesDetail1;
