"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

const galleryImages = [
  {
    src: "/images/gallery/Lenteachtergrond 1.png",
    alt: "Lenteachtergrond",
  },
  {
    src: "/images/gallery/Schoonheid van de natuur.png",
    alt: "Schoonheid van de natuur",
  },
  {
    src: "/images/gallery/Clematis pracht.png",
    alt: "Clematis pracht",
  },
  {
    src: "/images/gallery/Dahlia Druppels.png",
    alt: "Dahlia druppels",
  },
  {
    src: "/images/gallery/forget me not.png",
    alt: "Forget me not",
  },
  {
    src: "/images/gallery/Fragile beauty.png",
    alt: "Fragile beauty",
  },
  {
    src: "/images/gallery/Het leven omarmen.png",
    alt: "Het leven omarmen",
  },
  {
    src: "/images/gallery/Honingbij.png",
    alt: "Honingbij",
  },
  {
    src: "/images/gallery/I Dream Of Daisies.png",
    alt: "I Dream Of Daisies",
  },
  {
    src: "/images/gallery/Ijs op bloem.png",
    alt: "Ijs op bloem",
  },
  {
    src: "/images/gallery/Kleurrijke lente.png",
    alt: "Kleurrijke lente",
  },
  {
    src: "/images/gallery/Knop Schoonheid.png",
    alt: "Knop Schoonheid",
  },
  {
    src: "/images/gallery/Kosmoswereld.png",
    alt: "Kosmoswereld",
  },
  {
    src: "/images/gallery/Lavendelspetter.png",
    alt: "Lavendelspetter",
  },
  {
    src: "/images/gallery/Lavender Dreams.png",
    alt: "Lavender Dreams",
  },
  {
    src: "/images/gallery/Lazuli Lieflijkheid.png",
    alt: "Lazuli Lieflijkheid",
  },
  {
    src: "/images/gallery/Lente in Kopenhagen.png",
    alt: "Lente in Kopenhagen",
  },
  {
    src: "/images/gallery/Lentescène III.png",
    alt: "Lentescène III",
  },
  {
    src: "/images/gallery/Lenteverlichting 2.png",
    alt: "Lenteverlichting",
  },
  {
    src: "/images/gallery/Lila Schoonheid.png",
    alt: "Lila Schoonheid",
  },
  {
    src: "/images/gallery/Little Pasque.png",
    alt: "Little Pasque",
  },
  {
    src: "/images/gallery/lotus.png",
    alt: "Lotus",
  },
  {
    src: "/images/gallery/Natuurlijke ontmoetingen.png",
    alt: "Natuurlijke ontmoetingen",
  },
  {
    src: "/images/gallery/Ochtendgloed.png",
    alt: "Ochtendgloed",
  },
  {
    src: "/images/gallery/Ochtendpracht.png",
    alt: "Ochtendpracht",
  },
  {
    src: "/images/gallery/oplichtende tulp.png",
    alt: "Oplichtende tulp",
  },
  {
    src: "/images/gallery/Orchideeënfamilie.png",
    alt: "Orchideeënfamilie",
  },
  {
    src: "/images/gallery/Peony For Your Thoughts.png",
    alt: "Peony For Your Thoughts",
  },
  {
    src: "/images/gallery/Pink!.png",
    alt: "Pink!",
  },
  {
    src: "/images/gallery/Prachtige karmozijnrode klaver.png",
    alt: "Prachtige karmozijnrode klaver",
  },
  {
    src: "/images/gallery/Psalm 19 1-3-2.png",
    alt: "Psalm 19",
  },
  {
    src: "/images/gallery/Purple dream.png",
    alt: "Purple dream",
  },
  {
    src: "/images/gallery/Rode roos.png",
    alt: "Rode roos",
  },
  {
    src: "/images/gallery/Schoonheid in ons huis.png",
    alt: "Schoonheid in ons huis",
  },
  {
    src: "/images/gallery/Spring is coming.png",
    alt: "Spring is coming",
  },
  {
    src: "/images/gallery/Twee bloemen op blauwe achtergrond.png",
    alt: "Twee bloemen op blauwe achtergrond",
  },
  {
    src: "/images/gallery/Vlinder op bloem.png",
    alt: "Vlinder op bloem",
  },
  {
    src: "/images/gallery/Vlinder op meinachtsalvia.png",
    alt: "Vlinder op meinachtsalvia",
  },
  {
    src: "/images/gallery/Waterlelies 05-09.png",
    alt: "Waterlelies",
  },
  {
    src: "/images/gallery/Waterlelies 9-01.png",
    alt: "Waterlelies",
  },
  {
    src: "/images/gallery/werken in de regen 2.png",
    alt: "Werken in de regen",
  },
  {
    src: "/images/gallery/Wilde bloemen en bokeh.png",
    alt: "Wilde bloemen en bokeh",
  },
  {
    src: "/images/gallery/Wilde bloemen en onkruid.png",
    alt: "Wilde bloemen en onkruid",
  },
  {
    src: "/images/gallery/Wilde bloemen, grassen en een vlinder.png",
    alt: "Wilde bloemen, grassen en een vlinder",
  },
  {
    src: "/images/gallery/Wilde zonnebloemen.png",
    alt: "Wilde zonnebloemen",
  },
  {
    src: "/images/gallery/Zomerhommel.png",
    alt: "Zomerhommel",
  },
  {
    src: "/images/gallery/Zomerregen.png",
    alt: "Zomerregen",
  },
  {
    src: "/images/gallery/A Serene Display Of Blooming Pink Flowers In A Sunlit Garden Background.png",
    alt: "Een serene weergave van bloeiende roze bloemen",
  },
  {
    src: "/images/gallery/flower-2178507_1280.jpg",
    alt: "Bloemen",
  },
  {
    src: "/images/gallery/lavender-flowers-1100x733.jpg",
    alt: "Lavendel bloemen",
  },
  {
    src: "/images/gallery/iso-republic-orange-flower-macro-free-stock-photo-2048x1362.jpg",
    alt: "Oranje bloem macro",
  },
  {
    src: "/images/gallery/iso-republic-wild-rose-close-up-free-stock-photo.jpg",
    alt: "Wilde roos close-up",
  },
  {
    src: "/images/gallery/537d64eaa3f6a8a7c5d420827e1e0eb6.jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/e831e97d1816c6a44e69e167ca7fdbec.jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/eb7700867a701ca85cdd57bf6bf7c7c7.jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/unnamed (18).jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/unnamed (19).jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/unnamed (20).jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/unnamed (21).jpg",
    alt: "Bloemenfoto",
  },
  {
    src: "/images/gallery/500 PX Foto 22.png",
    alt: "Foto 22",
  },
  {
    src: "/images/gallery/500 PX Foto 25.png",
    alt: "Foto 25",
  },
  {
    src: "/images/gallery/500 PX Foto 26.png",
    alt: "Foto 26",
  },
  {
    src: "/images/gallery/500 PX Foto 32.png",
    alt: "Foto 32",
  },
  {
    src: "/images/gallery/500 PX Foto 48.png",
    alt: "Foto 48",
  },
  {
    src: "/images/gallery/500 PX Foto 50.png",
    alt: "Foto 50",
  },
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <div>
      {/* Header Section */}
      <section className="section-container bg-gradient-to-br from-botanical-sage/60 via-botanical-mint/80 to-primary-200/70">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="heading-1 drop-shadow-sm">Galerij</h1>
          <p className="prose-custom">
            Ontdek de schoonheid van de tuin door deze foto's. 
            Klik op een afbeelding om hem op volledig scherm te bekijken.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-container bg-gradient-to-br from-primary-100/50 via-botanical-mint/40 to-botanical-sand/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative h-64 cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="section-container bg-gradient-to-r from-secondary-200/70 via-botanical-earth/80 to-botanical-sand text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-3">Fotografie</h2>
          <p className="prose-custom">
            Deze foto's geven een indruk van de tuin door de seizoenen heen. 
            Van voorjaarsbloei tot herfstverkleuring - elk seizoen heeft zijn 
            eigen charme.
          </p>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}

