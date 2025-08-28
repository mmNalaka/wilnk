"use client";

import { ComponentConfig } from "@measured/puck";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ProfileHeaderProps {
  name: string;
  bio?: string;
  avatar?: string;
  showAvatar: boolean;
  avatarSize: "sm" | "md" | "lg";
  textAlign: "left" | "center" | "right";
}

export const ProfileHeader = ({ name, bio, avatar, showAvatar, avatarSize, textAlign }: ProfileHeaderProps) => {
  return (
    <div className={cn("w-full flex flex-col items-center gap-4", {
      "text-left items-start": textAlign === "left",
      "text-center items-center": textAlign === "center", 
      "text-right items-end": textAlign === "right",
    })}>
      {showAvatar && avatar && (
        <div className={cn("relative rounded-full overflow-hidden bg-gray-200", {
          "w-16 h-16": avatarSize === "sm",
          "w-24 h-24": avatarSize === "md",
          "w-32 h-32": avatarSize === "lg",
        })}>
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <h1 className={cn("font-bold text-gray-900", {
          "text-xl": avatarSize === "sm",
          "text-2xl": avatarSize === "md", 
          "text-3xl": avatarSize === "lg",
        })}>
          {name}
        </h1>
        
        {bio && (
          <p className="text-gray-600 leading-relaxed max-w-md">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};

export const profileHeaderConfig: ComponentConfig<ProfileHeaderProps> = {
  fields: {
    name: {
      type: "text",
      label: "Name",
    },
    bio: {
      type: "textarea",
      label: "Bio (optional)",
    },
    avatar: {
      type: "text",
      label: "Avatar URL (optional)",
    },
    showAvatar: {
      type: "radio",
      label: "Show Avatar",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    avatarSize: {
      type: "select",
      label: "Avatar Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    textAlign: {
      type: "select",
      label: "Text Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    name: "Your Name",
    bio: "Tell people about yourself",
    showAvatar: true,
    avatarSize: "md",
    textAlign: "center",
  },
  render: ProfileHeader,
};
