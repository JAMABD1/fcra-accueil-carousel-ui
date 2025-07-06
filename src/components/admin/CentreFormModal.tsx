import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Centre } from "./CentresManager";
import { Save, X, Building } from "lucide-react";

interface CentreFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hero_id: string;
  video_id: string;
  sort_order: number;
  active: boolean;
}

interface CentreFormModalProps {
  centre?: Centre | null;
  onClose: () => void;
}

const CentreFormModal = ({ centre, onClose }: CentreFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!centre;

  const form = useForm<CentreFormData>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      hero_id: "none",
      video_id: "none",
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

  // Fetch videos for selection
  const { data: videos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, video_type')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (centre) {
      form.reset({
        name: centre.name,
        description: centre.description || "",
        address: centre.address || "",
        phone: centre.phone || "",
        email: centre.email || "",
        hero_id: centre.hero_id || "none",
        video_id: centre.video_id || "none",
        sort_order: centre.sort_order || 0,
        active: centre.active || false,
      });
    }
  }, [centre, form]);

  // Create/Update centre mutation
  const saveCentreMutation = useMutation({
    mutationFn: async (data: CentreFormData) => {
      const centreData = {
        name: data.name,
        description: data.description || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        hero_id: data.hero_id === "none" ? null : data.hero_id,
        video_id: data.video_id === "none" ? null : data.video_id,
        sort_order: data.sort_order,
        active: data.active,
      };

      if (isEditing && centre) {
        const { error } = await supabase
          .from('centres')
          .update(centreData)
          .eq('id', centre.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('centres')
          .insert([centreData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      toast({
        title: isEditing ? "Centre modifié" : "Centre créé",
        description: `Le centre a été ${isEditing ? 'modifié' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} le centre.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: CentreFormData) => {
    // Basic validation
    if (!data.name.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom est requis.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      toast({
        title: "Erreur de validation",
        description: "L'adresse email n'est pas valide.",
        variant: "destructive",
      });
      return;
    }

    saveCentreMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Modifier Centre" : "Nouveau Centre"}
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
                        <FormLabel>Nom du centre *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Centre Principal Antananarivo" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description du centre et de ses activités"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Adresse complète du centre"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+261 20 22 123 45" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="centre@fcra.mg" 
                            {...field} 
                          />
                        </FormControl>
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

              {/* Relationships */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hero Selection */}
                  <FormField
                    control={form.control}
                    name="hero_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image héro</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une image héro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {heroes.map((hero) => (
                              <SelectItem key={hero.id} value={hero.id}>
                                {hero.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Video Selection */}
                  <FormField
                    control={form.control}
                    name="video_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vidéo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une vidéo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {videos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.title} ({video.video_type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  {/* Sort Order */}
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordre de tri</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Active Status */}
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Actif
                          </FormLabel>
                          <FormDescription>
                            Activer ou désactiver ce centre
                          </FormDescription>
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
                  disabled={saveCentreMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saveCentreMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saveCentreMutation.isPending ? (
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

export default CentreFormModal; 