import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import { Article } from "@/components/admin/ArticlesManager";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const imagesRef = useRef<HTMLDivElement | null>(null);

  // Fetch article from Supabase
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Article;
    },
    enabled: !!id
  });

  // Fetch tags to map IDs -> names
  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data as { id: string; name: string }[];
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
                <Carousel className="w-full">
                  <CarouselContent>
                    {article.images.map((imageUrl, index) => (
                      <CarouselItem key={index}>
                        <div className="h-96 bg-cover bg-center relative">
                          <img 
                            src={imageUrl} 
                            alt={`${article.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {article.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
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