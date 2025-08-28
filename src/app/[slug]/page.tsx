import { PageRenderer } from "@/components/puck/page-renderer";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ slug: string }>;
};

// Mock data service - replace with actual database calls
const mockPageService = {
  async getPublishedPageBySlug(slug: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data - replace with actual database query
    const mockPages: Record<string, any> = {
      "johndoe": {
        id: "page-1",
        title: "John Doe - Links",
        slug: "johndoe",
        status: "published",
        content: {
          content: [
            {
              type: "ProfileHeader",
              props: {
                id: "ProfileHeader-1",
                name: "John Doe",
                bio: "Creator & Entrepreneur | Building the future one link at a time",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                showAvatar: true,
                avatarSize: "lg",
                textAlign: "center",
              },
            },
            {
              type: "Spacer",
              props: {
                id: "Spacer-1",
                height: "lg",
              },
            },
            {
              type: "SocialLinks",
              props: {
                id: "SocialLinks-1",
                links: [
                  { platform: "instagram", url: "https://instagram.com/johndoe", username: "@johndoe" },
                  { platform: "twitter", url: "https://twitter.com/johndoe", username: "@johndoe" },
                  { platform: "youtube", url: "https://youtube.com/@johndoe", username: "John Doe" },
                  { platform: "github", url: "https://github.com/johndoe", username: "johndoe" },
                ],
                layout: "grid",
                iconSize: "md",
                showLabels: false,
                style: "filled",
              },
            },
            {
              type: "Spacer",
              props: {
                id: "Spacer-2",
                height: "lg",
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-1",
                title: "My Portfolio Website",
                url: "https://johndoe.com",
                description: "Check out my latest projects and work",
                icon: "website",
                style: "filled",
                size: "md",
                openInNewTab: true,
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-2",
                title: "Latest Blog Post",
                url: "https://johndoe.com/blog/building-with-nextjs",
                description: "Building Modern Web Apps with Next.js",
                style: "outlined",
                size: "md",
                openInNewTab: true,
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-3",
                title: "My Course on Web Development",
                url: "https://course.johndoe.com",
                description: "Learn to build full-stack applications",
                style: "filled",
                size: "md",
                openInNewTab: true,
              },
            },
            {
              type: "Spacer",
              props: {
                id: "Spacer-3",
                height: "md",
              },
            },
            {
              type: "TextBlock",
              props: {
                id: "TextBlock-1",
                content: "Thanks for visiting! Feel free to reach out.",
                alignment: "center",
                size: "sm",
                weight: "normal",
                color: "muted",
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-4",
                title: "Contact Me",
                url: "mailto:john@johndoe.com",
                icon: "email",
                style: "minimal",
                size: "sm",
                openInNewTab: false,
              },
            },
          ],
          root: {},
        },
        theme: {
          colors: {
            primary: "#000000",
            secondary: "#6B7280",
            background: "#FFFFFF",
            text: "#111827",
          },
          fonts: {
            heading: "Inter, sans-serif",
            body: "Inter, sans-serif",
          },
        },
        analyticsEnabled: true,
      },
      "demo": {
        id: "page-demo",
        title: "Demo Page - Wilnk",
        slug: "demo",
        status: "published",
        content: {
          content: [
            {
              type: "ProfileHeader",
              props: {
                id: "ProfileHeader-demo",
                name: "Wilnk Demo",
                bio: "This is a demo Link-in-Bio page built with Puck editor",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
                showAvatar: true,
                avatarSize: "md",
                textAlign: "center",
              },
            },
            {
              type: "Spacer",
              props: {
                id: "Spacer-demo-1",
                height: "md",
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-demo-1",
                title: "Create Your Own Page",
                url: "/dashboard",
                description: "Start building your Link-in-Bio page",
                style: "filled",
                size: "md",
                openInNewTab: false,
              },
            },
            {
              type: "LinkButton",
              props: {
                id: "LinkButton-demo-2",
                title: "View Editor Demo",
                url: "/editor/demo",
                description: "See how easy it is to edit",
                style: "outlined",
                size: "md",
                openInNewTab: true,
              },
            },
            {
              type: "Spacer",
              props: {
                id: "Spacer-demo-2",
                height: "lg",
              },
            },
            {
              type: "TextBlock",
              props: {
                id: "TextBlock-demo",
                content: "Built with Puck editor and Next.js",
                alignment: "center",
                size: "sm",
                weight: "medium",
                color: "muted",
              },
            },
          ],
          root: {},
        },
        theme: {
          colors: {
            primary: "#3B82F6",
            secondary: "#6B7280",
            background: "#F8FAFC",
            text: "#1E293B",
          },
          fonts: {
            heading: "Inter, sans-serif",
            body: "Inter, sans-serif",
          },
        },
        analyticsEnabled: true,
      },
    };

    return mockPages[slug] || null;
  },
};

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const page = await mockPageService.getPublishedPageBySlug(slug);
  
  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.content.content.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
  };
}

export default async function PublicPage({ params }: Params) {
  const { slug } = await params;
  const page = await mockPageService.getPublishedPageBySlug(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <PageRenderer 
      data={page.content} 
      pageId={page.id}
      theme={page.theme}
      className="bg-gray-50"
    />
  );
}
