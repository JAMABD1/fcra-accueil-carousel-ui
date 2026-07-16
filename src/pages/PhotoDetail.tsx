
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowLeft, Download, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { photos } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import { whereSlugOrId } from "@/lib/db/queries";
import { Lightbox } from "@/components/Lightbox";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";

interface Photo {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  images: string[] | null;
  category: string;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PhotoDetail = () => {
  const { slug } = useParams();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: photo, isLoading } = useQuery({
    queryKey: ["photo", slug],
    queryFn: async () => {
      const result = await db.select()
        .from(photos)
        .where(whereSlugOrId(photos, slug!))
        .limit(1);
      return result[0] as Photo;
    },
    enabled: !!slug,
  });

  const { data: relatedPhotos = [] } = useQuery({
    queryKey: ["related-photos", photo?.category],
    queryFn: async () => {
      if (!photo) return [];

      const { getPhotos } = await import("@/lib/db/queries");
      return await getPhotos({
        status: "published",
        // Note: We'll filter by category and exclude current photo in the component
      });
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
          <div className="text-center mb-8 relative overflow-hidden py-4">
            <div className="grain-overlay pointer-events-none" />
            <p className="eyebrow-label mb-3">Galerie FCRA</p>
            {photo.category && (
              <Badge variant="outline" className="mb-4 text-green-700 border-green-200 capitalize">
                {photo.category}
              </Badge>
            )}
            <h1 className="text-section font-bold text-gray-900 mb-4">{photo.title}</h1>
            {photo.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{photo.description}</p>
            )}
            {photo.images && photo.images.length > 0 && (
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Images className="h-4 w-4 text-green-600" />
                {photo.images.length} photo{photo.images.length !== 1 ? "s" : ""}
              </p>
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
                <ScrollReveal key={index} delay={index * 0.04}>
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-lg bg-white flex items-center justify-center card-lift"
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
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="relative flex items-center justify-center bg-white rounded-lg card-lift" style={{ minHeight: '120px', minWidth: '120px' }}>
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
