import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">404</p>
      <h1 className="mt-3 text-4xl text-pacific">Esa página no está en el sitio</h1>
      <p className="mt-3 text-muted-foreground">
        El enlace no corresponde a ninguna sección del prototipo.
      </p>
      <Button asChild className="mt-6 h-10 px-4">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
