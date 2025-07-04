
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  images: FileList | null;
  author: string;
  tags: string[];
  featured: boolean;
  status: string;
}

interface ArticleBasicFieldsProps {
  control: Control<ArticleFormData>;
}

const ArticleBasicFields = ({ control }: ArticleBasicFieldsProps) => {
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
                <Input placeholder="Titre de l'article" {...field} />
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
                placeholder="Résumé de l'article"
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
        name="content"
        rules={{ required: "Le contenu est requis" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contenu *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Contenu complet de l'article"
                className="min-h-[200px]"
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

export default ArticleBasicFields;
