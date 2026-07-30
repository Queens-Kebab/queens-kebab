"use client";

import { useState } from "react";
import { LocationCard } from "./LocationCard";
import { LOCATIONS } from "@/data/locations";

/**
 * Client wrapper for the locations grid. Holds which branch photo is open so
 * only one card can show its photo at a time (clicking another closes the
 * previous; clicking the same one closes it).
 *
 * Below `md`: horizontal swipe carousel with scroll-snap (one branch per
 * view, next card peeking in). At `md` and up: the original grid — 2 cols
 * at md, 4 at xl — completely unchanged.
 */
export function LocationsGrid() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-pl-4 sm:-mx-6 sm:px-6 sm:scroll-pl-6 md:mx-0 md:grid md:snap-none md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:scroll-pl-0 md:grid-cols-2 xl:grid-cols-4">
      {LOCATIONS.map((loc, i) => (
        <div
          key={loc.id}
          className="w-[85vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink md:snap-align-none"
        >
          <LocationCard
            location={loc}
            index={i}
            selected={openId === loc.id}
            onToggle={() => setOpenId((cur) => (cur === loc.id ? null : loc.id))}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}
