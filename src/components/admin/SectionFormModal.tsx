import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Section } from "./SectionsManager";
import { Save, X, Layers } from "lucide-react";
import SectionImageUpload from "./SectionImageUpload";

interface SectionFormData {
  title: string;
  subtitle: string;
  description: string;
  image: FileList | null;
  hero_id: string;
  tag_name: string;
  sort_order: number;
  active: boolean;
}

interface SectionFormModalProps {
  section?: Section | null;
  onClose: () => void;
}

const SectionFormModal = ({ section, onClose }: SectionFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!section;

  // States for multiple selection
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<SectionFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      image: null,
      hero_id: "none",
      tag_name: "none",
      sort_order: 0,
      active: true,
    },
  });

  // Fetch heroes for selection
  const { data: heroes = [] } = useQuery({
    queryKey: ['heroes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero')
        .select('id, title')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch tags from database
  const { data: tags = [] } = useQuery({
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

  // Set form values when editing
  useEffect(() => {
    if (section) {
      form.reset({
        title: section.title,
        subtitle: section.subtitle || "",
        description: section.description || "",
        image: null,
        hero_id: section.hero_id || "none",
        tag_name: section.tag_name || "none",
        sort_order: section.sort_order || 0,
        active: section.active || false,
      });
      
      // Set selected heroes and tags from arrays
      setSelectedHeroes(section.hero_ids || []);
      setSelectedTags(section.tag_ids || []);
    }
  }, [section, form]);

  // Handle hero selection
  const handleHeroToggle = (heroId: string) => {
    setSelectedHeroes(prev => 
      prev.includes(heroId) 
        ? prev.filter(id => id !== heroId)
        : [...prev, heroId]
    );
  };

  // Handle tag selection
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Create/Update section mutation
  const saveSectionMutation = useMutation({
    mutationFn: async (data: SectionFormData) => {
      let imageUrl = "";
      
      // Upload image if provided
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('sections')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('sections')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (isEditing && section) {
        // Keep existing image when editing
        imageUrl = section.image_url;
      }

      const sectionData = {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        image_url: imageUrl,
        hero_id: data.hero_id === "none" ? null : data.hero_id,
        hero_ids: selectedHeroes,
        tag_name: data.tag_name === "none" ? null : data.tag_name,
        tag_ids: selectedTags,
        sort_order: data.sort_order,
        active: data.active,
      };

      if (isEditing && section) {
        const { error } = await supabase
          .from('sections')
          .update(sectionData)
          .eq('id', section.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sections')
          .insert([sectionData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast({
        title: isEditing ? "Section modifiée" : "Section créée",
        description: `La section a été ${isEditing ? 'modifiée' : 'créée'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} la section.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: SectionFormData) => {
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

    saveSectionMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier Section" : "Nouvelle Section"}
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
                        placeholder="Étudiants Universitaires"
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
                      <Input
                        placeholder="Soutien académique"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Accompagnement et soutien des étudiants dans leur parcours académique..."
                        {...field}
                        className="w-full"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heroes Selection */}
              <div className="space-y-4">
                <div>
                  <FormLabel>Heroes (sélection multiple)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {heroes.map((hero) => (
                      <div key={hero.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`hero-${hero.id}`}
                          checked={selectedHeroes.includes(hero.id)}
                          onCheckedChange={() => handleHeroToggle(hero.id)}
                        />
                        <label 
                          htmlFor={`hero-${hero.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {hero.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedHeroes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedHeroes.map((heroId) => {
                        const hero = heroes.find(h => h.id === heroId);
                        return hero ? (
                          <Badge key={heroId} variant="secondary">
                            {hero.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Tags Selection */}
                <div>
                  <FormLabel>Tags (sélection multiple)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagToggle(tag.id)}
                        />
                        <label 
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge 
                            key={tagId} 
                            variant="outline"
                            style={{ 
                              borderColor: tag.color,
                              color: tag.color,
                              backgroundColor: `${tag.color}10`
                            }}
                          >
                            {tag.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Sort Order */}
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
              </div>

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher cette section sur le site
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
                    <FormLabel>Image de la section *</FormLabel>
                    <FormControl>
                      <SectionImageUpload
                        onChange={field.onChange}
                        existingImage={section?.image_url}
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
              disabled={saveSectionMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveSectionMutation.isPending ? (
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

export default SectionFormModal; 