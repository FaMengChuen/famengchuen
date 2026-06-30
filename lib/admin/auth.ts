import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "./constants";
import { COLLECTIONS } from "@/lib/cms/repository";
import type { AdminInvite, AdminRole, AdminUser } from "@/lib/cms/types";
import { getAdminAuth, getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function getOwnerEmails(): string[] {
  const raw =
    process.env.FIREBASE_OWNER_EMAILS ??
    process.env.ADMIN_OWNER_EMAILS ??
    process.env.NEXT_PUBLIC_ADMIN_OWNER_EMAILS ??
    "";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function inviteDocId(email: string): string {
  return encodeURIComponent(email.trim().toLowerCase());
}

function isRole(value: unknown): value is AdminRole {
  return value === "owner" || value === "admin";
}

function userFromClaims(claims: DecodedIdToken, role: AdminRole): AdminUser {
  return {
    uid: claims.uid,
    email: String(claims.email ?? "").toLowerCase(),
    displayName: typeof claims.name === "string" ? claims.name : undefined,
    photoURL: typeof claims.picture === "string" ? claims.picture : undefined,
    role,
    status: "active",
  };
}

async function resolveRole(uid: string, email: string): Promise<AdminRole | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (getOwnerEmails().includes(normalizedEmail)) {
    return "owner";
  }

  const db = getAdminDb();
  if (!db) {
    throw new AdminAuthError("Firebase Admin no está configurado.", 503);
  }

  const userDoc = await db.collection(COLLECTIONS.users).doc(uid).get();
  const user = userDoc.data();
  if (user?.status === "active" && isRole(user.role)) {
    return user.role;
  }

  const inviteDoc = await db.collection(COLLECTIONS.adminInvites).doc(inviteDocId(normalizedEmail)).get();
  const invite = inviteDoc.data() as AdminInvite | undefined;
  if (invite?.status !== "revoked" && invite?.role === "admin") {
    return "admin";
  }

  return null;
}

async function upsertAdminUser(claims: DecodedIdToken, role: AdminRole): Promise<AdminUser> {
  const db = getAdminDb();
  if (!db) {
    throw new AdminAuthError("Firebase Admin no está configurado.", 503);
  }

  const user = userFromClaims(claims, role);
  const userRef = db.collection(COLLECTIONS.users).doc(user.uid);
  const existing = await userRef.get();

  await userRef.set(
    {
      ...user,
      createdAt: existing.exists ? existing.data()?.createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (role === "admin") {
    const inviteRef = db.collection(COLLECTIONS.adminInvites).doc(inviteDocId(user.email));
    const inviteDoc = await inviteRef.get();
    if (inviteDoc.exists && inviteDoc.data()?.status !== "revoked") {
      await inviteRef.set(
        {
          status: "accepted",
          acceptedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  }

  return user;
}

export async function createAdminSession(idToken: string): Promise<{ sessionCookie: string; user: AdminUser }> {
  const auth = getAdminAuth();
  if (!auth) {
    throw new AdminAuthError("Firebase Admin no está configurado.", 503);
  }

  const claims = await auth.verifyIdToken(idToken);
  const email = String(claims.email ?? "").toLowerCase();
  if (!email) {
    throw new AdminAuthError("Tu cuenta Google no tiene un email verificable.", 403);
  }

  const role = await resolveRole(claims.uid, email);
  if (!role) {
    throw new AdminAuthError("Este usuario no tiene permisos de administración.", 403);
  }

  const [sessionCookie, user] = await Promise.all([
    auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS }),
    upsertAdminUser(claims, role),
  ]);

  return { sessionCookie, user };
}

export async function getOptionalAdminUser(): Promise<AdminUser | null> {
  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const claims = await auth.verifySessionCookie(sessionCookie, true);
    const email = String(claims.email ?? "").toLowerCase();
    const role = await resolveRole(claims.uid, email);
    if (!role) {
      return null;
    }

    return userFromClaims(claims, role);
  } catch {
    return null;
  }
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getOptionalAdminUser();
  if (!user) {
    throw new AdminAuthError("Sesión inválida o expirada.", 401);
  }

  return user;
}

export function adminAuthErrorResponse(error: unknown): NextResponse {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: "Error interno del panel admin." }, { status: 500 });
}
