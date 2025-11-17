import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecord, updateRecord } from "@/lib/db/queries";
import { uploadImage } from "@/lib/storage/r2";
import { photos } from "@/lib/db/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { PhotoBasicFields } from "./PhotoBasicFields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import TagSelector from "./TagSelector";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  images: string[] | null;
  category: string;
  featured: boolean;
  status: string;
  tag_ids: string[] | null;
  published_at: string | null;
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
  tag_ids: string[];
  published_at: Date | null;
}

export const PhotoFormModal = ({ photo, isOpen, onClose }: PhotoFormModalProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PhotoFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      featured: false,
      status: "published",
      tag_ids: [],
      published_at: null,
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
        tag_ids: photo.tag_ids || [],
        published_at: photo.published_at ? new Date(photo.published_at) : null,
      });
      // Initialize current images from existing photo
      const initialImages = (photo.images && photo.images.length > 0)
        ? photo.images
        : (photo.image_url ? [photo.image_url] : []);
      setCurrentImages(initialImages);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "General",
        featured: false,
        status: "published",
        tag_ids: [],
        published_at: null,
      });
      setCurrentImages([]);
    }
  }, [photo, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeExistingImage = (index: number) => {
    setCurrentImages((imgs) => imgs.filter((_, i) => i !== index));
  };

  const savePhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        let uploadedUrls: string[] = [];
        // Start from currently kept images (after any deletions in UI)
        let workingImages: string[] = [...currentImages];
        let mainImageUrl = photo?.image_url;

        // Upload all selected images
        if (selectedFiles.length > 0) {
          const totalFiles = selectedFiles.length;
          
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const result = await uploadImage(file, 'photos/images', 'photo-');
            if (!result.success || !result.url) {
              console.error('Upload error:', result.error);
              throw new Error(result.error || 'Upload failed');
            }
            uploadedUrls.push(result.url);
            
            // Update progress
            setUploadProgress(Math.round(((i + 1) / totalFiles) * 80));
          }
          
          // If there were no existing images, we'll set main after merging
        }

        setUploadProgress(90);

        // Merge existing kept images + newly uploaded ones
        const finalImages = [...workingImages, ...uploadedUrls];

        if (finalImages.length === 0) {
          throw new Error('Aucune image restante. Ajoutez au moins une image avant d\'enregistrer.');
        }

        // Determine main image from final set
        mainImageUrl = finalImages[0];

        const photoData = {
          title: data.title,
          description: data.description || null,
          imageUrl: mainImageUrl!,
          thumbnailUrl: finalImages[0] || photo?.thumbnail_url,
          images: finalImages,
          category: data.category,
          featured: data.featured,
          status: data.status,
          tagIds: data.tag_ids.length > 0 ? data.tag_ids : null,
          publishedAt: data.published_at ? new Date(data.published_at) : null,
        };

        if (photo) {
          await updateRecord(photos, photo.id, photoData);
        } else {
          await createRecord(photos, photoData);
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
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCurrentImages([]);
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
    if (!photo && selectedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une image.",
        variant: "destructive",
      });
      return;
    }

    savePhotoMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {photo ? "Modifier la photo" : "Ajouter une nouvelle photo"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PhotoBasicFields form={form} />
            
            {/* Tag Selection */}
            <TagSelector
              control={form.control}
              name="tag_ids"
              label="Tags"
            />

            {/* Publication Date */}
            <FormField
              control={form.control}
              name="published_at"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel>Date de publication</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-between ${!field.value ? "text-muted-foreground" : ""}`}
                          type="button"
                        >
                          {field.value ? format(field.value, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Bulk Image Upload */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Images (Upload multiple)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Sélectionnez plusieurs images à télécharger. La première image sera utilisée comme image principale.
                </p>
              </div>

              {/* Existing Images Preview */}
              {photo && currentImages && currentImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Images existantes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentImages.map((imageUrl, index) => (
                      <Card key={index} className="overflow-hidden relative">
                        <CardContent className="p-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <img
                            src={imageUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <p className="text-xs text-center mt-1">
                            {index === 0 ? "Principal" : `Image ${index + 1}`}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Nouvelles images à télécharger</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <Card key={index} className="overflow-hidden relative">
                        <CardContent className="p-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <p className="text-xs text-center mt-1">
                            {index === 0 ? "Principal" : `Image ${index + 1}`}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

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