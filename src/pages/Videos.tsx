
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Videos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch videos from Supabase
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const filteredVideos = videos.filter((video: any) =>
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
            {filteredVideos.map((video: any) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <Link to={`/videos/${video.id}`}>
                  <div className="relative">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail_url || '/placeholder.svg'})` }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700">
                          <Play className="w-6 h-6 mr-2" />
                          Regarder
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {/* Show duration if available, else fallback */}
                      {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-lg line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description || video.excerpt || ''}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{video.created_at ? new Date(video.created_at).toLocaleDateString('fr-FR') : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views || '--'} vues</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des vidéos...</p>
            </div>
          )}
          {filteredVideos.length === 0 && !isLoading && (
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
