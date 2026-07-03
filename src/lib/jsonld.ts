import { LOCATIONS, GOOGLE_RATING } from "@/data/locations";
import { SOCIALS, SITE_URL, BRAND } from "@/data/socials";

/** LocalBusiness graph for all four branches – injected via <script type="application/ld+json"> */
export function buildRestaurantJsonLd() {
  const sameAs = [SOCIALS.instagram, SOCIALS.facebook];

  const branches = LOCATIONS.map((loc) => {
    const coming = loc.comingSoon === true;
    return {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": `${SITE_URL}/#${loc.id}`,
      name: `${BRAND.name} – ${loc.district.cs}`,
      image: `${SITE_URL}/images_optimized/fallback.jpg`,
      servesCuisine: ["Turkish", "Kebab", "Grill"],
      priceRange: "$$",
      telephone: loc.phone,
      url: SITE_URL,
      sameAs,
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.address.split(",")[0]?.trim() ?? loc.address,
        addressLocality: "Praha",
        addressCountry: "CZ",
        postalCode: loc.address.match(/\d{3}\s?\d{2}/)?.[0] ?? "",
      },
      geo: loc.geo
        ? { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng }
        : undefined,
      // Coming-soon branch (Bohnice) is listed but not yet advertised as open
      // or rated — only active branches get opening hours + aggregate rating.
      ...(coming
        ? {}
        : {
            ...(loc.hoursSpec
              ? {
                  openingHoursSpecification: loc.hoursSpec.map((spec) => ({
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: spec.dayOfWeek,
                    opens: spec.opens,
                    closes: spec.closes,
                  })),
                }
              : {}),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: GOOGLE_RATING.score,
              reviewCount: GOOGLE_RATING.reviews,
            },
          }),
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": branches,
  };
}
