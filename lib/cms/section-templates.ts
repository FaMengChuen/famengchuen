import { DEFAULT_HOME_SECTIONS } from "./default-content";
import type { SectionType } from "./types";

/** Etiqueta legible para cada tipo de sección (UI del editor). */
export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero (portada)",
  trustStrip: "Franja de respaldos",
  imageFeature: "Imagen destacada",
  modalitiesGrid: "Grilla de modalidades",
  programCards: "Tarjetas de programas",
  teacherProfile: "Perfil del maestro",
  communityBanner: "Banner de comunidad",
  pricingGrid: "Grilla de precios",
  productGrid: "Tienda / productos",
  contactBlock: "Bloque de contacto",
  richText: "Texto enriquecido",
  gallery: "Galería de imágenes",
};

export const SECTION_TYPES = Object.keys(SECTION_LABELS) as SectionType[];

const FROM_DEFAULT = (type: SectionType) =>
  DEFAULT_HOME_SECTIONS.find((section) => section.type === type)?.data ?? {};

/** Datos por defecto al crear una nueva sección de un tipo dado. */
export function createSectionData(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "richText":
      return {
        kicker: "",
        title: "Nuevo bloque de texto",
        body: "Escribe aquí el contenido. Separa párrafos con una línea en blanco.",
      };
    case "gallery":
      return {
        kicker: "",
        title: "Galería",
        images: [{ src: "/assets/team.jpg", alt: "" }],
      };
    default:
      // Clonamos los datos de la home como punto de partida editable.
      return structuredClone(FROM_DEFAULT(type)) as Record<string, unknown>;
  }
}

/** Genera un id de sección único dentro de una página. */
export function newSectionId(type: SectionType, existing: string[]): string {
  let i = 1;
  let id = `${type}-${i}`;
  while (existing.includes(id)) {
    i += 1;
    id = `${type}-${i}`;
  }
  return id;
}
