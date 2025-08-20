import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface CenterDetail4Props {
  missionPhotos?: string[];
  historyPhotos?: string[];
}

const CenterDetail4 = ({ missionPhotos, historyPhotos }: CenterDetail4Props) => {
  return (
    <>
      {/* Mission Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Mission
            </h3>
            <p className="text-gray-600 mb-4">
              Le centre s'inscrit pleinement dans les objectifs du FCRA :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
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
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🏗️ Un centre éducatif en pleine expansion
            </h3>
            <p className="text-gray-600 mb-4">
              Créé il y a bientôt trois ans, le centre FCRA de Sakoana incarne la volonté du FCRA 
              d'élargir son action éducative dans des zones stratégiques, souvent négligées, 
              en accompagnant les jeunes vers un avenir meilleur.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📍 FCRA Sakoana – École La Sagesse</h4>
            <p className="text-gray-600 mb-3">
              À Sakoana, le centre FCRA a mis en place l'École La Sagesse, qui œuvre activement pour :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Une scolarisation accessible en zone rurale</li>
              <li>La formation académique et citoyenne des élèves</li>
              <li>L'implication communautaire, en collaboration avec les familles et autorités locales</li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">🛠️ Infrastructures présentes</h4>
            <p className="text-gray-600 mb-3">Le centre dispose de :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>École complète</li>
              <li>Orphelinat</li>
              <li>Cantine scolaire</li>
              <li>Internat pour héberger les élèves éloignés</li>
            </ul>
            <p className="text-gray-600 mt-3">
              L'école joue un rôle clé dans la réduction des inégalités d'accès à l'éducation, 
              en particulier pour les enfants vivant en zones reculées.
            </p>
          </div>

          <div className="col-span-1">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-lg font-semibold mb-4">🎯 Un même objectif : l'avenir de la jeunesse</h4>
                <p className="text-gray-600 mb-4">
                  Bien que jeune, le centre de Sakoana partage une vision commune :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Donner à chaque enfant les moyens de réussir</li>
                  <li>Renforcer l'égalité des chances</li>
                  <li>Préparer une génération consciente et responsable</li>
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
              Centres FCRA Sakoana – École en pleine expansion
            </h3>
            <p className="text-gray-600 mb-4">
              Créé il y a bientôt trois ans, le centre FCRA de Sakoana incarne la volonté du FCRA 
              d'élargir son action éducative dans des zones stratégiques, souvent négligées, 
              en accompagnant les jeunes vers un avenir meilleur.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-900">📅 Trois années d'engagement éducatif</h4>
            <p className="text-gray-600 mb-4">
              Le centre s'engage activement pour une scolarisation accessible en zone rurale, 
              la formation académique et citoyenne des élèves, et l'implication communautaire 
              en collaboration avec les familles et autorités locales.
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
                <span className="text-2xl">🌾</span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Agriculture</h4>
              <p className="text-gray-600 text-sm">Production agricole et alimentaire</p>
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

export default CenterDetail4; 