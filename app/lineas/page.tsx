import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { lines, parameters } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Líneas de investigación",
  description: `Drones, sensores y calidad del aire urbano en la red piloto de ${site.shortName}.`,
};

export default function LineasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Investigación"
        title="Líneas de investigación"
        lede="Tres preguntas concretas para Lima Metropolitana. El mapa en vivo es el banco de prueba de las tres: no sustituye una campaña ya hecha."
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        {lines.map((line) => (
          <article key={line.id} id={line.id} className="scroll-mt-28 border-t-2 border-copper pt-6">
            <p className="font-mono text-xs text-copper">{line.numeral}</p>
            <h2 className="mt-2 text-3xl text-pacific">{line.title}</h2>
            <p className="mt-4 max-w-3xl text-pretty text-muted-foreground">{line.body}</p>
          </article>
        ))}
        <section>
          <h2 className="text-2xl text-pacific">Variables de la red</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {parameters.map((item) => (
              <li key={item.name} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="font-medium">
                  {item.name}{" "}
                  <span className="font-mono text-xs text-muted-foreground">{item.unit}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
