import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { School } from "./SchoolsManager";
import { Save, X, GraduationCap, Upload, Image as ImageIcon } from "lucide-react";

interface SchoolFormData {
  name: string;
  description: string;
  type: string;
  image_url: string;
  tagname: string;
  hero_id: string;
  subtitle: string;
  coordonne_id: string;
}

interface SchoolFormModalProps {
  school?: School | null;
  onClose: () => void;
}

const SchoolFormModal = ({ school, onClose }: SchoolFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  
  const form = useForm<SchoolFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "primaire",
      image_url: "",
      tagname: "",
      hero_id: "none",
      subtitle: "",
      coordonne_id: "none",
    },
  });

  // Fetch heroes for dropdown
  const { data: heroes = [] } = useQuery({
    queryKey: ['heroes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero')
        .select('id, title, image_url')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch coordonnes for dropdown
  const { data: coordonnes = [] } = useQuery({
    queryKey: ['coordonnes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordonnes')
        .select('id, phone, email, address')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploadError("");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `school-${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', fileName, 'to bucket: schools');
      
      const { data, error } = await supabase.storage
        .from('schools')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        let errorMsg = `Erreur d'upload: ${error.message}`;
        
        // Provide more specific error messages
        if (error.message?.includes('bucket')) {
          errorMsg = 'Le bucket de stockage "schools" n\'existe pas ou n\'est pas accessible';
        } else if (error.message?.includes('size')) {
          errorMsg = 'Le fichier est trop volumineux (maximum 50MB)';
        } else if (error.message?.includes('type')) {
          errorMsg = 'Type de fichier non supporté (uniquement JPEG, PNG, WebP, GIF)';
        }
        
        setUploadError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('schools')
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

  const mutation = useMutation({
    mutationFn: async (data: SchoolFormData) => {
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

      const schoolData = {
        name: data.name,
        description: data.description || null,
        type: data.type,
        image_url: imageUrl || null,
        tagname: data.tagname || null,
        hero_id: data.hero_id === "none" ? null : data.hero_id,
        subtitle: data.subtitle || null,
        coordonne_id: data.coordonne_id === "none" ? null : data.coordonne_id,
      };
      
      if (school) {
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', school.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schools')
          .insert([schoolData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-admin'] });
      toast({
        title: school ? "École mise à jour" : "École créée",
        description: school ? "L'école a été mise à jour avec succès." : "L'école a été créée avec succès.",
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Error saving school:', error);
      
      // Provide more specific error messages
      let errorMessage = "Une erreur est survenue lors de la sauvegarde.";
      
      if (error.message?.includes('upload')) {
        errorMessage = "Erreur lors de l'upload de l'image. Veuillez réessayer ou utiliser une URL d'image.";
      } else if (error.message?.includes('bucket')) {
        errorMessage = "Problème de configuration du stockage. Veuillez contacter l'administrateur.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name || "",
        description: school.description || "",
        type: school.type || "primaire",
        image_url: school.image_url || "",
        tagname: school.tagname || "",
        hero_id: school.hero_id || "none",
        subtitle: school.subtitle || "",
        coordonne_id: school.coordonne_id || "none",
      });
      setImagePreview(school.image_url || "");
    }
  }, [school, form]);

  const onSubmit = (data: SchoolFormData) => {
    mutation.mutate(data);
  };

  const schoolTypes = [
    { value: "primaire", label: "Primaire" },
    { value: "secondaire", label: "Secondaire" },
    { value: "technique", label: "Technique" },
    { value: "professionnel", label: "Professionnel" },
    { value: "polyvalente", label: "Polyvalente" },
    { value: "rurale", label: "Rurale" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">
                  {school ? 'Modifier l\'école' : 'Ajouter une école'}
                </CardTitle>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Nom de l'école *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nom de l'école" className="focus:ring-green-500 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Type d'école *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schoolTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Sous-titre</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sous-titre" className="focus:ring-green-500 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Tag</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tag de catégorie" className="focus:ring-green-500 focus:border-green-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Description de l'école" rows={3} className="focus:ring-green-500 focus:border-green-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <FormLabel className="text-green-700">Image de l'école</FormLabel>
                  
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      variant={uploadMode === "url" ? "default" : "outline"}
                      onClick={() => setUploadMode("url")}
                      className={uploadMode === "url" ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50"}
                    >
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === "upload" ? "default" : "outline"}
                      onClick={() => setUploadMode("upload")}
                      className={uploadMode === "upload" ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50"}
                    >
                      Upload
                    </Button>
                  </div>

                  {/* Upload Error Display */}
                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="text-red-600 text-sm">
                          <strong>Erreur d'upload:</strong> {uploadError}
                        </div>
                      </div>
                      {uploadMode === "upload" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={switchToUrlMode}
                          className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Utiliser URL à la place
                        </Button>
                      )}
                    </div>
                  )}

                  {uploadMode === "url" ? (
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="https://exemple.com/image.jpg" 
                              className="focus:ring-green-500 focus:border-green-500"
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                                setUploadError(""); // Clear upload errors when switching to URL
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="focus:ring-green-500 focus:border-green-500"
                      />
                      {!imageFile && !uploadError && (
                        <div className="flex items-center gap-2 p-4 border-2 border-dashed border-green-300 rounded-lg text-center">
                          <Upload className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 text-sm">Choisir une image</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && !uploadError && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Aperçu de l'image</span>
                      </div>
                      <div className="w-full h-48 bg-green-50 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          onError={() => {
                            setImagePreview("");
                            if (uploadMode === "url") {
                              setUploadError("URL d'image invalide");
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hero_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Hero associé</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                              <SelectValue placeholder="Sélectionner un hero" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucun hero</SelectItem>
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

                  <FormField
                    control={form.control}
                    name="coordonne_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">Coordonnées associées</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                              <SelectValue placeholder="Sélectionner des coordonnées" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Aucune coordonnée</SelectItem>
                            {coordonnes.map((coord) => (
                              <SelectItem key={coord.id} value={coord.id}>
                                {coord.phone || coord.email || coord.address || coord.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending || isUploading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {mutation.isPending || isUploading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolFormModal; 