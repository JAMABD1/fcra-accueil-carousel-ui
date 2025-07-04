
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Actualites from "./pages/Actualites";
import Administrations from "./pages/Administrations";
import Centres from "./pages/Centres";
import Activites from "./pages/Activites";
import Medias from "./pages/Medias";
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
          <Route path="/administrations" element={<Administrations />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/medias" element={<Medias />} />
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
