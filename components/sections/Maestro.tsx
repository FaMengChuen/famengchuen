import Image from "next/image";
import { Reveal } from "../Reveal";
import { Kicker } from "../Kicker";
import { Multiline } from "../Multiline";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/default-content";
import type { TeacherProfileSectionData } from "@/lib/cms/types";

const DEFAULT_MAESTRO = DEFAULT_HOME_SECTIONS.find((section) => section.type === "teacherProfile")
  ?.data as TeacherProfileSectionData;

export function Maestro({
  data = DEFAULT_MAESTRO,
  sectionId = "maestro",
}: {
  data?: TeacherProfileSectionData;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-alt px-[clamp(20px,5vw,56px)] py-[clamp(72px,9vw,128px)]"
    >
      <Image
        src={data.logo.src}
        alt=""
        aria-hidden="true"
        width={data.logo.width ?? 330}
        height={data.logo.height ?? 330}
        className="fmc-crane fmc-crane--slow pointer-events-none absolute -bottom-[50px] -left-[50px] z-0 h-auto w-[clamp(170px,26vw,330px)] opacity-[0.05]"
      />

      <div className="relative mx-auto grid max-w-content grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(36px,5vw,64px)]">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[3px] border border-line-12">
            <Image
              src={data.portrait.src}
              alt={data.portrait.alt}
              width={data.portrait.width ?? 900}
              height={data.portrait.height ?? 1200}
              sizes="(max-width: 1180px) 100vw, 560px"
              style={{ objectPosition: data.portrait.position ?? "center 20%" }}
              className="block h-[clamp(380px,52vw,560px)] w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top,rgba(10,10,11,.6),transparent 45%)",
              }}
            />
          </div>
          <div className="absolute inset-x-[18px] bottom-[18px] flex items-center gap-[14px] rounded-[3px] border border-[rgba(227,178,60,.3)] bg-[rgba(10,10,11,.82)] p-4 backdrop-blur-[6px]">
            <Image
              src={data.recognitionImage.src}
              alt={data.recognitionImage.alt}
              width={data.recognitionImage.width ?? 58}
              height={data.recognitionImage.height ?? 58}
              className="h-[58px] w-[58px] shrink-0 rounded-[2px] object-cover"
            />
            <div>
              <div className="font-label text-[10.5px] uppercase tracking-[0.16em] text-gold">
                {data.recognitionKicker}
              </div>
              <div className="mt-[3px] text-[13.5px] leading-[1.4] text-cream-2">
                {data.recognitionText}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Kicker className="mb-[18px]">{data.kicker}</Kicker>
          <h2 className="m-0 font-display text-[clamp(34px,5vw,60px)] font-normal uppercase leading-[0.95]">
            <Multiline text={data.title} />
          </h2>
          <div className="mt-[14px] font-label text-[14px] tracking-[0.04em] text-gold">
            {data.subtitle}
          </div>
          <p className="mb-[26px] mt-[18px] max-w-[50ch] text-[17px] leading-[1.6] text-secondary">
            {data.text}
          </p>

          <ul className="m-0 flex list-none flex-col p-0">
            {data.credentials.map((c, i) => (
              <li
                key={c.title}
                className={`flex gap-4 border-t border-line-12 py-[15px] ${
                  i === data.credentials.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="mt-[7px] h-[9px] w-[9px] shrink-0 rotate-45 bg-red" />
                <div>
                  <div className="font-label text-[15px] tracking-[0.02em] text-cream">
                    {c.title}
                  </div>
                  <div className="mt-[2px] text-[14px] text-dim">{c.sub}</div>
                </div>
              </li>
            ))}
          </ul>

          {data.closingText && (
            <p className="mb-0 mt-[22px] max-w-[50ch] text-[15px] leading-[1.6] text-muted">
              {data.closingText}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
