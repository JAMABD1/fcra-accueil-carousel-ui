import { useState } from "react";
import { uploadImage } from "@/lib/storage/r2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiImageUploadProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  prefix?: string;
}

const MultiImageUpload = ({ label, value, onChange, folder, prefix = "" }: MultiImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadImage(file, folder, prefix);
        if (result.success && result.url) {
          uploaded.push(result.url);
        } else {
          toast({
            title: "Erreur",
            description: `Impossible d'uploader ${file.name}: ${result.error ?? "erreur inconnue"}`,
            variant: "destructive",
          });
        }
      }
      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (value.includes(url)) {
      setUrlInput("");
      return;
    }
    onChange([...value, url]);
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={isUploading}
        onChange={handleFilesSelected}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://exemple.com/image.jpg"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAddUrl}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
      {isUploading && <div className="text-sm text-blue-600">Upload en cours…</div>}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group h-24 rounded-md overflow-hidden border border-border/70">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
