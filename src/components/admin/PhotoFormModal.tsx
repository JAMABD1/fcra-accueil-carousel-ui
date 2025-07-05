import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { PhotoBasicFields } from "./PhotoBasicFields";
import { PhotoUpload } from "./PhotoUpload";
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
  created_at: string;
  updated_at: string;
}

interface PhotoFormModalProps {
  photo?: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PhotoFormData {
  title: string;
  description: string;
  category: string;
  featured: boolean;
  status: string;
  image: FileList | null;
  thumbnail: FileList | null;
}

export const PhotoFormModal = ({ photo, isOpen, onClose }: PhotoFormModalProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PhotoFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      featured: false,
      status: "published",
      image: null,
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (photo) {
      form.reset({
        title: photo.title,
        description: photo.description || "",
        category: photo.category,
        featured: photo.featured,
        status: photo.status,
        image: null,
        thumbnail: null,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        category: "General",
        featured: false,
        status: "published",
        image: null,
        thumbnail: null,
      });
    }
  }, [photo, form]);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  const savePhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      setIsUploading(true);
      setUploadProgress(0);

      let imageUrl = photo?.image_url;
      let thumbnailUrl = photo?.thumbnail_url;

      try {
        // Upload main image if provided
        if (data.image && data.image[0]) {
          setUploadProgress(25);
          const imageFile = data.image[0];
          const imagePath = `images/${Date.now()}-${imageFile.name}`;
          imageUrl = await uploadFile(imageFile, 'photos', imagePath);
        }

        // Upload thumbnail if provided
        if (data.thumbnail && data.thumbnail[0]) {
          setUploadProgress(50);
          const thumbnailFile = data.thumbnail[0];
          const thumbnailPath = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
          thumbnailUrl = await uploadFile(thumbnailFile, 'photos', thumbnailPath);
        }

        setUploadProgress(75);

        const photoData = {
          title: data.title,
          description: data.description || null,
          image_url: imageUrl!,
          thumbnail_url: thumbnailUrl,
          category: data.category,
          featured: data.featured,
          status: data.status,
        };

        if (photo) {
          const { error } = await supabase
            .from("photos")
            .update(photoData)
            .eq("id", photo.id);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("photos")
            .insert([photoData]);
          
          if (error) throw error;
        }

        setUploadProgress(100);
      } catch (error) {
        console.error("Error saving photo:", error);
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast({
        title: photo ? "Photo modifiée" : "Photo ajoutée",
        description: photo ? "La photo a été modifiée avec succès." : "La photo a été ajoutée avec succès.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la photo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PhotoFormData) => {
    if (!photo && (!data.image || !data.image[0])) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image.",
        variant: "destructive",
      });
      return;
    }

    savePhotoMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {photo ? "Modifier la photo" : "Ajouter une nouvelle photo"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PhotoBasicFields form={form} />
            
            <PhotoUpload 
              form={form} 
              existingImageUrl={photo?.image_url}
              existingThumbnailUrl={photo?.thumbnail_url}
            />

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Téléchargement en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Sauvegarde..." : photo ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};