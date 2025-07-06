
import { Link, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Actualités", path: "/actualites" },
    { name: "Administrations", path: "/administrations" },
    { name: "Centres", path: "/centres" },
    { name: "Activités", path: "/activites" },
    { name: "Écoles", path: "/ecoles" },
  ];

  const mediaItems = [
    { name: "Vidéos", path: "/videos" },
    { name: "Photos", path: "/photos" },
    { name: "Bibliothèque", path: "/bibliotheque" },
  ];

  const isMediaActive = location.pathname.startsWith("/videos") || 
                       location.pathname.startsWith("/photos") || 
                       location.pathname.startsWith("/bibliotheque");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-green-600 font-bold text-xl">FCRA</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-green-600 ${
                    location.pathname === item.path
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-600 ${
                  isMediaActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-700"
                }`}>
                  Médias
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border">
                  {mediaItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Language and Connect */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                <Globe className="h-4 w-4" />
                <span>fr</span>
              </button>
              <Link 
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Se connecter
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Media Items */}
                <div className="border-t pt-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Médias</div>
                  {mediaItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-6 py-2 text-base font-medium rounded-md transition-colors ${
                        location.pathname === item.path
                          ? "text-green-600 bg-green-50"
                          : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Language and Connect */}
                <div className="border-t pt-2 space-y-1">
                  <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                    <Globe className="h-4 w-4" />
                    <span>Français</span>
                  </button>
                  <Link 
                    to="/login"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4">FCRA</h3>
              <p className="text-gray-300 mb-4">
                Une association à but non lucratif au service de la communauté.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 0344679192</p>
                <p>✉️ jao.lazabdallah83@gmail.com</p>
                <p>📍 Antananarivo</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <div className="space-y-2">
                {navItems.slice(1, 4).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <hr className="border-gray-700 my-8" />
          <div className="text-center text-gray-400">
            <p>&copy; 2025 FCRA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
