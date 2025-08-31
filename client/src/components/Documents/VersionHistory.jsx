import { useDocumentVersions } from "../../hooks/useDocuments";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatRelativeTime } from "../../utils/helpers";
import {
  Clock,
  User,
  FileText,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  History,
  Tag,
  Edit3,
  Plus,
  Minus,
  Edit,
} from "lucide-react";
import { useState } from "react";

const VersionHistory = ({ documentId }) => {
  const { data: versions, isLoading } = useDocumentVersions(documentId);
  const [expandedVersions, setExpandedVersions] = useState(new Set());

  const toggleVersion = (versionId) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-50 rounded-lg">
            <History className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Version History
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Loading versions...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-500 mt-3 sm:mt-4 text-sm">
              Loading version history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-50 rounded-lg">
            <History className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Version History
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              No versions found
            </p>
          </div>
        </div>

        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="relative max-w-sm mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative bg-gray-50 rounded-xl p-6 sm:p-8 border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-2">
                No version history available
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Start editing to create your first version
              </p>

              <div className="mt-4 sm:mt-6 flex justify-center space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-50 rounded-lg">
            <History className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Version History
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {versions.length} version{versions.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 rounded-full">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-blue-600">
            Auto-saved
          </span>
        </div>
      </div>

      {/* Versions List */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {versions.map((version, index) => (
          <div
            key={version._id}
            className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50"
          >
            {/* Version Header - Clickable */}
            <button
              onClick={() => toggleVersion(version._id)}
              className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-left hover:bg-blue-50/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Section - Version Info */}
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Expand/Collapse Icon */}
                  <div className="flex-shrink-0 p-1 sm:p-1.5 rounded-lg bg-white shadow-sm border group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-200">
                    {expandedVersions.has(version._id) ? (
                      <ChevronDown
                        size={14}
                        className="sm:w-4 sm:h-4 text-blue-600"
                      />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="sm:w-4 sm:h-4 text-gray-500 group-hover:text-blue-600"
                      />
                    )}
                  </div>

                  {/* Version Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-blue-600"
                      />
                    </div>
                    {/* Latest version indicator */}
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </div>

                  {/* Version Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1.5 sm:mb-2">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">
                        Version {version.version}
                      </span>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {version.version === 1 && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                            Initial
                          </span>
                        )}
                        {index === 0 && version.version !== 1 && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                        <User
                          size={12}
                          className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                        />
                        <span className="font-medium truncate">
                          {version.modifiedBy?.name || "Unknown User"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Clock
                          size={12}
                          className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">
                          {formatRelativeTime(version.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Change Summary & Description */}
                <div className="flex flex-col space-y-2 sm:max-w-xs lg:max-w-md xl:max-w-lg">
                  {/* Change Description */}
                  {version.changeDescription && (
                    <p className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 sm:text-right">
                      {version.changeDescription}
                    </p>
                  )}

                  {/* Change Stats */}
                  {version.changes && (
                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 sm:justify-end text-xs">
                      {version.changes.added > 0 && (
                        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                          <Plus size={10} className="sm:w-3 sm:h-3" />
                          <span className="font-medium">
                            {version.changes.added}
                          </span>
                        </div>
                      )}
                      {version.changes.removed > 0 && (
                        <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200">
                          <Minus size={10} className="sm:w-3 sm:h-3" />
                          <span className="font-medium">
                            {version.changes.removed}
                          </span>
                        </div>
                      )}
                      {version.changes.modified > 0 && (
                        <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                          <Edit size={10} className="sm:w-3 sm:h-3" />
                          <span className="font-medium">
                            {version.changes.modified}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {expandedVersions.has(version._id) && (
              <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50/50 to-white animate-in slide-in-from-top duration-200">
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  {/* Title and Summary Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Title */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <Edit3
                          size={14}
                          className="sm:w-4 sm:h-4 text-gray-500"
                        />
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Document Title
                        </h4>
                      </div>
                      <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <p className="text-xs sm:text-sm lg:text-base text-gray-800 font-medium leading-relaxed break-words">
                          {version.title}
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    {version.summary && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                          <FileText
                            size={14}
                            className="sm:w-4 sm:h-4 text-gray-500"
                          />
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Summary
                          </h4>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed break-words">
                            {version.summary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {version.tags && version.tags.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <Tag
                          size={14}
                          className="sm:w-4 sm:h-4 text-gray-500"
                        />
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Tags ({version.tags.length})
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {version.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <FileText
                          size={14}
                          className="sm:w-4 sm:h-4 text-gray-500"
                        />
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Content Preview
                        </h4>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {version.content.length.toLocaleString()} characters
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="max-h-32 sm:max-h-48 lg:max-h-64 overflow-y-auto">
                        <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50/50 break-words">
                          {version.content.substring(0, 750)}
                          {version.content.length > 750 && (
                            <span className="text-gray-400 italic font-sans">
                              ... (content truncated)
                            </span>
                          )}
                        </div>
                      </div>

                      {version.content.length > 750 && (
                        <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Showing first 750 characters of{" "}
                              {version.content.length.toLocaleString()} total
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Restore Button */}
                  <div className="flex justify-center sm:justify-end pt-3 sm:pt-4 border-t border-gray-200">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5">
                      <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-sm sm:text-base">
                        Restore This Version
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom CSS for animations and scrollbar */}
      <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .slide-in-from-top {
          animation-name: slide-in-from-top;
        }

        .duration-200 {
          animation-duration: 200ms;
        }

        /* Line clamp utilities */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (min-width: 640px) {
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
        }

        /* Enhanced focus styles */
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default VersionHistory;
