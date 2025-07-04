
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Center {
  id: number;
  name: string;
  city: string;
  services: string[];
  position: { top: string; left: string };
}

const MapCenters = () => {
  const centers: Center[] = [
    {
      id: 1,
      name: "Centre Antananarivo",
      city: "Antananarivo",
      services: ["Éducation", "Formation", "Social"],
      position: { top: "25%", left: "70%" }
    },
    {
      id: 2,
      name: "Centre Toamasina",
      city: "Toamasina",
      services: ["Formation", "Santé"],
      position: { top: "30%", left: "85%" }
    },
    {
      id: 3,
      name: "Centre Fianarantsoa",
      city: "Fianarantsoa",
      services: ["Éducation", "Agriculture"],
      position: { top: "50%", left: "75%" }
    },
    {
      id: 4,
      name: "Centre Mahajanga",
      city: "Mahajanga",
      services: ["Pêche", "Commerce"],
      position: { top: "20%", left: "45%" }
    }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-center mb-6">NOS CENTRES</h3>
        
        {/* Madagascar Map */}
        <div className="relative mx-auto" style={{ width: "600px", height: "700px" }}>
          <svg
            viewBox="0 0 400 600"
            className="w-full h-full"
            fill="#6b9b7a"
          >
            <path d="M200 50 C250 45, 300 80, 320 150 C340 220, 330 280, 310 350 C290 420, 270 480, 250 530 C230 580, 200 590, 170 585 C140 580, 120 560, 110 530 C100 500, 95 470, 90 440 C85 410, 80 380, 85 350 C90 320, 100 290, 110 260 C120 230, 130 200, 140 170 C150 140, 160 110, 170 80 C180 65, 190 55, 200 50 Z"/>
          </svg>
          
          {/* Center Markers */}
          {centers.map((center) => (
            <div
              key={center.id}
              className="absolute group cursor-pointer animate-pulse"
              style={{ 
                top: center.position.top, 
                left: center.position.left,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="relative">
                <MapPin 
                  className="w-8 h-8 text-red-600 drop-shadow-lg hover:scale-110 transition-transform duration-200" 
                />
                
                {/* Tooltip */}
                <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <CardContent className="p-3">
                    <h4 className="font-bold text-sm text-green-700">{center.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{center.city}</p>
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((service) => (
                        <span 
                          key={service}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapCenters;
