import { site } from "./site";
import type { Reading } from "./types";

export type StationDef = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lon: number;
  pm25: number;
  dust: number;
  no2: number;
  o3: number;
  temp: number;
  rh: number;
  traffic: number;
  tempAmp: number;
  seed: number;
  note: string;
};

export const STATIONS: StationDef[] = [
  {
    id: "centro",
    name: "Centro de Lima",
    district: "Cercado de Lima",
    lat: -12.0453,
    lon: -77.0308,
    pm25: 34,
    dust: 1.6,
    no2: 32,
    o3: 22,
    temp: 21.4,
    rh: 74,
    traffic: 1.2,
    tempAmp: 2.4,
    seed: 1.1,
    note: "Cañón urbano y tráfico denso alrededor de la Plaza Mayor.",
  },
  {
    id: "miraflores",
    name: "Miraflores",
    district: "Miraflores",
    lat: -12.1218,
    lon: -77.0299,
    pm25: 16,
    dust: 1.35,
    no2: 14,
    o3: 30,
    temp: 20.6,
    rh: 81,
    traffic: 0.7,
    tempAmp: 1.8,
    seed: 2.4,
    note: "Borde costero. La brisa marina suele diluir las partículas.",
  },
  {
    id: "san-borja",
    name: "San Borja",
    district: "San Borja",
    lat: -12.1015,
    lon: -76.9995,
    pm25: 22,
    dust: 1.45,
    no2: 16,
    o3: 27,
    temp: 21.2,
    rh: 76,
    traffic: 0.75,
    tempAmp: 2.2,
    seed: 3.2,
    note: "Distrito residencial, entre la costa y el este más seco.",
  },
  {
    id: "ate",
    name: "Ate",
    district: "Ate",
    lat: -12.0358,
    lon: -76.9175,
    pm25: 52,
    dust: 1.95,
    no2: 26,
    o3: 18,
    temp: 22.6,
    rh: 66,
    traffic: 1.05,
    tempAmp: 3.1,
    seed: 4.5,
    note: "Este de la ciudad: más polvo resuspendido y menos brisa.",
  },
  {
    id: "callao",
    name: "Callao",
    district: "Callao",
    lat: -12.0522,
    lon: -77.1268,
    pm25: 38,
    dust: 1.6,
    no2: 34,
    o3: 20,
    temp: 20.2,
    rh: 83,
    traffic: 1.15,
    tempAmp: 1.6,
    seed: 5.1,
    note: "Zona portuaria y de tráfico pesado, cerca del litoral.",
  },
  {
    id: "sjl",
    name: "San Juan de Lurigancho",
    district: "San Juan de Lurigancho",
    lat: -11.9834,
    lon: -77.0012,
    pm25: 46,
    dust: 1.85,
    no2: 28,
    o3: 19,
    temp: 22.1,
    rh: 69,
    traffic: 1.1,
    tempAmp: 2.8,
    seed: 6.3,
    note: "Distrito norte, con avenidas de alto flujo vehicular.",
  },
  {
    id: "vmt",
    name: "Villa María del Triunfo",
    district: "Villa María del Triunfo",
    lat: -12.159,
    lon: -76.9405,
    pm25: 50,
    dust: 2.05,
    no2: 22,
    o3: 18,
    temp: 21.7,
    rh: 71,
    traffic: 0.9,
    tempAmp: 2.6,
    seed: 7.4,
    note: "Laderas del sur. En este prototipo el enlace se corta a ratos.",
  },
  {
    id: "carabayllo",
    name: "Carabayllo",
    district: "Carabayllo",
    lat: -11.869,
    lon: -77.0265,
    pm25: 41,
    dust: 2.1,
    no2: 18,
    o3: 21,
    temp: 22.8,
    rh: 64,
    traffic: 0.8,
    tempAmp: 3.2,
    seed: 8.2,
    note: "Norte de la ciudad, con suelo más seco y polvo local.",
  },
];

export const DRONE_WAYPOINTS: { name: string; lat: number; lon: number }[] = [
  { name: "Costa Verde", lat: -12.1368, lon: -77.0272 },
  { name: "Miraflores", lat: -12.1224, lon: -77.0302 },
  { name: "San Isidro", lat: -12.1058, lon: -77.0368 },
  { name: "Surquillo", lat: -12.1126, lon: -77.0135 },
  { name: "San Borja", lat: -12.0988, lon: -76.9964 },
  { name: "La Molina", lat: -12.0816, lon: -76.9488 },
  { name: "Ate", lat: -12.0528, lon: -76.9365 },
  { name: "Santa Anita", lat: -12.0565, lon: -76.9712 },
  { name: "Surco", lat: -12.1245, lon: -76.9986 },
  { name: "Barranco", lat: -12.1462, lon: -77.0208 },
];

type LoopPoint = { name: string; lat: number; lon: number };

type Loop = {
  points: LoopPoint[];
  cumulative: number[];
  length: number;
};

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6_371_000;
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dp = ((b.lat - a.lat) * Math.PI) / 180;
  const dl = ((b.lon - a.lon) * Math.PI) / 180;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function buildLoop(): Loop {
  const points = [...DRONE_WAYPOINTS, DRONE_WAYPOINTS[0]];
  const cumulative = [0];
  for (let i = 1; i < points.length; i += 1) {
    cumulative.push(cumulative[i - 1] + haversine(points[i - 1], points[i]));
  }
  return { points, cumulative, length: cumulative[cumulative.length - 1] };
}

export const DRONE_LOOP = buildLoop();

export function limaHour(ts: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ts));
  let hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  if (hour === 24) hour = 0;
  return hour + minute / 60;
}

function rushFactor(hour: number): number {
  const morning = Math.exp(-0.5 * ((hour - 8.1) / 1.55) ** 2);
  const evening = Math.exp(-0.5 * ((hour - 19.1) / 1.9) ** 2);
  return morning + 0.92 * evening;
}

function photoFactor(hour: number): number {
  return Math.exp(-0.5 * ((hour - 13.1) / 2.35) ** 2);
}

function diurnalTemp(hour: number): number {
  return Math.cos(((hour - 15.4) / 24) * Math.PI * 2);
}

function smoothNoise(seed: number, ts: number): number {
  const x = ts / 1000;
  return (
    Math.sin(x / 3.1 + seed) * 0.85 +
    Math.sin(x / 13 + seed * 1.4) * 0.45 +
    Math.sin(x / 47 + seed * 0.6) * 1.1
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function roundReading(reading: Reading): Reading {
  return {
    pm25: round1(reading.pm25),
    pm10: round1(reading.pm10),
    o3: round1(reading.o3),
    no2: round1(reading.no2),
    temperature: round1(reading.temperature),
    humidity: Math.round(reading.humidity),
  };
}

export function stationReading(station: StationDef, ts: number): Reading {
  const hour = limaHour(ts);
  const rush = rushFactor(hour);
  const photo = photoFactor(hour);
  const tempWave = diurnalTemp(hour);
  const noise = smoothNoise(station.seed, ts);

  const pm25 = clamp(
    station.pm25 * (0.76 + 0.5 * rush * station.traffic) * (1 - 0.07 * photo) + noise * 1.15,
    4,
    180,
  );
  const pm10 = clamp(pm25 * station.dust + Math.abs(noise) * 0.9, pm25, 340);
  const no2 = clamp(
    station.no2 * (0.48 + 1.1 * rush * station.traffic) * (1 - 0.25 * photo) + noise * 0.55,
    2,
    180,
  );
  const o3 = clamp(station.o3 * (0.3 + 1.5 * photo) * (1 - 0.2 * rush) + noise * 0.35, 1, 160);
  const temperature = clamp(station.temp + tempWave * station.tempAmp + noise * 0.22, 12, 34);
  const humidity = clamp(station.rh - tempWave * 8 + noise * 1.1, 48, 96);

  return roundReading({ pm25, pm10, o3, no2, temperature, humidity });
}

export function dropoutState(ts: number): { offline: boolean; since: number | null } {
  const cycle = site.simulation.dropoutCycleMs;
  const duration = site.simulation.dropoutDurationMs;
  const mod = ((ts % cycle) + cycle) % cycle;
  const start = cycle - duration;
  if (mod >= start) {
    return { offline: true, since: ts - (mod - start) };
  }
  return { offline: false, since: null };
}

function idwSurface(lat: number, lon: number, ts: number): Reading {
  const acc = { pm25: 0, pm10: 0, o3: 0, no2: 0, temperature: 0, humidity: 0 };
  let weightSum = 0;
  for (const station of STATIONS) {
    const distance = Math.max(280, haversine({ lat, lon }, station));
    const weight = 1 / (distance * distance);
    const reading = stationReading(station, ts);
    weightSum += weight;
    acc.pm25 += weight * reading.pm25;
    acc.pm10 += weight * reading.pm10;
    acc.o3 += weight * reading.o3;
    acc.no2 += weight * reading.no2;
    acc.temperature += weight * reading.temperature;
    acc.humidity += weight * reading.humidity;
  }
  return {
    pm25: acc.pm25 / weightSum,
    pm10: acc.pm10 / weightSum,
    o3: acc.o3 / weightSum,
    no2: acc.no2 / weightSum,
    temperature: acc.temperature / weightSum,
    humidity: acc.humidity / weightSum,
  };
}

export function altitudeAt(fraction: number): number {
  const climb = Math.sin(fraction * Math.PI * 4);
  return Math.round(55 + ((climb + 1) / 2) * 145);
}

export function bearing(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dl = ((b.lon - a.lon) * Math.PI) / 180;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) * 180) / Math.PI + 360;
}

type Along = {
  lat: number;
  lon: number;
  altitude: number;
  heading: number;
  fraction: number;
  segment: string;
};

function rawAlong(distance: number): { lat: number; lon: number; segment: string; fraction: number } {
  const loop = DRONE_LOOP;
  const d = ((distance % loop.length) + loop.length) % loop.length;
  let index = 1;
  while (index < loop.cumulative.length - 1 && loop.cumulative[index] < d) index += 1;
  const previous = index - 1;
  const span = loop.cumulative[index] - loop.cumulative[previous] || 1;
  const t = (d - loop.cumulative[previous]) / span;
  const a = loop.points[previous];
  const b = loop.points[index];
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lon: a.lon + (b.lon - a.lon) * t,
    segment: a.name,
    fraction: d / loop.length,
  };
}

export function pointAlong(distance: number): Along {
  const here = rawAlong(distance);
  const ahead = rawAlong(distance + 45);
  return {
    ...here,
    altitude: altitudeAt(here.fraction),
    heading: bearing(here, ahead) % 360,
  };
}

export function droneTravelledMeters(ts: number): number {
  return ((ts - Date.UTC(2026, 0, 1)) / 1000) * site.simulation.droneSpeedMps;
}

export function droneReading(lat: number, lon: number, altitude: number, ts: number): Reading {
  const surface = idwSurface(lat, lon, ts);
  const altFactor = 0.4 + 0.6 * Math.exp(-Math.max(0, altitude - 40) / 100);
  return roundReading({
    pm25: clamp(surface.pm25 * altFactor, 2, 180),
    pm10: clamp(surface.pm10 * (0.55 + 0.45 * altFactor), 2, 340),
    no2: clamp(surface.no2 * (0.4 + 0.6 * altFactor), 1, 180),
    o3: clamp(surface.o3 * (0.9 + 0.25 * (1 - altFactor)), 1, 180),
    temperature: clamp(surface.temperature - Math.max(0, altitude - 25) * 0.007, 8, 34),
    humidity: clamp(surface.humidity - Math.max(0, altitude - 80) * 0.04, 35, 98),
  });
}

export function nearestSegment(lat: number, lon: number): string {
  let best = DRONE_WAYPOINTS[0];
  let bestDistance = Infinity;
  for (const point of DRONE_WAYPOINTS) {
    const distance = haversine({ lat, lon }, point);
    if (distance < bestDistance) {
      best = point;
      bestDistance = distance;
    }
  }
  return best.name;
}
