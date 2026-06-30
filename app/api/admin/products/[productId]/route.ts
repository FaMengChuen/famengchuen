import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS } from "@/lib/cms/repository";
import { productInputSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const { productId } = await context.params;
    const input = productInputSchema.parse(await request.json());

    await db.collection(COLLECTIONS.products).doc(productId).set(
      {
        ...input,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await writeAuditLog(actor, "product.update", `products/${productId}`, { title: input.title });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const { productId } = await context.params;
    await db.collection(COLLECTIONS.products).doc(productId).set(
      {
        active: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await writeAuditLog(actor, "product.deactivate", `products/${productId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
