"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/client";
import type { SiteConfig } from "@/lib/cms/types";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { Banner, Field, btnDanger, btnGhost, btnPrimary, cardClass, inputClass } from "./ui";

/** Dónde se usa cada mensaje estándar, para que el editor tenga contexto. */
const MESSAGE_HINTS: Record<string, string> = {
  reservar: "Botón «Reservar clase»: header, hero, sección de contacto y burbuja flotante de WhatsApp.",
  sanda: "CTA del plan Sanda en la sección Precios.",
  taichi: "CTA del plan Tai Chi en la sección Precios.",
  claseLibre: "CTA de la clase libre en la sección Precios.",
  polo: "Mensaje heredado del polo (la tienda usa el mensaje propio de cada producto).",
  casaca: "Mensaje heredado de la casaca (la tienda usa el mensaje propio de cada producto).",
};

type MessageRow = { key: string; value: string };

export function SiteSettingsManager({ initialSite }: { initialSite: SiteConfig }) {
  const router = useRouter();
  const [brandName, setBrandName] = useState(initialSite.brandName);
  const [brandEyebrow, setBrandEyebrow] = useState(initialSite.brandEyebrow);
  const [phone, setPhone] = useState(initialSite.phone);
  const [phoneDisplay, setPhoneDisplay] = useState(initialSite.phoneDisplay);
  const [links, setLinks] = useState(initialSite.links);
  const [footerText, setFooterText] = useState(initialSite.footerText);
  const [footerSignature, setFooterSignature] = useState(initialSite.footerSignature);
  const [messages, setMessages] = useState<MessageRow[]>(
    Object.entries(initialSite.whatsappMessages).map(([key, value]) => ({ key, value })),
  );
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchMessage(index: number, patch: Partial<MessageRow>) {
    setMessages((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function save() {
    setError(null);
    setOk(false);
    setSaving(true);

    const whatsappMessages: Record<string, string> = {};
    for (const row of messages) {
      const key = row.key.trim();
      const value = row.value.trim();
      if (key && value) {
        whatsappMessages[key] = value;
      }
    }

    try {
      await adminApi("/api/admin/site", {
        method: "PUT",
        body: JSON.stringify({
          brandName,
          brandEyebrow,
          phone,
          phoneDisplay,
          links,
          whatsappMessages,
          footerText,
          footerSignature,
        }),
      });
      setOk(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Configuración</h1>
          <p className="mt-1 text-[14px] text-dim">
            Teléfono, mensajes de WhatsApp, redes y textos generales del sitio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ok && <span className="text-[13px] text-whatsapp">Guardado ✓</span>}
          <button type="button" className={btnPrimary} onClick={save} disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error && <Banner>{error}</Banner>}

      <section className={cardClass}>
        <h2 className="m-0 mb-1 font-display text-xl uppercase tracking-[0.02em]">
          Mensajes de WhatsApp
        </h2>
        <p className="mb-4 mt-0 text-[13px] leading-[1.6] text-dim">
          Texto pre-rellenado que se envía al tocar cada botón del sitio. Si eliminas un mensaje
          estándar, vuelve a su texto original.
        </p>
        <div className="flex flex-col gap-4">
          {messages.map((row, index) => (
            <div key={index} className="rounded-[3px] border border-line-12 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <input
                  className={`${inputClass} max-w-[220px] font-mono text-[13px]`}
                  value={row.key}
                  onChange={(e) => patchMessage(index, { key: e.target.value })}
                  placeholder="clave (ej. reservar)"
                />
                <div className="flex items-center gap-2">
                  {row.value.trim() && (
                    <a
                      href={whatsappUrl(phone, row.value)}
                      {...EXTERNAL}
                      className="font-label text-[12px] uppercase tracking-[0.06em] text-whatsapp hover:underline"
                    >
                      Probar ↗
                    </a>
                  )}
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setMessages((rows) => rows.filter((_, i) => i !== index))}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <textarea
                className={`${inputClass} min-h-[64px] resize-y`}
                value={row.value}
                onChange={(e) => patchMessage(index, { value: e.target.value })}
              />
              {MESSAGE_HINTS[row.key] && (
                <p className="mb-0 mt-2 text-[12px] text-dimmer">{MESSAGE_HINTS[row.key]}</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className={`${btnGhost} mt-4`}
          onClick={() => setMessages((rows) => [...rows, { key: "", value: "" }])}
        >
          Añadir mensaje
        </button>
      </section>

      <section className={cardClass}>
        <h2 className="m-0 mb-4 font-display text-xl uppercase tracking-[0.02em]">Contacto</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Field label="Teléfono (para wa.me)" hint="Solo dígitos, con código de país. Ej: 51963341350">
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Teléfono visible" hint="Como se muestra en el sitio. Ej: +51 963 341 350">
            <input
              className={inputClass}
              value={phoneDisplay}
              onChange={(e) => setPhoneDisplay(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="m-0 mb-4 font-display text-xl uppercase tracking-[0.02em]">Marca y redes</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Field label="Nombre de la marca">
            <input className={inputClass} value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </Field>
          <Field label="Subtítulo (eyebrow)">
            <input
              className={inputClass}
              value={brandEyebrow}
              onChange={(e) => setBrandEyebrow(e.target.value)}
            />
          </Field>
          <Field label="Google Maps">
            <input
              className={inputClass}
              value={links.maps}
              onChange={(e) => setLinks((l) => ({ ...l, maps: e.target.value }))}
            />
          </Field>
          <Field label="Instagram">
            <input
              className={inputClass}
              value={links.instagram}
              onChange={(e) => setLinks((l) => ({ ...l, instagram: e.target.value }))}
            />
          </Field>
          <Field label="Facebook">
            <input
              className={inputClass}
              value={links.facebook}
              onChange={(e) => setLinks((l) => ({ ...l, facebook: e.target.value }))}
            />
          </Field>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="m-0 mb-4 font-display text-xl uppercase tracking-[0.02em]">Pie de página</h2>
        <div className="flex flex-col gap-4">
          <Field label="Texto del footer">
            <textarea
              className={`${inputClass} min-h-[64px] resize-y`}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </Field>
          <Field label="Firma del footer">
            <input
              className={inputClass}
              value={footerSignature}
              onChange={(e) => setFooterSignature(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" className={btnPrimary} onClick={save} disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
