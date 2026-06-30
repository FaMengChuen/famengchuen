"use client";

import { useEffect, useRef, useState } from "react";
import { PreviewModeProvider } from "../PreviewMode";
import { SectionRenderer } from "../SectionRenderer";
import { DEFAULT_PRODUCTS, DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { CmsSection } from "@/lib/cms/types";

const PREVIEW_WIDTH = 1180;

/**
 * Vista previa en vivo de las secciones de una página. Reutiliza los mismos
 * componentes del sitio público (escalados para caber en el panel) para que la
 * persona vea exactamente cómo quedará lo que edita.
 */
export function SectionsPreview({ sections }: { sections: CmsSection[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const recompute = () => {
      const w = outer.clientWidth;
      const s = Math.min(1, w / PREVIEW_WIDTH);
      setScale(s);
      setHeight(inner.scrollHeight * s);
    };

    const ro = new ResizeObserver(recompute);
    ro.observe(outer);
    ro.observe(inner);
    recompute();
    return () => ro.disconnect();
  }, [sections]);

  const enabled = sections.filter((s) => s.enabled);

  return (
    <div ref={outerRef} className="w-full overflow-hidden rounded-[4px] border border-line bg-base">
      <div style={{ height }}>
        <div
          ref={innerRef}
          style={{
            width: PREVIEW_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <PreviewModeProvider>
            {enabled.length === 0 ? (
              <div className="grid h-[400px] place-items-center text-dim">
                Activa o agrega una sección para ver la vista previa.
              </div>
            ) : (
              <SectionRenderer
                sections={enabled}
                site={DEFAULT_SITE_CONFIG}
                products={DEFAULT_PRODUCTS}
              />
            )}
          </PreviewModeProvider>
        </div>
      </div>
    </div>
  );
}
