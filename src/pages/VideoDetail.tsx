
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VideoDetail = () => {
  const { id } = useParams();
  
  const sanitizeFacebookIframe = (iframeHtml: string) => {
    let html = iframeHtml.trim();
    // Force responsive sizing
    html = html.replace(/width="[^"]*"/gi, 'width="100%"');
    html = html.replace(/height="[^"]*"/gi, 'height="100%"');
    
    if (html.match(/style="[^"]*"/i)) {
      html = html.replace(
        /style="([^"]*)"/i,
        (_m, styles) => {
          const base = styles
            .replace(/\s*width\s*:\s*[^;]*;?/gi, '')
            .replace(/\s*height\s*:\s*[^;]*;?/gi, '')
            .replace(/\s*border\s*:\s*[^;]*;?/gi, '')
            .replace(/\s*overflow\s*:\s*[^;]*;?/gi, '')
            .trim();
          const enforced = 'width:100%;height:100%;border:none;overflow:hidden;';
          const merged = base ? `${base};${enforced}` : enforced;
          return `style="${merged}"`;
        }
      );
    } else {
      html = html.replace(/<iframe/i, '<iframe style="width:100%;height:100%;border:none;overflow:hidden;"');
    }
    // Ensure allowfullscreen attribute
    if (!/allowfullscreen/gi.test(html)) {
      html = html.replace(/<iframe/i, '<iframe allowfullscreen="true"');
    }
    // Remove fixed attributes that can cause scrollbars
    html = html.replace(/scrolling="[^"]*"/gi, 'scrolling="no"');
    return html;
  };

  // Fetch video from Supabase
  const { data: video, isLoading } = useQuery({
    queryKey: ['video-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch related videos (exclude current)
  const { data: relatedVideos = [] } = useQuery({
    queryKey: ['related-videos', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .neq('id', id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen text-center">
          <p className="text-gray-500">Chargement de la vidéo...</p>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vidéo non trouvée</h1>
            <Link to="/videos" className="text-green-600 hover:text-green-700">
              Retour aux vidéos
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
            to="/videos" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux vidéos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {video.video_type === 'youtube' && video.youtube_id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}`}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : video.video_type === 'facebook' && 'facebook_iframe' in video && (video as any).facebook_iframe ? (
                    <div className="absolute inset-0">
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: sanitizeFacebookIframe((video as any).facebook_iframe) }} />
                    </div>
                  ) : video.video_type === 'upload' && video.video_url ? (
                    <video
                      src={video.video_url}
                      controls
                      className="w-full h-full"
                      title={video.title}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">Aucune vidéo disponible</div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.created_at ? new Date(video.created_at).toLocaleDateString('fr-FR') : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{'views' in video ? video.views?.toString() : '--'} vues</span>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {video.description || video.excerpt || ''}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Related Videos */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vidéos similaires
              </h2>
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo: any) => (
                  <Card key={relatedVideo.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/videos/${relatedVideo.id}`}>
                      <div className="flex">
                        <div className="relative w-32 h-20 flex-shrink-0">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${relatedVideo.thumbnail_url || '/placeholder.svg'})` }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 text-xs rounded">
                            {relatedVideo.duration ? `${Math.floor(relatedVideo.duration / 60)}:${(relatedVideo.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                          </div>
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedVideo.title}
                          </h3>
                          <div className="text-xs text-gray-500">
                            <div>{'views' in relatedVideo ? relatedVideo.views?.toString() : '--'} vues</div>
                            <div>{relatedVideo.created_at ? new Date(relatedVideo.created_at).toLocaleDateString('fr-FR') : ''}</div>
                          </div>
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
    </Layout>
  );
};

export default VideoDetail;
