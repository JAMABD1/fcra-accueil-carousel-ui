import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface HeroOption {
  id: string;
  title: string;
  imageUrl?: string | null;
  image_url?: string | null;
}

interface HeroMultiSelectProps {
  label?: string;
  heroes: HeroOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}

const HeroMultiSelect = ({ label = "Bannières d'accueil (hero)", heroes, value, onChange }: HeroMultiSelectProps) => {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {heroes.length === 0 ? (
        <div className="text-sm text-muted-foreground border rounded-lg p-4 text-center">
          Aucune bannière disponible.
        </div>
      ) : (
        <ScrollArea className="h-64 border rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2">
            {heroes.map((heroItem) => {
              const checked = value.includes(heroItem.id);
              const src = heroItem.imageUrl || heroItem.image_url || "/placeholder.svg";
              return (
                <label
                  key={heroItem.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors",
                    checked ? "border-green-500 bg-green-50" : "border-border/70 hover:bg-muted/50"
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggle(heroItem.id)} />
                  <img
                    src={src}
                    alt=""
                    className="h-12 w-12 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <span className="text-sm truncate">{heroItem.title}</span>
                </label>
              );
            })}
          </div>
        </ScrollArea>
      )}
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">{value.length} bannière(s) sélectionnée(s)</p>
      )}
    </div>
  );
};

export default HeroMultiSelect;
