
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Actualites from "./pages/Actualites";
import ArticleDetail from "./pages/ArticleDetail";
import Administrations from "./pages/Administrations";
import Centres from "./pages/Centres";
import Activites from "./pages/Activites";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Photos from "./pages/Photos";
import PhotoDetail from "./pages/PhotoDetail";
import Bibliotheque from "./pages/Bibliotheque";
import Ecoles from "./pages/Ecoles";
import EcoleDetail from "./pages/EcoleDetail";
import SectionDetail from "./pages/SectionDetail";
import Sections from "./pages/Sections";
import CentreDetail from "./pages/CentreDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ActiviteDetail from "./pages/ActiviteDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:id" element={<ArticleDetail />} />
          <Route path="/administrations" element={<Administrations />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/centres/:id" element={<CentreDetail />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/activites/:id" element={<ActiviteDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="/ecoles/:id" element={<EcoleDetail />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/sections/:id" element={<SectionDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
