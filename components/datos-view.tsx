"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LiveMap, MapLegend } from "@/components/live-map";
import { ReadingCharts } from "@/components/reading-charts";
import { useLiveSnapshot } from "@/components/use-live";
import { Button } from "@/components/ui/button";
import { formatNum, formatTime } from "@/lib/format";
import { staticSite } from "@/lib/runtime";
import { buildSeries } from "@/lib/simulator";
import { site } from "@/lib/site";
import type { SeriesPayload, StationSnapshot } from "@/lib/types";

export function DatosView() {
  const { snapshot, status } = useLiveSnapshot();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [follow, setFollow] = useState(false);
  const [series, setSeries] = useState<SeriesPayload | null>(null);
  const [seriesError, setSeriesError] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const seriesBucket = snapshot ? Math.floor(snapshot.serverTime / 20000) : 0;
  const localSeries = useMemo(() => {
    if (!staticSite || !selectedId || seriesBucket === 0) return null;
    return buildSeries(selectedId, 3, seriesBucket * 20000);
  }, [selectedId, seriesBucket]);
  const shownSeries = staticSite ? localSeries : series;

  useEffect(() => {
    if (staticSite || !selectedId || !snapshot) return;
    const controller = new AbortController();
    const requested = selectedId;
    fetch(`/api/series?id=${encodeURIComponent(requested)}&hours=3`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("serie");
        return response.json() as Promise<SeriesPayload>;
      })
      .then((payload) => {
        if (payload.id !== requested && !(requested === "drone" && payload.id === "drone")) return;
        setSeries(payload);
        setSeriesError(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSeriesError(true);
      });
    return () => controller.abort();
  }, [selectedId, snapshot]);

  useEffect(() => {
    if (!selectedId || window.matchMedia("(min-width: 1024px)").matches) return;
    panelRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [selectedId]);

  if (!snapshot) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-lg text-pacific">
          {status === "reconnecting"
            ? "Conexión interrumpida. Reintentando…"
            : "Conectando con el simulador…"}
        </p>
        <div className="mt-6 h-[60vh] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const selectedStation =
    selectedId && selectedId !== "drone"
      ? snapshot.stations.find((station) => station.id === selectedId) ?? null
      : null;
  const droneSelected = selectedId === "drone";
  const statusLabel =
    status === "live" ? "En vivo" : status === "reconnecting" ? "Reconectando" : "Conectando";

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm">
            <span
              className={`size-2.5 rounded-full ${status === "live" ? "bg-[#2E9D4F]" : "bg-[#C6A317]"}`}
              aria-hidden
            />
            <span className="font-medium">{statusLabel}</span>
            <span className="text-muted-foreground">
              · {snapshot.stationsOnline} de {snapshot.stations.length} estaciones en línea
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Última actualización{" "}
            <time
              key={snapshot.serverTime}
              dateTime={new Date(snapshot.serverTime).toISOString()}
              className="tick-flash rounded px-1 font-mono text-foreground tabular-nums"
            >
              {formatTime(snapshot.serverTime)}
            </time>{" "}
            (hora de Lima)
          </p>
        </div>
        <Button
          type="button"
          variant={follow ? "default" : "outline"}
          className="h-9"
          onClick={() => setFollow((value) => !value)}
          aria-pressed={follow}
        >
          {follow ? "Siguiendo al dron" : "Centrar en el dron"}
        </Button>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_22.5rem]">
        <div className="relative h-[68vh] min-h-[420px] overflow-hidden rounded-xl border border-border bg-muted lg:sticky lg:top-24 lg:h-[calc(100vh-8.5rem)]">
          <LiveMap
            snapshot={snapshot}
            selectedId={selectedId}
            follow={follow}
            onSelect={(id) => {
              setSelectedId(id);
              if (id === "drone") setFollow(true);
            }}
          />
          <div className="absolute top-3 right-3 z-[500] max-w-[12rem] rounded-lg border border-white/15 bg-black/85 px-3 py-2 text-white shadow-sm">
            <p className="text-[10px] tracking-[0.14em] text-neutral-400 uppercase">Dron</p>
            <p className="font-mono text-lg tabular-nums">{snapshot.drone.altitude} m</p>
            <p className="text-xs text-neutral-300">
              PM2.5{" "}
              {snapshot.drone.reading ? formatNum(snapshot.drone.reading.pm25) : "—"} µg/m³ ·{" "}
              {snapshot.drone.segment}
            </p>
          </div>
          <div className="absolute bottom-8 left-3 z-[500] hidden md:block">
            <MapLegend />
          </div>
        </div>
        <div className="md:hidden">
          <MapLegend compact />
        </div>

        <aside className="flex flex-col gap-3 lg:max-h-[calc(100vh-8.5rem)]">
          <p className="text-sm text-muted-foreground">
            Pulse una estación o el dron. Las series cubren las últimas 3 horas.
          </p>
          <ul className="max-h-52 space-y-1.5 overflow-y-auto lg:max-h-44 lg:shrink-0">
            <li>
              <SelectRow
                title={snapshot.drone.name}
                subtitle={`${snapshot.drone.altitude} m · ${snapshot.drone.segment}`}
                value={snapshot.drone.reading ? formatNum(snapshot.drone.reading.pm25) : "—"}
                meta={snapshot.drone.aqi?.shortLabel ?? ""}
                color={snapshot.drone.aqi?.color ?? "#0E2A33"}
                online
                selected={droneSelected}
                onClick={() => setSelectedId("drone")}
              />
            </li>
            {snapshot.stations.map((station) => (
              <li key={station.id}>
                <SelectRow
                  title={station.name}
                  subtitle={station.district}
                  value={station.reading ? formatNum(station.reading.pm25) : "—"}
                  meta={station.online ? (station.aqi?.shortLabel ?? "") : "Sin reporte"}
                  color={station.online ? (station.aqi?.color ?? "#8B979C") : "#8B979C"}
                  online={station.online}
                  selected={selectedId === station.id}
                  onClick={() => setSelectedId(station.id)}
                />
              </li>
            ))}
          </ul>

          {selectedId ? (
            <div ref={panelRef} className="rounded-xl border border-border bg-card p-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              {droneSelected ? (
                <DetailHeader
                  title={snapshot.drone.name}
                  online
                  source={snapshot.drone.source}
                  category={snapshot.drone.aqi?.label ?? "Sin índice"}
                  color={snapshot.drone.aqi?.color ?? "#0E2A33"}
                  lastSeen={snapshot.drone.lastSeen}
                />
              ) : selectedStation ? (
                <DetailHeader
                  title={selectedStation.name}
                  online={selectedStation.online}
                  source={selectedStation.source}
                  category={selectedStation.aqi?.label ?? "Sin índice"}
                  color={selectedStation.online ? (selectedStation.aqi?.color ?? "#8B979C") : "#8B979C"}
                  lastSeen={selectedStation.lastSeen}
                />
              ) : null}

              {droneSelected && snapshot.drone.reading ? (
                <MetricGrid
                  reading={snapshot.drone.reading}
                  extra={[
                    ["Altitud", `${snapshot.drone.altitude} m`],
                    ["Velocidad", `${formatNum(snapshot.drone.speedMps, 0)} m/s`],
                  ]}
                />
              ) : null}
              {selectedStation?.reading ? <MetricGrid reading={selectedStation.reading} /> : null}

              {!droneSelected && selectedStation && !selectedStation.online ? (
                <p className="mt-2 text-sm text-destructive">
                  Sin reporte. La última lectura queda en la ficha; la serie muestra el hueco.
                </p>
              ) : null}

              <p className="mt-2 text-sm text-muted-foreground">
                {droneSelected
                  ? "El PM2.5 baja cuando el dron sube. La velocidad de este prototipo está acelerada para que el recorrido se vea."
                  : selectedStation?.note}
              </p>

              <div className="mt-4">
                {seriesError ? (
                  <p className="text-sm text-destructive">No se pudo cargar la serie. Se reintentará.</p>
                ) : shownSeries &&
                  shownSeries.id === (selectedId === "drone" ? "drone" : selectedId) ? (
                  <ReadingCharts series={shownSeries} />
                ) : (
                  <p className="text-sm text-muted-foreground">Cargando serie…</p>
                )}
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
              Ningún punto seleccionado. El panel muestra PM2.5, PM10, O3, NO2, temperatura y humedad.
            </p>
          )}
        </aside>
      </div>

      <details className="mt-6 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-pacific">Cómo leer estos datos</summary>
        <div className="mt-3 space-y-2 text-muted-foreground">
          <p>{site.disclaimer}. El reloj y los números cambian cada pocos segundos.</p>
          <p>
            El color de la estación resume PM2.5 y PM10 recientes. No es el ICA oficial de 24 horas ni un
            aviso a la población. Villa María del Triunfo deja de reportar durante unos segundos de cada
            ciclo, para probar el indicador de estación fuera de línea.
          </p>
          <p>
            Unidades: partículas y gases en µg/m³, temperatura en °C, humedad relativa en %. Hora de Lima
            (UTC−5).
          </p>
        </div>
      </details>
    </div>
  );
}

function SelectRow({
  title,
  subtitle,
  value,
  meta,
  color,
  online,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  value: string;
  meta: string;
  color: string;
  online: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left ${
        selected ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/30"
      } ${online ? "" : "opacity-80"}`}
    >
      <span className="size-3 shrink-0 rounded-full" style={{ background: color }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <span className="text-right">
        <span className="block font-mono text-sm tabular-nums">{value}</span>
        <span className="block text-[10px] text-muted-foreground">{meta}</span>
      </span>
    </button>
  );
}

function DetailHeader({
  title,
  online,
  source,
  category,
  color,
  lastSeen,
}: {
  title: string;
  online: boolean;
  source: StationSnapshot["source"];
  category: string;
  color: string;
  lastSeen: number | null;
}) {
  return (
    <div>
      <h2 className="font-sans text-lg font-semibold text-pacific">{title}</h2>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-full" style={{ background: color }} />
          {online ? category : "Sin reporte"}
        </span>
        <span className="text-muted-foreground">
          {source === "external" ? "Sensor externo" : "Simulado"}
        </span>
        {lastSeen ? (
          <span className="text-muted-foreground">Última lectura {formatTime(lastSeen)}</span>
        ) : null}
      </p>
    </div>
  );
}

function MetricGrid({
  reading,
  extra = [],
}: {
  reading: { pm25: number; pm10: number; o3: number; no2: number; temperature: number; humidity: number };
  extra?: [string, string][];
}) {
  const cells: [string, string][] = [
    ["PM2.5", `${formatNum(reading.pm25)} µg/m³`],
    ["PM10", `${formatNum(reading.pm10)} µg/m³`],
    ["O3", `${formatNum(reading.o3)} µg/m³`],
    ["NO2", `${formatNum(reading.no2)} µg/m³`],
    ["Temperatura", `${formatNum(reading.temperature)} °C`],
    ["Humedad", `${formatNum(reading.humidity, 0)} %`],
    ...extra,
  ];
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2">
      {cells.map(([label, value]) => (
        <div key={label} className="rounded-md bg-muted/70 px-2 py-1.5">
          <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</dt>
          <dd className="font-mono text-sm tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
