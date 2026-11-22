import type { Reading } from "./types";

/**
 * Contrato del almacén de series.
 * Hoy lo implementa la memoria del proceso. Un adaptador de InfluxDB o
 * TimescaleDB puede sustituir esta clase sin cambiar la ingesta ni el mapa.
 */
export type StoredStationReading = Reading & {
  stationId: string;
  timestamp: number;
  name?: string;
  district?: string;
  lat?: number;
  lon?: number;
  note?: string;
};

export type StoredDroneReading = Reading & {
  droneId: string;
  timestamp: number;
  lat: number;
  lon: number;
  altitude: number;
};

export interface TimeSeriesStore {
  appendStation(reading: StoredStationReading): void;
  appendDrone(reading: StoredDroneReading): void;
  stationReadings(stationId: string, from: number, to: number): StoredStationReading[];
  droneReadings(from: number, to: number): StoredDroneReading[];
  knownExternalStationIds(): string[];
}

const MAX_POINTS = 3000;
const MAX_STATIONS = 24;

export class MemoryStore implements TimeSeriesStore {
  private stations = new Map<string, StoredStationReading[]>();
  private drone: StoredDroneReading[] = [];

  appendStation(reading: StoredStationReading): void {
    if (!this.stations.has(reading.stationId) && this.stations.size >= MAX_STATIONS) {
      throw new Error(`El prototipo admite hasta ${MAX_STATIONS} estaciones con lecturas externas.`);
    }
    const list = this.stations.get(reading.stationId) ?? [];
    list.push(reading);
    list.sort((a, b) => a.timestamp - b.timestamp);
    if (list.length > MAX_POINTS) list.splice(0, list.length - MAX_POINTS);
    this.stations.set(reading.stationId, list);
  }

  appendDrone(reading: StoredDroneReading): void {
    this.drone.push(reading);
    this.drone.sort((a, b) => a.timestamp - b.timestamp);
    if (this.drone.length > MAX_POINTS) this.drone.splice(0, this.drone.length - MAX_POINTS);
  }

  stationReadings(stationId: string, from: number, to: number): StoredStationReading[] {
    const list = this.stations.get(stationId) ?? [];
    return list.filter((item) => item.timestamp >= from && item.timestamp <= to);
  }

  latestStation(stationId: string): StoredStationReading | null {
    const list = this.stations.get(stationId);
    if (!list || list.length === 0) return null;
    return list[list.length - 1];
  }

  droneReadings(from: number, to: number): StoredDroneReading[] {
    return this.drone.filter((item) => item.timestamp >= from && item.timestamp <= to);
  }

  latestDrone(): StoredDroneReading | null {
    if (this.drone.length === 0) return null;
    return this.drone[this.drone.length - 1];
  }

  knownExternalStationIds(): string[] {
    return [...this.stations.keys()];
  }
}

const globalStore = globalThis as typeof globalThis & {
  __giaStore?: MemoryStore;
};

export function getStore(): MemoryStore {
  if (!globalStore.__giaStore) globalStore.__giaStore = new MemoryStore();
  return globalStore.__giaStore;
}

/** Lectura externa que todavía "tapa" al simulador en el instante t. */
export function coveringStation(
  readings: StoredStationReading[],
  t: number,
  holdMs: number,
): StoredStationReading | null {
  let best: StoredStationReading | null = null;
  for (const reading of readings) {
    if (reading.timestamp <= t && t - reading.timestamp <= holdMs) {
      if (!best || reading.timestamp > best.timestamp) best = reading;
    }
  }
  return best;
}
