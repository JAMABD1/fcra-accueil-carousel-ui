import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCentres, deleteRecord, getTags } from "@/lib/db/queries";
import { centres } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { Building, Plus, Edit, Trash2, Users, Video, ImageIcon, MapPin, Phone, Mail } from "lucide-react";
import CentreFormModal from "./CentreFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface Centre {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  imageUrl: string | null;
  tagId: string | null;
  videoId: string | null;
  sortOrder: number | null;
  active: boolean | null;
  createdAt: string;
  updatedAt: string;
  hero?: {
    id: string;
    title: string;
    image_url: string;
  } | null;
  videos?: {
    id: string;
    title: string;
    video_type: string;
    youtube_id: string;
  } | null;
  directors?: {
    id: string;
    name: string;
    job: string;
    image_url: string;
  }[];
}

const CentresManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCentre, setSelectedCentre] = useState<Centre | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [centreToDelete, setCentreToDelete] = useState<Centre | null>(null);
  const { toast } = useToast();

  // Fetch centres with related data
  const { data: centres = [], isLoading, refetch } = useQuery({
    queryKey: ['centres'],
    queryFn: async () => {
      return await getCentres();
    }
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Helper to safely compare text fields
  const matchesSearch = (value?: string | null) =>
    normalizedSearch === "" || (value && value.toLowerCase().includes(normalizedSearch));

  // Filter centres based on search term
  const filteredCentres = centres.filter(centre => {
    const nameMatch = matchesSearch(centre.name);
    const descriptionMatch = matchesSearch(centre.description);
    const addressMatch = matchesSearch(centre.address);
    const directorMatch = centre.directors?.some(d => matchesSearch(d.name)) ?? false;
    return nameMatch || descriptionMatch || addressMatch || directorMatch;
  });

  // Statistics
  const totalCentres = centres.length;
  const activeCentres = centres.filter(c => c.active).length;
  const withVideos = centres.filter(c => c.videoId || (c as any).video_id || c.videos).length;

  const handleEdit = (centre: Centre) => {
    setSelectedCentre(centre);
    setShowModal(true);
  };

  const handleDelete = async (centre: Centre) => {
    try {
      await deleteRecord(centres, centre.id);

      toast({
        title: "Centre supprimé",
        description: `${centre.name} a été supprimé avec succès.`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le centre.",
        variant: "destructive",
      });
    }
    setCentreToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCentre(null);
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
            <Building className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Centres</h1>
          </div>
          <Badge variant="outline" className="ml-4">
            {totalCentres} centres
          </Badge>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Centre
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCentres}</div>
            <p className="text-xs text-muted-foreground">Centres enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCentres}</div>
            <p className="text-xs text-muted-foreground">Centres actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Vidéos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{withVideos}</div>
            <p className="text-xs text-muted-foreground">Centres avec vidéos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        placeholder="Rechercher des centres..."
      />

      {/* Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCentres.map((centre) => (
          <Card key={centre.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{centre.name || "Nom non renseigné"}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {centre.active ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Inactif
                      </Badge>
                    )}
                    {centre.directors?.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {centre.directors[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(centre)}
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
                        onClick={() => setCentreToDelete(centre)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le centre</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {centre.name} ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCentreToDelete(null)}>
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(centre)}
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
              <div className="space-y-3">
                {centre.description ? (
                  <p className="text-sm text-gray-600 line-clamp-2">{centre.description}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Description non renseignée</p>
                )}
                
                {centre.address && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{centre.address}</span>
                  </div>
                )}
                
                {centre.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{centre.phone}</span>
                  </div>
                )}
                
                {centre.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{centre.email}</span>
                  </div>
                )}

                {/* Related Resources */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {centre.hero && (
                    <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                      <ImageIcon className="h-3 w-3" />
                      <span>Hero</span>
                    </div>
                  )}
                  {centre.videos && (
                    <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                      <Video className="h-3 w-3" />
                      <span>{centre.videos.video_type === 'youtube' ? 'YouTube' : 'Vidéo'}</span>
                    </div>
                  )}
                  {centre.directors && centre.directors.length > 0 && (
                    <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                      <Users className="h-3 w-3" />
                      <span>{centre.directors[0].name}</span>
                    </div>
                  )}
                </div>

                {(() => {
                  const orderValue = (centre as any).sortOrder ?? (centre as any).sort_order;
                  return orderValue !== null && orderValue !== undefined ? (
                  <div className="text-xs text-gray-500">
                      Ordre: {orderValue}
                  </div>
                  ) : null;
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCentres.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-lg mb-2">Aucun centre trouvé</CardTitle>
            <CardDescription>
              {searchTerm ? 'Aucun centre ne correspond à votre recherche.' : 'Commencez par ajouter un centre.'}
            </CardDescription>
            {!searchTerm && (
              <Button onClick={() => setShowModal(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un centre
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <CentreFormModal
          centre={selectedCentre}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CentresManager; 