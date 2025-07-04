import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { Tag } from "./TagsManager";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector = ({ selectedTags, onTagsChange }: TagSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  return (
    <div className="space-y-4">
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Tags sélectionnés:</div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagName) => {
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
                variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                style={{ 
                  backgroundColor: selectedTags.includes(tag.name) 
                    ? tag.color 
                    : tag.color + '10',
                  color: selectedTags.includes(tag.name) 
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
  );
};

export default TagSelector;