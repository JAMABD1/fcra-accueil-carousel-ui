import { Card, CardContent } from "@/components/ui/card";

interface CenterDetail2Props {
  videoUrl?: string;
  videoId?: string;
}

const CenterDetail2 = ({ videoUrl, videoId }: CenterDetail2Props) => {
  return (
    <>
      {/* Missions, Vision, Values Section */}
      <section className="mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Engagement
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chaque centre FCRA s'engage à offrir un accompagnement holistique 
            et personnalisé pour l'épanouissement de chaque individu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre Mission</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li>Développer l'excellence technique et professionnelle</li>
                  <li>Former les jeunes aux métiers de demain</li>
                  <li>Faciliter l'insertion professionnelle et l'entrepreneuriat</li>
                  <li>Créer des partenariats avec le secteur privé</li>
                </ul>
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
              <p className="text-gray-600">
                Devenir un centre d'excellence reconnu pour la formation technique et professionnelle, 
                où chaque jeune trouve sa voie et développe les compétences nécessaires pour réussir 
                dans un monde en constante évolution. Nous visons à être un catalyseur de l'innovation 
                et du développement économique local.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Nos Valeurs</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li><span className="font-bold">Excellence :</span> Nous visons l'excellence dans tous nos programmes de formation.</li>
                  <li><span className="font-bold">Innovation :</span> Nous encourageons la créativité et l'innovation technologique.</li>
                  <li><span className="font-bold">Partnership :</span> Nous développons des partenariats solides avec les entreprises.</li>
                  <li><span className="font-bold">Adaptabilité :</span> Nous nous adaptons aux besoins changeants du marché.</li>
                  <li><span className="font-bold">Impact :</span> Nous mesurons notre succès par l'impact sur nos bénéficiaires.</li>
                </ul>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* History Section with Audio/Video */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* History Text */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Histoire du Centre
            </h3>
            <p className="text-gray-600 mb-4">
              Établi en 2012, ce centre est né d'une initiative communautaire visant à créer 
              un espace d'apprentissage et de développement pour les jeunes défavorisés. 
              Il représente l'aboutissement d'un rêve partagé par plusieurs familles de la région.
            </p>
            <p className="text-gray-600 mb-4">
              Le centre s'est spécialisé dans la formation technique et professionnelle, 
              offrant des programmes adaptés aux besoins du marché local. Il a également développé 
              des partenariats solides avec les entreprises locales pour faciliter l'insertion professionnelle.
            </p>
            <p className="text-gray-600">
              Grâce à son approche innovante et son engagement envers l'excellence, 
              le centre est devenu une référence en matière de formation professionnelle 
              et d'accompagnement vers l'emploi dans la région.
            </p>
          </div>

          {/* Audio/Video Content */}
          <div className="col-span-1">
            {videoId && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Histoire du Centre"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
            {videoUrl && !videoId && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <video controls className="w-full h-full">
                  <source src={videoUrl} type="video/mp4" />
                  <source src={videoUrl} type="video/webm" />
                  <source src={videoUrl} type="video/ogg" />
                  Votre navigateur ne supporte pas l'élément vidéo.
                </video>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CenterDetail2; 