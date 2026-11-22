import { connection } from "next/server";
import { STATIONS } from "@/lib/model";
import { site } from "@/lib/site";
import { assertIngestAuth, IngestError, ingestPayload } from "@/lib/ingest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const corsHeaders = (): HeadersInit => {
  const origin = process.env.INGEST_CORS_ORIGIN;
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  await connection();
  return Response.json(
    {
      endpoint: "/api/ingest",
      auth: process.env.INGEST_TOKEN ? "Bearer token requerido" : "abierto en este prototipo",
      holdMs: site.simulation.externalHoldMs,
      stationIds: STATIONS.map((station) => station.id),
      droneId: site.drone.id,
      example: {
        type: "station",
        stationId: "miraflores",
        timestamp: new Date().toISOString(),
        pm25: 18.2,
        pm10: 27.4,
        o3: 31,
        no2: 12.5,
        temperature: 21,
        humidity: 78,
      },
    },
    { headers: corsHeaders() },
  );
}

export async function POST(request: Request) {
  await connection();
  try {
    assertIngestAuth(request);
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 500_000) {
      return Response.json({ error: "Cuerpo demasiado grande." }, { status: 413, headers: corsHeaders() });
    }
    const body = await request.json();
    const result = ingestPayload(body);
    return Response.json(result, { headers: corsHeaders() });
  } catch (error) {
    if (error instanceof IngestError) {
      return Response.json({ error: error.message }, { status: error.status, headers: corsHeaders() });
    }
    if (error instanceof SyntaxError) {
      return Response.json({ error: "JSON no válido." }, { status: 400, headers: corsHeaders() });
    }
    const message = error instanceof Error ? error.message : "No se pudo guardar la lectura.";
    return Response.json({ error: message }, { status: 400, headers: corsHeaders() });
  }
}
