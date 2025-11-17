import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDirectors, deleteRecord } from "@/lib/db/queries";
import { directors } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import { Users, Plus, Edit, Trash2, Crown, Building, UserCheck } from "lucide-react";
import DirectorFormModal from "./DirectorFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface Director {
  id: string;
  name: string;
  imageUrl: string | null;
  job: string | null;
  responsibility: string | null;
  sortOrder: number | null;
  centreId: string | null;
  isDirector: boolean | null;
  active: boolean | null;
  createdAt: string;
  updatedAt: string;
  centres?: {
    id: string;
    name: string;
  } | null;
}

const DirectorsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState<Director | null>(null);
  const { toast } = useToast();

  // Fetch directors with centre information
  const { data: directors = [], isLoading, refetch } = useQuery({
    queryKey: ['directors'],
    queryFn: async () => {
      return await getDirectors();
    }
  });

  // Filter directors based on search term
  const filteredDirectors = directors.filter(director =>
    director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    director.job?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    director.centres?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalDirectors = directors.length;
  const activeDirectors = directors.filter(d => d.active).length;
  const mainDirectors = directors.filter(d => d.isDirector).length;
  const withCentres = directors.filter(d => d.centreId).length;

  const handleEdit = (director: Director) => {
    setSelectedDirector(director);
    setShowModal(true);
  };

  const handleDelete = async (director: Director) => {
    try {
      await deleteRecord(directors, director.id);

      toast({
        title: "Directeur supprimé",
        description: `${director.name} a été supprimé avec succès.`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le directeur.",
        variant: "destructive",
      });
    }
    setDirectorToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDirector(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Directeurs</h1>
          </div>
          <Badge variant="outline" className="ml-4">
            {totalDirectors} directeurs
          </Badge>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Directeur
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDirectors}</div>
            <p className="text-xs text-muted-foreground">Directeurs enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeDirectors}</div>
            <p className="text-xs text-muted-foreground">Directeurs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Directeurs</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mainDirectors}</div>
            <p className="text-xs text-muted-foreground">Directeurs principaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Centre</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{withCentres}</div>
            <p className="text-xs text-muted-foreground">Directeurs assignés</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
      />

      {/* Directors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDirectors.map((director) => (
          <Card key={director.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={director.image_url || ""} alt={director.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {director.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{director.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {director.is_director && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Crown className="h-3 w-3 mr-1" />
                          Directeur
                        </Badge>
                      )}
                      {director.active ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Inactif
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(director)}
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
                        onClick={() => setDirectorToDelete(director)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le directeur</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {director.name} ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDirectorToDelete(null)}>
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(director)}
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
            <CardContent className="pt-0">
              <div className="space-y-2">
                {director.job && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">{director.job}</p>
                  </div>
                )}
                {director.responsibility && (
                  <div>
                    <p className="text-sm text-gray-600">{director.responsibility}</p>
                  </div>
                )}
                {director.centres && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{director.centres.name}</span>
                  </div>
                )}
                {director.sort_order && (
                  <div className="text-xs text-gray-500">
                    Ordre: {director.sort_order}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDirectors.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-lg mb-2">Aucun directeur trouvé</CardTitle>
            <CardDescription>
              {searchTerm ? 'Aucun directeur ne correspond à votre recherche.' : 'Commencez par ajouter un directeur.'}
            </CardDescription>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un directeur
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <DirectorFormModal
          director={selectedDirector}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DirectorsManager; 