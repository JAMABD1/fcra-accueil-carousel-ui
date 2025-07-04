
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoDetail = () => {
  const { id } = useParams();

  const videos = [
    {
      id: 1,
      title: "Inauguration du Centre de Formation",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
      duration: "5:30",
      date: "15 Déc 2024",
      views: "1.2K",
      description: "Découvrez l'inauguration de notre nouveau centre de formation avec les autorités locales. Cette vidéo présente les différentes étapes de la cérémonie, les discours des personnalités présentes et la visite des nouvelles installations.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Cérémonie de Remise des Diplômes",
      thumbnail: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=450&fit=crop",
      duration: "12:45",
      date: "20 Nov 2024",
      views: "856",
      description: "La cérémonie annuelle de remise des diplômes de nos étudiants. Un moment émouvant où nous célébrons les réussites de nos diplômés.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "Formation Professionnelle - Témoignages",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
      duration: "8:15",
      date: "5 Nov 2024",
      views: "2.1K",
      description: "Les témoignages de nos anciens étudiants sur leur parcours professionnel après leur formation dans nos centres.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 4,
      title: "Journée Portes Ouvertes 2024",
      thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=450&fit=crop",
      duration: "15:20",
      date: "28 Oct 2024",
      views: "945",
      description: "Revivez notre journée portes ouvertes avec toutes les activités proposées.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ];

  const video = videos.find(v => v.id === parseInt(id || "0"));
  const relatedVideos = videos.filter(v => v.id !== parseInt(id || "0")).slice(0, 3);

  if (!video) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vidéo non trouvée</h1>
            <Link to="/videos" className="text-green-600 hover:text-green-700">
              Retour aux vidéos
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
            to="/videos" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux vidéos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views} vues</span>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Related Videos */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vidéos similaires
              </h2>
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <Card key={relatedVideo.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/videos/${relatedVideo.id}`}>
                      <div className="flex">
                        <div className="relative w-32 h-20 flex-shrink-0">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${relatedVideo.thumbnail})` }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 text-xs rounded">
                            {relatedVideo.duration}
                          </div>
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedVideo.title}
                          </h3>
                          <div className="text-xs text-gray-500">
                            <div>{relatedVideo.views} vues</div>
                            <div>{relatedVideo.date}</div>
                          </div>
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

export default VideoDetail;
