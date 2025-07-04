
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MapCenters from "@/components/MapCenters";
import { MapPin, Users, BookOpen, Heart } from "lucide-react";

const Centres = () => {
  const centers = [
    {
      id: 1,
      name: "Centre Principal Antananarivo",
      description: "Notre centre principal offre une gamme complète de services éducatifs et sociaux.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
      services: ["Éducation", "Formation professionnelle", "Aide sociale", "Santé"],
      beneficiaries: 500,
      programs: 12
    },
    {
      id: 2,
      name: "Centre de Formation Toamasina",
      description: "Spécialisé dans la formation technique et l'insertion professionnelle.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
      services: ["Formation technique", "Stages", "Placement professionnel"],
      beneficiaries: 300,
      programs: 8
    },
    {
      id: 3,
      name: "Centre Rural Fianarantsoa",
      description: "Axé sur le développement rural et l'agriculture durable.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
      services: ["Agriculture", "Élevage", "Microfinance", "Alphabétisation"],
      beneficiaries: 250,
      programs: 6
    },
    {
      id: 4,
      name: "Centre Côtier Mahajanga",
      description: "Développement des communautés côtières et pêche durable.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      services: ["Pêche", "Commerce", "Tourisme communautaire"],
      beneficiaries: 180,
      programs: 5
    }
  ];

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Centres FCRA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Découvrez nos centres d'activités répartis à travers Madagascar, chacun adapté aux besoins spécifiques de sa région.
            </p>
          </div>

          {/* Map Section */}
          <div className="mb-16 animate-fade-in">
            <MapCenters />
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {centers.map((center, index) => (
              <Card 
                key={center.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${center.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      <MapPin className="w-3 h-3 mr-1" />
                      Centre {center.id}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {center.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {center.description}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Users className="w-4 h-4" />
                      <span>{center.beneficiaries} bénéficiaires</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{center.programs} programmes</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {center.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Découvrir ce centre
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Section */}
          <div className="bg-white rounded-lg p-8 shadow-lg animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Notre Impact Global
              </h2>
              <p className="text-gray-600">
                Ensemble, nos centres touchent des milliers de vies à travers Madagascar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1,230</h3>
                <p className="text-gray-600">Bénéficiaires totaux</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">31</h3>
                <p className="text-gray-600">Programmes actifs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">85</h3>
                <p className="text-gray-600">Employés & Bénévoles</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4</h3>
                <p className="text-gray-600">Régions couvertes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Centres;
