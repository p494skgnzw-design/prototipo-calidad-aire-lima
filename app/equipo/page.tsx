import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { team } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Equipo",
  description: `Plazas de ${site.name}.`,
};

export default function EquipoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Personas"
        title="Equipo de Ingenieros"
        lede="El grupo de desarrollo e investigación."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {team.map((person) => (
          <Card key={person.role}>
            <CardHeader>
              <p className="font-mono text-xs tracking-wide text-copper uppercase">{person.status}</p>
              <CardTitle className="text-xl text-pacific">{person.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{person.focus}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
