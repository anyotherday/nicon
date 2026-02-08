import { RefObject, Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Note } from "@/lib/types";

interface SearchBarProps {
  notes: Note[];
  onSearchResults: (results: Note[] | null) => void;
  sessionId: string;
  inputRef: RefObject<HTMLInputElement>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  clearSearch: () => void;
}

export default function SearchBar({
  notes,
  onSearchResults,
  sessionId,
  inputRef,
  searchQuery,
  setSearchQuery,
  setHighlightedIndex,
  clearSearch,
}: SearchBarProps) {
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      clearSearch();
      return;
    }

    const filteredNotes = notes.filter(
      (note) =>
        (note.public || note.session_id === sessionId) &&
        (note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()))
    );

    onSearchResults(filteredNotes);
    setHighlightedIndex(0);
  };

  return (
    <div className="pt-3 px-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] h-3.5 w-3.5" />
        <Input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search"
          className="w-full pl-9 pr-3 rounded-lg text-sm placeholder:text-[#636366] bg-[#1A1A1F] border-[#2A2A30] focus:border-[#8B8BF5] transition-colors"
          aria-label="Search notes"
          autoComplete="off"
          ref={inputRef}
        />
      </div>
    </div>
  );
}
