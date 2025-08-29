/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageRenderer } from "@/components/puck/page-renderer";
import { notFound } from "next/navigation";
import { pagesRepository } from "@/server/modules/pages";

type Params = {
  params: Promise<{ slug: string }>;
};

// Page service using repository
const pageService = {
  async getPublishedPageBySlug(slug: string) {
    try {
      return await pagesRepository.findPublishedBySlug(slug);
    } catch (error) {
      console.error('Failed to fetch page by slug:', error);
      return null;
    }
  },
};

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const page = await pageService.getPublishedPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.metaDescription || (page.content as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || (page.content as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
      images: page.favicon ? [{ url: page.favicon }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle || page.title,
      description: page.metaDescription || (page.content as any)?.content?.find((block: any) => block.type === "ProfileHeader")?.props?.bio || `${page.title} - Link in Bio`,
      images: page.favicon ? [page.favicon] : undefined,
    },
  };
}

export default async function PublicPage({ params }: Params) {
  const { slug } = await params;
  const page = await pageService.getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <PageRenderer 
      data={page.content} 
      pageId={page.id}
      theme={page.theme?.config as any}
      className="bg-gray-50"
    />
  );
}
