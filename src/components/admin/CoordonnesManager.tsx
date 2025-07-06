import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { MapPin, Plus, Edit, Trash2, Phone, Mail, ExternalLink } from "lucide-react";
import CoordonneFormModal from "./CoordonneFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface Coordonne {
  id: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  tags_id: string | null;
  google_map_url: string | null;
  sort_order: number | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  tags?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

const CoordonnesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoordonne, setSelectedCoordonne] = useState<Coordonne | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coordonneToDelete, setCoordonneToDelete] = useState<Coordonne | null>(null);
  const { toast } = useToast();

  // Fetch coordonnes with related data
  const { data: coordonnes = [], isLoading, refetch } = useQuery({
    queryKey: ['coordonnes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coordonnes')
        .select(`
          *,
          tags (
            id,
            name,
            color
          )
        `)
        .order('sort_order')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Coordonne[];
    }
  });

  // Filter coordonnes based on search term
  const filteredCoordonnes = coordonnes.filter(coordonne =>
    coordonne.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordonne.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordonne.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordonne.tags?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalCoordonnes = coordonnes.length;
  const activeCoordonnes = coordonnes.filter(c => c.active).length;
  const withMapUrls = coordonnes.filter(c => c.google_map_url).length;

  const handleEdit = (coordonne: Coordonne) => {
    setSelectedCoordonne(coordonne);
    setShowModal(true);
  };

  const handleDelete = async (coordonne: Coordonne) => {
    try {
      const { error } = await supabase
        .from('coordonnes')
        .delete()
        .eq('id', coordonne.id);

      if (error) throw error;

      toast({
        title: "Coordonnée supprimée",
        description: "La coordonnée a été supprimée avec succès.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la coordonnée.",
        variant: "destructive",
      });
    }
    setCoordonneToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCoordonne(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Coordonnées</h1>
          </div>
          <Badge variant="outline" className="ml-4">
            {totalCoordonnes} coordonnées
          </Badge>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Coordonnée
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoordonnes}</div>
            <p className="text-xs text-muted-foreground">Coordonnées enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCoordonnes}</div>
            <p className="text-xs text-muted-foreground">Coordonnées actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Carte</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{withMapUrls}</div>
            <p className="text-xs text-muted-foreground">Coordonnées avec Google Maps</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
      />

      {/* Coordonnes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoordonnes.map((coordonne) => (
          <Card key={coordonne.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {coordonne.active ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Inactif
                      </Badge>
                    )}
                    {coordonne.tags && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-700"
                        style={{ 
                          backgroundColor: coordonne.tags.color ? `${coordonne.tags.color}20` : undefined,
                          color: coordonne.tags.color || undefined
                        }}
                      >
                        {coordonne.tags.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(coordonne)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => setCoordonneToDelete(coordonne)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette coordonnée ? Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => coordonneToDelete && handleDelete(coordonneToDelete)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Info */}
              <div className="space-y-2">
                {coordonne.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{coordonne.phone}</span>
                  </div>
                )}
                {coordonne.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>{coordonne.email}</span>
                  </div>
                )}
                {coordonne.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="flex-1">{coordonne.address}</span>
                  </div>
                )}
              </div>

              {/* Google Maps Link */}
              {coordonne.google_map_url && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(coordonne.google_map_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir sur Google Maps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCoordonnes.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune coordonnée trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer une nouvelle coordonnée"}
          </p>
          <Button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Coordonnée
          </Button>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <CoordonneFormModal
          coordonne={selectedCoordonne}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CoordonnesManager; 