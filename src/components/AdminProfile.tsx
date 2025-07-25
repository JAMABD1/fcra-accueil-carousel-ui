
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface AdminProfileProps {
  name: string;
  title: string;
  
  image: string;
  backgroundColor: string;
}

const AdminProfile = ({ name, title, image, backgroundColor }: AdminProfileProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div 
          className={`${backgroundColor} p-8 flex justify-center`}
        >
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {name}
          </h3>
          <p className="text-gray-600 mb-3">
            {title}
          </p>
         
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProfile;
