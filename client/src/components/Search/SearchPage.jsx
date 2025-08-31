import { useState, useEffect } from "react";
import {
  useTextSearch,
  useSemanticSearch,
  useSearchSuggestions,
} from "../../hooks/useSearch";
import SearchResults from "./SearchResults";
import SemanticSearch from "./SemanticSearch";
import { Search, Filter, Brain, X } from "lucide-react";

const SearchPage = () => {
  const [searchMode, setSearchMode] = useState("text"); // 'text' or 'semantic'
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    limit: 10,
  });

  // Text search hook
  const textSearch = useTextSearch();

  // Semantic search hook
  const semanticSearch = useSemanticSearch();

  // Search suggestions
  const suggestions = useSearchSuggestions(query);

  const categories = [
    "Research",
    "Documentation",
    "Meeting Notes",
    "Project",
    "Knowledge Base",
    "Other",
  ];

  // Handle search
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    if (searchMode === "text") {
      textSearch.search({
        q: searchQuery,
        ...filters,
      });
    } else {
      semanticSearch.search(searchQuery, {
        threshold: 0.7,
        limit: filters.limit,
      });
    }
  };

  // Auto-search when query changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchMode, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearSearch = () => {
    setQuery("");
    setFilters({
      category: "",
      author: "",
      limit: 10,
    });
  };

  const isLoading =
    searchMode === "text" ? textSearch.isLoading : semanticSearch.isLoading;
  const results =
    searchMode === "text" ? textSearch.results : semanticSearch.results;
  const pagination = searchMode === "text" ? textSearch.pagination : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Search Documents
        </h1>
        <p className="text-gray-600">
          Find documents using text search or AI-powered semantic search
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Search Mode Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">
            Search Mode:
          </span>
          <div className="flex border rounded-lg">
            <button
              onClick={() => setSearchMode("text")}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                searchMode === "text"
                  ? "bg-primary-500 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Search size={16} />
              <span>Text Search</span>
            </button>
            <button
              onClick={() => setSearchMode("semantic")}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                searchMode === "semantic"
                  ? "bg-primary-500 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Brain size={16} />
              <span>Semantic Search</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="input pl-10 pr-10"
            placeholder={
              searchMode === "text"
                ? "Search by title, content, or tags..."
                : "Describe what you're looking for..."
            }
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {query.length >= 2 &&
          (suggestions.tags.length > 0 || suggestions.titles.length > 0) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.tags.slice(0, 3).map((tag, index) => (
                  <button
                    key={`tag-${index}`}
                    onClick={() => setQuery(tag.text)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    #{tag.text} ({tag.count})
                  </button>
                ))}
                {suggestions.titles.slice(0, 2).map((title, index) => (
                  <button
                    key={`title-${index}`}
                    onClick={() => setQuery(title.text)}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                  >
                    {title.text}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Filters and Results Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                showFilters
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            <button
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className="btn btn-primary text-sm disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {results.length > 0 && (
            <div className="text-sm text-gray-500">
              {searchMode === "text" && pagination?.total && (
                <span>{pagination.total} results found</span>
              )}
              {searchMode === "semantic" && (
                <span>{results.length} results found</span>
              )}
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && searchMode === "text" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Results per page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    handleFilterChange("limit", parseInt(e.target.value))
                  }
                  className="input"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFilters({ category: "", author: "", limit: 10 })
                  }
                  className="btn btn-secondary text-sm w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="space-y-6">
          {searchMode === "text" ? (
            <SearchResults
              results={results}
              pagination={pagination}
              loading={isLoading}
              query={query}
              onPageChange={(page) => textSearch.changePage(page)}
            />
          ) : (
            <SemanticSearch
              results={results}
              loading={isLoading}
              query={query}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Search Your Knowledge Hub
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Use text search to find documents by keywords, or try semantic
            search to find documents based on meaning and context.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
