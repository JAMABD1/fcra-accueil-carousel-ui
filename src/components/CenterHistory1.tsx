import { Card, CardContent } from "@/components/ui/card";

interface CenterDetail1Props {
  videoUrl?: string;
  videoId?: string;
}

const CenterDetail1 = ({ videoUrl, videoId }: CenterDetail1Props) => {
  return (
    <>
      {/* Missions, Vision, Values Section */}
      <section className="mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Engagement
          </h2>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Mission et objectifs</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  
                  <li>L’entraide</li>
                  <li>L’éducation</li>
                  <li>Le développement humain</li>
                  <li>Les valeurs de solidarité</li>
                </ul>
                C’est un lieu d’accueil, de formation, d'accompagnement social et d’espoir pour des milliers de bénéficiaires.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Activités principales</h3>
              <p className="text-gray-600">
              <ul className="list-disc list-inside">
                  <li>Éducation  de la petite enfance au lycée</li>
                  <li>Formation professionnelle (INFOPRO)</li>
                  <li>Enseignement universitaire</li>
                  <li>Actions sociales et humanitaires sous diverses formes</li>
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

            <p>
            Créé en 2012, le centre est actif depuis plus d’une décennie dans le soutien aux populations vulnérables.
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

export default CenterDetail1; 