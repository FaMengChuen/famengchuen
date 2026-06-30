"use client";

export const inputClass =
  "w-full rounded-[3px] border border-line-14 bg-base px-3 py-2 text-[14px] text-cream outline-none transition focus:border-gold";

export const labelClass =
  "mb-1 block font-label text-[11px] uppercase tracking-[0.12em] text-dim";

export const cardClass = "rounded-[4px] border border-line bg-surface p-5";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[3px] bg-red px-4 py-2 font-label text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-red-hi disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-[3px] border border-line-14 px-4 py-2 font-label text-[13px] uppercase tracking-[0.06em] text-cream transition hover:border-gold disabled:opacity-50";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-[3px] border border-red/50 px-3 py-1.5 font-label text-[12px] uppercase tracking-[0.06em] text-red transition hover:bg-red/10 disabled:opacity-50";

export const btnSmall =
  "inline-flex items-center justify-center rounded-[3px] border border-line-14 px-2 py-1 font-label text-[12px] text-cream transition hover:border-gold disabled:opacity-40";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-dimmer">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#d81f26]"
      />
      <span className="text-[13px] text-cream">{label}</span>
    </label>
  );
}

export function Banner({
  kind = "error",
  children,
}: {
  kind?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles =
    kind === "success"
      ? "border-whatsapp/40 bg-whatsapp/10 text-cream-2"
      : kind === "info"
        ? "border-gold/40 bg-gold/10 text-cream-2"
        : "border-red/40 bg-red/10 text-cream-2";
  return (
    <div className={`rounded-[3px] border px-4 py-3 text-[13px] ${styles}`}>{children}</div>
  );
}
