import { Hero } from "./sections/Hero";
import { TrustStrip } from "./sections/TrustStrip";
import { Equipo } from "./sections/Equipo";
import { Modalidades } from "./sections/Modalidades";
import { Programas } from "./sections/Programas";
import { Maestro } from "./sections/Maestro";
import { Comunidad } from "./sections/Comunidad";
import { Precios } from "./sections/Precios";
import { Tienda } from "./sections/Tienda";
import { Contacto } from "./sections/Contacto";
import { RichText } from "./sections/RichText";
import { Gallery } from "./sections/Gallery";
import type {
  CmsSection,
  CommunityBannerSectionData,
  ContactBlockSectionData,
  GallerySectionData,
  HeroSectionData,
  ImageFeatureSectionData,
  ModalitiesGridSectionData,
  PricingGridSectionData,
  Product,
  ProductGridSectionData,
  ProgramCardsSectionData,
  RichTextSectionData,
  SiteConfig,
  TeacherProfileSectionData,
  TrustStripSectionData,
} from "@/lib/cms/types";

/**
 * Renderiza la lista de secciones del CMS reusando los componentes visuales
 * existentes. El ancla de cada sección es su `id` (para la navegación interna),
 * salvo el hero, que conserva `#top` como en el sitio original.
 */
export function SectionRenderer({
  sections,
  site,
  products,
}: {
  sections: CmsSection[];
  site: SiteConfig;
  products: Product[];
}) {
  return (
    <>
      {sections.map((section) => {
        const anchorId = section.type === "hero" ? "top" : section.id;

        switch (section.type) {
          case "hero":
            return (
              <Hero
                key={section.id}
                data={section.data as HeroSectionData}
                site={site}
                sectionId={anchorId}
              />
            );
          case "trustStrip":
            return <TrustStrip key={section.id} data={section.data as TrustStripSectionData} />;
          case "imageFeature":
            return <Equipo key={section.id} data={section.data as ImageFeatureSectionData} />;
          case "modalitiesGrid":
            return (
              <Modalidades
                key={section.id}
                data={section.data as ModalitiesGridSectionData}
                sectionId={anchorId}
              />
            );
          case "programCards":
            return (
              <Programas
                key={section.id}
                data={section.data as ProgramCardsSectionData}
                sectionId={anchorId}
              />
            );
          case "teacherProfile":
            return (
              <Maestro
                key={section.id}
                data={section.data as TeacherProfileSectionData}
                sectionId={anchorId}
              />
            );
          case "communityBanner":
            return (
              <Comunidad
                key={section.id}
                data={section.data as CommunityBannerSectionData}
                sectionId={anchorId}
              />
            );
          case "pricingGrid":
            return (
              <Precios
                key={section.id}
                data={section.data as PricingGridSectionData}
                site={site}
                sectionId={anchorId}
              />
            );
          case "productGrid":
            return (
              <Tienda
                key={section.id}
                data={section.data as ProductGridSectionData}
                products={products}
                site={site}
                sectionId={anchorId}
              />
            );
          case "contactBlock":
            return (
              <Contacto
                key={section.id}
                data={section.data as ContactBlockSectionData}
                site={site}
                sectionId={anchorId}
              />
            );
          case "richText":
            return (
              <RichText
                key={section.id}
                data={section.data as RichTextSectionData}
                sectionId={anchorId}
              />
            );
          case "gallery":
            return (
              <Gallery
                key={section.id}
                data={section.data as GallerySectionData}
                sectionId={anchorId}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
