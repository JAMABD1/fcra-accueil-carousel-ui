import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Article } from "./ArticlesManager";
import { Eye, Save, X, Upload, FileText, Settings, Tags, Image as ImageIcon } from "lucide-react";
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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

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
      // Set existing images for preview
      if (article.images && article.images.length > 0) {
        setPreviewImages(article.images);
      }
    }
  }, [article, form]);

  // Handle image preview
  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewImages(imageUrls);
    } else if (!isEditing) {
      setPreviewImages([]);
    }
  };

  // Fetch tags for mapping IDs to names
  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, color')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

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

      // Save tag IDs, not names
      const articleData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        images: imageUrls,
        author: data.author || null,
        tags: data.tags, // should be array of IDs
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
    // Basic validation
    if (!data.title.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le titre est requis.",
        variant: "destructive",
      });
      setActiveTab("basic");
      return;
    }

    if (!data.content.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le contenu est requis.",
        variant: "destructive",
      });
      setActiveTab("basic");
      return;
    }

    saveArticleMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Publié', variant: 'default' as const },
      draft: { label: 'Brouillon', variant: 'secondary' as const },
      archived: { label: 'Archivé', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Modifier l\'article' : 'Créer un nouvel article'}
            </h2>
          </div>
          {isEditing && form.watch('status') && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Statut:</span>
              {getStatusBadge(form.watch('status'))}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Contenu</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="tags" className="flex items-center space-x-2">
                <Tags className="w-4 h-4" />
                <span>Tags</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de base</CardTitle>
                </CardHeader>
                <CardContent>
                  <ArticleBasicFields control={form.control} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gestion des images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images de l'article</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                                </div>
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => {
                                    field.onChange(e.target.files);
                                    handleImageChange(e.target.files);
                                  }}
                                />
                              </label>
                            </div>
                            
                            {/* Image Preview */}
                            {previewImages.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Aperçu des images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {previewImages.map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={imageUrl}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags et catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <TagSelector
                            control={form.control}
                            name="tags"
                            label="Tags"
                            // Only pass tag IDs to the field
                            selectedTags={field.value}
                            onTagsChange={field.onChange}
                            idMode // <-- add a prop to TagSelector to use IDs
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de publication</CardTitle>
                </CardHeader>
                <CardContent>
                  <ArticleSettings control={form.control} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center space-x-2">
              {form.watch('title') && (
                <Badge variant="outline">
                  {form.watch('title').length} caractères
                </Badge>
              )}
              {form.watch('tags') && form.watch('tags').length > 0 && (
                <Badge variant="outline">
                  {form.watch('tags').length} tag{form.watch('tags').length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={saveArticleMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveArticleMutation.isPending 
                  ? (isEditing ? "Modification..." : "Création...") 
                  : (isEditing ? "Modifier" : "Créer")
                }
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleFormModal;
