const EmptyState = ({
  icon = "📭",
  title = "Nothing here yet",
  description = "",
  action = null,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-gray-500 max-w-md">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
