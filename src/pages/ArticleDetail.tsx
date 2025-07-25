import { useParams, Link } from "react-router-dom";
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

const ArticleDetail = () => {
  const { id } = useParams();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

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
              <div className="relative">
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
                    {article.tags?.map((tag) => (
                      <Badge key={tag} className="bg-green-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.created_at)}</span>
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
                  {article.tags?.map((tag) => (
                    <Badge key={tag} className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-6 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.created_at)}</span>
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {article.excerpt && (
                  <div className="text-lg text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    {article.excerpt}
                  </div>
                )}
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Partager cet article</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copier le lien
                  </Button>
                </div>

                {article.featured && (
                  <>
                    <hr className="my-6" />
                    <div className="text-center">
                      <Badge className="bg-yellow-500 text-white">
                        Article en vedette
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;