import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Edit, Trash2, Search, Layers, TrendingUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SectionFormModal from "./SectionFormModal";

export interface Section {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  hero_id: string | null;
  tag_name: string | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  hero?: {
    id: string;
    title: string;
  };
}

const SectionsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sections with hero information
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select(`
          *,
          hero:hero_id (
            id,
            title
          )
        `)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Section[];
    }
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast({
        title: "Section supprimée",
        description: "La section a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la section.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  });

  // Calculate statistics
  const stats = {
    total: sections.length,
    active: sections.filter(s => s.active).length,
    inactive: sections.filter(s => !s.active).length,
    withHero: sections.filter(s => s.hero_id).length,
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.tag_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.hero?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      deleteSectionMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };

  const getStatusBadge = (active: boolean | null) => {
    return active ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getTagBadge = (tagName: string | null) => {
    if (!tagName) return <Badge variant="outline">Aucun tag</Badge>;
    
    return (
      <Badge variant="outline">
        {tagName}
      </Badge>
    );
  };

  const getHeroBadge = (hero: { title: string } | null) => {
    if (!hero) return <Badge variant="outline">Aucun hero</Badge>;
    
    return (
      <Badge variant="secondary">
        {hero.title}
      </Badge>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Sections au total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
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
            <CardTitle className="text-sm font-medium">Inactives</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Sections désactivées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Hero</CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.withHero}</div>
            <p className="text-xs text-muted-foreground">
              Sections liées à un hero
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Sections</CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, sous-titre, tag ou hero..."
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
                    <TableHead>Tag</TableHead>
                    <TableHead>Hero</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={section.image_url} 
                            alt={section.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{section.title}</TableCell>
                      <TableCell className="text-gray-600">
                        {section.subtitle || 'Aucun sous-titre'}
                      </TableCell>
                      <TableCell>
                        {getTagBadge(section.tag_name)}
                      </TableCell>
                      <TableCell>
                        {getHeroBadge(section.hero)}
                      </TableCell>
                      <TableCell>{section.sort_order || 0}</TableCell>
                      <TableCell>{getStatusBadge(section.active)}</TableCell>
                      <TableCell>{formatDate(section.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(section.id)}
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

      {/* Section Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <SectionFormModal
                section={selectedSection}
                onClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsManager; 