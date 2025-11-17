
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, Search, FileText, Book, Users, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLibraryItems } from "@/lib/db/queries";
import { useToast } from "@/hooks/use-toast";

// Define LibraryItem type locally
interface LibraryItem {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  downloads: number;
  featured: boolean;
  status: string;
  author: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Bibliotheque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [documents, setDocuments] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "jurisprudence", label: "Jurisprudence (Fiqh)" },
    { value: "sagesse", label: "Sagesse (Hikma)" },
    { value: "theologie", label: "Théologie (Aqida)" },
    { value: "hadith", label: "Hadith" },
    { value: "tafsir", label: "Exégèse (Tafsir)" },
    { value: "histoire", label: "Histoire Islamique" },
    { value: "biographie", label: "Biographies (Sira)" },
    { value: "spiritualite", label: "Spiritualité (Tasawwuf)" },
    { value: "education", label: "Éducation Islamique" },
    { value: "general", label: "Général" }
  ];

  // Fetch documents from database
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getLibraryItems({ status: 'published' });
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (docItem: LibraryItem) => {
    try {
      // Increment download count using Drizzle
      const { updateRecord, library } = await import("@/lib/db/queries");
      await updateRecord(library, docItem.id, {
        downloads: (docItem.downloads || 0) + 1
      });

      // Use R2 public URL
      const { getPublicUrl } = await import("@/lib/storage/r2");
      const fileUrl = getPublicUrl(docItem.fileUrl);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = docItem.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Téléchargement",
        description: "Le document a été téléchargé avec succès.",
      });

      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === docItem.id 
          ? { ...doc, downloads: (doc.downloads || 0) + 1 }
          : doc
      ));
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return FileText;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return FileText;
    if (fileType.includes('zip') || fileType.includes('compressed')) return FileText;
    return FileText;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      jurisprudence: Book,
      sagesse: Book,
      theologie: Book,
      hadith: Book,
      tafsir: Book,
      histoire: Book,
      biographie: Book,
      spiritualite: Book,
      education: Book,
      general: FileText
    };
    return iconMap[category] || FileText;
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      jurisprudence: "bg-blue-100 text-blue-800",
      sagesse: "bg-green-100 text-green-800",
      theologie: "bg-purple-100 text-purple-800",
      hadith: "bg-indigo-100 text-indigo-800",
      tafsir: "bg-yellow-100 text-yellow-800",
      histoire: "bg-orange-100 text-orange-800",
      biographie: "bg-pink-100 text-pink-800",
      spiritualite: "bg-teal-100 text-teal-800",
      education: "bg-emerald-100 text-emerald-800",
      general: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={categoryColors[category] || categoryColors.general}>
        {categories.find(cat => cat.value === category)?.label || category}
      </Badge>
    );
  };

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

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des documents...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocuments.map((doc) => {
                const IconComponent = getCategoryIcon(doc.category);
                return (
                  <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{doc.title}</h3>
                            {doc.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-3 text-sm">{doc.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {doc.fileType.split('/')[1]?.toUpperCase() || 'PDF'}
                            </span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(doc.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                {doc.downloads || 0} téléchargements
                              </p>
                              {getCategoryBadge(doc.category)}
                            </div>
                            <Button 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleDownload(doc)}
                            >
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
          )}

          {!isLoading && filteredDocuments.length === 0 && (
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
