import { useDocumentVersions } from "../../hooks/useDocuments";
import LoadingSpinner from "../Common/LoadingSpinner";
import { formatRelativeTime } from "../../utils/helpers";
import { Clock, User, FileText, ChevronDown, ChevronRight } from "lucide-react";
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
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Version History
        </h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Version History
        </h3>
        <p className="text-gray-500">No version history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Version History
      </h3>

      <div className="space-y-4">
        {versions.map((version) => (
          <div key={version._id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleVersion(version._id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {expandedVersions.has(version._id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <FileText size={16} className="text-gray-400" />
                </div>

                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      Version {version.version}
                    </span>
                    {version.version === 1 && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Initial
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{version.modifiedBy?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatRelativeTime(version.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {version.changeDescription && (
                  <p className="text-sm text-gray-600 max-w-xs truncate">
                    {version.changeDescription}
                  </p>
                )}
                {version.changes && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    {version.changes.added > 0 && (
                      <span className="text-green-600">
                        +{version.changes.added}
                      </span>
                    )}
                    {version.changes.removed > 0 && (
                      <span className="text-red-600">
                        -{version.changes.removed}
                      </span>
                    )}
                    {version.changes.modified > 0 && (
                      <span className="text-blue-600">
                        ~{version.changes.modified}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>

            {expandedVersions.has(version._id) && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Title
                    </h4>
                    <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                      {version.title}
                    </p>
                  </div>

                  {version.summary && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Summary
                      </h4>
                      <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                        {version.summary}
                      </p>
                    </div>
                  )}

                  {version.tags && version.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {version.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Content Preview
                    </h4>
                    <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {version.content.substring(0, 500)}
                        {version.content.length > 500 && "..."}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn btn-secondary text-sm">
                      Restore This Version
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
