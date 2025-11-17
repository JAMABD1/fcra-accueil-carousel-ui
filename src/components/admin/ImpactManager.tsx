import { useState } from "react";
import { getImpactItems, deleteRecord, getTags } from "@/lib/db/queries";
import { impact } from "@/lib/db/schema";
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
import { Plus, Edit, Trash2, Search, TrendingUp, Hash, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImpactFormModal from "./ImpactFormModal";

export interface Impact {
  id: string;
  number: number;
  title: string;
  subtitle: string | null;
  tagsId: string | null;
  tagIds: string[];
  sortOrder: number | null;
  active: boolean | null;
  createdAt: string;
  updatedAt: string;
  tags?: {
    id: string;
    name: string;
    color: string;
  };
  tagsMultiple?: {
    id: string;
    name: string;
    color: string;
  }[];
}

const ImpactManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImpact, setSelectedImpact] = useState<Impact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch impacts with tag information
  const { data: impacts = [], isLoading } = useQuery({
    queryKey: ['impacts'],
    queryFn: async () => {
      return await getImpactItems();
    }
  });

  // Fetch all tags for mapping tag_ids to tag names
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Delete impact mutation
  const deleteImpactMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteRecord(impact, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impacts'] });
      toast({
        title: "Impact supprimé",
        description: "L'élément impact a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément impact.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  });

  // Calculate statistics
  const stats = {
    total: impacts.length,
    active: impacts.filter(i => i.active).length,
    inactive: impacts.filter(i => !i.active).length,
    totalCount: impacts.reduce((sum, impact) => sum + impact.number, 0),
  };

  const filteredImpacts = impacts.filter(impact =>
    impact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    impact.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    impact.tags?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (impact: Impact) => {
    setSelectedImpact(impact);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément impact ?')) {
      deleteImpactMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImpact(null);
  };

  const getStatusBadge = (active: boolean | null) => {
    return active ? (
      <Badge variant="default">Actif</Badge>
    ) : (
      <Badge variant="secondary">Inactif</Badge>
    );
  };

  const getTagsBadges = (tagIds: string[], legacyTag: { name: string; color: string } | null) => {
    // Show both legacy tag and new multiple tags
    const badges = [];
    
    if (legacyTag) {
      badges.push(
        <Badge 
          key="legacy"
          variant="outline" 
          style={{ 
            borderColor: legacyTag.color,
            color: legacyTag.color,
            backgroundColor: `${legacyTag.color}10`
          }}
        >
          {legacyTag.name}
        </Badge>
      );
    }
    
    if (tagIds && tagIds.length > 0 && tags.length > 0) {
      tagIds.forEach(tagId => {
        const tag = tags.find(t => t.id === tagId);
        if (tag) {
          badges.push(
            <Badge 
              key={tagId} 
              variant="outline"
              style={{ borderColor: tag.color, color: tag.color, backgroundColor: `${tag.color}10` }}
            >
              {tag.name}
            </Badge>
          );
        }
      });
    }
    
    if (badges.length === 0) {
      return <Badge variant="outline">Aucun tag</Badge>;
    }
    
    return <div className="flex flex-wrap gap-1">{badges}</div>;
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

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impacts</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Éléments impact au total
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Somme Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.totalCount)}</div>
            <p className="text-xs text-muted-foreground">
              Total de tous les chiffres
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Impacts</CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Impact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, sous-titre ou tag..."
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
                    <TableHead>Chiffre</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Sous-titre</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImpacts.map((impact) => (
                    <TableRow key={impact.id}>
                      <TableCell>
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(impact.number)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{impact.title}</TableCell>
                      <TableCell className="text-gray-600">
                        {impact.subtitle || 'Aucun sous-titre'}
                      </TableCell>
                      <TableCell>
                        {getTagsBadges(impact.tagIds, impact.tags)}
                      </TableCell>
                      <TableCell>{impact.sortOrder || 0}</TableCell>
                      <TableCell>{getStatusBadge(impact.active)}</TableCell>
                      <TableCell>{formatDate(impact.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(impact)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(impact.id)}
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

      {/* Impact Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ImpactFormModal
                impact={selectedImpact}
                onClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactManager; 