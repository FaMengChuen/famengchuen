"use client";

import { inputClass, labelClass } from "./ui";

/**
 * Editor recursivo y genérico para los datos (JSON) de una sección del CMS.
 * Soporta strings, números, booleanos, objetos anidados y arreglos (de
 * strings, objetos o valores simples). Suficiente para todas las plantillas
 * de sección sin construir un formulario a medida por cada tipo.
 */

type JsonValue = unknown;

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function emptyLike(sample: JsonValue): JsonValue {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(
      Object.entries(sample as Record<string, JsonValue>).map(([k, v]) => [k, emptyLike(v)]),
    );
  }
  return "";
}

function ValueEditor({
  label,
  value,
  onChange,
  depth,
}: {
  label: string;
  value: JsonValue;
  onChange: (next: JsonValue) => void;
  depth: number;
}) {
  // Booleano
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[#d81f26]"
        />
        <span className="text-[13px] text-cream">{label}</span>
      </label>
    );
  }

  // Número
  if (typeof value === "number") {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <input
          type="number"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </label>
    );
  }

  // String
  if (typeof value === "string") {
    const multiline = value.includes("\n") || value.length > 60;
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        {multiline ? (
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }

  // Arreglo
  if (Array.isArray(value)) {
    return (
      <div className="rounded-[3px] border border-line-12 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className={labelClass}>{label}</span>
          <button
            type="button"
            onClick={() => {
              const sample = value.length ? value[value.length - 1] : "";
              onChange([...value, emptyLike(sample)]);
            }}
            className="rounded-[3px] border border-line-14 px-2 py-1 font-label text-[11px] uppercase tracking-[0.06em] text-cream hover:border-gold"
          >
            + Agregar
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {value.map((item, index) => (
            <div key={index} className="rounded-[3px] border border-line-12 bg-base/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-label text-[11px] uppercase tracking-[0.1em] text-dimmer">
                  #{index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...value];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      onChange(next);
                    }}
                    className="rounded-[3px] border border-line-14 px-1.5 text-cream hover:border-gold disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={() => {
                      const next = [...value];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      onChange(next);
                    }}
                    className="rounded-[3px] border border-line-14 px-1.5 text-cream hover:border-gold disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, i) => i !== index))}
                    className="rounded-[3px] border border-red/50 px-1.5 text-red hover:bg-red/10"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <ValueEditor
                label={`Elemento ${index + 1}`}
                value={item}
                depth={depth + 1}
                onChange={(next) => {
                  const copy = [...value];
                  copy[index] = next;
                  onChange(copy);
                }}
              />
            </div>
          ))}
          {value.length === 0 && (
            <p className="text-[12px] text-dimmer">Sin elementos. Usa “Agregar”.</p>
          )}
        </div>
      </div>
    );
  }

  // Objeto
  if (value && typeof value === "object") {
    const obj = value as Record<string, JsonValue>;
    return (
      <fieldset className="rounded-[3px] border border-line-12 p-3">
        {depth > 0 && <legend className="px-1 text-[12px] text-gold">{label}</legend>}
        <div className="flex flex-col gap-3">
          {Object.entries(obj).map(([key, child]) => (
            <ValueEditor
              key={key}
              label={humanize(key)}
              value={child}
              depth={depth + 1}
              onChange={(next) => onChange({ ...obj, [key]: next })}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  // null / undefined → editable como texto
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        value=""
        onChange={(e) => onChange(e.target.value)}
        placeholder="(vacío)"
      />
    </label>
  );
}

export function DataEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <ValueEditor
      label="Datos"
      value={data}
      depth={0}
      onChange={(next) => onChange(next as Record<string, unknown>)}
    />
  );
}
