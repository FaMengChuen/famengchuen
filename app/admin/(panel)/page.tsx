import Link from "next/link";
import { SeedButton } from "@/components/admin/SeedButton";
import { getAdminMedia, getAdminPages, getAdminProducts } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/pages", title: "Páginas", desc: "Edita la home, crea páginas y ordena secciones." },
  { href: "/admin/products", title: "Productos", desc: "Administra la tienda y los CTA a WhatsApp." },
  { href: "/admin/media", title: "Medios", desc: "Sube y administra imágenes del sitio." },
  { href: "/admin/users", title: "Usuarios", desc: "Invita administradores y gestiona accesos." },
];

export default async function AdminDashboard() {
  const [pages, products, media] = await Promise.all([
    getAdminPages(),
    getAdminProducts(),
    getAdminMedia(),
  ]);
  const hasStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  const stats = [
    { label: "Páginas", value: pages.length },
    { label: "Productos", value: products.length },
    { label: "Imágenes", value: media.length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="m-0 font-display text-3xl uppercase tracking-[0.03em]">Panel</h1>
        <p className="mt-1 text-[14px] text-dim">
          Administra el contenido del sitio. Los cambios se publican al guardar.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[4px] border border-line bg-surface p-5">
            <div className="font-display text-4xl text-gold">{s.value}</div>
            <div className="mt-1 font-label text-[12px] uppercase tracking-[0.12em] text-dim">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[4px] border border-line bg-surface p-5">
        <div className="font-label text-[12px] uppercase tracking-[0.12em] text-dim">
          Contenido inicial
        </div>
        <p className="mb-3 mt-1 text-[13.5px] leading-[1.6] text-dim">
          Copia el contenido actual de la web a Firestore para poder editarlo. Es seguro ejecutarlo
          varias veces: solo agrega lo que falta.
        </p>
        <SeedButton />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-[4px] border border-line bg-surface p-5 transition hover:border-gold"
          >
            <div className="font-display text-xl uppercase tracking-[0.02em] text-cream group-hover:text-gold">
              {card.title}
            </div>
            <p className="mt-2 text-[14px] leading-[1.5] text-dim">{card.desc}</p>
          </Link>
        ))}
      </div>

      {!hasStorage && (
        <div className="rounded-[4px] border border-gold/40 bg-gold/10 p-5 text-[13.5px] leading-[1.6] text-cream-2">
          <strong className="text-gold">Subida de imágenes pendiente de configurar.</strong> Usa
          Vercel Blob: crea un store Blob en el panel de Vercel y añade la variable{" "}
          <code className="text-gold">BLOB_READ_WRITE_TOKEN</code>. Mientras tanto puedes
          referenciar imágenes ya existentes por su ruta (por ejemplo{" "}
          <code className="text-gold">/assets/team.jpg</code>).
        </div>
      )}
    </div>
  );
}
