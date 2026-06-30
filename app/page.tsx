import type { Metadata } from "next";
import { PageView } from "@/components/PageView";
import { getFallbackHomeContent, getPublicPageContent } from "@/lib/cms/repository";

// El contenido vive en el CMS y se publica al guardar, por eso renderizamos
// en cada request en lugar de generar la página estática en build.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = (await getPublicPageContent("home")) ?? getFallbackHomeContent();
  return {
    title: content.page.seoTitle || content.page.title,
    description: content.page.seoDescription,
  };
}

export default async function Home() {
  const content = (await getPublicPageContent("home")) ?? getFallbackHomeContent();
  return <PageView content={content} />;
}
