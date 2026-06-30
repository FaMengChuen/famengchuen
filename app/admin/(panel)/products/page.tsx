import { ProductsManager } from "@/components/admin/ProductsManager";
import { getAdminProducts } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAdminProducts();
  return <ProductsManager initialProducts={products} />;
}
