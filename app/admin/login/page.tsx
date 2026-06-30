"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  getFirebaseClientAuth,
  getGoogleProvider,
  missingClientFirebaseVars,
} from "@/lib/firebase/client";
import { adminApi } from "@/lib/admin/client";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing = missingClientFirebaseVars();

  async function handleGoogleLogin() {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setError("Firebase no está configurado en el cliente.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, getGoogleProvider());
      const idToken = await result.user.getIdToken();
      await adminApi("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      router.replace(next);
      router.refresh();
    } catch (err) {
      // Si el usuario no tiene permisos, cerramos su sesión Google local.
      await signOut(auth).catch(() => undefined);
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      setError(
        message.includes("popup-closed")
          ? "Cancelaste el inicio de sesión."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-base px-5">
      <div className="w-full max-w-[420px] rounded-[4px] border border-line bg-surface p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <Image
            src="/assets/logo.png"
            alt="Fa Meng Chuen"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
          <h1 className="mt-4 font-display text-2xl uppercase tracking-[0.04em] text-cream">
            Panel de administración
          </h1>
          <p className="mt-2 text-[14px] text-dim">
            Acceso solo para administradores de Fa Meng Chuen.
          </p>
        </div>

        {missing.length > 0 ? (
          <div className="rounded-[3px] border border-red/40 bg-red/10 p-4 text-[13px] text-cream-2">
            Faltan variables de entorno de Firebase:
            <ul className="mt-2 list-disc pl-5 text-dim">
              {missing.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-[3px] border border-line-14 bg-base px-5 py-3.5 font-label text-[15px] uppercase tracking-[0.04em] text-cream transition hover:border-gold hover:bg-[rgba(227,178,60,.08)] disabled:opacity-60"
          >
            <GoogleGlyph />
            {loading ? "Ingresando…" : "Continuar con Google"}
          </button>
        )}

        {error && (
          <p className="mt-4 rounded-[3px] border border-red/40 bg-red/10 px-4 py-3 text-[13px] text-cream-2">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.3-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 41 44 36 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-base" />}>
      <LoginInner />
    </Suspense>
  );
}
