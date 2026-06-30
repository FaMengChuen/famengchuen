import type { SectionType } from "./types";

/**
 * Esquemas "amigables" para el editor del panel: definen SOLO los campos que
 * una persona no técnica debería editar, con etiquetas claras. Los campos no
 * listados (gradientes, posiciones, variantes, claves internas) se conservan
 * intactos al guardar.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "toggle"
  | "image"
  | "group"
  | "stringList"
  | "objectList"
  | "imageList";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  /** Para group / objectList */
  fields?: FieldDef[];
  /** Etiqueta de cada elemento en listas */
  itemLabel?: string;
  /** Plantilla para nuevos elementos de objectList/imageList */
  itemTemplate?: Record<string, unknown>;
};

const IMG = (src: string) => ({ src, alt: "" });

export const SECTION_SCHEMAS: Record<SectionType, FieldDef[]> = {
  hero: [
    { key: "background", label: "Imagen de fondo", type: "image" },
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    {
      key: "title",
      label: "Título principal",
      type: "textarea",
      hint: "Cada salto de línea (Enter) será una línea del título.",
    },
    {
      key: "accent",
      label: "Palabra resaltada en rojo",
      type: "text",
      hint: "Una palabra del título que se mostrará en rojo.",
    },
    { key: "description", label: "Descripción", type: "textarea" },
    {
      key: "primaryCta",
      label: "Botón principal (WhatsApp)",
      type: "group",
      fields: [{ key: "label", label: "Texto del botón", type: "text" }],
    },
    {
      key: "secondaryCta",
      label: "Botón secundario",
      type: "group",
      fields: [{ key: "label", label: "Texto del botón", type: "text" }],
    },
    {
      key: "stats",
      label: "Datos destacados",
      type: "objectList",
      itemLabel: "Dato",
      itemTemplate: { value: "", label: "" },
      fields: [
        { key: "value", label: "Número o símbolo", type: "text" },
        { key: "label", label: "Descripción corta", type: "text" },
      ],
    },
  ],
  trustStrip: [
    { key: "items", label: "Aliados / respaldos", type: "stringList", itemLabel: "Texto" },
  ],
  imageFeature: [
    { key: "image", label: "Imagen", type: "image" },
    { key: "captionParts", label: "Texto sobre la imagen", type: "stringList", itemLabel: "Parte" },
  ],
  modalitiesGrid: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "textarea", hint: "Enter = salto de línea." },
    { key: "description", label: "Descripción", type: "textarea" },
    {
      key: "items",
      label: "Modalidades",
      type: "objectList",
      itemLabel: "Modalidad",
      itemTemplate: { ...IMG("/assets/taichi.jpg"), kicker: "", title: "", text: "" },
      fields: [
        { key: "image", label: "Imagen", type: "image" },
        { key: "kicker", label: "Etiqueta", type: "text" },
        { key: "title", label: "Nombre", type: "text" },
        { key: "text", label: "Descripción", type: "textarea" },
      ],
    },
  ],
  programCards: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "text" },
    {
      key: "items",
      label: "Programas",
      type: "objectList",
      itemLabel: "Programa",
      itemTemplate: { ...IMG("/assets/pamva-women.jpg"), kicker: "", title: "", subtitle: "", text: "", chips: [] },
      fields: [
        { key: "image", label: "Imagen", type: "image" },
        { key: "kicker", label: "Etiqueta", type: "text" },
        { key: "title", label: "Nombre", type: "text" },
        { key: "subtitle", label: "Subtítulo", type: "text" },
        { key: "text", label: "Descripción", type: "textarea" },
        { key: "chips", label: "Etiquetas", type: "stringList", itemLabel: "Etiqueta" },
      ],
    },
  ],
  teacherProfile: [
    { key: "portrait", label: "Foto del maestro", type: "image" },
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Nombre", type: "textarea", hint: "Enter = salto de línea." },
    { key: "subtitle", label: "Cargo / subtítulo", type: "text" },
    { key: "text", label: "Descripción", type: "textarea" },
    {
      key: "credentials",
      label: "Logros y credenciales",
      type: "objectList",
      itemLabel: "Logro",
      itemTemplate: { title: "", sub: "" },
      fields: [
        { key: "title", label: "Título", type: "text" },
        { key: "sub", label: "Detalle", type: "text" },
      ],
    },
    { key: "closingText", label: "Texto de cierre", type: "textarea" },
    { key: "recognitionImage", label: "Imagen del reconocimiento", type: "image" },
    { key: "recognitionKicker", label: "Etiqueta del reconocimiento", type: "text" },
    { key: "recognitionText", label: "Texto del reconocimiento", type: "text" },
  ],
  communityBanner: [
    { key: "image", label: "Imagen de fondo", type: "image" },
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "text" },
    { key: "text", label: "Descripción", type: "textarea" },
    {
      key: "values",
      label: "Valores",
      type: "objectList",
      itemLabel: "Valor",
      itemTemplate: { title: "", sub: "" },
      fields: [
        { key: "title", label: "Título", type: "text" },
        { key: "sub", label: "Detalle", type: "text" },
      ],
    },
  ],
  pricingGrid: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "text" },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "footnote", label: "Nota al pie", type: "textarea" },
    {
      key: "plans",
      label: "Planes",
      type: "objectList",
      itemLabel: "Plan",
      itemTemplate: { kicker: "Mensualidad", title: "", price: "", unit: "/ mes", text: "", ctaLabel: "Inscribirme", messageKey: "reservar", variant: "outline" },
      fields: [
        { key: "kicker", label: "Etiqueta", type: "text" },
        { key: "title", label: "Nombre del plan", type: "text" },
        { key: "price", label: "Precio", type: "text" },
        { key: "unit", label: "Unidad (ej. / mes)", type: "text" },
        { key: "text", label: "Descripción", type: "textarea" },
        { key: "ctaLabel", label: "Texto del botón", type: "text" },
        { key: "featured", label: "Plan destacado", type: "toggle" },
      ],
    },
  ],
  productGrid: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "textarea", hint: "Enter = salto de línea." },
    { key: "description", label: "Descripción", type: "textarea" },
  ],
  contactBlock: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "textarea", hint: "Enter = salto de línea." },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "addressTitle", label: "Título de la dirección", type: "text" },
    { key: "addressLine1", label: "Dirección (línea 1)", type: "text" },
    { key: "addressLine2", label: "Dirección (línea 2)", type: "text" },
    { key: "mapsLabel", label: "Texto del enlace a Maps", type: "text" },
    { key: "phoneTitle", label: "Título del teléfono", type: "text" },
    { key: "phoneMeta", label: "Detalle del teléfono", type: "text" },
    { key: "socialTitle", label: "Título de redes", type: "text" },
  ],
  richText: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "text" },
    {
      key: "body",
      label: "Contenido",
      type: "textarea",
      hint: "Separa párrafos con una línea en blanco.",
    },
  ],
  gallery: [
    { key: "kicker", label: "Texto pequeño de arriba", type: "text" },
    { key: "title", label: "Título", type: "text" },
    { key: "images", label: "Imágenes", type: "imageList", itemLabel: "Imagen" },
  ],
};

/** Descripción corta de cada plantilla, para el selector de “agregar sección”. */
export const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero: "Portada grande con imagen de fondo, título y botones.",
  trustStrip: "Franja con aliados o respaldos.",
  imageFeature: "Una imagen ancha con un texto encima.",
  modalitiesGrid: "Tarjetas con imagen (ej. modalidades o servicios).",
  programCards: "Tarjetas de programas con etiquetas.",
  teacherProfile: "Perfil con foto, descripción y logros.",
  communityBanner: "Banner con imagen de fondo y valores.",
  pricingGrid: "Planes y precios con botón.",
  productGrid: "Encabezado de la tienda (los productos se editan aparte).",
  contactBlock: "Bloque de contacto con dirección y redes.",
  richText: "Un bloque de texto con título.",
  gallery: "Una galería de imágenes.",
};
