"use client";

import { createContext, useContext } from "react";

/**
 * Cuando es `true`, los componentes con animación (Reveal) se muestran
 * estáticos y visibles de inmediato. Se usa en la vista previa del panel
 * para que el contenido editado se vea sin depender del scroll ni de la
 * secuencia de intro.
 */
const PreviewModeContext = createContext(false);

export function PreviewModeProvider({ children }: { children: React.ReactNode }) {
  return <PreviewModeContext.Provider value={true}>{children}</PreviewModeContext.Provider>;
}

export function usePreviewMode() {
  return useContext(PreviewModeContext);
}
