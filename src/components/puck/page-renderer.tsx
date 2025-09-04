"use client";

import { Render, Data } from "@measured/puck";
import { puckConfig } from "./config";
import { AnalyticsTracker } from "./analytics-tracker";
import "@measured/puck/puck.css";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/types/types";

interface PageRendererProps {
  data: Data;
  pageId?: string;
  className?: string;
  // Accept either structured ThemeConfig or a flat key-value map of CSS variables
  theme?: ThemeConfig | Record<string, string>;
}

export const PageRenderer = ({
  data,
  pageId,
  className,
  theme,
}: PageRendererProps) => {
  type CSSVarKey =
    | "--primary"
    | "--secondary"
    | "--background"
    | "--foreground"
    | "--font-sans"
    | "--font-serif";

  // Default CSS variables fallback
  const defaultVars: Record<string, string> = {
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.1450 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.1450 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.1450 0 0)",
    "--primary": "oklch(0.2050 0 0)",
    "--primary-foreground": "oklch(0.9850 0 0)",
    "--secondary": "oklch(0.9700 0 0)",
    "--secondary-foreground": "oklch(0.2050 0 0)",
    "--muted": "oklch(0.9700 0 0)",
    "--muted-foreground": "oklch(0.5560 0 0)",
    "--accent": "oklch(0.9700 0 0)",
    "--accent-foreground": "oklch(0.2050 0 0)",
    "--destructive": "oklch(0.5770 0.2450 27.3250)",
    "--destructive-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.9220 0 0)",
    "--input": "oklch(0.9220 0 0)",
    "--ring": "oklch(0.7080 0 0)",
    "--font-sans":
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    "--font-serif":
      'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    "--font-mono":
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    "--radius": "0.625rem",
    "--shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "--shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "--shadow-sm":
      "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "--shadow":
      "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-md":
      "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-lg":
      "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-xl":
      "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
    "--tracking-normal": "0em",
    "--spacing": "0.25rem",
  };

  // Build CSS variables from either structured ThemeConfig or flat key-value pairs
  const cssVars: Partial<Record<CSSVarKey | string, string>> = {
    ...defaultVars,
  };
  if (theme && typeof theme === "object" && !Array.isArray(theme)) {
    // If it's a flat key-value map (from backend), copy as-is
    const entries = Object.entries(theme as Record<string, string>);
    const looksFlat = entries.every(([, v]) => typeof v === "string");
    if (looksFlat) {
      for (const [k, v] of entries) cssVars[k] = v as string;
    } else {
      // Otherwise treat as structured ThemeConfig
      const cfg = theme as ThemeConfig;
      if (cfg?.config?.primary) cssVars["--primary"] = cfg.config.primary;
      if (cfg?.config?.secondary) cssVars["--secondary"] = cfg.config.secondary;
      if (cfg?.config?.background)
        cssVars["--background"] = cfg.config.background;
      if (cfg?.config?.text) cssVars["--foreground"] = cfg.config.text;
      if (cfg?.config?.fontSerif)
        cssVars["--font-serif"] = cfg.config.fontSerif;
      if (cfg?.config?.fontSans) cssVars["--font-sans"] = cfg.config.fontSans;
    }
  }
  const customStyles = cssVars as React.CSSProperties;

  // Render without static theme classes; rely on runtime CSS variables only
  return (
    <div className={cn("h-full")} style={customStyles}>
      <div
        className={cn(
          "theme-container bg-background text-foreground",
          className
        )}
      >
        {pageId && <AnalyticsTracker pageId={pageId} />}
        <div className="max-w-md mx-auto px-4 py-4">
          <Render config={puckConfig} data={data} />
        </div>
      </div>
    </div>
  );
};
