import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";

interface UniversitesSectionProps {
  photos?: string[];
}

const UniversitesSection = ({ photos }: UniversitesSectionProps) => {
  const displayPhotos = photos && photos.length > 0 ? photos : ["/placeholder.svg"];
  const previewPhotos = displayPhotos.slice(0, 4);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      {/* Title */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Enseignement supérieur – Un tremplin vers l'excellence académique
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Soutenir l'accès équitable à l'enseignement supérieur pour offrir à chaque jeune une chance de réussir.
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
                Ce programme constitue un véritable levier de renforcement de l'autonomie pour des jeunes 
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
                En juin 2025, sept jeunes malgaches, issus de l'orphelinat Zaynabia du FCRA, 
                ont rejoint Parul University pour y suivre des formations telles que :
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

      {/* International Partnership + main imagery */}
      <section className="mb-10">
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

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="Enseignement Supérieur FCRA" />
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                onClick={() => openLightbox(0)}
              >
                Voir la galerie
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Thumbnail gallery */}
      <section className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {previewPhotos.map((src, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <img
                src={src}
                alt={`Galerie ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
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

      {/* Lightbox */}
      <Lightbox
        images={displayPhotos}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={currentImageIndex}
        title="Enseignement Supérieur FCRA"
      />
    </>
  );
};

export default UniversitesSection;
