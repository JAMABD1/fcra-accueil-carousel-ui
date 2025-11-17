
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles, getTags } from "@/lib/db/queries";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Fetch articles from database
  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      return await getArticles({ status: 'published' });
    }
  });

  // Fetch all tags for mapping
  const { data: allTagsData = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Create a mapping of tag IDs to tag objects
  const tagIdToTag = allTagsData.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {} as Record<string, any>);

  // Transform database articles to match the expected format
  const transformedArticles = articles.map(article => ({
    id: article.id,
    title: article.title,
    date: new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    author: article.author || 'Admin FCRA',
    image: article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg',
    excerpt: article.excerpt || article.content.substring(0, 200) + '...',
    tags: article.tags || [],
    tagObjects: (article.tags || []).map(tagId => tagIdToTag[tagId]).filter(Boolean),
    content: article.content,
    featured: article.featured || false
  }));

  // Get all unique tag names from articles
  const allTags = [...new Set(transformedArticles.flatMap(article => 
    article.tagObjects.map(tag => tag.name)
  ))];

  // Filter articles based on search term and selected tag
  const filteredNews = transformedArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "" || article.tagObjects.some(tag => tag.name === selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSearch = () => {
    // Search is already handled by filteredNews
    console.log("Searching for:", searchTerm);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">
                Erreur lors du chargement des articles. Veuillez réessayer plus tard.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Actualités FCRA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Restez informés de nos dernières nouvelles, événements et réalisations
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>

            {/* Tags Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedTag === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("")}
                className={selectedTag === "" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Tous
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <NewsCard
                key={article.id}
                {...article}
                tagObjects={article.tagObjects}
                featured={article.featured || index === 0}
              />
            ))}
          </div>

          {/* Load More */}
          {filteredNews.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="px-8 py-3">
                Charger plus d'articles
              </Button>
            </div>
          )}

          {/* No Results */}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {articles.length === 0 
                  ? "Aucun article publié pour le moment."
                  : "Aucun article trouvé pour votre recherche."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Actualites;
