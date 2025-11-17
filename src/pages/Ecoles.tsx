
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getSchools } from "@/lib/db/queries";
import { Link } from "react-router-dom";
import { MapPin, GraduationCap, BookOpen, Building2 } from "lucide-react";

interface School {
  id: string;
  name: string;
  description: string | null;
  type: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tagId: string | null;
  videoId: string | null;
  active: boolean | null;
  sortOrder: number | null;
  subtitle: string | null;
  coordonneId: string | null;
}

const Ecoles = () => {

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools-public'],
    queryFn: async () => {
      return await getSchools({ status: 'published' });
    }
  });



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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Écoles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos établissements scolaires dédiés à l'excellence éducative et au développement de chaque élève
            </p>
          </div>



          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {schools.map((school) => (
              <Card key={school.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg transform hover:-translate-y-1">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${school.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop'})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white border-0 shadow-lg capitalize">
                      {school.type}
                    </Badge>
                  </div>

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
                  <Link to={`/ecoles/${school.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 border-0 shadow-lg">
                      Voir les détails
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ecoles;
