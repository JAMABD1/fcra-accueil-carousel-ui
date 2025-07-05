import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface VideoFormData {
  title: string;
  description: string;
  excerpt: string;
  video: FileList | null;
  thumbnail: FileList | null;
  author: string;
  tags: string[];
  featured: boolean;
  status: string;
}

interface VideoUploadProps {
  control: Control<VideoFormData>;
  existingVideoUrl?: string;
  existingThumbnailUrl?: string;
}

const VideoUpload = ({ control, existingVideoUrl, existingThumbnailUrl }: VideoUploadProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="video"
        rules={!existingVideoUrl ? { 
          required: "Veuillez sélectionner un fichier vidéo",
          validate: (files: FileList | null) => {
            if (!files || files.length === 0) return "Veuillez sélectionner un fichier vidéo";
            const file = files[0];
            if (file.size > 629145600) return "La taille du fichier ne doit pas dépasser 600MB";
            return true;
          }
        } : {}}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vidéo {!existingVideoUrl && "*"}</FormLabel>
            <FormControl>
              <Input 
                type="file"
                accept="video/*"
                onChange={(e) => field.onChange(e.target.files)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </FormControl>
            <div className="text-sm text-muted-foreground">
              Formats supportés: MP4, WebM, OGG, AVI, MOV, WMV. Taille maximum: 600MB
            </div>
            {existingVideoUrl && (
              <div className="text-sm text-muted-foreground">
                <a href={existingVideoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Voir la vidéo actuelle
                </a>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="thumbnail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Miniature</FormLabel>
            <FormControl>
              <Input 
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </FormControl>
            <div className="text-sm text-muted-foreground">
              Image de couverture pour la vidéo (optionnel)
            </div>
            {existingThumbnailUrl && (
              <div className="text-sm text-muted-foreground">
                <a href={existingThumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Voir la miniature actuelle
                </a>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VideoUpload;