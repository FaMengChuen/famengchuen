import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/default-content";
import type { TrustStripSectionData } from "@/lib/cms/types";

const DEFAULT_TRUST = DEFAULT_HOME_SECTIONS.find((section) => section.type === "trustStrip")
  ?.data as TrustStripSectionData;

export function TrustStrip({ data = DEFAULT_TRUST }: { data?: TrustStripSectionData }) {
  return (
    <div className="overflow-hidden bg-red text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-y-[14px] gap-x-[clamp(28px,6vw,72px)] px-[clamp(20px,5vw,56px)] py-5 text-center font-label text-[13px] uppercase tracking-[0.14em]">
        {data.items.map((item, i) => (
          <span key={item} className="contents">
            <span>{item}</span>
            {i < data.items.length - 1 && <span className="opacity-50">/</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
