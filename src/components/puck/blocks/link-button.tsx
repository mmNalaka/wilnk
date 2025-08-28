"use client";

import { ComponentConfig } from "@measured/puck";
import { ExternalLink, Instagram, Twitter, Youtube, Github, Linkedin, Mail, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LinkButtonProps {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  style: "filled" | "outlined" | "minimal";
  size: "sm" | "md" | "lg";
  openInNewTab: boolean;
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

export const LinkButton = ({ title, url, description, icon, style, size, openInNewTab }: LinkButtonProps) => {
  const IconComponent = icon && iconMap[icon as keyof typeof iconMap] ? iconMap[icon as keyof typeof iconMap] : null;

  const handleClick = () => {
    // Track click analytics
    if (typeof window !== 'undefined') {
      import('../analytics-tracker').then(({ getAnalytics }) => {
        const analytics = getAnalytics();
        analytics.trackClick(
          window.location.pathname.split('/').pop() || 'unknown',
          'LinkButton',
          'LinkButton',
          url,
          title
        );
      });
      
      window.open(url, openInNewTab ? '_blank' : '_self');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center justify-center gap-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        // Size variants
        {
          "px-4 py-3 text-sm": size === "sm",
          "px-6 py-4 text-base": size === "md",
          "px-8 py-5 text-lg": size === "lg",
        },
        // Style variants
        {
          "bg-black text-white hover:bg-gray-800 border border-black": style === "filled",
          "bg-transparent text-black border border-black hover:bg-black hover:text-white": style === "outlined",
          "bg-transparent text-black hover:bg-gray-100 border-none": style === "minimal",
        }
      )}
    >
      {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
      <div className="flex-1 text-center">
        <div className="font-medium">{title}</div>
        {description && <div className="text-sm opacity-75 mt-1">{description}</div>}
      </div>
      {!IconComponent && <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />}
    </button>
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
