import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface EcolesDetail2Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const EcolesDetail2 = ({ missionPhotos, historyPhotos }: EcolesDetail2Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Mission Technique
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école technique se consacre à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>La formation technique de qualité</li>
              <li>L'innovation technologique</li>
              <li>L'adaptation aux besoins du marché</li>
              <li>Le développement des compétences pratiques</li>
            </ul>
            <p className="text-gray-600">
              Un centre d'excellence pour la formation des futurs techniciens et ingénieurs.
            </p>
          </div>

          {/* Mission Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={missionPhotos || []} 
              title="Mission Technique de l'École"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Vision Technique
            </h3>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🔧 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Notre école technique accueille :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Élèves passionnés par la technique</li>
              <li>Professionnels en reconversion</li>
              <li>Entreprises partenaires</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Des centaines de techniciens qualifiés formés chaque année.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🏭 Infrastructures techniques</h4>
            <p className="text-gray-600 mb-3">L'école dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Ateliers techniques spécialisés</li>
              <li>Laboratoires d'électronique et informatique</li>
              <li>Équipements industriels modernes</li>
              <li>Centres de simulation et de prototypage</li>
              <li>Bibliothèque technique et ressources numériques</li>
              <li>Espaces de collaboration et d'innovation</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Un environnement technique de pointe pour l'apprentissage pratique.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">Nos Valeurs Techniques</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Excellence technique</li>
                  <li>Innovation et créativité</li>
                  <li>Précision et rigueur</li>
                  <li>Collaboration et partage</li>
                  <li>Adaptation aux évolutions</li>
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
              Histoire de l'École Technique
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école technique est née de la vision de former des techniciens compétents pour répondre aux défis technologiques de Madagascar.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Date de création</h4>
            <p className="text-gray-600 mb-4">
              Créée en 2015, l'école s'est spécialisée dans les formations techniques et continue d'évoluer avec les technologies.
            </p>

          </div>

          {/* History Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={historyPhotos || []} 
              title="Histoire de l'École Technique"
            />
          </div>
        </div>
      </section>

      {/* Activités Techniques Principales Section */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🔧 Activités Techniques Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Électrotechnique</h4>
              <p className="text-gray-600 text-sm">Formation en électricité et électronique</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Informatique</h4>
              <p className="text-gray-600 text-sm">Développement et maintenance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Génie civil</h4>
              <p className="text-gray-600 text-sm">Construction et infrastructure</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Laboratoire</h4>
              <p className="text-gray-600 text-sm">Tests et analyses techniques</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default EcolesDetail2;
