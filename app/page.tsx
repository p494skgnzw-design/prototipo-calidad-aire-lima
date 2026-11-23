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
            Red piloto · {site.city}
          </p>
          <h1 className="mt-3 text-4xl tracking-tight text-balance text-pacific sm:text-5xl">
            El aire de Lima, entre el mar y los cerros
          </h1>
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            {site.name} arma una red modesta para ver cómo cambian las partículas y los gases
            desde el Callao hasta Ate: estaciones fijas en distritos distintos y un dron que sube y
            baja sobre ese gradiente.
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
            <h2 className="text-3xl tracking-tight text-pacific">Para qué existe el grupo</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Lima respira una capa de aire húmedo que entra del Pacífico y, tierra adentro, se
              mezcla con el tráfico y el polvo de los distritos del este y del norte. Queremos
              describir ese contraste con mediciones propias, no con un tablero genérico: dónde
              está cada estación, a qué altura vuela el dron y qué tan fresca es la última lectura.
            </p>
            <p className="mt-3 text-pretty text-muted-foreground">
              Esta web es el prototipo de ese observatorio. Los números se simulan en el servidor
              para poder diseñar la red, el mapa y la ingesta antes de tener instrumentos en la
              azotea. Cuando llegue un sensor real, su lectura reemplaza a la simulada.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["8", "estaciones fijas en Lima Metropolitana"],
              ["1", "dron de perfil, circuito costa–este"],
              ["6", "variables en cada punto"],
              ["4 s", "entre cada actualización del mapa"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-border bg-card px-4 py-4">
                <dt className="font-heading text-3xl text-pacific">{value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-3xl tracking-tight text-pacific">Tres líneas</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {lines.map((line) => (
              <article key={line.id} className="border-t-2 border-copper pt-4">
                <p className="font-mono text-xs text-copper">{line.numeral}</p>
                <h3 className="mt-2 text-2xl text-pacific">
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
          <h2 className="text-3xl tracking-tight text-pacific">Qué se mide</h2>
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
          <h2 className="text-3xl tracking-tight text-pacific">Dónde está la red</h2>
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
