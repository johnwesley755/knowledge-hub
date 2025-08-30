import { Link } from "react-router-dom";
import {
  Eye,
  Heart,
  Edit,
  Trash2,
  Calendar,
  User,
  MoreVertical,
  Download,
} from "lucide-react";
import { useState } from "react";
import {
  formatRelativeTime,
  getCategoryColor,
  getStatusColor,
  truncateText,
} from "../../utils/helpers";
import { useDeleteDocument, useToggleLike } from "../../hooks/useDocuments";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const DocumentCard = ({ document, viewMode = "grid" }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteDocument = useDeleteDocument();
  const toggleLike = useToggleLike();

  const isAuthor = document.author._id === user?.id;
  const isLiked = document.metrics?.likes?.includes(user?.id);
  const canEdit =
    isAuthor ||
    document.collaborators?.some(
      (c) =>
        c.user._id === user?.id && ["edit", "admin"].includes(c.permissions)
    );

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync(document._id);
      setShowDeleteModal(false);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      await toggleLike.mutateAsync(document._id);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <Link
                to={`/documents/${document._id}`}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate"
              >
                {document.title}
              </Link>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                    document.category
                  )}`}
                >
                  {document.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    document.status
                  )}`}
                >
                  {document.status}
                </span>
              </div>
            </div>

            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{document.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatRelativeTime(document.updatedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{document.metrics?.views || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                isLiked
                  ? "text-red-500 bg-red-50"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            </button>

            {canEdit && (
              <Link
                to={`/documents/${document._id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit size={16} />
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                  <Link
                    to={`/documents/${document._id}`}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => {
                      // Download functionality would go here
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                    document.category
                  )}`}
                >
                  {document.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    document.status
                  )}`}
                >
                  {document.status}
                </span>
              </div>

              <Link to={`/documents/${document._id}`} className="block group">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-2">
                  {document.title}
                </h3>
              </Link>

              {document.summary && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {truncateText(document.summary, 150)}
                </p>
              )}

              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{document.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                  <Link
                    to={`/documents/${document._id}`}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                  {canEdit && (
                    <Link
                      to={`/documents/${document._id}/edit`}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      // Download functionality would go here
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{document.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatRelativeTime(document.updatedAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Eye size={14} />
                <span>{document.metrics?.views || 0}</span>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-sm">
                  {document.metrics?.likes?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Document
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "{document.title}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteDocument.isLoading}
                className="btn btn-danger"
              >
                {deleteDocument.isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;
