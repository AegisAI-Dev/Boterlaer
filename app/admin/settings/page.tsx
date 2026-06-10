"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";

interface Settings {
  site: {
    name: string;
    description: string;
    tagline: string;
  };
  contact: {
    address: {
      name: string;
      street: string;
      city: string;
      country: string;
    };
    email: string;
    phone: string;
    note: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  seo: {
    keywords: string[];
    author: string;
  };
}

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Settings>({
    site: {
      name: "",
      description: "",
      tagline: "",
    },
    contact: {
      address: {
        name: "",
        street: "",
        city: "",
        country: "",
      },
      email: "",
      phone: "",
      note: "",
    },
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
    seo: {
      keywords: [],
      author: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const settings = await response.json();
      setFormData(settings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(",").map((k) => k.trim()).filter((k) => k);
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Fout bij opslaan van instellingen");
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Fout bij opslaan van instellingen");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Instellingen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-2 text-accent mb-2">Site Instellingen</h1>
        <p className="text-gray-600">
          Beheer alle algemene instellingen van de website
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">✓ Instellingen succesvol opgeslagen!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Site Settings */}
        <div className="card bg-white p-8">
          <h2 className="text-xl font-bold text-accent mb-6">Site Informatie</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Naam *
              </label>
              <input
                type="text"
                name="site.name"
                value={formData.site.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="site.tagline"
                value={formData.site.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving *
              </label>
              <textarea
                name="site.description"
                value={formData.site.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="card bg-white p-8">
          <h2 className="text-xl font-bold text-accent mb-6">Contact Informatie</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locatie Naam
                </label>
                <input
                  type="text"
                  name="contact.address.name"
                  value={formData.contact.address.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Straat
                </label>
                <input
                  type="text"
                  name="contact.address.street"
                  value={formData.contact.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stad
                </label>
                <input
                  type="text"
                  name="contact.address.city"
                  value={formData.contact.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land
                </label>
                <input
                  type="text"
                  name="contact.address.country"
                  value={formData.contact.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoon
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Notitie
              </label>
              <input
                type="text"
                name="contact.note"
                value={formData.contact.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="bijv. Privétuin - niet vrij toegankelijk"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="card bg-white p-8">
          <h2 className="text-xl font-bold text-accent mb-6">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="social.facebook"
                value={formData.social.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                name="social.youtube"
                value={formData.social.youtube}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="card bg-white p-8">
          <h2 className="text-xl font-bold text-accent mb-6">SEO Instellingen</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auteur
              </label>
              <input
                type="text"
                name="seo.author"
                value={formData.seo.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (gescheiden door komma's)
              </label>
              <input
                type="text"
                value={formData.seo.keywords.join(", ")}
                onChange={handleKeywordsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="botanische tuin, planten, hobbytuin"
              />
              <p className="mt-1 text-sm text-gray-500">
                Scheid keywords met komma's
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? "Opslaan..." : "Instellingen Opslaan"}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  );
}
