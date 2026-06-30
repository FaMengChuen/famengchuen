import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/default-content";
import type { ProgramCardsSectionData } from "@/lib/cms/types";

const DEFAULT_PROGRAMAS = DEFAULT_HOME_SECTIONS.find((section) => section.type === "programCards")
  ?.data as ProgramCardsSectionData;

type ProgramItem = ProgramCardsSectionData["items"][number];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[2px] border border-[rgba(244,241,234,.18)] px-3 py-[6px] font-label text-[11px] uppercase tracking-[0.1em] text-sand">
      {children}
    </span>
  );
}

function ProgramCard({ item, delay }: { item: ProgramItem; delay: number }) {
  const contain = item.imageMode === "contain";

  return (
    <Reveal
      as="article"
      delay={delay}
      className="relative flex flex-col overflow-hidden rounded-[3px] border border-line bg-surface"
    >
      {contain ? (
        <div className="relative grid h-[230px] place-items-center overflow-hidden bg-black">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width ?? 360}
            height={item.image.height ?? 360}
            className="h-auto w-[88%] max-w-[360px] object-contain"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%,transparent 40%,rgba(216,31,38,.12) 100%)",
            }}
          />
        </div>
      ) : (
        <div className="relative h-[230px] overflow-hidden">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 580px"
            style={{ objectPosition: item.image.position ?? "center" }}
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top,#141417,rgba(20,20,23,.2) 60%,rgba(20,20,23,.5))",
            }}
          />
          {item.logo && (
            <Image
              src={item.logo.src}
              alt={item.logo.alt}
              width={item.logo.width ?? 118}
              height={item.logo.height ?? 118}
              className="absolute -bottom-[26px] right-5 h-[118px] w-[118px] object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,.6)]"
            />
          )}
        </div>
      )}
      <div className="px-7 pb-8 pt-[30px]">
        <div className="font-label text-[11.5px] uppercase tracking-[0.2em] text-gold">
          {item.kicker}
        </div>
        <h3 className="mb-[6px] mt-2 font-display text-[30px] font-normal uppercase tracking-[0.01em]">
          {item.title}
        </h3>
        <div className="mb-[14px] text-[13px] italic text-dim">{item.subtitle}</div>
        <p className="mb-[18px] mt-0 text-[15px] leading-[1.6] text-secondary">{item.text}</p>
        <div className="flex flex-wrap gap-2">
          {item.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function Programas({
  data = DEFAULT_PROGRAMAS,
  sectionId = "programas",
}: {
  data?: ProgramCardsSectionData;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative bg-base px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal className="mb-[clamp(40px,5vw,60px)] text-center">
          <Kicker both className="mb-4">
            {data.kicker}
          </Kicker>
          <h2 className="m-0 font-display text-[clamp(36px,5.5vw,68px)] font-normal uppercase leading-[0.95]">
            {data.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          {data.items.map((item, i) => (
            <ProgramCard key={item.title} item={item} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
