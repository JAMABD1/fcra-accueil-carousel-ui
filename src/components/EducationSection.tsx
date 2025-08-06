import { Card, CardContent } from "@/components/ui/card";
import PhotoCarousel from "./PhotoCarousel";

interface EducationSectionProps {
  photos?: string[];
}

const EducationSection = ({ photos }: EducationSectionProps) => {
  return (
    <>
      {/* Educational Establishments Section */}
      <section className="mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des établissements scolaires d'excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Lycée Privé La Sagesse - Antaniavo</h3>
              <p className="text-gray-600 mb-4">
                Parmi les piliers de cet engagement figure le Lycée Privé La Sagesse à Antaniavo, 
                qui célèbre cette année ses 10 ans d'existence. Avec un taux de réussite de 100 % 
                aux examens officiels (CEPE, BEPC, Baccalauréat), cet établissement accueille plus 
                de 300 élèves, accompagnés au quotidien par une équipe de 40 professionnels dévoués.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Complexe scolaire La Sagesse Universelle - Andakana</h3>
              <p className="text-gray-600 mb-4">
                À Andakana, le complexe scolaire La Sagesse Universelle est le plus grand centre 
                éducatif du FCRA. Doté d'infrastructures modernes, il symbolise l'ambition du FCRA 
                de former une jeunesse instruite, confiante et tournée vers l'avenir.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">École Al Mhadi School - Manakara</h3>
              <p className="text-gray-600 mb-4">
                À Manakara, l'École Al Mhadi School, et à Sakoana, l'École La Sagesse, 
                poursuivent le même objectif : offrir un accès équitable à une éducation de 
                qualité à des centaines de jeunes chaque année.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-4">Un environnement propice à l'épanouissement</h3>
              <p className="text-gray-600 mb-4">
                Au-delà des salles de classe, les établissements du FCRA proposent un environnement complet :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Cantines scolaires équilibrées</li>
                <li>Laboratoires scientifiques</li>
                <li>Infrastructures sportives (terrain de football, basketball, piscine)</li>
                <li>Service de transport scolaire</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Tout est pensé pour favoriser l'épanouissement global de chaque élève.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scouting Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Le scoutisme, une école de la vie
            </h3>
            <p className="text-gray-600 mb-4">
              Depuis 2018, le scoutisme est intégré à la formation des enfants du FCRA, 
              à l'initiative de l'animateur Al Moutardha. Cette activité éducative développe 
              chez les jeunes l'esprit d'entraide, de discipline et de responsabilité.
            </p>
            <p className="text-gray-600 mb-4">
              Les enfants, filles et garçons, sont répartis en trois branches selon leur âge 
              et leur niveau d'autonomie :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Branche Jaune</li>
              <li>Branche Noire</li>
              <li>Branche Rouge</li>
            </ul>
            <p className="text-gray-600">
              Chaque branche propose des activités adaptées pour renforcer le développement 
              personnel et social des enfants.
            </p>
          </div>

          {/* Photo Carousel */}
          <div className="col-span-1">
            <PhotoCarousel 
              photos={photos || []} 
              title="Éducation FCRA"
            />
          </div>
          
        </div>
      </section>

      {/* Teacher Training Section */}
      <section className="mb-8">
        <Card className="p-6">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Formation continue des enseignants
            </h3>
            <p className="text-gray-600">
              Pour maintenir un haut niveau d'exigence, le FCRA organise régulièrement des 
              séminaires de formation continue pour son personnel éducatif. Ces sessions 
              permettent de renouveler les compétences pédagogiques et d'adapter les méthodes 
              d'enseignement aux besoins évolutifs des apprenants.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EducationSection; 