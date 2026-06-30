import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (y sus deps como jwks-rsa/jose) no deben empaquetarse: se
  // cargan como módulo de Node en el servidor. Evita errores de bundling.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      // Imágenes subidas a Vercel Blob (almacenamiento de medios).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
