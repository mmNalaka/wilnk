"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { orpc } from "@/utils/query-client";
import { THEME_GROUPS, emptyThemeFromGroups } from "./variables";
import { PreviewSample } from "./preview-sample";
// Using native HTML color input instead of the shadcn color picker

export type ThemeEditorInlineProps = {
  themeId?: string;
  initialName?: string;
  initialDescription?: string | null;
  initialConfig?: Record<string, string>;
  isSystem?: boolean;
  onSaved?: (themeId: string) => void;
};

export function ThemeEditorInline({
  themeId,
  initialName,
  initialDescription,
  initialConfig,
  isSystem,
  onSaved,
}: ThemeEditorInlineProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [config, setConfig] = useState<Record<string, string>>(
    () => ({ ...(emptyThemeFromGroups()), ...(initialConfig ?? {}) })
  );

  useEffect(() => {
    setName(initialName ?? "");
    setDescription(initialDescription ?? "");
    setConfig({ ...(emptyThemeFromGroups()), ...(initialConfig ?? {}) });
  }, [initialName, initialDescription, initialConfig]);

  const createMutation = useMutation(
    orpc.themes.create.mutationOptions({
      onSuccess: ({ theme }) => {
        toast.success("Theme created");
        queryClient.invalidateQueries({ queryKey: ["themes", "list"] });
        onSaved?.(theme.id);
      },
      onError: (e) => toast.error(`Failed to create theme: ${e.message}`),
    })
  );

  const updateMutation = useMutation(
    orpc.themes.update.mutationOptions({
      onSuccess: ({ theme }) => {
        toast.success("Theme updated");
        queryClient.invalidateQueries({ queryKey: ["themes", "list"] });
        if (themeId) queryClient.invalidateQueries({ queryKey: ["themes", "get", themeId] });
        onSaved?.(theme.id);
      },
      onError: (e) => toast.error(`Failed to update theme: ${e.message}`),
    })
  );

  const isEditing = Boolean(themeId);
  const effectiveIsSystem = Boolean(isSystem);

  const handleSave = () => {
    if (!name.trim()) return toast.error("Please enter a theme name");
    const payload = { name: name.trim(), description: description.trim(), config };

    // If this is a system theme, we fork into a new private theme
    if (isEditing && effectiveIsSystem) {
      createMutation.mutate(payload);
      return;
    }

    if (isEditing && themeId) {
      updateMutation.mutate({ themeId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };
  // Match PageRenderer defaults so empty fields still preview with correct initial colors
  const DEFAULT_VARS: Record<string, string> = {
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
    "--font-sans": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    "--font-serif": "ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif",
    "--font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
    "--radius": "0.625rem",
    "--shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "--shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "--shadow-sm": "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "--shadow": "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-md": "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-lg": "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-xl": "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
    "--shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
    "--tracking-normal": "0em",
    "--spacing": "0.25rem",
  };

  const setVar = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Helpers to support the native <input type="color"> which expects #rrggbb
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const toHex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  const hslToRgb = (h: number, s: number, l: number) => {
    // h in [0,360), s,l in [0,1]
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (h % 360) / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0, g1 = 0, b1 = 0;
    if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
    else if (hp < 2) [r1, g1, b1] = [x, c, 0];
    else if (hp < 3) [r1, g1, b1] = [0, c, x];
    else if (hp < 4) [r1, g1, b1] = [0, x, c];
    else if (hp < 5) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];
    const m = l - c / 2;
    return [
      Math.round((r1 + m) * 255),
      Math.round((g1 + m) * 255),
      Math.round((b1 + m) * 255),
    ];
  };
  // Convert OKLCH/OKLAB to sRGB (0-255)
  const srgbEncode = (x: number) => {
    const a = 0.055;
    if (x <= 0.0031308) return 12.92 * x;
    return (1 + a) * Math.pow(x, 1 / 2.4) - a;
  };
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const oklabToRgb = (L: number, a: number, b: number) => {
    // Convert OKLab to linear sRGB
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    r = srgbEncode(r);
    g = srgbEncode(g);
    b_ = srgbEncode(b_);

    return [
      Math.round(clamp01(r) * 255),
      Math.round(clamp01(g) * 255),
      Math.round(clamp01(b_) * 255),
    ] as const;
  };
  const oklchToRgb = (L: number, C: number, Hdeg: number) => {
    const a = C * Math.cos(rad(Hdeg));
    const b = C * Math.sin(rad(Hdeg));
    return oklabToRgb(L, a, b);
  };
  const toHex = (val?: string) => {
    if (!val) return "#000000";
    const v = val.trim();
    // Hex #rgb or #rrggbb
    const mHex = v.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
    if (mHex) {
      const hex = mHex[1];
      if (hex.length === 3) {
        return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
      }
      return `#${hex.substring(0, 6)}`.toLowerCase();
    }
    // rgb/rgba
    const mRgb = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (mRgb) {
      const r = clamp(parseInt(mRgb[1], 10), 0, 255);
      const g = clamp(parseInt(mRgb[2], 10), 0, 255);
      const b = clamp(parseInt(mRgb[3], 10), 0, 255);
      return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
    }
    // hsl/hsla
    const mHsl = v.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (mHsl) {
      const h = parseFloat(mHsl[1]);
      const s = clamp(parseFloat(mHsl[2]) / 100, 0, 1);
      const l = clamp(parseFloat(mHsl[3]) / 100, 0, 1);
      const [r, g, b] = hslToRgb(h, s, l);
      return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
    }
    // oklch(L C h)
    const mOklch = v.match(/^oklch\(\s*([\d.+-]+%?)\s+([\d.+-]+)\s+([\d.+-]+)(?:deg)?(?:\s*\/\s*([\d.]+))?\s*\)$/i);
    if (mOklch) {
      // L may be 0..1 or in %
      const Lraw = mOklch[1];
      const L = Lraw.endsWith("%") ? clamp(parseFloat(Lraw) / 100, 0, 1) : clamp(parseFloat(Lraw), 0, 1);
      const C = clamp(parseFloat(mOklch[2]), 0, 1.5); // allow up to ~1.5 though most themes use small C
      const H = parseFloat(mOklch[3]);
      const [r, g, b] = oklchToRgb(L, C, H);
      return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
    }
    // oklab(L a b)
    const mOklab = v.match(/^oklab\(\s*([\d.+-]+%?)\s+([\d.+-]+)\s+([\d.+-]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
    if (mOklab) {
      const Lraw = mOklab[1];
      const L = Lraw.endsWith("%") ? clamp(parseFloat(Lraw) / 100, 0, 1) : clamp(parseFloat(Lraw), 0, 1);
      const a = parseFloat(mOklab[2]);
      const b = parseFloat(mOklab[3]);
      const [r, g, bC] = oklabToRgb(L, a, b);
      return `#${toHex2(r)}${toHex2(g)}${toHex2(bC)}`;
    }
    // Unsupported formats -> default
    return "#000000";
  };

  const leftColumn = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="theme-name">Name</Label>
        <Input id="theme-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="theme-desc">Description</Label>
        <Input id="theme-desc" value={description ?? ""} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {effectiveIsSystem ? (
        <div className="text-xs text-muted-foreground">System themes are read-only. Saving will create a private copy in your account.</div>
      ) : null}
      <Separator />

      <div className="space-y-3">
        {THEME_GROUPS.map((group) => (
          <Collapsible key={group.key} defaultOpen>
            <Card className="p-0">
              <div className="flex items-center justify-between px-2 py-1.5 border-b">
                <div className="text-sm font-medium">{group.title}</div>
                <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground">
                  Toggle
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="p-2 space-y-1">
                  {group.fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{f.label}</Label>
                      {f.type === "color" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toHex(config[f.key] || DEFAULT_VARS[f.key])}
                            onChange={(e) => {
                              const hex = e.target.value;
                              if (hex !== (config[f.key] ?? "")) setVar(f.key, hex);
                            }}
                            className="h-8 w-10 cursor-pointer rounded-md border bg-background p-0"
                            aria-label={`${f.label} color`}
                          />
                          <Input
                            type="text"
                            value={config[f.key] ?? ""}
                            onChange={(e) => setVar(f.key, e.target.value)}
                            placeholder={DEFAULT_VARS[f.key] || "#rrggbb / rgb(...) / hsl(...) / oklch(...)"}
                            className="flex-1"
                          />
                        </div>
                      ) : (
                        <Input
                          type="text"
                          value={config[f.key] ?? ""}
                          onChange={(e) => setVar(f.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );

  const rightColumn = (
    <div className="rounded-lg border p-6 h-full">
      <PreviewSample theme={useMemo(() => {
        const entries = Object.entries(config);
        const filtered = entries.filter(([, v]) => typeof v === "string" && v.trim() !== "");
        return Object.fromEntries(filtered);
      }, [config])} />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {leftColumn}
      <div className="flex flex-col gap-4">
        {rightColumn}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing && !effectiveIsSystem ? (updateMutation.isPending ? "Updating..." : "Update Theme") : (createMutation.isPending ? "Creating..." : "Save Theme")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Removed ColorPreview to simplify and compact the UI
