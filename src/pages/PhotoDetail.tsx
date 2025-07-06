
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lightbox } from "@/components/Lightbox";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  images: string[] | null;
  category: string;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const PhotoDetail = () => {
  const { id } = useParams();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: photo, isLoading } = useQuery({
    queryKey: ["photo", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .single();
      
      if (error) throw error;
      return data as Photo;
    },
    enabled: !!id,
  });

  const { data: relatedPhotos = [] } = useQuery({
    queryKey: ["related-photos", photo?.category],
    queryFn: async () => {
      if (!photo) return [];
      
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("status", "published")
        .eq("category", photo.category)
        .neq("id", photo.id)
        .limit(6);
      
      if (error) throw error;
      return data as Photo[];
    },
    enabled: !!photo,
  });

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

  if (!photo) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Photo non trouvée</h1>
            <Link to="/photos" className="text-green-600 hover:text-green-700">
              Retour à la galerie
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/photos" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la galerie
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Photo */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                {photo.images && photo.images.length > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {photo.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`${photo.title} ${index + 1}`}
                          className="w-full h-64 object-cover cursor-pointer rounded hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setIsLightboxOpen(true);
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-auto max-h-96 object-cover cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(0);
                        setIsLightboxOpen(true);
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {photo.title}
                      </h1>
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {photo.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                        </div>
                        {photo.images && photo.images.length > 1 && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{photo.images.length} images</span>
                          </div>
                        )}
                        {photo.featured && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Vedette</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {photo.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Related Photos */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Photos similaires
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {relatedPhotos.map((relatedPhoto) => (
                  <Card key={relatedPhoto.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/photos/${relatedPhoto.id}`}>
                      <div className="relative">
                        <div 
                          className="w-full h-24 bg-cover bg-center hover:scale-105 transition-transform duration-300"
                          style={{ backgroundImage: `url(${relatedPhoto.thumbnail_url || relatedPhoto.image_url})` }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300" />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-xs line-clamp-2 mb-1">
                          {relatedPhoto.title}
                        </h3>
                        <div className="text-xs text-gray-500">
                          {new Date(relatedPhoto.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for viewing images */}
      <Lightbox
        images={photo.images || [photo.image_url]}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={currentImageIndex}
        title={photo.title}
      />
    </Layout>
  );
};

export default PhotoDetail;
