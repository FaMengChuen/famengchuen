import { IntroProvider } from "./IntroProvider";
import { Header } from "./Header";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { Footer } from "./sections/Footer";
import { SectionRenderer } from "./SectionRenderer";
import type { PublicPageContent } from "@/lib/cms/types";

/**
 * Vista pública de una página del CMS: cromo del sitio (header, footer, botón
 * flotante) + las secciones administrables. Conserva la secuencia de intro
 * (Loader) del sitio original.
 */
export function PageView({ content }: { content: PublicPageContent }) {
  const { site, sections, products } = content;

  return (
    <IntroProvider>
      <Header site={site} />
      <main>
        <SectionRenderer sections={sections} site={site} products={products} />
      </main>
      <Footer site={site} />
      <FloatingWhatsApp site={site} />
    </IntroProvider>
  );
}
