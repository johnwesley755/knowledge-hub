import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useDocument,
  useToggleLike,
  useDeleteDocument,
} from "../../hooks/useDocuments";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../Common/LoadingSpinner";
import VersionHistory from "./VersionHistory";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Heart,
  Eye,
  Calendar,
  User,
  Share2,
  Download,
  History,
  MessageSquare,
} from "lucide-react";
import {
  formatRelativeTime,
  getCategoryColor,
  getStatusColor,
} from "../../utils/helpers";
import toast from "react-hot-toast";
import { documentsAPI } from "../../services/api";

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showVersions, setShowVersions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: document, isLoading, error } = useDocument(id);
  const toggleLike = useToggleLike();
  const deleteDocument = useDeleteDocument();

  const handleDownload = async () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Document not found or access denied.</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isAuthor = document.author._id === user?.id;
  const isLiked = document.metrics?.likes?.includes(user?.id);
  const canEdit =
    isAuthor ||
    document.collaborators?.some(
      (c) =>
        c.user._id === user?.id && ["edit", "admin"].includes(c.permissions)
    );

  const handleLike = async () => {
    try {
      await toggleLike.mutateAsync(document._id);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync(document._id);
      toast.success("Document deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-2">
              {canEdit && (
                <Link
                  to={`/documents/${document._id}/edit`}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>
              )}
              <button
                onClick={handleDownload}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download</span>
              </button>

              <button
                onClick={() => setShowVersions(!showVersions)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <History size={16} />
                <span>Versions</span>
              </button>

              <button className="btn btn-secondary flex items-center space-x-2">
                <Share2 size={16} />
                <span>Share</span>
              </button>

              {isAuthor && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-danger flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Meta */}
          <div className="flex items-center space-x-4 mb-4">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                document.category
              )}`}
            >
              {document.category}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                document.status
              )}`}
            >
              {document.status}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye size={16} />
              <span>{document.metrics?.views || 0} views</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {document.title}
          </h1>

          {document.summary && (
            <p className="text-lg text-gray-600 mb-6">{document.summary}</p>
          )}

          {/* Author and Date Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {document.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {document.author.name}
                  </p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>

              <div className="h-4 border-l border-gray-300"></div>

              <div className="text-sm text-gray-500">
                <div className="flex items-center space-x-1 mb-1">
                  <Calendar size={14} />
                  <span>Created {formatRelativeTime(document.createdAt)}</span>
                </div>
                {document.updatedAt !== document.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Edit size={14} />
                    <span>
                      Updated {formatRelativeTime(document.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span>{document.metrics?.likes?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="prose max-w-none">
          <div
            style={{ whiteSpace: "pre-wrap" }}
            className="text-gray-900 leading-relaxed"
          >
            {document.content}
          </div>
        </div>
      </div>

      {/* Version History */}
      {showVersions && <VersionHistory documentId={document._id} />}

      {/* Collaborators */}
      {document.collaborators && document.collaborators.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Collaborators
          </h3>
          <div className="space-y-3">
            {document.collaborators.map((collaborator) => (
              <div
                key={collaborator._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {collaborator.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {collaborator.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {collaborator.user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    collaborator.permissions === "admin"
                      ? "bg-red-100 text-red-800"
                      : collaborator.permissions === "edit"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {collaborator.permissions}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ask Questions</h3>
          <MessageSquare className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-4">
          Have questions about this document? Ask our AI assistant for quick
          answers.
        </p>
        <Link
          to={`/qa?document=${document._id}`}
          className="btn btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <MessageSquare size={16} />
          <span>Ask Questions</span>
        </Link>
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
    </div>
  );
};

export default DocumentView;
