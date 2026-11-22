import { connection } from "next/server";
import { buildSnapshot } from "@/lib/simulator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  await connection();
  void request.url;
  return Response.json(buildSnapshot());
}
