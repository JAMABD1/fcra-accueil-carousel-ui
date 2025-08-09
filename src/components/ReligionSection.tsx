import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";

interface ReligionSectionProps {
  photos?: string[];
}

const ReligionSection = ({ photos }: ReligionSectionProps) => {
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
            Des initiatives spirituelles et solidaires
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Allier spiritualité et action sociale pour un impact positif durable dans les communautés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Mouharram : solidarité et compassion</h3>
              <p className="text-gray-600 mb-4">
                De la même manière, pendant le mois sacré de Mouharram, à Manakara et Sakoana, 
                plusieurs initiatives solidaires sont mises en place. Des distributions de vêtements 
                chauds et de sandales permettent aux familles vulnérables d'affronter les périodes 
                froides avec dignité.
              </p>
              <p className="text-gray-600">
                Par ailleurs, une campagne de consultation médicale gratuite est organisée, 
                incluant des consultations ophtalmologiques, dentaires ainsi que des circoncisions 
                gratuites, répondant aux besoins essentiels des populations locales.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Milad-un-Nabi : célébration spirituelle</h3>
              <p className="text-gray-600 mb-4">
                Chaque année, nous célébrons également le Milad-un-Nabi, la naissance du 
                Prophète Muhammad (PSL), un rendez-vous sacré empreint de spiritualité et de 
                communion fraternelle.
              </p>
              <p className="text-gray-600">
                Ce moment unique est l'occasion de se recueillir, de renforcer les liens 
                spirituels et de transmettre les valeurs d'amour, de paix et de miséricorde 
                qui sont au cœur de notre foi.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Initiatives solidaires du FCRA</h3>
              <p className="text-gray-600 mb-4">
                Nos programmes religieux s'accompagnent toujours d'actions concrètes :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Distribution de vêtements et chaussures</li>
                <li>Consultations médicales gratuites</li>
                <li>Soins ophtalmologiques et dentaires</li>
                <li>Circoncisions gratuites</li>
                <li>Accompagnement spirituel</li>
              </ul>
              <p className="text-gray-600">
                Chaque initiative allie spiritualité et solidarité pour répondre aux besoins 
                matériels et spirituels des communautés.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Valeurs et transmission</h3>
              <p className="text-gray-600 mb-4">
                Le FCRA s'engage à transmettre et promouvoir :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>L'amour et la compassion</li>
                <li>La paix et la tolérance</li>
                <li>La miséricorde et le pardon</li>
                <li>La solidarité et l'entraide</li>
                <li>Le respect de la dignité humaine</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Ces valeurs fondamentales guident toutes nos actions et programmes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spiritual Activities + main imagery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Activités spirituelles et communautaires
            </h3>
            <p className="text-gray-600 mb-4">
              Le FCRA organise régulièrement des activités spirituelles qui rassemblent 
              les communautés autour de valeurs communes. Ces moments de partage renforcent 
              les liens fraternels et permettent de transmettre les enseignements essentiels.
            </p>
            <p className="text-gray-600 mb-4">
              Nos programmes incluent :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Cérémonies religieuses et commémorations</li>
              <li>Éducation spirituelle et morale</li>
              <li>Actions caritatives et solidaires</li>
              <li>Accompagnement des familles en difficulté</li>
            </ul>
            <p className="text-gray-600">
              Chaque activité est conçue pour allier spiritualité et action sociale, 
              créant un impact positif durable dans les communautés.
            </p>
          </div>

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="Activités spirituelles FCRA" />
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
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
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

      {/* Community Impact Section */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Impact communautaire et développement spirituel
            </h3>
            <p className="text-gray-600">
              Nos initiatives religieuses contribuent au développement spirituel et social 
              des communautés. En combinant cérémonies religieuses et actions solidaires, 
              nous créons un environnement où spiritualité et bien-être social se renforcent 
              mutuellement, favorisant l'épanouissement de chaque individu et le renforcement 
              des liens communautaires.
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
        title="Activités spirituelles FCRA"
      />
    </>
  );
};

export default ReligionSection; 