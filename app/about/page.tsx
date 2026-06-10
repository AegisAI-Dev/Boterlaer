import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Over de Tuin",
  description:
    "Leer meer over de geschiedenis en het verhaal achter de Botanische Tuin Den Boterlaer. Een persoonlijk hobbyproject ontstaan uit passie voor planten en natuur.",
};

export default function AboutPage() {
  const milestones = [
    {
      year: "2005",
      title: "Het Begin",
      description:
        "De eerste planten werden aangeplant. Wat begon als een kleine moestuin groeide uit tot een passie voor bijzondere planten.",
    },
    {
      year: "2010",
      title: "Uitbreiding",
      description:
        "De tuin werd uitgebreid met nieuwe borders en een vijverzone. De plantencollectie groeide gestaag.",
    },
    {
      year: "2015",
      title: "Schaduwzone",
      description:
        "Aanleg van een schaduwrijk deel met varens en hostas onder de grote bomen.",
    },
    {
      year: "2020",
      title: "Online Delen",
      description:
        "Start van dit project om de tuin online te delen met andere plantenliefhebbers.",
    },
    {
      year: "2025",
      title: "Vandaag",
      description:
        "De tuin blijft groeien en evolueren. Elk seizoen brengt nieuwe uitdagingen en mooie momenten.",
    },
  ];

  return (
    <div className="garden-shell overflow-hidden">
      <section className="section-container pb-10 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">Historiek van de tuin</p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.96] text-botanical-forest md:text-7xl">
              Een verhaal dat groeide vanuit aarde, tijd en aandacht.
            </h1>
            <p className="prose-custom max-w-2xl">
              Achter Den Boterlaer schuilt geen commercieel project, maar een
              tuin die stap voor stap is gegroeid vanuit verwondering voor
              planten, seizoenen en biodiversiteit.
            </p>
            <div className="botanical-panel max-w-xl rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Samenvatting
              </p>
              <p className="mt-3 text-base leading-8 text-botanical-ink">
                Wat begon als een bescheiden verzameling evolueerde naar een
                persoonlijke botanische plek vol experiment, observatie en zorg.
              </p>
            </div>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-5 sm:p-7">
            <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-botanical-forest/10">
              <Image
                src="/images/gallery/Natuurlijke ontmoetingen.png"
                alt="Geschiedenis van de tuin"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-forest/65 via-botanical-forest/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-botanical-cream md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                  Oorsprong
                </p>
                <p className="mt-4 max-w-lg font-display text-4xl leading-tight">
                  Van eenvoudige moestuin naar gelaagde collectie met een eigen
                  karakter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <p className="eyebrow">Het verhaal</p>
            <h2 className="font-display text-4xl text-botanical-forest md:text-5xl">
              De collectie groeide via ontmoetingen, reizen en toevallige vondsten.
            </h2>
            <div className="space-y-4 prose-custom">
              <p>
                Sommige planten kwamen als stekje van vrienden, andere werden
                onderweg ontdekt of bleken onverwacht perfect te passen in een
                specifieke hoek van de tuin.
              </p>
              <p>
                Zo ontstond niet alleen een verzameling, maar ook een levend
                archief van keuzes, seizoenen en experimenten. Elke plant draagt
                een herinnering, een les of een nieuw vertrekpunt in zich.
              </p>
              <p>
                Via deze website wordt dat verhaal gedeeld in een vorm die meer
                aanvoelt als een herbarium dan als een traditionele
                informatiesite.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="botanical-panel rounded-[2rem] p-6 sm:translate-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                Curatie
              </p>
              <p className="mt-4 font-display text-3xl text-botanical-forest">
                Niet alles wordt geplant. Alles wordt gekozen.
              </p>
            </div>
            <div className="paper-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Ritme
              </p>
              <p className="mt-4 font-display text-3xl text-botanical-forest">
                De tuin verandert mee met licht, bodem en seizoen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="paper-panel order-2 rounded-[2.5rem] p-5 sm:p-7 lg:order-1">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-botanical-forest/10">
              <Image
                src="/images/gallery/werken in de regen 2.png"
                alt="Tuinier in de tuin"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-botanical-forest/70 via-transparent to-transparent" />
            </div>
          </div>

          <div className="order-1 space-y-5 lg:order-2">
            <p className="eyebrow">De tuinier</p>
            <h2 className="font-display text-4xl text-botanical-forest md:text-5xl">
              Een tuin leert geduld, aandacht en respect voor het kleine.
            </h2>
            <div className="space-y-4 prose-custom">
              <p>
                Veel kennis ontstond door te proberen, te observeren en
                voortdurend bij te sturen. Niet vanuit schema’s alleen, maar
                vanuit de praktijk van bodem, regen, schaduw en herstel.
              </p>
              <p>
                Die persoonlijke aanpak maakt de tuin tegelijk intiem en rijk:
                een plek waar planten niet alleen verzameld worden, maar ook
                gevolgd, verzorgd en beter begrepen.
              </p>
            </div>
            <blockquote className="botanical-panel rounded-[2rem] border-l-4 border-l-botanical-gold p-6 text-lg leading-8 text-botanical-ink">
              "Planten hebben me geduld geleerd, respect voor de natuur, en het
              belang van de kleine dingen."
            </blockquote>
            <div className="rounded-[1.75rem] border border-botanical-forest/10 bg-white/70 px-5 py-4 text-sm leading-7 text-botanical-ink">
              <strong>Belangrijk:</strong> dit blijft een privé hobbytuin en is
              niet vrij toegankelijk voor publiek.
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="paper-panel rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Tijdlijn als boom</p>
            <h2 className="mt-5 font-display text-4xl text-botanical-forest md:text-5xl">
              Wortels, stam, takken en bloemen markeren belangrijke momenten.
            </h2>
            <p className="prose-custom mt-5">
              De ontwikkeling van de tuin leest als een boomstructuur: ontstaan,
              groei, uitbreiding en telkens nieuwe bloei.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[180px_1fr]">
            <div className="hidden lg:block">
              <div className="sticky top-32 rounded-full border border-botanical-gold/40 bg-botanical-cream px-6 py-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                  Stam
                </p>
                <p className="mt-4 font-display text-5xl text-botanical-forest">
                  Groei
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-[2rem] border border-botanical-forest/10 bg-white/70 p-5 shadow-paper md:grid-cols-[120px_1fr] md:items-start"
                >
                  <div className="rounded-[1.5rem] bg-botanical-forest px-4 py-5 text-center text-botanical-cream">
                    <p className="text-xs uppercase tracking-[0.24em] text-botanical-gold">
                      Bloei
                    </p>
                    <p className="mt-3 font-display text-4xl">{milestone.year}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-botanical-forest/10 bg-botanical-cream/80 p-5">
                    <h3 className="font-display text-3xl text-botanical-forest">
                      {milestone.title}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-botanical-ink">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="rounded-[2.5rem] bg-botanical-forest px-6 py-10 text-botanical-cream shadow-botanical md:px-10">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
              Visie
            </p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl">
              Een persoonlijke oase waar planten kunnen gedijen en botanische
              nieuwsgierigheid zichtbaar wordt.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-botanical-cream/90">
              Den Boterlaer blijft groeien als een plek waar zorg, biodiversiteit
              en liefde voor planten samenkomen. Deze website vertaalt die visie
              naar een rustige, gelaagde en duurzame digitale ervaring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
