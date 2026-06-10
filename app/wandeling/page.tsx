"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import walkData from "@/data/walk.json";

// Type definitions
interface WalkStop {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string; // Legacy field for backward compatibility
  imageWinter?: string;
  imageSummer?: string;
  relatedPlantIds: number[];
}

interface Plant {
  id: number;
  commonName?: string;
  latinName: string;
  description: string;
  image: string;
  category: string;
  family?: string;
  origin?: string;
  floweringPeriod: string;
  heightCm: string | number;
  light: string;
  locationCode: string;
  beeFriendly: boolean;
}

interface Video {
  name: string;
  path: string;
  size: number;
  uploadedAt: string;
  assignedPage: string;
  title?: string;
  description?: string;
  isActive?: boolean;
}


export default function WandelingPage() {
  const stops: WalkStop[] = walkData;
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [season, setSeason] = useState<"winter" | "summer">("summer");
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(true);

  // Fetch videos and plants on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, plantsRes] = await Promise.all([
          fetch("/api/videos-with-assignments", { cache: "no-store", headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } }),
          fetch("/api/plants", { cache: "no-store", headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } })
        ]);

        const videosData = await videosRes.json();
        const plantsData = await plantsRes.json();

        if (videosData.videos) {
          const wandelingVideos = videosData.videos.filter((video: Video) => video.assignedPage === 'wandeling');
          setVideos(wandelingVideos);
        }
        
        setPlants(plantsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setVideosLoading(false);
        setPlantsLoading(false);
      }
    };

    fetchData();
  }, []);


  const currentStop = stops[currentStopIndex];
  const relatedPlants = plants.filter((plant) =>
    currentStop.relatedPlantIds.includes(plant.id)
  );

  // Get the appropriate image based on season, with fallback to legacy image field
  const getCurrentImage = () => {
    if (season === "winter" && currentStop.imageWinter) {
      return currentStop.imageWinter;
    }
    if (season === "summer" && currentStop.imageSummer) {
      return currentStop.imageSummer;
    }
    // Fallback to legacy image field or first available season image
    return currentStop.image || currentStop.imageSummer || currentStop.imageWinter || "";
  };

  const goToNext = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrev = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section className="section-container bg-gradient-to-br from-botanical-sage/60 via-botanical-mint/80 to-primary-200/70">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="heading-1 drop-shadow-sm">Virtuele Wandeling</h1>
          <p className="prose-custom">
            Maak een virtuele wandeling door de verschillende zones van de tuin.
            Ontdek welke planten waar groeien en waarom ze op die specifieke plek staan.
          </p>
          <div className="mt-6 inline-block bg-white/80 px-6 py-3 rounded-full shadow-md">
            <p className="text-lg font-semibold text-primary-700">
              Stap {currentStopIndex + 1} van {stops.length}
            </p>
          </div>
        </div>
      </section>

      {/* Drone Video Section */}
      <section className="section-container bg-gradient-to-br from-primary-100/50 via-botanical-mint/40 to-botanical-sand/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="heading-2 drop-shadow-sm">Bekijk de Tuin vanuit de Lucht</h2>
            <p className="prose-custom">
              Ontdek de tuin vanuit een uniek perspectief met deze drone video's
            </p>
          </div>

          {videosLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Video's laden...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nog geen video's beschikbaar.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${videos.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
              {videos.map((video, index) => (
                <div key={video.path} className="card p-4 bg-white shadow-xl">
                  <h3 className="text-xl font-bold text-accent mb-4 text-center">
                    {video.name.replace(/^\d+_/, '').replace(/\.(mp4|webm|ogg)$/i, '')}
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src={video.path} type={`video/${video.path.split('.').pop()}`} />
                      Je browser ondersteunt geen video.
                    </video>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {(video.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Current Stop */}
      <section className="section-container bg-gradient-to-br from-primary-100/50 via-botanical-mint/40 to-botanical-sand/80">
        <div className="max-w-5xl mx-auto">
          {/* Season Selector */}
          {(currentStop.imageWinter || currentStop.imageSummer) && (
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-lg border-2 border-primary-300 bg-white p-1 shadow-md">
                <button
                  onClick={() => setSeason("summer")}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${season === "summer"
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  ☀️ Zomer
                </button>
                <button
                  onClick={() => setSeason("winter")}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${season === "winter"
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  ❄️ Winter
                </button>
              </div>
            </div>
          )}

          {/* Stop Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl mb-8">
            <Image
              src={getCurrentImage()}
              alt={`${currentStop.title} - ${season === "summer" ? "Zomer" : "Winter"}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {currentStop.title}
              </h2>
            </div>
          </div>

          {/* Stop Description */}
          <div className="card p-8 mb-8 bg-gradient-to-br from-botanical-sand via-botanical-mint/60 to-primary-100">
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentStop.description}
            </p>
            {/* Meer foto's link */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <a
                href={`/wandeling/${currentStop.slug}/fotos`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
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
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meer foto's van {currentStop.title}
              </a>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-12">
            <button
              onClick={goToPrev}
              disabled={currentStopIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
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
              Vorige
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {currentStopIndex + 1} / {stops.length}
              </p>
            </div>

            <button
              onClick={goToNext}
              disabled={currentStopIndex === stops.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
            >
              Volgende
              <svg
                className="w-5 h-5"
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
          </div>
        </div>
      </section>

      {/* Related Plants Section */}
      {relatedPlants.length > 0 && (
        <section className="section-container bg-gradient-to-r from-secondary-200/70 via-botanical-earth/80 to-botanical-sand">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="heading-2 drop-shadow-sm">Planten in deze Zone</h2>
              <p className="prose-custom">
                Deze planten vind je in {currentStop.title.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPlants.map((plant) => (
                <div key={plant.id} className="card group">
                  <div className="relative h-48 overflow-hidden bg-botanical-sage/20 flex items-center justify-center">
                    {plant.image ? (
                      <Image
                        src={plant.image}
                        alt={plant.latinName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-botanical-sage/60 italic text-xs">Geen afbeelding</span>
                    )}
                    {plant.beeFriendly && (
                      <div className="absolute top-3 left-3 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        🐝
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-accent mb-1">
                      {plant.latinName}
                    </h3>
                    <p className="text-primary-600 italic text-sm mb-3">
                      {plant.commonName || "-"}
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Bloeitijd:</span>
                        <span className="font-medium">{plant.floweringPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hoogte:</span>
                        <span className="font-medium">{plant.heightCm}{typeof plant.heightCm === 'number' || (typeof plant.heightCm === 'string' && !plant.heightCm.includes('cm')) ? ' cm' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="/plants" className="btn-outline inline-block">
                Bekijk Alle Planten
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Quick Navigation */}
      <section className="section-container bg-gradient-to-br from-botanical-sage/50 via-botanical-mint/60 to-primary-100/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="heading-2 drop-shadow-sm">Alle Stops</h2>
            <p className="prose-custom">
              Spring direct naar een specifieke zone
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stops.map((stop, index) => (
              <button
                key={stop.id}
                onClick={() => {
                  setCurrentStopIndex(index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`card p-4 text-left transition-all duration-200 ${index === currentStopIndex
                  ? "ring-4 ring-primary-500 bg-gradient-to-br from-primary-100 to-botanical-sage/80"
                  : "hover:scale-105 bg-gradient-to-br from-botanical-sand via-botanical-mint/60 to-primary-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-accent text-sm">
                      {stop.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {stop.relatedPlantIds.length} {stop.relatedPlantIds.length === 1 ? "plant" : "planten"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-container bg-gradient-to-r from-botanical-moss via-primary-600 to-secondary-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-botanical-forest/30 to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
            Meer Ontdekken?
          </h2>
          <p className="text-xl mb-8 text-white/95 drop-shadow-md">
            Bekijk de volledige plantencollectie met uitgebreide informatie
            en filters, of lees meer over het verhaal achter de tuin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/plants"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Plantencollectie
            </a>
            <a
              href="/about"
              className="px-8 py-4 bg-accent text-white rounded-lg font-bold hover:bg-accent-light transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Over de Tuin
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

