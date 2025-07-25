import { useEffect, useState } from "react";
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
import { Save, X, Building, Upload, Image as ImageIcon } from "lucide-react";

interface CentreFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image_url: string;
  tag_id: string;
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

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const form = useForm<CentreFormData>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      image_url: "",
      tag_id: "none",
      video_id: "none",
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
        .select('id, name, color')
        .order('name');
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
        image_url: centre.image_url || "",
        tag_id: centre.tag_id !== null && centre.tag_id !== undefined ? centre.tag_id : "none",
        video_id: centre.video_id !== null && centre.video_id !== undefined ? centre.video_id : "none",
        sort_order: centre.sort_order || 0,
        active: centre.active || false,
      });
      setImagePreview(centre.image_url || "");
    }
  }, [centre, form]);

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploadError("");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `centre-${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', fileName, 'to bucket: centres');
      
      const { data, error } = await supabase.storage
        .from('centres')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        let errorMsg = `Erreur d'upload: ${error.message}`;
        
        // Provide more specific error messages
        if (error.message?.includes('bucket')) {
          errorMsg = 'Le bucket de stockage "centres" n\'existe pas ou n\'est pas accessible';
        } else if (error.message?.includes('size')) {
          errorMsg = 'Le fichier est trop volumineux (maximum 10MB)';
        } else if (error.message?.includes('type')) {
          errorMsg = 'Type de fichier non supporté (uniquement JPEG, PNG, WebP, GIF)';
        }
        
        setUploadError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('centres')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);
      setUploadError(""); // Clear any previous errors
      return publicUrl;
    } catch (error) {
      console.error('Upload function error:', error);
      const errorMsg = `Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
      setUploadError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadError(""); // Clear any previous errors
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch back to URL mode when upload fails
  const switchToUrlMode = () => {
    setUploadMode("url");
    setImageFile(null);
    setUploadError("");
    if (imagePreview && !imagePreview.startsWith('data:')) {
      form.setValue("image_url", imagePreview);
    }
  };

  // Create/Update centre mutation
  const saveCentreMutation = useMutation({
    mutationFn: async (data: CentreFormData) => {
      let imageUrl = data.image_url;
      
      // Upload image if file is selected
      if (imageFile && uploadMode === "upload") {
        setIsUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          console.error('Image upload failed:', error);
          throw new Error(`Erreur d'upload d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
          setIsUploading(false);
        }
      }

      const centreData = {
        name: data.name,
        description: data.description || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        image_url: imageUrl || null,
        tag_id: data.tag_id === "none" ? null : data.tag_id,
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

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Image du centre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Mode Toggle */}
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={uploadMode === "url" ? "default" : "outline"}
                      onClick={() => setUploadMode("url")}
                      className="flex items-center space-x-2"
                    >
                      <span>URL</span>
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === "upload" ? "default" : "outline"}
                      onClick={() => setUploadMode("upload")}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  </div>

                  {/* URL Input */}
                  {uploadMode === "url" && (
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de l'image</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* File Upload */}
                  {uploadMode === "upload" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sélectionner une image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>

                      {uploadError && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                          {uploadError}
                          <Button
                            type="button"
                            variant="link"
                            onClick={switchToUrlMode}
                            className="p-0 h-auto ml-2 text-red-600"
                          >
                            Utiliser URL à la place
                          </Button>
                        </div>
                      )}

                      {isUploading && (
                        <div className="text-blue-600 text-sm">
                          Upload en cours...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Aperçu
                      </label>
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Aperçu" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Relationships */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tag Selection */}
                  <FormField
                    control={form.control}
                    name="tag_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {tags.map((tag) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                <span style={{ color: tag.color }}>{tag.name}</span>
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
                          value={field.value}
                          onValueChange={field.onChange}
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