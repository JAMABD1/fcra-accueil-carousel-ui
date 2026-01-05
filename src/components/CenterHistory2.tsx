import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface CenterDetail2Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const CenterDetail2 = ({ missionPhotos, historyPhotos }: CenterDetail2Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎯 Mission
            </h3>
            <p className="text-gray-600 mb-3">
              Le centre s'inscrit pleinement dans les objectifs du FCRA :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
              <li>Promouvoir l'éducation intégrale</li>
              <li>Favoriser le développement humain durable</li>
              <li>Soutenir une jeunesse tournée vers l'avenir, responsable, éduquée et engagée</li>
            </ul>
            <p className="text-gray-600">
              Le centre s'engage à fournir des services sociaux, éducatifs et sanitaires 
              de qualité aux communautés locales, en particulier aux plus vulnérables.
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
      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🏗️ Un complexe éducatif d'envergure
            </h3>
            <p className="text-gray-600 mb-3">
              Doté d'infrastructures modernes, le centre d'Andakana symbolise l'ambition du FCRA : 
              offrir à la jeunesse malgache un accès équitable à une éducation de qualité, 
              dans un cadre propice à l'épanouissement personnel et collectif.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">👨‍🎓 Publics ciblés</h4>
            <p className="text-gray-600 mb-3">
              Principalement orienté vers les enfants et jeunes, le centre s'adresse aussi à :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Des familles vulnérables</li>
              <li>Des étudiants issus de zones rurales</li>
              <li>Des stagiaires en reconversion ou insertion professionnelle</li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🛠️ Infrastructures majeures</h4>
            <p className="text-gray-600 mb-3">Le complexe comprend :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Établissements scolaires complets</li>
              <li>Internats et logements, transports scolaires, cantines scolaires</li>
              <li>Bibliothèques, laboratoires, équipements numériques</li>
              <li>Espaces sportifs et culturels</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Ces équipements permettent d'accueillir un nombre important de jeunes venus de milieux défavorisés, parfois très éloignés.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">🚀 Un symbole d'espoir</h4>
                <p className="text-gray-600 mb-3">
                  Le Centre d'Andakana est bien plus qu'un lieu de formation : il représente un espace d'avenir pour de nombreux jeunes en quête d'un meilleur futur.
                </p>
                <h4 className="text-lg font-semibold mb-4">📍 Localisation</h4>
                <p className="text-gray-600">
                  Le Centre FCRA Andakana est situé dans la commune rurale d'Andakana. Il représente aujourd'hui le plus grand complexe du réseau FCRA à Madagascar.
                </p>
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
              Centre FCRA Andakana – Complexe éducatif principal
            </h3>
            <p className="text-gray-600 mb-3">
              Le Centre FCRA Andakana est situé dans la commune rurale d'Andakana. Il représente aujourd'hui le plus grand complexe du réseau FCRA à Madagascar.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🏗️ Un complexe éducatif d'envergure</h4>
            <p className="text-gray-600 mb-3">
              Doté d'infrastructures modernes, le centre d'Andakana symbolise l'ambition du FCRA : 
              offrir à la jeunesse malgache un accès équitable à une éducation de qualité, 
              dans un cadre propice à l'épanouissement personnel et collectif.
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
                <span className="text-2xl">🙏</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Formation religieuse</h4>
              <p className="text-gray-600 text-sm">Education spirituelle et morale</p>
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

export default CenterDetail2; 