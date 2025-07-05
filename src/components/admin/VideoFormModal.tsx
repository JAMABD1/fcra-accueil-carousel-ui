import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import VideoBasicFields from "./VideoBasicFields";
import VideoUpload from "./VideoUpload";
import VideoSettings from "./VideoSettings";
import TagSelector from "./TagSelector";

interface VideoFormData {
  title: string;
  description: string;
  excerpt: string;
  video: FileList | null;
  thumbnail: FileList | null;
  author: string;
  tags: string[];
  featured: boolean;
  status: string;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  video_url: string;
  thumbnail_url: string | null;
  author: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: string | null;
  duration: number | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

interface VideoFormModalProps {
  video?: Video | null;
  onSuccess: () => void;
}

const VideoFormModal = ({ video, onSuccess }: VideoFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      excerpt: "",
      video: null,
      thumbnail: null,
      author: "",
      tags: [],
      featured: false,
      status: "draft",
    },
  });

  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title,
        description: video.description || "",
        excerpt: video.excerpt || "",
        video: null,
        thumbnail: null,
        author: video.author || "",
        tags: video.tags || [],
        featured: video.featured || false,
        status: video.status || "draft",
      });
    }
  }, [video, form]);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let videoUrl = video?.video_url || "";
      let thumbnailUrl = video?.thumbnail_url || "";
      let duration = video?.duration || null;
      let fileSize = video?.file_size || null;

      // Upload video if provided
      if (data.video && data.video[0]) {
        setUploadProgress(25);
        const videoFile = data.video[0];
        const videoPath = `${Date.now()}-${videoFile.name}`;
        videoUrl = await uploadFile(videoFile, 'videos', videoPath);
        
        // Get video duration and file size
        duration = Math.floor(await getVideoDuration(videoFile));
        fileSize = videoFile.size;
        setUploadProgress(50);
      }

      // Upload thumbnail if provided
      if (data.thumbnail && data.thumbnail[0]) {
        setUploadProgress(75);
        const thumbnailFile = data.thumbnail[0];
        const thumbnailPath = `${Date.now()}-${thumbnailFile.name}`;
        thumbnailUrl = await uploadFile(thumbnailFile, 'video-thumbnails', thumbnailPath);
      }

      setUploadProgress(90);

      const videoData = {
        title: data.title,
        description: data.description,
        excerpt: data.excerpt,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        author: data.author,
        tags: data.tags,
        featured: data.featured,
        status: data.status,
        duration,
        file_size: fileSize,
      };

      let result;
      if (video) {
        result = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', video.id);
      } else {
        result = await supabase
          .from('videos')
          .insert([videoData]);
      }

      if (result.error) throw result.error;

      setUploadProgress(100);
      
      toast({
        title: "Succès",
        description: video ? "Vidéo mise à jour avec succès" : "Vidéo créée avec succès",
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la vidéo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <VideoBasicFields control={form.control} />
        
        <VideoUpload 
          control={form.control} 
          existingVideoUrl={video?.video_url}
          existingThumbnailUrl={video?.thumbnail_url}
        />
        
        <TagSelector
          control={form.control}
          name="tags"
          label="Tags"
        />
        
        <VideoSettings control={form.control} />

        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload en cours...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {video ? "Mise à jour..." : "Création..."}
              </>
            ) : (
              video ? "Mettre à jour" : "Créer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VideoFormModal;