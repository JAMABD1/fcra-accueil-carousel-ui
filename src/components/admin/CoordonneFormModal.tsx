import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createRecord, updateRecord, getTags } from "@/lib/db/queries";
import { coordonnes } from "@/lib/db/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Coordonne } from "./CoordonnesManager";
import { Save, X, MapPin } from "lucide-react";

interface CoordonneFormData {
  phone: string;
  email: string;
  address: string;
  tagsId: string;
  googleMapUrl: string;
  sortOrder: number;
  active: boolean;
}

interface CoordonneFormModalProps {
  coordonne?: Coordonne | null;
  onClose: () => void;
}

const CoordonneFormModal = ({ coordonne, onClose }: CoordonneFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!coordonne;

  const form = useForm<CoordonneFormData>({
    defaultValues: {
      phone: "",
      email: "",
      address: "",
      tags_id: "none",
      google_map_url: "",
      sort_order: 0,
      active: true,
    },
  });

  // Fetch tags for selection
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (coordonne) {
      form.reset({
        phone: coordonne.phone || "",
        email: coordonne.email || "",
        address: coordonne.address || "",
        tags_id: coordonne.tagsId || "none",
        google_map_url: coordonne.googleMapUrl || "",
        sort_order: coordonne.sortOrder || 0,
        active: coordonne.active || false,
      });
    }
  }, [coordonne, form]);

  // Create/Update coordonne mutation
  const saveCoordonneeMutation = useMutation({
    mutationFn: async (data: CoordonneFormData) => {
      const coordonneData = {
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        tags_id: data.tags_id === "none" ? null : data.tags_id,
        google_map_url: data.google_map_url || null,
        sort_order: data.sort_order,
        active: data.active,
      };

      const coordonneDataFormatted = {
        phone: coordonneData.phone,
        email: coordonneData.email,
        address: coordonneData.address,
        tagsId: coordonneData.tags_id,
        googleMapUrl: coordonneData.google_map_url,
        sortOrder: coordonneData.sort_order,
        active: coordonneData.active,
      };

      if (isEditing && coordonne) {
        await updateRecord(coordonnes, coordonne.id, coordonneDataFormatted);
      } else {
        await createRecord(coordonnes, coordonneDataFormatted);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordonnes'] });
      toast({
        title: isEditing ? "Coordonnée modifiée" : "Coordonnée créée",
        description: `La coordonnée a été ${isEditing ? 'modifiée' : 'créée'} avec succès.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} la coordonnée.`,
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const onSubmit = (data: CoordonneFormData) => {
    // Email validation
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      toast({
        title: "Erreur de validation",
        description: "L'adresse email n'est pas valide.",
        variant: "destructive",
      });
      return;
    }

    // Google Maps URL validation
    if (data.google_map_url && !data.google_map_url.includes('maps.google.com')) {
      toast({
        title: "Erreur de validation",
        description: "L'URL Google Maps n'est pas valide. Utilisez une URL depuis Google Maps.",
        variant: "destructive",
      });
      return;
    }

    saveCoordonneeMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Modifier Coordonnée" : "Nouvelle Coordonnée"}
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
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            placeholder="contact@fcra.mg"
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
                            placeholder="Lot 123 Antananarivo 101, Madagascar"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Localisation et catégorie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Maps URL */}
                  <FormField
                    control={form.control}
                    name="google_map_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Google Maps</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://maps.google.com/maps?q=..."
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Copiez l'URL d'intégration depuis Google Maps
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tag Selection */}
                  <FormField
                    control={form.control}
                    name="tags_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucune catégorie</SelectItem>
                            {tags.map((tag) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                <div className="flex items-center space-x-2">
                                  {tag.color && (
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: tag.color }}
                                    />
                                  )}
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
                            Activer ou désactiver cette coordonnée
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saveCoordonneeMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saveCoordonneeMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saveCoordonneeMutation.isPending ? (
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

export default CoordonneFormModal; 