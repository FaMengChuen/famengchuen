import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { getAdminPage } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ pageId: string }>;
};

export default async function EditPage({ params }: Props) {
  const { pageId } = await params;
  const data = await getAdminPage(pageId);
  if (!data) {
    notFound();
  }

  return <PageEditor initialPage={data.page} initialSections={data.sections} />;
}
