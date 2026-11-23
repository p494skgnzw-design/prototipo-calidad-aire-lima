import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { publications } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Publicaciones",
  description: `Fichas de ejemplo para las publicaciones de ${site.name}.`,
};

export default function PublicacionesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bibliografía"
        title="Publicaciones"
        lede="Todavía no hay artículos del grupo. Las fichas de abajo muestran el formato —título, autores, medio, año y DOI— para reemplazarlas cuando existan. Los DOI usan el prefijo 10.0000 y no resuelven a un trabajo real."
      />
      <ul className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6">
        {publications.map((item) => (
          <li key={item.doi} className="rounded-xl border border-border bg-card px-5 py-5">
            <p className="text-xs font-semibold tracking-wide text-copper uppercase">
              Ficha de ejemplo · {item.year}
            </p>
            <h2 className="mt-2 text-3xl text-balance text-pacific sm:text-4xl">{item.title}</h2>
            <p className="mt-2 text-sm">{item.authors}</p>
            <p className="text-sm text-muted-foreground">
              {item.venue}, {item.year}
            </p>
            <p className="mt-3 font-mono text-sm">
              <span className="text-muted-foreground">DOI </span>
              {item.doi}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
