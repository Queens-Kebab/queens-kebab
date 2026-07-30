"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/data/gallery";

/**
 * Shared by the visible slide and the hidden neighbour warm-ups — they must
 * match exactly, otherwise the browser picks a different srcset candidate and
 * the "preload" turns into a second download.
 */
const FULL_SIZES = "100vw";
const QUALITY = 80;

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  /**
   * Bytes the opening card already painted. Shown immediately underneath the
   * full-size slide so the overlay is never blank while the larger variant
   * decodes. Cleared once the user navigates to another slide.
   */
  poster?: string | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Shared fullscreen image viewer used by the landing-page gallery and the
 * /galerie subpage. Supports:
 *  - prev/next arrows
 *  - keyboard ← → and Esc
 *  - touch swipe left/right
 *  - body-scroll lock + neighbour preloading for instant navigation
 */
export function Lightbox({ images, index, poster, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[index];
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const openIndexRef = useRef(index);
  const showPoster = Boolean(poster) && openIndexRef.current === index && !loaded;
  const touchStartX = useRef<number | null>(null);

  // Reset transient state when the visible image changes
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [index]);

  // Only the immediately adjacent slides — never the whole set. Deduped so a
  // 1- or 2-image gallery doesn't render the same warm-up twice.
  const neighbours = useMemo(() => {
    if (images.length < 2) return [];
    const prevIdx = (index - 1 + images.length) % images.length;
    const nextIdx = (index + 1) % images.length;
    const seen = new Set([images[index].src]);
    return [images[nextIdx], images[prevIdx]].filter((n) => {
      if (seen.has(n.src)) return false;
      seen.add(n.src);
      return true;
    });
  }, [index, images]);

  // Keyboard navigation + lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  const arrowBtn =
    "absolute top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center " +
    "rounded-full text-white transition active:scale-95 " +
    "[filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.9))] " +
    "sm:h-14 sm:w-14 sm:border sm:border-white/20 sm:bg-black/40 " +
    "sm:backdrop-blur-md sm:[filter:none] sm:shadow-lg " +
    "sm:hover:border-brand-red sm:hover:bg-brand-red/25 sm:hover:text-white";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close — fixed to the viewport so it stays clearly visible above the
          image on mobile and desktop, with a safe-area-aware top offset. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Zavřít"
        style={{ top: "calc(env(safe-area-inset-top) + 16px)", right: "16px" }}
        className="fixed z-[120] grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-md transition hover:border-white/40 hover:bg-black/80 active:scale-95"
      >
        <X className="h-6 w-6" strokeWidth={2.25} />
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous"
        className={`${arrowBtn} left-2 sm:left-6`}
      >
        <ChevronLeft className="h-9 w-9 sm:h-7 sm:w-7" strokeWidth={2.5} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next"
        className={`${arrowBtn} right-2 sm:right-6`}
      >
        <ChevronRight className="h-9 w-9 sm:h-7 sm:w-7" strokeWidth={2.5} />
      </button>

      {/* Image frame */}
      <div
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && !failed && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
            style={{ aspectRatio: "4 / 3" }}
          >
            <div className="fallback-food absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/40" />
          </div>
        )}

        {showPoster && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            aria-hidden
            src={poster as string}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 m-auto block h-auto max-h-[94vh] w-auto max-w-[98vw] rounded-2xl object-contain"
          />
        )}

        {!failed ? (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={1600}
            height={1200}
            sizes={FULL_SIZES}
            quality={QUALITY}
            priority
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`block h-auto max-h-[94vh] w-auto max-w-[98vw] rounded-2xl object-contain shadow-2xl transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="fallback-food h-[60vh] w-[80vw] max-w-3xl rounded-2xl" />
        )}
      </div>

      {/*
        Neighbour warm-up. Rendering the previous/next slides through the same
        <Image> props guarantees byte-identical srcset candidates, so arrow and
        swipe navigation is a cache hit rather than a fresh download. Only the
        two adjacent images — never the whole category.
      */}
      <div aria-hidden className="pointer-events-none fixed h-px w-px overflow-hidden opacity-0">
        {neighbours.map((n) => (
          <Image
            key={n.src}
            src={n.src}
            alt=""
            width={1600}
            height={1200}
            sizes={FULL_SIZES}
            quality={QUALITY}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
