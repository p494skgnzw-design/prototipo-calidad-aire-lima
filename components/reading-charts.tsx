"use client";

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatClock, formatNum } from "@/lib/format";
import type { SeriesPayload } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const INK = "#f5f5f5";
const COPPER = "#c4c4c4";
const TEAL = "#8d8d8d";
const CLAY = "#e8e8e8";

export function ReadingCharts({ series }: { series: SeriesPayload }) {
  const labels = useMemo(
    () => series.points.map((point) => formatClock(point.t)),
    [series.points],
  );

  const baseOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { size: 11 },
            color: "#f5f5f5",
          },
        },
        tooltip: {
          callbacks: {
            label: (item: { dataset: { label?: string }; parsed: { y: number | null } }) => {
              const y = item.parsed.y;
              if (y == null) return `${item.dataset.label}: sin dato`;
              return `${item.dataset.label}: ${formatNum(y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 6, color: "#a3a3a3", font: { size: 10 } },
          grid: { color: "rgba(255,255,255,0.08)" },
        },
        y: {
          ticks: {
            color: "#a3a3a3",
            font: { size: 10 },
            callback: (value: string | number) => formatNum(Number(value), 0),
          },
          grid: { color: "rgba(255,255,255,0.08)" },
        },
      },
    }),
    [],
  );

  const particles = {
    labels,
    datasets: [
      line(series, "PM2.5", "pm25", INK, true),
      line(series, "PM10", "pm10", COPPER, false),
    ],
  };
  const gases = {
    labels,
    datasets: [line(series, "O3", "o3", TEAL, false), line(series, "NO2", "no2", CLAY, false)],
  };
  const weather = {
    labels,
    datasets: [
      line(series, "Temperatura (°C)", "temperature", COPPER, false),
      line(series, "Humedad (%)", "humidity", TEAL, false),
    ],
  };

  return (
    <div className="space-y-4">
      <ChartBlock title="Partículas" unit="µg/m³" data={particles} options={baseOptions} />
      <ChartBlock title="Gases" unit="µg/m³" data={gases} options={baseOptions} />
      <ChartBlock title="Meteorología" unit="°C y %" data={weather} options={baseOptions} />
      {series.kind === "drone" ? (
        <ChartBlock
          title="Altitud del dron"
          unit="m"
          data={{ labels, datasets: [line(series, "Altitud", "altitude", INK, true)] }}
          options={baseOptions}
        />
      ) : null}
    </div>
  );
}

function line(
  series: SeriesPayload,
  label: string,
  key: "pm25" | "pm10" | "o3" | "no2" | "temperature" | "humidity" | "altitude",
  color: string,
  fill: boolean,
) {
  return {
    label,
    data: series.points.map((point) => point[key]),
    borderColor: color,
    backgroundColor: fill ? "rgba(255,255,255,0.08)" : color,
    pointRadius: 0,
    borderWidth: 1.6,
    tension: 0.25,
    spanGaps: false,
    fill,
  };
}

function ChartBlock({
  title,
  unit,
  data,
  options,
}: {
  title: string;
  unit: string;
  data: {
    labels: string[];
    datasets: ReturnType<typeof line>[];
  };
  options: object;
}) {
  return (
    <section>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h3 className="font-sans text-sm font-semibold text-pacific">{title}</h3>
        <span className="font-mono text-[10px] text-muted-foreground">{unit}</span>
      </div>
      <div className="h-40">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
