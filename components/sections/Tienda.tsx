import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { Multiline } from "../Multiline";
import { WhatsAppIcon } from "../icons";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_HOME_SECTIONS, DEFAULT_PRODUCTS, DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { Product, ProductGridSectionData, SiteConfig } from "@/lib/cms/types";

const DEFAULT_TIENDA = DEFAULT_HOME_SECTIONS.find((section) => section.type === "productGrid")
  ?.data as ProductGridSectionData;

function MerchCard({
  product,
  site,
  delay,
}: {
  product: Product;
  site: SiteConfig;
  delay: number;
}) {
  const href = whatsappUrl(site.phone, product.whatsappMessage);

  return (
    <Reveal
      as="article"
      delay={delay}
      className="group flex flex-col overflow-hidden rounded-[3px] border border-line bg-surface"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(max-width: 900px) 100vw, 580px"
          style={{ objectPosition: product.image.position ?? "top" }}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-[2px] bg-red px-3 py-[6px] font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-[26px] pb-7 pt-[26px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="mb-[6px] mt-0 font-display text-[28px] font-normal uppercase tracking-[0.01em]">
              {product.title}
            </h3>
            <div className="font-label text-[12.5px] uppercase tracking-[0.06em] text-dim">
              {product.detail}
            </div>
          </div>
          <div className="shrink-0 text-right leading-none">
            <div className="flex items-start justify-end gap-[3px]">
              <span className="mt-[5px] font-label text-[15px] text-sand">{product.currency}</span>
              <span className="font-display text-[40px] text-gold">{product.price}</span>
            </div>
            {product.note && (
              <div className="mt-1 font-label text-[11px] uppercase tracking-[0.08em] text-dimmer">
                {product.compareAtPrice ? (
                  <>
                    {product.note.replace(`${product.currency}${product.compareAtPrice}`, "").trim()}{" "}
                    <span className="line-through">
                      {product.currency}
                      {product.compareAtPrice}
                    </span>
                  </>
                ) : (
                  product.note
                )}
              </div>
            )}
          </div>
        </div>
        <a
          href={href}
          {...EXTERNAL}
          className="mt-[22px] inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-whatsapp px-[22px] py-[14px] font-label text-[14px] font-semibold uppercase tracking-[0.06em] text-whatsapp-ink transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(37,211,102,.3)]"
        >
          <WhatsAppIcon size={18} />
          Comprar por WhatsApp
        </a>
      </div>
    </Reveal>
  );
}

export function Tienda({
  data = DEFAULT_TIENDA,
  products = DEFAULT_PRODUCTS,
  site = DEFAULT_SITE_CONFIG,
  sectionId = "tienda",
}: {
  data?: ProductGridSectionData;
  products?: Product[];
  site?: SiteConfig;
  sectionId?: string;
}) {
  const activeProducts = products.filter((product) => product.active !== false);

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-base px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal className="mb-[clamp(40px,5vw,60px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker className="mb-4">{data.kicker}</Kicker>
            <h2 className="m-0 font-display text-[clamp(36px,5.5vw,68px)] font-normal uppercase leading-[0.95]">
              <Multiline text={data.title} />
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-[16.5px] leading-[1.6] text-muted">
            {data.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {activeProducts.map((product, i) => (
            <MerchCard key={product.id} product={product} site={site} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
