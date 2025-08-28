"use client";

import { ComponentConfig } from "@measured/puck";
import { cn } from "@/lib/utils";

export interface SpacerProps {
  height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Spacer = ({ height }: SpacerProps) => {
  return (
    <div className={cn("w-full", {
      "h-2": height === "xs",
      "h-4": height === "sm", 
      "h-8": height === "md",
      "h-16": height === "lg",
      "h-24": height === "xl",
      "h-32": height === "2xl",
    })} />
  );
};

export const spacerConfig: ComponentConfig<SpacerProps> = {
  fields: {
    height: {
      type: "select",
      label: "Spacing Height",
      options: [
        { label: "Extra Small", value: "xs" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
        { label: "2X Large", value: "2xl" },
      ],
    },
  },
  defaultProps: {
    height: "md",
  },
  render: Spacer,
};
