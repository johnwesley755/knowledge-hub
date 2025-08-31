import { useState, useEffect } from "react";
import {
  useTextSearch,
  useSemanticSearch,
  useSearchSuggestions,
} from "../../hooks/useSearch";
import SearchResults from "./SearchResults";
import SemanticSearch from "./SemanticSearch";
import { Search, Filter, Brain, X, Sparkles, FileText, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-indigo-500/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Knowledge Search
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Discover documents using intelligent text search or AI-powered semantic understanding
                </p>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Documents</p>
                    <p className="text-xl font-bold text-gray-900">1,247</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quick Search</p>
                    <p className="text-xl font-bold text-gray-900"> 200ms</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Powered</p>
                    <p className="text-xl font-bold text-gray-900">Smart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Interface */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
          <div className="p-8">
            {/* Search Mode Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="p-1 bg-gray-100 rounded-2xl shadow-inner">
                <div className="flex">
                  <button
                    onClick={() => setSearchMode("text")}
                    className={`relative flex items-center space-x-3 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      searchMode === "text"
                        ? "bg-white text-blue-600 shadow-lg ring-1 ring-blue-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Search size={18} />
                    <span>Text Search</span>
                    {searchMode === "text" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setSearchMode("semantic")}
                    className={`relative flex items-center space-x-3 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
                      searchMode === "semantic"
                        ? "bg-white text-purple-600 shadow-lg ring-1 ring-purple-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Brain size={18} />
                    <span>Semantic Search</span>
                    {searchMode === "semantic" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className={`p-2 rounded-xl ${searchMode === "text" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {searchMode === "text" ? (
                    <Search className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Brain className="h-5 w-5 text-purple-600" />
                  )}
                </div>
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
                className={`w-full pl-16 pr-12 py-4 text-lg border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                  searchMode === "text"
                    ? "border-blue-200 focus:border-blue-400 focus:bg-blue-50/30"
                    : "border-purple-200 focus:border-purple-400 focus:bg-purple-50/30"
                } placeholder-gray-400`}
                placeholder={
                  searchMode === "text"
                    ? "Search by title, content, or tags..."
                    : "Describe what you're looking for in natural language..."
                }
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <div className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={18} />
                  </div>
                </button>
              )}
              {isLoading && (
                <div className="absolute inset-y-0 right-12 flex items-center pr-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Enhanced Search Suggestions */}
            {query.length >= 2 &&
              (suggestions.tags.length > 0 || suggestions.titles.length > 0) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-800">Smart Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags.slice(0, 3).map((tag, index) => (
                      <button
                        key={`tag-${index}`}
                        onClick={() => setQuery(tag.text)}
                        className="px-3 py-1.5 bg-white text-blue-700 text-sm rounded-xl hover:shadow-md transition-all duration-200 border border-blue-200 hover:border-blue-300 font-medium"
                      >
                        #{tag.text} <span className="text-blue-500">({tag.count})</span>
                      </button>
                    ))}
                    {suggestions.titles.slice(0, 2).map((title, index) => (
                      <button
                        key={`title-${index}`}
                        onClick={() => setQuery(title.text)}
                        className="px-3 py-1.5 bg-white text-green-700 text-sm rounded-xl hover:shadow-md transition-all duration-200 border border-green-200 hover:border-green-300 font-medium"
                      >
                        {title.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Enhanced Filters and Results Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
                    showFilters
                      ? "bg-blue-100 text-blue-700 shadow-md ring-1 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Filter size={16} />
                  <span>Advanced Filters</span>
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    showFilters ? "bg-blue-500" : "bg-gray-400"
                  }`}></div>
                </button>

                <button
                  onClick={() => handleSearch()}
                  disabled={!query.trim() || isLoading}
                  className={`flex items-center space-x-3 px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    searchMode === "text"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Search Now</span>
                    </>
                  )}
                </button>
              </div>

              {results.length > 0 && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    {searchMode === "text" && pagination?.total && (
                      <span>{pagination.total} results found</span>
                    )}
                    {searchMode === "semantic" && (
                      <span>{results.length} results found</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Filter Panel */}
            {showFilters && searchMode === "text" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-500" />
                    <span>Advanced Search Filters</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors bg-white"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Results per page
                      </label>
                      <select
                        value={filters.limit}
                        onChange={(e) =>
                          handleFilterChange("limit", parseInt(e.target.value))
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors bg-white"
                      >
                        <option value={5}>5 results</option>
                        <option value={10}>10 results</option>
                        <option value={25}>25 results</option>
                        <option value={50}>50 results</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() =>
                          setFilters({ category: "", author: "", limit: 10 })
                        }
                        className="w-full px-4 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

        {/* Enhanced Empty State */}
        {!query && (
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative p-16 text-center">
              <div className="mb-8">
                <div className="inline-flex p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
                  <Search className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Start Your Knowledge Journey
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Explore your entire knowledge hub with our advanced search capabilities. 
                Use traditional text search for precise matching, or try our AI-powered 
                semantic search to find documents based on meaning and context.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Text Search</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Find documents using keywords, titles, and exact matches
                  </p>
                </div>

                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Semantic Search</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    AI-powered search that understands context and meaning
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;