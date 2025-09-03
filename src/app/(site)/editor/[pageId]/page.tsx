"use client";

import { toast } from "sonner";
import { Data as PuckData } from "@measured/puck";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageEditor } from "@/components/puck/page-editor";
import { queryClient, orpc } from "@/utils/query-client";
import { PuckLoadingSkeleton } from "@/components/puck/loading-skeleton";

export default function EditorPage() {
  // Route parameters and navigation
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  // Data fetching
  const {
    data: pageData,
    isLoading,
    error,
  } = useQuery(orpc.pages.get.queryOptions({ input: { pageId }}));

  // Mutations
  const updateMutation = useMutation(
    orpc.pages.update.mutationOptions({
      onSuccess: () => {
        toast.success("Page updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["pages", pageId] });
      },
      onError: (error) => {
        toast.error("Failed to update page: " + error.message);
      },
    })
  );

  // Event handlers
  const handleSave = async (content: PuckData, themeId?: string) => {
    updateMutation.mutate({
      pageId,
      data: {
        title: content.root.props?.title || pageData?.page?.title,
        content,
        themeId,
      },
    });
  };

  const handlePublish = async (content: PuckData) => {
    updateMutation.mutate({
      pageId,
      data: {
        content,
        publishedAt: new Date(),
        status: "published",
      },
    });
  };

  const handlePreview = () => {
    const previewUrl = `/preview/${pageId}`;
    window.open(previewUrl, "_blank");
  };

  // Loading and error states
  if (isLoading) {
    return <PuckLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <PageEditor
      initialData={pageData?.page?.content}
      themeId={pageData?.page?.themeId || undefined}
      onSave={handleSave}
      onPreview={handlePreview}
      onPublish={handlePublish}
      pageId={pageId}
      isLoading={isLoading}
    />
  );
}
