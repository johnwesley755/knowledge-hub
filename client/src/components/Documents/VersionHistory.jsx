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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Version History</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-500 mt-4 text-sm">
              Loading version history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Version History</h3>
        </div>
        <div className="text-center py-12">
          <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No version history available</p>
          <p className="text-gray-400 text-sm mt-2">
            Start editing to create your first version
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Version History
            </h3>
            <p className="text-gray-500 text-sm">
              {versions.length} version{versions.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {versions.map((version, index) => (
          <div
            key={version._id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/30"
          >
            <button
              onClick={() => toggleVersion(version._id)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-blue-50/50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-white shadow-sm border group-hover:bg-blue-50 transition-colors">
                    {expandedVersions.has(version._id) ? (
                      <ChevronDown size={18} className="text-blue-600" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-500" />
                    )}
                  </div>
                  <div className="relative">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText size={18} className="text-blue-600" />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-semibold text-gray-900 text-lg">
                      Version {version.version}
                    </span>
                    {version.version === 1 && (
                      <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                        Initial Version
                      </span>
                    )}
                    {index === 0 && version.version !== 1 && (
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium">
                        {version.modifiedBy?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{formatRelativeTime(version.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right max-w-md">
                {version.changeDescription && (
                  <p className="text-sm text-gray-700 max-w-xs truncate mb-2 font-medium">
                    {version.changeDescription}
                  </p>
                )}
                {version.changes && (
                  <div className="flex items-center justify-end space-x-3 text-xs">
                    {version.changes.added > 0 && (
                      <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                        <Plus size={12} />
                        <span className="font-medium">
                          {version.changes.added}
                        </span>
                      </div>
                    )}
                    {version.changes.removed > 0 && (
                      <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200">
                        <Minus size={12} />
                        <span className="font-medium">
                          {version.changes.removed}
                        </span>
                      </div>
                    )}
                    {version.changes.modified > 0 && (
                      <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                        <Edit size={12} />
                        <span className="font-medium">
                          {version.changes.modified}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>

            {expandedVersions.has(version._id) && (
              <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Edit3 size={16} className="text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Title
                        </h4>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">
                          {version.title}
                        </p>
                      </div>
                    </div>

                    {version.summary && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <FileText size={16} className="text-gray-500" />
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Summary
                          </h4>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {version.summary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {version.tags && version.tags.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag size={16} className="text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Tags
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {version.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText size={16} className="text-gray-500" />
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Content Preview
                      </h4>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50/50">
                          {version.content.substring(0, 500)}
                          {version.content.length > 500 && (
                            <span className="text-gray-400 italic">
                              ... (truncated)
                            </span>
                          )}
                        </div>
                      </div>
                      {version.content.length > 500 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Showing first 500 characters of{" "}
                            {version.content.length} total
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <RotateCcw size={16} />
                      <span>Restore This Version</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;
