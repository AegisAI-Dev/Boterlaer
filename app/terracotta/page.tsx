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
      description: "Perfect voor kamerplanten en kleine plantjes. Van 10cm tot 20cm diameter.",
      icon: "🪴",
      sizes: ["10cm", "15cm", "20cm"],
    },
    {
      title: "Middelgrote Potten",
      description: "Ideaal voor middelgrote planten en struiken. Van 25cm tot 40cm diameter.",
      icon: "🌿",
      sizes: ["25cm", "30cm", "35cm", "40cm"],
    },
    {
      title: "Grote Potten",
      description: "Voor grote planten en bomen. Van 45cm tot 80cm diameter.",
      icon: "🌳",
      sizes: ["45cm", "50cm", "60cm", "80cm"],
    },
    {
      title: "Speciale Vormen",
      description: "Unieke vormen en designs voor bijzondere planten.",
      icon: "✨",
      sizes: ["Verschillende maten"],
    },
  ];

  const benefits = [
    {
      title: "Natuurlijk Materiaal",
      description: "Terracotta is een natuurlijk, poreus materiaal dat ademt en overtollig water afvoert.",
      icon: "🌍",
    },
    {
      title: "Perfect voor Planten",
      description: "De poreuze structuur helpt wortelrot te voorkomen en zorgt voor een gezonde groei.",
      icon: "🌱",
    },
    {
      title: "Tijdloos Design",
      description: "Terracotta potten hebben een warme, tijdloze uitstraling die bij elke tuinstijl past.",
      icon: "⏳",
    },
    {
      title: "Duurzaam",
      description: "Goed onderhouden terracotta potten gaan jarenlang mee en worden alleen mooier met de tijd.",
      icon: "♻️",
    },
  ];

  const careTips = [
    "Bescherm potten tegen vorst in de winter",
    "Reinig potten regelmatig met water en een zachte borstel",
    "Gebruik potscherven of hydrokorrels voor drainage",
    "Verplaats grote potten voorzichtig om breuk te voorkomen",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50">
      {/* Hero Section - Terracotta Colors */}
      <section 
        className="relative h-[400px] md:h-[500px] flex items-center justify-center text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d2691e 0%, #cd853f 25%, #daa520 50%, #b8860b 75%, #8b4513 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-orange-800/80 to-amber-900/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/gallery/Schoonheid van de natuur.png')] bg-cover bg-center opacity-20 z-0"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Terracotta Potten
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-50 max-w-2xl mx-auto drop-shadow-lg">
            Warme, natuurlijke potten die perfect passen bij elke plant. 
            Ontdek onze collectie terracotta potten in verschillende maten en vormen.
          </p>
        </div>
      </section>

      {/* Video Section - Framed */}
      <section className="section-container bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-200">
            <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
              <h2 className="text-2xl font-bold text-center">Terracotta Video</h2>
            </div>
            <div className="aspect-video">
              <VideoPlayer category="terracotta" />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-container bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-900">
            Over Terracotta
          </h2>
          <div className="prose prose-lg max-w-none text-orange-800 space-y-4">
            <p>
              Terracotta, wat letterlijk "gebakken aarde" betekent, is een van de oudste 
              materialen die door de mensheid wordt gebruikt. Deze warme, aardse kleur en 
              natuurlijke textuur maken terracotta potten perfect voor elke tuin of 
              binnenshuis.
            </p>
            <p>
              Onze collectie terracotta potten combineert traditioneel vakmanschap met 
              moderne functionaliteit. Elke pot is zorgvuldig gekozen om zowel esthetisch 
              als praktisch te zijn voor uw planten.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-container bg-gradient-to-br from-orange-100/80 via-amber-100/70 to-yellow-100/80">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-orange-900">
            Onze Collectie
          </h2>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto">
            Van kleine potjes tot grote plantenbakken - voor elke plant de perfecte pot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {potCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-4 text-center">{category.icon}</div>
              <h3 className="text-2xl font-bold text-orange-900 mb-3 text-center">
                {category.title}
              </h3>
              <p className="text-orange-800 mb-4 text-center leading-relaxed">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {category.sizes.map((size, sizeIndex) => (
                  <span
                    key={sizeIndex}
                    className="px-4 py-2 bg-orange-200 text-orange-900 rounded-full text-sm font-medium"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-container bg-gradient-to-r from-orange-200/70 via-amber-200/80 to-yellow-200/70">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-orange-900">
            Waarom Terracotta?
          </h2>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto">
            De voordelen van terracotta potten voor uw planten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-orange-200"
            >
              <div className="text-5xl mb-4 text-center">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-orange-900 mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-orange-800 text-center leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Care Tips Section */}
      <section className="section-container bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 shadow-xl border-2 border-orange-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-900 text-center">
              Verzorgingstips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-white/70 rounded-lg p-4 border border-orange-200"
                >
                  <span className="text-2xl text-orange-600">✓</span>
                  <p className="text-orange-900 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery/Image Section */}
      <section className="section-container bg-gradient-to-br from-orange-100/80 via-amber-100/70 to-yellow-100/80">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-orange-900">
            Terracotta in de Tuin
          </h2>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto">
            Zie hoe terracotta potten perfect passen in elke tuin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Terracotta Masoni 002  - Copy.jpg',
            'Terracotta Masoni 003  - Copy.jpg', 
            'Terracotta Masoni 004  - Copy.jpg',
            'Terracotta Masoni 005  - Copy.jpg',
            'Terracotta Masoni 006  - Copy.jpg',
            'Terracotta Masoni 007  - Copy.jpg',
            'Terracotta Masoni 008  - Copy.jpg',
            'Terracotta Masoni 009  - Copy.jpg',
            'Terracotta Masoni 010  - Copy.jpg'
          ].map((filename, index) => (
            <div
              key={index}
              className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:scale-105"
            >
              <Image
                src={`/images/terracotta/${filename}`}
                alt={`Terracotta pot ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container bg-gradient-to-r from-orange-800 via-amber-800 to-yellow-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
            Interesse in Terracotta Potten?
          </h2>
          <p className="text-xl mb-8 text-orange-50 drop-shadow-md">
            Neem contact op voor meer informatie over onze collectie of om een afspraak te maken.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-orange-900 rounded-lg font-bold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Neem Contact Op
            </Link>
            <Link
              href="/wandeling"
              className="px-8 py-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Bekijk de Tuin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

