import Image from "next/image";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { SiteConfig } from "@/lib/cms/types";

const COLUMNS = [
  {
    title: "Disciplinas",
    links: [
      { label: "Tai Chi Chuan", href: "#modalidades" },
      { label: "Sanda", href: "#modalidades" },
      { label: "Taolu", href: "#modalidades" },
    ],
  },
  {
    title: "Programas",
    links: [
      { label: "PAMVA", href: "#programas" },
      { label: "El Arte de Luchar", href: "#programas" },
      { label: "Precios", href: "#precios" },
      { label: "Tienda oficial", href: "#tienda" },
    ],
  },
];

const LINK_CLASS = "block text-[14px] text-dim transition-colors hover:text-white";

export function Footer({ site = DEFAULT_SITE_CONFIG }: { site?: SiteConfig }) {
  const phoneUrl = whatsappUrl(site.phone);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(244,241,234,.08)] bg-footer px-[clamp(20px,5vw,56px)] pb-9 pt-[clamp(44px,6vw,72px)]">
      <div className="mx-auto flex max-w-content flex-wrap items-start justify-between gap-[30px]">
        <div className="max-w-[340px]">
          <div className="mb-4 flex items-center gap-[13px]">
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={46}
              height={46}
              className="h-[46px] w-[46px] shrink-0 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[18px] tracking-[0.06em]">
                {site.brandName.toUpperCase()}
              </span>
              <span className="mt-[3px] font-label text-[9px] tracking-[0.4em] text-dim">
                {`ASOCIACIÓN · ${site.brandEyebrow}`.toUpperCase()}
              </span>
            </span>
          </div>
          <p className="m-0 text-[13.5px] leading-[1.6] text-dimmer">{site.footerText}</p>
        </div>

        <div className="flex flex-wrap gap-[clamp(36px,6vw,72px)]">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-[14px] font-label text-[11px] uppercase tracking-[0.18em] text-gold">
                {col.title}
              </div>
              <div className="flex flex-col gap-[9px]">
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="mb-[14px] font-label text-[11px] uppercase tracking-[0.18em] text-gold">
              Contacto
            </div>
            <div className="flex flex-col gap-[9px]">
              <a href={phoneUrl} {...EXTERNAL} className={LINK_CLASS}>
                {site.phoneDisplay}
              </a>
              <a href={site.links.instagram} {...EXTERNAL} className={LINK_CLASS}>
                Instagram
              </a>
              <a href={site.links.facebook} {...EXTERNAL} className={LINK_CLASS}>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-9 flex max-w-content flex-wrap justify-between gap-3 border-t border-[rgba(244,241,234,.08)] pt-6 text-[12.5px] text-faint">
        <span>{`© ${year} Asociación ${site.brandName} · Miraflores, Lima — Perú`}</span>
        <span>{site.footerSignature}</span>
      </div>
    </footer>
  );
}
