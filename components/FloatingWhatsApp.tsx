import { WhatsAppIcon } from "./icons";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { SiteConfig } from "@/lib/cms/types";

/** Botón flotante de WhatsApp, fijo abajo-derecha, con animación de pulso. */
export function FloatingWhatsApp({ site = DEFAULT_SITE_CONFIG }: { site?: SiteConfig }) {
  return (
    <a
      href={whatsappUrl(site.phone, site.whatsappMessages.reservar)}
      {...EXTERNAL}
      aria-label="Reservar por WhatsApp"
      className="fmc-pulse fixed bottom-[22px] right-[22px] z-[55] grid h-[58px] w-[58px] place-items-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_rgba(0,0,0,.4)] transition-transform hover:scale-110"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
