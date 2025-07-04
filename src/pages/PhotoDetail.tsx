
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PhotoDetail = () => {
  const { id } = useParams();

  const photos = [
    {
      id: 1,
      title: "Atelier de Formation Technique",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      date: "18 Déc 2024",
      category: "Formation",
      views: "245",
      description: "Nos étudiants en pleine formation technique dans nos ateliers modernes équipés des dernières technologies."
    },
    {
      id: 2,
      title: "Équipe Administrative",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      date: "12 Déc 2024",
      category: "Équipe",
      views: "189",
      description: "Photo de groupe de notre équipe administrative dédiée au service de nos étudiants."
    },
    {
      id: 3,
      title: "Nouvelle Infrastructure",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      date: "8 Déc 2024",
      category: "Infrastructure",
      views: "367",
      description: "Découvrez nos nouvelles infrastructures modernes conçues pour offrir les meilleures conditions d'apprentissage."
    },
    {
      id: 4,
      title: "Étudiants en Action",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
      date: "25 Nov 2024",
      category: "Étudiants",
      views: "456",
      description: "Nos étudiants lors d'un projet collaboratif, démontrant leur engagement et leur esprit d'équipe."
    },
    {
      id: 5,
      title: "Cérémonie Officielle",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      date: "20 Nov 2024",
      category: "Événement",
      views: "523",
      description: "Moment solennel lors de notre cérémonie officielle avec les personnalités et partenaires."
    },
    {
      id: 6,
      title: "Laboratoire Informatique",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      date: "15 Nov 2024",
      category: "Formation",
      views: "298",
      description: "Vue d'ensemble de notre laboratoire informatique avec les équipements de pointe."
    }
  ];

  const photo = photos.find(p => p.id === parseInt(id || "0"));
  const relatedPhotos = photos.filter(p => p.id !== parseInt(id || "0") && p.category === photo?.category).slice(0, 6);

  if (!photo) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Photo non trouvée</h1>
            <Link to="/photos" className="text-green-600 hover:text-green-700">
              Retour à la galerie
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/photos" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la galerie
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Photo */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {photo.title}
                      </h1>
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {photo.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{photo.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{photo.views} vues</span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {photo.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Related Photos */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Photos similaires
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {relatedPhotos.map((relatedPhoto) => (
                  <Card key={relatedPhoto.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/photos/${relatedPhoto.id}`}>
                      <div className="relative">
                        <div 
                          className="w-full h-24 bg-cover bg-center hover:scale-105 transition-transform duration-300"
                          style={{ backgroundImage: `url(${relatedPhoto.image})` }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300" />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-xs line-clamp-2 mb-1">
                          {relatedPhoto.title}
                        </h3>
                        <div className="text-xs text-gray-500">
                          {relatedPhoto.date}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PhotoDetail;
