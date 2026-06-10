"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface VideoFile {
  name: string;
  path: string;
  size?: number;
  uploadedAt?: string;
}

export default function VideosPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentVideos, setCurrentVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load videos from API on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setCurrentVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!allowedVideoTypes.includes(file.type)) {
      setError("Alleen video bestanden zijn toegestaan (MP4, WebM, OGG)");
      return;
    }

    // No file size limit for videos - server will handle large files

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "videos");

      // Create abort controller for timeout (10 minutes for large videos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes
      
      // Log upload start
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      console.log(`Starting upload: ${file.name}, size: ${fileSizeMB}MB, type: ${file.type}`);
      
      // Check if file is actually accessible
      if (!file || file.size === 0) {
        throw new Error("Bestand is leeg of niet toegankelijk");
      }
      
      // Get auth token from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      let response: Response;
      try {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: headers,
          body: formData,
          signal: controller.signal,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        });
        console.log(`Upload response received: status ${response.status}`);
      } catch (fetchError) {
        console.error("Fetch error details:", fetchError);
        // NetworkError typically means the request never reached the server
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error(`Network error: De upload kan de server niet bereiken. Controleer je internetverbinding of probeer het later opnieuw. Fout: ${fetchError.message}`);
        }
        throw fetchError;
      }
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload mislukt");
      }

      const data = await response.json();
      setSuccess(`Video succesvol geüpload: ${data.filename}`);
      
      // Add to current videos list and refresh from API
      await loadVideos();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error details:", err);
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message.includes('timeout')) {
          setError("Upload timeout - probeer opnieuw of gebruik een kleinere video");
        } else if (err.message.includes('413') || err.message.includes('too large')) {
          setError("Bestand is te groot. Nginx limiet moet worden verhoogd (zie update-nginx-upload-limit.sh)");
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          setError("Network error - controleer je internetverbinding of probeer een kleinere video. Als het probleem aanhoudt, controleer de server logs.");
        } else {
          setError(err.message || "Upload mislukt");
        }
      } else {
        setError("Upload mislukt: " + String(err));
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Onbekend";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Terug naar Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-2 text-accent mb-2">Video Beheer</h1>
            <p className="text-gray-600">
              Beheer videos voor de website
            </p>
          </div>
          <Link
            href="/admin/videos/management"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            🎥 Nieuw Management Systeem
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">✓ {success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">✗ {error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="card bg-white p-8 mb-8">
        <h2 className="text-xl font-bold text-accent mb-6">Nieuwe Video Uploaden</h2>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Belangrijke video's voor de website:</strong>
          </p>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li><strong>drone-overview-1.mp4</strong> - Gebruikt op homepage (hero achtergrond) en wandeling pagina</li>
            <li><strong>drone-overview-2.mp4</strong> - Gebruikt op wandeling pagina</li>
            <li><strong>terracotta-*.mp4</strong> - Gebruikt op terracotta pagina (elke video met 'terracotta' in de naam)</li>
          </ul>
          <p className="text-xs text-blue-600 mt-3">
            Tip: Upload video's met deze exacte namen om ze automatisch te gebruiken op de website.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploading
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer block"
          >
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Video uploaden...</p>
                <p className="text-xs text-gray-500">Dit kan even duren voor grote bestanden</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="text-primary-600 font-medium">
                    Klik om video te uploaden
                  </span>{" "}
                  of sleep een bestand hierheen
                </p>
                <p className="text-xs text-gray-500">
                  MP4, WebM, OGG tot 500MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Current Videos */}
      <div className="card bg-white p-8">
        <h2 className="text-xl font-bold text-accent mb-6">Geüploade Video's</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Video's laden...</p>
          </div>
        ) : currentVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nog geen video's geüpload</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentVideos.map((video, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{video.name}</p>
                    <p className="text-sm text-gray-500">{video.path}</p>
                    {video.size && (
                      <p className="text-xs text-gray-400">Grootte: {formatFileSize(video.size)}</p>
                    )}
                    {video.uploadedAt && (
                      <p className="text-xs text-gray-400">Upload: {new Date(video.uploadedAt).toLocaleDateString('nl-NL')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={video.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Bekijk
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 card bg-white p-6">
        <h3 className="text-lg font-bold text-accent mb-4">Waar worden video's gebruikt?</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">Homepage:</p>
            <p>De video <code className="bg-gray-100 px-2 py-1 rounded">drone-overview-1.mp4</code> wordt gebruikt als achtergrond in de hero sectie (autoplay, muted, loop).</p>
          </div>
          <div>
            <p className="font-medium mb-1">Wandeling pagina:</p>
            <p>Beide video's (<code className="bg-gray-100 px-2 py-1 rounded">drone-overview-1.mp4</code> en <code className="bg-gray-100 px-2 py-1 rounded">drone-overview-2.mp4</code>) worden getoond bovenaan de pagina met video controls.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Terracotta pagina:</p>
            <p>Alle video's met 'terracotta' in de bestandsnaam worden automatisch getoond bovenaan de terracotta pagina. De meest recent geüploade video wordt als eerste weergegeven.</p>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-xs">
              <strong>Tip:</strong> Optimaliseer video's voor web om snellere laadtijden te krijgen. Gebruik H.264 codec en comprimeer waar mogelijk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


