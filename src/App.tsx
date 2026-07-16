
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import SignUp from "./pages/SignUp";
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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:slug" element={<ArticleDetail />} />
          <Route path="/administrations" element={<Administrations />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/centres/:slug" element={<CentreDetail />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/activites/:slug" element={<ActiviteDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:slug" element={<VideoDetail />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/photos/:slug" element={<PhotoDetail />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="/ecoles/:slug" element={<EcoleDetail />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/sections/:slug" element={<SectionDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
