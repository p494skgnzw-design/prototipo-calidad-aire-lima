import Link from "next/link";
import { HeroFigure } from "@/components/hero-figure";
import { LiveStrip } from "@/components/live-strip";
import { Button } from "@/components/ui/button";
import { lines, parameters } from "@/lib/content";
import { STATIONS } from "@/lib/model";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Sistema de mediciones móvil · {site.city}
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-[0.9] text-balance text-pacific sm:text-7xl">
            Pronóstico del tiempo y calidad del aire
          </h1>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            En {site.name} hemos desarrollado un perfilador atmosférico para medir vientos, partículas finas y variables meteorologicas con sensores especializados montados en drones. Con esa información se modela la atmosféra 
            para obtener el pronóstico del tiempo y calidad del aire.            
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button asChild className="h-10 px-4">
              <Link href="/datos">Ver datos en vivo</Link>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/lineas">Líneas de investigación</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-neutral-400">{site.disclaimer}.</p>
        </div>
        <HeroFigure />
      </section>

      <LiveStrip />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-4xl text-pacific sm:text-5xl">Para qué existe el grupo</h2>
            <p className="mt-4 text-pretty text-muted-foreground">

              El desarrollo urbano e industrial requiere información meteorológica detallada y oportuna para adaptarse al medio y
              reducir los impactos al medio ambiente y a la salud de los habitantes. Uno de los mayores impactos es en la calidad del
              aire. Ante ello una meteorología digital detallada permite conocer cómo el viento transporta las partículas finas
              generadas en construcción, chimeneas, fundiciones, entre otros y que son inhaladas por las personas. El impacto de la
              deposición de estos contaminantes en las vías respiratorias es relevante para la salud ambiental y las políticas públicas
              (OMS, 2024)              
            </p>
            <p className="mt-3 text-pretty text-muted-foreground">
              Esta web es el prototipo de una meteorología digital. Los números se simulan en el servidor
              para poder diseñar la red, el mapa y la ingesta antes de tener instrumentos en la
              azotea. Cuando llegue un sensor real, su lectura reemplaza a la simulada.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[              
              ["6", "Perfiles atmosféricos, por día"],
              ["7", "variables por perfil"],
              ["20", "puntos de control en Lima Metropolitana"],
              ["30 min", "entre cada actualización del mapa"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-border bg-card px-4 py-4">
                <dt className="font-heading text-5xl text-pacific">{value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-4xl text-pacific sm:text-5xl">Tres líneas</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {lines.map((line) => (
              <article key={line.id} className="border-t-2 border-copper pt-4">
                <p className="font-mono text-xs text-copper">{line.numeral}</p>
                <h3 className="mt-2 text-3xl text-pacific">
                  <Link href={`/lineas#${line.id}`} className="hover:underline">
                    {line.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{line.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl text-pacific sm:text-5xl">Qué se mide</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="py-2 font-medium">Variable</th>
                <th className="py-2 font-medium">Unidad</th>
                <th className="py-2 font-medium">En la red</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((item) => (
                <tr key={item.name} className="border-t border-border">
                  <td className="py-2 font-medium">{item.name}</td>
                  <td className="py-2 font-mono text-xs">{item.unit}</td>
                  <td className="py-2 text-muted-foreground">{item.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-4xl text-pacific sm:text-5xl">Dónde está la red</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {STATIONS.map((station) => (
              <li key={station.id} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                <span className="font-medium">{station.name}</span>
                <span className="text-right text-muted-foreground">{station.district}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Coordenadas de lugares reconocibles de cada distrito. No son todavía sitios de
            instalación acordados.
          </p>
        </div>
      </section>
    </>
  );
}
