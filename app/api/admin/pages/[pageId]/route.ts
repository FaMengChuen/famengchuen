import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS, getAdminPage } from "@/lib/cms/repository";
import { pageWithSectionsUpdateSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ pageId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdminUser();
    const { pageId } = await context.params;
    const page = await getAdminPage(pageId);

    if (!page) {
      return NextResponse.json({ error: "Página no encontrada." }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const { pageId } = await context.params;
    const input = pageWithSectionsUpdateSchema.parse(await request.json());
    const slugMatch = await db.collection(COLLECTIONS.pages).where("slug", "==", input.page.slug).limit(2).get();
    const slugTaken = slugMatch.docs.some((doc) => doc.id !== pageId);
    if (slugTaken) {
      return NextResponse.json({ error: "Ya existe otra página con ese slug." }, { status: 409 });
    }

    const pageRef = db.collection(COLLECTIONS.pages).doc(pageId);
    const existingSections = await pageRef.collection("sections").get();
    const submittedSectionIds = new Set(input.sections.map((section) => section.id));
    const batch = db.batch();

    batch.set(pageRef, {
      ...input.page,
      id: undefined,
      navLabel: input.page.navLabel || input.page.title,
      seoTitle: input.page.seoTitle || input.page.title,
      seoDescription: input.page.seoDescription || "",
      updatedAt: serverTimestamp(),
    });

    input.sections.forEach((section) => {
      batch.set(pageRef.collection("sections").doc(section.id), {
        type: section.type,
        order: section.order,
        enabled: section.enabled,
        data: section.data,
        updatedAt: serverTimestamp(),
      });
    });

    existingSections.docs.forEach((sectionDoc) => {
      if (!submittedSectionIds.has(sectionDoc.id)) {
        batch.delete(sectionDoc.ref);
      }
    });

    await batch.commit();
    await writeAuditLog(actor, "page.update", `pages/${pageId}`, {
      slug: input.page.slug,
      sections: input.sections.length,
    });

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

    const { pageId } = await context.params;
    if (pageId === "home") {
      return NextResponse.json({ error: "La home no se puede ocultar." }, { status: 400 });
    }

    await db.collection(COLLECTIONS.pages).doc(pageId).set(
      {
        visible: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await writeAuditLog(actor, "page.hide", `pages/${pageId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
