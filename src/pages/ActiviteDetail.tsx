import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Video, Camera } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getActivityWithRelations } from "@/lib/db/queries";

// Function to process markdown content and fix only broken markdown syntax
const processMarkdownContent = (content: string): string => {
  if (!content) return '';
  
  // Only fix broken markdown patterns, don't restructure the content
  let processedContent = content
    // Fix bold text patterns - look for ****text patterns and convert to **text**
    .replace(/\*\*\*\*([^*]+?)(\*\*\*\*|$)/g, '**$1**')
    .replace(/\*\*\*\*([^*]+)/g, '**$1**')
    // Fix any remaining quadruple asterisks at the start of bold text
    .replace(/\*{4,}([^*]+)\*{2}/g, '**$1**')
    // Fix specific pattern from your content: "****Grâce au partenariat"
    .replace(/\*\*\*\*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ][^*]*?)(\s|$)/g, '**$1**$2')
    // Clean up any remaining multiple asterisks that aren't proper markdown
    .replace(/\*{3}([^*]+)\*{3}/g, '**$1**')  // ***text*** → **text**
    .replace(/\*{5,}/g, '**')  // *****+ → **
    // Clean up spacing around asterisks only
    .replace(/\s+\*\*/g, ' **')
    .replace(/\*\*\s+/g, '** ')
    .trim();
  
  return processedContent;
};

const ActiviteDetail = () => {
  const { id } = useParams();

  // State for Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch activity from database
  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      if (!id) return null;
      return await getActivityWithRelations(id);
    },
    enabled: !!id
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
          {activity.photoGroup && activity.photoGroup.images && activity.photoGroup.images.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {activity.photoGroup.images.map((imageUrl: string, idx: number) => (
                  <img
                    key={idx}
                    src={imageUrl}
                    alt={activity.photoGroup.title}
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
                images={activity.photoGroup.images}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                initialIndex={currentImageIndex}
                title={activity.photoGroup.title}
              />
            </div>
          )}
          {activity.description && (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-6">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Ensure strong/bold elements are properly rendered
                  strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                  b: ({children}) => <b className="font-bold text-gray-900">{children}</b>,
                  // Ensure em/italic elements are properly rendered
                  em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                  i: ({children}) => <i className="italic text-gray-800">{children}</i>,
                  // Ensure headings are properly styled
                  h1: ({children}) => <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 mt-6 leading-tight">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 mt-5 leading-tight">{children}</h3>,
                  h4: ({children}) => <h4 className="text-lg md:text-xl font-medium text-gray-700 mb-3 mt-4">{children}</h4>,
                  h5: ({children}) => <h5 className="text-base md:text-lg font-medium text-gray-600 mb-2 mt-4">{children}</h5>,
                  h6: ({children}) => <h6 className="text-sm md:text-base font-medium text-gray-600 mb-2 mt-3">{children}</h6>,
                  // Ensure paragraphs have proper spacing
                  p: ({children}) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
                  // Ensure lists are properly styled
                  ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                  // Ensure blockquotes are styled
                  blockquote: ({children}) => <blockquote className="border-l-4 border-green-500 bg-green-50 pl-6 pr-4 py-4 mb-6 italic text-gray-700">{children}</blockquote>,
                  // Ensure code blocks are styled
                  code: ({className, children, ...props}) => {
                    const isInline = !className || !className.includes('language-');
                    return isInline ? 
                      <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded text-sm font-mono" {...props}>{children}</code> : 
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono" {...props}>{children}</code>;
                  },
                  pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                }}
              >
                {processMarkdownContent(activity.description)}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ActiviteDetail; 