"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/client";
import type { CmsPage, CmsSection, SectionType } from "@/lib/cms/types";
import { SECTION_LABELS, SECTION_TYPES, createSectionData, newSectionId } from "@/lib/cms/section-templates";
import { SECTION_DESCRIPTIONS, SECTION_SCHEMAS } from "@/lib/cms/section-schemas";
import { DataEditor } from "./DataEditor";
import { SchemaForm } from "./SchemaForm";
import { SectionsPreview } from "./SectionsPreview";
import {
  Banner,
  Field,
  Toggle,
  btnDanger,
  btnGhost,
  btnPrimary,
  btnSmall,
  cardClass,
  inputClass,
} from "./ui";

type EditableSection = CmsSection & { _open?: boolean; _advanced?: boolean };

export function PageEditor({
  initialPage,
  initialSections,
}: {
  initialPage: CmsPage;
  initialSections: CmsSection[];
}) {
  const router = useRouter();
  const [page, setPage] = useState<CmsPage>(initialPage);
  const [sections, setSections] = useState<EditableSection[]>(
    [...initialSections].sort((a, b) => a.order - b.order),
  );
  const [newType, setNewType] = useState<SectionType>("richText");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const isHome = page.id === "home";

  function patchPage(patch: Partial<CmsPage>) {
    setPage((p) => ({ ...p, ...patch }));
  }
  function patchSection(id: string, patch: Partial<EditableSection>) {
    setSections((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function moveSection(index: number, dir: -1 | 1) {
    setSections((list) => {
      const next = [...list];
      const target = index + dir;
      if (target < 0 || target >= next.length) return list;
      [next[target], next[index]] = [next[index], next[target]];
      return next;
    });
  }
  function addSection() {
    const id = newSectionId(newType, sections.map((s) => s.id));
    setSections((list) => [
      ...list,
      { id, type: newType, order: (list.at(-1)?.order ?? 0) + 10, enabled: true, data: createSectionData(newType), _open: true },
    ]);
  }

  async function handleSave() {
    setError(null);
    setOk(false);
    setSaving(true);
    try {
      await adminApi(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify({
          page: {
            id: page.id,
            slug: page.slug,
            title: page.title,
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
            navLabel: page.navLabel,
            visible: page.visible,
            showInNav: page.showInNav,
            order: page.order,
          },
          sections: sections.map((s, i) => ({
            id: s.id,
            type: s.type,
            order: (i + 1) * 10,
            enabled: s.enabled,
            data: s.data,
          })),
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
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/pages")}
            className="mb-1 font-label text-[12px] uppercase tracking-[0.08em] text-dim hover:text-cream"
          >
            ← Páginas
          </button>
          <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">{page.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {ok && <span className="text-[13px] text-whatsapp">Guardado ✓</span>}
          <button
            type="button"
            className={`${btnGhost} xl:hidden`}
            onClick={() => setMobilePreview((v) => !v)}
          >
            {mobilePreview ? "Ocultar vista previa" : "Vista previa"}
          </button>
          <button type="button" className={btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar y publicar"}
          </button>
        </div>
      </div>

      {error && <Banner>{error}</Banner>}

      {/* Vista previa en móvil (toggle) */}
      {mobilePreview && (
        <div className="xl:hidden">
          <SectionsPreview sections={sections} />
        </div>
      )}

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start xl:gap-6">
        {/* Columna del editor */}
        <div className="flex flex-col gap-6">
          {/* Ajustes de la página */}
          <section className={`${cardClass} flex flex-col gap-4`}>
            <Field label="Nombre de la página">
              <input
                className={inputClass}
                value={page.title}
                onChange={(e) => patchPage({ title: e.target.value })}
              />
            </Field>
            <div className="flex flex-wrap gap-6">
              <Toggle checked={page.visible} onChange={(v) => patchPage({ visible: v })} label="Página publicada (visible)" />
              <Toggle checked={page.showInNav} onChange={(v) => patchPage({ showInNav: v })} label="Mostrar en el menú" />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="self-start font-label text-[12px] uppercase tracking-[0.08em] text-dim hover:text-cream"
            >
              {showAdvanced ? "▾ Ocultar opciones avanzadas" : "▸ Opciones avanzadas (opcional)"}
            </button>
            {showAdvanced && (
              <div className="flex flex-col gap-4 border-t border-line-12 pt-4">
                <p className="m-0 text-[12.5px] text-dimmer">
                  Estos campos son opcionales y ayudan a que la página aparezca mejor en Google.
                  Si no estás segura, déjalos como están.
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                  <Field label="Dirección web (slug)" hint={isHome ? "La página principal vive en /" : `/${page.slug}`}>
                    <input className={inputClass} value={page.slug} disabled={isHome} onChange={(e) => patchPage({ slug: e.target.value })} />
                  </Field>
                  <Field label="Etiqueta en el menú">
                    <input className={inputClass} value={page.navLabel} onChange={(e) => patchPage({ navLabel: e.target.value })} />
                  </Field>
                </div>
                <Field label="Título para Google (SEO)">
                  <input className={inputClass} value={page.seoTitle} onChange={(e) => patchPage({ seoTitle: e.target.value })} />
                </Field>
                <Field label="Descripción para Google (SEO)">
                  <textarea className={`${inputClass} min-h-[64px] resize-y`} value={page.seoDescription} onChange={(e) => patchPage({ seoDescription: e.target.value })} />
                </Field>
              </div>
            )}
          </section>

          {/* Secciones */}
          <section className="flex flex-col gap-4">
            <h2 className="m-0 font-display text-lg uppercase tracking-[0.03em] text-cream">
              Secciones de la página
            </h2>

            {sections.map((section, index) => {
              const schema = SECTION_SCHEMAS[section.type];
              return (
                <div key={section.id} className={`${cardClass} ${section.enabled ? "" : "opacity-60"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <button type="button" className={btnSmall} onClick={() => moveSection(index, -1)} disabled={index === 0}>↑</button>
                        <button type="button" className={btnSmall} onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1}>↓</button>
                      </div>
                      <div>
                        <div className="font-display text-[17px] uppercase tracking-[0.02em] text-cream">
                          {SECTION_LABELS[section.type]}
                        </div>
                        <div className="text-[12px] text-dim">{SECTION_DESCRIPTIONS[section.type]}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Toggle checked={section.enabled} onChange={(v) => patchSection(section.id, { enabled: v })} label="Visible" />
                      <button type="button" className={btnGhost} onClick={() => patchSection(section.id, { _open: !section._open })}>
                        {section._open ? "Cerrar" : "Editar"}
                      </button>
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => {
                          if (confirm("¿Eliminar esta sección?")) {
                            setSections((list) => list.filter((s) => s.id !== section.id));
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {section._open && (
                    <div className="mt-4 border-t border-line-12 pt-4">
                      {schema ? (
                        <SchemaForm
                          fields={schema}
                          data={section.data}
                          onChange={(next) => patchSection(section.id, { data: next })}
                        />
                      ) : (
                        <DataEditor data={section.data} onChange={(next) => patchSection(section.id, { data: next })} />
                      )}

                      {/* Edición técnica completa (oculta por defecto) */}
                      <button
                        type="button"
                        onClick={() => patchSection(section.id, { _advanced: !section._advanced })}
                        className="mt-4 font-label text-[11px] uppercase tracking-[0.08em] text-dimmer hover:text-cream"
                      >
                        {section._advanced ? "▾ Ocultar edición técnica" : "▸ Edición técnica (avanzado)"}
                      </button>
                      {section._advanced && (
                        <div className="mt-3 border-t border-line-12 pt-3">
                          <DataEditor data={section.data} onChange={(next) => patchSection(section.id, { data: next })} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {sections.length === 0 && (
              <div className={`${cardClass} text-center text-[14px] text-dim`}>
                Esta página no tiene secciones. Agrega una abajo.
              </div>
            )}

            {/* Agregar sección */}
            <div className={`${cardClass} flex flex-col gap-3`}>
              <div className="font-label text-[12px] uppercase tracking-[0.1em] text-dim">
                Agregar una sección
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select className={`${inputClass} w-auto`} value={newType} onChange={(e) => setNewType(e.target.value as SectionType)}>
                  {SECTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {SECTION_LABELS[type]}
                    </option>
                  ))}
                </select>
                <button type="button" className={btnGhost} onClick={addSection}>
                  + Agregar
                </button>
              </div>
              <p className="m-0 text-[12.5px] text-dimmer">{SECTION_DESCRIPTIONS[newType]}</p>
            </div>
          </section>

          <div className="flex justify-end">
            <button type="button" className={btnPrimary} onClick={handleSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar y publicar"}
            </button>
          </div>
        </div>

        {/* Vista previa fija (pantallas grandes) */}
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-y-auto xl:block">
          <div className="mb-2 font-label text-[11px] uppercase tracking-[0.12em] text-dim">
            Vista previa
          </div>
          <SectionsPreview sections={sections} />
        </aside>
      </div>
    </div>
  );
}
