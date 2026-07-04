import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS, getAdminSiteConfig } from "@/lib/cms/repository";
import { siteConfigUpdateSchema } from "@/lib/cms/validation";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const site = await getAdminSiteConfig();
    return NextResponse.json({ site });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const input = siteConfigUpdateSchema.parse(await request.json());

    // mergeFields reemplaza whatsappMessages completo (permite borrar claves)
    // sin tocar logo/navigation, que no se editan desde esta pantalla.
    await db
      .collection(COLLECTIONS.site)
      .doc("config")
      .set(
        { ...input, updatedAt: serverTimestamp() },
        {
          mergeFields: [
            "brandName",
            "brandEyebrow",
            "phone",
            "phoneDisplay",
            "links",
            "whatsappMessages",
            "footerText",
            "footerSignature",
            "updatedAt",
          ],
        },
      );
    await writeAuditLog(actor, "site.update", "site/config", { fields: Object.keys(input) });

    return NextResponse.json({ site: input });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos.", issues: error.issues }, { status: 400 });
    }

    return adminAuthErrorResponse(error);
  }
}
