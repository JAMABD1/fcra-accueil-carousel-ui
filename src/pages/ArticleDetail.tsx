import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { articles } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import { Article } from "@/components/admin/ArticlesManager";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useRef, useState } from "react";

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

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined);

  // Fetch article from database
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const result = await db.select().from(articles).where(eq(articles.id, id!)).limit(1);
      return result[0] as Article;
    },
    enabled: !!id
  });

  // Fetch tags to map IDs -> names
  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { getTags } = await import("@/lib/db/queries");
      return await getTags();
    }
  });

  const displayTags = (article?.tags || []).map((tagIdOrName) => {
    // If it's already a name (not found as an ID), keep as-is
    const found = allTags.find(t => t.id === tagIdOrName);
    return found ? found.name : (tagIdOrName as string);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // If navigated with a focus hint from the index, focus the carousel area on load
  useEffect(() => {
    if ((location.state as any)?.focus === 'images' && imagesRef.current) {
      const id = requestAnimationFrame(() => {
        imagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [location.state, article]);

  // Auto-advance images every 1.5s
  useEffect(() => {
    if (!carouselApi || !article?.images || article.images.length <= 1) return;
    const timer = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [carouselApi, article?.images]);

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

  if (!article) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <Link to="/actualites">
              <Button className="bg-green-600 hover:bg-green-700">
                Retour aux actualités
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
            <Link to="/actualites">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux actualités
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Image Carousel */}
            {article.images && article.images.length > 0 && (
              <div className="relative" ref={imagesRef}>
                <Carousel className="w-full" setApi={setCarouselApi} opts={{ loop: true }}>
                  <CarouselContent>
                    {article.images.map((imageUrl, index) => (
                      <CarouselItem key={index}>
                        <div className="h-96 bg-cover bg-center relative">
                          <img 
                            src={imageUrl} 
                            alt={`${article.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none"></div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {article.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4 z-10" />
                      <CarouselNext className="right-4 z-10" />
                    </>
                  )}
                </Carousel>
                
                {/* Article Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayTags.map((tagName) => (
                      <Badge key={tagName} className="bg-green-600 text-white">
                        {tagName}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate((article as any).published_at || article.created_at)}</span>
                    </div>
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for articles without images */}
            {(!article.images || article.images.length === 0) && (
              <div className="p-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {displayTags.map((tagName) => (
                    <Badge key={tagName} className="bg-white/20 text-white border-white/30">
                      {tagName}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-6 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate((article as any).published_at || article.created_at)}</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                 
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                >
                 
                  
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
                    {processMarkdownContent(article.content)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            {/* Removed 'Partager cet article' section as requested */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;