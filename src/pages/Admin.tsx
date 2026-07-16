
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Building, 
  GraduationCap,
  Activity,
  Video,
  Image,
  BookOpen,
  LogOut,
  Bell,
  BarChart3,
  Calendar,
  MessageSquare,
  Hash,
  ImageIcon,
  TrendingUp,
  Layers,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "@/lib/auth/middleware";
import ArticlesManager from "@/components/admin/ArticlesManager";
import TagsManager from "@/components/admin/TagsManager";
import VideosManager from "@/components/admin/VideosManager";
import PhotosManager from "@/components/admin/PhotosManager";
import HeroManager from "@/components/admin/HeroManager";
import ImpactManager from "@/components/admin/ImpactManager";
import SectionsManager from "@/components/admin/SectionsManager";
import DirectorsManager from "@/components/admin/DirectorsManager";
import CentresManager from "@/components/admin/CentresManager";
import CoordonnesManager from "@/components/admin/CoordonnesManager";
import { ActivitiesManager } from "@/components/admin/ActivitiesManager";
import SchoolsManager from "@/components/admin/SchoolsManager";
import LibraryManager from "@/components/admin/LibraryManager";
import PartnersManager from "@/components/admin/PartnersManager";
import AdminDashboard from "@/components/admin/AdminDashboard";

const adminMenuItems = [
  { title: "Tableau de bord", icon: LayoutDashboard, id: "dashboard" },
  { title: "Heroes", icon: ImageIcon, id: "heroes" },
  { title: "Impacts", icon: TrendingUp, id: "impacts" },
  { title: "Sections", icon: Layers, id: "sections" },
  { title: "Actualités", icon: FileText, id: "news" },
  { title: "Tags", icon: Hash, id: "tags" },
  { title: "Directeurs", icon: Users, id: "directors" },
  { title: "Centres", icon: Building, id: "centres" },
  { title: "Coordonnées", icon: MapPin, id: "coordonnes" },
  { title: "Utilisateurs", icon: Users, id: "users" },
  { title: "Administrations", icon: Building, id: "administrations" },
  { title: "Activités", icon: Calendar, id: "activities" },
  { title: "Écoles", icon: GraduationCap, id: "schools" },
  { title: "Vidéos", icon: Video, id: "videos" },
  { title: "Photos", icon: Image, id: "photos" },
  { title: "Bibliothèque", icon: BookOpen, id: "library" },
  { title: "Partenaires", icon: Users, id: "partners" },
  { title: "Paramètres", icon: Settings, id: "settings" },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard onNavigate={setActiveSection} />;


      case "heroes":
        return <HeroManager />;
        
      case "impacts":
        return <ImpactManager />;
        
      case "sections":
        return <SectionsManager />;
        
      case "news":
        return <ArticlesManager />;
        
      case "tags":
        return <TagsManager />;
        
      case "directors":
        return <DirectorsManager />;
        
      case "centres":
        return <CentresManager />;
        
      case "coordonnes":
        return <CoordonnesManager />;
        
      case "activities":
        return <ActivitiesManager />;
        
      case "videos":
        return <VideosManager />;
        
      case "photos":
        return <PhotosManager />;
        
      case "schools":
        return <SchoolsManager />;
        
      case "library":
        return <LibraryManager />;
        
      case "partners":
        return <PartnersManager />;
        
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Section: {activeSection}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenu de la section {activeSection} sera implémenté ici.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <SidebarProvider className="admin-layout">
      <div className="admin-shell-bg min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg">FCRA Admin</h2>
                <p className="text-xs text-muted-foreground">Panneau d'administration</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Administrateur</p>
                <p className="text-xs text-muted-foreground">admin@fcra.com</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-white">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">
                  {adminMenuItems.find(item => item.id === activeSection)?.title || "Tableau de bord"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenue dans votre espace d'administration
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge variant="secondary"><span className="admin-live-dot mr-2" />En ligne</Badge>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
