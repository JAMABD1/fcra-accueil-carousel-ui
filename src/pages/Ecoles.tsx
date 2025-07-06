
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";

interface School {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  capacity: number;
  programs: string[];
  facilities: string[];
  image_url: string;
  images: string[];
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const Ecoles = () => {
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as School[];
    }
  });

  const featuredSchools = schools.filter(school => school.featured);
  const regularSchools = schools.filter(school => !school.featured);

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
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Écoles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos établissements scolaires et programmes éducatifs
            </p>
          </div>

          {/* Featured Schools */}
          {featuredSchools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Écoles vedettes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredSchools.map((school) => (
                  <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${school.image_url})` }}
                    >
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-600 text-white">
                          École vedette
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600 text-white">
                          {school.type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {school.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        {school.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{school.address.split(',')[0]}</span>
                          </div>
                        )}
                        {school.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{school.capacity} élèves</span>
                          </div>
                        )}
                      </div>
                      <Link to={`/ecoles/${school.id}`}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Voir les détails
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Schools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Toutes nos écoles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularSchools.map((school) => (
                <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div 
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${school.image_url})` }}
                  >
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white">
                        {school.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {school.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {school.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{school.address.split(',')[0]}</span>
                        </div>
                      )}
                      {school.capacity && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{school.capacity} élèves</span>
                        </div>
                      )}
                    </div>
                    <Link to={`/ecoles/${school.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Voir les détails
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Programs Overview */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Nos Programmes Spécialisés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">💻</span>
                  </div>
                  <h4 className="font-semibold mb-2">Informatique</h4>
                  <p className="text-gray-600 text-sm">
                    Formation aux technologies modernes
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">🔬</span>
                  </div>
                  <h4 className="font-semibold mb-2">Sciences</h4>
                  <p className="text-gray-600 text-sm">
                    Laboratoires et recherche scientifique
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">🎨</span>
                  </div>
                  <h4 className="font-semibold mb-2">Arts & Culture</h4>
                  <p className="text-gray-600 text-sm">
                    Expression artistique et patrimoine culturel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ecoles;
