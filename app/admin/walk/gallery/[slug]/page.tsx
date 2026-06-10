"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";

interface GalleryPhoto {
  id: number;
  path: string;
  alt?: string;
  title?: string;
}

export default function WalkZoneGalleryAdminPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newPhoto, setNewPhoto] = useState({
    path: "",
    alt: "",
    title: "",
  });

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleMultiUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Selecteer eerst foto's");
      return;
    }

    setUploading(true);
    const uploadPromises: Promise<void>[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileIndex = i;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        failCount++;
        continue;
      }

      // Validate file size
      if (file.size > 50 * 1024 * 1024) {
        failCount++;
        continue;
      }

      const uploadPromise = (async () => {
        try {
          setUploadProgress((prev) => ({ ...prev, [fileIndex]: 0 }));

          // Upload file
          const token = localStorage.getItem("auth-token");

          // Upload file
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", "walk");

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload mislukt");
          }

          const data = await response.json();
          setUploadProgress((prev) => ({ ...prev, [fileIndex]: 100 }));

          // Add to gallery
          const galleryResponse = await fetch(`/api/walk-gallery/${slug}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              path: data.path,
              alt: newPhoto.alt || "",
              title: newPhoto.title || "",
            }),
          });

          if (galleryResponse.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          failCount++;
        }
      })();

      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Reset form and refresh photos
    setSelectedFiles([]);
    setNewPhoto({ path: "", alt: "", title: "" });
    setUploadProgress({});
    fetchPhotos();

    // Show result message
    if (successCount > 0) {
      alert(`${successCount} foto('s) succesvol geüpload${failCount > 0 ? `, ${failCount} mislukt` : ""}`);
    } else {
      alert("Geen foto's geüpload. Controleer of de bestanden geldige afbeeldingen zijn.");
    }

    setUploading(false);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.path) {
      alert("Selecteer eerst een foto");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/walk-gallery/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newPhoto),
      });

      if (response.ok) {
        setNewPhoto({ path: "", alt: "", title: "" });
        fetchPhotos();
      } else {
        alert("Fout bij toevoegen van foto");
      }
    } catch (error) {
      console.error("Failed to add photo:", error);
      alert("Fout bij toevoegen van foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/walk-gallery/${slug}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPhotos();
      } else {
        alert("Fout bij verwijderen van foto");
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Fout bij verwijderen van foto");
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
        <h1 className="heading-2 text-accent mb-2">
          Foto Gallery: {slug}
        </h1>
        <p className="text-gray-600">
          Beheer foto's voor deze wandeling zone ({photos.length} foto's)
        </p>
      </div>

      {/* Multi Upload Section */}
      <div className="card bg-white p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Meerdere Foto's Uploaden</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecteer Meerdere Foto's
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id={`multi-upload-${slug}`}
              />
              <label
                htmlFor={`multi-upload-${slug}`}
                className="cursor-pointer block"
              >
                {uploading ? (
                  <div className="space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-sm text-gray-600">Uploaden...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="text-primary-600 font-medium">
                        Klik om meerdere foto's te selecteren
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP tot 50MB per foto
                    </p>
                  </div>
                )}
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFiles.length} foto('s) geselecteerd:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      {uploadProgress[index] !== undefined && (
                        <span className="ml-2 text-primary-600">
                          {uploadProgress[index]}%
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel voor alle foto's (optioneel)
            </label>
            <input
              type="text"
              value={newPhoto.title}
              onChange={(e) =>
                setNewPhoto((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Wordt toegepast op alle foto's"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Tekst voor alle foto's (optioneel)
            </label>
            <input
              type="text"
              value={newPhoto.alt}
              onChange={(e) =>
                setNewPhoto((prev) => ({ ...prev, alt: e.target.value }))
              }
              placeholder="Wordt toegepast op alle foto's"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleMultiUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              {uploading ? "Uploaden..." : `${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}Foto's Uploaden`}
            </button>
            {selectedFiles.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadProgress({});
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Wissen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Single Upload Form (for backward compatibility) */}
      <div className="card bg-white p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Één Foto Toevoegen</h2>
        <form onSubmit={handleAddPhoto} className="space-y-6">
          <div>
            <ImageUpload
              value={newPhoto.path}
              onChange={(path) => setNewPhoto((prev) => ({ ...prev, path }))}
              category="walk"
              label="Foto"
              uniqueId={`walk-gallery-${slug}-single`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel (optioneel)
            </label>
            <input
              type="text"
              value={newPhoto.title}
              onChange={(e) =>
                setNewPhoto((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Tekst (optioneel)
            </label>
            <input
              type="text"
              value={newPhoto.alt}
              onChange={(e) =>
                setNewPhoto((prev) => ({ ...prev, alt: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !newPhoto.path}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? "Toevoegen..." : "Foto Toevoegen"}
          </button>
        </form>
      </div>

      {/* Photos Grid */}
      <div className="card bg-white p-6">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nog geen foto's toegevoegd</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={photo.path}
                    alt={photo.alt || photo.title || `Foto ${photo.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  {photo.title && (
                    <h3 className="font-semibold mb-1">{photo.title}</h3>
                  )}
                  {photo.alt && (
                    <p className="text-sm text-gray-600 mb-2">{photo.alt}</p>
                  )}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
