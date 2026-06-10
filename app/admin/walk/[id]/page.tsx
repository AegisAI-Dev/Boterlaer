"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditWalkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    image: "",
    imageWinter: "",
    imageSummer: "",
    relatedPlantIds: "",
  });

  useEffect(() => {
    fetchStop();
  }, [id]);

  const fetchStop = async () => {
    try {
      const response = await fetch(`/api/walk/${id}`);
      const stop = await response.json();
      // Map legacy 'image' field to 'imageSummer' if imageSummer doesn't exist
      const imageSummer = stop.imageSummer || stop.image || "";
      setFormData({
        slug: stop.slug || "",
        title: stop.title || "",
        description: stop.description || "",
        image: stop.image || "",
        imageWinter: stop.imageWinter || "",
        imageSummer: imageSummer,
        relatedPlantIds: stop.relatedPlantIds?.join(", ") || "",
      });
    } catch (error) {
      console.error("Failed to fetch walk stop:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Always send all fields, including image fields
      // The API will handle preserving existing values correctly
      const stopData: any = {
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
        relatedPlantIds: formData.relatedPlantIds
          ? formData.relatedPlantIds.split(",").map((id) => parseInt(id.trim()))
          : [],
      };

      // Always include image fields so API knows they were provided
      stopData.imageSummer = formData.imageSummer || "";
      stopData.imageWinter = formData.imageWinter || "";

      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/walk/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(stopData),
      });

      if (response.ok) {
        router.push("/admin/walk");
      } else {
        alert("Fout bij bijwerken van wandelstop");
      }
    } catch (error) {
      console.error("Failed to update walk stop:", error);
      alert("Fout bij bijwerken van wandelstop");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/walk"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Terug naar Wandelstops
        </Link>
        <h1 className="heading-2 text-accent mb-2">Wandelstop Bewerken</h1>
      </div>

      <div className="card bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL-vriendelijk) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschrijving *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <ImageUpload
              value={formData.imageSummer}
              onChange={(path) => setFormData((prev) => ({ ...prev, imageSummer: path }))}
              category="walk"
              label="Zomer Afbeelding"
              required
              uniqueId="walk-summer-image"
            />
          </div>

          <div>
            <ImageUpload
              value={formData.imageWinter}
              onChange={(path) => setFormData((prev) => ({ ...prev, imageWinter: path }))}
              category="walk"
              label="Winter Afbeelding"
              uniqueId="walk-winter-image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerelateerde Plant IDs (komma-gescheiden)
            </label>
            <input
              type="text"
              name="relatedPlantIds"
              value={formData.relatedPlantIds}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Opslaan..." : "Wijzigingen Opslaan"}
            </button>
            <Link
              href="/admin/walk"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

