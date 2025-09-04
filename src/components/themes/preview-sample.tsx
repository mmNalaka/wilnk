"use client";

import type { Data } from "@measured/puck";
import { PageRenderer } from "@/components/puck/page-renderer";

// A small sample Link-in-Bio page for live preview in the theme editor
const sampleData: Data = {
  root: {
    props: {
      title: "New Page",
    },
  },
  content: [
    {
      type: "ImageBlock",
      props: {
        src: "https://kaiz-in.com/wp-content/uploads/elementor/thumbs/Finance-Cover-Banner-4-qx2xab3yao8yp0blhrkmtrjl5cef3qoypes929u648.webp",
        alt: "Image",
        size: "cover",
        borderRadius: "lg",
        alignment: "center",
        id: "ImageBlock-ff9aa3b5-a31d-4bf6-ab75-4dfa6bb7c718",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "lg",
        id: "Spacer-cbad0a91-5311-437b-8cce-00864f365821",
      },
    },
    {
      type: "ProfileHeader",
      props: {
        name: "Your Name",
        bio: "A short bio about yourself goes here. Keep it simple and friendly.",
        showAvatar: true,
        avatarSize: "lg",
        textAlign: "center",
        id: "ProfileHeader-7ea835e5-08c1-405b-bfba-eabdb5fb965d",
        avatar:
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "md",
        id: "Spacer-28dacb2b-3b31-47ce-9b69-8fca19a76e91",
      },
    },
    {
      type: "SocialLinks",
      props: {
        links: [
          {
            platform: "linkedin",
          },
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
          {
            platform: "youtube",
            url: "https://twitter.com/username",
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
        id: "SocialLinks-7911acf8-820a-4562-9379-0d44bce3ad03",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "md",
        id: "Spacer-90728c0f-e87f-4d4a-b219-91e5264416ac",
      },
    },
    {
      type: "LinkButton",
      props: {
        title: "E-mail",
        url: "https://example.com",
        style: "filled",
        size: "lg",
        openInNewTab: true,
        id: "LinkButton-dafa8391-fc16-4a2a-8377-8fead1b13514",
        icon: "external",
        description: "",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "sm",
        id: "Spacer-37a4fee0-a9b4-4ff1-bff3-07c227f67271",
      },
    },
    {
      type: "LinkButton",
      props: {
        title: "Website",
        url: "https://example.com",
        style: "filled",
        size: "md",
        openInNewTab: true,
        id: "LinkButton-a02ca3e9-1036-40d4-bd19-511646437b38",
        icon: "website",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "sm",
        id: "Spacer-b41fd723-ae40-45fc-b6d5-71ed991879b4",
      },
    },
    {
      type: "LinkButton",
      props: {
        title: "Phone",
        url: "https://example.com",
        style: "filled",
        size: "md",
        openInNewTab: true,
        id: "LinkButton-25393380-7974-41c3-b2de-1291ea807e6c",
        icon: "github",
      },
    },
    {
      type: "Spacer",
      props: {
        height: "md",
        id: "Spacer-59370638-4ed1-4b69-b59e-0ab28e467b06",
      },
    },
    {
      type: "TextBlock",
      props: {
        content: " Thanks for visiting my page!\n",
        alignment: "center",
        size: "sm",
        weight: "medium",
        color: "muted",
        id: "TextBlock-55e1479d-32ef-47c0-b425-840913162243",
      },
    },
  ],
  zones: {},
};

export function PreviewSample({ theme }: { theme?: Record<string, string> }) {
  // Key on theme JSON to force re-render when any var changes
  const k = JSON.stringify(theme ?? {});
  return <PageRenderer key={k} data={sampleData} theme={theme} />;
}
