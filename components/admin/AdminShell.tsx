"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { adminApi } from "@/lib/admin/client";
import type { AdminUser } from "@/lib/cms/types";

const NAV = [
  { href: "/admin", label: "Inicio", exact: true },
  { href: "/admin/pages", label: "Páginas" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/media", label: "Medios" },
  { href: "/admin/users", label: "Usuarios" },
];

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    setSigningOut(true);
    const auth = getFirebaseClientAuth();
    if (auth) {
      await signOut(auth).catch(() => undefined);
    }
    await adminApi("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-base text-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/assets/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-display text-[15px] uppercase tracking-[0.06em]">Admin · FMC</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[3px] px-3 py-1.5 font-label text-[13px] uppercase tracking-[0.06em] transition ${
                  isActive(item.href, item.exact)
                    ? "bg-red text-white"
                    : "text-sand hover:bg-surface hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden font-label text-[12px] uppercase tracking-[0.06em] text-dim hover:text-cream sm:inline"
            >
              Ver sitio ↗
            </Link>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-[13px] text-cream">{user.displayName || user.email}</div>
              <div className="font-label text-[10px] uppercase tracking-[0.16em] text-gold">
                {user.role}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              className="rounded-[3px] border border-line-14 px-3 py-1.5 font-label text-[12px] uppercase tracking-[0.06em] text-cream transition hover:border-red hover:text-red disabled:opacity-60"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-[1100px] px-5 pb-8 text-center font-label text-[11px] uppercase tracking-[0.08em] text-dim">
        Desarrollado por{" "}
        <a
          href="https://mathyusolutions.com/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold transition-colors hover:text-cream"
        >
          Mathyu&rsquo;s Solutions
        </a>
      </footer>
    </div>
  );
}
