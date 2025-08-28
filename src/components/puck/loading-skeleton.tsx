export const PuckLoadingSkeleton = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Puck Editor Layout Skeleton */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Component Library */}
        <div className="w-64 border-r bg-white p-4">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-50 p-8">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border">
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-64 border-l bg-white p-4">
          <div className="space-y-4">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-50 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
