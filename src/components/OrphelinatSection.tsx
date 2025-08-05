import { Card, CardContent } from "@/components/ui/card";

interface OrphelinatSectionProps {
  videoUrl?: string;
  videoId?: string;
}

const OrphelinatSection = ({ videoUrl, videoId }: OrphelinatSectionProps) => {
  return (
    <>
      {/* Main Orphanage Section */}
      <section className="mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre engagement envers les orphelins
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Au cœur des actions du FCRA</h3>
              <p className="text-gray-600 mb-4">
                L'accueil et la prise en charge des orphelins occupent une place essentielle. 
                À Madagascar, nous gérons quatre centres d'orphelinat situés à Antaniavo, 
                Andakana, Manakara et Sakoana, offrant un refuge sûr, stable et bienveillant 
                à des enfants privés de soutien familial.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Plus de 230 enfants pris en charge</h3>
              <p className="text-gray-600 mb-4">
                Actuellement, plus de 230 enfants — filles et garçons — bénéficient d'un 
                accompagnement global au sein de nos structures : hébergement, alimentation, 
                soins, éducation et encadrement affectif. Chaque centre est pensé comme un 
                véritable foyer, où les enfants peuvent s'épanouir, apprendre et se construire 
                un avenir digne et prometteur.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Notre objectif fondamental</h3>
              <p className="text-gray-600 mb-4">
                Notre objectif est simple mais fondamental : redonner à chaque enfant la 
                sécurité, la dignité et l'amour dont il a besoin pour grandir sereinement.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Un engagement total</h3>
              <p className="text-gray-600 mb-4">
                Au sein de notre orphelinat, chaque enfant bénéficie d'une prise en charge 
                globale, humaine et respectueuse, couvrant tous les aspects essentiels de la vie.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Un engagement total pour le bien-être et l'épanouissement des enfants
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🍲 Une alimentation saine et équilibrée</h4>
                <p className="text-gray-600 mb-4">
                  Nous assurons chaque jour des repas sains, variés et préparés dans le respect 
                  strict des normes d'hygiène. L'alimentation joue un rôle central dans la santé 
                  et le développement des enfants. C'est pourquoi nous veillons à leur offrir des 
                  plats nutritifs, adaptés à leur âge et à leurs besoins.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🎓 Une éducation complète et gratuite</h4>
                <p className="text-gray-600 mb-4">
                  L'éducation est au cœur de notre mission. Tous les frais scolaires sont pris 
                  en charge par le centre :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                  <li>Écolages</li>
                  <li>Fournitures scolaires</li>
                  <li>Uniformes, vêtements et chaussures</li>
                </ul>
                <p className="text-gray-600">
                  Nous accompagnons les enfants tout au long de leur parcours éducatif, en leur 
                  offrant un environnement stable, propice à l'apprentissage et à la réussite.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">🕊 Des valeurs spirituelles pour guider leur vie</h4>
                <p className="text-gray-600">
                  En plus de leur éducation académique, nous transmettons aux enfants les 
                  principes de la sagesse universelle à travers l'enseignement religieux. 
                  Ces valeurs, fondées sur le respect, la compassion, la tolérance et la foi, 
                  sont partagées quotidiennement et aident chaque enfant à grandir avec des 
                  repères solides, un sens de la responsabilité, et une ouverture d'esprit.
                </p>
              </div>
            </div>
          </div>

          {/* Video/Audio Content */}
          <div className="col-span-1">
            {videoId && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Orphelinat FCRA"
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

export default OrphelinatSection; 