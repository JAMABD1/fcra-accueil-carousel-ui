import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecord, updateRecord, getTags } from "@/lib/db/queries";
import { partners } from "@/lib/db/schema";
import { uploadImage } from "@/lib/storage/r2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import type { Partner } from "./PartnersManager";

const partnerSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, "L'image est requise"),
  website_url: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  sort_order: z.number().min(0, "L'ordre doit être positif"),
  active: z.boolean(),
  tag_ids: z.array(z.string()).optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerFormModalProps {
  partner: Partner | null;
  isOpen: boolean;
  onClose: () => void;
}

const PartnerFormModal = ({ partner, isOpen, onClose }: PartnerFormModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      website_url: "",
      contact_email: "",
      contact_phone: "",
      sort_order: 0,
      active: true,
      tag_ids: [],
    },
  });

  // Update form when partner changes
  useEffect(() => {
    if (partner) {
      form.reset({
        title: partner.title,
        subtitle: partner.subtitle || "",
        description: partner.description || "",
        image_url: partner.imageUrl,
        website_url: partner.websiteUrl || "",
        contact_email: partner.contactEmail || "",
        contact_phone: partner.contactPhone || "",
        sort_order: partner.sortOrder || 0,
        active: partner.active || true,
        tag_ids: partner.tagIds || [],
      });
      setSelectedTags(partner.tagIds || []);
    } else {
      form.reset({
        title: "",
        subtitle: "",
        description: "",
        image_url: "",
        website_url: "",
        contact_email: "",
        contact_phone: "",
        sort_order: 0,
        active: true,
        tag_ids: [],
      });
      setSelectedTags([]);
    }
  }, [partner, form]);

  // Create/Update partner mutation
  const partnerMutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      const partnerData = {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        imageUrl: data.image_url || null,
        websiteUrl: data.website_url || null,
        contactEmail: data.contact_email || null,
        contactPhone: data.contact_phone || null,
        sortOrder: data.sort_order,
        active: data.active,
        tagIds: selectedTags,
      };

      if (partner) {
        await updateRecord(partners, partner.id, partnerData);
      } else {
        await createRecord(partners, partnerData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: partner ? "Partenaire mis à jour" : "Partenaire créé",
        description: partner 
          ? "Le partenaire a été mis à jour avec succès."
          : "Le partenaire a été créé avec succès.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le partenaire.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerFormData) => {
    partnerMutation.mutate(data);
  };

  // Image upload function
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const result = await uploadImage(file, 'partners', 'partner');
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      form.setValue('image_url', result.url!);
      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader l'image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {partner ? "Modifier le partenaire" : "Ajouter un partenaire"}
          </DialogTitle>
          <DialogDescription>
            {partner 
              ? "Modifiez les informations du partenaire"
              : "Ajoutez un nouveau partenaire à FCRA"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du partenaire *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du partenaire" {...field} />
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
                        <Input placeholder="Sous-titre (optionnel)" {...field} />
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
                          placeholder="Description du partenaire (optionnel)"
                          className="min-h-[100px]"
                          {...field} 
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
                <CardTitle>Image du partenaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image *</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {uploading ? "Upload en cours..." : "Uploader une image"}
                            </Button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                          
                          {field.value && (
                            <div className="relative inline-block">
                              <img 
                                src={field.value} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                onClick={() => field.onChange("")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          
                          <Input {...field} placeholder="URL de l'image" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="+261 34 12 345 67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      style={selectedTags.includes(tag.id) ? {
                        backgroundColor: tag.color,
                        borderColor: tag.color,
                        color: 'white'
                      } : {
                        borderColor: tag.color,
                        color: tag.color,
                        backgroundColor: `${tag.color}10`
                      }}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Actif</FormLabel>
                        <FormDescription>
                          Ce partenaire sera visible sur le site
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={partnerMutation.isPending}>
                {partnerMutation.isPending ? "Sauvegarde..." : (partner ? "Mettre à jour" : "Créer")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerFormModal; 