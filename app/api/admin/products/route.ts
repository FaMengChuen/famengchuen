import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS, getAdminProducts } from "@/lib/cms/repository";
import { normalizeId, productInputSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const products = await getAdminProducts();
    return NextResponse.json({ products });
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

    const input = productInputSchema.parse(await request.json());
    const productId = normalizeId(input.title);
    const existing = await db.collection(COLLECTIONS.products).doc(productId).get();
    if (existing.exists) {
      return NextResponse.json({ error: "Ya existe un producto con ese nombre." }, { status: 409 });
    }

    const product = {
      ...input,
      updatedAt: serverTimestamp(),
    };

    await db.collection(COLLECTIONS.products).doc(productId).set(product);
    await writeAuditLog(actor, "product.create", `products/${productId}`, { title: input.title });

    return NextResponse.json({ product: { id: productId, ...product } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
