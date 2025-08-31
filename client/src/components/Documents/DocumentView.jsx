import { useState, useRef } from "react";
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
  FileText,
  Clock,
  Users,
  Tag,
  AlertCircle,
  ExternalLink,
  Bookmark,
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
  const versionHistoryRef = useRef(null);

  const { data: document, isLoading, error } = useDocument(id);
  const toggleLike = useToggleLike();
  const deleteDocument = useDeleteDocument();

  const handleToggleVersions = () => {
    const willShow = !showVersions;
    setShowVersions(willShow);
    if (willShow) {
      setTimeout(() => {
        versionHistoryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

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

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: document.summary || `Check out this document: ${document.title}`,
      url: window.location.href,
    };

    // Use Web Share API if available (common on mobile)
    if (navigator.share) {
      try {
        toast.loading("Preparing document for sharing...");
        const response = await documentsAPI.download(document._id);
        const blob = new Blob([response.data], { type: "application/pdf" });
        const filename = `${document.title.replace(/[^a-z0-9_.-]/gi, "_")}.pdf`;
        const file = new File([blob], filename, { type: "application/pdf" });

        toast.dismiss();

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: shareData.title,
            text: shareData.text,
          });
          toast.success("Document shared successfully!");
        } else {
          // Fallback to sharing URL if files are not supported
          await navigator.share(shareData);
        }
      } catch (error) {
        toast.dismiss();
        if (error.name !== "AbortError") {
          toast.error(`Could not share document: ${error.message}`);
        }
      }
    } else {
      // Fallback for desktop: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4 text-lg">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Document Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The document you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              {canEdit && (
                <Link
                  to={`/documents/${document._id}/edit`}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>
              )}

              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                <Download size={16} />
                <span>Download</span>
              </button>

              <button
                onClick={handleToggleVersions}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  showVersions
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                }`}
              >
                <History size={16} />
                <span>Versions</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>

              {isAuthor && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Meta */}
          <div className="flex items-center space-x-4 mb-6">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${getCategoryColor(
                document.category
              )} transition-transform hover:scale-105`}
            >
              {document.category}
            </span>
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${getStatusColor(
                document.status
              )} transition-transform hover:scale-105`}
            >
              {document.status}
            </span>
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
              <Eye size={16} className="text-purple-500" />
              <span className="text-sm font-medium text-gray-700">
                {document.metrics?.views || 0} views
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {document.title}
          </h1>

          {document.summary && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
              <p className="text-lg text-gray-700 leading-relaxed">
                {document.summary}
              </p>
            </div>
          )}

          {/* Enhanced Author and Date Info */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {document.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {document.author.name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <User size={14} />
                    <span>Author</span>
                  </p>
                </div>
              </div>

              <div className="w-px h-16 bg-gray-300"></div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-green-500" />
                  <span className="font-medium">
                    Created {formatRelativeTime(document.createdAt)}
                  </span>
                </div>
                {document.updatedAt !== document.createdAt && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock size={16} className="text-blue-500" />
                    <span className="font-medium">
                      Updated {formatRelativeTime(document.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                isLiked
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-500"
              }`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-lg">
                {document.metrics?.likes?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Tags Section */}
      {document.tags && document.tags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 cursor-pointer transition-all duration-200 transform hover:scale-105 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Content Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Document Content
            </h3>
          </div>
        </div>
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            <div
              style={{ whiteSpace: "pre-wrap" }}
              className="text-gray-800 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </div>
        </div>
      </div>

      {/* Version History */}
      <div ref={versionHistoryRef}>
        {showVersions && <VersionHistory documentId={document._id} />}
      </div>

      {/* Enhanced Collaborators Section */}
      {document.collaborators && document.collaborators.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-xl">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Collaborators</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {document.collaborators.length}
            </span>
          </div>
          <div className="grid gap-4">
            {document.collaborators.map((collaborator) => (
              <div
                key={collaborator._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {collaborator.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {collaborator.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collaborator.user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    collaborator.permissions === "admin"
                      ? "bg-red-100 text-red-700"
                      : collaborator.permissions === "edit"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {collaborator.permissions}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Q&A Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <MessageSquare className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Ask Questions</h3>
            <p className="text-gray-600">
              Get instant answers from our AI assistant
            </p>
          </div>
        </div>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          Have questions about this document? Our AI assistant can help you
          understand the content, find specific information, or clarify complex
          topics instantly.
        </p>
        <Link
          to={`/qa?document=${document._id}`}
          className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <MessageSquare size={20} />
          <span>Ask Questions</span>
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Delete Document
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  "{document.title}"
                </span>
                ? This action cannot be undone and will permanently remove the
                document and all its data.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 min-w-[100px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteDocument.isLoading}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium transition-colors duration-200 min-w-[100px] flex items-center justify-center"
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
    </div>
  );
};

export default DocumentView;
