import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS } from "@/lib/cms/repository";
import { mediaUpdateSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ mediaId: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const { mediaId } = await context.params;
    const input = mediaUpdateSchema.parse(await request.json());

    await db.collection(COLLECTIONS.media).doc(mediaId).set(
      {
        alt: input.alt,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await writeAuditLog(actor, "media.update", `media/${mediaId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
