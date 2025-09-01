"use client";

import { useState } from "react";
import { Save, Eye } from "lucide-react";
import { Puck, Data } from "@measured/puck";

import { Button } from "@/components/ui/button";
import { puckConfig } from "./config";

import "@measured/puck/puck.css";

interface PageEditorProps {
  pageId?: string;
  initialData?: Data;
  isLoading?: boolean;
  onPreview?: (data: Data) => void;
  onSave?: (data: Data) => Promise<void>;
  onPublish?: (data: Data) => Promise<void>;
}

export const PageEditor = ({ 
  pageId,
  initialData, 
  onSave, 
  onPreview, 
  onPublish,
}: PageEditorProps) => {
  const [data, setData] = useState<Data>(initialData || {
    content: [],
    root: {},
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(data);
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
        
        <div className="flex items-center gap-2">
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

      {/* Puck Editor */}
      <div className="flex-1 bg-background">
        <Puck
          config={puckConfig}
          data={data}
          onChange={setData}
          headerTitle=""
          headerPath=""
          onPublish={onPublish}
        />
      </div>
    </div>
  );
};
