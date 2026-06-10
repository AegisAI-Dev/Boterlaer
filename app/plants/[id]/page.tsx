"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";

// Type definition for plant data
interface Plant {
  id: number;
  commonName?: string;
  latinName: string;
  description: string;
  image: string;
  images?: string[]; // Additional photos
  category: string;
  family?: string;
  origin?: string;
  floweringPeriod: string;
  heightCm: string | number;
  light: string;
  locationCode: string;
  beeFriendly: boolean;
}

interface PlantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PlantDetailPage({ params: paramsPromise }: PlantPageProps) {
  const params = use(paramsPromise);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [relatedPlants, setRelatedPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [plantRes, allPlantsRes] = await Promise.all([
          fetch(`/api/plants/${params.id}`, { cache: "no-store", headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } }),
          fetch("/api/plants", { cache: "no-store", headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } })
        ]);

        if (!plantRes.ok) {
          setPlant(null);
          setLoading(false);
          return;
        }

        const plantData = await plantRes.json();
        const allPlantsData = await allPlantsRes.json();

        setPlant(plantData);
        
        // Find related plants
        const related = allPlantsData
          .filter((p: Plant) => 
            p.id !== plantData.id && 
            (p.category === plantData.category || p.light === plantData.light)
          )
          .slice(0, 6);
        setRelatedPlants(related);

      } catch (error) {
        console.error("Failed to fetch plant data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Laden...
        </motion.div>
      </div>
    );
  }

  if (!plant) {
    notFound();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <motion.section
        className="section-container bg-gradient-to-br from-botanical-sage/60 via-botanical-mint/80 to-primary-200/70"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/plants"
              className="inline-flex items-center text-accent hover:text-primary-600 mb-4 transition-colors"
            >
              ← Terug naar planten
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plant Image */}
            <motion.div
              className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl bg-botanical-sage/20 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              {plant.image ? (
                <Image
                  src={plant.image}
                  alt={plant.latinName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-botanical-sage/60 italic">Geen afbeelding beschikbaar</span>
              )}

              {/* Category badge */}
              <motion.div
                className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {plant.category}
              </motion.div>

              {/* Bee friendly indicator */}
              {plant.beeFriendly && (
                <motion.div
                  className="absolute top-4 left-4 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  🐝 Bijvriendelijk
                </motion.div>
              )}
            </motion.div>

            {/* Plant Info */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.h1
                className="heading-1 mb-2"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {plant.latinName}
              </motion.h1>
              <motion.p
                className="text-2xl text-primary-600 italic mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                {plant.commonName || "-"}
              </motion.p>

              <motion.div
                className="prose-custom mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-lg leading-relaxed">{plant.description}</p>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                {plant.family && (
                  <motion.div
                    className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-gray-500 text-sm">Familie</span>
                    <p className="font-semibold text-gray-800">{plant.family}</p>
                  </motion.div>
                )}

                {plant.origin && (
                  <motion.div
                    className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-gray-500 text-sm">Oorsprong</span>
                    <p className="font-semibold text-gray-800">{plant.origin}</p>
                  </motion.div>
                )}

                <motion.div
                  className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-500 text-sm">Bloeitijd</span>
                  <p className="font-semibold text-gray-800">{plant.floweringPeriod}</p>
                </motion.div>

                <motion.div
                  className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-500 text-sm">Hoogte</span>
                  <p className="font-semibold text-gray-800">{plant.heightCm}{typeof plant.heightCm === 'number' || (typeof plant.heightCm === 'string' && !plant.heightCm.includes('cm')) ? ' cm' : ''}</p>
                </motion.div>

                <motion.div
                  className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-500 text-sm">Lichtbehoefte</span>
                  <p className="font-semibold text-gray-800 capitalize">{plant.light}</p>
                </motion.div>

                <motion.div
                  className="bg-white/80 p-4 rounded-lg border border-botanical-mint/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-500 text-sm">Locatie</span>
                  <p className="font-semibold text-gray-800">
                    {plant.locationCode?.replace("-", " ") || "Onbekend"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Additional Photos Section */}
      <motion.section
        className="section-container bg-gradient-to-br from-primary-100/50 via-botanical-mint/40 to-botanical-sand/80"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="heading-2 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            Meer Foto's
          </motion.h2>

          {/* TODO: Add additional photos when available */}
          {plant.images && plant.images.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              {/* Only additional photos, not the main photo */}
              {plant.images.map((photo, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    // TODO: Add lightbox/modal functionality
                    console.log('Open photo:', photo);
                  }}
                >
                  <Image
                    src={photo}
                    alt={`${plant.latinName} - Extra foto ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Extra foto {index + 1}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white/60 p-8 rounded-lg text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <p className="text-gray-600 mb-4">
                Extra foto's van deze plant worden binnenkort toegevoegd.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Placeholder for additional photos */}
                <motion.div
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-400">Foto 1</span>
                </motion.div>
                <motion.div
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-400">Foto 2</span>
                </motion.div>
                <motion.div
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-400">Foto 3</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Related Plants Section */}
      <motion.section
        className="section-container bg-gradient-to-r from-secondary-200/70 via-botanical-earth/80 to-botanical-sand"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="heading-2 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.1 }}
          >
            Gerelateerde Planten
          </motion.h2>

          {/* Find plants with same category or light requirements */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            {relatedPlants.map((relatedPlant: Plant, index: number) => (
                <motion.div
                  key={relatedPlant.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.3 + index * 0.1 }}
                >
                  <Link
                    href={`/plants/${relatedPlant.id}`}
                    className="group block"
                  >
                    <motion.div
                      className="card group-hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative h-48 overflow-hidden bg-botanical-sage/20 flex items-center justify-center">
                        {relatedPlant.image ? (
                          <Image
                            src={relatedPlant.image}
                            alt={relatedPlant.latinName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-botanical-sage/60 italic text-xs">Geen afbeelding</span>
                        )}
                        <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {relatedPlant.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-accent mb-1">{relatedPlant.latinName}</h3>
                        <p className="text-primary-600 italic text-sm">{relatedPlant.commonName || "-"}</p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
