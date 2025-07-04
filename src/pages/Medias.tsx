
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Image, Download, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Medias = () => {
  const videos = [
    {
      id: 1,
      title: "Inauguration du Centre de Formation",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      duration: "5:30",
      date: "15 Déc 2024",
      views: "1.2K"
    },
    {
      id: 2,
      title: "Cérémonie de Remise des Diplômes",
      thumbnail: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
      duration: "12:45",
      date: "20 Nov 2024",
      views: "856"
    },
    {
      id: 3,
      title: "Formation Professionnelle - Témoignages",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      duration: "8:15",
      date: "5 Nov 2024",
      views: "2.1K"
    },
    {
      id: 4,
      title: "Journée Portes Ouvertes 2024",
      thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      duration: "15:20",
      date: "28 Oct 2024",
      views: "945"
    }
  ];

  const photos = [
    {
      id: 1,
      title: "Atelier de Formation Technique",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      date: "18 Déc 2024",
      category: "Formation"
    },
    {
      id: 2,
      title: "Équipe Administrative",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
      date: "12 Déc 2024",
      category: "Équipe"
    },
    {
      id: 3,
      title: "Nouvelle Infrastructure",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      date: "8 Déc 2024",
      category: "Infrastructure"
    },
    {
      id: 4,
      title: "Étudiants en Action",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      date: "25 Nov 2024",
      category: "Étudiants"
    },
    {
      id: 5,
      title: "Cérémonie Officielle",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      date: "20 Nov 2024",
      category: "Événement"
    },
    {
      id: 6,
      title: "Laboratoire Informatique",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      date: "15 Nov 2024",
      category: "Formation"
    }
  ];

  const applications = [
    {
      id: 1,
      name: "Guide de l'Étudiant 2024",
      description: "Manuel complet pour les nouveaux étudiants",
      format: "PDF",
      size: "2.5 MB",
      date: "10 Déc 2024",
      downloads: 245
    },
    {
      id: 2,
      name: "Formulaire d'Inscription",
      description: "Dossier d'inscription pour l'année académique",
      format: "PDF",
      size: "1.2 MB",
      date: "5 Déc 2024",
      downloads: 567
    },
    {
      id: 3,
      name: "Calendrier Académique",
      description: "Planning des cours et examens 2024-2025",
      format: "PDF",
      size: "800 KB",
      date: "1 Déc 2024",
      downloads: 189
    },
    {
      id: 4,
      name: "Règlement Intérieur",
      description: "Règles et procédures de l'établissement",
      format: "PDF",
      size: "1.8 MB",
      date: "25 Nov 2024",
      downloads: 123
    }
  ];

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Médias
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos vidéos, photos et documents
            </p>
          </div>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Vidéos
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${video.thumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                            <Play className="w-6 h-6 mr-2" />
                            Regarder
                          </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-lg">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{video.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{video.views} vues</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${photo.image})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                            <Eye className="w-5 h-5 mr-2" />
                            Voir
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                          {photo.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{photo.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{photo.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <Card key={app.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{app.name}</h3>
                          <p className="text-gray-600 mb-3">{app.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {app.format}
                            </span>
                            <span>{app.size}</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{app.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Button className="bg-green-600 hover:bg-green-700 mb-2">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                          <p className="text-xs text-gray-500">{app.downloads} téléchargements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Medias;
