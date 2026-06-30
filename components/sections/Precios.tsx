import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_HOME_SECTIONS, DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { PricingGridSectionData, SiteConfig } from "@/lib/cms/types";

const DEFAULT_PRECIOS = DEFAULT_HOME_SECTIONS.find((section) => section.type === "pricingGrid")
  ?.data as PricingGridSectionData;

type Plan = PricingGridSectionData["plans"][number];

const BTN = {
  outline:
    "border-[1.5px] border-[rgba(244,241,234,.28)] text-cream transition hover:border-gold hover:bg-[rgba(227,178,60,.08)]",
  red: "bg-red text-white transition hover:-translate-y-px hover:bg-red-hi",
} as const;

function PrecioCard({
  plan,
  site,
  delay,
}: {
  plan: Plan;
  site: SiteConfig;
  delay: number;
}) {
  const href = whatsappUrl(site.phone, site.whatsappMessages[plan.messageKey]);

  return (
    <Reveal
      as="article"
      delay={delay}
      className={
        plan.featured
          ? "relative flex flex-col rounded-[3px] border-[1.5px] border-[rgba(227,178,60,.5)] bg-[linear-gradient(180deg,#1a1411,#141417)] px-[30px] pb-8 pt-[34px]"
          : "flex flex-col rounded-[3px] border border-line bg-surface px-[30px] pb-8 pt-[34px]"
      }
    >
      {plan.featured && (
        <span className="absolute -top-3 left-[30px] rounded-[2px] bg-gold px-3 py-[5px] font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1209]">
          Más elegido
        </span>
      )}
      <div className="font-label text-[11.5px] uppercase tracking-[0.2em] text-gold">
        {plan.kicker}
      </div>
      <h3 className="mb-[18px] mt-2 font-display text-[32px] font-normal uppercase tracking-[0.01em]">
        {plan.title}
      </h3>
      <div className="flex items-start gap-1 leading-none">
        <span className="mt-[10px] font-label text-[20px] text-sand">S/</span>
        <span className="font-display text-[64px] text-cream">{plan.price}</span>
        <span className="mt-[30px] font-label text-[14px] uppercase tracking-[0.08em] text-dim">
          {plan.unit}
        </span>
      </div>
      <p className="mb-[22px] mt-4 text-[14.5px] leading-[1.55] text-muted">{plan.text}</p>
      <a
        href={href}
        {...EXTERNAL}
        className={`mt-auto inline-flex items-center justify-center gap-[9px] rounded-[2px] px-[18px] py-[13px] font-label text-[13.5px] font-medium uppercase tracking-[0.08em] ${BTN[plan.variant]}`}
      >
        {plan.ctaLabel}
      </a>
    </Reveal>
  );
}

export function Precios({
  data = DEFAULT_PRECIOS,
  site = DEFAULT_SITE_CONFIG,
  sectionId = "precios",
}: {
  data?: PricingGridSectionData;
  site?: SiteConfig;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-alt px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal className="mb-[clamp(40px,5vw,60px)] text-center">
          <Kicker both className="mb-4">
            {data.kicker}
          </Kicker>
          <h2 className="m-0 font-display text-[clamp(36px,5.5vw,68px)] font-normal uppercase leading-[0.95]">
            {data.title}
          </h2>
          <p className="mx-auto mt-[18px] max-w-[46ch] text-[16.5px] leading-[1.6] text-muted">
            {data.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] items-stretch gap-[18px]">
          {data.plans.map((plan, i) => (
            <PrecioCard key={plan.title} plan={plan} site={site} delay={i * 0.08} />
          ))}
        </div>

        {data.footnote && (
          <Reveal as="p" className="mx-auto mt-[26px] text-center text-[13.5px] text-dimmer">
            {data.footnote}
          </Reveal>
        )}
      </div>
    </section>
  );
}
