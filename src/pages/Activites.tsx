
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { BookOpen, Users, Heart, Briefcase, Stethoscope, Sprout } from "lucide-react";

const Activites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const activities = [
    {
      id: 1,
      title: "Programmes Éducatifs",
      description: "Cours et formations pour tous les niveaux d'éducation, de l'alphabétisation aux formations techniques spécialisées.",
      icon: BookOpen,
      category: "Éducation",
      beneficiaries: 450,
      duration: "Permanent",
      details: "Nos programmes éducatifs couvrent l'enseignement primaire, secondaire et la formation professionnelle."
    },
    {
      id: 2,
      title: "Actions Sociales",
      description: "Aide et soutien aux communautés locales, programmes d'assistance aux familles vulnérables.",
      icon: Heart,
      category: "Social",
      beneficiaries: 320,
      duration: "Continu",
      details: "Distribution de vivres, aide médicale d'urgence, et programmes de réinsertion sociale."
    },
    {
      id: 3,
      title: "Formation Professionnelle",
      description: "Ateliers et formations techniques pour l'insertion professionnelle et l'entrepreneuriat.",
      icon: Briefcase,
      category: "Formation",
      beneficiaries: 280,
      duration: "6-12 mois",
      details: "Formations en informatique, couture, menuiserie, électricité et gestion d'entreprise."
    },
    {
      id: 4,
      title: "Programmes de Santé",
      description: "Campagnes de sensibilisation santé, consultations médicales et programmes de prévention.",
      icon: Stethoscope,
      category: "Santé",
      beneficiaries: 600,
      duration: "Mensuel",
      details: "Consultations gratuites, vaccinations, sensibilisation à l'hygiène et planning familial."
    },
    {
      id: 5,
      title: "Développement Rural",
      description: "Projets agricoles, formation en techniques modernes d'agriculture et développement durable.",
      icon: Sprout,
      category: "Agriculture",
      beneficiaries: 200,
      duration: "Saisonnier",
      details: "Formation en permaculture, distribution de semences et techniques d'irrigation."
    },
    {
      id: 6,
      title: "Projets Spéciaux",
      description: "Initiatives innovantes pour le développement communautaire et l'autonomisation des jeunes.",
      icon: Users,
      category: "Développement",
      beneficiaries: 150,
      duration: "Variable",
      details: "Projets pilotes, innovations sociales et programmes d'autonomisation des femmes."
    }
  ];

  const categories = [...new Set(activities.map(activity => activity.category))];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity, index) => {
              const IconComponent = activity.icon;
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
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {activity.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {activity.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Bénéficiaires:</span>
                        <span className="font-semibold text-green-600">{activity.beneficiaries}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span className="font-semibold">{activity.duration}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-gray-500 text-lg">
                Aucune activité trouvée pour votre recherche.
              </p>
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
