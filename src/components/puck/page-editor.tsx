"use client";

// React
import { useMemo, useState } from "react";

// Data & Networking
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/query-client";

// UI & Editor
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { Button } from "@/components/ui/button";
import { puckConfig } from "./config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Eye } from "lucide-react";

// Types
import type { ThemeConfig } from "@/types/types";

interface PageEditorProps {
  pageId?: string;
  initialData?: Data;
  isLoading?: boolean;
  onPreview?: (data: Data) => void;
  onSave?: (data: Data, themeId?: string) => Promise<void>;
  onPublish?: (data: Data) => Promise<void>;
  themeId?: string;
}

export const PageEditor = ({
  pageId,
  initialData,
  onSave,
  onPreview,
  onPublish,
  themeId,
}: PageEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Data>(
    initialData || {
      content: [],
      root: {},
    }
  );

  // Load themes from DB via oRPC (select array directly for safe typing)
  const { data: themes = [], isLoading: isThemesLoading } = useQuery<
    ThemeConfig[]
  >({
    ...orpc.themes.list.queryOptions({ input: {} }),
    select: (d: { themes?: ThemeConfig[] } | undefined): ThemeConfig[] =>
      d?.themes ?? [],
  });
  const [selectedThemeId, setSelectedThemeId] = useState<string | undefined>(
    () => themeId
  );

  const selectedTheme = useMemo(
    () => themes.find((t: ThemeConfig) => t.id === selectedThemeId),
    [themes, selectedThemeId]
  );
  const runtimeThemeStyle = useMemo(
    () => (selectedTheme?.config ?? {}) as React.CSSProperties,
    [selectedTheme]
  );

  const ThemeSelector = ({
    value,
    onChange,
  }: {
    value?: string;
    onChange: (val: string) => void;
  }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Theme</span>
      <Select value={value ?? undefined} onValueChange={onChange}>
        <SelectTrigger size="sm" className="min-w-[200px]">
          <SelectValue
            placeholder={isThemesLoading ? "Loading themes..." : "Select theme"}
          />
        </SelectTrigger>
        <SelectContent>
          {isThemesLoading && (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Loading...
            </div>
          )}
          {!isThemesLoading && themes.length === 0 && (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              No themes
            </div>
          )}
          {!isThemesLoading &&
            themes.map((t: ThemeConfig) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      // Persist with the currently selected theme
      await onSave(data, selectedThemeId);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(data);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Page Editor</h1>
          {pageId && (
            <span className="text-sm text-muted-foreground">ID: {pageId}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Theme selector (from DB) */}
          <ThemeSelector
            value={selectedThemeId}
            onChange={setSelectedThemeId}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Puck Editor (no static theme classes, rely on runtime CSS vars) */}
      <div className={"flex-1"} style={runtimeThemeStyle}>
        <Puck
          config={puckConfig}
          data={data}
          onChange={setData}
          onPublish={onPublish}
          iframe={{
            enabled: false,
            waitForStyles: true,
          }}
        />
      </div>
    </div>
  );
};
