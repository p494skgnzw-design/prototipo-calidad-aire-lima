"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function active(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
      <div className="h-px bg-white/80" />
      <div className="flex w-full items-center gap-6 px-4 py-3 sm:gap-10 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark />
          <span className="leading-tight">
            <span className="block font-heading text-2xl tracking-[0.08em] text-pacific uppercase">{site.shortName}</span>
            <span className="hidden max-w-[18rem] text-[11px] leading-snug font-bold text-muted-foreground lg:block">
              {site.name}
            </span>
          </span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-between lg:flex">
          {nav.map((item) => {
            const current = active(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "px-1 py-1.5 text-center text-[12px] font-bold tracking-[0.06em] whitespace-nowrap text-foreground uppercase hover:text-white",
                  current && item.href !== "/datos" && "text-white underline decoration-white/80 underline-offset-8",
                  item.href === "/datos" && "rounded-full bg-primary px-3 text-primary-foreground hover:text-primary-foreground",
                  current && item.href === "/datos" && "ring-2 ring-white ring-offset-2 ring-offset-black",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-auto lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setMenuPath(open ? null : pathname)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        </Button>
      </div>
      {open ? (
        <nav id="menu-movil" className="border-t border-border bg-card lg:hidden">
          <div className="flex flex-col px-4 py-1 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border/70 py-3 text-base font-bold",
                  active(pathname, item.href) && "text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <rect width="36" height="36" rx="8" fill="#000000" stroke="#f5f5f5" strokeWidth="1" />
      <path d="M5 25c4.5-7 9-7 13.5 0S27 32 31.5 25" fill="none" stroke="#f5f5f5" strokeWidth="1.4" />
      <circle cx="12" cy="21" r="2.3" fill="#2E9D4F" />
      <circle cx="24" cy="17" r="2.3" fill="#F08A24" />
      <path d="M18 6.5 20.4 12 18 10.6 15.6 12 18 6.5Z" fill="#f5f5f5" />
    </svg>
  );
}
