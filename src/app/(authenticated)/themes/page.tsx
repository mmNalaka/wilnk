"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/query-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreviewSample } from "@/components/themes/preview-sample";
import { Plus, Pencil, Eye } from "lucide-react";
import Link from "next/link";

type ThemeListItem = {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  config: Record<string, string>;
};

export default function ThemesPage() {
  const { data } = useQuery(orpc.themes.list.queryOptions({ input: {} }));
  const themes: ThemeListItem[] = useMemo(
    () => (data?.themes as ThemeListItem[] | undefined) ?? [],
    [data],
  );

  // Live preview uses the same mechanism as the editor preview
  const [livePreviewTheme, setLivePreviewTheme] = useState<
    Record<string, string> | undefined
  >(undefined);

  // Group themes by system/custom
  const { systemThemes, customThemes } = useMemo(() => {
    const systemThemes = themes.filter((t) => t.isSystem);
    const customThemes = themes.filter((t) => !t.isSystem);
    return { systemThemes, customThemes };
  }, [themes]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Themes</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit and manage your themes.
          </p>
        </div>
        <Link href="/themes/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Theme
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: compact grouped lists */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Custom Themes</CardTitle>
              <CardDescription>Your personal themes</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {customThemes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No custom themes yet.
                </div>
              ) : (
                <div className="divide-y border rounded-md">
                  {customThemes.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {t.name}
                        </div>
                        {t.description ? (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {t.description}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLivePreviewTheme(t.config ?? {})}
                          aria-label={`Preview ${t.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/themes/${t.id}`}
                          aria-label={`Edit ${t.name}`}
                        >
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">System Themes</CardTitle>
              <CardDescription>Built-in themes</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {systemThemes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No system themes.
                </div>
              ) : (
                <div className="divide-y border rounded-md">
                  {systemThemes.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate flex items-center gap-2">
                          <span>{t.name}</span>
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border bg-muted text-muted-foreground">
                            System
                          </span>
                        </div>
                        {t.description ? (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {t.description}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLivePreviewTheme(t.config ?? {})}
                          aria-label={`Preview ${t.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/themes/${t.id}`}
                          aria-label={`Edit ${t.name}`}
                        >
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Select a theme on the left to preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-6">
                <PreviewSample theme={livePreviewTheme} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Editor moved to dedicated routes */}
    </div>
  );
}
