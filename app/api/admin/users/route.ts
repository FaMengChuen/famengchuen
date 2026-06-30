import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import {
  adminAuthErrorResponse,
  getOwnerEmails,
  inviteDocId,
  requireAdminUser,
} from "@/lib/admin/auth";
import { COLLECTIONS, serializeFirestoreValue } from "@/lib/cms/repository";
import type { AdminInvite, AdminUser } from "@/lib/cms/types";
import { inviteInputSchema, userPatchSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const [usersSnapshot, invitesSnapshot] = await Promise.all([
      db.collection(COLLECTIONS.users).orderBy("email", "asc").get(),
      db.collection(COLLECTIONS.adminInvites).orderBy("createdAt", "desc").get(),
    ]);

    const users = usersSnapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...(serializeFirestoreValue(doc.data()) as Record<string, unknown>),
        }) as AdminUser,
    );
    const invites = invitesSnapshot.docs.map(
      (doc) => serializeFirestoreValue(doc.data()) as AdminInvite,
    );

    return NextResponse.json({ users, invites, ownerEmails: getOwnerEmails() });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const input = inviteInputSchema.parse(await request.json());
    if (getOwnerEmails().includes(input.email)) {
      return NextResponse.json({ error: "Ese email ya es owner por configuración." }, { status: 400 });
    }

    await db.collection(COLLECTIONS.adminInvites).doc(inviteDocId(input.email)).set(
      {
        email: input.email,
        role: "admin",
        invitedBy: actor.email,
        status: "pending",
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    const existingUsers = await db.collection(COLLECTIONS.users).where("email", "==", input.email).limit(1).get();
    if (!existingUsers.empty) {
      await existingUsers.docs[0].ref.set(
        {
          role: "admin",
          status: "active",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    await writeAuditLog(actor, "user.invite", `adminInvites/${inviteDocId(input.email)}`, {
      email: input.email,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const input = userPatchSchema.parse(await request.json());
    if (!input.uid && !input.email) {
      return NextResponse.json({ error: "Debes enviar uid o email." }, { status: 400 });
    }

    if (input.email && getOwnerEmails().includes(input.email)) {
      return NextResponse.json({ error: "No se puede revocar un owner configurado por env." }, { status: 400 });
    }

    if (input.uid) {
      const userRef = db.collection(COLLECTIONS.users).doc(input.uid);
      const userDoc = await userRef.get();
      const user = userDoc.data() as AdminUser | undefined;

      if (user?.email && getOwnerEmails().includes(user.email)) {
        return NextResponse.json({ error: "No se puede revocar un owner configurado por env." }, { status: 400 });
      }

      await userRef.set(
        {
          status: input.status,
          role: input.status === "active" ? "admin" : user?.role ?? "admin",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await writeAuditLog(actor, "user.status", `users/${input.uid}`, { status: input.status });
    }

    if (input.email) {
      await db.collection(COLLECTIONS.adminInvites).doc(inviteDocId(input.email)).set(
        {
          email: input.email,
          role: "admin",
          status: input.status === "active" ? "pending" : "revoked",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await writeAuditLog(actor, "invite.status", `adminInvites/${inviteDocId(input.email)}`, {
        status: input.status,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
