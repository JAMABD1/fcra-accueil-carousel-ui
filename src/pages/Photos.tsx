
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string;
  featured: boolean;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("status", "published")
        .neq("category", "General")
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Photo[];
    },
  });

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Chargement...</p>
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
              Galerie Photos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos moments marquants en images
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher une photo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <Link to={`/photos/${photo.id}`}>
                  <div className="relative">
                     <div 
                       className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                       style={{ backgroundImage: `url(${photo.thumbnail_url || photo.image_url})` }}
                     >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{photo.title}</h3>
                     <div className="flex items-center justify-between text-sm text-gray-500">
                       <div className="flex items-center gap-1">
                         <Calendar className="w-4 h-4" />
                          <span>{new Date(photo.published_at || photo.created_at).toLocaleDateString()}</span>
                       </div>
                       {photo.featured && (
                         <div className="flex items-center gap-1">
                           <Eye className="w-4 h-4" />
                           <span>Vedette</span>
                         </div>
                       )}
                     </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune photo trouvée pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Photos;
