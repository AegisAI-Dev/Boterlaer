import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bijen & Imker",
  description:
    "Ontdek de bijenkolonies in de Botanische Tuin Den Boterlaer. Leer meer over imkeren, bijenhouderij en de belangrijke rol van bijen in de tuin.",
};

export default function BijenPage() {
  const beeFacts = [
    {
      icon: "🐝",
      title: "Honingbijen",
      description:
        "Onze honingbijen verzamelen nectar en stuifmeel uit de diverse bloemen in de tuin. Ze produceren heerlijke honing en zorgen voor bestuiving.",
    },
    {
      icon: "🌺",
      title: "Bestuiving",
      description:
        "Bijen zijn essentieel voor de bestuiving van veel planten in de tuin. Zonder bijen zouden veel bloemen geen vruchten kunnen dragen.",
    },
    {
      icon: "🍯",
      title: "Honing",
      description:
        "De bijen produceren honing van de verschillende bloemen in de tuin, wat resulteert in unieke smaken per seizoen.",
    },
    {
      icon: "🌿",
      title: "Biodiversiteit",
      description:
        "Door bijen te houden dragen we bij aan de biodiversiteit en het behoud van deze belangrijke bestuivers.",
    },
  ];

  const beeFriendlyPlants = [
    {
      name: "Lavendel",
      image: "/images/gallery/Lavender Dreams.png",
      description: "Lavendel is een favoriet bij bijen en trekt ze aan met zijn geurige bloemen.",
    },
    {
      name: "Zonnebloemen",
      image: "/images/gallery/Wilde zonnebloemen.png",
      description: "Zonnebloemen zijn een belangrijke voedselbron voor bijen in de zomer.",
    },
    {
      name: "Klaver",
      image: "/images/gallery/Prachtige karmozijnrode klaver.png",
      description: "Klaver is een uitstekende nectar- en stuifmeelbron voor bijen.",
    },
    {
      name: "Wilde bloemen",
      image: "/images/gallery/Wilde bloemen en bokeh.png",
      description: "Wilde bloemenmengsels bieden een gevarieerd menu voor bijen door het seizoen.",
    },
  ];

  return (
    <div className="garden-shell overflow-hidden">
      <div 
        className="fixed inset-0 -z-[5]"
        style={{
          background: `
            url("/images/ui/garden-pattern.svg"),
            radial-gradient(circle at top left, rgba(168, 187, 162, 0.42), transparent 30%),
            radial-gradient(circle at top right, rgba(200, 107, 74, 0.12), transparent 22%),
            linear-gradient(180deg, rgba(251, 248, 240, 0.74) 0%, rgba(248, 245, 236, 0.62) 38%, rgba(242, 237, 224, 0.74) 100%),
            url("/images/ui/BijenAchtergrond.png")
          `,
          backgroundRepeat: 'repeat, no-repeat, no-repeat, no-repeat, no-repeat',
          backgroundSize: '920px 920px, auto, auto, auto, cover',
          backgroundPosition: '0 0, top left, top right, top, center',
        }}
      />
      <section className="section-container pb-10 pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">Bijen en imkerij</p>
            <h1 className="font-display text-5xl leading-[0.96] text-botanical-forest md:text-7xl">
              Bestuivers vormen het onzichtbare ritme van de tuin.
            </h1>
            <p className="prose-custom max-w-2xl">
              Als imker komen plantenliefde en observatie van de natuur hier op
              een heel directe manier samen. De tuin voedt de bijen, en de bijen
              geven de tuin beweging, bestuiving en continuiteit.
            </p>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-5 sm:p-7">
            <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-botanical-forest/10">
              <Image
                src="/images/gallery/Honingbij.png"
                alt="Honingbij op bloem"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-forest/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-botanical-cream md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                  In de tuin
                </p>
                <p className="mt-4 max-w-xl font-display text-4xl leading-tight">
                  Bijenkolonies ondersteunen bestuiving en verdiepen de
                  biodiversiteit van Den Boterlaer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <p className="eyebrow">Imkeren als passie</p>
            <h2 className="font-display text-4xl text-botanical-forest md:text-5xl">
              Een botanische tuin en bijenhouderij versterken elkaar vanzelf.
            </h2>
            <div className="space-y-4 prose-custom">
              <p>
                Naast het tuinieren is imkeren een tweede laag in dezelfde
                fascinatie: observeren hoe natuur, timing en zorg in elkaar
                grijpen.
              </p>
              <p>
                De bijen verzamelen nectar en stuifmeel uit de verschillende
                bloemen in de tuin, wat resulteert in honing met unieke smaken
                per seizoen en per bloeifase.
              </p>
              <p>
                Tegelijk draagt het houden van bijen bij aan het behoud van deze
                belangrijke bestuivers, die wereldwijd onder druk staan.
              </p>
            </div>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-5 sm:p-7">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-botanical-forest/10">
              <Image
                src="/images/gallery/Zomerhommel.png"
                alt="Zomerhommel op bloem"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="paper-panel rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Waarom bijen belangrijk zijn</p>
            <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
              Vier notities over bestuiving, honing en biodiversiteit.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {beeFacts.map((fact, index) => (
              <div
                key={index}
                className={`botanical-panel rounded-[1.75rem] p-6 ${
                  index % 2 === 0 ? "xl:translate-y-4" : "xl:-translate-y-4"
                }`}
              >
                <div className="text-4xl">{fact.icon}</div>
                <h3 className="mt-6 font-display text-3xl text-botanical-forest">
                  {fact.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-botanical-ink/80">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="eyebrow">Bijvriendelijke planten</p>
            <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
              Een bloemrijke tafel voor nectar en stuifmeel doorheen het seizoen.
            </h2>
            <p className="prose-custom mt-5">
              Veel planten in de tuin zijn niet alleen gekozen om hun vorm of
              kleur, maar ook om hun waarde voor bestuivers.
            </p>
            <Link href="/plants" className="btn-primary mt-8 inline-flex">
              Bekijk alle bijvriendelijke planten
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {beeFriendlyPlants.map((plant, index) => (
              <div
                key={index}
                className={`group overflow-hidden rounded-[2rem] border border-botanical-forest/10 bg-white/70 shadow-paper ${
                  index % 2 === 0 ? "sm:translate-y-6" : ""
                }`}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={plant.image}
                    alt={plant.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-gold">
                    Voedselbron
                  </p>
                  <h3 className="mt-4 font-display text-3xl text-botanical-forest">
                    {plant.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-botanical-ink/80">
                    {plant.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="paper-panel rounded-[2.5rem] p-5 sm:p-7">
            <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] border border-botanical-forest/10">
              <Image
                src="/images/gallery/Vlinder op bloem.png"
                alt="Vlinder en bijen op bloemen"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="eyebrow">De verbinding</p>
            <h2 className="font-display text-4xl text-botanical-forest md:text-5xl">
              Bloemen, bestuivers en observatie vormen samen een levend netwerk.
            </h2>
            <div className="space-y-4 prose-custom">
              <p>
                Het observeren van bijen die van bloem naar bloem vliegen toont
                heel direct de symbiose tussen planten en bestuivers.
              </p>
              <p>
                Die relatie maakt de tuin niet alleen rijker in beeld, maar ook
                sterker in ecologisch evenwicht.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="rounded-[2.5rem] bg-botanical-forest px-6 py-10 text-botanical-cream shadow-botanical md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                Meer ontdekken
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl">
                Verken de planten of volg de wandeling door de zones waar
                bestuivers actief zijn.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/plants" className="btn-secondary">
                Bekijk planten
              </Link>
              <Link
                href="/wandeling"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/20"
              >
                Start wandeling
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
