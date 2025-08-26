import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface EcolesDetail3Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const EcolesDetail3 = ({ missionPhotos, historyPhotos }: EcolesDetail3Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Mission Professionnelle
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école professionnelle se consacre à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>La formation professionnelle de qualité</li>
              <li>L'insertion professionnelle des jeunes</li>
              <li>L'adaptation aux besoins du marché du travail</li>
              <li>Le développement des compétences métier</li>
            </ul>
            <p className="text-gray-600">
              Un centre de formation qui prépare les jeunes aux réalités du monde professionnel.
            </p>
          </div>

          {/* Mission Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={missionPhotos || []} 
              title="Mission Professionnelle de l'École"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Vision Professionnelle
            </h3>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">💼 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Notre école professionnelle accueille :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Jeunes en recherche d'orientation</li>
              <li>Adultes en reconversion professionnelle</li>
              <li>Professionnels en perfectionnement</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Des centaines de professionnels qualifiés formés chaque année.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🏢 Infrastructures professionnelles</h4>
            <p className="text-gray-600 mb-3">L'école dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Ateliers de formation pratique</li>
              <li>Salles de cours spécialisées</li>
              <li>Équipements professionnels modernes</li>
              <li>Centres de simulation métier</li>
              <li>Bibliothèque professionnelle et ressources</li>
              <li>Espaces de networking et d'échange</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Un environnement professionnel pour un apprentissage concret et efficace.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">Nos Valeurs Professionnelles</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Excellence professionnelle</li>
                  <li>Éthique et responsabilité</li>
                  <li>Adaptabilité et flexibilité</li>
                  <li>Collaboration et travail d'équipe</li>
                  <li>Innovation et créativité</li>
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
              Histoire de l'École Professionnelle
            </h3>
            <p className="text-gray-600 mb-4">
              Notre école professionnelle est née de la nécessité de former des professionnels compétents pour répondre aux besoins du marché du travail malgache.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Date de création</h4>
            <p className="text-gray-600 mb-4">
              Créée en 2018, l'école s'est spécialisée dans les formations professionnelles et continue d'évoluer avec les besoins du marché.
            </p>

          </div>

          {/* History Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={historyPhotos || []} 
              title="Histoire de l'École Professionnelle"
            />
          </div>
        </div>
      </section>

      {/* Activités Professionnelles Principales Section */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            💼 Activités Professionnelles Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👔</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Commerce</h4>
              <p className="text-gray-600 text-sm">Formation en commerce et vente</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Hôtellerie</h4>
              <p className="text-gray-600 text-sm">Restauration et service</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💄</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Beauté</h4>
              <p className="text-gray-600 text-sm">Coiffure et esthétique</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Mécanique</h4>
              <p className="text-gray-600 text-sm">Maintenance automobile</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default EcolesDetail3;
