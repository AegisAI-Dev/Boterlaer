"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Type definition for plant data
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
  locationCode?: string;
  beeFriendly: boolean;
}

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string>("all");

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await fetch("/api/plants", {
          cache: "no-store",
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();

        if (!response.ok) {
          setError(
            typeof data?.error === "string"
              ? data.error
              : "De plantencollectie kon niet geladen worden."
          );
          setPlants([]);
          return;
        }

        if (!Array.isArray(data)) {
          setError("Ongeldig antwoord ontvangen voor de plantencollectie.");
          setPlants([]);
          return;
        }

        setPlants(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch plants:", error);
        setError("De plantencollectie kon niet geladen worden.");
        setPlants([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);


  // Get unique families and normalize them
  const families = useMemo(() => {
    const fams = new Set<string>();
    plants.forEach(p => {
      if (p.family) fams.add(p.family.trim());
    });
    return Array.from(fams).sort();
  }, [plants]);

  // Group plants by: Letter -> Genus -> Species
  const groupedData = useMemo(() => {
    // Filter plants by family first
    const filteredPlants = selectedFamily === "all"
      ? plants
      : plants.filter(p => p.family?.trim() === selectedFamily);

    // Sort filtered plants by Latin name
    const sortedPlants = [...filteredPlants].sort((a, b) =>
      a.latinName.localeCompare(b.latinName)
    );

    const hierarchy: { [letter: string]: { [genus: string]: Plant[] } } = {};

    sortedPlants.forEach(plant => {
      const letter = plant.latinName.charAt(0).toUpperCase();
      const genus = plant.latinName.split(' ')[0]; // Extract genus from "Genus species"

      if (!hierarchy[letter]) {
        hierarchy[letter] = {};
      }
      if (!hierarchy[letter][genus]) {
        hierarchy[letter][genus] = [];
      }
      hierarchy[letter][genus].push(plant);
    });

    return hierarchy;
  }, [plants, selectedFamily]);

  const alphabet = useMemo(() => Object.keys(groupedData).sort(), [groupedData]);

  return (
    <div className="garden-shell min-h-screen overflow-hidden font-serif">
      {/* Header Section - Minimal & Scholarly */}
      <section className="pt-20 pb-16 px-6 border-b border-[#e5e1d3]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extralight text-[#1a2f1c] mb-6 tracking-tight">
              Botanisch Register
            </h1>
            <div className="h-px w-24 bg-[#1a2f1c]/20 mb-6"></div>
            <p className="text-[#3c4a3e] max-w-2xl leading-relaxed text-lg font-light italic">
              Een overzicht van de levende collectie, geclassificeerd op wetenschappelijke nomenclatuur en botanisch geslacht.
            </p>
          </div>

          {/* Family Filter */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="family-filter" className="text-[10px] uppercase tracking-widest text-[#1a2f1c]/40 font-bold">
              Filter op familie
            </label>
            <div className="relative">
              <select
                id="family-filter"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full bg-transparent border border-[#1a2f1c]/10 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#1a2f1c]/30 transition-colors cursor-pointer text-[#1a2f1c]"
              >
                <option value="all">Alle families</option>
                {families.map(fam => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1a2f1c]/40">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#e5e1d3] bg-paper/72 py-2 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 py-1">
            {alphabet.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="text-xs font-medium text-[#1a2f1c]/40 hover:text-[#1a2f1c] transition-colors"
              >
                {letter}
              </a>
            ))}
            {alphabet.length === 0 && (
              <span className="text-xs italic text-[#1a2f1c]/30">Geen resultaten voor deze categorie</span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Register */}
      <main className="max-w-5xl mx-auto px-6 py-20">
        {loading && (
          <div className="rounded-[2rem] border border-[#e5e1d3] bg-white/70 px-6 py-10 text-center text-[#3c4a3e] shadow-paper">
            De plantencollectie wordt geladen...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[2rem] border border-secondary-300 bg-secondary-50 px-6 py-8 text-center shadow-paper">
            <h2 className="font-display text-3xl text-botanical-forest">
              De plantenindex is tijdelijk niet beschikbaar
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#3c4a3e]">
              {error}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#3c4a3e]/75">
              De pagina crasht nu niet meer wanneer de API een fout terugstuurt.
            </p>
          </div>
        )}

        {!loading && !error && (
        <div className="space-y-20">
          {alphabet.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              {/* Alphabetical Marker */}
              <div className="mb-4">
                <span className="text-6xl font-extralight text-[#1a2f1c]/10 leading-none">
                  {letter}
                </span>
                <div className="h-px bg-[#e5e1d3] mt-2"></div>
              </div>

              {/* Genus Groups */}
              <div className="space-y-12">
                {Object.keys(groupedData[letter]).sort().map((genus) => (
                  <div key={genus} className="group">
                    <h2 className="text-2xl font-light text-[#1a2f1c] mb-1 border-l-4 border-botanical-mint pl-6">
                      {genus}
                    </h2>

                    {/* Species List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                      {groupedData[letter][genus].map((plant) => (
                        <Link
                          key={plant.id}
                          href={`/plants/${plant.id}`}
                          className="relative z-0 -mx-6 flex items-center gap-6 rounded-xl border-b border-[#e5e1d3]/30 py-4 px-6 transition-colors last:border-none hover:z-[100] hover:border-transparent hover:bg-white/45 active:z-[100] md:last:border-b group/item"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-[#e5e1d3] grayscale group-hover/item:grayscale-0 group-hover/item:scale-[2.5] group-hover/item:shadow-2xl group-hover/item:border-white transition-all duration-500 pointer-events-none md:pointer-events-auto bg-[#e5e1d3]/30 flex items-center justify-center">
                            {plant.image ? (
                              <Image
                                src={plant.image}
                                alt={plant.latinName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-[#1a2f1c]/40 font-sans italic">🌿</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-4">
                              <h3 className="text-lg text-[#1a2f1c] truncate">
                                <span className="italic">{plant.latinName}</span>
                              </h3>
                            </div>
                            <p className="text-sm text-[#3c4a3e]/60 font-sans tracking-tight flex flex-wrap gap-x-2 items-center">
                              <span>{plant.commonName || "—"}</span>
                              {(plant.family || plant.origin) && (
                                <>
                                  <span className="text-[#3c4a3e]/30">·</span>
                                  <span className="text-xs text-[#3c4a3e]/50 italic">
                                    {[plant.family, plant.origin].filter(Boolean).join(" — ")}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="hidden md:flex flex-col items-end gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <div className="flex gap-1.5">
                              {plant.beeFriendly && <span title="Bijen-vriendelijk">🐝</span>}
                              <span className="bg-[#1a2f1c]/5 text-[#1a2f1c] text-[10px] px-2 py-0.5 rounded uppercase font-sans">
                                {plant.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        )}
      </main>

      {/* Footer / Info */}
      <footer className="bg-[#1a2f1c] text-[#fdfcf8] py-24 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-2xl font-light mb-6">Annotatie</h3>
            <p className="text-white/60 font-light leading-relaxed mb-8 italic">
              Alle vermeldingen in dit register zijn geverifieerd aan de hand van actuele botanische bronnen.
              De collectie weerspiegelt de biodiversiteit en de ecologische balans van de Boterlaer.
            </p>
            <div className="flex gap-12 text-xs uppercase tracking-widest text-white/40 font-sans">
              <div>
                <p className="font-bold text-white/60 mb-2">Totaal</p>
                <p>{plants.length} Soorten</p>
              </div>
              <div>
                <p className="font-bold text-white/60 mb-2">Locaties</p>
                <p>Gecatalogiseerd</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end items-start md:items-end">
            <Link
              href="/wandeling"
              className="group flex items-center gap-4 text-xl font-light hover:text-botanical-mint transition-colors"
            >
              Bezoek de Tuin (Virtueel)
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
