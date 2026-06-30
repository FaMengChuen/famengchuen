"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/client";
import type { CmsPage } from "@/lib/cms/types";
import { Banner, Field, Toggle, btnGhost, btnPrimary, cardClass, inputClass, labelClass } from "./ui";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PagesManager({ initialPages }: { initialPages: CmsPage[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [showInNav, setShowInNav] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pages = [...initialPages].sort((a, b) => a.order - b.order);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const created = await adminApi<{ page: CmsPage }>("/api/admin/pages", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          navLabel: title,
          showInNav,
          visible: true,
          order: (pages.at(-1)?.order ?? 0) + 10,
        }),
      });
      router.push(`/admin/pages/${created.page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la página.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Páginas</h1>
          <p className="mt-1 text-[14px] text-dim">Edita la home y crea nuevas páginas del sitio.</p>
        </div>
        <button type="button" className={btnGhost} onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancelar" : "Nueva página"}
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className={`${cardClass} flex flex-col gap-4`}>
          {error && <Banner>{error}</Banner>}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <Field label="Título">
              <input
                className={inputClass}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                required
              />
            </Field>
            <Field label="Slug (URL)" hint={`/${slug || "..."}`}>
              <input
                className={inputClass}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
              />
            </Field>
          </div>
          <Toggle checked={showInNav} onChange={setShowInNav} label="Mostrar en el menú de navegación" />
          <div>
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Creando…" : "Crear y editar"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-[4px] border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-ink/60 font-label text-[11px] uppercase tracking-[0.12em] text-dim">
              <th className="px-4 py-3">Página</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="text-[14px] text-cream">{page.title}</div>
                  {page.id === "home" && (
                    <span className={`${labelClass} mt-0.5`}>Página principal</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[13px] text-dim">
                  {page.slug === "home" ? "/" : `/${page.slug}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-[2px] px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.1em] ${
                      page.visible ? "bg-whatsapp/15 text-whatsapp" : "bg-line text-dim"
                    }`}
                  >
                    {page.visible ? "Visible" : "Oculta"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-label text-[13px] uppercase tracking-[0.06em] text-gold hover:underline"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
