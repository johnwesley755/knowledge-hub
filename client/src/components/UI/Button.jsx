import { forwardRef } from "react";
import { clsx } from "clsx";
import LoadingSpinner from "../Common/LoadingSpinner";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
      secondary:
        "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
      outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      success:
        "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
      warning:
        "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
      small: "px-3 py-1.5 text-sm rounded-md",
      medium: "px-4 py-2 text-sm rounded-lg",
      large: "px-6 py-3 text-base rounded-lg",
    };

    const classes = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="small" className="mr-2" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
