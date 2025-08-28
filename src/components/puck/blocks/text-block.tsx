"use client";

import { ComponentConfig } from "@measured/puck";
import { cn } from "@/lib/utils";

export interface TextBlockProps {
  content: string;
  alignment: "left" | "center" | "right";
  size: "sm" | "md" | "lg" | "xl";
  weight: "normal" | "medium" | "semibold" | "bold";
  color: "default" | "muted" | "accent";
}

export const TextBlock = ({ content, alignment, size, weight, color }: TextBlockProps) => {
  return (
    <div className={cn("w-full", {
      "text-left": alignment === "left",
      "text-center": alignment === "center",
      "text-right": alignment === "right",
    })}>
      <p className={cn("leading-relaxed", {
        // Size variants
        "text-sm": size === "sm",
        "text-base": size === "md",
        "text-lg": size === "lg",
        "text-xl": size === "xl",
        // Weight variants
        "font-normal": weight === "normal",
        "font-medium": weight === "medium",
        "font-semibold": weight === "semibold",
        "font-bold": weight === "bold",
        // Color variants
        "text-gray-900": color === "default",
        "text-gray-600": color === "muted",
        "text-blue-600": color === "accent",
      })}>
        {content}
      </p>
    </div>
  );
};

export const textBlockConfig: ComponentConfig<TextBlockProps> = {
  fields: {
    content: {
      type: "textarea",
      label: "Text Content",
    },
    alignment: {
      type: "select",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
    weight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Medium", value: "medium" },
        { label: "Semi Bold", value: "semibold" },
        { label: "Bold", value: "bold" },
      ],
    },
    color: {
      type: "select",
      label: "Color",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
        { label: "Accent", value: "accent" },
      ],
    },
  },
  defaultProps: {
    content: "Add your text here...",
    alignment: "center",
    size: "md",
    weight: "normal",
    color: "default",
  },
  render: TextBlock,
};
