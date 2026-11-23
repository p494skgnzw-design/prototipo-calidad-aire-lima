import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await connection();
  const filePath = path.join(process.cwd(), "public", "prototipo-gia-lima.zip");
  let file: Buffer;
  try {
    file = await readFile(filePath);
  } catch {
    return Response.json({ error: "El archivo zip no está en este servidor." }, { status: 404 });
  }
  return new Response(file, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="prototipo-gia-lima.zip"',
      "Content-Length": String(file.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
