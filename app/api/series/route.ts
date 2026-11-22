import { connection } from "next/server";
import { buildSeries } from "@/lib/simulator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const hours = Number(url.searchParams.get("hours") ?? 3);
  if (!id) {
    return Response.json({ error: "Falta el parámetro id." }, { status: 400 });
  }
  const series = buildSeries(id, Number.isFinite(hours) ? hours : 3);
  if (!series) {
    return Response.json({ error: "Serie no encontrada." }, { status: 404 });
  }
  return Response.json(series);
}
