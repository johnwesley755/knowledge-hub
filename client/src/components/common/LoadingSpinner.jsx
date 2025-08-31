const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const dotSizes = {
    small: "w-1 h-1",
    medium: "w-1.5 h-1.5",
    large: "w-2 h-2",
  };

  const containerSizes = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Main Spinner Container with Backdrop */}
      <div
        className={`relative ${containerSizes[size]} flex items-center justify-center`}
      >
        {/* Background Circle - Subtle Light Theme */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-gray-100 rounded-full`}
        />

        {/* Primary Animated Ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin`}
          style={{
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Secondary Ring - Slower Animation */}
        <div
          className={`absolute ${sizeClasses[size]} border-2 border-transparent border-b-purple-400 border-l-purple-300 rounded-full`}
          style={{
            animation: "spin 1.5s linear infinite reverse",
          }}
        />

        {/* Inner Pulsing Core */}
        <div
          className={`absolute ${
            size === "small"
              ? "w-2 h-2"
              : size === "medium"
              ? "w-3 h-3"
              : "w-4 h-4"
          } bg-gradient-to-r from-blue-400 to-purple-400 rounded-full`}
          style={{
            animation: "pulse 2s ease-in-out infinite",
          }}
        />

        {/* Orbiting Dots */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full`}
          style={{
            animation: "spin 2s linear infinite",
          }}
        >
          <div
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-blue-500 rounded-full`}
          />
        </div>

        <div
          className={`absolute ${sizeClasses[size]} rounded-full`}
          style={{
            animation: "spin 2.5s linear infinite reverse",
          }}
        >
          <div
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-purple-500 rounded-full`}
          />
        </div>

        {/* Shimmer Effect */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full border-2 border-transparent`}
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        @keyframes shimmer {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Ensure smooth animations */
        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        /* Light theme optimized colors */
        .spinner-light {
          --spinner-primary: #3b82f6;
          --spinner-secondary: #8b5cf6;
          --spinner-background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
