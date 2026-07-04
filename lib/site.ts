/**
 * Helpers de enlaces externos. El teléfono, redes y mensajes de WhatsApp
 * viven en el CMS (Firestore `site/config`, editable desde /admin/settings);
 * los valores por defecto están en lib/cms/default-content.ts.
 */

/** Construye una URL de WhatsApp (wa.me) con el mensaje opcional ya codificado. */
export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Props comunes para abrir enlaces externos en una pestaña nueva de forma segura. */
export const EXTERNAL = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
