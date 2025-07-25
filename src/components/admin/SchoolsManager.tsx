import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { GraduationCap, Plus, Edit, Trash2, Building, Calendar } from "lucide-react";
import SchoolFormModal from "./SchoolFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface School {
  id: string;
  name: string;
  description: string | null;
  type: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  tagname: string | null;
  hero_id: string | null;
  subtitle: string | null;
  coordonne_id: string | null;
  hero?: {
    id: string;
    title: string;
    image_url: string;
  } | null;
  coordonnes?: {
    id: string;
    phone: string;
    email: string;
    address: string;
  } | null;
}

const SchoolsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const { toast } = useToast();

  // Fetch schools with related data
  const { data: schools = [], isLoading, refetch } = useQuery({
    queryKey: ['schools-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          hero (
            id,
            title,
            image_url
          ),
          coordonnes (
            id,
            phone,
            email,
            address
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as School[];
    }
  });

  // Filter schools based on search term
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.tagname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalSchools = schools.length;
  const schoolsByType = schools.reduce((acc, school) => {
    acc[school.type] = (acc[school.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  const handleDelete = async (school: School) => {
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', school.id);

      if (error) throw error;

      toast({
        title: "École supprimée",
        description: "L'école a été supprimée avec succès.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
    setSchoolToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchool(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800">Gestion des Écoles</h1>
            <p className="text-green-600">Gérez les écoles de votre réseau</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une École
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Total des Écoles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalSchools}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Types d'Écoles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(schoolsByType).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize text-green-700">{type}</span>
                  <span className="font-medium text-green-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Dernière Mise à Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">
              {schools.length > 0 ? new Date(schools[0].updated_at).toLocaleDateString('fr-FR') : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Rechercher une école..."
          />
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="bg-white border-green-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-green-800 line-clamp-1">
                    {school.name}
                  </CardTitle>
                  {school.subtitle && (
                    <CardDescription className="text-green-600 mt-1">
                      {school.subtitle}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(school)}
                    className="h-8 w-8 p-0 hover:bg-green-100"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSchoolToDelete(school)}
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer l'école "{school.name}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(school)}
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
              {/* Image */}
              {school.image_url && (
                <div className="aspect-video bg-green-50 rounded-lg overflow-hidden">
                  <img 
                    src={school.image_url} 
                    alt={school.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {school.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {school.description}
                </p>
              )}

              {/* Type and Tag */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Building className="h-3 w-3 mr-1" />
                  {school.type}
                </Badge>
                {school.tagname && (
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    {school.tagname}
                  </Badge>
                )}
              </div>

              {/* Associated Data */}
              <div className="space-y-2 text-sm">
                {school.hero && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="font-medium">Hero:</span>
                    <span>{school.hero.title}</span>
                  </div>
                )}
                {school.coordonnes && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="font-medium">Contact:</span>
                    <span>{school.coordonnes.phone || school.coordonnes.email || 'Disponible'}</span>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Créé le {new Date(school.created_at).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredSchools.length === 0 && (
        <div className="text-center py-8">
          <GraduationCap className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-green-600">Aucune école trouvée</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SchoolFormModal
          school={selectedSchool}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SchoolsManager; 