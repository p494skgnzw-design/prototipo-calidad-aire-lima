import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacto provisional de ${site.name} en ${site.city}.`,
};

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow={site.city}
        title="Contacto"
        lede="El correo y nombre del grupo. El formulario comprueba el mensaje en el servidor y responde en la página; no lo guarda ni lo reenvía."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Grupo</p>
            <p className="mt-1 text-base">{site.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Ciudad</p>
            <p className="mt-1">{site.city}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Correo</p>
            <p className="mt-1">
              <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p className="mt-1 text-muted-foreground">Dirección de ejemplo, sin buzón.</p>
          </div>
        </aside>
        <ContactForm />
      </div>
    </>
  );
}
