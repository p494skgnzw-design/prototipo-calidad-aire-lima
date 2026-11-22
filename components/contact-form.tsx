"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          correo: data.get("correo"),
          institucion: data.get("institucion"),
          mensaje: data.get("mensaje"),
        }),
      });
      const payload = (await response.json()) as { error?: string; notice?: string };
      if (!response.ok) {
        setStatus("error");
        setError(payload.error ?? "No se pudo enviar.");
        return;
      }
      setStatus("sent");
      setNotice(payload.notice ?? "Mensaje comprobado.");
      form.reset();
    } catch {
      setStatus("error");
      setError("No hay conexión con el servidor.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required minLength={2} maxLength={80} autoComplete="name" className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="correo">Correo</Label>
        <Input id="correo" name="correo" type="email" required autoComplete="email" className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="institucion">Institución (opcional)</Label>
        <Input id="institucion" name="institucion" maxLength={120} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea id="mensaje" name="mensaje" required minLength={10} maxLength={2000} rows={6} />
      </div>
      <Button type="submit" className="h-10 px-4" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </Button>
      {status === "error" ? <p className="text-sm text-destructive">{error}</p> : null}
      {status === "sent" ? <p className="text-sm text-primary">{notice}</p> : null}
    </form>
  );
}
