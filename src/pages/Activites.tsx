
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { BookOpen, Users, Heart, Briefcase, Stethoscope, Sprout, Activity, Calendar, FileText, Video, Camera } from "lucide-react";

const Activites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch activities from the database
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          sections(id, title),
          videos(id, title),
          photos(id, title),
          tags(id, name, color)
        `)
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Get unique categories from tags
  const categories = [...new Set(activities?.filter(activity => activity.tags?.name).map(activity => activity.tags?.name))];

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || activity.tags?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  // Get appropriate icon based on activity content
  const getActivityIcon = (activity: any) => {
    if (activity.sections?.title) {
      return FileText;
    }
    if (activity.videos?.title) {
      return Video;
    }
    if (activity.photos?.title) {
      return Camera;
    }
    return Activity;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des activités...</p>
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
              <p className="text-red-600">Erreur lors du chargement des activités</p>
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
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Activités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez nos diverses activités et programmes qui transforment des vies à travers Madagascar
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
                className={selectedCategory === "" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Toutes
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Activities Grid */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory 
                  ? "Essayez de modifier vos critères de recherche" 
                  : "Aucune activité n'est disponible pour le moment"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity);
                return (
                  <Card 
                    key={activity.id} 
                    className="hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        {activity.tags && (
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              borderColor: activity.tags.color,
                              color: activity.tags.color
                            }}
                          >
                            {activity.tags.name}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {activity.title}
                      </h3>

                      {activity.subtitle && (
                        <p className="text-sm text-gray-500 mb-3">
                          {activity.subtitle}
                        </p>
                      )}
                      
                      {activity.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {activity.description}
                        </p>
                      )}

                      {/* Content Information */}
                      <div className="space-y-2 mb-4">
                        {activity.sections && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>Section: {activity.sections.title}</span>
                          </div>
                        )}
                        {activity.videos && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Video className="h-4 w-4" />
                            <span>Vidéo: {activity.videos.title}</span>
                          </div>
                        )}
                        {activity.photos && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Camera className="h-4 w-4" />
                            <span>Photo: {activity.photos.title}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          En savoir plus
                        </Button>
                        <span className="text-xs text-gray-500">
                          #{activity.sort_order}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-green-600 rounded-lg p-8 mt-16 text-center text-white animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez-nous !
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Participez à nos activités et contribuez au développement de votre communauté
            </p>
            <Button variant="outline" className="bg-white text-green-600 hover:bg-gray-100">
              Devenir bénévole
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activites;
