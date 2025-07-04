
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  images: FileList | null;
  author: string;
  tags: string[];
  featured: boolean;
  status: string;
}

interface ArticleImageUploadProps {
  control: Control<ArticleFormData>;
}

const ArticleImageUpload = ({ control }: ArticleImageUploadProps) => {
  return (
    <FormField
      control={control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Images</FormLabel>
          <FormControl>
            <Input 
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => field.onChange(e.target.files)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
          </FormControl>
          <div className="text-sm text-muted-foreground">
            Sélectionnez plusieurs images pour créer un carrousel
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ArticleImageUpload;
