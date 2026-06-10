import Link from "next/link";
import { getSettings } from "@/lib/settings";

const Footer = () => {
  const settings = getSettings();
  const socialLinks = [
    { href: settings.social.facebook, label: "Facebook" },
    { href: settings.social.instagram, label: "Instagram" },
    { href: settings.social.youtube, label: "YouTube" },
  ].filter((item) => item.href);

  return (
    <footer className="relative overflow-hidden border-t border-botanical-forest/10 bg-[#e7eadb]">
      <div className="absolute inset-x-0 bottom-0 top-24 bg-gradient-to-b from-transparent via-botanical-sage/35 to-botanical-moss/35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-botanical-forest" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="paper-panel overflow-hidden rounded-[2.5rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Tuinbed van informatie</p>
              <h2 className="mt-4 font-display text-4xl text-botanical-forest md:text-5xl">
                Praktische info tussen bladeren, paden en adressen.
              </h2>
            </div>
            <div className="max-w-md rounded-[1.75rem] border border-botanical-gold/30 bg-white/70 px-5 py-4 text-sm leading-7 text-botanical-ink">
              <p className="font-semibold uppercase tracking-[0.16em] text-botanical-moss">
                Belangrijk
              </p>
              <p className="mt-2">
                Deze tuin is privé en niet vrij toegankelijk. Bezoek is enkel
                mogelijk na persoonlijk overleg.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr_0.9fr]">
            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Tuinportret
              </p>
              <h3 className="mt-3 font-display text-3xl text-botanical-forest">
                {settings.site.name}
              </h3>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-botanical-ink">
                {settings.site.description}
              </p>
            </div>

            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Contact
              </p>
              <div className="mt-4 space-y-3 text-base leading-7 text-botanical-ink">
                {settings.contact.address.name && (
                  <p className="font-semibold">{settings.contact.address.name}</p>
                )}
                {settings.contact.address.street && <p>{settings.contact.address.street}</p>}
                {settings.contact.address.city && <p>{settings.contact.address.city}</p>}
                {settings.contact.address.country && <p>{settings.contact.address.country}</p>}
                {settings.contact.email && (
                  <p className="pt-2">
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="text-botanical-forest underline decoration-botanical-gold/70 underline-offset-4 hover:text-botanical-moss"
                    >
                      {settings.contact.email}
                    </a>
                  </p>
                )}
                {settings.contact.note && (
                  <p className="rounded-[1.25rem] border border-botanical-forest/10 bg-botanical-cream px-4 py-3 text-sm">
                    {settings.contact.note}
                  </p>
                )}
              </div>
            </div>

            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Paden
              </p>
              <div className="mt-4 space-y-3">
                <Link href="/wandeling" className="garden-link">
                  Virtuele wandeling
                </Link>
                <Link href="/plants" className="garden-link">
                  Plantencollectie
                </Link>
                <Link href="/gallery" className="garden-link">
                  Beeldgalerij
                </Link>
                <Link href="/contact" className="garden-link">
                  Contact
                </Link>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                    Sociale media
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-botanical-forest/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-botanical-forest hover:border-botanical-gold/50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 botanical-divider" />
          <div className="mt-6 flex flex-col gap-3 text-sm text-botanical-ink/80 md:flex-row md:items-center md:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {settings.site.name}. Alle rechten
              voorbehouden.
            </p>
            <p className="uppercase tracking-[0.18em] text-botanical-moss">
              Digitale wandeling door een privétuin
            </p>
          </div>
        </div>

        <div className="pointer-events-none relative -mt-10 flex h-40 items-end justify-between overflow-hidden px-2 text-[#d9e6c9]">
          <div className="flex items-end gap-2">
            <span className="h-16 w-8 rounded-t-full bg-[#d9e6c9]" />
            <span className="h-24 w-10 rounded-t-full bg-[#bdd0af]" />
            <span className="h-20 w-8 rounded-t-full bg-[#d9e6c9]" />
            <span className="h-28 w-12 rounded-t-full bg-[#b1c49f]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="h-20 w-8 rounded-t-full bg-[#c1d2b2]" />
            <span className="h-32 w-12 rounded-t-full bg-[#d9e6c9]" />
            <span className="h-16 w-7 rounded-t-full bg-[#b1c49f]" />
            <span className="h-24 w-10 rounded-t-full bg-[#d9e6c9]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
