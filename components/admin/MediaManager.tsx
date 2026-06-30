"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { adminApi } from "@/lib/admin/client";
import type { MediaAsset } from "@/lib/cms/types";
import { Banner, btnDanger, btnGhost, btnPrimary, cardClass, inputClass } from "./ui";

function MediaCard({ asset, onChanged }: { asset: MediaAsset; onChanged: () => void }) {
  const [alt, setAlt] = useState(asset.alt);
  const [busy, setBusy] = useState(false);

  async function saveAlt() {
    setBusy(true);
    await adminApi(`/api/admin/media/${asset.id}`, {
      method: "PUT",
      body: JSON.stringify({ alt }),
    }).catch(() => undefined);
    setBusy(false);
    onChanged();
  }

  async function remove() {
    if (!confirm("¿Eliminar esta imagen? Se borrará del almacenamiento.")) return;
    setBusy(true);
    await adminApi(`/api/admin/media/${asset.id}`, { method: "DELETE" }).catch(() => undefined);
    onChanged();
  }

  return (
    <div className={`${cardClass} flex flex-col gap-3`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] border border-line bg-ink">
        <Image src={asset.downloadURL} alt={asset.alt} fill sizes="280px" className="object-cover" />
      </div>
      <input
        className={inputClass}
        value={alt}
        placeholder="Texto alternativo"
        onChange={(e) => setAlt(e.target.value)}
      />
      <input
        readOnly
        className={`${inputClass} text-[11px] text-dim`}
        value={asset.downloadURL}
        onFocus={(e) => e.target.select()}
      />
      <div className="flex justify-between gap-2">
        <button type="button" className={btnGhost} onClick={saveAlt} disabled={busy}>
          Guardar alt
        </button>
        <button type="button" className={btnDanger} onClick={remove} disabled={busy}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export function MediaManager({
  initialMedia,
  storageReady,
}: {
  initialMedia: MediaAsset[];
  storageReady: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // Subida directa del navegador a Vercel Blob (sin límite de 4.5 MB).
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/media/blob-token",
      });
      // Registramos el medio en Firestore con la URL pública del blob.
      await adminApi("/api/admin/media", {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          storagePath: blob.pathname,
          downloadURL: blob.url,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          alt: "",
        }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Medios</h1>
          <p className="mt-1 text-[14px] text-dim">
            Imágenes del sitio. Copia la URL para usarla en páginas y productos.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
            disabled={!storageReady || uploading}
          />
          <button
            type="button"
            className={btnPrimary}
            onClick={() => fileRef.current?.click()}
            disabled={!storageReady || uploading}
          >
            {uploading ? "Subiendo…" : "Subir imagen"}
          </button>
        </div>
      </div>

      {!storageReady && (
        <Banner kind="info">
          La subida de imágenes usa Vercel Blob. Falta configurar la variable{" "}
          <code>BLOB_READ_WRITE_TOKEN</code> (crea un store Blob en el panel de Vercel). Mientras
          tanto, puedes referenciar imágenes existentes por su ruta (ej. <code>/assets/team.jpg</code>).
        </Banner>
      )}
      {error && <Banner>{error}</Banner>}

      {initialMedia.length === 0 ? (
        <div className={`${cardClass} text-center text-[14px] text-dim`}>
          Aún no hay imágenes subidas.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {initialMedia.map((asset) => (
            <MediaCard key={asset.id} asset={asset} onChanged={() => router.refresh()} />
          ))}
        </div>
      )}
    </div>
  );
}
