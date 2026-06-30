import Image from "next/image";
import { Reveal } from "../Reveal";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/default-content";
import type { ImageFeatureSectionData } from "@/lib/cms/types";

const DEFAULT_IMAGE_FEATURE = DEFAULT_HOME_SECTIONS.find((section) => section.type === "imageFeature")
  ?.data as ImageFeatureSectionData;

export function Equipo({ data = DEFAULT_IMAGE_FEATURE }: { data?: ImageFeatureSectionData }) {
  return (
    <section className="bg-alt px-[clamp(20px,5vw,56px)] pt-[clamp(48px,7vw,88px)]">
      <Reveal className="mx-auto max-w-content">
        <figure className="relative m-0 overflow-hidden rounded-[3px] border border-line bg-ink">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width ?? 2000}
            height={data.image.height ?? 1333}
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="block h-auto w-full"
          />
          <figcaption
            className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-4 gap-y-[10px] px-[26px] pb-5 pt-[34px] font-label text-[12.5px] uppercase tracking-[0.16em] text-gold"
            style={{ background: "linear-gradient(to top,rgba(8,8,10,.92),transparent)" }}
          >
            <span>{data.captionParts[0]}</span>
            <span className="h-[5px] w-[5px] rotate-45 bg-red" />
            <span className="text-sand">{data.captionParts[1]}</span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
