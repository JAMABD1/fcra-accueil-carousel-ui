
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin, GraduationCap, BookOpen, Building2, Search, Award } from "lucide-react";

interface School {
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

const Ecoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools-public'],
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

  // Filter schools based on search term and type
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.tagname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || school.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Statistics
  const totalSchools = schools.length;
  const schoolTypes = [...new Set(schools.map(school => school.type))];
  const schoolsWithHero = schools.filter(school => school.hero).length;
  const schoolsWithCoordinates = schools.filter(school => school.coordonnes).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Écoles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos établissements scolaires dédiés à l'excellence éducative et au développement de chaque élève
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Écoles Actives</CardTitle>
                <GraduationCap className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalSchools}</div>
                <p className="text-xs text-gray-500">Établissements scolaires</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Types d'Écoles</CardTitle>
                <Building2 className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{schoolTypes.length}</div>
                <p className="text-xs text-gray-500">Spécialisations</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Écoles avec Hero</CardTitle>
                <BookOpen className="h-6 w-6 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{schoolsWithHero}</div>
                <p className="text-xs text-gray-500">Avec présentation</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Coordonnées</CardTitle>
                <MapPin className="h-6 w-6 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{schoolsWithCoordinates}</div>
                <p className="text-xs text-gray-500">Avec contact</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher une école..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  onClick={() => setSelectedType("all")}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  Toutes
                </Button>
                {schoolTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type)}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg transform hover:-translate-y-1">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${school.image_url || school.hero?.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop'})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white border-0 shadow-lg capitalize">
                      {school.type}
                    </Badge>
                  </div>
                  {school.tagname && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-600 text-white border-0 shadow-lg capitalize">
                        {school.tagname}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                    {school.subtitle && (
                      <p className="text-green-600 font-medium text-sm mb-2">{school.subtitle}</p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {school.description || "Aucune description disponible"}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {school.hero && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        <span className="line-clamp-1">{school.hero.title}</span>
                      </div>
                    )}
                    
                    {school.coordonnes && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {school.coordonnes.address || school.coordonnes.phone || school.coordonnes.email}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Link to={`/ecoles/${school.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 border-0 shadow-lg">
                      Voir les détails
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredSchools.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune école trouvée
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm || selectedType !== "all" 
                  ? "Aucune école ne correspond à vos critères de recherche."
                  : "Aucune école n'est actuellement disponible."}
              </p>
              {(searchTerm || selectedType !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Afficher toutes les écoles
                </Button>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12">
                <Award className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Rejoignez Notre Communauté Éducative
                </h3>
                <p className="text-xl mb-8 text-green-100">
                  Découvrez comment nos écoles peuvent accompagner votre parcours éducatif
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-green-600 hover:bg-gray-100 border-0 shadow-lg"
                  >
                    Nous Contacter
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    En Savoir Plus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ecoles;
