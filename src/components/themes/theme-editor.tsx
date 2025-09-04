"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { THEME_GROUPS, emptyThemeFromGroups } from "./variables";
import { orpc } from "@/utils/query-client";

export type ThemeEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // If provided, we treat as editing existing theme; otherwise creating new
  themeId?: string;
  initialName?: string;
  initialDescription?: string;
  initialConfig?: Record<string, string>;
  onSaved?: (themeId: string) => void;
  // Emit current config for live preview by parent
  onConfigChange?: (config: Record<string, string>) => void;
};

export function ThemeEditor({
  open,
  onOpenChange,
  themeId,
  initialName,
  initialDescription,
  initialConfig,
  onSaved,
  onConfigChange,
}: ThemeEditorProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [config, setConfig] = useState<Record<string, string>>(
    () => ({ ...(emptyThemeFromGroups()), ...(initialConfig ?? {}) })
  );

  const shallowEqual = (a: Record<string, string>, b: Record<string, string>) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  };

  useEffect(() => {
    // sync when opening with new theme
    if (open) {
      setName(initialName ?? "");
      setDescription(initialDescription ?? "");
      const next = { ...(emptyThemeFromGroups()), ...(initialConfig ?? {}) };
      setConfig((prev) => {
        if (!shallowEqual(prev, next)) {
          onConfigChange?.(next);
          return next;
        }
        // no change
        return prev;
      });
    }
  }, [open, initialName, initialDescription, initialConfig, onConfigChange]);

  // runtime style is consumed by parent via onConfigChange; no local use here

  const createMutation = useMutation(
    orpc.themes.create.mutationOptions({
      onSuccess: ({ theme }) => {
        toast.success("Theme created");
        queryClient.invalidateQueries({ queryKey: ["themes", "list"] });
        onSaved?.(theme.id);
        onOpenChange(false);
      },
      onError: (e) => toast.error(`Failed to create theme: ${e.message}`),
    })
  );

  const updateMutation = useMutation(
    orpc.themes.update.mutationOptions({
      onSuccess: ({ theme }) => {
        toast.success("Theme updated");
        queryClient.invalidateQueries({ queryKey: ["themes", "list"] });
        if (themeId) {
          queryClient.invalidateQueries({ queryKey: ["themes", "get", themeId] });
        }
        onSaved?.(theme.id);
        onOpenChange(false);
      },
      onError: (e) => toast.error(`Failed to update theme: ${e.message}`),
    })
  );

  const isEditing = Boolean(themeId);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a theme name");
      return;
    }
    const payload = { name: name.trim(), description: description.trim(), config };
    if (isEditing && themeId) {
      updateMutation.mutate({ themeId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const setVar = (key: string, value: string) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      onConfigChange?.(next);
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[360px] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>{isEditing ? "Edit Theme" : "Create Theme"}</SheetTitle>
          <SheetDescription>Adjust CSS variables and preview in real time.</SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto">
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Name</Label>
              <Input id="theme-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-desc">Description</Label>
              <Input id="theme-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Separator className="my-1" />
            <div className="space-y-2">
              {THEME_GROUPS.map((group) => (
                <Card key={group.key} className="p-3">
                  <div className="text-sm font-medium mb-2">{group.title}</div>
                  <div className="space-y-2">
                    {group.fields.map((f) => (
                      <div key={f.key} className="grid grid-cols-[140px_1fr] items-center gap-2">
                        <Label htmlFor={f.key} className="text-xs text-muted-foreground">
                          {f.label}
                        </Label>
                        {f.type === "color" ? (
                          <Input
                            id={f.key}
                            type="text"
                            placeholder="oklch(...) or hex/rgb/hsl"
                            value={config[f.key] ?? ""}
                            onChange={(e) => setVar(f.key, e.target.value)}
                          />
                        ) : (
                          <Input
                            id={f.key}
                            type="text"
                            value={config[f.key] ?? ""}
                            onChange={(e) => setVar(f.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter className="px-4 py-3 border-t flex gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? (updateMutation.isPending ? "Updating..." : "Update Theme") : (createMutation.isPending ? "Creating..." : "Save Theme")}
          </Button>
        </SheetFooter>
      </SheetContent>
      {/* Right side preview area is controlled by parent; this component only handles form */}
    </Sheet>
  );
}

export function ThemePreviewFrame({ style }: { style: React.CSSProperties }) {
  // Consumers can render this next to the sheet to preview.
  return (
    <div className="flex-1 overflow-auto" style={style} />
  );
}
