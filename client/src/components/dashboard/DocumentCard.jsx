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
} from "../../utils/helpers.js";
import { useDeleteDocument, useToggleLike } from "../../hooks/useDocuments.js";
import { useAuth } from "../../hooks/useAuth.js";
import toast from "react-hot-toast";
import { documentsAPI } from "../../services/api.js";

const DocumentCard = ({ document, viewMode = "grid" }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteDocument = useDeleteDocument();
  const toggleLike = useToggleLike();

  const isAuthor = document.author._id.toString() === user?.id.toString();
  const isLiked = document.metrics?.likes?.some(id => id.toString() === user?.id.toString());
  const canEdit =
    isAuthor ||
    document.collaborators?.some(
      (c) =>
        c.user._id.toString() === user?.id.toString() && ["edit", "admin"].includes(c.permissions)
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

  const handleDownload = async () => {
    setShowMenu(false);
    toast.promise(
      documentsAPI.download(document._id).then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = window.document.createElement("a");
        link.href = url;

        const contentDisposition = response.headers["content-disposition"];
        let filename = `${document.title.replace(/[^a-z0-9_.-]/gi, "_")}.pdf`;
        if (contentDisposition) {
          const filenameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }

        link.setAttribute("download", filename);
        window.document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }),
      {
        loading: "Preparing download...",
        success: "Download started!",
        error: (err) => err.message || "Could not download document.",
      }
    );
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-3">
              <Link
                to={`/documents/${document._id}`}
                className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2"
              >
                {document.title}
              </Link>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full shadow-sm ${getCategoryColor(
                    document.category
                  )} transition-transform hover:scale-105`}
                >
                  {document.category}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(
                    document.status
                  )} transition-transform hover:scale-105`}
                >
                  {document.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-600">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg">
                  <User size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                  <span className="font-medium truncate">
                    {document.author.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg">
                  <Calendar
                    size={14}
                    className="sm:w-4 sm:h-4 text-green-500"
                  />
                  <span className="font-medium">
                    {formatRelativeTime(document.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg">
                  <Eye size={14} className="sm:w-4 sm:h-4 text-purple-500" />
                  <span className="font-medium">
                    {document.metrics?.views || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
            <button
              onClick={handleLike}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-110 ${
                isLiked
                  ? "text-red-500 bg-red-50 shadow-md"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>

            {canEdit && (
              <Link
                to={`/documents/${document._id}/edit`}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
              >
                <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
              >
                <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                  <Link
                    to={`/documents/${document._id}`}
                    className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 text-sm"
                    onClick={() => setShowMenu(false)}
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-medium">View Document</span>
                  </Link>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 text-sm"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-medium">Download</span>
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 text-sm"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium">Delete</span>
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
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group transform hover:-translate-y-1">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full shadow-sm ${getCategoryColor(
                    document.category
                  )} transition-transform hover:scale-105`}
                >
                  {document.category}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(
                    document.status
                  )} transition-transform hover:scale-105`}
                >
                  {document.status}
                </span>
              </div>

              <Link
                to={`/documents/${document._id}`}
                className="block group/title"
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover/title:text-blue-600 mb-3 sm:mb-4 line-clamp-2 transition-colors duration-200">
                  {document.title}
                </h3>
              </Link>

              {document.summary && (
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                  {truncateText(document.summary, 150)}
                </p>
              )}

              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-gray-500 bg-gray-50 rounded-full font-medium">
                      +{document.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="relative ml-3 sm:ml-4">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
              >
                <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                  <Link
                    to={`/documents/${document._id}`}
                    className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 text-sm"
                    onClick={() => setShowMenu(false)}
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-medium">View Document</span>
                  </Link>
                  {canEdit && (
                    <Link
                      to={`/documents/${document._id}/edit`}
                      className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-150 text-sm"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium">Edit Document</span>
                    </Link>
                  )}
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 text-sm"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-medium">Download</span>
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 text-sm"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium">Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-gray-100 space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <User size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                <span className="font-medium truncate">
                  {document.author.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <Calendar size={14} className="sm:w-4 sm:h-4 text-green-500" />
                <span className="font-medium">
                  {formatRelativeTime(document.updatedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <Eye size={14} className="sm:w-4 sm:h-4 text-purple-500" />
                <span className="font-medium">
                  {document.metrics?.views || 0}
                </span>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isLiked
                    ? "text-red-500 bg-red-50 shadow-md"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart
                  size={14}
                  className="sm:w-4 sm:h-4"
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span className="text-xs sm:text-sm font-medium">
                  {document.metrics?.likes?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal - Responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-100 mb-4 sm:mb-6">
                <Trash2 className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Delete Document
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  "{document.title}"
                </span>
                ? This action cannot be undone and will permanently remove the
                document.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 min-w-[100px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteDocument.isLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg sm:rounded-xl font-medium transition-colors duration-200 min-w-[100px] flex items-center justify-center"
                >
                  {deleteDocument.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay for mobile */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-10 sm:hidden"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default DocumentCard;
