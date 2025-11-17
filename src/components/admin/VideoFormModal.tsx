import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRecord, updateRecord } from "@/lib/db/queries";
import { uploadVideo, uploadImage } from "@/lib/storage/r2";
import { videos } from "@/lib/db/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video, Youtube } from "lucide-react";
import VideoUpload from "./VideoUpload";
import TagSelector from "./TagSelector";

interface VideoFormData {
  title: string;
  description: string;
  excerpt: string;
  video_type: string;
  video: FileList | null;
  youtube_id: string;
  facebook_iframe: string;
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
  video_url?: string | null;
  videoUrl?: string | null;
  video_type?: string | null;
  videoType?: string | null;
  youtube_id?: string | null;
  youtubeId?: string | null;
  facebook_iframe?: string | null;
  facebookIframe?: string | null;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  author: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: string | null;
  duration: number | null;
  file_size?: number | null;
  fileSize?: number | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
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
      video_type: "upload",
      video: null,
      youtube_id: "",
      facebook_iframe: "",
      thumbnail: null,
      author: "",
      tags: [],
      featured: false,
      status: "draft",
    },
  });

  const videoType = form.watch("video_type");

  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title,
        description: video.description || "",
        excerpt: video.excerpt || "",
        video_type: video.video_type || video.videoType || "upload",
        video: null,
        youtube_id: video.youtube_id || video.youtubeId || "",
        facebook_iframe: video.facebook_iframe || video.facebookIframe || "",
        thumbnail: null,
        author: video.author || "",
        tags: video.tags || [],
        featured: video.featured || false,
        status: video.status || "draft",
      });
    }
  }, [video, form]);

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

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const onSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let videoUrl = video?.video_url || video?.videoUrl || "";
      let thumbnailUrl = video?.thumbnail_url || video?.thumbnailUrl || "";
      let duration = video?.duration || null;
      let fileSize = video?.file_size || video?.fileSize || null;

      if (data.video_type === "upload") {
        // Handle uploaded video
        if (data.video && data.video[0]) {
          setUploadProgress(25);
          const videoFile = data.video[0];
          const uploadResult = await uploadVideo(videoFile, 'videos', 'video-');
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || "Échec de l'upload vidéo");
          }
          videoUrl = uploadResult.url;
          
          // Get video duration and file size
          duration = Math.floor(await getVideoDuration(videoFile));
          fileSize = videoFile.size;
          setUploadProgress(50);
        } else if (!videoUrl) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner un fichier vidéo.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else if (data.video_type === "youtube") {
        // Handle YouTube video
        if (!data.youtube_id) {
          toast({
            title: "Erreur",
            description: "L'ID YouTube est requis pour les vidéos YouTube.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        videoUrl = null;
        duration = null;
        fileSize = null;
        setUploadProgress(50);
      } else if (data.video_type === "facebook") {
        if (!data.facebook_iframe) {
          toast({
            title: "Erreur",
            description: "Le code iframe Facebook est requis pour les vidéos Facebook.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        videoUrl = null;
        duration = null;
        fileSize = null;
        setUploadProgress(50);
      }

      // Upload thumbnail if provided
      if (data.thumbnail && data.thumbnail[0]) {
        setUploadProgress(75);
        const thumbnailFile = data.thumbnail[0];
        const thumbnailResult = await uploadImage(thumbnailFile, 'video-thumbnails', 'thumb-');
        if (!thumbnailResult.success || !thumbnailResult.url) {
          throw new Error(thumbnailResult.error || "Échec de l'upload de la miniature");
        }
        thumbnailUrl = thumbnailResult.url;
      }

      setUploadProgress(90);

      const videoData = {
        title: data.title,
        description: data.description,
        excerpt: data.excerpt,
        videoUrl,
        videoType: data.video_type,
        youtubeId: data.video_type === "youtube" ? extractYouTubeId(data.youtube_id) : null,
        facebookIframe: data.video_type === "facebook" ? data.facebook_iframe : null,
        thumbnailUrl,
        author: data.author,
        tags: data.tags,
        featured: data.featured,
        status: data.status,
        duration,
        fileSize,
      };

      if (video) {
        await updateRecord(videos, video.id, videoData);
      } else {
        await createRecord(videos, videoData);
      }

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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Informations de base</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la vidéo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée de la vidéo"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Excerpt */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Résumé court de la vidéo"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'auteur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Video Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Youtube className="h-5 w-5" />
                <span>Type de vidéo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="video_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source de la vidéo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upload">Télécharger une vidéo</SelectItem>
                        <SelectItem value="youtube">Vidéo YouTube</SelectItem>
                        <SelectItem value="facebook">Vidéo Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {videoType === "youtube" && (
                <FormField
                  control={form.control}
                  name="youtube_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID ou URL YouTube</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ ou dQw4w9WgXcQ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {videoType === "facebook" && (
                <FormField
                  control={form.control}
                  name="facebook_iframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code iframe Facebook</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Collez ici le code iframe Facebook fourni"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {videoType === "upload" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fichier vidéo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miniature (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagSelector
                control={form.control}
                name="tags"
                label="Tags"
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Vidéo en vedette</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher cette vidéo en avant
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {uploadProgress > 0 && (
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
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
    </div>
  );
};

export default VideoFormModal;