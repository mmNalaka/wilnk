"use client";

import { Render, Data } from "@measured/puck";
import { puckConfig } from "./config";
import { AnalyticsTracker } from "./analytics-tracker";
import "@measured/puck/puck.css";
import { cn } from "@/lib/utils";

interface PageRendererProps {
  data: Data;
  pageId?: string;
  className?: string;
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
  };
}

export const PageRenderer = ({ data, pageId, className, theme }: PageRendererProps) => {
  const customStyles = theme ? {
    '--color-primary': theme.colors?.primary || '#000000',
    '--color-secondary': theme.colors?.secondary || '#6B7280',
    '--color-background': theme.colors?.background || '#FFFFFF',
    '--color-text': theme.colors?.text || '#111827',
    '--font-heading': theme.fonts?.heading || 'Inter, sans-serif',
    '--font-body': theme.fonts?.body || 'Inter, sans-serif',
  } as React.CSSProperties : {};

  return (
    <div 
      className={cn("min-h-screen w-full", className)}
      style={{
        backgroundColor: theme?.colors?.background || '#FFFFFF',
        color: theme?.colors?.text || '#111827',
        fontFamily: theme?.fonts?.body || 'Inter, sans-serif',
        ...customStyles,
      }}
    >
      {pageId && <AnalyticsTracker pageId={pageId} />}
      <div className="max-w-md mx-auto px-4 py-8">
        <Render config={puckConfig} data={data} />
      </div>
    </div>
  );
};
