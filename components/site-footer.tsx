import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-heading text-2xl text-white">{site.shortName}</p>
          <p className="mt-2 max-w-md text-sm text-neutral-300">{site.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{site.city}</p>
          <p className="mt-4 max-w-md text-sm text-neutral-400">{site.disclaimer}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-neutral-400 hover:text-white">
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${site.email}`} className="mt-2 text-neutral-400 hover:text-white">
            {site.email}
          </a>
          <a
            href="https://github.com/p494skgnzw-design/prototipo-calidad-aire-lima"
            className="text-neutral-400 hover:text-white"
          >
            Código en GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
