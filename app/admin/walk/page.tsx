"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function WalkPage() {
  const [stops, setStops] = useState<WalkStop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const response = await fetch("/api/walk");
      const data = await response.json();
      setStops(data);
    } catch (error) {
      console.error("Failed to fetch walk stops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Weet je zeker dat je deze wandelstop wilt verwijderen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/walk/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchStops();
      } else {
        alert("Fout bij verwijderen van wandelstop");
      }
    } catch (error) {
      console.error("Failed to delete walk stop:", error);
      alert("Fout bij verwijderen van wandelstop");
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-2 text-accent mb-2">Wandelstops Beheer</h1>
          <p className="text-gray-600">
            Beheer alle stops in de wandeling ({stops.length} stops)
          </p>
        </div>
        <Link href="/admin/walk/new" className="btn-primary">
          + Nieuwe Stop
        </Link>
      </div>

      <div className="card bg-white p-6">
        {stops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nog geen wandelstops toegevoegd</p>
            <Link href="/admin/walk/new" className="btn-primary">
              Eerste Stop Toevoegen
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Titel</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acties</th>
                </tr>
              </thead>
              <tbody>
                {stops.map((stop) => (
                  <tr key={stop.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{stop.id}</td>
                    <td className="py-3 px-4 font-medium">{stop.title}</td>
                    <td className="py-3 px-4 text-gray-600">{stop.slug}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/walk/${stop.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Bewerken
                        </Link>
                        <Link
                          href={`/admin/walk/gallery/${stop.slug}`}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Foto's
                        </Link>
                        <button
                          onClick={() => handleDelete(stop.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

