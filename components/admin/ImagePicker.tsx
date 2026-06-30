"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/admin/client";
import type { ImageRef, MediaAsset } from "@/lib/cms/types";
import { inputClass, labelClass } from "./ui";

// Imágenes que ya vienen con el sitio (carpeta public/assets).
const SITE_IMAGES = [
  "/assets/team.jpg",
  "/assets/comunidad.jpg",
  "/assets/coach2.jpg",
  "/assets/taichi.jpg",
  "/assets/sanda.jpg",
  "/assets/taolu.jpg",
  "/assets/pamva-women.jpg",
  "/assets/pamva.png",
  "/assets/arte-de-luchar.png",
  "/assets/congreso.jpg",
  "/assets/merch-polos.jpg",
  "/assets/merch-casacas.jpg",
  "/assets/logo.png",
];

export function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ImageRef | undefined;
  onChange: (next: ImageRef) => void;
}) {
  const [open, setOpen] = useState(false);
  const src = value?.src ?? "";
  const alt = value?.alt ?? "";

  function setSrc(nextSrc: string) {
    onChange({ ...(value ?? { src: "", alt: "" }), src: nextSrc });
  }
  function setAlt(nextAlt: string) {
    onChange({ ...(value ?? { src: "", alt: "" }), alt: nextAlt });
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[3px] border border-line-14 bg-ink transition hover:border-gold"
          title="Cambiar imagen"
        >
          {src ? (
            <Image src={src} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[11px] text-dimmer">
              Elegir
            </span>
          )}
        </button>
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mb-2 rounded-[3px] border border-line-14 px-3 py-1.5 font-label text-[12px] uppercase tracking-[0.06em] text-cream transition hover:border-gold"
          >
            Cambiar imagen
          </button>
          <input
            className={inputClass}
            value={alt}
            placeholder="Texto alternativo (describe la imagen)"
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
      </div>

      {open && (
        <ImageModal
          currentSrc={src}
          onClose={() => setOpen(false)}
          onPick={(picked) => {
            setSrc(picked);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ImageModal({
  currentSrc,
  onPick,
  onClose,
}: {
  currentSrc: string;
  onPick: (src: string) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await adminApi<{ media: MediaAsset[] }>("/api/admin/media");
        if (active) setMedia(res.media);
      } catch {
        /* sin medios subidos todavía */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const uploaded = media.map((m) => m.downloadURL);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[4px] border border-line bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h3 className="m-0 font-display text-lg uppercase tracking-[0.03em]">Elegir imagen</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-[3px] border border-line-14 text-cream hover:border-red"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {uploaded.length > 0 && (
            <>
              <div className={labelClass}>Tus imágenes subidas</div>
              <Grid images={uploaded} currentSrc={currentSrc} onPick={onPick} />
            </>
          )}

          <div className={`${labelClass} mt-2`}>Imágenes del sitio</div>
          <Grid images={SITE_IMAGES} currentSrc={currentSrc} onPick={onPick} />
        </div>

        <div className="border-t border-line px-5 py-3">
          <span className={labelClass}>…o pega la dirección de una imagen</span>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={url}
              placeholder="https://… o /assets/imagen.jpg"
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="button"
              disabled={!url.trim()}
              onClick={() => onPick(url.trim())}
              className="shrink-0 rounded-[3px] bg-red px-4 font-label text-[13px] uppercase tracking-[0.06em] text-white disabled:opacity-50"
            >
              Usar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({
  images,
  currentSrc,
  onPick,
}: {
  images: string[];
  currentSrc: string;
  onPick: (src: string) => void;
}) {
  return (
    <div className="mb-3 mt-2 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
      {images.map((img) => (
        <button
          key={img}
          type="button"
          onClick={() => onPick(img)}
          className={`relative aspect-square overflow-hidden rounded-[3px] border-2 transition ${
            img === currentSrc ? "border-gold" : "border-transparent hover:border-line-14"
          }`}
        >
          <Image src={img} alt="" fill sizes="110px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}
