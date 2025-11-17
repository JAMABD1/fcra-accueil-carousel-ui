import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPhotos, deleteRecord, getTags } from "@/lib/db/queries";
import { photos } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PhotoFormModal } from "./PhotoFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Pencil, Trash2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string;
  featured: boolean;
  status: string;
  tag_ids: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

const PhotosManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      return await getPhotos({ status: undefined }); // Get all photos
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return await getTags();
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await deleteRecord(photos, photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la photo.",
        variant: "destructive",
      });
    },
  });

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagNames = (tagIds: string[] | null) => {
    if (!tagIds || tagIds.length === 0) return [];
    return tags.filter(tag => tagIds.includes(tag.id));
  };

  const handleEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPhoto(null);
    setIsModalOpen(true);
  };

  const handleDelete = (photoId: string) => {
    deletePhotoMutation.mutate(photoId);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Photos</h2>
          <p className="text-muted-foreground">Gérez votre galerie photo</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Photo
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une photo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => {
          const photoTags = getTagNames(photo.tag_ids);
          return (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {photo.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    Vedette
                  </Badge>
                )}
                <Badge 
                  className="absolute top-2 right-2"
                  variant={photo.status === 'published' ? 'default' : 'secondary'}
                >
                  {photo.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{photo.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{photo.category}</p>
                {photo.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {photo.description}
                  </p>
                )}
                {/* Tags Display */}
                {photoTags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {photoTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          style={{
                            backgroundColor: tag.color + '10',
                            color: tag.color,
                            borderColor: tag.color
                          }}
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(photo.published_at || photo.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(photo)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la photo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(photo.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune photo trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Aucune photo ne correspond à votre recherche." : "Commencez par ajouter votre première photo."}
            </p>
            {!searchTerm && (
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une photo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <PhotoFormModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPhoto(null);
        }}
      />
    </div>
  );
};

export default PhotosManager;