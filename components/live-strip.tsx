"use client";

import Link from "next/link";
import { formatNum } from "@/lib/format";
import { useLiveSnapshot } from "@/components/use-live";

const WATCH = ["miraflores", "centro", "ate", "callao"];

export function LiveStrip() {
  const { snapshot, status } = useLiveSnapshot();
  const stations = WATCH.map((id) => snapshot?.stations.find((station) => station.id === id)).filter(
    (station) => station != null,
  );

  return (
    <section className="border-y border-border bg-card/80" aria-label="Lecturas recientes de la red piloto">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center">
        <div className="lg:w-44">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Red piloto</p>
          <p className="text-sm text-muted-foreground">
            {status === "live" ? "Actualización en vivo" : "Conectando el simulador…"}
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
          {stations.length === 0
            ? WATCH.map((id) => (
                <div key={id} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))
            : stations.map((station) => (
                <Link
                  key={station.id}
                  href="/datos"
                  className="rounded-lg border border-border bg-background px-3 py-2 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: station.online ? station.aqi?.color : "#8B979C" }}
                    />
                    {station.name}
                  </span>
                  <span className="mt-1 block font-mono text-lg tabular-nums text-pacific">
                    {station.online && station.reading
                      ? formatNum(station.reading.pm25)
                      : "—"}
                    <span className="ml-1 text-xs text-muted-foreground">µg/m³</span>
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
