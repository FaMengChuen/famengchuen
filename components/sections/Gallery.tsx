import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import type { GallerySectionData } from "@/lib/cms/types";

const FALLBACK: GallerySectionData = {
  title: "Galería",
  images: [],
};

export function Gallery({
  data = FALLBACK,
  sectionId,
}: {
  data?: GallerySectionData;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="bg-alt px-[clamp(20px,5vw,56px)] py-[clamp(64px,8vw,112px)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal className="mb-[clamp(32px,4vw,52px)] text-center">
          {data.kicker && (
            <Kicker both className="mb-4">
              {data.kicker}
            </Kicker>
          )}
          <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] font-normal uppercase leading-[1.0]">
            {data.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[14px]">
          {data.images.map((image, index) => (
            <Reveal
              key={image.src + index}
              as="figure"
              delay={(index % 3) * 0.06}
              className="relative m-0 aspect-[4/3] overflow-hidden rounded-[3px] border border-line bg-ink"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 900px) 100vw, 380px"
                style={{ objectPosition: image.position ?? "center" }}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.05]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
