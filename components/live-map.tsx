"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { AQI_CATEGORIES, OFFLINE_COLOR, colorForPm25 } from "@/lib/aqi";
import { formatNum } from "@/lib/format";
import type { LiveSnapshot } from "@/lib/types";

type Props = {
  snapshot: LiveSnapshot;
  selectedId: string | null;
  follow: boolean;
  onSelect: (id: string) => void;
};

type LeafletStatic = typeof import("leaflet");

function resolveLeaflet(loaded: LeafletStatic): LeafletStatic {
  const withDefault = loaded as LeafletStatic & { default?: LeafletStatic };
  return typeof withDefault.default?.map === "function" ? withDefault.default : loaded;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function LiveMap({ snapshot, selectedId, follow, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layersRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<LeafletStatic | null>(null);
  const selectRef = useRef(onSelect);
  const fittedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let alive = true;
    const container = containerRef.current;
    if (!container) return;

    void (async () => {
      const leaflet = await import("leaflet");
      if (!alive || !containerRef.current) return;
      const L = resolveLeaflet(leaflet);
      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      map.attributionControl.setPrefix("");
      L.control.zoom({ zoomInTitle: "Acercar", zoomOutTitle: "Alejar" }).addTo(map);
      L.control.scale({ imperial: false, metric: true }).addTo(map);
      leafletRef.current = L;
      mapRef.current = map;
      layersRef.current = L.layerGroup().addTo(map);
      map.invalidateSize();
      setMapReady(true);
    })();

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(container);

    return () => {
      alive = false;
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = null;
      leafletRef.current = null;
      fittedRef.current = false;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const group = layersRef.current;
    if (!mapReady || !L || !map || !group) return;
    paintMap({
      L,
      map,
      group,
      snapshot,
      selectedId,
      follow,
      fitted: fittedRef,
      onSelect: (id) => selectRef.current(id),
    });
  }, [mapReady, snapshot, selectedId, follow]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Mapa de estaciones y del dron en Lima"
    />
  );
}

const DRONE_SVG = `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 1.5 21 21 12 16.5 3 21 12 1.5Z" fill="#0E2A33" stroke="#F4E7DB" stroke-width="1.2"/></svg>`;

function paintMap({
  L,
  map,
  group,
  snapshot,
  selectedId,
  follow,
  fitted,
  onSelect,
}: {
  L: LeafletStatic;
  map: LeafletMap;
  group: LayerGroup;
  snapshot: LiveSnapshot;
  selectedId: string | null;
  follow: boolean;
  fitted: { current: boolean };
  onSelect: (id: string) => void;
}) {
  group.clearLayers();

  const route = snapshot.drone.route.map((point) => [point.lat, point.lon] as [number, number]);
  L.polyline(route, {
    color: "#0E2A33",
    weight: 2,
    opacity: 0.45,
    dashArray: "6 8",
  }).addTo(group);

  const trail = snapshot.drone.trail;
  for (let index = 1; index < trail.length; index += 1) {
    const previous = trail[index - 1];
    const current = trail[index];
    L.polyline(
      [
        [previous.lat, previous.lon],
        [current.lat, current.lon],
      ],
      { color: colorForPm25(previous.pm25), weight: 5, opacity: 0.92 },
    ).addTo(group);
  }

  for (const station of snapshot.stations) {
    const color = station.online ? (station.aqi?.color ?? OFFLINE_COLOR) : OFFLINE_COLOR;
    const selected = selectedId === station.id;
    const icon = L.divIcon({
      className: "gia-divicon",
      html: `<div class="gia-station${selected ? " is-selected" : ""}${station.online ? "" : " is-offline"}" style="--c:${color}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    const pm = station.reading ? `${formatNum(station.reading.pm25)} µg/m³ PM2.5` : "sin lectura";
    const status = station.online ? (station.aqi?.shortLabel ?? "") : "Sin reporte";
    const marker = L.marker([station.lat, station.lon], { icon, keyboard: true });
    marker.bindTooltip(`${escapeHtml(station.name)} · ${escapeHtml(status)} · ${escapeHtml(pm)}`, {
      direction: "top",
      offset: [0, -8],
    });
    marker.on("click", () => onSelect(station.id));
    marker.addTo(group);
  }

  const drone = snapshot.drone;
  const droneIcon = L.divIcon({
    className: "gia-divicon",
    html: `<div class="gia-drone" style="transform:rotate(${drone.heading}deg)">${DRONE_SVG}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  const droneMarker = L.marker([drone.lat, drone.lon], { icon: droneIcon, zIndexOffset: 800 });
  const dronePm = drone.reading ? formatNum(drone.reading.pm25) : "—";
  droneMarker.bindTooltip(
    `${escapeHtml(drone.name)} · ${drone.altitude} m · PM2.5 ${escapeHtml(dronePm)} µg/m³`,
    { direction: "top", offset: [0, -12] },
  );
  droneMarker.on("click", () => onSelect("drone"));
  droneMarker.addTo(group);

  if (!fitted.current) {
    const bounds = L.latLngBounds(snapshot.stations.map((station) => [station.lat, station.lon]));
    bounds.extend([drone.lat, drone.lon]);
    map.fitBounds(bounds, { padding: [28, 28] });
    fitted.current = true;
  } else if (follow) {
    map.panTo([drone.lat, drone.lon], { animate: true, duration: 0.6 });
  }
}

export function MapLegend({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {AQI_CATEGORIES.map((category) => (
          <li key={category.id} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: category.color }} />
            {category.shortLabel}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#8B979C]" />
          Sin reporte
        </li>
      </ul>
    );
  }

  return (
    <div className="pointer-events-none max-w-[13.5rem] rounded-lg border border-border bg-card/95 p-2.5 text-[11px] shadow-sm backdrop-blur-sm">
      <p className="font-semibold tracking-wide text-pacific uppercase">Índice orientativo</p>
      <ul className="mt-1.5 space-y-1">
        {AQI_CATEGORIES.map((category) => (
          <li key={category.id} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: category.color }} />
            <span>{category.shortLabel}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-[#8B979C]" />
          <span>Sin reporte</span>
        </li>
      </ul>
      <p className="mt-2 text-muted-foreground">
        El trayecto del dron usa la misma escala, continua, según PM2.5. La línea punteada es la ruta completa.
      </p>
    </div>
  );
}
