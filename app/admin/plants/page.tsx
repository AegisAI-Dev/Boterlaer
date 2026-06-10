"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Plant {
  id: number;
  commonName?: string;
  latinName: string;
  description: string;
  image: string;
  category: string;
  floweringPeriod: string;
  heightCm: string | number;
  light: string;
  locationCode: string;
  beeFriendly: boolean;
}

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle Categorieën");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // States for inline delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch("/api/plants", { cache: "no-store", headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } });
      const data = await response.json();
      // Ensure sorting even if API changes in the future
      const sortedData = [...data].sort((a, b) =>
        a.latinName.localeCompare(b.latinName)
      );
      setPlants(sortedData);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Alle Categorieën",
    ...Array.from(new Set(plants.map((p) => p.category).filter(Boolean))).sort(),
  ];

  const handleDelete = async (id: number) => {
    // Start deletion process
    setIsDeleting(true);
    setDeleteMessage(null);

    try {
      const token = localStorage.getItem("auth-token");
      
      const response = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDeleteMessage({ type: 'success', text: `Plant succesvol verwijderd.` });
        setConfirmDeleteId(null);
        fetchPlants();
        
        // Hide message after 3 seconds
        setTimeout(() => setDeleteMessage(null), 3000);
      } else {
        const errData = await response.json().catch(() => ({}));
        setDeleteMessage({ type: 'error', text: `Fout: ${errData.error || response.statusText}` });
      }
    } catch (error) {
      console.error("Failed to delete plant:", error);
      setDeleteMessage({ type: 'error', text: "Netwerkfout bij verwijderen." });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredPlants = plants.filter((plant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      plant.latinName.toLowerCase().includes(searchLower) ||
      (plant.commonName || "").toLowerCase().includes(searchLower) ||
      (plant.locationCode || "").toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === "Alle Categorieën" || plant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planten Beheren</h1>
            <p className="text-gray-600">
              {filteredPlants.length === plants.length
                ? `Totaal ${plants.length} planten in de collectie`
                : `${filteredPlants.length} van de ${plants.length} planten gevonden`}
            </p>
          </div>
          <Link href="/admin/plants/new" className="btn-primary">
            + Nieuwe Plant
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Zoek op naam, latijnse naam of locatiecode..."
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="md:w-64">
            <select
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedCategory !== "Alle Categorieën") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Zoek: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-2 hover:text-primary-900">
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== "Alle Categorieën" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Categorie: {selectedCategory}
                <button onClick={() => setSelectedCategory("Alle Categorieën")} className="ml-2 hover:text-green-900">
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Alle Categorieën");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline px-2"
            >
              Wis alle filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredPlants.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-4">Geen planten gevonden die voldoen aan je criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Alle Categorieën");
              }}
              className="text-primary-600 font-medium hover:text-primary-700 underline"
            >
              Alle filters wissen
            </button>
          </div>
        ) : (
          <>
            {deleteMessage && (
              <div className={`mb-4 p-4 rounded-lg ${deleteMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {deleteMessage.text}
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                  <tr>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Latijnse Naam</th>
                    <th className="py-4 px-6">Nederlandse Naam</th>
                    <th className="py-4 px-6">Categorie</th>
                    <th className="py-4 px-6">Locatie</th>
                    <th className="py-4 px-6 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPlants.map((plant) => (
                    <tr key={plant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-400">{plant.id}</td>
                      <td className="py-4 px-6 font-medium text-gray-900 italic">{plant.latinName}</td>
                      <td className="py-4 px-6 text-gray-600">{plant.commonName || "-"}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {plant.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs">{plant.locationCode || "-"}</td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <Link
                          href={`/admin/plants/${plant.id}`}
                          className="text-primary-600 hover:text-primary-800 font-medium whitespace-nowrap"
                        >
                          Bewerken
                        </Link>
                        
                        {confirmDeleteId === plant.id ? (
                          <div className="inline-flex items-center space-x-2">
                            <span className="text-xs text-red-600 font-bold whitespace-nowrap">Zeker?</span>
                            <button
                              onClick={() => handleDelete(plant.id)}
                              disabled={isDeleting}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                            >
                              {isDeleting ? "Wissen..." : "Ja"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={isDeleting}
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 whitespace-nowrap"
                            >
                              Nee
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(plant.id)}
                            className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
                          >
                            Verwijderen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                <div className="text-gray-500 text-xs">
                  Pagina {currentPage} van {totalPages} ({filteredPlants.length} resultaten)
                </div>
                <div className="flex space-x-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Vorige
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === pageNum ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 border rounded bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Volgende
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

