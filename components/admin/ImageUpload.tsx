"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string; // Current image URL or path
  onChange: (path: string) => void;
  category?: "gallery" | "plants" | "blog" | "walk";
  label?: string;
  required?: boolean;
  className?: string;
  uniqueId?: string; // Unique identifier for this upload component
}

export default function ImageUpload({
  value,
  onChange,
  category = "gallery",
  label = "Afbeelding",
  required = false,
  className = "",
  uniqueId,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes from outside
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Alleen afbeeldingen zijn toegestaan");
      return;
    }

    // Validate file size (50MB - voor hoge kwaliteit foto's)
    if (file.size > 50 * 1024 * 1024) {
      setError("Bestand is te groot (max 50MB)");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      // Get auth token from localStorage (login stores it there)
      const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload mislukt");
      }

      const data = await response.json();
      onChange(data.path);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload mislukt");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {preview && (
        <div className="mb-4 relative">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Verwijder afbeelding
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploading
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={uniqueId || `image-upload-${category}-${Date.now()}`}
        />
        <label
          htmlFor={uniqueId || `image-upload-${category}-${Date.now()}`}
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
                  Klik om te uploaden
                </span>{" "}
                of sleep een bestand hierheen
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP tot 50MB
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* URL Fallback */}
      {!preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Of voer een URL in:
          </p>
          <input
            type="url"
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value || null);
            }}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      )}
    </div>
  );
}
