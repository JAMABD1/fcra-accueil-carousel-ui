
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const news = [
    {
      id: 1,
      title: "Cérémonie de Remise des Diplômes 2024",
      date: "15 Décembre 2024",
      author: "Admin FCRA",
      image: "/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png",
      excerpt: "Une cérémonie exceptionnelle pour célébrer la réussite de nos étudiants diplômés. Cette année, nous avons eu l'honneur de remettre plus de 150 diplômes dans diverses spécialités.",
      tags: ["Éducation", "Cérémonie", "Diplômes"],
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 2,
      title: "Nouveau Programme d'Aide aux Orphelins",
      date: "10 Décembre 2024",
      author: "Équipe Social",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      excerpt: "Lancement d'un programme innovant pour soutenir les enfants orphelins avec des bourses d'études et un accompagnement personnalisé.",
      tags: ["Social", "Orphelins", "Programme"],
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 3,
      title: "Formation Professionnelle RVS",
      date: "5 Décembre 2024",
      author: "Centre Formation",
      image: "https://images.unsplash.com/photo-1581091870632-5a5ad36db9c6?w=600&h=400&fit=crop",
      excerpt: "Nouveaux ateliers de formation pour développer les compétences professionnelles dans le secteur du numérique et de l'artisanat.",
      tags: ["Formation", "Professionnelle", "Compétences"],
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 4,
      title: "Projet de Construction d'un Nouveau Centre",
      date: "1 Décembre 2024",
      author: "Direction",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
      excerpt: "Annonce du lancement de la construction d'un nouveau centre d'accueil dans la région d'Antananarivo.",
      tags: ["Construction", "Centre", "Développement"],
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 5,
      title: "Campagne de Sensibilisation Santé",
      date: "28 Novembre 2024",
      author: "Équipe Santé",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      excerpt: "Organisation d'une grande campagne de sensibilisation sur l'hygiène et la prévention des maladies.",
      tags: ["Santé", "Sensibilisation", "Prévention"],
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    }
  ];

  const allTags = [...new Set(news.flatMap(article => article.tags))];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "" || article.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSearch = () => {
    // Search is already handled by filteredNews
    console.log("Searching for:", searchTerm);
  };

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
                featured={index === 0}
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
                Aucun article trouvé pour votre recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Actualites;
