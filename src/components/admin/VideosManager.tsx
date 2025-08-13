import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Table view removed; using cards grid instead
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VideoFormModal from "./VideoFormModal";

interface Video {
  id: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  video_url: string;
  thumbnail_url: string | null;
  author: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: string | null;
  duration: number | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

const VideosManager = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*');
        if (error) throw error;
        setAllTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchVideos();
    fetchTags();
  }, []);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        const { error } = await supabase
          .from('videos')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Vidéo supprimée avec succès",
        });
        
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la vidéo",
          variant: "destructive",
        });
      }
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Publié</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="secondary">Brouillon</Badge>;
    }
  };

  const resolveTagDisplay = (value: string) => {
    const tag = allTags.find(t => t.id === value || t.name === value);
    return tag?.name || value;
  };

  const resolveTagColor = (value: string) => {
    const tag = allTags.find(t => t.id === value || t.name === value);
    return tag?.color || undefined;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement des vidéos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Vidéos</CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Vidéo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle vidéo</DialogTitle>
                </DialogHeader>
                <VideoFormModal
                  onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchVideos();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par titre, auteur ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {searchTerm ? "Aucune vidéo trouvée" : "Aucune vidéo créée"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => {
                const createdDate = new Date(video.created_at).toLocaleDateString();
                return (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-2">
                        {video.featured && (
                          <Badge className="bg-yellow-500">Vedette</Badge>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(video.status)}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate" title={video.title}>{video.title}</h3>
                          <p className="text-xs text-muted-foreground">{video.author || 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => video.id && navigate(`/videos/${video.id}`)}
                            title="Lire"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Dialog open={isEditModalOpen && selectedVideo?.id === video.id}
                                  onOpenChange={(open) => {
                                    setIsEditModalOpen(open);
                                    if (!open) setSelectedVideo(null);
                                  }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedVideo(video)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Modifier la vidéo</DialogTitle>
                              </DialogHeader>
                              <VideoFormModal
                                video={selectedVideo}
                                onSuccess={() => {
                                  setIsEditModalOpen(false);
                                  setSelectedVideo(null);
                                  fetchVideos();
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(video.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {video.tags?.map((value, index) => {
                          const name = resolveTagDisplay(value);
                          const color = resolveTagColor(value);
                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                              style={color ? { backgroundColor: `${color}10`, color, borderColor: color } : undefined}
                            >
                              {name}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Durée: {formatDuration(video.duration)}</span>
                        <span>Taille: {formatFileSize(video.file_size)}</span>
                        <span>{createdDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideosManager;