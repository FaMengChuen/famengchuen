"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminApi } from "@/lib/admin/client";
import type { Product } from "@/lib/cms/types";
import { Banner, Field, Toggle, btnDanger, btnGhost, btnPrimary, cardClass, inputClass } from "./ui";

type Draft = Omit<Product, "updatedAt">;

function emptyDraft(order: number): Draft {
  return {
    id: "",
    title: "",
    detail: "",
    description: "",
    price: "",
    currency: "S/",
    note: "",
    compareAtPrice: "",
    badge: "",
    sizes: [],
    image: { src: "/assets/merch-polos.jpg", alt: "" },
    whatsappMessage: "Hola, quiero comprar este producto de Fa Meng Chuen. Mi talla es:",
    active: true,
    order,
  };
}

function ProductForm({
  draft,
  isNew,
  onSaved,
  onCancel,
}: {
  draft: Draft;
  isNew: boolean;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Draft>(draft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch(p: Partial<Draft>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function save() {
    setError(null);
    setSaving(true);
    const body = JSON.stringify({
      title: form.title,
      detail: form.detail,
      description: form.description || undefined,
      price: form.price,
      currency: form.currency,
      note: form.note,
      compareAtPrice: form.compareAtPrice || undefined,
      badge: form.badge,
      sizes: form.sizes,
      image: { src: form.image.src, alt: form.image.alt, position: form.image.position || undefined },
      whatsappMessage: form.whatsappMessage,
      active: form.active,
      order: form.order,
    });
    try {
      if (isNew) {
        await adminApi("/api/admin/products", { method: "POST", body });
      } else {
        await adminApi(`/api/admin/products/${form.id}`, { method: "PUT", body });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <Banner>{error}</Banner>}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <Field label="Nombre">
          <input className={inputClass} value={form.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Detalle (subtítulo)">
          <input className={inputClass} value={form.detail} onChange={(e) => patch({ detail: e.target.value })} />
        </Field>
        <Field label="Precio">
          <input className={inputClass} value={form.price} onChange={(e) => patch({ price: e.target.value })} />
        </Field>
        <Field label="Moneda">
          <input className={inputClass} value={form.currency} onChange={(e) => patch({ currency: e.target.value })} />
        </Field>
        <Field label="Nota (ej. Regular S/30)">
          <input className={inputClass} value={form.note} onChange={(e) => patch({ note: e.target.value })} />
        </Field>
        <Field label="Precio tachado (opcional)">
          <input
            className={inputClass}
            value={form.compareAtPrice ?? ""}
            onChange={(e) => patch({ compareAtPrice: e.target.value })}
          />
        </Field>
        <Field label="Badge (ej. Preventa)">
          <input className={inputClass} value={form.badge} onChange={(e) => patch({ badge: e.target.value })} />
        </Field>
        <Field label="Tallas (separadas por coma)">
          <input
            className={inputClass}
            value={form.sizes.join(", ")}
            onChange={(e) => patch({ sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
        </Field>
        <Field label="Orden">
          <input
            type="number"
            className={inputClass}
            value={form.order}
            onChange={(e) => patch({ order: Number(e.target.value) })}
          />
        </Field>
      </div>

      <Field label="Imagen (ruta o URL)">
        <input
          className={inputClass}
          value={form.image.src}
          onChange={(e) => patch({ image: { ...form.image, src: e.target.value } })}
        />
      </Field>
      <Field label="Texto alternativo de la imagen">
        <input
          className={inputClass}
          value={form.image.alt}
          onChange={(e) => patch({ image: { ...form.image, alt: e.target.value } })}
        />
      </Field>
      <Field label="Mensaje de WhatsApp">
        <textarea
          className={`${inputClass} min-h-[64px] resize-y`}
          value={form.whatsappMessage}
          onChange={(e) => patch({ whatsappMessage: e.target.value })}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Toggle checked={form.active} onChange={(v) => patch({ active: v })} label="Producto activo" />
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" className={btnGhost} onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="button" className={btnPrimary} onClick={save} disabled={saving || !form.title || !form.price}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const products = [...initialProducts].sort((a, b) => a.order - b.order);
  const nextOrder = (products.at(-1)?.order ?? 0) + 10;

  function refresh() {
    setCreating(false);
    setEditingId(null);
    router.refresh();
  }

  async function deactivate(id: string) {
    if (!confirm("¿Desactivar este producto? Dejará de mostrarse en la tienda.")) return;
    await adminApi(`/api/admin/products/${id}`, { method: "DELETE" }).catch(() => undefined);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Productos</h1>
          <p className="mt-1 text-[14px] text-dim">Tienda oficial con CTA directo a WhatsApp.</p>
        </div>
        <button type="button" className={btnGhost} onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancelar" : "Nuevo producto"}
        </button>
      </div>

      {creating && (
        <div className={cardClass}>
          <ProductForm draft={emptyDraft(nextOrder)} isNew onSaved={refresh} onCancel={() => setCreating(false)} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div key={product.id} className={cardClass}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[3px] border border-line bg-ink">
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-[160px] flex-1">
                <div className="text-[15px] text-cream">{product.title}</div>
                <div className="text-[13px] text-dim">
                  {product.currency} {product.price} · {product.detail}
                </div>
              </div>
              <span
                className={`rounded-[2px] px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.1em] ${
                  product.active ? "bg-whatsapp/15 text-whatsapp" : "bg-line text-dim"
                }`}
              >
                {product.active ? "Activo" : "Inactivo"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                >
                  {editingId === product.id ? "Cerrar" : "Editar"}
                </button>
                {product.active && (
                  <button type="button" className={btnDanger} onClick={() => deactivate(product.id)}>
                    Desactivar
                  </button>
                )}
              </div>
            </div>

            {editingId === product.id && (
              <div className="mt-4 border-t border-line-12 pt-4">
                <ProductForm
                  draft={{ ...product, description: product.description ?? "", compareAtPrice: product.compareAtPrice ?? "" }}
                  isNew={false}
                  onSaved={refresh}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
