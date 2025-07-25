import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Video, Camera } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import { useState } from "react";

const ActiviteDetail = () => {
  const { id } = useParams();

  // State for Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch activity from Supabase
  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`*, videos(*), photos(*), tags(*)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch photo group if activity.photo_id exists
  const { data: photoGroup } = useQuery({
    queryKey: ["photo-group", activity?.photo_id],
    queryFn: async () => {
      if (!activity?.photo_id) return null;
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("id", activity.photo_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!activity?.photo_id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!activity) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Activité non trouvée</h1>
            <Link to="/activites">
              <Button className="bg-green-600 hover:bg-green-700">
                Retour aux activités
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/activites">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux activités
              </Button>
            </Link>
          </div>

          {/* Activity Header - Wide Layout, No Card */}
          <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
          {activity.subtitle && <h2 className="text-xl text-gray-600 mb-4">{activity.subtitle}</h2>}
          <div className="flex items-center gap-4 mb-4">
            {activity.created_at && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(activity.created_at).toLocaleDateString('fr-FR')}
              </div>
            )}
            {activity.tags && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {activity.tags.name}
              </Badge>
            )}
          </div>
          {activity.video_id && activity.videos && (
            <div className="mb-6">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-2">
                {activity.videos.video_type === "youtube" && activity.videos.youtube_id && (
                  <iframe
                    src={`https://www.youtube.com/embed/${activity.videos.youtube_id}`}
                    title={activity.videos.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
                {activity.videos.video_type === "upload" && activity.videos.video_url && (
                  <video
                    src={activity.videos.video_url}
                    controls
                    className="w-full h-full"
                    title={activity.videos.title}
                  />
                )}
              </div>
              {activity.video_description && (
                <p className="text-gray-600 text-sm mb-2">{activity.video_description}</p>
              )}
            </div>
          )}
          {activity.photo_id && photoGroup && photoGroup.images && photoGroup.images.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {photoGroup.images.map((imageUrl: string, idx: number) => (
                  <img
                    key={idx}
                    src={imageUrl}
                    alt={photoGroup.title}
                    className="h-48 w-auto rounded shadow cursor-pointer object-cover"
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                  />
                ))}
              </div>
              {activity.photo_description && (
                <p className="text-gray-600 text-sm mb-2">{activity.photo_description}</p>
              )}
              <Lightbox
                images={photoGroup.images}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                initialIndex={currentImageIndex}
                title={photoGroup.title}
              />
            </div>
          )}
          {activity.description && (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-6">
              {activity.description}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ActiviteDetail; 