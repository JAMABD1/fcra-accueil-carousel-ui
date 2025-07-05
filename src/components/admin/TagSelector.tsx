import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tag {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

interface TagSelectorProps {
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  control?: any;
  name?: string;
  label?: string;
}

const TagSelector = ({ selectedTags, onTagsChange, control, name = "tags", label = "Tags" }: TagSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedTags, setInternalSelectedTags] = useState<string[]>(selectedTags || []);

  // Fetch tags
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Tag[];
    }
  });

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTags = selectedTags || internalSelectedTags;
  
  const toggleTag = (tagName: string) => {
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName];
    
    if (onTagsChange) {
      onTagsChange(newTags);
    } else {
      setInternalSelectedTags(newTags);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    const newTags = currentTags.filter(t => t !== tagName);
    if (onTagsChange) {
      onTagsChange(newTags);
    } else {
      setInternalSelectedTags(newTags);
    }
  };

  // If control is provided, use FormField
  if (control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const fieldTags = field.value || [];
          
          const handleTagToggle = (tagName: string) => {
            const newTags = fieldTags.includes(tagName)
              ? fieldTags.filter((t: string) => t !== tagName)
              : [...fieldTags, tagName];
            field.onChange(newTags);
          };

          const handleTagRemove = (tagName: string) => {
            const newTags = fieldTags.filter((t: string) => t !== tagName);
            field.onChange(newTags);
          };

          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Selected tags */}
                  {fieldTags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Tags sélectionnés:</div>
                      <div className="flex flex-wrap gap-2">
                        {fieldTags.map((tagName: string) => {
                          const tag = availableTags.find(t => t.name === tagName);
                          return (
                            <Badge 
                              key={tagName}
                              variant="secondary"
                              style={{ 
                                backgroundColor: tag?.color + '20' || '#3B82F620', 
                                color: tag?.color || '#3B82F6',
                                borderColor: tag?.color || '#3B82F6'
                              }}
                              className="border flex items-center gap-1"
                            >
                              {tagName}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => handleTagRemove(tagName)}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher des tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Available tags */}
                  <div>
                    <div className="text-sm font-medium mb-2">Tags disponibles:</div>
                    <ScrollArea className="h-32 border rounded-lg p-2">
                      <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => (
                          <Badge 
                            key={tag.id}
                            variant={fieldTags.includes(tag.name) ? "default" : "outline"}
                            style={{ 
                              backgroundColor: fieldTags.includes(tag.name) 
                                ? tag.color 
                                : tag.color + '10',
                              color: fieldTags.includes(tag.name) 
                                ? 'white' 
                                : tag.color,
                              borderColor: tag.color
                            }}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleTagToggle(tag.name)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected tags */}
      {currentTags.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Tags sélectionnés:</div>
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tagName) => {
              const tag = availableTags.find(t => t.name === tagName);
              return (
                <Badge 
                  key={tagName}
                  variant="secondary"
                  style={{ 
                    backgroundColor: tag?.color + '20' || '#3B82F620', 
                    color: tag?.color || '#3B82F6',
                    borderColor: tag?.color || '#3B82F6'
                  }}
                  className="border flex items-center gap-1"
                >
                  {tagName}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveTag(tagName)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher des tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available tags */}
      <div>
        <div className="text-sm font-medium mb-2">Tags disponibles:</div>
        <ScrollArea className="h-32 border rounded-lg p-2">
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <Badge 
                key={tag.id}
                variant={currentTags.includes(tag.name) ? "default" : "outline"}
                style={{ 
                  backgroundColor: currentTags.includes(tag.name) 
                    ? tag.color 
                    : tag.color + '10',
                  color: currentTags.includes(tag.name) 
                    ? 'white' 
                    : tag.color,
                  borderColor: tag.color
                }}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleTag(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TagSelector;