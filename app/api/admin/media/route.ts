import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS, getAdminMedia } from "@/lib/cms/repository";
import { normalizeId, mediaInputSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const media = await getAdminMedia();
    return NextResponse.json({ media });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

/**
 * Registra en Firestore un medio ya subido a Vercel Blob desde el navegador.
 * El cliente envía la URL pública del blob, su ruta, tipo y tamaño.
 */
export async function POST(request: NextRequest) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const input = mediaInputSchema.parse(await request.json());
    const mediaId = `${normalizeId(input.name)}-${Date.now()}`;
    const media = {
      ...input,
      uploadedBy: actor.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await db.collection(COLLECTIONS.media).doc(mediaId).set(media);
    await writeAuditLog(actor, "media.create", `media/${mediaId}`, {
      storagePath: input.storagePath,
      contentType: input.contentType,
    });

    return NextResponse.json({ media: { id: mediaId, ...media } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
