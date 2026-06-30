"use client";

import type { FieldDef } from "@/lib/cms/section-schemas";
import type { ImageRef } from "@/lib/cms/types";
import { ImagePicker } from "./ImagePicker";
import { Toggle, inputClass, labelClass } from "./ui";

function ItemChrome({
  title,
  index,
  count,
  onUp,
  onDown,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  count: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[3px] border border-line-12 bg-base/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label text-[11px] uppercase tracking-[0.1em] text-dimmer">
          {title} {index + 1}
        </span>
        <div className="flex gap-1">
          <button type="button" onClick={onUp} disabled={index === 0}
            className="rounded-[3px] border border-line-14 px-1.5 text-cream hover:border-gold disabled:opacity-30">↑</button>
          <button type="button" onClick={onDown} disabled={index === count - 1}
            className="rounded-[3px] border border-line-14 px-1.5 text-cream hover:border-gold disabled:opacity-30">↓</button>
          <button type="button" onClick={onRemove}
            className="rounded-[3px] border border-red/50 px-1.5 text-red hover:bg-red/10">✕</button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start rounded-[3px] border border-line-14 px-3 py-1.5 font-label text-[12px] uppercase tracking-[0.06em] text-cream transition hover:border-gold"
    >
      + {label}
    </button>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  [next[to], next[from]] = [next[from], next[to]];
  return next;
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (field.type) {
    case "text":
      return (
        <label className="block">
          <span className={labelClass}>{field.label}</span>
          <input
            className={inputClass}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <span className="mt-1 block text-[11px] text-dimmer">{field.hint}</span>}
        </label>
      );

    case "textarea":
      return (
        <label className="block">
          <span className={labelClass}>{field.label}</span>
          <textarea
            className={`${inputClass} min-h-[84px] resize-y`}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <span className="mt-1 block text-[11px] text-dimmer">{field.hint}</span>}
        </label>
      );

    case "toggle":
      return <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />;

    case "image":
      return (
        <ImagePicker
          label={field.label}
          value={value as ImageRef | undefined}
          onChange={onChange}
        />
      );

    case "group": {
      const obj = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
      return (
        <fieldset className="rounded-[3px] border border-line-12 p-3">
          <legend className="px-1 text-[12px] text-gold">{field.label}</legend>
          <div className="flex flex-col gap-3">
            {(field.fields ?? []).map((sub) => (
              <FieldControl
                key={sub.key}
                field={sub}
                value={obj[sub.key]}
                onChange={(v) => onChange({ ...obj, [sub.key]: v })}
              />
            ))}
          </div>
        </fieldset>
      );
    }

    case "stringList": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-col gap-2">
          <span className={labelClass}>{field.label}</span>
          {list.map((item, i) => (
            <div key={i} className="flex gap-1">
              <input
                className={inputClass}
                value={item}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = e.target.value;
                  onChange(next);
                }}
              />
              <button type="button" onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0}
                className="shrink-0 rounded-[3px] border border-line-14 px-2 text-cream hover:border-gold disabled:opacity-30">↑</button>
              <button type="button" onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1}
                className="shrink-0 rounded-[3px] border border-line-14 px-2 text-cream hover:border-gold disabled:opacity-30">↓</button>
              <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="shrink-0 rounded-[3px] border border-red/50 px-2 text-red hover:bg-red/10">✕</button>
            </div>
          ))}
          <AddButton label={field.itemLabel ?? "Agregar"} onClick={() => onChange([...list, ""])} />
        </div>
      );
    }

    case "imageList": {
      const list = Array.isArray(value) ? (value as ImageRef[]) : [];
      return (
        <div className="flex flex-col gap-2">
          <span className={labelClass}>{field.label}</span>
          {list.map((item, i) => (
            <ItemChrome
              key={i}
              title={field.itemLabel ?? "Imagen"}
              index={i}
              count={list.length}
              onUp={() => onChange(move(list, i, i - 1))}
              onDown={() => onChange(move(list, i, i + 1))}
              onRemove={() => onChange(list.filter((_, j) => j !== i))}
            >
              <ImagePicker
                label="Imagen"
                value={item}
                onChange={(v) => {
                  const next = [...list];
                  next[i] = v;
                  onChange(next);
                }}
              />
            </ItemChrome>
          ))}
          <AddButton
            label={field.itemLabel ?? "Imagen"}
            onClick={() => onChange([...list, { src: "/assets/team.jpg", alt: "" }])}
          />
        </div>
      );
    }

    case "objectList": {
      const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      return (
        <div className="flex flex-col gap-2">
          <span className={labelClass}>{field.label}</span>
          {list.map((item, i) => (
            <ItemChrome
              key={i}
              title={field.itemLabel ?? "Elemento"}
              index={i}
              count={list.length}
              onUp={() => onChange(move(list, i, i - 1))}
              onDown={() => onChange(move(list, i, i + 1))}
              onRemove={() => onChange(list.filter((_, j) => j !== i))}
            >
              <div className="flex flex-col gap-3">
                {(field.fields ?? []).map((sub) => (
                  <FieldControl
                    key={sub.key}
                    field={sub}
                    value={item[sub.key]}
                    onChange={(v) => {
                      const next = [...list];
                      next[i] = { ...item, [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
            </ItemChrome>
          ))}
          <AddButton
            label={field.itemLabel ?? "Agregar"}
            onClick={() =>
              onChange([...list, structuredClone(field.itemTemplate ?? {})])
            }
          />
        </div>
      );
    }

    default:
      return null;
  }
}

export function SchemaForm({
  fields,
  data,
  onChange,
}: {
  fields: FieldDef[];
  data: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={data[field.key]}
          onChange={(v) => onChange({ ...data, [field.key]: v })}
        />
      ))}
    </div>
  );
}
