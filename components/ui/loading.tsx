export function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#00B050] mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingFullPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#00B050] mb-4"></div>
        <p className="text-gray-600 text-xl font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-[#00B050]`}></div>
  );
}
