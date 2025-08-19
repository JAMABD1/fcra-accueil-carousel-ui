import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface CenterDetail1Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const CenterDetail1 = ({ missionPhotos, historyPhotos }: CenterDetail1Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Mission
            </h3>
            <p className="text-gray-600 mb-4">
              Le centre a pour vocation de promouvoir :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>L'entraide</li>
              <li>L'éducation</li>
              <li>Le développement humain</li>
              <li>Les valeurs de solidarité</li>
            </ul>
            <p className="text-gray-600">
              C'est un lieu d'accueil, de formation, d'accompagnement social et d'espoir pour des milliers de bénéficiaires.
            </p>
          </div>

          {/* Mission Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={missionPhotos || []} 
              title="Mission du Centre"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Notre Vision
            </h3>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">👨‍👩‍👧‍👦 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Le FCRA Antohomadinika s'adresse à un large public :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Enfants</li>
              <li>Jeunes</li>
              <li>Familles en situation de vulnérabilité</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Des milliers de bénéficiaires ont été accompagnés depuis sa création.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🛠️ Infrastructures</h4>
            <p className="text-gray-600 mb-3">Le centre dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Établissements scolaires complets</li>
              <li>Transports scolaires, cantines scolaires</li>
              <li>Centre de formation professionnelle (INFOPRO)</li>
              <li>Internats et logements</li>
              <li>Bibliothèques, laboratoires, équipements numériques</li>
              <li>Espaces sportifs et culturels</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Un véritable écosystème d'apprentissage, de protection et de développement personnel.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">Nos Valeurs</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Compassion et empathie</li>
                  <li>Intégrité et transparence</li>
                  <li>Excellence dans nos services</li>
                  <li>Respect de la dignité humaine</li>
                  <li>Innovation et adaptation</li>
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
              Histoire du Centre
            </h3>
            <p className="text-gray-600 mb-4">
              Le Centre FCRA Antaniavo est situé à Antohomadinika, et constitue le siège social de l'ensemble des structures FCRA. Il joue un rôle central dans la coordination des actions sociales, éducatives et humanitaires menées à travers le pays.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Date de création</h4>
            <p className="text-gray-600 mb-4">
              Créé en 2012, le centre est actif depuis plus d'une décennie dans le soutien aux populations vulnérables.
            </p>

          </div>

          {/* History Photos */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={historyPhotos || []} 
              title="Histoire du Centre"
            />
          </div>
        </div>
      </section>

      {/* Activités Principales Section */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📚 Activités Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Éducation</h4>
              <p className="text-gray-600 text-sm">De la petite enfance au lycée</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Formation professionnelle</h4>
              <p className="text-gray-600 text-sm">Développement des compétences techniques</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Enseignement universitaire</h4>
              <p className="text-gray-600 text-sm">Formation supérieure spécialisée</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Actions sociales</h4>
              <p className="text-gray-600 text-sm">Actions humanitaires sous diverses formes</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default CenterDetail1; 