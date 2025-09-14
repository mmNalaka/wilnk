"use client";

import { ComponentConfig } from "@measured/puck";
import {
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface LinkButtonProps {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  style: "filled" | "outlined" | "minimal";
  size: "sm" | "md" | "lg";
  openInNewTab: boolean;
  className?: string;
}

const iconMap = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  phone: Phone,
  website: Globe,
  external: ExternalLink,
};

export const LinkButton = ({
  title,
  url,
  description,
  icon,
  style,
  size,
  openInNewTab,
  className,
}: LinkButtonProps) => {
  const IconComponent =
    icon && iconMap[icon as keyof typeof iconMap]
      ? iconMap[icon as keyof typeof iconMap]
      : null;

  const handleClick = () => {
    // Track click analytics
    if (typeof window !== "undefined") {
      if (window.__ANALYTICS_ENABLED__) {
        import("../analytics-tracker").then(({ getAnalytics }) => {
          const analytics = getAnalytics();
          // pageId is managed by tracker (stored from page view)
          analytics.trackClick(
            undefined,
            "LinkButton",
            "LinkButton",
            url,
            title,
          );
        });
      }

      window.open(url, openInNewTab ? "_blank" : "_self");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={
        style === "filled"
          ? "default"
          : style === "outlined"
            ? "outline"
            : "ghost"
      }
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      className={cn(
        "w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] rounded-lg",
        // ensure center layout similar to previous
        "flex items-center justify-center gap-3",
        className,
      )}
    >
      {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
      <div className="flex-1 text-center">
        <div className="font-medium">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>
      {!IconComponent && (
        <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-70" />
      )}
    </Button>
  );
};

export const linkButtonConfig: ComponentConfig<LinkButtonProps> = {
  fields: {
    title: {
      type: "text",
      label: "Button Text",
    },
    url: {
      type: "text",
      label: "URL",
    },
    description: {
      type: "text",
      label: "Description (optional)",
    },
    icon: {
      type: "select",
      label: "Icon",
      options: [
        { label: "None", value: "" },
        { label: "Instagram", value: "instagram" },
        { label: "Twitter", value: "twitter" },
        { label: "YouTube", value: "youtube" },
        { label: "GitHub", value: "github" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Website", value: "website" },
        { label: "External Link", value: "external" },
      ],
    },
    style: {
      type: "select",
      label: "Style",
      options: [
        { label: "Filled", value: "filled" },
        { label: "Outlined", value: "outlined" },
        { label: "Minimal", value: "minimal" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    className: {
      type: "text",
      label: "ClassName (advanced)",
    },
    openInNewTab: {
      type: "radio",
      label: "Open in new tab",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    title: "My Link",
    url: "https://example.com",
    style: "filled",
    size: "md",
    openInNewTab: true,
  },
  render: LinkButton,
};
