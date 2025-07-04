
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onSearch }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input
        type="text"
        placeholder="Rechercher des actualités..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
