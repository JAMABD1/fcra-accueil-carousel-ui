
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Article } from "./ArticlesManager";

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  tags: string;
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
      image_url: "",
      author: "",
      tags: "",
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
        image_url: article.image_url || "",
        author: article.author || "",
        tags: article.tags?.join(", ") || "",
        featured: article.featured || false,
        status: article.status || "draft",
      });
    }
  }, [article, form]);

  // Create/Update article mutation
  const saveArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const articleData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        image_url: data.image_url || null,
        author: data.author || null,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
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
            control={form.control}
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
          control={form.control}
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
          control={form.control}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Tag1, Tag2, Tag3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Article en vedette</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Mettre cet article en avant
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
