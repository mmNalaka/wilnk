"use client";

import { Config } from "@measured/puck";
import { linkButtonConfig } from "./blocks/link-button";
import { profileHeaderConfig } from "./blocks/profile-header";
import { socialLinksConfig } from "./blocks/social-links";
import { textBlockConfig } from "./blocks/text-block";
import { spacerConfig } from "./blocks/spacer";
import { imageBlockConfig } from "./blocks/image-block";

export const puckConfig: Config = {
  root: {
    render: ({ children }: { children: React.ReactNode }) => (
      <div className="bg-background theme-container h-full">
        <div className="max-w-md mx-auto px-4 py-4">
          {children}
        </div>
      </div>
    ),
  },
  components: {
    ProfileHeader: profileHeaderConfig,
    LinkButton: linkButtonConfig,
    SocialLinks: socialLinksConfig,
    TextBlock: textBlockConfig,
    ImageBlock: imageBlockConfig,
    Spacer: spacerConfig,
  },
  categories: {
    profile: {
      title: "Profile",
      components: ["ProfileHeader"],
    },
    links: {
      title: "Links",
      components: ["LinkButton", "SocialLinks"],
    },
    content: {
      title: "Content",
      components: ["TextBlock", "ImageBlock"],
    },
    layout: {
      title: "Layout",
      components: ["Spacer"],
    },
  },
};

