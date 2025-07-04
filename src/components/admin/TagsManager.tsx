import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Edit, Trash2, Search, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface TagFormData {
  name: string;
  color: string;
}

const TagsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TagFormData>({
    defaultValues: {
      name: "",
      color: "#3B82F6",
    },
  });

  // Fetch tags
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Tag[];
    }
  });

  // Create/Update tag mutation
  const saveTagMutation = useMutation({
    mutationFn: async (data: TagFormData) => {
      if (selectedTag) {
        const { error } = await supabase
          .from('tags')
          .update({ name: data.name, color: data.color })
          .eq('id', selectedTag.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([{ name: data.name, color: data.color }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: selectedTag ? "Tag modifié" : "Tag créé",
        description: "Le tag a été sauvegardé avec succès.",
      });
      handleModalClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le tag.",
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: "Tag supprimé",
        description: "Le tag a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tag.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  });

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    form.reset({ name: tag.name, color: tag.color });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      deleteTagMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
    form.reset({ name: "", color: "#3B82F6" });
  };

  const onSubmit = (data: TagFormData) => {
    saveTagMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Gestion des Tags
            </CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedTag(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedTag ? 'Modifier le tag' : 'Créer un nouveau tag'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Le nom est requis" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du tag</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom du tag" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Couleur</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="color" 
                                className="w-12 h-10 p-1 rounded"
                                {...field} 
                              />
                              <Input 
                                placeholder="#3B82F6" 
                                className="flex-1"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button type="button" variant="outline" onClick={handleModalClose}>
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={saveTagMutation.isPending}
                      >
                        {saveTagMutation.isPending 
                          ? (selectedTag ? "Modification..." : "Création...") 
                          : (selectedTag ? "Modifier" : "Créer")
                        }
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Tags disponibles ({filteredTags.length})</h3>
            <ScrollArea className="h-32">
              <div className="flex flex-wrap gap-2 p-2">
                {filteredTags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                    className="border"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Tags Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Aucun tag trouvé' : 'Aucun tag disponible'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {tag.color}
                        </code>
                      </TableCell>
                      <TableCell>
                        {new Date(tag.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tag)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsManager;