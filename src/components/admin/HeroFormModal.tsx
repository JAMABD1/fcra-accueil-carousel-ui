import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createRecord, updateRecord, getTags } from "@/lib/db/queries";
import * as schema from "@/lib/db/schema";
import { uploadImage } from "@/lib/storage/r2";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Hero } from "./HeroManager";
import { Save, X, Upload, ImageIcon } from "lucide-react";
import HeroImageUpload from "./HeroImageUpload";

interface HeroFormData {
  title: string;
  subtitle: string;
  image: FileList | null;
  tag_ids: string[];
  sort_order: number;
  active: boolean;
}

interface HeroFormModalProps {
  hero?: Hero | null;
  onClose: () => void;
}

const HeroFormModal = ({ hero, onClose }: HeroFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!hero;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<HeroFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
      tag_ids: [],
      sort_order: 0,
      active: true,
    },
  });

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (hero) {
      let tagIds: string[] = [];
      
      // Handle both JSON string and array formats
      if (hero.tagIds) {
        if (typeof hero.tagIds === 'string') {
          try {
            tagIds = JSON.parse(hero.tagIds);
          } catch (e) {
            console.error('Error parsing hero tagIds:', e);
            tagIds = [];
          }
        } else if (Array.isArray(hero.tagIds)) {
          tagIds = hero.tagIds;
        }
      }
      
      setSelectedTags(tagIds);
      form.reset({
        title: hero.title,
        subtitle: hero.subtitle || "",
        image: null,
        tag_ids: tagIds,
        sort_order: hero.sortOrder || 0,
        active: hero.active ?? true,
      });
    } else {
      setSelectedTags([]);
      form.reset({
        title: "",
        subtitle: "",
        image: null,
        tag_ids: [],
        sort_order: 0,
        active: true,
      });
    }
  }, [hero, form]);

  // Create/Update hero mutation
  const saveHeroMutation = useMutation({
    mutationFn: async (data: HeroFormData) => {
      let imageUrl = "";
      
      // Upload image if provided
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const result = await uploadImage(file, 'hero', 'hero');
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }
        imageUrl = result.url!;
      } else if (isEditing && hero) {
        // Keep existing image when editing
        imageUrl = hero.imageUrl;
      }

      const heroData = {
        title: data.title,
        subtitle: data.subtitle || null,
        imageUrl: imageUrl,
        tagIds: data.tag_ids,
        sortOrder: data.sort_order,
        active: data.active,
      };

      if (isEditing && hero) {
        await updateRecord(schema.hero, hero.id, heroData);
      } else {
        await createRecord(schema.hero, heroData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
      toast({
        title: isEditing ? "Hero modifié" : "Hero créé",
        description: `L'élément hero a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} l'élément hero.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: HeroFormData) => {
    // Basic validation
    if (!data.title.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le titre est requis.",
        variant: "destructive",
      });
      return;
    }

    if (!data.image && !isEditing) {
      toast({
        title: "Erreur de validation",
        description: "Une image est requise.",
        variant: "destructive",
      });
      return;
    }

    saveHeroMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier Hero" : "Nouveau Hero"}
            </h2>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onClose}
          className="flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Fermer</span>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Titre du hero"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sous-titre</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Sous-titre du hero"
                        {...field}
                        className="w-full"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="tag_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sélectionnez les tags</FormLabel>
                    {tagsLoading && (
                      <div className="text-sm text-gray-500">Chargement des tags...</div>
                    )}
                    {tagsError && (
                      <div className="text-sm text-red-500">
                        Erreur lors du chargement des tags: {tagsError.message}
                      </div>
                    )}
                    {tags.length === 0 && !tagsLoading && (
                      <div className="text-sm text-gray-500">
                        Aucun tag disponible. Créez des tags d'abord dans la section Tags.
                      </div>
                    )}
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={(checked) => {
                              let newSelectedTags;
                              if (checked) {
                                newSelectedTags = [...selectedTags, tag.id];
                              } else {
                                newSelectedTags = selectedTags.filter(id => id !== tag.id);
                              }
                              setSelectedTags(newSelectedTags);
                              field.onChange(newSelectedTags);
                            }}
                          />
                          <label
                            htmlFor={`tag-${tag.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <Badge style={{ backgroundColor: tag.color }}>
                              {tag.name}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Tags sélectionnés :</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                              <Badge key={tagId} style={{ backgroundColor: tag.color }}>
                                {tag.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d'affichage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Actif</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher cet élément hero sur le site
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du hero *</FormLabel>
                    <FormControl>
                      <HeroImageUpload
                        onChange={field.onChange}
                    existingImage={hero?.imageUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={saveHeroMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveHeroMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enregistrement...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isEditing ? "Modifier" : "Créer"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HeroFormModal; 