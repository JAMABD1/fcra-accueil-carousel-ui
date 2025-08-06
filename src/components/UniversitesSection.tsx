import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface UniversitesSectionProps {
  photos?: string[];
}

const UniversitesSection = ({ photos }: UniversitesSectionProps) => {
  return (
    <>
      {/* Higher Education Section */}
      <section className="mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enseignement supérieur – Un tremplin vers l'excellence académique
          </h2>
          <p className="text-xl text-gray-600">
            Au-delà de la formation technique, le FCRA s'engage à soutenir l'accès équitable 
            à l'enseignement supérieur, convaincu que chaque jeune mérite une chance de 
            poursuivre ses études, quelle que soit son origine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">🎓 Un programme de bourses pour élargir les horizons</h3>
              <p className="text-gray-600 mb-4">
                Grâce à son programme de bourses d'études, le FCRA a permis à plus d'une 
                quarantaine de jeunes de poursuivre des études supérieures, aussi bien à 
                Madagascar qu'à l'étranger, dans des domaines variés :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Sciences humaines</li>
                <li>Ingénierie</li>
                <li>Économie</li>
                <li>Technologies émergentes</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Ce programme constitue un véritable levier d'autonomisation pour des jeunes 
                talentueux issus de milieux défavorisés.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">🌍 Un partenariat universitaire à dimension internationale</h3>
              <p className="text-gray-600 mb-4">
                Dans le cadre de sa vision d'ouverture internationale, le FCRA a signé en 
                mars 2025 un partenariat stratégique avec Parul University (Inde). Cet accord 
                vise à faciliter l'accès prioritaire des étudiants du FCRA aux filières de 
                cette université de renom.
              </p>
              <p className="text-gray-600 mb-4">
                En juin 2025, sept jeunes Malgaches, issus de l'orphelinat Zaynabia du FCRA, 
                ont intégré Parul University dans des formations telles que :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Informatique</li>
                <li>Management</li>
                <li>Finance</li>
                <li>Comptabilité</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Un accompagnement personnalisé pour chaque candidat</h3>
              <p className="text-gray-600 mb-4">
                Pour garantir un parcours fluide vers l'enseignement supérieur, le FCRA a mis 
                en place un bureau de liaison dédié, qui assure :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>L'information sur les opportunités d'études</li>
                <li>L'orientation académique des candidats</li>
                <li>Un suivi personnalisé avant, pendant et après l'intégration à l'université</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Impact et résultats</h3>
              <p className="text-gray-600 mb-4">
                Depuis la création du programme de bourses, plus de 40 jeunes ont pu accéder 
                à l'enseignement supérieur, avec un taux de réussite exceptionnel de 95%.
              </p>
              <p className="text-gray-600">
                Ces étudiants deviennent des ambassadeurs du FCRA dans leurs domaines respectifs, 
                contribuant au développement de Madagascar et servant d'inspiration pour les 
                générations futures.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* International Partnership Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Parul University - Un partenariat d'excellence
            </h3>
            <p className="text-gray-600 mb-4">
              Le partenariat avec Parul University représente une étape majeure dans 
              l'internationalisation de l'éducation au FCRA. Cette collaboration ouvre 
              de nouvelles perspectives pour nos étudiants, leur permettant d'accéder à 
              des formations de qualité reconnue internationalement.
            </p>
            <p className="text-gray-600">
              Les sept premiers étudiants malgaches intégrés en juin 2025 témoignent 
              de la réussite de ce partenariat et de l'engagement du FCRA en faveur 
              de l'excellence académique.
            </p>
          </div>

          {/* Photo Carousel */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={photos || []} 
              title="Enseignement Supérieur FCRA"
            />
          </div>
          
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vision d'avenir
            </h3>
            <p className="text-gray-600">
              Le FCRA ambitionne d'étendre ses partenariats universitaires à d'autres 
              institutions de renom à travers le monde, tout en renforçant ses programmes 
              de bourses locales. L'objectif est de permettre à chaque jeune talentueux 
              d'accéder à l'enseignement supérieur, quel que soit son milieu d'origine, 
              et de contribuer ainsi au développement durable de Madagascar.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default UniversitesSection;
