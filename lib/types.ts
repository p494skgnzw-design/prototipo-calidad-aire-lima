export type DataSource = "simulated" | "external";

export type Reading = {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  temperature: number;
  humidity: number;
};

export type AqiCategoryId =
  | "buena"
  | "moderada"
  | "sensible"
  | "insalubre"
  | "muy-insalubre"
  | "peligrosa";

export type AqiInfo = {
  value: number;
  category: AqiCategoryId;
  label: string;
  shortLabel: string;
  color: string;
};

export type StationSnapshot = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lon: number;
  note: string;
  online: boolean;
  source: DataSource;
  lastSeen: number | null;
  reading: Reading | null;
  aqi: AqiInfo | null;
  catalog: boolean;
};

export type TrailPoint = {
  lat: number;
  lon: number;
  altitude: number;
  pm25: number;
  timestamp: number;
};

export type DroneSnapshot = {
  id: string;
  name: string;
  online: boolean;
  source: DataSource;
  lat: number;
  lon: number;
  altitude: number;
  heading: number;
  speedMps: number;
  segment: string;
  lastSeen: number | null;
  reading: Reading | null;
  aqi: AqiInfo | null;
  trail: TrailPoint[];
  route: { lat: number; lon: number; name: string }[];
};

export type LiveSnapshot = {
  serverTime: number;
  simulated: true;
  disclaimer: string;
  tickMs: number;
  stationsOnline: number;
  stations: StationSnapshot[];
  drone: DroneSnapshot;
};

export type SeriesPoint = {
  t: number;
  pm25: number | null;
  pm10: number | null;
  o3: number | null;
  no2: number | null;
  temperature: number | null;
  humidity: number | null;
  altitude: number | null;
};

export type SeriesPayload = {
  id: string;
  name: string;
  kind: "station" | "drone";
  hours: number;
  points: SeriesPoint[];
};
