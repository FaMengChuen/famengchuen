import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { Multiline } from "../Multiline";
import { WhatsAppIcon, PinIcon, PhoneIcon, GlobeIcon, ArrowUpRightIcon } from "../icons";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_HOME_SECTIONS, DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { ContactBlockSectionData, SiteConfig } from "@/lib/cms/types";

const DEFAULT_CONTACTO = DEFAULT_HOME_SECTIONS.find((section) => section.type === "contactBlock")
  ?.data as ContactBlockSectionData;

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[rgba(227,178,60,.4)] text-gold">
      {children}
    </span>
  );
}

const FIELD_LABEL = "font-label text-[11px] uppercase tracking-[0.18em] text-dim";

export function Contacto({
  data = DEFAULT_CONTACTO,
  site = DEFAULT_SITE_CONFIG,
  sectionId = "contacto",
}: {
  data?: ContactBlockSectionData;
  site?: SiteConfig;
  sectionId?: string;
}) {
  const reserveUrl = whatsappUrl(site.phone, site.whatsappMessages.reservar);
  const phoneUrl = whatsappUrl(site.phone);

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-base px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <Image
        src={data.logo.src}
        alt=""
        aria-hidden="true"
        width={data.logo.width ?? 300}
        height={data.logo.height ?? 300}
        className="fmc-crane pointer-events-none absolute -right-[40px] -top-[30px] z-0 h-auto w-[clamp(150px,23vw,300px)] opacity-[0.05]"
      />

      <div className="relative mx-auto grid max-w-content grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(40px,5vw,72px)]">
        <Reveal>
          <Kicker className="mb-[18px]">{data.kicker}</Kicker>
          <h2 className="m-0 font-display text-[clamp(38px,6vw,76px)] font-normal uppercase leading-[0.92]">
            <Multiline text={data.title} />
          </h2>
          <p className="mb-[30px] mt-[22px] max-w-[42ch] text-[17px] leading-[1.6] text-secondary">
            {data.description}
          </p>
          <a
            href={reserveUrl}
            {...EXTERNAL}
            className="inline-flex items-center gap-[11px] rounded-[2px] bg-whatsapp px-[30px] py-[17px] font-label text-[16px] font-semibold uppercase tracking-[0.04em] text-whatsapp-ink transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(37,211,102,.3)]"
          >
            <WhatsAppIcon size={20} />
            {site.phoneDisplay}
          </a>
        </Reveal>

        <Reveal
          delay={0.08}
          className="rounded-[3px] border border-line bg-surface p-[clamp(26px,3vw,38px)]"
        >
          {/* Ubicación */}
          <div className="flex gap-[15px] border-b border-line pb-5">
            <IconBadge>
              <PinIcon size={18} />
            </IconBadge>
            <a href={site.links.maps} {...EXTERNAL} className="block transition-opacity hover:opacity-85">
              <div className={FIELD_LABEL}>{data.addressTitle}</div>
              <div className="mt-1 text-[16px] text-cream">{data.addressLine1}</div>
              <div className="text-[14.5px] text-muted">{data.addressLine2}</div>
              <div className="mt-2 inline-flex items-center gap-[6px] font-label text-[12px] uppercase tracking-[0.08em] text-gold">
                {data.mapsLabel}
                <ArrowUpRightIcon size={12} />
              </div>
            </a>
          </div>

          {/* Teléfono */}
          <div className="flex gap-[15px] border-b border-line py-5">
            <IconBadge>
              <PhoneIcon size={18} />
            </IconBadge>
            <div>
              <div className={FIELD_LABEL}>{data.phoneTitle}</div>
              <a
                href={phoneUrl}
                {...EXTERNAL}
                className="mt-1 block text-[16px] text-cream transition-colors hover:text-gold"
              >
                {site.phoneDisplay}
              </a>
              <div className="text-[14.5px] text-muted">{data.phoneMeta}</div>
            </div>
          </div>

          {/* Redes */}
          <div className="flex gap-[15px] pt-5">
            <IconBadge>
              <GlobeIcon size={18} />
            </IconBadge>
            <div>
              <div className={FIELD_LABEL}>{data.socialTitle}</div>
              <div className="mt-[6px] flex gap-[18px]">
                <a
                  href={site.links.instagram}
                  {...EXTERNAL}
                  className="text-[15.5px] text-cream transition-colors hover:text-gold"
                >
                  Instagram
                </a>
                <a
                  href={site.links.facebook}
                  {...EXTERNAL}
                  className="text-[15.5px] text-cream transition-colors hover:text-gold"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
