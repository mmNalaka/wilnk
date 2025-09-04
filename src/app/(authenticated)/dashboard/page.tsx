"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/utils/query-client";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  views: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data service - replace with actual API calls
const mockDashboardService = {
  async getPages(): Promise<Page[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "page-1",
        title: "My Main Page",
        slug: "johndoe",
        status: "published",
        views: 1234,
        clicks: 89,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "page-2",
        title: "Business Links",
        slug: "johndoe-business",
        status: "draft",
        views: 0,
        clicks: 0,
        createdAt: "2024-01-18",
        updatedAt: "2024-01-18",
      },
      {
        id: "page-3",
        title: "Social Media Hub",
        slug: "johndoe-social",
        status: "published",
        views: 567,
        clicks: 34,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-16",
      },
    ];
  },

  async deletePage(pageId: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Deleting page:", pageId);
  },

  async duplicatePage(pageId: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Duplicating page:", pageId);
    return nanoid();
  },
};

export default function DashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
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
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      setDeletingPageId(pageId);
      await mockDashboardService.deletePage(pageId);
      setPages(pages.filter((p) => p.id !== pageId));
    } catch (error) {
      console.error("Failed to delete page:", error);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">My Pages</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your Link-in-Bio pages</p>
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

        {/* Hero / Summary */}
        <div className="rounded-xl border bg-card text-card-foreground p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Total Pages</h3>
              <p className="text-2xl font-semibold mt-1">{pagesQuery?.data?.pages?.length}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Total Views</h3>
              <p className="text-2xl font-semibold mt-1">
                {pagesQuery?.data?.pages
                  .reduce((sum, page) => sum + page.viewCount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Total Clicks</h3>
              <p className="text-2xl font-semibold mt-1">
                {pagesQuery?.data?.pages
                  .reduce((sum, page) => sum + page.clickCount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

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
            <ul className="divide-y">
              {pagesQuery?.data?.pages.map((page) => (
                <li
                  key={page.id}
                  className="px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                      <h3 className="font-medium truncate text-base">{page.title}</h3>
                      <span
                        className={`mt-1 sm:mt-0 inline-flex w-fit items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${
                          page.isPublished
                            ? "bg-green-100 text-green-800 border-green-200"
                            : page.isPublic
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {page.isPublished
                          ? "Published"
                          : page.isPublic
                          ? "Public"
                          : "Private"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="truncate">/{page.slug}</span>
                      <span>{page.viewCount.toLocaleString()} views</span>
                      <span>{page.clickCount.toLocaleString()} clicks</span>
                      <span>Updated {page.updatedAt.toDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link href={`/editor/${page.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only">Edit</span>
                      </Button>
                    </Link>

                    <Link href={`/preview/${page.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only">Preview</span>
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPageUrl(page.slug)}
                      className="gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only">Copy URL</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingPageId === page.id}
                      className="text-red-600 hover:text-red-700 gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
