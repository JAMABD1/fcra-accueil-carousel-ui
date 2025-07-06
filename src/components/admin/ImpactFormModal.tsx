import { useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Impact } from "./ImpactManager";
import { Save, X, Hash } from "lucide-react";

interface ImpactFormData {
  number: number;
  title: string;
  subtitle: string;
  tags_id: string;
  sort_order: number;
  active: boolean;
}

interface ImpactFormModalProps {
  impact?: Impact | null;
  onClose: () => void;
}

const ImpactFormModal = ({ impact, onClose }: ImpactFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!impact;

  const form = useForm<ImpactFormData>({
    defaultValues: {
      number: 0,
      title: "",
      subtitle: "",
      tags_id: "none",
      sort_order: 0,
      active: true,
    },
  });

  // Fetch tags for selection
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (impact) {
      form.reset({
        number: impact.number,
        title: impact.title,
        subtitle: impact.subtitle || "",
        tags_id: impact.tags_id || "none",
        sort_order: impact.sort_order || 0,
        active: impact.active || false,
      });
    }
  }, [impact, form]);

  // Create/Update impact mutation
  const saveImpactMutation = useMutation({
    mutationFn: async (data: ImpactFormData) => {
      const impactData = {
        number: data.number,
        title: data.title,
        subtitle: data.subtitle || null,
        tags_id: data.tags_id === "none" ? null : data.tags_id,
        sort_order: data.sort_order,
        active: data.active,
      };

      if (isEditing && impact) {
        const { error } = await supabase
          .from('impact')
          .update(impactData)
          .eq('id', impact.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('impact')
          .insert([impactData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impacts'] });
      toast({
        title: isEditing ? "Impact modifié" : "Impact créé",
        description: `L'élément impact a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} l'élément impact.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: ImpactFormData) => {
    // Basic validation
    if (!data.title.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le titre est requis.",
        variant: "destructive",
      });
      return;
    }

    if (!data.number || data.number <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Le chiffre doit être un nombre positif.",
        variant: "destructive",
      });
      return;
    }

    saveImpactMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier Impact" : "Nouvel Impact"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiffre *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="300"
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
                      <Textarea
                        placeholder="Enfants universitaires par an"
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
                name="tags_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucun tag</SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span>{tag.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        Afficher cet élément impact sur le site
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
              disabled={saveImpactMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveImpactMutation.isPending ? (
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

export default ImpactFormModal; 