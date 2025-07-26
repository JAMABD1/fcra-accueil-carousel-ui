import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, FileText, Upload, Download, Star, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type LibraryItem = Tables<"library">;

interface LibraryFormData {
  title: string;
  description: string;
  category: string;
  author: string;
  featured: boolean;
  status: string;
  tags: string[];
}

const LibraryManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<LibraryFormData>({
    title: "",
    description: "",
    category: "general",
    author: "",
    featured: false,
    status: "draft",
    tags: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { value: "jurisprudence", label: "Jurisprudence (Fiqh)" },
    { value: "sagesse", label: "Sagesse (Hikma)" },
    { value: "theologie", label: "Théologie (Aqida)" },
    { value: "hadith", label: "Hadith" },
    { value: "tafsir", label: "Exégèse (Tafsir)" },
    { value: "histoire", label: "Histoire Islamique" },
    { value: "biographie", label: "Biographies (Sira)" },
    { value: "spiritualite", label: "Spiritualité (Tasawwuf)" },
    { value: "education", label: "Éducation Islamique" },
    { value: "general", label: "Général" }
  ];

  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "published", label: "Publié" },
    { value: "archived", label: "Archivé" }
  ];

  // Fetch library items
  const { data: libraryItems = [], isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LibraryItem[];
    }
  });

  // Delete library item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  });

  // Create/Update library item mutation
  const saveItemMutation = useMutation({
    mutationFn: async (data: { formData: LibraryFormData; file?: File; isUpdate?: boolean; itemId?: string }) => {
      const { formData, file, isUpdate, itemId } = data;

      if (!isUpdate && !file) {
        throw new Error('File is required for new documents');
      }

      let fileUrl = selectedItem?.file_url;
      let fileName = selectedItem?.file_name;
      let fileSize = selectedItem?.file_size;
      let fileType = selectedItem?.file_type;

      // Upload new file if provided
      if (file) {
        const fileNameWithTimestamp = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('library')
          .upload(fileNameWithTimestamp, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('library')
          .getPublicUrl(fileNameWithTimestamp);

        fileUrl = urlData.publicUrl;
        fileName = fileNameWithTimestamp;
        fileSize = file.size;
        fileType = file.type;
      }

      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author: formData.author,
        featured: formData.featured,
        status: formData.status,
        tags: formData.tags,
        file_url: fileUrl!,
        file_name: fileName!,
        file_size: fileSize!,
        file_type: fileType!,
        downloads: selectedItem?.downloads || 0
      };

      if (isUpdate && itemId) {
        const { error } = await supabase
          .from('library')
          .update(itemData)
          .eq('id', itemId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('library')
          .insert(itemData);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      toast({
        title: selectedItem ? "Document modifié" : "Document créé",
        description: selectedItem ? "Le document a été modifié avec succès." : "Le document a été créé avec succès.",
      });
      handleModalClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: selectedItem ? "Impossible de modifier le document." : "Impossible de créer le document.",
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFormChange = (field: keyof LibraryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      await saveItemMutation.mutateAsync({
        formData,
        file: selectedFile,
        isUpdate: !!selectedItem,
        itemId: selectedItem?.id
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleEdit = (item: LibraryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      author: item.author || "",
      featured: item.featured || false,
      status: item.status || "draft",
      tags: item.tags || []
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormData({
      title: "",
      description: "",
      category: "general",
      author: "",
      featured: false,
      status: "draft",
      tags: []
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setFormData({
      title: "",
      description: "",
      category: "general",
      author: "",
      featured: false,
      status: "draft",
      tags: []
    });
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-800' },
      published: { label: 'Publié', className: 'bg-green-100 text-green-800' },
      archived: { label: 'Archivé', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      jurisprudence: "bg-blue-100 text-blue-800",
      sagesse: "bg-green-100 text-green-800",
      theologie: "bg-purple-100 text-purple-800",
      hadith: "bg-indigo-100 text-indigo-800",
      tafsir: "bg-yellow-100 text-yellow-800",
      histoire: "bg-orange-100 text-orange-800",
      biographie: "bg-pink-100 text-pink-800",
      spiritualite: "bg-teal-100 text-teal-800",
      education: "bg-emerald-100 text-emerald-800",
      general: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={categoryColors[category] || categoryColors.general}>
        {categories.find(cat => cat.value === category)?.label || category}
      </Badge>
    );
  };

  const filteredItems = libraryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: libraryItems.length,
    published: libraryItems.filter(item => item.status === 'published').length,
    draft: libraryItems.filter(item => item.status === 'draft').length,
    featured: libraryItems.filter(item => item.featured).length,
    totalDownloads: libraryItems.reduce((sum, item) => sum + (item.downloads || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la Bibliothèque</h1>
          <p className="text-gray-600 mt-2">Gérez tous les documents de la bibliothèque</p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">En vedette</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Download className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Téléchargements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher des documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Library Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16">Type</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Téléchargements</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-gray-500">
                          {searchTerm ? "Aucun document trouvé" : "Aucun document disponible"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {item.title}
                              {item.featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {item.author || 'Non spécifié'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(item.category)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatFileSize(item.file_size)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Download className="w-4 h-4" />
                            {item.downloads || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(item.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Modifier le document' : 'Ajouter un nouveau document'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleFormChange('author', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleFormChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Statut *</Label>
                <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleFormChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                placeholder="guide, etudiant, nouveau"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleFormChange('featured', checked)}
              />
              <Label htmlFor="featured">Mettre en vedette</Label>
            </div>

            {!selectedItem && (
              <div>
                <Label htmlFor="file">Fichier *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                  onChange={handleFileChange}
                  required={!selectedItem}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formats acceptés: PDF, Word, Excel, TXT, ZIP (max 100MB)
                </p>
              </div>
            )}

            {selectedFile && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Fichier sélectionné: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {selectedItem ? 'Modification...' : 'Upload en cours...'}
                  </>
                ) : (
                  <>
                    {selectedItem ? <Edit className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    {selectedItem ? 'Modifier' : 'Créer'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryManager; 