import { aqiFromReading } from "./aqi";
import {
  DRONE_LOOP,
  DRONE_WAYPOINTS,
  STATIONS,
  droneReading,
  droneTravelledMeters,
  dropoutState,
  nearestSegment,
  pointAlong,
  stationReading,
  type StationDef,
} from "./model";
import { site, tickMs } from "./site";
import { coveringStation, getStore, type StoredStationReading } from "./store";
import type {
  DroneSnapshot,
  LiveSnapshot,
  Reading,
  SeriesPayload,
  SeriesPoint,
  StationSnapshot,
} from "./types";

const SERIES_STEP_MS = 30_000;

function readingFields(reading: Reading | null, altitude: number | null, t: number): SeriesPoint {
  if (!reading) {
    return {
      t,
      pm25: null,
      pm10: null,
      o3: null,
      no2: null,
      temperature: null,
      humidity: null,
      altitude,
    };
  }
  return { t, ...reading, altitude };
}

function stationSnapshot(station: StationDef, now: number): StationSnapshot {
  const hold = site.simulation.externalHoldMs;
  const external = getStore().stationReadings(station.id, now - hold, now);
  const liveExternal = coveringStation(external, now, hold);
  if (liveExternal) {
    const reading: Reading = {
      pm25: liveExternal.pm25,
      pm10: liveExternal.pm10,
      o3: liveExternal.o3,
      no2: liveExternal.no2,
      temperature: liveExternal.temperature,
      humidity: liveExternal.humidity,
    };
    return {
      id: station.id,
      name: station.name,
      district: station.district,
      lat: station.lat,
      lon: station.lon,
      note: station.note,
      online: true,
      source: "external",
      lastSeen: liveExternal.timestamp,
      reading,
      aqi: aqiFromReading(reading),
      catalog: true,
    };
  }

  const dropout =
    station.id === site.simulation.dropoutStationId ? dropoutState(now) : { offline: false, since: null };
  if (dropout.offline && dropout.since != null) {
    const last = stationReading(station, dropout.since - 1000);
    return {
      id: station.id,
      name: station.name,
      district: station.district,
      lat: station.lat,
      lon: station.lon,
      note: station.note,
      online: false,
      source: "simulated",
      lastSeen: dropout.since,
      reading: last,
      aqi: aqiFromReading(last),
      catalog: true,
    };
  }

  const samples = [0, 5, 10, 15, 20].map((minutes) =>
    stationReading(station, now - minutes * 60_000),
  );
  const reading = samples[0];
  const nowcast = {
    pm25: samples.reduce((sum, item) => sum + item.pm25, 0) / samples.length,
    pm10: samples.reduce((sum, item) => sum + item.pm10, 0) / samples.length,
  };
  return {
    id: station.id,
    name: station.name,
    district: station.district,
    lat: station.lat,
    lon: station.lon,
    note: station.note,
    online: true,
    source: "simulated",
    lastSeen: now,
    reading,
    aqi: aqiFromReading(nowcast),
    catalog: true,
  };
}

function externalOnlyStations(now: number): StationSnapshot[] {
  const catalog = new Set(STATIONS.map((station) => station.id));
  const hold = site.simulation.externalHoldMs;
  const snapshots: StationSnapshot[] = [];
  for (const id of getStore().knownExternalStationIds()) {
    if (catalog.has(id)) continue;
    const history = getStore().stationReadings(id, now - 48 * 3600_000, now);
    const latest = history[history.length - 1];
    if (!latest || latest.lat == null || latest.lon == null) continue;
    const live = coveringStation(history, now, hold);
    const reading: Reading = {
      pm25: (live ?? latest).pm25,
      pm10: (live ?? latest).pm10,
      o3: (live ?? latest).o3,
      no2: (live ?? latest).no2,
      temperature: (live ?? latest).temperature,
      humidity: (live ?? latest).humidity,
    };
    snapshots.push({
      id,
      name: latest.name ?? id,
      district: latest.district ?? "Por asignar",
      lat: latest.lat,
      lon: latest.lon,
      note: latest.note ?? "Estación incorporada por la ingesta.",
      online: live != null,
      source: "external",
      lastSeen: (live ?? latest).timestamp,
      reading,
      aqi: aqiFromReading(reading),
      catalog: false,
    });
  }
  return snapshots;
}

function simulatedDrone(now: number): DroneSnapshot {
  const speed = site.simulation.droneSpeedMps;
  const travelled = droneTravelledMeters(now);
  const nose = pointAlong(travelled);
  const reading = droneReading(nose.lat, nose.lon, nose.altitude, now);
  const trail = [];
  const step = 180;
  for (let distance = travelled - site.simulation.tailMeters; distance <= travelled; distance += step) {
    const point = pointAlong(distance);
    const timestamp = now - ((travelled - distance) / speed) * 1000;
    const sample = droneReading(point.lat, point.lon, point.altitude, timestamp);
    trail.push({
      lat: point.lat,
      lon: point.lon,
      altitude: point.altitude,
      pm25: sample.pm25,
      timestamp,
    });
  }
  return {
    id: site.drone.id,
    name: site.drone.name,
    online: true,
    source: "simulated",
    lat: nose.lat,
    lon: nose.lon,
    altitude: nose.altitude,
    heading: nose.heading,
    speedMps: speed,
    segment: nose.segment,
    lastSeen: now,
    reading,
    aqi: aqiFromReading(reading),
    trail,
    route: [...DRONE_WAYPOINTS, DRONE_WAYPOINTS[0]],
  };
}

function externalDrone(now: number, latestTs: number): DroneSnapshot | null {
  const hold = site.simulation.externalHoldMs;
  if (now - latestTs > hold) return null;
  const from = now - 20 * 60_000;
  const points = getStore().droneReadings(from, now);
  const latest = points[points.length - 1];
  if (!latest) return null;
  const previous = points.length > 1 ? points[points.length - 2] : null;
  let heading = 0;
  let speed = site.simulation.droneSpeedMps;
  if (previous) {
    const dt = Math.max(1, (latest.timestamp - previous.timestamp) / 1000);
    const meters = distanceMeters(previous, latest);
    speed = meters / dt;
    heading = headingDeg(previous, latest);
  }
  const reading: Reading = {
    pm25: latest.pm25,
    pm10: latest.pm10,
    o3: latest.o3,
    no2: latest.no2,
    temperature: latest.temperature,
    humidity: latest.humidity,
  };
  return {
    id: site.drone.id,
    name: site.drone.name,
    online: true,
    source: "external",
    lat: latest.lat,
    lon: latest.lon,
    altitude: latest.altitude,
    heading,
    speedMps: Math.round(speed * 10) / 10,
    segment: nearestSegment(latest.lat, latest.lon),
    lastSeen: latest.timestamp,
    reading,
    aqi: aqiFromReading(reading),
    trail: points.map((point) => ({
      lat: point.lat,
      lon: point.lon,
      altitude: point.altitude,
      pm25: point.pm25,
      timestamp: point.timestamp,
    })),
    route: [...DRONE_WAYPOINTS, DRONE_WAYPOINTS[0]],
  };
}

function distanceMeters(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dp = ((b.lat - a.lat) * Math.PI) / 180;
  const dl = ((b.lon - a.lon) * Math.PI) / 180;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function headingDeg(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dl = ((b.lon - a.lon) * Math.PI) / 180;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (((Math.atan2(y, x) * 180) / Math.PI) % 360 + 360) % 360;
}

export function buildSnapshot(now = Date.now()): LiveSnapshot {
  const stations = [...STATIONS.map((station) => stationSnapshot(station, now)), ...externalOnlyStations(now)];
  const latestDrone = getStore().latestDrone();
  const drone =
    (latestDrone ? externalDrone(now, latestDrone.timestamp) : null) ?? simulatedDrone(now);
  return {
    serverTime: now,
    simulated: true,
    disclaimer: site.disclaimer,
    tickMs: tickMs(),
    stationsOnline: stations.filter((station) => station.online).length,
    stations,
    drone,
  };
}

function pushExternalStationPoints(
  points: SeriesPoint[],
  readings: StoredStationReading[],
  from: number,
  to: number,
): void {
  for (const reading of readings) {
    if (reading.timestamp < from || reading.timestamp > to) continue;
    points.push(
      readingFields(
        {
          pm25: reading.pm25,
          pm10: reading.pm10,
          o3: reading.o3,
          no2: reading.no2,
          temperature: reading.temperature,
          humidity: reading.humidity,
        },
        null,
        reading.timestamp,
      ),
    );
  }
}

export function buildSeries(id: string, hours: number, now = Date.now()): SeriesPayload | null {
  const span = Math.min(24, Math.max(1, hours));
  const from = now - span * 3600_000;
  const hold = site.simulation.externalHoldMs;

  if (id === "drone" || id === site.drone.id) {
    const points: SeriesPoint[] = [];
    const external = getStore().droneReadings(from - hold, now);
    for (let t = from; t <= now; t += SERIES_STEP_MS) {
      const live = [...external].reverse().find((item) => item.timestamp <= t && t - item.timestamp <= hold);
      if (live) continue;
      const travelled = droneTravelledMeters(t);
      const point = pointAlong(travelled);
      points.push(readingFields(droneReading(point.lat, point.lon, point.altitude, t), point.altitude, t));
    }
    for (const reading of external) {
      if (reading.timestamp < from || reading.timestamp > now) continue;
      points.push(
        readingFields(
          {
            pm25: reading.pm25,
            pm10: reading.pm10,
            o3: reading.o3,
            no2: reading.no2,
            temperature: reading.temperature,
            humidity: reading.humidity,
          },
          reading.altitude,
          reading.timestamp,
        ),
      );
    }
    points.sort((a, b) => a.t - b.t);
    return { id: "drone", name: site.drone.name, kind: "drone", hours: span, points };
  }

  const station = STATIONS.find((item) => item.id === id);
  if (!station) {
    const external = getStore().stationReadings(id, from, now);
    if (external.length === 0) return null;
    const latest = external[external.length - 1];
    const points = external.map((reading) =>
      readingFields(
        {
          pm25: reading.pm25,
          pm10: reading.pm10,
          o3: reading.o3,
          no2: reading.no2,
          temperature: reading.temperature,
          humidity: reading.humidity,
        },
        null,
        reading.timestamp,
      ),
    );
    return { id, name: latest.name ?? id, kind: "station", hours: span, points };
  }

  const external = getStore().stationReadings(station.id, from - hold, now);
  const points: SeriesPoint[] = [];
  for (let t = from; t <= now; t += SERIES_STEP_MS) {
    if (coveringStation(external, t, hold)) continue;
    const dropout =
      station.id === site.simulation.dropoutStationId ? dropoutState(t) : { offline: false, since: null };
    if (dropout.offline) {
      points.push(readingFields(null, null, t));
    } else {
      points.push(readingFields(stationReading(station, t), null, t));
    }
  }
  pushExternalStationPoints(points, external, from, now);
  points.sort((a, b) => a.t - b.t);
  return { id: station.id, name: station.name, kind: "station", hours: span, points };
}

export function simulatorInfo() {
  return {
    stations: STATIONS.map((station) => station.id),
    droneId: site.drone.id,
    droneLoopKm: Math.round((DRONE_LOOP.length / 1000) * 10) / 10,
    tickMs: tickMs(),
  };
}

export function warmSimulator(): void {
  buildSnapshot();
}
