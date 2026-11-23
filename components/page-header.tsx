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
        <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-5xl leading-[0.9] text-balance text-pacific sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">{lede}</p>
      </div>
    </header>
  );
}
