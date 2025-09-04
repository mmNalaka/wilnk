"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/query-client";
import { ThemeEditorInline } from "@/components/themes/theme-editor-inline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditThemePage() {
  const params = useParams<{ themeId: string }>();
  const router = useRouter();
  const themeId = params?.themeId;

  const { data, isLoading, isError } = useQuery(
    orpc.themes.get.queryOptions({ input: { themeId } })
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{isLoading ? "Loading..." : `Edit Theme`}</h1>
          <p className="text-sm text-muted-foreground">Adjust variables with the color picker and see a live preview.</p>
        </div>
        <Link href="/themes">
          <Button variant="link"><ArrowLeft className="mr-2 h-4 w-4" />Back to Themes</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading theme...</div>
          ) : isError || !data?.theme ? (
            <div className="text-sm text-destructive">Failed to load theme.</div>
          ) : (
            <ThemeEditorInline
              themeId={data.theme.id}
              initialName={data.theme.name}
              initialDescription={data.theme.description}
              initialConfig={data.theme.config}
              isSystem={data.theme.isSystem}
              onSaved={(id) => router.push(`/themes/${id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
