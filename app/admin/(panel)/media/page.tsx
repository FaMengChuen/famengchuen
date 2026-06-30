import { MediaManager } from "@/components/admin/MediaManager";
import { getAdminMedia } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await getAdminMedia();
  const storageReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  return <MediaManager initialMedia={media} storageReady={storageReady} />;
}
