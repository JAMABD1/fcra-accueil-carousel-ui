
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  id: number;
  title: string;
  date: string;
  author?: string;
  image: string;
  excerpt: string;
  tags: string[];
  featured?: boolean;
}

const NewsCard = ({ id, title, date, author, image, excerpt, tags, featured = false }: NewsCardProps) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/actualites/${id}`);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className={featured ? "md:flex" : ""}>
        <div className={featured ? "md:w-1/2" : ""}>
          <div 
            className={`bg-cover bg-center ${featured ? 'h-64 md:h-full' : 'h-48'}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        </div>
        <div className={featured ? "md:w-1/2" : ""}>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              {author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
              )}
            </div>

            <h3 className={`font-bold text-gray-900 mb-3 ${featured ? 'text-2xl' : 'text-lg'}`}>
              {title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {excerpt}
            </p>
            
            <Button 
              onClick={handleReadMore}
              className="bg-green-600 hover:bg-green-700"
              size={featured ? "default" : "sm"}
            >
              Lire la suite
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
