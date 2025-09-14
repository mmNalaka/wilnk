"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  isPublic: boolean;
  viewCount: number;
  clickCount: number;
  updatedAt: Date;
};

export function PagesTable(props: {
  pages: PageItem[];
  onCopyUrl: (slug: string) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}) {
  const { pages, onCopyUrl, onDelete, deletingId } = props;

  if (!pages?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No pages yet</h3>
        <p className="text-muted-foreground">
          Create your first Link-in-Bio page to get started
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&>tr]:border-b">
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Title
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Slug
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Views
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Clicks
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Updated
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&>tr:last-child]:border-0">
          {pages.map((page) => (
            <tr key={page.id} className="border-b">
              <td className="p-4 align-middle">
                <Link
                  href={`/editor/${page.id}`}
                  className="font-medium hover:underline"
                >
                  {page.title || "Untitled"}
                </Link>
              </td>
              <td className="p-4 align-middle text-muted-foreground">
                /{page.slug}
              </td>
              <td className="p-4 align-middle">
                {page.isPublished ? (
                  <Badge
                    className="bg-green-100 text-green-800 border-green-200"
                    variant="outline"
                  >
                    Published
                  </Badge>
                ) : page.isPublic ? (
                  <Badge
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    variant="outline"
                  >
                    Public
                  </Badge>
                ) : (
                  <Badge
                    className="bg-gray-100 text-gray-800 border-gray-200"
                    variant="outline"
                  >
                    Private
                  </Badge>
                )}
              </td>
              <td className="p-4 align-middle text-right tabular-nums">
                {page.viewCount.toLocaleString()}
              </td>
              <td className="p-4 align-middle text-right tabular-nums">
                {page.clickCount.toLocaleString()}
              </td>
              <td className="p-4 align-middle text-muted-foreground">
                {page.updatedAt.toDateString()}
              </td>
              <td className="p-4 align-middle">
                <div className="flex justify-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/preview/${page.id}`}
                        target="_blank"
                        aria-label="Preview"
                      >
                        <Button variant="outline" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Preview</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onCopyUrl(page.slug)}
                        aria-label="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy URL</TooltipContent>
                  </Tooltip>

                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Delete"
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingId === page.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete page?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the page {page.title || "Untitled"} and remove
                          its data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => onDelete(page.id)}
                            disabled={deletingId === page.id}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
