/**
 * Identidad pública del grupo.
 * Cambie `name` y `shortName` aquí: el resto del sitio los importa.
 */
export const site = {
  name: "Group of Environmental Engineers",
  shortName: "GREEN",
  city: "Lima, Perú",
  email: "contacto@green.com.pe",
  description:
    "Grupo de ingenieros ambientales que usan drones para sensar la atmosferá metro a metro, capturan particulas finas y las analizan en laboratorio, y modelan los vientos para estudiar a detalle la dinámica de la atmosféra y la calidad del aire en Perú",
  disclaimer: "Datos preliminares, sin validar",
  drone: {
    id: "gia-d1",
    name: "Dron perfilador GIA-D1",
  },
  simulation: {
    tickMs: 4000,
    droneSpeedMps: 65,
    tailMeters: 12000,
    historyHours: 3,
    externalHoldMs: 120_000,
    dropoutStationId: "vmt",
    dropoutCycleMs: 80_000,
    dropoutDurationMs: 22_000,
  },
  /** Área aceptada por POST /api/ingest. Cubre Lima Metropolitana con margen. */
  serviceArea: {
    latMin: -12.6,
    latMax: -11.4,
    lonMin: -77.6,
    lonMax: -76.4,
  },
} as const;

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/equipo", label: "Equipo" },
  { href: "/lineas", label: "Líneas" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/datos", label: "Datos en vivo" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function tickMs(): number {
  const raw = Number(process.env.SIM_INTERVAL_MS);
  if (Number.isFinite(raw) && raw >= 1000 && raw <= 60_000) return raw;
  return site.simulation.tickMs;
}
