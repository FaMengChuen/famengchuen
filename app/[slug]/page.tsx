import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPublicPageContent } from "@/lib/cms/repository";

// Contenido administrable desde el CMS: render por request.
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") {
    return {};
  }

  const content = await getPublicPageContent(slug);
  if (!content) {
    return {};
  }

  return {
    title: content.page.seoTitle || content.page.title,
    description: content.page.seoDescription,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // La home canónica vive en "/", evitamos contenido duplicado en "/home".
  if (slug === "home") {
    notFound();
  }

  const content = await getPublicPageContent(slug);
  if (!content) {
    notFound();
  }

  return <PageView content={content} />;
}
