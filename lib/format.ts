const timeFormat = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const clockFormat = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatTime(ts: number): string {
  return timeFormat.format(new Date(ts));
}

export function formatClock(ts: number): string {
  return clockFormat.format(new Date(ts));
}

export function formatNum(value: number, digits = 1): string {
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
