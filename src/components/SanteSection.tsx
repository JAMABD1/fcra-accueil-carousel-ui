import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhotoCarousel from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";

interface SanteSectionProps {
  photos?: string[];
}

const SanteSection = ({ photos }: SanteSectionProps) => {
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
            Des établissements de santé accessibles à tous
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Une couverture médicale complète pour améliorer la qualité de vie des communautés locales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Le Dispensaire Shabbir : proximité et soins pour tous</h3>
              <p className="text-gray-600 mb-4">
                Situé dans une zone accessible à tous, le dispensaire Shabbir propose :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Des consultations médicales à tarifs abordables</li>
                <li>Des médicaments essentiels à prix réduit</li>
                <li>Un service de médecine générale, néonatale, dentaire</li>
                <li>Ainsi qu'une salle d'échographie</li>
              </ul>
              <p className="text-gray-600">
                Il assure un suivi médical de qualité, notamment pour les femmes enceintes, 
                les enfants et les personnes âgées — des publics souvent les plus exposés.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">L'Hôpital Roshan Jamil : un centre de référence à Amborobe</h3>
              <p className="text-gray-600 mb-4">
                Dans la région de Fitovinany, l'hôpital Roshan Jamil constitue un véritable 
                pôle de référence sanitaire. Il offre des soins accessibles à toute la population, 
                sans distinction de statut ou de revenu, renforçant la couverture médicale dans 
                une zone où l'offre de soins reste limitée.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">La Maternité Baneen : accompagner la vie dès le début</h3>
              <p className="text-gray-600 mb-4">
                Implantée dans la commune rurale de Tatao, la maternité Baneen a vu le jour 
                grâce à un partenariat avec Comfort Aid International (CIA USA) et la coopération 
                des autorités locales. Elle joue un rôle vital en facilitant l'accès aux soins 
                maternels et néonatals, pour que chaque femme puisse accoucher dans des conditions 
                sûres et dignes.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Une approche holistique de la santé</h3>
              <p className="text-gray-600 mb-4">
                Les établissements de santé du FCRA s'engagent pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>L'accessibilité des soins pour tous</li>
                <li>La prévention et l'éducation sanitaire</li>
                <li>Le suivi médical personnalisé</li>
                <li>La formation continue du personnel médical</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Chaque établissement contribue à améliorer la qualité de vie des communautés locales.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Health Services + main imagery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Des services de santé complets
            </h3>
            <p className="text-gray-600 mb-4">
              Le réseau de santé du FCRA couvre l'ensemble des besoins médicaux de la population, 
              de la prévention aux soins spécialisés. Chaque établissement est équipé pour 
              répondre aux urgences et assurer un suivi médical de qualité.
            </p>
            <p className="text-gray-600 mb-4">
              Nos établissements proposent une gamme complète de services :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Médecine générale et spécialisée</li>
              <li>Soins maternels et néonatals</li>
              <li>Dentisterie et ophtalmologie</li>
              <li>Imagerie médicale et laboratoire</li>
            </ul>
            <p className="text-gray-600">
              Tous les services sont accessibles à des tarifs adaptés aux revenus locaux, 
              garantissant l'équité d'accès aux soins.
            </p>
          </div>

          {/* Main carousel */}
          <div className="col-span-1">
            <PhotoCarousel photos={displayPhotos} title="Services de santé FCRA" />
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
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
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

      {/* Medical Training Section */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Formation et développement du personnel médical
            </h3>
            <p className="text-gray-600">
              Pour maintenir l'excellence des soins, le FCRA investit dans la formation continue 
              de son personnel médical. Des programmes de formation réguliers permettent 
              d'actualiser les compétences et d'adopter les meilleures pratiques médicales, 
              garantissant ainsi des soins de qualité pour tous les patients.
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
        title="Services de santé FCRA"
      />
    </>
  );
};

export default SanteSection; 