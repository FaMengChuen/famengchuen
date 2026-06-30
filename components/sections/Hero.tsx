import Image from "next/image";
import { HeroBackground } from "../HeroBackground";
import { Reveal } from "../Reveal";
import { CountUp } from "../CountUp";
import { Kicker } from "../Kicker";
import { WhatsAppIcon } from "../icons";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_HOME_SECTIONS, DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { HeroSectionData, SiteConfig } from "@/lib/cms/types";

const DEFAULT_HERO = DEFAULT_HOME_SECTIONS.find((section) => section.type === "hero")
  ?.data as HeroSectionData;

function ctaHref(site: SiteConfig, messageKey?: string, href?: string) {
  if (href) {
    return href;
  }

  return whatsappUrl(site.phone, messageKey ? site.whatsappMessages[messageKey] : undefined);
}

function HighlightedTitle({ title, accent }: { title: string; accent?: string }) {
  return (
    <>
      {title.split("\n").map((line, index) => {
        const accentIndex = accent ? line.toLowerCase().lastIndexOf(accent.toLowerCase()) : -1;
        const before = accentIndex >= 0 ? line.slice(0, accentIndex) : line;
        const match = accentIndex >= 0 ? line.slice(accentIndex, accentIndex + accent.length) : "";
        const after = accentIndex >= 0 ? line.slice(accentIndex + accent.length) : "";

        return (
          <span key={`${line}-${index}`}>
            {before}
            {match && <span className="text-red">{match}</span>}
            {after}
            {index < title.split("\n").length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

export function Hero({
  data = DEFAULT_HERO,
  site = DEFAULT_SITE_CONFIG,
  sectionId = "top",
}: {
  data?: HeroSectionData;
  site?: SiteConfig;
  sectionId?: string;
}) {
  const primaryHref = ctaHref(site, data.primaryCta.messageKey, data.primaryCta.href);
  const secondaryHref = ctaHref(site, data.secondaryCta.messageKey, data.secondaryCta.href);

  return (
    <section
      id={sectionId}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-base"
    >
      <HeroBackground image={data.background} />

      {/* Grulla decorativa (logo) flotando arriba-derecha */}
      <Image
        src={data.watermarkLogo?.src ?? site.logo.src}
        alt=""
        aria-hidden="true"
        width={data.watermarkLogo?.width ?? 290}
        height={data.watermarkLogo?.height ?? 290}
        className="fmc-crane pointer-events-none absolute right-[5%] top-[12%] z-[1] h-auto w-[clamp(150px,21vw,290px)] opacity-[0.06]"
      />

      <div className="relative z-[2] mx-auto w-full max-w-content px-[clamp(20px,5vw,56px)] pb-20 pt-[120px]">
        <Reveal intro delay={0} className="mb-[26px]">
          <Kicker>{data.kicker}</Kicker>
        </Reveal>

        <Reveal
          as="h1"
          intro
          delay={0.12}
          className="m-0 max-w-[14ch] text-balance font-display text-[clamp(48px,9vw,128px)] font-normal uppercase leading-[0.92] tracking-[0.005em]"
        >
          <HighlightedTitle title={data.title} accent={data.accent} />
        </Reveal>

        <Reveal
          as="p"
          intro
          delay={0.24}
          className="mt-[26px] max-w-[50ch] text-[clamp(16px,1.9vw,21px)] leading-[1.55] text-secondary"
        >
          {data.description}
        </Reveal>

        <Reveal intro delay={0.36} className="mt-[38px] flex flex-wrap gap-[14px]">
          <a
            href={primaryHref}
            {...EXTERNAL}
            className="inline-flex items-center gap-[10px] rounded-[2px] bg-red px-7 py-4 font-label text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:bg-red-hi"
          >
            <WhatsAppIcon size={19} />
            {data.primaryCta.label}
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center gap-[10px] rounded-[2px] border-[1.5px] border-[rgba(244,241,234,.28)] px-[26px] py-4 font-label text-[15px] font-medium uppercase tracking-[0.06em] text-cream transition hover:border-gold hover:bg-[rgba(227,178,60,.08)]"
          >
            {data.secondaryCta.label}
          </a>
        </Reveal>

        <Reveal
          intro
          delay={0.48}
          className="mt-[clamp(48px,7vw,76px)] flex flex-wrap gap-[clamp(24px,5vw,64px)]"
        >
          {data.stats.map((stat, index) => (
            <div key={`${stat.value}-${stat.label}`} className="contents">
              {index > 0 && <div className="w-px self-stretch bg-line-14" />}
              <div>
                <div className="font-display text-[clamp(34px,5vw,52px)] leading-none text-gold">
                  {typeof stat.countTo === "number" ? <CountUp to={stat.countTo} /> : stat.value}
                  {stat.suffix}
                </div>
                <div className="mt-2 font-label text-[12px] uppercase tracking-[0.18em] text-dim">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <div className="absolute bottom-[26px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-dim">
        <span className="font-label text-[10px] uppercase tracking-[0.3em]">
          {data.scrollLabel}
        </span>
        <span className="h-[34px] w-px bg-[linear-gradient(#e3b23c,transparent)]" />
      </div>
    </section>
  );
}
