import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";

interface RVSSectionProps {
  photos?: string[];
}

const RVSSection = ({ photos }: RVSSectionProps) => {
  const displayPhotos = photos && photos.length > 0 ? photos : ["/placeholder.svg"];
  const previewPhotos = displayPhotos.slice(0, 4);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const radioStations = [
    "Diego-Suarez",
    "Nosy-Be",
    "Majunga",
    "Sainte-Marie",
    "Tananarive",
    "Belo sur Tsiribihina",
    "Morondava",
    "Manakara",
    "Toliara"
  ];

  return (
    <>
      {/* Title */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Radio RVS - Radio Voix de la Sagesse
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Programmes de formation et développement des compétences.
          </p>
        </div>

        {/* Map and Stations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <img
                src="/image/rvsMada.png"
                alt="Carte des stations Radio RVS à Madagascar"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                La Radio RVS possède 09 stations dans tout Madagascar:
              </h3>
              <ul className="space-y-2">
                {radioStations.map((station, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-gray-800 rounded-full mr-3 flex-shrink-0"></span>
                    <span>{station}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Objectifs de la Radio */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Objectifs de la Radio
            </h3>
            <div className="flex flex-wrap gap-4">
              <span className="text-xl font-semibold text-green-600">Informer</span>
              <span className="text-xl font-semibold text-green-600">Eduquer</span>
              <span className="text-xl font-semibold text-green-600">Divertir</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* COOPÉRATION DE LA RVS ET L'ORTM */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              COOPÉRATION DE LA RVS ET L'ORTM
            </h3>
            <p className="text-gray-600 mb-4">
              La RVS et l'ORTM se concrétise à travers la diffusion de l'émission "Mba fantatrao ve", 
              qui est présentée chaque vendredi sur la TVM (Télévision Malagasy) et la RNM 
              (Radio Nationale Malagasy), chaque lundi. Cette émission vise à éduquer et informer 
              le public sur des sujets importants qui est produite par Mme Asma.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Services + main imagery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Une approche globale pour le progrès social
            </h3>
            <p className="text-gray-600 mb-4">
              La Radio Voix de la Sagesse adopte une approche globale qui va au-delà de la diffusion 
              de programmes. En s'engageant activement dans des actions humanitaires, éducatives et 
              sociales, elle joue un rôle essentiel dans le renforcement des liens communautaires et 
              dans l'amélioration des conditions de vie des personnes qu'elle touche.
            </p>
            <p className="text-gray-600">
              La Voix de la Sagesse s'affirme donc comme un acteur incontournable du progrès social et éducatif.
            </p>
          </div>

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="Radio RVS FCRA" />
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
        title="Radio RVS FCRA"
      />
    </>
  );
};

export default RVSSection;

