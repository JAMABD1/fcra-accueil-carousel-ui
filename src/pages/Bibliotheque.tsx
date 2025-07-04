
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, Search, FileText, Book, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Bibliotheque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const documents = [
    {
      id: 1,
      name: "Guide de l'Étudiant 2024",
      description: "Manuel complet pour les nouveaux étudiants avec toutes les informations nécessaires.",
      format: "PDF",
      size: "2.5 MB",
      date: "10 Déc 2024",
      downloads: 245,
      category: "guide",
      icon: Book
    },
    {
      id: 2,
      name: "Formulaire d'Inscription",
      description: "Dossier d'inscription pour l'année académique 2024-2025.",
      format: "PDF",
      size: "1.2 MB",
      date: "5 Déc 2024",
      downloads: 567,
      category: "formulaire",
      icon: FileText
    },
    {
      id: 3,
      name: "Calendrier Académique",
      description: "Planning des cours et examens pour l'année 2024-2025.",
      format: "PDF",
      size: "800 KB",
      date: "1 Déc 2024",
      downloads: 189,
      category: "calendrier",
      icon: Calendar
    },
    {
      id: 4,
      name: "Règlement Intérieur",
      description: "Règles et procédures de l'établissement à respecter.",
      format: "PDF",
      size: "1.8 MB",
      date: "25 Nov 2024",
      downloads: 123,
      category: "reglement",
      icon: Settings
    },
    {
      id: 5,
      name: "Brochure des Formations",
      description: "Présentation détaillée de toutes nos formations disponibles.",
      format: "PDF",
      size: "3.2 MB",
      date: "20 Nov 2024",
      downloads: 334,
      category: "formation",
      icon: Book
    },
    {
      id: 6,
      name: "Guide des Associations Étudiantes",
      description: "Informations sur les différentes associations et clubs étudiants.",
      format: "PDF",
      size: "1.5 MB",
      date: "15 Nov 2024",
      downloads: 156,
      category: "association",
      icon: Users
    }
  ];

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "guide", label: "Guides" },
    { value: "formulaire", label: "Formulaires" },
    { value: "calendrier", label: "Calendriers" },
    { value: "reglement", label: "Règlements" },
    { value: "formation", label: "Formations" },
    { value: "association", label: "Associations" }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bibliothèque
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accédez à tous nos documents et ressources
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocuments.map((doc) => {
              const IconComponent = doc.icon;
              return (
                <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{doc.name}</h3>
                        <p className="text-gray-600 mb-3 text-sm">{doc.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {doc.format}
                          </span>
                          <span>{doc.size}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {doc.downloads} téléchargements
                          </p>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucun document trouvé{searchTerm && ` pour "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bibliotheque;
