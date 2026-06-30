"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { ImageRef } from "@/lib/cms/types";

/**
 * Fondo del hero con parallax: la foto se desplaza ~10% al hacer scroll dentro
 * del hero (equivalente al `yPercent:10` con scrub del prototipo). Tiene altura
 * extra (top:-6% / 112%) para que el desplazamiento no descubra bordes.
 */
export function HeroBackground({
  image = {
    src: "/assets/comunidad.jpg",
    alt: "Equipo Fa Meng Chuen en saludo marcial",
    position: "center 20%",
  },
}: {
  image?: ImageRef;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 z-0">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[6%] h-[112%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
          style={{ objectPosition: image.position ?? "center 20%" }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg,#0a0a0b 30%,rgba(10,10,11,.78) 55%,rgba(10,10,11,.35) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top,#0a0a0b 4%,transparent 38%)" }}
      />
    </div>
  );
}
