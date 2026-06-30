import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import type { RichTextSectionData } from "@/lib/cms/types";

const FALLBACK: RichTextSectionData = {
  title: "Título de la sección",
  body: "Contenido de texto.",
};

export function RichText({
  data = FALLBACK,
  sectionId,
}: {
  data?: RichTextSectionData;
  sectionId?: string;
}) {
  const paragraphs = data.body.split(/\n{2,}/).filter(Boolean);

  return (
    <section
      id={sectionId}
      className="bg-base px-[clamp(20px,5vw,56px)] py-[clamp(64px,8vw,112px)]"
    >
      <Reveal className="mx-auto max-w-[760px]">
        {data.kicker && <Kicker className="mb-4">{data.kicker}</Kicker>}
        <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] font-normal uppercase leading-[1.0]">
          {data.title}
        </h2>
        <div className="mt-6 flex flex-col gap-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="m-0 text-[16.5px] leading-[1.7] text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
