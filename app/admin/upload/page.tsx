"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function UploadDashboard() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload all files
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        
        // Determine category based on file type
        const isVideo = file.type.startsWith("video/");
        formData.append("category", isVideo ? "videos" : "gallery");

        // Get auth token
        const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Create progress tracking
        const xhr = new XMLHttpRequest();
        
        return new Promise<UploadedFile>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(Math.floor((progress * (index + 1)) / files.length));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({
                  name: data.filename,
                  path: data.path,
                  size: data.size,
                  type: data.type,
                  uploadedAt: new Date().toISOString(),
                });
              } catch (err) {
                reject(new Error("Invalid response from server"));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(new Error(errorData.error || "Upload mislukt"));
              } catch {
                reject(new Error("Upload mislukt"));
              }
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Network error tijdens upload"));
          });

          xhr.open("POST", "/api/upload");
          
          // Set headers
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });

          xhr.send(formData);
        });
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...results, ...prev]);
      setSuccess(`${results.length} bestand(en) succesvol geüpload!`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload mislukt");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return "🎥";
    if (type.startsWith("image/")) return "🖼️";
    return "📄";
  };

  const clearFiles = () => {
    setUploadedFiles([]);
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
        <h1 className="heading-2 text-accent mb-2">Upload Center</h1>
        <p className="text-gray-600">
          Upload onbeperkt foto's en video's voor de website
        </p>
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
        <h2 className="text-xl font-bold text-accent mb-6">Bestanden Uploaden</h2>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Upload informatie:</strong>
          </p>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li><strong>Geen limiet</strong> - Upload zo veel bestanden als je wilt</li>
            <li><strong>Ondersteunde formaten:</strong> JPG, PNG, WebP, GIF, MP4, WebM, OGG</li>
            <li><strong>Video's:</strong> Geen grootte limiet (ideaal voor drone video's)</li>
            <li><strong>Foto's:</strong> Tot 50MB per bestand</li>
            <li><strong>Meerdere bestanden:</strong> Selecteer en upload meerdere bestanden tegelijk</li>
          </ul>
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
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <div>
                  <p className="text-sm text-gray-600">Uploaden...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                </div>
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="text-primary-600 font-medium">
                    Klik om bestanden te uploaden
                  </span>{" "}
                  of sleep bestanden hierheen
                </p>
                <p className="text-xs text-gray-500">
                  Foto's en video's - geen limiet
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card bg-white p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-accent">Geüploade Bestanden</h2>
            <button
              onClick={clearFiles}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Lijst Leegmaken
            </button>
          </div>
          
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.path}</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Grootte: {formatFileSize(file.size)}</span>
                      <span>Type: {file.type}</span>
                      <span>Upload: {new Date(file.uploadedAt).toLocaleString('nl-NL')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={file.path}
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
        </div>
      )}

      {/* Info Section */}
      <div className="card bg-white p-6">
        <h3 className="text-lg font-bold text-accent mb-4">Upload Tips</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">🎥 Video's:</p>
            <p>Upload drone video's, promotie video's of tuin tours. Geen grootte limiet!</p>
          </div>
          <div>
            <p className="font-medium mb-1">🖼️ Foto's:</p>
            <p>Upload hoge kwaliteit foto's van planten, de tuin of evenementen.</p>
          </div>
          <div>
            <p className="font-medium mb-1">📁 Bestandsnamen:</p>
            <p>Gebruik duidelijke namen. Voor specifieke pagina's: terracotta-, wandeling-, homepage-</p>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-xs">
              <strong>Pro Tip:</strong> Upload meerdere bestanden tegelijk voor snellere workflow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
