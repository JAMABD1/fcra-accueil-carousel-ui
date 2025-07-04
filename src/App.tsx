
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
import NotFound from "./pages/NotFound";

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
          <Route path="/activites" element={<Activites />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
