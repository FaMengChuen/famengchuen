import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS, getAdminPages } from "@/lib/cms/repository";
import { normalizeId, pageInputSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const pages = await getAdminPages();
    return NextResponse.json({ pages });
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

    const input = pageInputSchema.parse(await request.json());
    const existing = await db.collection(COLLECTIONS.pages).where("slug", "==", input.slug).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Ya existe una página con ese slug." }, { status: 409 });
    }

    const pageId = input.slug === "home" ? "home" : normalizeId(input.slug);
    const page = {
      ...input,
      navLabel: input.navLabel || input.title,
      seoTitle: input.seoTitle || input.title,
      seoDescription: input.seoDescription || "",
      updatedAt: serverTimestamp(),
    };

    await db.collection(COLLECTIONS.pages).doc(pageId).set(page);
    await writeAuditLog(actor, "page.create", `pages/${pageId}`, { slug: page.slug });

    return NextResponse.json({ page: { id: pageId, ...page } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
