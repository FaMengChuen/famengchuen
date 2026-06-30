"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin/client";
import type { AdminInvite, AdminUser } from "@/lib/cms/types";
import { Banner, Field, btnDanger, btnGhost, btnPrimary, cardClass, inputClass, labelClass } from "./ui";

type UsersResponse = {
  users: AdminUser[];
  invites: AdminInvite[];
  ownerEmails: string[];
};

export function UsersManager() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminApi<UsersResponse>("/api/admin/users");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await adminApi<UsersResponse>("/api/admin/users");
        if (active) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "No se pudo cargar usuarios.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInviting(true);
    try {
      await adminApi("/api/admin/users", { method: "POST", body: JSON.stringify({ email }) });
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo invitar.");
    } finally {
      setInviting(false);
    }
  }

  async function setStatus(
    target: { uid?: string; email?: string },
    status: "active" | "revoked",
  ) {
    setError(null);
    try {
      await adminApi("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ ...target, status }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    }
  }

  const owners = data?.ownerEmails ?? [];
  const admins = (data?.users ?? []).filter(
    (u) => !owners.includes(u.email.toLowerCase()),
  );
  const pendingInvites = (data?.invites ?? []).filter(
    (inv) =>
      inv.status === "pending" &&
      !owners.includes(inv.email.toLowerCase()) &&
      !admins.some((u) => u.email.toLowerCase() === inv.email.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Usuarios</h1>
        <p className="mt-1 text-[14px] text-dim">
          Invita administradores por email. Cuando inicien sesión con Google recibirán el acceso.
        </p>
      </div>

      {error && <Banner>{error}</Banner>}

      <form onSubmit={invite} className={`${cardClass} flex flex-wrap items-end gap-3`}>
        <div className="min-w-[240px] flex-1">
          <Field label="Invitar administrador (email)">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="persona@gmail.com"
              required
            />
          </Field>
        </div>
        <button type="submit" className={btnPrimary} disabled={inviting}>
          {inviting ? "Invitando…" : "Invitar"}
        </button>
      </form>

      {loading ? (
        <div className={`${cardClass} text-center text-[14px] text-dim`}>Cargando…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Owners */}
          <section>
            <h2 className={labelClass}>Owners (configurados por entorno)</h2>
            <div className="mt-2 flex flex-col gap-2">
              {owners.length === 0 && (
                <Banner kind="info">
                  No hay owners configurados. Define <code>FIREBASE_OWNER_EMAILS</code> en el entorno.
                </Banner>
              )}
              {owners.map((ownerEmail) => (
                <div
                  key={ownerEmail}
                  className={`${cardClass} flex items-center justify-between gap-3 py-3`}
                >
                  <span className="text-[14px] text-cream">{ownerEmail}</span>
                  <span className="rounded-[2px] bg-gold/15 px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.1em] text-gold">
                    owner
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Admins */}
          <section>
            <h2 className={labelClass}>Administradores</h2>
            <div className="mt-2 flex flex-col gap-2">
              {admins.length === 0 && (
                <div className={`${cardClass} text-[13px] text-dim`}>Sin administradores aún.</div>
              )}
              {admins.map((user) => (
                <div
                  key={user.uid}
                  className={`${cardClass} flex flex-wrap items-center justify-between gap-3 py-3`}
                >
                  <div>
                    <div className="text-[14px] text-cream">{user.displayName || user.email}</div>
                    <div className="text-[12px] text-dim">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-[2px] px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.1em] ${
                        user.status === "active" ? "bg-whatsapp/15 text-whatsapp" : "bg-line text-dim"
                      }`}
                    >
                      {user.status}
                    </span>
                    {user.status === "active" ? (
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => setStatus({ uid: user.uid, email: user.email }, "revoked")}
                      >
                        Revocar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() => setStatus({ uid: user.uid, email: user.email }, "active")}
                      >
                        Reactivar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Invitaciones pendientes */}
          {pendingInvites.length > 0 && (
            <section>
              <h2 className={labelClass}>Invitaciones pendientes</h2>
              <div className="mt-2 flex flex-col gap-2">
                {pendingInvites.map((inv) => (
                  <div
                    key={inv.email}
                    className={`${cardClass} flex flex-wrap items-center justify-between gap-3 py-3`}
                  >
                    <div>
                      <div className="text-[14px] text-cream">{inv.email}</div>
                      <div className="text-[12px] text-dim">Invitado por {inv.invitedBy}</div>
                    </div>
                    <button
                      type="button"
                      className={btnDanger}
                      onClick={() => setStatus({ email: inv.email }, "revoked")}
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
