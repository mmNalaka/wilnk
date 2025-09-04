"use client";

import { orpc } from "@/utils/query-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageRenderer } from "@/components/puck/page-renderer";

export default function PreviewPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  
  const { data: pageData, isLoading, error } = useQuery(orpc.pages.get.queryOptions({ input: { pageId }}));
  const themeId = pageData?.page?.themeId || null;
  // Always provide a queryKey and queryFn; disable when no themeId
  const themeQueryOptions = themeId
    ? orpc.themes.get.queryOptions({ input: { themeId } })
    : ({
        queryKey: ["themes", "get", themeId],
        // Disabled fallback queryFn to satisfy React Query requirements
        queryFn: async () => undefined as unknown,
        enabled: false as const,
      } as const);
  const { data: themeData } = useQuery(themeQueryOptions as Parameters<typeof useQuery>[0]);

  // Extract runtime key-value config map for CSS variables
  let runtimeThemeVars: Record<string, string> | undefined;
  if (themeId && themeData && typeof themeData === "object" && "theme" in themeData) {
    runtimeThemeVars = (themeData as { theme?: { config?: Record<string, string> } }).theme?.config;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you&apos;re looking for doesn&apos; exist.</p>
        </div>
      </div>
    );
  }

  return (
    <PageRenderer
      data={pageData.page.content}
      // Pass flat key-value CSS vars for runtime theming
      theme={runtimeThemeVars}
    />
  );
}
