"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeEditorInline } from "@/components/themes/theme-editor-inline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewThemePage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Theme</h1>
          <p className="text-sm text-muted-foreground">Design a new theme using the color picker and live preview.</p>
        </div>
        <Link href="/themes">
        <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Back to Themes</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Editor</CardTitle>
          <CardDescription>Adjust variables on the left. Preview updates live on the right.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeEditorInline onSaved={(id) => router.push(`/themes/${id}`)} />
        </CardContent>
      </Card>
    </div>
  );
}
