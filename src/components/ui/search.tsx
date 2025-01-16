"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { updateSearchQuery } from "@/store/slices/searchSlice";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    dispatch(updateSearchQuery(value)); // Dispatch query to the Redux store
  };

  return (
    <div className="flex items-center gap-2">
      <SearchIcon className="h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="border-0 focus-visible:ring-0"
      />
    </div>
  );
};

export default Search;
