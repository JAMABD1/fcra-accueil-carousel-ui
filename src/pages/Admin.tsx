
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
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticlesManager from "@/components/admin/ArticlesManager";

const adminMenuItems = [
  { title: "Tableau de bord", icon: LayoutDashboard, id: "dashboard" },
  { title: "Actualités", icon: FileText, id: "news" },
  { title: "Utilisateurs", icon: Users, id: "users" },
  { title: "Administrations", icon: Building, id: "administrations" },
  { title: "Centres", icon: Activity, id: "centers" },
  { title: "Activités", icon: Calendar, id: "activities" },
  { title: "Écoles", icon: GraduationCap, id: "schools" },
  { title: "Vidéos", icon: Video, id: "videos" },
  { title: "Photos", icon: Image, id: "photos" },
  { title: "Bibliothèque", icon: BookOpen, id: "library" },
  { title: "Paramètres", icon: Settings, id: "settings" },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% ce mois</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles Publiés</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12% ce mois</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Centres Actifs</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">+2 nouveaux</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activités</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+8 cette semaine</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité Récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouvel article publié</p>
                        <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Utilisateur inscrit</p>
                        <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Centre mis à jour</p>
                        <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveSection("news")}
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Nouvel Article</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Gérer Utilisateurs</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Building className="h-6 w-6" />
                      <span className="text-sm">Ajouter Centre</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Nouvelle Activité</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case "news":
        return <ArticlesManager />;
        
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
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
              <Badge variant="secondary">En ligne</Badge>
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
