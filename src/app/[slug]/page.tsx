/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageRenderer } from "@/components/puck/page-renderer";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { pages, themes } from "@/server/db/schema/main.schema";
import { eq, and } from "drizzle-orm";
import type { Data } from "@measured/puck";

type Params = {
  params: Promise<{ slug: string }>;
};

// Page service using direct database calls
const pageService = {
  async getPublishedPageBySlug(slug: string) {
    try {
      const [page] = await db
        .select({
          id: pages.id,
          userId: pages.userId,
          title: pages.title,
          slug: pages.slug,
          description: pages.description,
          content: pages.content,
          themeId: pages.themeId,
          isPublic: pages.isPublic,
          password: pages.password,
          metaTitle: pages.metaTitle,
          metaDescription: pages.metaDescription,
          favicon: pages.favicon,
          createdAt: pages.createdAt,
          updatedAt: pages.updatedAt,
          status: pages.status,
          publishedAt: pages.publishedAt,
          theme: {
            id: themes.id,
            name: themes.name,
            config: themes.config,
          },
        })
        .from(pages)
        .leftJoin(themes, eq(pages.themeId, themes.id))
        .where(
          and(
            eq(pages.id, slug),
            // ne(pages.status, "draft"),
            eq(pages.isPublic, true)
          )
        )
        .limit(1);

      if (!page) {
        return null;
      }

      // Transform to match expected format
      return {
        id: page.id,
        userId: page.userId,
        title: page.title,
        slug: page.slug,
        description: page.description || "",
        puckData: (page.content as Data) || { content: [], root: {} },
        themeId: page.themeId,
        isPublished: page.status === "published" || !!page.publishedAt,
        isPublic: page.isPublic,
        hasPassword: !!page.password,
        customDomain: null,
        seoTitle: page.metaTitle || page.title,
        seoDescription: page.metaDescription || "",
        seoImage: page.favicon,
        viewCount: 0,
        clickCount: 0,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        theme: page.theme,
      };
    } catch (error) {
      console.error('Failed to fetch page by slug:', error);
      return null;
    }
  },
};

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const page = await pageService.getPublishedPageBySlug(slug);

  console.log("page", page);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.seoDescription || (page.puckData as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || (page.puckData as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
      images: page.seoImage ? [{ url: page.seoImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle || page.title,
      description: page.seoDescription || (page.puckData as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
      images: page.seoImage ? [page.seoImage] : undefined,
    },
  };
}

export default async function PublicPage({ params }: Params) {
  const { slug } = await params;
  const page = await pageService.getPublishedPageBySlug(slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <PageRenderer 
      data={page.puckData} 
      pageId={page.id}
      theme={page.theme?.config as any}
      className="bg-gray-50"
    />
  );
}
