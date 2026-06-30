/**
 * Datos de negocio verificados con el cliente + helpers de enlaces.
 * Centraliza el teléfono, redes y mensajes de WhatsApp para que un cambio
 * (p. ej. otro número o precio) se haga en un solo lugar.
 */

export const PHONE = "51963341350";
export const PHONE_DISPLAY = "+51 963 341 350";

export const LINKS = {
  maps: "https://maps.app.goo.gl/dKDSse7PQSdPWRUA6",
  instagram: "https://www.instagram.com/famengchuen/",
  facebook: "https://www.facebook.com/FaMengChuen",
} as const;

/** Mensajes pre-rellenados para cada CTA. */
export const WA_MESSAGES = {
  reservar: "Hola, quiero reservar una clase de prueba en Fa Meng Chuen.",
  sanda: "Hola, quiero información sobre la mensualidad de Sanda (S/240).",
  taichi: "Hola, quiero información sobre la mensualidad de Tai Chi (S/220).",
  claseLibre: "Hola, quiero reservar una clase libre (S/40).",
  polo:
    "Hola, quiero comprar un polo oficial de Fa Meng Chuen (preventa S/28). Mi talla es:",
  casaca:
    "Hola, quiero comprar una casaca oficial de Fa Meng Chuen (S/90). Mi talla es:",
} as const;

/** Construye una URL de WhatsApp (wa.me) con el mensaje opcional ya codificado. */
export function wa(message?: string): string {
  return whatsappUrl(PHONE, message);
}

export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Props comunes para abrir enlaces externos en una pestaña nueva de forma segura. */
export const EXTERNAL = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
