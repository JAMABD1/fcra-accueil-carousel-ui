import { useState } from "react";
import { getHeroItems, deleteRecord, getTags } from "@/lib/db/queries";
import { hero } from "@/lib/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, ImageIcon, TrendingUp, Star, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HeroFormModal from "./HeroFormModal";

export interface Hero {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  tagIds: string[] | string | null;
  sortOrder: number | null;
  active: boolean | null;
  createdAt: string;
  updatedAt: string;
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
}

const HeroManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Fetch heroes
  const { data: heroes = [], isLoading } = useQuery({
    queryKey: ['heroes'],
    queryFn: async () => {
      return await getHeroItems();
    }
  });

  // Delete hero mutation
  const deleteHeroMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteRecord(hero, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
      toast({
        title: "Hero supprimé",
        description: "L'élément hero a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément hero.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  });

  // Calculate statistics
  const stats = {
    total: heroes.length,
    active: heroes.filter(h => h.active).length,
    inactive: heroes.filter(h => !h.active).length,
  };

  const filteredHeroes = heroes.filter(hero =>
    hero.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément hero ?')) {
      deleteHeroMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedHero(null);
  };

  const getStatusBadge = (active: boolean | null) => {
    return active ? (
      <Badge variant="default">Actif</Badge>
    ) : (
      <Badge variant="secondary">Inactif</Badge>
    );
  };

  const getTagsBadges = (tagIds: string[] | string | null) => {
    // Handle both array and string formats
    let processedTagIds: string[] = [];
    
    if (!tagIds) {
      return <Badge variant="outline">Aucun tag</Badge>;
    }
    
    if (typeof tagIds === 'string') {
      try {
        processedTagIds = JSON.parse(tagIds);
      } catch (e) {
        console.error('Error parsing tagIds:', e);
        return <Badge variant="outline">Erreur tags</Badge>;
      }
    } else if (Array.isArray(tagIds)) {
      processedTagIds = tagIds;
    } else {
      return <Badge variant="outline">Aucun tag</Badge>;
    }
    
    if (processedTagIds.length === 0) {
      return <Badge variant="outline">Aucun tag</Badge>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {processedTagIds.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? (
            <Badge 
              key={tagId} 
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </Badge>
          ) : (
            <Badge key={tagId} variant="outline">
              Tag-{tagId.substring(0, 8)}
            </Badge>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Heroes</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Éléments hero au total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Éléments désactivés
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Heroes</CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Hero
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre ou sous-titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Sous-titre</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHeroes.map((hero) => (
                    <TableRow key={hero.id}>
                      <TableCell>
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={hero.imageUrl} 
                            alt={hero.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{hero.title}</TableCell>
                      <TableCell className="text-gray-600">
                        {hero.subtitle || 'Aucun sous-titre'}
                      </TableCell>
                      <TableCell>{getTagsBadges(hero.tagIds)}</TableCell>
                      <TableCell>{hero.sortOrder || 0}</TableCell>
                      <TableCell>{getStatusBadge(hero.active)}</TableCell>
                      <TableCell>{formatDate(hero.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(hero)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(hero.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <HeroFormModal
                hero={selectedHero}
                onClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager; 