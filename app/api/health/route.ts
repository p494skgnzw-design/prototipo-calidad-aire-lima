import { connection } from "next/server";
import { simulatorInfo } from "@/lib/simulator";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await connection();
  const info = simulatorInfo();
  return Response.json({
    ok: true,
    time: new Date().toISOString(),
    ...info,
    externalStationIds: getStore().knownExternalStationIds(),
  });
}
