"use client";

import { motion } from "motion/react";
import { useIntro } from "./IntroProvider";
import { usePreviewMode } from "./PreviewMode";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Tag = "div" | "section" | "article" | "figure" | "p" | "h1" | "h2" | "li";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Etiqueta semántica a renderizar (div por defecto). */
  as?: Tag;
  /**
   * `intro`: entra cuando el loader se levanta (hero). Sin `intro`: entra al
   * hacer scroll y aparecer en viewport (equivalente al ScrollTrigger top 86%).
   */
  intro?: boolean;
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  as = "div",
  intro = false,
  delay = 0,
  y = 36,
}: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const preview = usePreviewMode();
  const { introDone } = useIntro();

  // Render estático cuando el usuario prefiere menos movimiento o cuando se
  // renderiza dentro de la vista previa del panel (sin animación).
  if (reduce || preview) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  const transition = { duration: 0.8, ease: EASE, delay };

  if (intro) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y: 32 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={transition}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={transition}
    >
      {children}
    </MotionTag>
  );
}
