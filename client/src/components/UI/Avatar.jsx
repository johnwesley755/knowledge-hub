import { clsx } from "clsx";
import { User } from "lucide-react";

const Avatar = ({
  src,
  alt,
  name,
  size = "medium",
  className,
  showOnlineStatus = false,
  isOnline = false,
}) => {
  const sizes = {
    small: "w-6 h-6 text-xs",
    medium: "w-8 h-8 text-sm",
    large: "w-12 h-12 text-base",
    xlarge: "w-16 h-16 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <div className={clsx("relative inline-block", className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={clsx("rounded-full object-cover", sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            "rounded-full bg-primary-500 text-white flex items-center justify-center font-medium",
            sizes[size]
          )}
        >
          {name ? (
            getInitials(name)
          ) : (
            <User size={size === "small" ? 12 : 16} />
          )}
        </div>
      )}

      {showOnlineStatus && (
        <div
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            size === "small" ? "w-2 h-2" : "w-3 h-3",
            isOnline ? "bg-green-400" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
