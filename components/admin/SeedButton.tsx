"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/client";
import { btnGhost } from "./ui";

export function SeedButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function seed() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await adminApi<{ message: string }>("/api/admin/seed", { method: "POST" });
      setMessage(res.message);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo inicializar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={btnGhost} onClick={seed} disabled={busy}>
        {busy ? "Inicializando…" : "Inicializar contenido base"}
      </button>
      {message && <span className="text-[13px] text-dim">{message}</span>}
    </div>
  );
}
