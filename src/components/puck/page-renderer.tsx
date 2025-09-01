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
  type CSSVarKey =
    | "--color-primary"
    | "--color-secondary"
    | "--color-background"
    | "--color-text"
    | "--font-heading"
    | "--font-body";

  const cssVars: Partial<Record<CSSVarKey, string>> = {};
  if (theme?.colors?.primary) cssVars["--color-primary"] = theme.colors.primary;
  if (theme?.colors?.secondary) cssVars["--color-secondary"] = theme.colors.secondary;
  if (theme?.colors?.background) cssVars["--color-background"] = theme.colors.background;
  if (theme?.colors?.text) cssVars["--color-text"] = theme.colors.text;
  if (theme?.fonts?.heading) cssVars["--font-heading"] = theme.fonts.heading;
  if (theme?.fonts?.body) cssVars["--font-body"] = theme.fonts.body;
  const customStyles = cssVars as React.CSSProperties;

  return (
    <div 
      className={cn("min-h-screen w-full bg-background text-foreground", className)}
      style={{
        ...(theme?.colors?.background ? { backgroundColor: theme.colors.background } : {}),
        ...(theme?.colors?.text ? { color: theme.colors.text } : {}),
        ...(theme?.fonts?.body ? { fontFamily: theme.fonts.body } : {}),
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
