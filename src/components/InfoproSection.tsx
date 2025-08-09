import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";

interface InfoproSectionProps {
  photos?: string[];
}

const InfoproSection = ({ photos }: InfoproSectionProps) => {
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
            INFOPRO – Institut de Formation Professionnelle
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Préparer les jeunes à un avenir professionnel durable avec des formations pratiques et accessibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Une mission d'insertion professionnelle</h3>
              <p className="text-gray-600 mb-4">
                Dans le prolongement de ses actions éducatives, le FCRA a mis en place l'Institut 
                de Formation Professionnelle (INFOPRO) afin de répondre aux besoins concrets des 
                jeunes en quête d'autonomie et d'insertion professionnelle.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Des formations courtes, pratiques et accessibles</h3>
              <p className="text-gray-600 mb-4">
                L'INFOPRO propose des modules intensifs de trois mois, orientés vers la pratique 
                et directement liés aux réalités du marché de l'emploi. Les domaines couverts sont variés :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Électricité bâtiment</li>
                <li>Informatique</li>
                <li>Langues (français et anglais)</li>
                <li>Plomberie</li>
                <li>Mécanique automobile</li>
                <li>Coupe et couture</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Accessibilité et inclusion</h3>
              <p className="text-gray-600 mb-4">
                Ces formations sont ouvertes à tous les jeunes, sans distinction de parcours scolaire, 
                dès le niveau BEPC, avec pour objectif une insertion rapide et durable dans le monde du travail.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Un environnement propice à l'apprentissage</h3>
              <p className="text-gray-600 mb-4">
                INFOPRO met à la disposition des apprenants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Un accès gratuit à Internet</li>
                <li>Une bibliothèque équipée</li>
                <li>Un encadrement pédagogique bienveillant et rigoureux</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Ces outils permettent aux jeunes de renforcer leurs compétences, d'approfondir 
                leurs connaissances et de développer une véritable autonomie dans leur apprentissage.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values + main imagery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Une chance pour tous
            </h3>
            <p className="text-gray-600 mb-4">
              Fidèle aux valeurs du FCRA, INFOPRO s'engage à offrir une formation professionnelle 
              inclusive, accessible et porteuse d'espoir, en ouvrant ses portes aux jeunes issus 
              de milieux modestes ou ayant rencontré des obstacles dans leur parcours scolaire classique.
            </p>
            <p className="text-gray-600">
              Cette approche permet de donner une seconde chance à ceux qui en ont le plus besoin, 
              en leur offrant les outils nécessaires pour construire un avenir professionnel stable 
              et épanouissant.
            </p>
          </div>

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="INFOPRO - Formation Professionnelle" />
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
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
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

      {/* Impact Section */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Impact et résultats
            </h3>
            <p className="text-gray-600">
              Depuis sa création, INFOPRO a permis à de nombreux jeunes de s'insérer professionnellement 
              avec succès. Les formations pratiques et l'accompagnement personnalisé garantissent 
              un taux de réussite élevé et une insertion durable dans le monde du travail.
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
        title="INFOPRO - Formation Professionnelle"
      />
    </>
  );
};

export default InfoproSection;
