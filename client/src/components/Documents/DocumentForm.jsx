import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useCreateDocument,
  useUpdateDocument,
  useDocument,
} from "../../hooks/useDocuments";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Save, X, Eye, FileText } from "lucide-react";
import toast from "react-hot-toast";

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const { data: document, isLoading: loadingDocument } = useDocument(id);
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "Documentation",
      visibility: "private",
      status: "draft",
      changeDescription: "",
    },
  });

  const content = watch("content");

  // Update word count when content changes
  useEffect(() => {
    if (content) {
      const words = content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [content]);

  // Populate form with document data when editing
  useEffect(() => {
    if (isEditing && document) {
      setValue("title", document.title);
      setValue("content", document.content);
      setValue("category", document.category);
      setValue("visibility", document.visibility);
      setValue("status", document.status);
    }
  }, [document, isEditing, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateDocument.mutateAsync({ id, ...data });
        toast.success("Document updated successfully!");
      } else {
        await createDocument.mutateAsync(data);
        toast.success("Document created successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    navigate(-1);
  };

  const categories = [
    "Research",
    "Documentation",
    "Meeting Notes",
    "Project",
    "Knowledge Base",
    "Other",
  ];

  if (isEditing && loadingDocument) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Document" : "Create New Document"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? "Update your document"
                  : "Create a new document with AI-powered features"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">{wordCount} words</div>

              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isPreviewMode
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 200,
                    message: "Title must be less than 200 characters",
                  },
                })}
                className={`input ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="Enter document title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  {...register("visibility")}
                  className="input"
                >
                  <option value="private">Private</option>
                  <option value="team">Team</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select id="status" {...register("status")} className="input">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content *
              </label>

              {isPreviewMode ? (
                <div className="min-h-96 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="prose max-w-none">
                    {content ? (
                      <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No content to preview
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  id="content"
                  rows={20}
                  {...register("content", {
                    required: "Content is required",
                    minLength: {
                      value: 10,
                      message: "Content must be at least 10 characters",
                    },
                  })}
                  className={`input resize-none ${
                    errors.content
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="Start writing your document content here..."
                />
              )}

              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}

              <p className="mt-2 text-sm text-gray-500">
                AI will automatically generate a summary and relevant tags when
                you save the document.
              </p>
            </div>

            {/* Change Description (for editing) */}
            {isEditing && (
              <div>
                <label
                  htmlFor="changeDescription"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Change Description
                </label>
                <input
                  type="text"
                  id="changeDescription"
                  {...register("changeDescription")}
                  className="input"
                  placeholder="Briefly describe what you changed (optional)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  This helps track document version history.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isDirty && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Unsaved changes</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={
                    createDocument.isLoading || updateDocument.isLoading
                  }
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>
                    {createDocument.isLoading || updateDocument.isLoading
                      ? "Saving..."
                      : isEditing
                      ? "Update Document"
                      : "Create Document"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm;
