import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

export const metadata: Metadata = {
  title: "Terracotta Potten",
  description:
    "Ontdek onze collectie terracotta potten. Warme, natuurlijke potten die perfect passen bij elke plant. Van kleine potjes tot grote plantenbakken.",
};

export default function TerracottaPage() {
  const potCategories = [
    {
      title: "Kleine Potten",
      description: "Perfect voor kamerplanten en kleine plantjes.",
      sizes: ["10cm", "15cm", "20cm"],
    },
    {
      title: "Middelgrote",
      description: "Ideaal voor middelgrote planten en struiken.",
      sizes: ["25cm", "30cm", "35cm", "40cm"],
    },
    {
      title: "Grote Potten",
      description: "Voor grote planten en bomen.",
      sizes: ["45cm", "50cm", "60cm", "80cm"],
    },
    {
      title: "Speciale Vormen",
      description: "Unieke vormen en designs voor bijzondere planten.",
      sizes: ["Verschillende maten"],
    },
  ];

  const benefits = [
    {
      title: "Natuurlijk Materiaal",
      description: "Terracotta is een natuurlijk, poreus materiaal dat ademt en overtollig water afvoert.",
    },
    {
      title: "Perfect voor Planten",
      description: "De poreuze structuur helpt wortelrot te voorkomen en zorgt voor een gezonde groei.",
    },
    {
      title: "Tijdloos Design",
      description: "Terracotta potten hebben een warme, tijdloze uitstraling die bij elke tuinstijl past.",
    },
    {
      title: "Duurzaam",
      description: "Goed onderhouden terracotta potten gaan jarenlang mee en worden alleen mooier met de tijd.",
    },
  ];

  const careTips = [
    "Bescherm potten tegen vorst in de winter",
    "Reinig potten regelmatig met water en een zachte borstel",
    "Gebruik potscherven of hydrokorrels voor drainage",
    "Verplaats grote potten voorzichtig om breuk te voorkomen",
  ];

  const galleryImages = [
    'Terracotta Masoni 002  - Copy.jpg',
    'Terracotta Masoni 003  - Copy.jpg', 
    'Terracotta Masoni 004  - Copy.jpg',
    'Terracotta Masoni 005  - Copy.jpg',
    'Terracotta Masoni 006  - Copy.jpg',
    'Terracotta Masoni 007  - Copy.jpg',
    'Terracotta Masoni 008  - Copy.jpg',
    'Terracotta Masoni 009  - Copy.jpg',
    'Terracotta Masoni 010  - Copy.jpg'
  ];

  return (
    <div className="garden-shell overflow-hidden">
      {/* Hero Section */}
      <section className="section-container pb-10 pt-10 md:pb-14 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div>
              <p className="eyebrow !text-secondary-600 before:!bg-secondary-600">Natuurlijk materiaal</p>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] text-secondary-900 md:text-7xl lg:text-[5.5rem]">
                Terracotta: De warme aarding van de tuin.
              </h1>
              <p className="prose-custom mt-6 max-w-2xl !text-secondary-800">
                Terracotta, wat letterlijk "gebakken aarde" betekent, is een van de oudste 
                materialen die door de mensheid wordt gebruikt. Deze warme, aardse kleur en 
                natuurlijke textuur maken onze terracotta potten perfect voor elke plant.
              </p>
            </div>

            <div className="botanical-panel rounded-[2rem] p-6 !border-secondary-200">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-600">
                Vakmanschap
              </p>
              <p className="mt-3 text-base leading-8 text-secondary-900">
                Onze collectie terracotta potten combineert traditioneel vakmanschap met 
                moderne functionaliteit. Elke pot is zorgvuldig gekozen om zowel esthetisch 
                als praktisch te zijn voor uw planten.
              </p>
            </div>
          </div>

          {/* Video Panel */}
          <div className="paper-panel rounded-[2.5rem] p-5 sm:p-7 !border-secondary-200">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-600">
                Video Collectie
              </p>
              <h2 className="mt-3 font-display text-3xl text-secondary-900">
                Terracotta in beeld
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-paper">
              <div className="aspect-video w-full bg-secondary-50">
                <VideoPlayer category="terracotta" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-container py-8 md:py-10">
        <div className="paper-panel rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10 !border-secondary-200">
          <div className="mb-8 flex flex-col gap-4 border-b border-secondary-200/50 pb-6">
            <p className="eyebrow !text-secondary-600 before:!bg-secondary-600">Onze Collectie</p>
            <h2 className="mt-2 font-display text-4xl text-secondary-900">
              Voor elke plant de perfecte pot.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {potCategories.map((category) => (
              <div
                key={category.title}
                className="botanical-panel rounded-[1.75rem] p-5 hover:-translate-y-1 hover:bg-secondary-50/50 !border-secondary-200/60"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-600">
                  Formaat
                </p>
                <h3 className="mt-6 font-display text-2xl text-secondary-900">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-secondary-800">
                  {category.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.sizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="inline-flex rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-800"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Care Tips */}
      <section className="section-container py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-secondary-600 before:!bg-secondary-600">Waarom Terracotta?</p>
              <h2 className="mt-5 font-display text-4xl text-secondary-900 md:text-5xl">
                Natuurlijke voordelen
              </h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="botanical-panel rounded-[1.75rem] p-5 !border-secondary-200">
                  <h3 className="font-display text-xl text-secondary-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-secondary-800">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="botanical-panel rounded-[2.5rem] p-6 md:p-8 !bg-secondary-50/80 !border-secondary-200">
            <p className="eyebrow !text-secondary-600 before:!bg-secondary-600">Notities van de tuinier</p>
            <h2 className="mt-5 font-display text-4xl text-secondary-900">
              Verzorgingstips
            </h2>
            <div className="mt-8 space-y-4">
              {careTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4 rounded-2xl bg-white/60 p-4 shadow-sm border border-secondary-100">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-xs font-bold text-secondary-800">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-secondary-900">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-container py-8 md:py-10">
        <div className="paper-panel rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10 !border-secondary-200">
          <div className="mb-8 text-center">
            <h2 className="font-display text-4xl text-secondary-900">
              Terracotta in de Tuin
            </h2>
            <p className="mt-4 text-secondary-800">Zie hoe terracotta potten perfect passen in elke tuin</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {galleryImages.map((filename, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={`/images/terracotta/${filename}`}
                  alt={`Terracotta pot ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container pt-6">
        <div className="rounded-[2.5rem] bg-secondary-800 px-6 py-10 text-secondary-50 shadow-botanical md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-300">
                Interesse?
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl">
                Neem contact op voor meer informatie of een afspraak.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                href="/wandeling"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/20"
              >
                Bekijk de tuin
              </Link>
              <Link href="/contact" className="btn-secondary !bg-white !text-secondary-900 hover:!bg-secondary-50">
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
