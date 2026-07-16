import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityListingCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  subtitle?: string | null;
  location?: string | null;
  href: string;
  ctaLabel?: string;
}

const EntityListingCard = ({
  name,
  description,
  imageUrl,
  badge,
  subtitle,
  location,
  href,
  ctaLabel = "Découvrir",
}: EntityListingCardProps) => {
  return (
    <Link to={href} className="block h-full">
      <Card
        className={cn(
          "group overflow-hidden border-gray-200/80 card-lift cursor-pointer h-full flex flex-col",
          "hover:shadow-xl hover:border-green-200/60 transition-all duration-300"
        )}
      >
        <div className="relative h-52 overflow-hidden bg-gray-200">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${imageUrl || "/placeholder.svg"})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          {badge && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0 shadow-sm capitalize">
              {badge}
            </Badge>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-bold text-white drop-shadow-sm line-clamp-2">{name}</h3>
            {subtitle && (
              <p className="text-green-200 text-sm font-medium mt-0.5 line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-1">
          {location && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-green-600" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
              {description}
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 group-hover:gap-2.5 transition-all duration-200 mt-auto">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EntityListingCard;
