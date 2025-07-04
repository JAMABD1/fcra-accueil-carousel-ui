
import Layout from "@/components/Layout";
import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <Layout>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de FCRA
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              FCRA est une organisation à but non lucratif qui se consacre à aider les
              communautés locales à travers des initiatives éducatives et sociales. Notre
              mission est de créer un impact durable en offrant des ressources et un
              soutien à ceux qui en ont besoin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Mission</h3>
                <p className="text-gray-600">
                  Notre mission est d'offrir des opportunités d'éducation et de
                  développement aux jeunes et adultes dans des situations
                  vulnérables. Nous croyons en un avenir où chaque individu
                  a accès à des ressources pour atteindre son potentiel.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
                <p className="text-gray-600">
                  FCRA envisage un monde où l'éducation est accessible à
                  tous, où les jeunes trouvent des opportunités égales pour réussir
                  et où la communauté s'entraide pour construire un avenir
                  meilleur.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
              Découvrez nos projets
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Impact en Chiffres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-green-600">300+</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Étudiants Universitaires</h3>
              <p className="text-gray-600">Enfants universitaire par an</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-green-600">1,000+</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Orphelinat</h3>
              <p className="text-gray-600">Enfants orphelin fille et garçons pris en charge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Sections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(/lovable-uploads/586b3ef5-3f2c-4e08-9ed5-25bbc640d5da.png)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Étudiants Universitaires</h3>
                <p className="text-gray-600 mb-4">
                  Accompagnement et soutien des étudiants dans leur parcours académique.
                </p>
                <Button variant="outline" className="w-full">
                  Visitez Nous
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Orphelinat</h3>
                <p className="text-gray-600 mb-4">
                  Prise en charge et éducation des enfants orphelins.
                </p>
                <Button variant="outline" className="w-full">
                  Visitez Nous
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1581091870632-5a5ad36db9c6?w=400&h=200&fit=crop)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">RVS</h3>
                <p className="text-gray-600 mb-4">
                  Programmes de formation et développement des compétences.
                </p>
                <Button variant="outline" className="w-full">
                  Visitez Nous
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Derniers Actualités
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos dernières publications et apprenez-en plus sur notre engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Cérémonie de Remise des Diplômes</h3>
                <p className="text-gray-600 text-sm">
                  Une nouvelle promotion d'étudiants diplômés rejoint notre communauté d'anciens.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=200&fit=crop)"
              }}></div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Nouveau Programme d'Éducation</h3>
                <p className="text-gray-600 text-sm">
                  Lancement d'un nouveau programme éducatif pour soutenir les communautés locales.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
              Découvrez Toutes les articles
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Coordonnées
            </h2>
            <p className="text-lg text-gray-600">
              Nous sommes toujours disponibles pour répondre à vos questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">📞</span>
                </div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600">0344679192</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">✉️</span>
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">jao.lazabdallah83@gmail.com</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">📍</span>
                </div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600">Antananarivo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
