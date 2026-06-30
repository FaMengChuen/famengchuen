import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Genera el token para subir un archivo a Vercel Blob directamente desde el
 * navegador (sin pasar por la función serverless, así no aplica el límite de
 * 4.5 MB). Solo administradores autenticados pueden obtener el token.
 *
 * El documento del medio en Firestore lo registra el cliente al terminar la
 * subida (POST /api/admin/media), por eso onUploadCompleted es no-op.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => {
        await requireAdminUser();
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // El registro en Firestore lo hace el cliente tras completar la subida.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
