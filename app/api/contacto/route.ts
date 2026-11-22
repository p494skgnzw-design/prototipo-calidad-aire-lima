import { connection } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  await connection();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON no válido." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const name = typeof record.nombre === "string" ? record.nombre.trim() : "";
  const email = typeof record.correo === "string" ? record.correo.trim() : "";
  const message = typeof record.mensaje === "string" ? record.mensaje.trim() : "";
  const institution = typeof record.institucion === "string" ? record.institucion.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return Response.json({ error: "Escriba su nombre (2 a 80 caracteres)." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return Response.json({ error: "Escriba un correo válido." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return Response.json({ error: "El mensaje debe tener entre 10 y 2000 caracteres." }, { status: 400 });
  }
  if (institution.length > 120) {
    return Response.json({ error: "La institución es demasiado larga." }, { status: 400 });
  }

  return Response.json({
    ok: true,
    notice:
      "Mensaje comprobado. Este prototipo no lo reenvía a un buzón: el correo del grupo todavía es provisional.",
  });
}
