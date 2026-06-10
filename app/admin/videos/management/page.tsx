"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface VideoFile {
  name: string;
  path: string;
  size: number;
  uploadedAt: string;
  assignedPage: string;
  title: string;
  description: string;
  isActive: boolean;
  assignmentUpdatedAt?: string;
}

const pageOptions = [
  { id: "homepage", name: "Homepage", description: "Hero achtergrond" },
  { id: "terracotta", name: "Terracotta", description: "Terracotta pagina" },
  { id: "wandeling", name: "Wandeling", description: "Wandeling pagina" },
  { id: "general", name: "Algemeen", description: "Niet toegewezen" },
];

export default function VideoManagementPage() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/videos-with-assignments');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (filename: string, page: string) => {
    setUpdating(filename);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch('/api/video-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filename, page })
      });

      if (response.ok) {
        setSuccess(`Video toegewezen aan ${pageOptions.find(p => p.id === page)?.name}`);
        await loadVideos();
      } else {
        throw new Error('Update mislukt');
      }
    } catch (err) {
      setError('Fout bij bijwerken toewijzing');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`"${filename}" verwijderen?`)) return;
    
    setDeleting(filename);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/videos/delete?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess(`Video verwijderd`);
        await loadVideos();
      } else {
        throw new Error('Verwijderen mislukt');
      }
    } catch (err) {
      setError('Fout bij verwijderen');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getVideosByPage = (pageId: string) => {
    return videos.filter(video => video.assignedPage === pageId);
  };

  if (loading) {
    return (
      <div className="card bg-white p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Terug
        </Link>
        <h1 className="heading-2 text-accent mb-2">Video Management</h1>
        <p className="text-gray-600">Wijs videos toe aan specifieke pagina's</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">✓ {success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">✗ {error}</p>
        </div>
      )}

      <div className="space-y-6">
        {pageOptions.map((page) => {
          const pageVideos = getVideosByPage(page.id);
          return (
            <div key={page.id} className="card bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-accent">{page.name}</h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {pageVideos.length} video{pageVideos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {pageVideos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Geen videos toegewezen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pageVideos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">🎥</div>
                        <div>
                          <p className="font-medium text-gray-900">{video.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(video.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={video.assignedPage}
                          onChange={(e) => updateAssignment(video.name, e.target.value)}
                          disabled={updating === video.name}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          {pageOptions.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        <a
                          href={video.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                        >
                          Bekijk
                        </a>
                        <button
                          onClick={() => handleDelete(video.name)}
                          disabled={deleting === video.name}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                        >
                          {deleting === video.name ? "..." : "Verwijder"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
