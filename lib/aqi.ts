import type { AqiCategoryId, AqiInfo, Reading } from "./types";

type Breakpoint = { cLow: number; cHigh: number; iLow: number; iHigh: number };

/** Puntos de corte EPA, en µg/m³, usados solo como índice orientativo. */
const PM25: Breakpoint[] = [
  { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

const PM10: Breakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
];

export const AQI_CATEGORIES: {
  id: AqiCategoryId;
  label: string;
  shortLabel: string;
  max: number;
  color: string;
}[] = [
  { id: "buena", label: "Buena", shortLabel: "Buena", max: 50, color: "#2E9D4F" },
  { id: "moderada", label: "Moderada", shortLabel: "Moderada", max: 100, color: "#C6A317" },
  {
    id: "sensible",
    label: "Insalubre para grupos sensibles",
    shortLabel: "Sensible",
    max: 150,
    color: "#F08A24",
  },
  { id: "insalubre", label: "Insalubre", shortLabel: "Insalubre", max: 200, color: "#E23B3B" },
  {
    id: "muy-insalubre",
    label: "Muy insalubre",
    shortLabel: "Muy insalubre",
    max: 300,
    color: "#8E3D9B",
  },
  { id: "peligrosa", label: "Peligrosa", shortLabel: "Peligrosa", max: 500, color: "#6E1E2A" },
];

export const OFFLINE_COLOR = "#8B979C";

const PM_STOPS = [
  { v: 0, color: "#2E9D4F" },
  { v: 12, color: "#3E9A4A" },
  { v: 35.4, color: "#C6A317" },
  { v: 55.4, color: "#F08A24" },
  { v: 90, color: "#E23B3B" },
  { v: 150, color: "#8E3D9B" },
];

function subIndex(concentration: number, bands: Breakpoint[]): number {
  const c = Math.max(0, concentration);
  for (const band of bands) {
    if (c <= band.cHigh) {
      const span = band.cHigh - band.cLow || 1;
      const value = ((band.iHigh - band.iLow) / span) * (c - band.cLow) + band.iLow;
      return Math.round(Math.min(500, Math.max(0, value)));
    }
  }
  return 500;
}

export function aqiFromReading(reading: Pick<Reading, "pm25" | "pm10">): AqiInfo {
  const value = Math.max(subIndex(reading.pm25, PM25), subIndex(reading.pm10, PM10));
  const category =
    AQI_CATEGORIES.find((item) => value <= item.max) ??
    AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
  return {
    value,
    category: category.id,
    label: category.label,
    shortLabel: category.shortLabel,
    color: category.color,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Escala continua para colorear el trayecto del dron según PM2.5. */
export function colorForPm25(pm25: number): string {
  const value = Math.max(0, pm25);
  let index = 1;
  while (index < PM_STOPS.length && value > PM_STOPS[index].v) index += 1;
  const upper = PM_STOPS[Math.min(index, PM_STOPS.length - 1)];
  const lower = PM_STOPS[Math.max(0, index - 1)];
  const span = upper.v - lower.v || 1;
  const t = Math.min(1, Math.max(0, (value - lower.v) / span));
  const a = hexToRgb(lower.color);
  const b = hexToRgb(upper.color);
  const mix = a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}
