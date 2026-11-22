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
      <div className="border-b border-[#e4d2a8] bg-[#f8f1df] px-4 py-2.5 text-sm text-[#5c4314]">
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
