'use client';

import { useState, useEffect } from 'react';

interface Video {
  name: string;
  path: string;
  size?: number;
  uploadedAt?: string;
  assignedPage: string;
  title?: string;
  description?: string;
  isActive?: boolean;
}

interface VideoPlayerProps {
  category?: string;
}

export default function VideoPlayer({ category = 'general' }: VideoPlayerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos-with-assignments');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      const allVideos = data.videos || [];

      // Filter videos by category using database assignments
      const filteredVideos = allVideos.filter((video: Video) => {
        if (category === 'terracotta') {
          return video.assignedPage === 'terracotta';
        } else if (category === 'homepage') {
          return video.assignedPage === 'homepage';
        } else if (category === 'wandeling') {
          return video.assignedPage === 'wandeling';
        }

        return true; // Show all videos for general category
      });

      setVideos(filteredVideos);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Kon video\'s niet laden');
      setIsLoading(false);
    }
  };

  const nextVideo = () => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  const previousVideo = () => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Video's laden...</div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎥</div>
          <p className="text-xl mb-2">
            {category === 'terracotta' ? 'Geen terracotta video\'s beschikbaar' : 'Geen video\'s beschikbaar'}
          </p>
          <p className="text-sm opacity-75">
            {category === 'terracotta'
              ? 'Wijs een video toe aan terracotta via het admin dashboard'
              : 'Wijs een video toe via het admin dashboard'
            }
          </p>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="relative w-full h-full bg-black">
      <video
        key={currentVideo.path}
        className="w-full h-full object-cover"
        controls
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={currentVideo.path} type="video/mp4" />
        <source src={currentVideo.path} type="video/webm" />
        Uw browser ondersteunt geen video afspeling.
      </video>

      {/* Video Navigation */}
      {videos.length > 1 && (
        <>
          <button
            onClick={previousVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Vorige video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Volgende video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-1">
            {category === 'terracotta' ? 'Terracotta Collectie' : category === 'wandeling' ? 'Virtuele Wandeling' : category === 'homepage' ? 'Botanische Tuin' : 'Video'}
          </h3>
          <p className="text-sm opacity-90">
            {currentVideo.name.replace(/^\d+_/, '').replace(/_/g, ' ')}
          </p>
          {videos.length > 1 && (
            <p className="text-xs opacity-75 mt-1">
              Video {currentVideoIndex + 1} van {videos.length}
            </p>
          )}
        </div>
      </div>

      {/* Video Indicators */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentVideoIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Ga naar video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
