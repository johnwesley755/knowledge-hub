import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useCreateDocument,
  useUpdateDocument,
  useDocument,
} from "../../hooks/useDocuments";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  Save,
  X,
  Eye,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

// ** NEW: Import Tiptap dependencies
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// ** Enhanced toolbar component for Tiptap
const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Enhanced toolbar button component
  const ToolbarButton = ({ onClick, isActive, children, tooltip }) => (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`p-2.5 rounded-lg transition-all duration-200 group relative ${
        isActive
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center flex-wrap gap-1 p-3 border border-b-0 border-gray-200 rounded-t-xl bg-gradient-to-r from-gray-50 to-white shadow-sm">
      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
        >
          <Strikethrough size={18} />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </div>
    </div>
  );
};

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

  // ** Setup Tiptap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    editorProps: {
      attributes: {
        // Enhanced styling for the editor
        class:
          "prose prose-lg max-w-none min-h-[400px] focus:outline-none p-6 bg-white rounded-b-xl border border-t-0 border-gray-200",
      },
    },
    onUpdate({ editor }) {
      // Sync Tiptap content with React Hook Form
      const html = editor.getHTML();
      setValue("content", html, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Update word count from editor's text content
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    },
  });

  // ** Populate form and Tiptap editor when editing
  useEffect(() => {
    if (isEditing && document && editor) {
      setValue("title", document.title);
      setValue("category", document.category);
      setValue("visibility", document.visibility);
      setValue("status", document.status);
      setValue("content", document.content);

      // Use a timeout to ensure the editor is ready for content
      setTimeout(() => {
        editor.commands.setContent(document.content);
      }, 0);
    }
  }, [document, isEditing, setValue, editor]);

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
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        return;
      }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isEditing && loadingDocument) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Enhanced header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? "Edit Document" : "Create New Document"}
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  {isEditing
                    ? "Update your document with the latest changes"
                    : "Create a new document with AI-powered features and rich text editing"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {wordCount} words
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isPreviewMode
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                <Eye size={20} />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-8">
            {/* Title input */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-gray-800 mb-3"
              >
                Document Title *
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
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 ${
                  errors.title
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder="Enter a descriptive title for your document"
              />
              {errors.title && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">
                    {errors.title.message}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Document Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-600 font-medium">
                        {errors.category.message}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="visibility"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    {...register("visibility")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="private">🔒 Private</option>
                    <option value="team">👥 Team</option>
                    <option value="public">🌍 Public</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    {...register("status")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="published">✅ Published</option>
                    <option value="archived">📦 Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content editor section */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Document Content *
              </label>

              {isPreviewMode ? (
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Preview Mode
                    </span>
                  </div>
                  <div
                    className="prose prose-lg max-w-none p-8 min-h-[460px] bg-white"
                    dangerouslySetInnerHTML={{
                      __html:
                        content ||
                        "<p class='text-gray-500 italic'>No content to preview</p>",
                    }}
                  />
                </div>
              ) : (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} className="tiptap" />
                </div>
              )}

              {errors.content && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">
                    {errors.content.message}
                  </p>
                </div>
              )}
            </div>

            {/* Change description for editing */}
            {isEditing && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <label
                  htmlFor="changeDescription"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Change Description
                </label>
                <input
                  type="text"
                  id="changeDescription"
                  {...register("changeDescription")}
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-200"
                  placeholder="Briefly describe what you changed (optional)"
                />
                <p className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span>
                    This helps track document version history and collaborate
                    effectively.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Enhanced footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {isDirty && (
                  <div className="flex items-center space-x-3 px-4 py-2 bg-orange-100 rounded-full">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-orange-700">
                      Unsaved changes
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={
                    createDocument.isLoading || updateDocument.isLoading
                  }
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {createDocument.isLoading || updateDocument.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>
                        {isEditing ? "Update Document" : "Create Document"}
                      </span>
                    </>
                  )}
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
