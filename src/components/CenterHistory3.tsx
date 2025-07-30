import { Card, CardContent } from "@/components/ui/card";

interface CenterDetail3Props {
  videoUrl?: string;
  videoId?: string;
}

const CenterDetail3 = ({ videoUrl, videoId }: CenterDetail3Props) => {
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
                  <li>Innover dans l'approche pédagogique et sociale</li>
                  <li>Développer des programmes de mentorat personnalisé</li>
                  <li>Créer des espaces d'expérimentation et d'innovation</li>
                  <li>Favoriser l'engagement communautaire et la participation citoyenne</li>
                </ul>
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
              <p className="text-gray-600">
                Être un laboratoire d'innovation sociale et pédagogique, où nous expérimentons 
                de nouvelles approches pour répondre aux défis contemporains. Nous aspirons à créer 
                un modèle de développement communautaire qui inspire et se reproduit, transformant 
                la façon dont nous pensons l'éducation et l'engagement social.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Nos Valeurs</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li><span className="font-bold">Innovation :</span> Nous repoussons les limites de ce qui est possible.</li>
                  <li><span className="font-bold">Expérimentation :</span> Nous testons de nouvelles approches avec audace.</li>
                  <li><span className="font-bold">Collaboration :</span> Nous travaillons ensemble pour créer des solutions.</li>
                  <li><span className="font-bold">Adaptabilité :</span> Nous nous adaptons aux besoins émergents.</li>
                  <li><span className="font-bold">Impact :</span> Nous mesurons notre succès par le changement social.</li>
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
              Créé en 2015, ce centre a été conçu comme un espace d'innovation sociale 
              et d'expérimentation pédagogique. Il est le fruit d'une collaboration 
              entre des éducateurs passionnés et des leaders communautaires visionnaires.
            </p>
            <p className="text-gray-600 mb-4">
              Le centre s'est distingué par son approche holistique du développement, 
              intégrant l'éducation formelle, la formation professionnelle, le développement 
              personnel et l'engagement communautaire. Il a également mis en place des 
              programmes innovants de mentorat et d'accompagnement personnalisé.
            </p>
            <p className="text-gray-600">
              Aujourd'hui, le centre est reconnu pour son excellence pédagogique et 
              son impact positif sur la transformation sociale de la communauté. 
              Il continue d'innover et d'adapter ses programmes aux défis contemporains.
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

export default CenterDetail3; 