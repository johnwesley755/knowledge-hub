import { X } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
const TagChip = ({
  tag,
  onRemove,
  onClick,
  variant = "default",
  size = "medium",
  removable = false,
  className,
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(tag);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full transition-colors",
        variants[variant],
        sizes[size],
        onClick && "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <span>#{tag}</span>
      {removable && onRemove && (
        <button
          onClick={handleRemove}
          className="ml-1 p-0.5 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
          aria-label={`Remove ${tag} tag`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default TagChip;

// Tag Input Component for creating/editing tags
export const TagInput = ({
  tags = [],
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 10,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // You could add tag suggestions logic here
    // For now, just clear suggestions
    setSuggestions([]);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      const newTags = [...tags];
      newTags.pop();
      onTagsChange(newTags);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      onTagsChange([...tags, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={clsx("space-y-2", className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <TagChip
              key={index}
              tag={tag}
              onRemove={removeTag}
              removable
              variant="primary"
            />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={addTag}
          placeholder={
            tags.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder
          }
          disabled={tags.length >= maxTags}
          className="input"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(suggestion);
                  addTag();
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                #{suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Press Enter or comma to add tags. {tags.length}/{maxTags} tags used.
      </p>
    </div>
  );
};
