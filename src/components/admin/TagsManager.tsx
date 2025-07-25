import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const TagsManager = () => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");
  const [editTagId, setEditTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [editTagColor, setEditTagColor] = useState("#3B82F6");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Tag[];
    }
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: newTagName, color: newTagColor }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setNewTagName("");
      setNewTagColor("#3B82F6");
      toast({
        title: "Tag créé",
        description: "Le tag a été créé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le tag.",
        variant: "destructive",
      });
      console.error('Create error:', error);
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

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name: string; color: string }) => {
      const { error } = await supabase
        .from('tags')
        .update({ name, color })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setEditTagId(null);
      toast({
        title: "Tag modifié",
        description: "Le tag a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le tag.",
        variant: "destructive",
      });
      console.error('Update error:', error);
    }
  });

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du tag est requis.",
        variant: "destructive",
      });
      return;
    }
    createTagMutation.mutate();
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      deleteTagMutation.mutate(id);
    }
  };

  const handleEditClick = (tag: Tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
  };

  const handleEditSave = (id: string) => {
    if (!editTagName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du tag est requis.",
        variant: "destructive",
      });
      return;
    }
    updateTagMutation.mutate({ id, name: editTagName, color: editTagColor });
  };

  const handleEditCancel = () => {
    setEditTagId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gestion des Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Nom du tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-20"
            />
            <Button
              onClick={handleCreateTag}
              disabled={createTagMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags existants ({tags.length})</h3>
              
              {tags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun tag trouvé. Créez votre premier tag ci-dessus.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      {editTagId === tag.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editTagName}
                            onChange={e => setEditTagName(e.target.value)}
                            className="w-32"
                          />
                          <Input
                            type="color"
                            value={editTagColor}
                            onChange={e => setEditTagColor(e.target.value)}
                            className="w-12"
                          />
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleEditSave(tag.id)}
                            disabled={updateTagMutation.isPending}
                          >
                            Sauver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge style={{ backgroundColor: tag.color }}>
                            {tag.name}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(tag)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTag(tag.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsManager;