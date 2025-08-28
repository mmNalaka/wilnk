"use client";

import { orpc } from "@/utils/query-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageRenderer } from "@/components/puck/page-renderer";

export default function PreviewPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  
  const { data: pageData, isLoading, error } = useQuery(orpc.pages.get.queryOptions({ input: { pageId }}));

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
      data={pageData.page.puckData} 
      theme={undefined} 
      className="bg-gray-50"
    />
  );
}
