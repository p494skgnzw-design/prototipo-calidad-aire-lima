import { STATIONS } from "./model";
import { site } from "./site";
import { getStore, type StoredDroneReading, type StoredStationReading } from "./store";

const ID_RE = /^[a-z0-9][a-z0-9-]{1,39}$/;

export type IngestSuccess = {
  ok: true;
  stored: number;
  id: string;
  kind: "station" | "drone";
  holdMs: number;
};

export class IngestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function asNumber(value: unknown, label: string, min: number, max: number): number {
  const numeric = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof numeric !== "number" || !Number.isFinite(numeric)) {
    throw new IngestError(400, `${label} debe ser un número.`);
  }
  if (numeric < min || numeric > max) {
    throw new IngestError(400, `${label} fuera de rango (${min} a ${max}).`);
  }
  return numeric;
}

function parseTimestamp(value: unknown): number {
  const now = Date.now();
  let ms: number;
  if (value == null) ms = now;
  else if (typeof value === "number" && Number.isFinite(value)) ms = value < 1e12 ? value * 1000 : value;
  else if (typeof value === "string") {
    ms = Date.parse(value);
    if (Number.isNaN(ms)) throw new IngestError(400, "timestamp no válido.");
  } else {
    throw new IngestError(400, "timestamp no válido.");
  }
  if (ms > now + 5 * 60_000) throw new IngestError(400, "timestamp en el futuro.");
  if (ms < now - 48 * 3600_000) throw new IngestError(400, "timestamp anterior a 48 horas.");
  return ms;
}

function readingFrom(raw: Record<string, unknown>, timestamp: number) {
  return {
    timestamp,
    pm25: asNumber(raw.pm25, "pm25", 0, 1000),
    pm10: asNumber(raw.pm10, "pm10", 0, 1500),
    o3: asNumber(raw.o3, "o3", 0, 1000),
    no2: asNumber(raw.no2, "no2", 0, 1000),
    temperature: asNumber(raw.temperature, "temperature", -20, 50),
    humidity: asNumber(raw.humidity, "humidity", 0, 100),
  };
}

function assertArea(lat: number, lon: number): void {
  const area = site.serviceArea;
  if (lat < area.latMin || lat > area.latMax || lon < area.lonMin || lon > area.lonMax) {
    throw new IngestError(400, "lat/lon fuera del área de servicio de Lima Metropolitana.");
  }
}

function stationSamples(body: Record<string, unknown>): Record<string, unknown>[] {
  if (Array.isArray(body.readings)) {
    if (body.readings.length === 0) throw new IngestError(400, "readings está vacío.");
    if (body.readings.length > 500) throw new IngestError(400, "Máximo 500 lecturas por solicitud.");
    return body.readings.map((item) => {
      if (!item || typeof item !== "object") throw new IngestError(400, "Lectura inválida.");
      return item as Record<string, unknown>;
    });
  }
  return [body];
}

export function ingestPayload(body: unknown): IngestSuccess {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new IngestError(400, "El cuerpo debe ser un objeto JSON.");
  }
  const record = body as Record<string, unknown>;
  const type = record.type === "drone" ? "drone" : record.type === "station" ? "station" : null;
  if (!type) throw new IngestError(400, 'type debe ser "station" o "drone".');

  if (type === "drone") {
    const droneId = typeof record.droneId === "string" ? record.droneId : site.drone.id;
    if (droneId !== site.drone.id) {
      throw new IngestError(400, `droneId debe ser ${site.drone.id}.`);
    }
    const samples = stationSamples(record);
    const store = getStore();
    for (const sample of samples) {
      const timestamp = parseTimestamp(sample.timestamp ?? record.timestamp);
      const lat = asNumber(sample.lat ?? record.lat, "lat", -90, 90);
      const lon = asNumber(sample.lon ?? record.lon, "lon", -180, 180);
      assertArea(lat, lon);
      const altitude = asNumber(sample.altitude ?? record.altitude, "altitude", 0, 500);
      const reading: StoredDroneReading = {
        ...readingFrom(sample, timestamp),
        droneId,
        lat,
        lon,
        altitude,
      };
      store.appendDrone(reading);
    }
    return { ok: true, stored: samples.length, id: droneId, kind: "drone", holdMs: site.simulation.externalHoldMs };
  }

  const stationId = record.stationId;
  if (typeof stationId !== "string" || !ID_RE.test(stationId)) {
    throw new IngestError(400, "stationId inválido. Use minúsculas, números y guiones.");
  }
  const known = STATIONS.some((station) => station.id === stationId);
  const samples = stationSamples(record);
  let metaLat: number | undefined;
  let metaLon: number | undefined;
  if (!known) {
    if (typeof record.name !== "string" || record.name.trim().length < 2) {
      throw new IngestError(400, "Una estación nueva requiere name.");
    }
    metaLat = asNumber(record.lat, "lat", -90, 90);
    metaLon = asNumber(record.lon, "lon", -180, 180);
    assertArea(metaLat, metaLon);
  } else if (record.lat != null || record.lon != null) {
    metaLat = asNumber(record.lat, "lat", -90, 90);
    metaLon = asNumber(record.lon, "lon", -180, 180);
    assertArea(metaLat, metaLon);
  }

  const store = getStore();
  for (const sample of samples) {
    const timestamp = parseTimestamp(sample.timestamp ?? record.timestamp);
    const stored: StoredStationReading = {
      ...readingFrom({ ...record, ...sample }, timestamp),
      stationId,
      name: typeof record.name === "string" ? record.name.trim() : undefined,
      district: typeof record.district === "string" ? record.district.trim() : undefined,
      lat: metaLat,
      lon: metaLon,
      note: typeof record.note === "string" ? record.note.trim() : undefined,
    };
    store.appendStation(stored);
  }
  return {
    ok: true,
    stored: samples.length,
    id: stationId,
    kind: "station",
    holdMs: site.simulation.externalHoldMs,
  };
}

export function assertIngestAuth(request: Request): void {
  const token = process.env.INGEST_TOKEN;
  if (!token) return;
  const header = request.headers.get("authorization");
  if (header !== `Bearer ${token}`) {
    throw new IngestError(401, "No autorizado.");
  }
}
