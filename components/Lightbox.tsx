"use client";

import { useEffect } from "react";
import Image from "next/image";

interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close lightbox"
      >
        <svg
          className="w-10 h-10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      <button
        onClick={onPrev}
        className="absolute left-4 text-white hover:text-gray-300 z-10"
        aria-label="Previous image"
      >
        <svg
          className="w-12 h-12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1536px) 100vw, 1536px"
        />
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="absolute right-4 text-white hover:text-gray-300 z-10"
        aria-label="Next image"
      >
        <svg
          className="w-12 h-12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;

