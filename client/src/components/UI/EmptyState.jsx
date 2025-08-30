import { clsx } from "clsx";

const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={clsx("text-center py-12", className)}>
      {Icon && <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />}

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      )}

      {action && action}
    </div>
  );
};

export default EmptyState;
