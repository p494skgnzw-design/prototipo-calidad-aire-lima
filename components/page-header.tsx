export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-border/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-4xl tracking-tight text-balance text-pacific sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">{lede}</p>
      </div>
    </header>
  );
}
