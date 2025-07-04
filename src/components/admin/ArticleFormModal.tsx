import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Article } from "./ArticlesManager";
import TagSelector from "./TagSelector";
import ArticleBasicFields from "./ArticleBasicFields";
import ArticleImageUpload from "./ArticleImageUpload";
import ArticleSettings from "./ArticleSettings";

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

interface ArticleFormModalProps {
  article?: Article | null;
  onClose: () => void;
}

const ArticleFormModal = ({ article, onClose }: ArticleFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!article;

  const form = useForm<ArticleFormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      images: null,
      author: "",
      tags: [],
      featured: false,
      status: "draft",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || "",
        images: null,
        author: article.author || "",
        tags: article.tags || [],
        featured: article.featured || false,
        status: article.status || "draft",
      });
    }
  }, [article, form]);

  // Create/Update article mutation
  const saveArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      let imageUrls: string[] = [];
      
      // Upload images if provided
      if (data.images && data.images.length > 0) {
        const uploadPromises = Array.from(data.images).map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('article-images')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      } else if (isEditing && article) {
        // Keep existing images when editing
        imageUrls = article.images || [];
      }

      const articleData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        images: imageUrls,
        author: data.author || null,
        tags: data.tags,
        featured: data.featured,
        status: data.status,
      };

      if (isEditing && article) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: isEditing ? "Article modifié" : "Article créé",
        description: `L'article a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} l'article.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: ArticleFormData) => {
    saveArticleMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ArticleBasicFields control={form.control} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArticleImageUpload control={form.control} />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagSelector 
                    selectedTags={field.value} 
                    onTagsChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ArticleSettings control={form.control} />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={saveArticleMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {saveArticleMutation.isPending 
              ? (isEditing ? "Modification..." : "Création...") 
              : (isEditing ? "Modifier" : "Créer")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleFormModal;
