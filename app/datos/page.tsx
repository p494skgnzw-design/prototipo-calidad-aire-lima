import type { Metadata } from "next";
import { DatosView } from "@/components/datos-view";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datos en vivo",
  description: `Mapa de estaciones y del dron de ${site.name}. ${site.disclaimer}.`,
};

export default function DatosPage() {
  return (
    <>
      <div className="border-b border-white/15 bg-background px-4 py-2.5 text-sm text-neutral-200">
        <p className="mx-auto max-w-6xl">
          <strong>{site.disclaimer}</strong>
          <span className="hidden sm:inline">
            {" "}
            — lecturas generadas en el servidor, con variación diurna. No usar como dato oficial.
          </span>
        </p>
      </div>
      <DatosView />
    </>
  );
}
