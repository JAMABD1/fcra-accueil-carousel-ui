
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  slug: string;
  title: string;
  date: string;
  author?: string;
  image: string;
  excerpt: string;
  tags: string[];
  tagObjects?: Array<{ id: string; name: string; color: string }>;
  featured?: boolean;
}

const NewsCard = ({ id, slug, title, date, author, image, excerpt, tags, tagObjects = [], featured = false }: NewsCardProps) => {
  return (
    <Link to={`/actualites/${slug}`} className="block">
      <Card
        className={cn(
          "group overflow-hidden border-gray-200/80 card-lift cursor-pointer",
          "hover:shadow-xl hover:border-green-200/60 transition-all duration-300",
          featured && "md:col-span-2 lg:col-span-2"
        )}
      >
        <div className={featured ? "md:flex md:min-h-[280px]" : ""}>
          <div className={cn("relative overflow-hidden", featured ? "md:w-1/2" : "")}>
            <div
              className={cn(
                "bg-cover bg-center transition-transform duration-500 group-hover:scale-105",
                featured ? "h-64 md:h-full min-h-[200px]" : "h-48"
              )}
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {featured && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full shadow-sm">
                À la une
              </span>
            )}
          </div>

          <div className={featured ? "md:w-1/2 flex flex-col" : ""}>
            <CardContent className={cn("p-6 flex flex-col flex-1", featured && "justify-center")}>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tagObjects.length > 0
                  ? tagObjects.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs border-current/30"
                        style={{ color: tag.color, borderColor: `${tag.color}50` }}
                      >
                        {tag.name}
                      </Badge>
                    ))
                  : tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-green-700 border-green-200">
                        {tag}
                      </Badge>
                    ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {date}
                </span>
                {author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {author}
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  "font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2",
                  featured ? "text-2xl" : "text-lg"
                )}
              >
                {title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                {excerpt}
              </p>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 group-hover:gap-2.5 transition-all duration-200">
                Lire la suite
                <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default NewsCard;
