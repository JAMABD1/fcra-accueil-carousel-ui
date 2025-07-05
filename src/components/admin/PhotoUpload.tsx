import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoFormData {
  title: string;
  description: string;
  category: string;
  featured: boolean;
  status: string;
  image: FileList | null;
  thumbnail: FileList | null;
}

interface PhotoUploadProps {
  form: UseFormReturn<PhotoFormData>;
  existingImageUrl?: string;
  existingThumbnailUrl?: string;
}

export const PhotoUpload = ({ form, existingImageUrl, existingThumbnailUrl }: PhotoUploadProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="image"
            {...(!existingImageUrl ? {
              rules: {
                validate: (files: FileList | null) => {
                  if (!files || files.length === 0) return "Veuillez sélectionner une image";
                  const file = files[0];
                  if (file.size > 52428800) return "La taille du fichier ne doit pas dépasser 50MB";
                  return true;
                }
              }
            } : {})}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Image principale *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Formats supportés: JPEG, PNG, WebP, GIF. Taille maximum: 50MB
                </div>
                {existingImageUrl && (
                  <div className="text-sm text-muted-foreground">
                    <span>Image actuelle: </span>
                    <a href={existingImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Voir l'image
                    </a>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Miniature (Optionnel)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Si non fournie, l'image principale sera utilisée comme miniature
                </div>
                {existingThumbnailUrl && (
                  <div className="text-sm text-muted-foreground">
                    <span>Miniature actuelle: </span>
                    <a href={existingThumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Voir la miniature
                    </a>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};