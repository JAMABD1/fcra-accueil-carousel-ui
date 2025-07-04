
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";

const Videos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const videos = [
    {
      id: 1,
      title: "Inauguration du Centre de Formation",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      duration: "5:30",
      date: "15 Déc 2024",
      views: "1.2K",
      description: "Découvrez l'inauguration de notre nouveau centre de formation avec les autorités locales."
    },
    {
      id: 2,
      title: "Cérémonie de Remise des Diplômes",
      thumbnail: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
      duration: "12:45",
      date: "20 Nov 2024",
      views: "856",
      description: "La cérémonie annuelle de remise des diplômes de nos étudiants."
    },
    {
      id: 3,
      title: "Formation Professionnelle - Témoignages",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      duration: "8:15",
      date: "5 Nov 2024",
      views: "2.1K",
      description: "Les témoignages de nos anciens étudiants sur leur parcours professionnel."
    },
    {
      id: 4,
      title: "Journée Portes Ouvertes 2024",
      thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      duration: "15:20",
      date: "28 Oct 2024",
      views: "945",
      description: "Revivez notre journée portes ouvertes avec toutes les activités proposées."
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vidéos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos vidéos et événements
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher une vidéo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <Link to={`/videos/${video.id}`}>
                  <div className="relative">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700">
                          <Play className="w-6 h-6 mr-2" />
                          Regarder
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-lg line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{video.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views} vues</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune vidéo trouvée pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Videos;
