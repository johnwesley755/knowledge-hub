import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { qaAPI, documentsAPI } from "../../services/api.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
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
  Sparkles,
  Brain,
  MessageCircle,
  ChevronRight,
  Info,
  Zap,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Knowledge Assistant
                </h1>
                <p className="text-gray-600 mt-1">
                  Unlock insights from your document library
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How it works
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Ask questions about your documents and get AI-powered answers
                  based on your knowledge base. Our intelligent system searches
                  through your content to provide accurate, contextual
                  responses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Question Input */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Ask a Question
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Search Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Search scope:
                  </span>
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setSearchMode("all")}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      searchMode === "all"
                        ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>All Documents</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode("document")}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      searchMode === "document"
                        ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Specific Document</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Document Selection */}
              {searchMode === "document" && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800 mb-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Select Document</span>
                  </label>
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                  >
                    <option value="">Choose a document to search in...</option>
                    {documentsData?.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.title} ({doc.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Enhanced Question Input */}
              <div className="relative">
                <div className="absolute top-4 left-4 text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to know about your documents?"
                  className="w-full pl-14 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 resize-none text-gray-800"
                  rows={4}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || askQuestionMutation.isLoading}
                  className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {askQuestionMutation.isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              {/* Enhanced Example Questions */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    Try these example questions:
                  </span>
                </div>
                <div className="grid gap-2">
                  {exampleQuestions.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setQuestion(example)}
                      className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left border border-gray-200 hover:border-amber-300 hover:shadow-sm flex items-center justify-between group"
                    >
                      <span>{example}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Q&A History */}
        {qaHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Conversation History
                  </h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                    {qaHistory.length}{" "}
                    {qaHistory.length === 1 ? "conversation" : "conversations"}
                  </span>
                </div>
                <button
                  onClick={clearHistory}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  <Trash2 size={16} />
                  <span>Clear History</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {qaHistory.map((qa) => (
                <div
                  key={qa.id}
                  className="p-8 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Enhanced Question */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <User size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          You asked
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock size={12} />
                          <span>{formatRelativeTime(qa.timestamp)}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-gray-800 leading-relaxed">
                          {qa.question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Answer */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-semibold text-gray-900">
                          AI Assistant
                        </span>
                        {qa.metadata?.sourceDocuments && (
                          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                            <FileText size={12} />
                            <span>
                              {qa.metadata.sourceDocuments.length} source
                              {qa.metadata.sourceDocuments.length !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 mb-4">
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed m-0">
                            {qa.answer}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Source Documents */}
                      {qa.metadata?.sourceDocuments &&
                        qa.metadata.sourceDocuments.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-3">
                              <BookOpen className="w-4 h-4 text-gray-500" />
                              <p className="text-sm font-semibold text-gray-700">
                                Referenced Documents:
                              </p>
                            </div>
                            <div className="grid gap-2">
                              {qa.metadata.sourceDocuments.map((source) => (
                                <Link
                                  key={source.id}
                                  to={`/documents/${source.id}`}
                                  className="flex items-center space-x-3 p-3 text-sm bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 rounded-lg border border-gray-200 hover:border-blue-300 group"
                                >
                                  <FileText
                                    size={16}
                                    className="text-blue-500 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium truncate block">
                                      {source.title}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      by {source.author}
                                    </span>
                                  </div>
                                  <ChevronRight
                                    size={16}
                                    className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                                  />
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

        {/* Enhanced Empty State */}
        {qaHistory.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-blue-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your First Conversation
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ask questions about your documents and get instant AI-powered
                answers. The more specific your question, the better and more
                accurate the answer will be.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-gray-800">
                    Pro Tips for Better Results:
                  </h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Be specific about what you want to know</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Reference specific topics or document types</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Ask follow-up questions for clarification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Use natural language - no need for keywords</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamQA;
