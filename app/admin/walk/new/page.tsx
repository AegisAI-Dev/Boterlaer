"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewWalkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    image: "",
    imageWinter: "",
    imageSummer: "",
    relatedPlantIds: "",
  });

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
      const stopData = {
        ...formData,
        relatedPlantIds: formData.relatedPlantIds
          ? formData.relatedPlantIds.split(",").map((id) => parseInt(id.trim()))
          : [],
      };

      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/walk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(stopData),
      });

      if (response.ok) {
        router.push("/admin/walk");
      } else {
        alert("Fout bij aanmaken van wandelstop");
      }
    } catch (error) {
      console.error("Failed to create walk stop:", error);
      alert("Fout bij aanmaken van wandelstop");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/walk"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Terug naar Wandelstops
        </Link>
        <h1 className="heading-2 text-accent mb-2">Nieuwe Wandelstop Toevoegen</h1>
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
              placeholder="bijv. border-links"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Gebruik alleen kleine letters, cijfers en streepjes
            </p>
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
              uniqueId="walk-summer-image-new"
            />
          </div>

          <div>
            <ImageUpload
              value={formData.imageWinter}
              onChange={(path) => setFormData((prev) => ({ ...prev, imageWinter: path }))}
              category="walk"
              label="Winter Afbeelding"
              uniqueId="walk-winter-image-new"
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
              placeholder="bijv. 1, 3, 5"
            />
            <p className="mt-1 text-sm text-gray-500">
              Voer de IDs van gerelateerde planten in, gescheiden door komma's
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Opslaan..." : "Stop Toevoegen"}
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

