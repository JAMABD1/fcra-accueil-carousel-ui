import { Card, CardContent } from "@/components/ui/card";

interface CenterDetail4Props {
  videoUrl?: string;
  videoId?: string;
}

const CenterDetail4 = ({ videoUrl, videoId }: CenterDetail4Props) => {
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
                  <li>Créer un écosystème intégré de développement durable</li>
                  <li>Développer l'entrepreneuriat social et l'innovation technologique</li>
                  <li>Intégrer les technologies modernes dans nos programmes</li>
                  <li>Établir des partenariats internationaux et locaux</li>
                </ul>
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
              <p className="text-gray-600">
                Devenir un hub d'innovation sociale et technologique de référence, 
                où tradition et modernité se rencontrent pour créer un impact durable. 
                Nous aspirons à être un modèle de développement communautaire intégré, 
                utilisant la technologie comme levier de transformation sociale et économique.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Nos Valeurs</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li><span className="font-bold">Innovation :</span> Nous repoussons les limites avec créativité et audace.</li>
                  <li><span className="font-bold">Durabilité :</span> Nous créons un impact durable pour les générations futures.</li>
                  <li><span className="font-bold">Technologie :</span> Nous utilisons la technologie comme outil de transformation.</li>
                  <li><span className="font-bold">Collaboration :</span> Nous travaillons avec des partenaires locaux et internationaux.</li>
                  <li><span className="font-bold">Excellence :</span> Nous visons l'excellence dans tous nos programmes et services.</li>
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
              Inauguré en 2018, ce centre représente la vision moderne du développement 
              communautaire intégré. Il a été conçu pour être un hub d'innovation sociale, 
              combinant tradition et modernité pour créer un impact durable.
            </p>
            <p className="text-gray-600 mb-4">
              Le centre se caractérise par son approche écosystémique, intégrant 
              l'éducation, la santé, l'entrepreneuriat social et la technologie. 
              Il a développé des programmes pionniers en matière de développement 
              durable et d'innovation sociale, servant de modèle pour d'autres centres.
            </p>
            <p className="text-gray-600">
              Avec ses installations modernes et son équipe pluridisciplinaire, 
              le centre continue de repousser les limites de ce qui est possible 
              en matière de développement communautaire et d'impact social.
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

export default CenterDetail4; 