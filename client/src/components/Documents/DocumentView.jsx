import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useDocument,
  useToggleLike,
  useDeleteDocument,
} from "../../hooks/useDocuments";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
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
  MoreVertical,
  ChevronDown,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCollaborators, setExpandedCollaborators] = useState(false);
  const versionHistoryRef = useRef(null);

  const { data: document, isLoading, error } = useDocument(id);
  const toggleLike = useToggleLike();
  const deleteDocument = useDeleteDocument();

  const handleToggleVersions = () => {
    const willShow = !showVersions;
    setShowVersions(willShow);
    setShowMobileMenu(false);
    if (willShow) {
      setTimeout(() => {
        versionHistoryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleDownload = async () => {
    setShowMobileMenu(false);
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
    setShowMobileMenu(false);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-12">
          <div className="flex flex-col items-center justify-center h-48 sm:h-64">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4 text-base sm:text-lg">
              Loading document...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-12">
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-100 mb-4 sm:mb-6">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Document Not Found
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4">
              The document you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft
                size={18}
                className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span className="font-medium">Back</span>
            </button>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
              >
                <MoreVertical size={20} />
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                  {canEdit && (
                    <Link
                      to={`/documents/${document._id}/edit`}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Edit size={16} />
                      <span>Edit Document</span>
                    </Link>
                  )}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={handleToggleVersions}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <History size={16} />
                    <span>View Versions</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Share2 size={16} />
                    <span>Share Document</span>
                  </button>
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete Document</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Document Meta - Responsive */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-sm ${getCategoryColor(
                document.category
              )} transition-transform hover:scale-105`}
            >
              {document.category}
            </span>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-sm ${getStatusColor(
                document.status
              )} transition-transform hover:scale-105`}
            >
              {document.status}
            </span>
            <div className="flex items-center space-x-2 bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <Eye size={14} className="sm:w-4 sm:h-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {document.metrics?.views || 0} views
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {document.title}
          </h1>

          {document.summary && (
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {document.summary}
              </p>
            </div>
          )}

          {/* Enhanced Author and Date Info - Responsive */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {document.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {document.author.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center space-x-1">
                      <User size={12} className="sm:w-[14px] sm:h-[14px]" />
                      <span>Author</span>
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-16 bg-gray-300"></div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Calendar
                      size={14}
                      className="sm:w-4 sm:h-4 text-green-500"
                    />
                    <span className="font-medium">
                      Created {formatRelativeTime(document.createdAt)}
                    </span>
                  </div>
                  {document.updatedAt !== document.createdAt && (
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Clock
                        size={14}
                        className="sm:w-4 sm:h-4 text-blue-500"
                      />
                      <span className="font-medium">
                        Updated {formatRelativeTime(document.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center justify-center space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart
                  size={18}
                  className="sm:w-5 sm:h-5"
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span className="text-base sm:text-lg">
                  {document.metrics?.likes?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tags Section - Responsive */}
      {document.tags && document.tags.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 cursor-pointer transition-all duration-200 transform hover:scale-105 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Content Section - Responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Document Content
            </h3>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="prose prose-sm sm:prose-lg max-w-none">
            <div
              style={{ whiteSpace: "pre-wrap" }}
              className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-lg"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </div>
        </div>
      </div>

      {/* Version History */}
      <div ref={versionHistoryRef}>
        {showVersions && <VersionHistory documentId={document._id} />}
      </div>

      {/* Enhanced Collaborators Section - Responsive */}
      {document.collaborators && document.collaborators.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Collaborators
              </h3>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                {document.collaborators.length}
              </span>
            </div>

            {document.collaborators.length > 3 && (
              <button
                onClick={() => setExpandedCollaborators(!expandedCollaborators)}
                className="md:hidden flex items-center space-x-1 text-sm text-blue-600 font-medium"
              >
                <span>{expandedCollaborators ? "Show Less" : "Show All"}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    expandedCollaborators ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {document.collaborators
              .slice(
                0,
                expandedCollaborators ? document.collaborators.length : 3
              )
              .map((collaborator) => (
                <div
                  key={collaborator._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {collaborator.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {collaborator.user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {collaborator.user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full ${
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

          {!expandedCollaborators && document.collaborators.length > 3 && (
            <button
              onClick={() => setExpandedCollaborators(true)}
              className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 md:hidden"
            >
              Show {document.collaborators.length - 3} more collaborators
            </button>
          )}
        </div>
      )}

      {/* Enhanced Q&A Section - Responsive */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-sm border border-blue-100 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
            <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Ask Questions
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get instant answers from our AI assistant
            </p>
          </div>
        </div>
        <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
          Have questions about this document? Our AI assistant can help you
          understand the content, find specific information, or clarify complex
          topics instantly.
        </p>
        <Link
          to={`/qa?document=${document._id}`}
          className="inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <MessageSquare size={18} className="sm:w-5 sm:h-5" />
          <span>Ask Questions</span>
          <ExternalLink size={14} className="sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Enhanced Delete Confirmation Modal - Responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
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
                document and all its data.
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

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-10 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default DocumentView;
