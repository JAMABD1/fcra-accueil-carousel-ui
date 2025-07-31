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
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre Mission</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                  <li>Promouvoir l’éducation intégrale</li>
                  <li>Favoriser le développement humain durable</li>
                  <li>Soutenir une jeunesse tournée vers l’avenir, responsable, éduquée et engagée</li>
                  <li>Educater les jeunes à la solidarité</li>
                </ul>
              </p>
            </CardContent>
          </Card>

          

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Infrastructures  principales</h3>
              <p className="text-gray-600">
                <ul className="list-disc list-inside">
                <li>Établissements scolaires complets</li>
                  <li> Internats et logements, transports scolaires, cantines scolaires </li>
                  <li> Bibliothèques, laboratoires, équipements numériques</li>
                  <li>Espaces sportifs et culturels</li>
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