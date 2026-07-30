import type { TranslationLeaf } from "./translations";

/** One displayed opening-hours row: a day range on the left, hours on the right. */
export interface OpeningRow {
  /** Day label, e.g. "Po–St" / "Mon–Wed" or "Každý den" / "Every day". */
  days: TranslationLeaf;
  /** Hours label, e.g. "10:00–24:00", or a closed/coming-soon label. */
  hours: TranslationLeaf;
  /** When true the branch is closed on these days (rendered muted). */
  closed?: boolean;
}

/** Machine-readable opening-hours block for JSON-LD (24h "HH:MM"). */
export interface OpeningSpec {
  /** schema.org day names, e.g. ["Monday", "Tuesday"]. */
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface Location {
  id: string;
  name: TranslationLeaf;
  address: string;
  district: TranslationLeaf;
  phone: string;
  /** Displayed opening hours as compact stacked day/hours rows. */
  openingHours: OpeningRow[];
  /**
   * Machine-readable weekly opening hours for JSON-LD. Optional — omit for
   * coming-soon branches. Normal weekly hours only (no holiday exceptions).
   */
  hoursSpec?: OpeningSpec[];
  /** Google Maps directions URL (replace with the exact place URL later). */
  directionsUrl: string;
  /** Google review URL placeholder – replace with the exact "write review" link per branch. */
  reviewUrl: string;
  /**
   * Delivery platform links. Use `null` (or omit) until you have the exact URL.
   *
   * Note: `foodora` was previously named `dame` (Dáme jídlo). Foodora acquired
   * Dáme jídlo in CZ, so the platform now lives under foodora.cz.
   */
  delivery: {
    wolt?: string | null;
    bolt?: string | null;
    foodora?: string | null;
  };
  /** Coordinates for JSON-LD (optional, edit to exact values). */
  geo?: { lat: number; lng: number };
  /** Branch photo shown on click in the locations section (optional). */
  image?: string;
  /**
   * When true, the branch is shown as "coming soon":
   *  - LocationCard renders an overlay with a PŘIPRAVUJEME / COMING SOON badge
   *  - Maps and Call buttons are disabled
   *  - Order section blurs the delivery platforms with a notice
   *  - Contact section adds a "(Připravujeme)" inline label
   *  - JSON-LD skips the branch
   */
  comingSoon?: boolean;
  /**
   * Independent from `comingSoon`: gates the /menu page's per-branch menu
   * grid only. Defaults to `comingSoon` when omitted. Set explicitly when a
   * branch is open for business (address/hours/order/contact all live) but
   * its food menu hasn't been digitized yet.
   */
  menuComingSoon?: boolean;
}

const PHONE = "+420799022871";
const BOHNICE_PHONE = "+420776172205";

export const LOCATIONS: Location[] = [
  {
    id: "karlin",
    name: { cs: "Queen's Kebab Karlín", en: "Queen's Kebab Karlín" },
    address: "Sokolovská 120/62, 186 00 Praha 8",
    district: { cs: "Karlín", en: "Karlín" },
    phone: PHONE,
    openingHours: [
      { days: { cs: "Po–St", en: "Mon–Wed" }, hours: { cs: "10:00–24:00", en: "10:00–24:00" } },
      { days: { cs: "Čt–So", en: "Thu–Sat" }, hours: { cs: "10:00–02:00", en: "10:00–02:00" } },
      { days: { cs: "Ne", en: "Sun" }, hours: { cs: "Zavřeno", en: "Closed" }, closed: true },
    ],
    hoursSpec: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "10:00", closes: "00:00" },
      { dayOfWeek: ["Thursday", "Friday", "Saturday"], opens: "10:00", closes: "02:00" },
    ],
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Queen%27s+Kebab+Sokolovsk%C3%A1+120+Praha+8",
    reviewUrl:
      "https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID_KARLIN",
    delivery: {
      wolt:
        "https://wolt.com/en/cze/prague/restaurant/queens-kebab-karlin?srsltid=AfmBOoqLgH1kesjFxELSMJ1VeiteLd-7Gpstsbis8EbW5Bhz_ZHCVGL0",
      bolt: "https://food.bolt.eu/en/271-prague/p/6649-queens-kebab-sokolovska/",
      // Foodora intentionally shared with Žižkov — same operator listing.
      foodora:
        "https://www.foodora.cz/restaurant/dcvz/queens-kebab-and-turkish-foods-dcvz",
    },
    geo: { lat: 50.0937, lng: 14.4476 },
    image: "/images_optimized/pobocka-karlin.webp",
  },
  {
    id: "vrsovice",
    name: { cs: "Queen's Kebab Vršovice", en: "Queen's Kebab Vršovice" },
    address: "U Slavie 1527/3, 100 00 Praha 10",
    district: { cs: "Vršovice", en: "Vršovice" },
    phone: PHONE,
    openingHours: [
      { days: { cs: "Po–St", en: "Mon–Wed" }, hours: { cs: "10:00–24:00", en: "10:00–24:00" } },
      { days: { cs: "Čt–So", en: "Thu–Sat" }, hours: { cs: "10:00–02:00", en: "10:00–02:00" } },
      { days: { cs: "Ne", en: "Sun" }, hours: { cs: "10:00–24:00", en: "10:00–24:00" } },
    ],
    hoursSpec: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Sunday"], opens: "10:00", closes: "00:00" },
      { dayOfWeek: ["Thursday", "Friday", "Saturday"], opens: "10:00", closes: "02:00" },
    ],
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Queen%27s+Kebab+U+Slavie+3+Praha+10",
    reviewUrl:
      "https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID_VRSOVICE",
    delivery: {
      wolt:
        "https://wolt.com/en/cze/prague/restaurant/queens-kebab-eden?srsltid=AfmBOorYUKSqfr2IsTzyBybBkRuGgmXVO4q0QvmRbVQW1OOBF43E_jWB",
      bolt: "https://food.bolt.eu/uk-ua/271-prague/p/37816-queens-kebab-oc-eden/",
      foodora: "https://www.foodora.cz/restaurant/ph6c/queens-kebab-oc-eden",
    },
    geo: { lat: 50.0686, lng: 14.4626 },
    image: "/images_optimized/pobocka-vrsovice.webp",
  },
  {
    id: "zizkov",
    name: { cs: "Queen's Kebab Žižkov", en: "Queen's Kebab Žižkov" },
    address: "Seifertova 33, 130 00 Praha 3",
    district: { cs: "Žižkov", en: "Žižkov" },
    phone: PHONE,
    openingHours: [
      { days: { cs: "Každý den", en: "Every day" }, hours: { cs: "10:00–06:00", en: "10:00–06:00" } },
    ],
    hoursSpec: [
      {
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "06:00",
      },
    ],
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Queen%27s+Kebab+Seifertova+33+Praha+3",
    reviewUrl:
      "https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID_ZIZKOV",
    delivery: {
      wolt:
        "https://wolt.com/en/cze/prague/restaurant/queens-kebab-seifertova?srsltid=AfmBOooPXb-ZAZ8X6UPQhbdc_qusSzYUCkLpUMYjI05E1gG6gVXXYf5L",
      bolt: "https://food.bolt.eu/en/271-prague/p/6650-queens-kebab-seifertova/",
      foodora:
        "https://www.foodora.cz/restaurant/dcvz/queens-kebab-and-turkish-foods-dcvz",
    },
    geo: { lat: 50.0809, lng: 14.4488 },
    image: "/images_optimized/pobocka-zizkov.webp",
  },
  {
    id: "bohnice",
    name: {
      cs: "Queen's Kebab & Pizza Bohnice",
      en: "Queen's Kebab & Pizza Bohnice",
    },
    address: "Lodžská 399/26, 181 00 Praha 8",
    district: { cs: "Bohnice", en: "Bohnice" },
    phone: BOHNICE_PHONE,
    openingHours: [
      { days: { cs: "Po–Ne", en: "Mon–Sun" }, hours: { cs: "10:00–22:00", en: "10:00–22:00" } },
    ],
    hoursSpec: [
      {
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Lod%C5%BEsk%C3%A1+399%2F26+Praha+8",
    reviewUrl:
      "https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID_BOHNICE",
    delivery: {
      wolt: null,
      bolt: null,
      foodora:
        "https://www.foodora.cz/restaurant/s2yj/queens-kebab-and-pizza-s2yj?utm_campaign=google_reserve_place_order_action_CH-SEO_",
    },
    geo: { lat: 50.1289, lng: 14.4221 },
    image: "/images_optimized/pobocka-bohnice.webp",
  },
];

export const PRIMARY_PHONE_DISPLAY = "+420 799 022 871";
export const PRIMARY_PHONE_TEL = PHONE;

export const BOHNICE_PHONE_DISPLAY = "+420 776 172 205";

/** Convenience: branches that are actually open for service. */
export const ACTIVE_LOCATIONS: Location[] = LOCATIONS.filter(
  (l) => !l.comingSoon,
);

export const GOOGLE_RATING = {
  score: 4.6,
  reviews: 2600,
};
