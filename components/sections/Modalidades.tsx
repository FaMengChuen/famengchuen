import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/default-content";
import type { ModalitiesGridSectionData } from "@/lib/cms/types";

const DEFAULT_MODALIDADES = DEFAULT_HOME_SECTIONS.find((section) => section.type === "modalitiesGrid")
  ?.data as ModalitiesGridSectionData;

export function Modalidades({
  data = DEFAULT_MODALIDADES,
  sectionId = "modalidades",
}: {
  data?: ModalitiesGridSectionData;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="bg-alt px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker className="mb-4">{data.kicker}</Kicker>
            <h2 className="m-0 font-display text-[clamp(36px,5.5vw,68px)] font-normal uppercase leading-[0.95] tracking-[0.01em]">
              {data.title.split("\n").map((line, index) => (
                <span key={line}>
                  {line}
                  {index < data.title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-[16.5px] leading-[1.6] text-muted">
            {data.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[18px]">
          {data.items.map((m, i) => (
            <Reveal
              key={m.title}
              as="article"
              delay={i * 0.08}
              className="group relative h-[480px] overflow-hidden rounded-[3px] border border-line"
            >
              <Image
                src={m.image.src}
                alt={m.image.alt}
                fill
                sizes="(max-width: 900px) 100vw, 380px"
                style={{ objectPosition: m.image.position ?? "center" }}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0" style={{ background: m.gradient }} />
              <div className="absolute inset-x-0 bottom-0 px-[26px] pb-7 pt-7">
                <div className="font-label text-[11.5px] uppercase tracking-[0.22em] text-gold">
                  {m.kicker}
                </div>
                <h3 className="mb-[10px] mt-2 font-display text-[34px] font-normal uppercase tracking-[0.01em]">
                  {m.title}
                </h3>
                <p className="m-0 text-[14.5px] leading-[1.55] text-secondary">
                  {m.text}
                </p>
              </div>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-red transition-[width] duration-500 ease-out group-hover:w-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
