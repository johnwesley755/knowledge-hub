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
} from "lucide-react";
import toast from "react-hot-toast";

// ** NEW: Import Tiptap dependencies
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// ** NEW: A simple toolbar component for Tiptap
const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // A helper function to create toolbar buttons
  const ToolbarButton = ({ onClick, isActive, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
        isActive ? "is-active" : "text-gray-600"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 border border-b-0 border-gray-300 rounded-t-lg bg-gray-50">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
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

  // ** NEW: Setup Tiptap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    editorProps: {
      attributes: {
        // Add Tailwind typography classes for beautiful default styling
        class: "prose max-w-none min-h-[400px]",
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

  // ** UPDATED: Populate form and Tiptap editor when editing
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
                className={`input ${errors.title ? "border-red-300" : ""}`}
                placeholder="Enter document title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metadata fields remain the same */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              {isPreviewMode ? (
                <div
                  className="prose max-w-none p-4 border rounded-lg bg-gray-50 min-h-[460px]"
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>No content to preview</p>",
                  }}
                />
              ) : (
                <div>
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} className="tiptap" />
                </div>
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>

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

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div>
                {isDirty && (
                  <span className="flex items-center space-x-1 text-sm text-gray-500">
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
