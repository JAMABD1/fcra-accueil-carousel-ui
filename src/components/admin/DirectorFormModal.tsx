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
import { Director } from "./DirectorsManager";
import { Save, X, Users } from "lucide-react";
import DirectorImageUpload from "./DirectorImageUpload";

interface DirectorFormData {
  name: string;
  job: string;
  responsibility: string;
  image: FileList | null;
  centre_id: string;
  is_director: boolean;
  sort_order: number;
  active: boolean;
}

interface DirectorFormModalProps {
  director?: Director | null;
  onClose: () => void;
}

const DirectorFormModal = ({ director, onClose }: DirectorFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!director;

  const form = useForm<DirectorFormData>({
    defaultValues: {
      name: "",
      job: "",
      responsibility: "",
      image: null,
      centre_id: "none",
      is_director: false,
      sort_order: 0,
      active: true,
    },
  });

  // Fetch centres for selection
  const { data: centres = [] } = useQuery({
    queryKey: ['centres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centres')
        .select('id, name')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (director) {
      form.reset({
        name: director.name,
        job: director.job || "",
        responsibility: director.responsibility || "",
        image: null,
        centre_id: director.centre_id || "none",
        is_director: director.is_director || false,
        sort_order: director.sort_order || 0,
        active: director.active || false,
      });
    }
  }, [director, form]);

  // Create/Update director mutation
  const saveDirectorMutation = useMutation({
    mutationFn: async (data: DirectorFormData) => {
      let imageUrl = "";
      
      // Upload image if provided
      if (data.image && data.image.length > 0) {
        console.log('Uploading director image...');
        const file = data.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('directors')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('directors')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        console.log('Director image uploaded successfully:', imageUrl);
      } else if (isEditing && director) {
        // Keep existing image when editing
        imageUrl = director.image_url || "";
        console.log('Keeping existing director image:', imageUrl);
      }

      const directorData = {
        name: data.name,
        job: data.job || null,
        responsibility: data.responsibility || null,
        image_url: imageUrl || null,
        centre_id: !data.centre_id || data.centre_id === "none" ? null : data.centre_id,
        is_director: data.is_director,
        sort_order: data.sort_order,
        active: data.active,
      };

      console.log('Saving director data:', directorData);

      if (isEditing && director) {
        if (!director.id) {
          throw new Error('Invalid director id for update');
        }
        const { error } = await supabase
          .from('directors')
          .update(directorData)
          .eq('id', director.id);
        
        if (error) {
          console.error('Director update error:', error);
          throw error;
        }
        console.log('Director updated successfully');
      } else {
        const { error } = await supabase
          .from('directors')
          .insert([directorData]);
        
        if (error) {
          console.error('Director insert error:', error);
          throw error;
        }
        console.log('Director created successfully');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directors'] });
      toast({
        title: isEditing ? "Directeur modifié" : "Directeur créé",
        description: `Le directeur a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} le directeur.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: DirectorFormData) => {
    // Basic validation
    if (!data.name.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom est requis.",
        variant: "destructive",
      });
      return;
    }

    saveDirectorMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Modifier Directeur" : "Nouveau Directeur"}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nom et prénom du directeur" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Job */}
                  <FormField
                    control={form.control}
                    name="job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poste/Fonction</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Directeur Général, Directeur Pédagogique..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Responsibility */}
                  <FormField
                    control={form.control}
                    name="responsibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsabilités</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description des responsabilités et missions"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Centre Selection */}
                  <FormField
                    control={form.control}
                    name="centre_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centre assigné</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un centre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucun centre</SelectItem>
                            {centres.map((centre) => (
                              <SelectItem key={centre.id} value={centre.id}>
                                {centre.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Order */}
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Photo du directeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DirectorImageUpload
                            onImageChange={field.onChange}
                            existingImage={director?.image_url}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Is Director */}
                  <FormField
                    control={form.control}
                    name="is_director"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Directeur principal
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Marquer comme directeur principal de l'organisation
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

                  {/* Active */}
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Actif
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Afficher ce directeur publiquement
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

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saveDirectorMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saveDirectorMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saveDirectorMutation.isPending ? (
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
      </div>
    </div>
  );
};

export default DirectorFormModal; 