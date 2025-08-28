import React, { useState, useEffect, useCallback } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Cari tulisan...",
  className = "",
  debounceTime = 500,
}) => {
  const [query, setQuery] = useState<string>("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceTime);

    // Cleanup function untuk menghapus timer jika input berubah atau komponen unmount
    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceTime, onSearch]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    []
  );

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-5 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-full shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400 ${className}`}
      />
    </div>
  );
};

export default SearchInput;
