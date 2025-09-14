"use client";

import { ComponentConfig } from "@measured/puck";
import {
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Facebook,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialLink {
  platform: string;
  url: string;
  username?: string;
}

export interface SocialLinksProps {
  links: SocialLink[];
  layout: "grid" | "row";
  iconSize: "sm" | "md" | "lg";
  showLabels: boolean;
  style: "filled" | "outlined" | "minimal";
  className?: string;
}

const socialPlatforms = {
  instagram: { icon: Instagram, name: "Instagram" },
  twitter: { icon: Twitter, name: "Twitter" },
  youtube: { icon: Youtube, name: "YouTube" },
  github: { icon: Github, name: "GitHub" },
  linkedin: { icon: Linkedin, name: "LinkedIn" },
  facebook: { icon: Facebook, name: "Facebook" },
  email: { icon: Mail, name: "Email" },
  phone: { icon: Phone, name: "Phone" },
  website: { icon: Globe, name: "Website" },
};

export const SocialLinks = ({
  links,
  layout,
  iconSize,
  showLabels,
  style,
  className,
}: SocialLinksProps) => {
  if (!links || links.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Add your social media links
      </div>
    );
  }

  const handleClick = (link: SocialLink) => {
    // Analytics tracking will be added here
    if (typeof window !== "undefined") {
      window.open(link.url, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "w-full",
        {
          "flex flex-wrap justify-center gap-4": layout === "grid",
          "flex flex-col space-y-3": layout === "row",
        },
        className,
      )}
    >
      {links.map((link, index) => {
        const platform =
          socialPlatforms[link.platform as keyof typeof socialPlatforms];
        if (!platform) return null;

        const IconComponent = platform.icon;

        return (
          <button
            key={index}
            onClick={() => handleClick(link)}
            className={cn(
              "flex items-center gap-3 transition-all duration-200 hover:scale-105 active:scale-95",
              // Size variants
              {
                "p-2": iconSize === "sm" && !showLabels,
                "p-3": iconSize === "md" && !showLabels,
                "p-4": iconSize === "lg" && !showLabels,
                "px-4 py-2": iconSize === "sm" && showLabels,
                "px-6 py-3": iconSize === "md" && showLabels,
                "px-8 py-4": iconSize === "lg" && showLabels,
              },
              // Style variants
              {
                // Use shadcn tokens so theme changes apply automatically
                "bg-primary text-primary-foreground rounded-full":
                  style === "filled" && !showLabels,
                "bg-primary text-primary-foreground rounded-lg":
                  style === "filled" && showLabels,
                "border text-foreground hover:bg-accent hover:text-accent-foreground rounded-full":
                  style === "outlined" && !showLabels,
                "border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg":
                  style === "outlined" && showLabels,
                "text-foreground hover:bg-accent hover:text-accent-foreground rounded-full":
                  style === "minimal" && !showLabels,
                "text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg":
                  style === "minimal" && showLabels,
              },
              // Layout specific
              {
                "justify-center": layout === "grid",
                "justify-start w-full": layout === "row",
              },
            )}
          >
            <IconComponent
              className={cn("flex-shrink-0", {
                "w-4 h-4": iconSize === "sm",
                "w-5 h-5": iconSize === "md",
                "w-6 h-6": iconSize === "lg",
              })}
            />

            {showLabels && (
              <span
                className={cn("font-medium", {
                  "text-sm": iconSize === "sm",
                  "text-base": iconSize === "md",
                  "text-lg": iconSize === "lg",
                })}
              >
                {link.username || platform.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const socialLinksConfig: ComponentConfig<SocialLinksProps> = {
  fields: {
    links: {
      type: "array",
      label: "Social Links",
      arrayFields: {
        platform: {
          type: "select",
          label: "Platform",
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "Twitter", value: "twitter" },
            { label: "YouTube", value: "youtube" },
            { label: "GitHub", value: "github" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Facebook", value: "facebook" },
            { label: "TikTok", value: "tiktok" },
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "Website", value: "website" },
          ],
        },
        url: {
          type: "text",
          label: "URL",
        },
        username: {
          type: "text",
          label: "Username/Label (optional)",
        },
      },
    },
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Row", value: "row" },
      ],
    },
    iconSize: {
      type: "select",
      label: "Icon Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    showLabels: {
      type: "radio",
      label: "Show Labels",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
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
    className: {
      type: "text",
      label: "ClassName (advanced)",
    },
  },
  defaultProps: {
    links: [
      {
        platform: "instagram",
        url: "https://instagram.com/username",
        username: "@username",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/username",
        username: "@username",
      },
    ],
    layout: "grid",
    iconSize: "md",
    showLabels: false,
    style: "filled",
  },
  render: SocialLinks,
};
