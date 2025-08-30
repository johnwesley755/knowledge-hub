import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { qaAPI, documentsAPI } from "../../services/api.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  FileText,
  Search,
  BookOpen,
  Lightbulb,
  Clock,
  Trash2,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/helpers.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const TeamQA = () => {
  const [question, setQuestion] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [searchMode, setSearchMode] = useState("all"); // 'all' or 'document'
  const [qaHistory, setQaHistory] = useState([]);

  // Get user's documents for context selection
  const { data: documentsData } = useQuery(
    ["documents-for-qa"],
    () => documentsAPI.getAll({ limit: 100 }),
    {
      select: (data) => data.data?.data || [],
    }
  );

  const askQuestionMutation = useMutation(
    async (questionData) => {
      const response = await qaAPI.askQuestion(questionData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        // Add to history
        const newQA = {
          id: Date.now(),
          question: data.question,
          answer: data.answer,
          metadata: data.metadata,
          timestamp: new Date(),
        };
        setQaHistory((prev) => [newQA, ...prev]);
        setQuestion("");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to get answer");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const questionData = {
      question: question.trim(),
      documentId:
        searchMode === "document" && selectedDocument
          ? selectedDocument
          : undefined,
    };

    askQuestionMutation.mutate(questionData);
  };

  const clearHistory = () => {
    setQaHistory([]);
    toast.success("Q&A history cleared");
  };

  const exampleQuestions = [
    "What are the key findings from our recent research?",
    "How do we handle project escalations?",
    "What's our current documentation process?",
    "Summarize the meeting notes from last week",
    "What are the best practices mentioned in our guides?",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-2">
          <MessageSquare className="h-6 w-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900">Team Q&A</h1>
          <div className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
            AI Assistant
          </div>
        </div>
        <p className="text-gray-600">
          Ask questions about your documents and get AI-powered answers based on
          your knowledge base.
        </p>
      </div>

      {/* Question Input */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Mode Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Search in:
            </span>
            <div className="flex border rounded-lg">
              <button
                type="button"
                onClick={() => setSearchMode("all")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  searchMode === "all"
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Documents
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("document")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  searchMode === "document"
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Specific Document
              </button>
            </div>
          </div>

          {/* Document Selection */}
          {searchMode === "document" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Document
              </label>
              <select
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="input"
              >
                <option value="">Choose a document...</option>
                {documentsData?.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.title} ({doc.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Question Input */}
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="input min-h-24 pr-12 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!question.trim() || askQuestionMutation.isLoading}
              className="absolute bottom-3 right-3 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {askQuestionMutation.isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Example Questions */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Example questions:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setQuestion(example)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Q&A History */}
      {qaHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Q&A History
              </h2>
              <button
                onClick={clearHistory}
                className="btn btn-secondary flex items-center space-x-2 text-sm"
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {qaHistory.map((qa) => (
              <div key={qa.id} className="p-6">
                {/* Question */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        You asked:
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(qa.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-800 bg-blue-50 rounded-lg p-3">
                      {qa.question}
                    </p>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        AI Assistant:
                      </span>
                      {qa.metadata?.sourceDocuments && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FileText size={12} />
                          <span>
                            Based on {qa.metadata.sourceDocuments.length}{" "}
                            document(s)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none bg-green-50 rounded-lg p-3">
                      <p className="whitespace-pre-wrap text-gray-800">
                        {qa.answer}
                      </p>
                    </div>

                    {/* Source Documents */}
                    {qa.metadata?.sourceDocuments &&
                      qa.metadata.sourceDocuments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Sources:
                          </p>
                          <div className="space-y-1">
                            {qa.metadata.sourceDocuments.map((source) => (
                              <Link
                                key={source.id}
                                to={`/documents/${source.id}`}
                                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                              >
                                <FileText size={14} />
                                <span>{source.title}</span>
                                <span className="text-gray-500">
                                  by {source.author}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {qaHistory.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Ask questions about your documents and get instant AI-powered
            answers. The more specific your question, the better the answer will
            be.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Tips for better results:
            </h4>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Be specific about what you want to know</li>
              <li>• Reference specific topics or document types</li>
              <li>• Ask follow-up questions for clarification</li>
              <li>• Use natural language - no need for keywords</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamQA;
