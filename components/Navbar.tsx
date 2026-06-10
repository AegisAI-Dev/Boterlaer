"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Over de tuin" },
    { href: "/plants", label: "Planten Index" },
    { href: "/bijen", label: "Bijen" },
    { href: "/terracotta", label: "Terracotta" },
    { href: "/wandeling", label: "Wandeling" },
    { href: "/gallery", label: "Galerij" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-botanical-forest/10 bg-botanical-cream/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="paper-panel flex items-center justify-between gap-4 rounded-[2rem] px-5 py-4 md:px-7">
          <Link href="/" className="group flex min-w-0 items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-botanical-forest/15 bg-transparent shadow-paper">
              <Image
                src="/images/ui/bannericon2-centered.png"
                alt="Den Boterlaer banner icoon"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-botanical-moss">
                Botanische route
              </p>
              <span className="block truncate font-display text-2xl leading-none text-botanical-forest group-hover:text-botanical-moss md:text-3xl">
                Den Boterlaer
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2.5 text-sm font-medium tracking-[0.04em] ${
                  pathname === link.href
                    ? "bg-botanical-forest text-botanical-cream shadow-paper"
                    : "text-botanical-ink hover:bg-white hover:text-botanical-forest"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex xl:hidden">
            <Link href="/wandeling" className="btn-outline px-5 py-2.5">
              Wandeling
            </Link>
            <Link href="/plants" className="btn-primary px-5 py-2.5">
              Planten
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-botanical-forest/15 bg-white/70 text-botanical-forest xl:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="px-1 pb-1 pt-3 xl:hidden">
            <div className="botanical-panel rounded-[1.75rem] px-4 py-4">
              <div className="mb-4 flex items-center justify-between border-b border-botanical-forest/10 pb-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-botanical-moss">
                    Tuinroutes
                  </p>
                  <p className="font-display text-2xl text-botanical-forest">
                    Verken de zones
                  </p>
                </div>
                <Link
                  href="/wandeling"
                  className="rounded-full border border-botanical-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-botanical-forest"
                  onClick={() => setIsOpen(false)}
                >
                  Start
                </Link>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-[1.25rem] border px-4 py-3 text-sm font-medium ${
                    pathname === link.href
                      ? "border-botanical-forest bg-botanical-forest text-botanical-cream"
                      : "border-botanical-forest/10 bg-white/70 text-botanical-ink hover:border-botanical-gold/50 hover:bg-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
