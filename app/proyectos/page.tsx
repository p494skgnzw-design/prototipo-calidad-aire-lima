import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Proyectos",
  description: `Trabajos en curso y siguientes pasos de ${site.name}.`,
};

export default function ProyectosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trabajo en curso"
        title="Proyectos"
        lede="Cuatro piezas. Las dos primeras se pueden recorrer en el mapa. La ingesta ya acepta lecturas reales. La comparación con un instrumento de referencia todavía no empieza."
      />
      <ol className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6">
        {projects.map((project, index) => (
          <li key={project.title} className="rounded-xl border border-border bg-card px-5 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-3xl text-pacific sm:text-4xl">
                <span className="mr-2 font-mono text-sm text-copper">0{index + 1}</span>
                {project.title}
              </h2>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                {project.status}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-muted-foreground">{project.summary}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto max-w-6xl px-4 pb-4 text-sm sm:px-6">
        <Link href="/datos" className="font-medium text-primary underline-offset-4 hover:underline">
          Abrir el mapa de la red piloto
        </Link>
      </p>
    </>
  );
}
