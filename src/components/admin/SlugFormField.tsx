import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SLUG_PATTERN } from "@/lib/utils/slug";

interface SlugFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  prefix: string;
  error?: string;
  checking?: boolean;
}

const SlugFormField = ({ value, onChange, onBlur, prefix, error, checking }: SlugFormFieldProps) => {
  const formatError = value.length > 0 && !SLUG_PATTERN.test(value)
    ? "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."
    : undefined;
  const displayError = formatError || error;

  return (
    <div className="space-y-2">
      <Label>Slug (permalien)</Label>
      <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <span className="pl-3 pr-1 text-sm text-muted-foreground whitespace-nowrap select-none">
          {prefix}
        </span>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="mon-slug"
        />
      </div>
      {checking && <p className="text-xs text-muted-foreground">Vérification de la disponibilité...</p>}
      {displayError && <p className="text-sm font-medium text-destructive">{displayError}</p>}
    </div>
  );
};

export default SlugFormField;
