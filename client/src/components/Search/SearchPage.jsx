import { useState } from "react";
import { useQuery } from "react-query";
import { searchAPI } from "../../services/api";
import SearchResults from "./SearchResults";
import SemanticSearch from "./SemanticSearch";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Search, Filter, Brain, List } from "lucide-react";
import { debounce } from "../../utils/helpers";

const SearchPage = () => {
  const [searchMode, setSearchMode] = useState("text"); // 'text' or 'semantic'
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search for text search
  const debouncedTextSearch = debounce(async (searchQuery, searchFilters) => {
    if (!searchQuery.trim()) return { data: [], pagination: {} };

    const params = { q: searchQuery, ...searchFilters };
    const response = await searchAPI.textSearch(params);
    return response.data;
  }, 500);

  const { data: textResults, isLoading: textLoading } = useQuery(
    ["text-search", query, filters],
    () => debouncedTextSearch(query, filters),
    {
      enabled: searchMode === "text" && query.trim().length > 0,
    }
  );

  const categories = [
    "Research",
    "Documentation",
    "Meeting Notes",
    "Project",
    "Knowledge Base",
    "Other",
  ];

  const handleSearch = (value) => {
    setQuery(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

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
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-10"
            placeholder={
              searchMode === "text"
                ? "Search by title, content, or tags..."
                : "Describe what you're looking for..."
            }
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
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

          {query && (
            <div className="text-sm text-gray-500">
              {searchMode === "text" && textResults?.pagination?.total && (
                <span>{textResults.pagination.total} results found</span>
              )}
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && searchMode === "text" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
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
              results={textResults?.data || []}
              pagination={textResults?.pagination}
              loading={textLoading}
              query={query}
              onPageChange={handlePageChange}
            />
          ) : (
            <SemanticSearch query={query} />
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
