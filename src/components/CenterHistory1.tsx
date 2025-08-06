import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface CenterDetail1Props {
  photos?: string[];
}

const CenterDetail1 = ({ photos }: CenterDetail1Props) => {
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
              Le FCRA s'engage à fournir des services sociaux, éducatifs et sanitaires 
              de qualité aux communautés locales, en particulier aux plus vulnérables. 
              Notre mission est de créer un impact positif durable dans la vie des personnes 
              que nous servons.
            </p>
            <p className="text-gray-600">
              Nous nous efforçons de promouvoir le développement communautaire à travers 
              des programmes intégrés qui répondent aux besoins essentiels de la population.
            </p>
          </div>

          {/* Photo Carousel */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={photos || []} 
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
            <p className="text-gray-600 mb-4">
              Nous aspirons à être un centre de référence pour le développement communautaire, 
              reconnu pour l'excellence de nos services et notre engagement envers 
              l'amélioration de la qualité de vie des populations locales.
            </p>
            <p className="text-gray-600">
              Notre vision est de créer des communautés autonomes et résilientes, 
              où chaque individu a accès aux ressources nécessaires pour s'épanouir.
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

            <p>
            Créé en 2012, le centre est actif depuis plus d'une décennie dans le soutien aux populations vulnérables.
            </p>

          </div>

          {/* Photo Carousel */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={photos || []} 
              title="Histoire du Centre"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CenterDetail1; 