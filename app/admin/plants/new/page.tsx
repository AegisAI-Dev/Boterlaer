"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewPlantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    commonName: "",
    latinName: "",
    description: "",
    image: "",
    additionalImages: [] as string[],
    category: "",
    family: "",
    origin: "",
    floweringPeriod: "",
    heightCm: "",
    light: "",
    locationCode: "",
    beeFriendly: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const plantData = {
        ...formData,
      };

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) authHeaders["Authorization"] = `Bearer ${authToken}`;

      const response = await fetch("/api/plants", {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify(plantData),
      });

      if (response.ok) {
        router.push("/admin/plants");
      } else {
        alert("Fout bij aanmaken van plant");
      }
    } catch (error) {
      console.error("Failed to create plant:", error);
      alert("Fout bij aanmaken van plant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/plants"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Terug naar Planten
        </Link>
        <h1 className="heading-2 text-accent mb-2">Nieuwe Plant Toevoegen</h1>
      </div>

      <div className="card bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latijnse Naam *
              </label>
              <input
                type="text"
                name="latinName"
                value={formData.latinName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nederlandse Naam
              </label>
              <input
                type="text"
                name="commonName"
                value={formData.commonName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Familie
              </label>
              <input
                type="text"
                name="family"
                value={formData.family}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. Rosaceae, Asteraceae"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oorsprong
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. Europa, Azië, Noord-Amerika"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bloeitijd
              </label>
              <input
                type="text"
                name="floweringPeriod"
                value={formData.floweringPeriod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. Maart - Mei, Juni - Augustus"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoogte (cm)
              </label>
              <input
                type="text"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. 50, 15 - 20, 200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lichtbehoefte *
              </label>
              <select
                name="light"
                value={formData.light}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Selecteer...</option>
                <option value="zon">Zon</option>
                <option value="half schaduw">Half schaduw</option>
                <option value="schaduw">Schaduw</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locatie Code
              </label>
              <input
                type="text"
                name="locationCode"
                value={formData.locationCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. A1, B2, border-links"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <ImageUpload
                value={formData.image}
                onChange={(path) => setFormData((prev) => ({ ...prev, image: path }))}
                category="plants"
                label="Hoofdfoto *"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Foto's
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    try {
                      const formData = new FormData();
                      files.forEach(file => formData.append('files', file));

                      const uploadHeaders: Record<string, string> = {};
                      const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
                      if (authToken) uploadHeaders['Authorization'] = `Bearer ${authToken}`;

                      const response = await fetch('/api/upload/plant-photos', {
                        method: 'POST',
                        credentials: 'include',
                        headers: uploadHeaders,
                        body: formData,
                      });

                      if (response.ok) {
                        const result = await response.json();
                        setFormData(prev => ({
                          ...prev,
                          additionalImages: [...prev.additionalImages, ...result.imageUrls]
                        }));
                        // Clear file input
                        e.target.value = '';
                      } else {
                        alert('Upload mislukt. Probeer opnieuw.');
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert('Upload mislukt. Probeer opnieuw.');
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Selecteer één of meerdere extra foto's (optioneel)
                </p>

                {formData.additionalImages.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {formData.additionalImages.length} extra foto('s) geüpload
                    </p>
                  </div>
                )}
              </div>
            </div>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              name="beeFriendly"
              checked={formData.beeFriendly}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Bijvriendelijk
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/plants"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Bezig met opslaan..." : "Plant Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
