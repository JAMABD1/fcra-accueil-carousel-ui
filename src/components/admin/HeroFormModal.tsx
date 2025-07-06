import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Hero } from "./HeroManager";
import { Save, X, Upload, ImageIcon } from "lucide-react";
import HeroImageUpload from "./HeroImageUpload";

interface HeroFormData {
  title: string;
  subtitle: string;
  image: FileList | null;
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

  const form = useForm<HeroFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
      sort_order: 0,
      active: true,
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (hero) {
      form.reset({
        title: hero.title,
        subtitle: hero.subtitle || "",
        image: null,
        sort_order: hero.sort_order || 0,
        active: hero.active || false,
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
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('hero')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hero')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (isEditing && hero) {
        // Keep existing image when editing
        imageUrl = hero.image_url;
      }

      const heroData = {
        title: data.title,
        subtitle: data.subtitle || null,
        image_url: imageUrl,
        sort_order: data.sort_order,
        active: data.active,
      };

      if (isEditing && hero) {
        const { error } = await supabase
          .from('hero')
          .update(heroData)
          .eq('id', hero.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero')
          .insert([heroData]);
        
        if (error) throw error;
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
                        existingImage={hero?.image_url}
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