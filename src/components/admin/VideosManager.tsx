import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Play, Eye } from "lucide-react";
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

const VideosManager = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

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
    fetchVideos();
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? "Aucune vidéo trouvée" : "Aucune vidéo créée"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {video.featured && (
                            <Badge variant="default" className="text-xs">★</Badge>
                          )}
                          <span className="truncate max-w-[200px]" title={video.title}>
                            {video.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{video.author || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(video.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {video.tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {video.tags && video.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{video.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(video.duration)}</TableCell>
                      <TableCell>{formatFileSize(video.file_size)}</TableCell>
                      <TableCell>
                        {new Date(video.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(video.video_url, '_blank')}
                            title="Voir la vidéo"
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideosManager;