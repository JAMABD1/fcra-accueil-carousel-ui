import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface VideoBasicFieldsProps {
  control: Control<VideoFormData>;
}

const VideoBasicFields = ({ control }: VideoBasicFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="title"
          rules={{ required: "Le titre est requis" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre *</FormLabel>
              <FormControl>
                <Input placeholder="Titre de la vidéo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'auteur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extrait</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Résumé de la vidéo"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description complète de la vidéo"
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VideoBasicFields;