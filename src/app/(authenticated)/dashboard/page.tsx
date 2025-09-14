"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Eye, MousePointer, Layers } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/utils/query-client";
import { toast } from "sonner";
import { PagesTable } from "./pages-table";
import { SectionCards } from "@/components/section-cards";

// NOTE: Dashboard uses oRPC client for data operations

export default function DashboardPage() {
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);

  const pagesQuery = useQuery({
    queryKey: ["pages"],
    queryFn: () => client.pages.list(),
  });

  const createPageMutation = useMutation({
    mutationFn: () =>
      client.pages.create({
        title: "New Page",
      }),
    onSuccess: () => {
      pagesQuery.refetch();
      toast.success("Page created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create page");
      console.error(">>>Failed to create page", error);
    },
  });

  const handleDelete = async (pageId: string) => {
    try {
      setDeletingPageId(pageId);
      await client.pages.delete({ pageId });
      toast.success("Page deleted");
      // After deletion, refresh the list from server
      pagesQuery.refetch();
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    } finally {
      setDeletingPageId(null);
    }
  };

  const handleCreatePage = () => {
    createPageMutation.mutate();
  };

  const copyPageUrl = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    // Show toast notification
    console.log("URL copied to clipboard:", url);
  };

  if (pagesQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">My Pages</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your Link-in-Bio pages
            </p>
          </div>
          <Button
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={handleCreatePage}
            disabled={createPageMutation.isPending}
          >
            {createPageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {createPageMutation.isPending ? "Creating..." : "Create New Page"}
          </Button>
        </div>

        {/* Summary Cards */}
        <SectionCards
          className="mb-8 gap-3"
          compact
          items={[
            {
              title: "Total Pages",
              value: pagesQuery?.data?.pages?.length ?? 0,
              icon: <Layers className="h-4 w-4" />,
              subtitle: "Your published and draft pages",
              helpText: "Manage and organize your Link-in-Bio pages",
            },
            {
              title: "Total Views",
              value: (pagesQuery?.data?.pages ?? [])
                .reduce((sum, page) => sum + page.viewCount, 0)
                .toLocaleString(),
              icon: <Eye className="h-4 w-4" />,
              subtitle: "Traffic for all pages",
              helpText: "Sum of page views across your pages",
            },
            {
              title: "Total Clicks",
              value: (pagesQuery?.data?.pages ?? [])
                .reduce((sum, page) => sum + page.clickCount, 0)
                .toLocaleString(),
              icon: <MousePointer className="h-4 w-4" />,
              subtitle: "Engagement on links",
              helpText: "Total clicks on your page links",
            },
          ]}
          columns={{ base: 1, sm: 2, lg: 3, xl: 3 }}
        />

        {/* Pages List */}
        <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Your Pages</h2>
          </div>

          {pagesQuery?.data?.pages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Plus className="w-10 h-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first Link-in-Bio page to get started
              </p>
              <Link href="/editor/new">
                <Button>Create Your First Page</Button>
              </Link>
            </div>
          ) : (
            <div className="px-2 sm:px-4 py-2">
              <PagesTable
                pages={pagesQuery.data?.pages ?? []}
                onCopyUrl={copyPageUrl}
                onDelete={handleDelete}
                deletingId={deletingPageId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
