"use client";

import { ComponentConfig } from "@measured/puck";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  size: "sm" | "md" | "lg" | "full" | "cover";
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  alignment: "left" | "center" | "right";
  className?: string;
}

export const ImageBlock = ({
  src,
  alt,
  caption,
  size,
  borderRadius,
  alignment,
  className,
}: ImageBlockProps) => {
  return (
    <div
      className={cn(
        "w-full",
        {
          "flex justify-start": alignment === "left",
          "flex justify-center": alignment === "center",
          "flex justify-end": alignment === "right",
        },
        className,
      )}
    >
      <div
        className={cn("flex flex-col gap-2", {
          "w-32": size === "sm",
          "w-48": size === "md",
          "w-64": size === "lg",
          "w-full": size === "full" || size === "cover",
        })}
      >
        <div
          className={cn("relative overflow-hidden bg-muted", {
            "aspect-square": size === "sm" || size === "md" || size === "lg",
            "aspect-video": size === "full",
            "aspect-[3/1]": size === "cover",
            "rounded-none": borderRadius === "none",
            "rounded-sm": borderRadius === "sm",
            "rounded-md": borderRadius === "md",
            "rounded-lg": borderRadius === "lg",
            "rounded-full": borderRadius === "full",
          })}
        >
          <Image
            src={src || "/placeholder-image.jpg"}
            alt={alt}
            fill
            className="object-cover"
          />
        </div>

        {caption && (
          <p className="text-sm text-muted-foreground text-center">{caption}</p>
        )}
      </div>
    </div>
  );
};

export const imageBlockConfig: ComponentConfig<ImageBlockProps> = {
  fields: {
    src: {
      type: "text",
      label: "Image URL",
    },
    alt: {
      type: "text",
      label: "Alt Text",
    },
    caption: {
      type: "text",
      label: "Caption (optional)",
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Full Width", value: "full" },
        { label: "Cover", value: "cover" },
      ],
    },
    borderRadius: {
      type: "select",
      label: "Border Radius",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Circle", value: "full" },
      ],
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
    className: {
      type: "text",
      label: "ClassName (advanced)",
    },
  },
  defaultProps: {
    src: "/placeholder-image.jpg",
    alt: "Image",
    size: "md",
    borderRadius: "md",
    alignment: "center",
  },
  render: ImageBlock,
};
