"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import walkData from "@/data/walk.json";

interface WalkStop {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  imageWinter?: string;
  imageSummer?: string;
  relatedPlantIds: number[];
}

interface GalleryPhoto {
  id: number;
  path: string;
  alt?: string;
  title?: string;
}

export default function WalkZoneGalleryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Find the walk stop
  const stops: WalkStop[] = walkData;
  const stop = stops.find((s) => s.slug === slug);

  useEffect(() => {
    if (slug) {
      fetchPhotos();
    }
  }, [slug]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`/api/walk-gallery/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  if (!stop) {
    return (
      <div className="section-container">
        <div className="text-center">
          <h1 className="heading-1">Zone niet gevonden</h1>
          <Link href="/wandeling" className="btn-primary mt-4 inline-block">
            Terug naar Wandeling
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <section className="section-container bg-gradient-to-br from-botanical-sage/60 via-botanical-mint/80 to-primary-200/70">
        <div className="text-center max-w-3xl mx-auto">
          <Link
            href="/wandeling"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar Wandeling
          </Link>
          <h1 className="heading-1 drop-shadow-sm">{stop.title}</h1>
          <p className="prose-custom mt-4">Foto Gallery</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-container bg-gradient-to-br from-primary-100/50 via-botanical-mint/40 to-botanical-sand/80">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Foto's laden...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                Nog geen foto's beschikbaar voor deze zone.
              </p>
              <Link href="/wandeling" className="btn-primary inline-block">
                Terug naar Wandeling
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  {photos.length} {photos.length === 1 ? "foto" : "foto's"} beschikbaar
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative h-64 cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={photo.path}
                      alt={photo.alt || photo.title || `${stop.title} - Foto ${index + 1}`}
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
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && photos[selectedPhoto] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selectedPhoto > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedPhoto < photos.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[selectedPhoto].path}
              alt={photos[selectedPhoto].alt || photos[selectedPhoto].title || `${stop.title} - Foto ${selectedPhoto + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {photos[selectedPhoto].title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                <p className="text-lg font-medium">{photos[selectedPhoto].title}</p>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
