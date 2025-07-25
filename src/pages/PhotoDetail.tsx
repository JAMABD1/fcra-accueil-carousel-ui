
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

          {/* Title and Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{photo.title}</h1>
            {photo.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{photo.description}</p>
            )}
          </div>

          {/* Simple Masonry Gallery */}
          {photo.images && photo.images.length > 1 ? (
            <div
              className="grid gap-2"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gridAutoRows: 'auto',
              }}
            >
              {photo.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg bg-white flex items-center justify-center"
                  style={{ minHeight: '120px', minWidth: '120px' }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsLightboxOpen(true);
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`${photo.title} ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{ maxHeight: '320px', maxWidth: '100%' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative flex items-center justify-center bg-white rounded-lg" style={{ minHeight: '120px', minWidth: '120px' }}>
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-contain cursor-pointer rounded-lg"
                style={{ maxHeight: '320px', maxWidth: '100%' }}
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsLightboxOpen(true);
                }}
              />
            </div>
          )}
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
