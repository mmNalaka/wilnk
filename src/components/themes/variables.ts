// Grouped theme variables we expose in the editor UI.
// These align with shadcn CSS variable names we already use across the app
// (see `src/styles/themes.css` and Tailwind tokens).

export type ThemeVarGroupKey =
  | "colors.primary"
  | "colors.secondary"
  | "colors.base"
  | "colors.card"
  | "colors.popover"
  | "colors.muted"
  | "colors.accent"
  | "colors.destructive"
  | "borders.inputs"
  | "typography"
  | "radius"
  | "shadows";

export type ThemeVarGroup = {
  key: ThemeVarGroupKey;
  title: string;
  fields: { key: string; label: string; type?: "color" | "text" }[];
};

export const THEME_GROUPS: ThemeVarGroup[] = [
  {
    key: "colors.primary",
    title: "Primary Colors",
    fields: [
      { key: "--primary", label: "Primary", type: "color" },
      {
        key: "--primary-foreground",
        label: "Primary Foreground",
        type: "color",
      },
      { key: "--ring", label: "Ring", type: "color" },
    ],
  },
  {
    key: "colors.secondary",
    title: "Secondary Colors",
    fields: [
      { key: "--secondary", label: "Secondary", type: "color" },
      {
        key: "--secondary-foreground",
        label: "Secondary Foreground",
        type: "color",
      },
    ],
  },
  {
    key: "colors.base",
    title: "Base Colors",
    fields: [
      { key: "--background", label: "Background", type: "color" },
      { key: "--foreground", label: "Foreground", type: "color" },
      { key: "--border", label: "Border", type: "color" },
      { key: "--input", label: "Input", type: "color" },
    ],
  },
  {
    key: "colors.card",
    title: "Card Colors",
    fields: [
      { key: "--card", label: "Card", type: "color" },
      { key: "--card-foreground", label: "Card Foreground", type: "color" },
    ],
  },
  {
    key: "colors.popover",
    title: "Popover Colors",
    fields: [
      { key: "--popover", label: "Popover", type: "color" },
      {
        key: "--popover-foreground",
        label: "Popover Foreground",
        type: "color",
      },
    ],
  },
  {
    key: "colors.muted",
    title: "Muted Colors",
    fields: [
      { key: "--muted", label: "Muted", type: "color" },
      { key: "--muted-foreground", label: "Muted Foreground", type: "color" },
    ],
  },
  {
    key: "colors.accent",
    title: "Accent Colors",
    fields: [
      { key: "--accent", label: "Accent", type: "color" },
      { key: "--accent-foreground", label: "Accent Foreground", type: "color" },
    ],
  },
  {
    key: "colors.destructive",
    title: "Destructive Colors",
    fields: [
      { key: "--destructive", label: "Destructive", type: "color" },
      {
        key: "--destructive-foreground",
        label: "Destructive Foreground",
        type: "color",
      },
    ],
  },
  {
    key: "borders.inputs",
    title: "Border & Input Colors",
    fields: [
      { key: "--border", label: "Border", type: "color" },
      { key: "--input", label: "Input", type: "color" },
      { key: "--ring", label: "Ring", type: "color" },
    ],
  },
  {
    key: "typography",
    title: "Typography",
    fields: [
      { key: "--font-sans", label: "Font Sans", type: "text" },
      { key: "--font-serif", label: "Font Serif", type: "text" },
      { key: "--font-mono", label: "Font Mono", type: "text" },
      {
        key: "--tracking-normal",
        label: "Tracking (letter-spacing)",
        type: "text",
      },
      { key: "--spacing", label: "Base Spacing", type: "text" },
    ],
  },
  {
    key: "radius",
    title: "Radius",
    fields: [{ key: "--radius", label: "Radius", type: "text" }],
  },
  {
    key: "shadows",
    title: "Shadows",
    fields: [
      { key: "--shadow-2xs", label: "Shadow 2XS", type: "text" },
      { key: "--shadow-xs", label: "Shadow XS", type: "text" },
      { key: "--shadow-sm", label: "Shadow SM", type: "text" },
      { key: "--shadow", label: "Shadow", type: "text" },
      { key: "--shadow-md", label: "Shadow MD", type: "text" },
      { key: "--shadow-lg", label: "Shadow LG", type: "text" },
      { key: "--shadow-xl", label: "Shadow XL", type: "text" },
      { key: "--shadow-2xl", label: "Shadow 2XL", type: "text" },
    ],
  },
];

export const emptyThemeFromGroups = (): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const g of THEME_GROUPS) {
    for (const f of g.fields) {
      result[f.key] = "";
    }
  }
  return result;
};
