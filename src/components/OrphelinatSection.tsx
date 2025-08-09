import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import Counter from "./Counter";
import { Lightbox } from "./Lightbox";

interface OrphelinatSectionProps {
  photos?: string[];
}

const OrphelinatSection = ({ photos }: OrphelinatSectionProps) => {
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
            Notre engagement envers les orphelins
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Un accueil sûr, stable et bienveillant pour offrir à chaque enfant un avenir digne.
          </p>
        </div>

        

        {/* Intro cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Au cœur des actions du FCRA</h3>
              <p className="text-gray-600 mb-4">
                L'accueil et la prise en charge des orphelins occupent une place essentielle.
                À Madagascar, nous gérons quatre centres d'orphelinat situés à Antaniavo,
                Andakana, Manakara et Sakoana.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Plus de 230 enfants pris en charge</h3>
              <p className="text-gray-600 mb-4">
                Un accompagnement global: hébergement, alimentation, soins, éducation et encadrement
                affectif, pour permettre à chaque enfant de s'épanouir et d'apprendre.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre objectif fondamental</h3>
              <p className="text-gray-600 mb-4">
                Redonner à chaque enfant la sécurité, la dignité et l'amour dont il a besoin pour
                grandir sereinement.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                🕊 Des valeurs pour guider leur vie
              </h4>
              <p className="text-gray-600">
                Respect, compassion, tolérance et foi: des repères partagés au quotidien, pour
                grandir avec responsabilité et ouverture d'esprit.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services + main imagery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Un engagement total pour le bien-être des enfants
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🍽️ Une alimentation saine et équilibrée</h4>
                <p className="text-gray-600">
                  Des repas sains, variés et préparés dans le respect strict des normes d'hygiène,
                  adaptés à l'âge et aux besoins de chaque enfant.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🎓 Une éducation complète et gratuite</h4>
                <p className="text-gray-600 mb-3">
                  Tous les frais scolaires sont pris en charge par le centre:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Écolages</li>
                  <li>Fournitures scolaires</li>
                  <li>Uniformes, vêtements et chaussures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="Orphelinat FCRA" />
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
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
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

      {/* Lightbox */}
      <Lightbox
        images={displayPhotos}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={currentImageIndex}
        title="Orphelinat FCRA"
      />
    </>
  );
};

export default OrphelinatSection; 