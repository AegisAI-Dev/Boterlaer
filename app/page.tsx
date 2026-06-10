import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welkom in de Botanische Tuin Den Boterlaer - Een privé hobbytuin met bijzondere planten. Maak een virtuele wandeling en ontdek de collectie.",
};

export default function Home() {
  const mapZones = [
    {
      title: "Plantencollectie",
      description: "Herbariumfiches, taxonomie en bijzondere exemplaren.",
      href: "/plants",
      tone: "lg:col-span-2",
    },
    {
      title: "Wandeling",
      description: "Volg de paden door zones, seizoenen en verhalen.",
      href: "/wandeling",
      tone: "lg:translate-y-8",
    },
    {
      title: "Historiek",
      description: "Lees hoe de tuin groeide vanuit een persoonlijke passie.",
      href: "/about",
      tone: "lg:-translate-y-6",
    },
    {
      title: "Galerij",
      description: "Fotografie, details en een visueel archief van de tuin.",
      href: "/gallery",
      tone: "",
    },
    {
      title: "Verhalen & notities",
      description: "Blogartikels, observaties en updates vanuit de tuin.",
      href: "/blog",
      tone: "lg:col-span-2",
    },
  ];

  const seasonalMoments = [
    {
      season: "Lente",
      text: "Nieuwe scheuten, eerste bloei en een tuin die langzaam openvouwt.",
    },
    {
      season: "Zomer",
      text: "Volle borders, geurende paden en de rijkste kleuren van het jaar.",
    },
    {
      season: "Najaar",
      text: "Zaaddozen, terracotta tonen en een stillere botanische gelaagdheid.",
    },
  ];

  const notebookCards = [
    {
      title: "Bijen en bestuiving",
      description:
        "Een natuurlijke kruisbestuiving tussen plantenliefde, observatie en imkerij.",
      href: "/bijen",
    },
    {
      title: "Terracotta collectie",
      description:
        "Objecten en materialen die de tuin visueel verankeren in aarde en ambacht.",
      href: "/terracotta",
    },
    {
      title: "Contact & bezoek",
      description:
        "Interesse in de tuin of een plant? Neem contact op voor meer informatie.",
      href: "/contact",
    },
  ];

  return (
    <div className="garden-shell overflow-hidden">
      <section className="section-container pb-10 pt-10 md:pb-14 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.15fr] lg:items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div>
              <p className="eyebrow">Digitale ontdekkingstocht</p>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] text-botanical-forest md:text-7xl lg:text-[5.5rem]">
                Een botanische kaart als begin van de wandeling.
              </h1>
              <p className="prose-custom mt-6 max-w-2xl">
                Den Boterlaer is geen klassieke website, maar een langzaam
                ontvouwende tuin. Verken de collectie, dwaal door beelden en
                volg de paden die verhalen, seizoenen en planten met elkaar
                verbinden.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/wandeling" className="btn-primary">
                Start de wandeling
              </Link>
              <Link href="/plants" className="btn-outline">
                Open het herbarium
              </Link>
            </div>

            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Tuinnotitie
              </p>
              <p className="mt-3 text-base leading-8 text-botanical-ink">
                Dit is een privé hobbytuin. De website deelt observaties,
                beelden en plantkennis, maar vormt geen publieke bezoekerssite.
              </p>
            </div>
          </div>

          <div className="paper-panel rounded-[2.5rem] px-5 py-5 sm:px-7 sm:py-7">
            <div className="mb-6 flex flex-col gap-4 border-b border-botanical-forest/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                  Botanische kaart
                </p>
                <h2 className="mt-3 font-display text-4xl text-botanical-forest">
                  Kies een zone en laat de tuin zich openen.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-7 text-botanical-ink/80">
                Elke halte verwijst naar een bestaand onderdeel van de site en
                behoudt de huidige inhoud en functionaliteit.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {mapZones.map((zone) => (
                <Link
                  key={zone.href}
                  href={zone.href}
                  className={`map-pin botanical-panel relative min-h-[180px] rounded-[1.75rem] p-5 hover:-translate-y-1 hover:bg-white ${zone.tone}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-gold">
                    Zone
                  </p>
                  <h3 className="mt-8 font-display text-3xl text-botanical-forest">
                    {zone.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-botanical-ink/80">
                    {zone.description}
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-botanical-moss">
                    Open pad
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="botanical-panel rounded-[2.25rem] p-6 md:p-8">
            <p className="eyebrow">Seizoensbloei</p>
            <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
              De tuin verandert van bladzijde met het licht van het seizoen.
            </h2>
            <p className="prose-custom mt-5">
              Niet elke zone toont zich op dezelfde manier. Daarom leest de
              website als een reeks botanische stemmingen in plaats van een
              strak raster van kaarten.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {seasonalMoments.map((item) => (
              <div key={item.season} className="paper-panel rounded-[1.75rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                  {item.season}
                </p>
                <p className="mt-6 font-display text-3xl text-botanical-forest">
                  {item.season}
                </p>
                <p className="mt-4 text-sm leading-7 text-botanical-ink/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[440px] overflow-hidden rounded-[2.5rem] border border-botanical-forest/10 shadow-botanical">
            <Image
              src="/images/gallery/Schoonheid van de natuur.png"
              alt="Overzicht van de tuin"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-botanical-forest/70 via-botanical-forest/10 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-xl p-6 text-botanical-cream md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                Historiek en sfeer
              </p>
              <p className="mt-4 font-display text-4xl leading-tight">
                Van persoonlijke verzameling naar een digitaal herbarium vol
                verhalen.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="eyebrow">Wortels van de tuin</p>
              <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
                Elke plant krijgt een plek, elke zone een eigen sfeer.
              </h2>
            </div>
            <div className="space-y-4 prose-custom">
              <p>
                Deze botanische tuin groeide niet vanuit een standaardplan,
                maar vanuit nieuwsgierigheid, observatie en zorg. Dat ritme
                wordt nu ook voelbaar in de interface.
              </p>
              <p>
                In plaats van een generieke homepage ontvouwt de structuur zich
                via labels, kaarten, foto’s en rustige overgangen die meer doen
                denken aan een atlas dan aan een klassieke bedrijfswebsite.
              </p>
            </div>
            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-moss">
                Volgende halte
              </p>
              <p className="mt-3 text-base leading-8 text-botanical-ink">
                Ontdek het verhaal achter de tuin, de eigenaar en de groei van
                de collectie.
              </p>
              <Link href="/about" className="garden-link mt-5">
                Lees de historiek
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="paper-panel rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">Werktafel</p>
              <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
                Labels, notities en aanverwante collecties liggen verspreid als
                objecten op een tafel van een tuinier.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {notebookCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="botanical-panel rounded-[1.75rem] p-5 hover:-translate-y-1 hover:bg-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-gold">
                    Notitie
                  </p>
                  <h3 className="mt-6 font-display text-3xl text-botanical-forest">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-botanical-ink/80">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="rounded-[2.5rem] bg-botanical-forest px-6 py-10 text-botanical-cream shadow-botanical md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                Verder wandelen
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl">
                Kies je volgende pad: beelden, collectie of rechtstreeks contact.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/20"
              >
                Bezoek galerij
              </Link>
              <Link href="/contact" className="btn-secondary">
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
