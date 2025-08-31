import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date) => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
};

export const getCategoryColor = (category) => {
  const colors = {
    Research: "bg-blue-100 text-blue-800",
    Documentation: "bg-green-100 text-green-800",
    "Meeting Notes": "bg-yellow-100 text-yellow-800",
    Project: "bg-purple-100 text-purple-800",
    "Knowledge Base": "bg-indigo-100 text-indigo-800",
    Other: "bg-gray-100 text-gray-800",
  };
  return colors[category] || colors["Other"];
};

export const getStatusColor = (status) => {
  const colors = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };
  return colors[status] || colors["draft"];
};

// Fixed debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
