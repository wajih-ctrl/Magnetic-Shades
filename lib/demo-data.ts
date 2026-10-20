export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: "vehicle-shades" | "magnetic-signs" | "future-products";
  type: string;
  price: number;
  inventory: number;
  status: "Active" | "Draft";
  tag: string;
  eligibility:
    "buy" | "configure" | "customize" | "quote" | "soon" | "unavailable";
  color: string;
  updated: string;
  description: string;
  image: string;
  approvedClaims: string;
  images?: string[];
  variants?: string[];
  shippingWeight?: number;
  shippingClass?: string;
  taxCategory?: string;
};

export type FitmentStatus =
  "Verified" | "Needs Confirmation" | "Not Compatible";
export type Fitment = {
  id: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  body: string;
  market: string;
  sku: string;
  zones: string[];
  status: FitmentStatus;
  tested: string;
  revision: number;
  geometry: string;
  notes: string;
  exclusions: string;
  history: {
    revision: number;
    date: string;
    note: string;
    status?: FitmentStatus;
    zones?: string[];
  }[];
};

export type SignConfiguration = {
  artworkKey?: string;
  size: string;
  material: string;
  qty: number;
  color: string;
  assist: boolean;
  filename: string;
  proofStatus: string;
  productType: string;
  alignment: string;
  assistNotes: string;
  requestedChanges: string;
  approvedFingerprint: string;
  customerApproval: string;
  businessReviewStatus: string;
  printReadiness: string;
  pixelWidth: number;
  pixelHeight: number;
  resolutionWarning: string;
  proofVersion: number;
};
export function signConfigurationFingerprint(
  sign: Pick<
    SignConfiguration,
    | "artworkKey"
    | "filename"
    | "size"
    | "material"
    | "qty"
    | "color"
    | "productType"
    | "alignment"
  >,
) {
  return [
    sign.artworkKey || "",
    sign.filename,
    sign.productType,
    sign.size,
    sign.material,
    sign.qty,
    sign.color,
    sign.alignment,
  ].join("|");
}
export type CartItem = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
  meta: string;
  image: string;
  quoteId?: string;
  shadeConfiguration?: {
    vehicle: DemoState["vehicle"];
    zones: string[];
    mesh: string;
    edge: string;
  };
  signConfiguration?: SignConfiguration;
};
export type DemoOrder = {
  id: string;
  customer: string;
  email: string;
  shippingAddress: string;
  date: string;
  total: number;
  payment: string;
  fulfillment: string;
  request: string;
  delivery: string;
  items: {
    name: string;
    qty: number;
    price: number;
    meta: string;
    image?: string;
    signConfiguration?: SignConfiguration;
    shadeConfiguration?: CartItem["shadeConfiguration"];
  }[];
  timeline: string[];
};
export type Quote = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  config: string;
  date: string;
  status: string;
  amount: number | null;
  email?: string;
  company?: string;
  notes?: string;
  requestedTiming?: string;
  artworkId?: string;
  artworkKey?: string;
  filename?: string;
  productSku?: string;
  material?: string;
  size?: string;
  customerResponseAt?: string;
};
export type Artwork = {
  id: string;
  customer: string;
  product: string;
  filename: string;
  proof: number;
  status: string;
  readiness: string;
  artworkKey?: string;
  quoteId?: string;
  config?: string;
};

export const categories = [
  {
    slug: "vehicle-shades",
    name: "Exterior Magnetic Vehicle Shades",
    kicker: "Vehicle-specific comfort",
    image:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85",
    copy: "Configure shade coverage around compatible exterior metal surfaces and door-frame areas.",
  },
  {
    slug: "magnetic-signs",
    name: "Magnetic Advertising Signs & Accessories",
    kicker: "Brand while you move",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=85",
    copy: "Size, finish, artwork and proof workflows made clear from first draft to quote.",
  },
  {
    slug: "future-products",
    name: "Future Products",
    kicker: "In development",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85",
    copy: "A considered preview of seasonal, interior and lighting concepts coming later.",
  },
] as const;

export const seedProducts: Product[] = [
  {
    id: "p1",
    slug: "aero-edge-kit",
    name: "Aero Edge Shade Kit",
    sku: "MS-AE-240",
    category: "vehicle-shades",
    type: "Vehicle shade",
    price: 289,
    inventory: 18,
    status: "Active",
    tag: "Best seller",
    eligibility: "configure",
    color: "Graphite",
    updated: "Oct 14, 2026",
    description:
      "A tailored four-window magnetic shade set for supported demonstration vehicle records.",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
    approvedClaims:
      "Exterior magnetic mounting on compatible metal frame surfaces.",
  },
  {
    id: "p2",
    slug: "city-pair-shades",
    name: "City Pair Shade Set",
    sku: "MS-CP-118",
    category: "vehicle-shades",
    type: "Vehicle shade",
    price: 169,
    inventory: 31,
    status: "Active",
    tag: "Everyday",
    eligibility: "configure",
    color: "Black",
    updated: "Oct 12, 2026",
    description:
      "Driver and passenger front-window coverage in a light, compact format.",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "Window-specific coverage for supported demo fitments.",
  },
  {
    id: "p3",
    slug: "fleetmark-door-pair",
    name: "Fleetmark Door Pair",
    sku: "MS-FM-1824",
    category: "magnetic-signs",
    type: "Custom sign",
    price: 126,
    inventory: 74,
    status: "Active",
    tag: "Custom artwork",
    eligibility: "customize",
    color: "White",
    updated: "Oct 15, 2026",
    description: "A removable magnetic sign pair with guided artwork proofing.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85",
    approvedClaims:
      "Removable magnetic signage for suitable clean steel panels.",
  },
  {
    id: "p4",
    slug: "studio-magnetic-panel",
    name: "Studio Magnetic Panel",
    sku: "MS-SP-2436",
    category: "magnetic-signs",
    type: "Custom sign",
    price: 0,
    inventory: 40,
    status: "Active",
    tag: "Quote only",
    eligibility: "quote",
    color: "White",
    updated: "Oct 11, 2026",
    description:
      "Large-format magnetic panel for custom fleet applications and manual quotation.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "Custom sizing and artwork review available.",
  },
  {
    id: "p5",
    slug: "surface-prep-kit",
    name: "Surface Prep Kit",
    sku: "MS-CARE-01",
    category: "magnetic-signs",
    type: "Care accessory",
    price: 28,
    inventory: 56,
    status: "Active",
    tag: "Ready to ship",
    eligibility: "buy",
    color: "Neutral",
    updated: "Oct 10, 2026",
    description:
      "Soft cloths, panel-safe cleaning solution and storage sleeve for routine care.",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "For general cleaning and dry storage.",
  },
  {
    id: "p6",
    slug: "winter-interior-screen",
    name: "Winter Interior Screen",
    sku: "MS-FUT-02",
    category: "future-products",
    type: "Seasonal concept",
    price: 0,
    inventory: 0,
    status: "Draft",
    tag: "Coming soon",
    eligibility: "soon",
    color: "Silver",
    updated: "Oct 08, 2026",
    description:
      "An early concept preview for future seasonal interior coverage.",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "Concept preview only.",
  },
  {
    id: "p7",
    slug: "halo-entry-light",
    name: "Halo Entry Light",
    sku: "MS-FUT-04",
    category: "future-products",
    type: "Lighting concept",
    price: 0,
    inventory: 0,
    status: "Draft",
    tag: "Coming soon",
    eligibility: "soon",
    color: "Copper",
    updated: "Oct 07, 2026",
    description:
      "A restrained courtesy-light concept for a future accessory line.",
    image:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "Concept preview only.",
  },
  {
    id: "p8",
    slug: "edge-storage-sleeve",
    name: "Edge Storage Sleeve",
    sku: "MS-CASE-02",
    category: "vehicle-shades",
    type: "Storage accessory",
    price: 42,
    inventory: 0,
    status: "Active",
    tag: "Out of stock",
    eligibility: "unavailable",
    color: "Graphite",
    updated: "Oct 09, 2026",
    description:
      "A structured storage sleeve sized for paired exterior shades.",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=85",
    approvedClaims: "Dry storage accessory.",
  },
];

export type VehicleOption = {
  year: string;
  make: string;
  model: string;
  body: string;
  trims: string[];
  preview: "sedan" | "truck" | "suv";
};

export const vehicleCatalog: VehicleOption[] = [
  {
    year: "2008",
    make: "BMW",
    model: "3 Series",
    body: "Sedan",
    trims: ["328i", "335i"],
    preview: "sedan",
  },
  {
    year: "2009",
    make: "Hyundai",
    model: "Sonata",
    body: "Sedan",
    trims: ["GLS", "SE", "Limited"],
    preview: "sedan",
  },
  {
    year: "2010",
    make: "Kia",
    model: "Soul",
    body: "Hatchback",
    trims: ["Base", "Plus", "Exclaim"],
    preview: "suv",
  },
  {
    year: "2011",
    make: "BMW",
    model: "X5",
    body: "SUV",
    trims: ["xDrive35i", "xDrive50i"],
    preview: "suv",
  },
  {
    year: "2012",
    make: "Hyundai",
    model: "Elantra",
    body: "Sedan",
    trims: ["GLS", "Limited"],
    preview: "sedan",
  },
  {
    year: "2012",
    make: "Kia",
    model: "Optima",
    body: "Sedan",
    trims: ["LX", "EX", "SX"],
    preview: "sedan",
  },
  {
    year: "2013",
    make: "BMW",
    model: "3 Series",
    body: "Sedan",
    trims: ["320i", "328i", "335i"],
    preview: "sedan",
  },
  {
    year: "2014",
    make: "Hyundai",
    model: "Santa Fe Sport",
    body: "SUV",
    trims: ["Base", "2.0T"],
    preview: "suv",
  },
  {
    year: "2014",
    make: "Kia",
    model: "Sorento",
    body: "SUV",
    trims: ["LX", "EX", "SX"],
    preview: "suv",
  },
  {
    year: "2015",
    make: "Toyota",
    model: "Camry",
    body: "Sedan",
    trims: ["LE", "SE", "XLE"],
    preview: "sedan",
  },
  {
    year: "2015",
    make: "Honda",
    model: "CR-V",
    body: "SUV",
    trims: ["LX", "EX", "EX-L"],
    preview: "suv",
  },
  {
    year: "2016",
    make: "BMW",
    model: "X3",
    body: "SUV",
    trims: ["sDrive28i", "xDrive28i", "xDrive35i"],
    preview: "suv",
  },
  {
    year: "2016",
    make: "Hyundai",
    model: "Tucson",
    body: "SUV",
    trims: ["SE", "Eco", "Sport", "Limited"],
    preview: "suv",
  },
  {
    year: "2016",
    make: "Kia",
    model: "Soul",
    body: "Hatchback",
    trims: ["Base", "Plus", "Exclaim"],
    preview: "suv",
  },
  {
    year: "2017",
    make: "Ford",
    model: "F-150",
    body: "Crew Cab",
    trims: ["XL", "XLT", "Lariat"],
    preview: "truck",
  },
  {
    year: "2017",
    make: "Nissan",
    model: "Altima",
    body: "Sedan",
    trims: ["S", "SV", "SR"],
    preview: "sedan",
  },
  {
    year: "2018",
    make: "BMW",
    model: "5 Series",
    body: "Sedan",
    trims: ["530i", "540i", "M550i"],
    preview: "sedan",
  },
  {
    year: "2018",
    make: "Hyundai",
    model: "Elantra",
    body: "Sedan",
    trims: ["SE", "SEL", "Limited"],
    preview: "sedan",
  },
  {
    year: "2018",
    make: "Kia",
    model: "Sportage",
    body: "SUV",
    trims: ["LX", "EX", "SX Turbo"],
    preview: "suv",
  },
  {
    year: "2019",
    make: "Chevrolet",
    model: "Equinox",
    body: "SUV",
    trims: ["L", "LS", "LT", "Premier"],
    preview: "suv",
  },
  {
    year: "2019",
    make: "Jeep",
    model: "Grand Cherokee",
    body: "SUV",
    trims: ["Laredo", "Limited", "Overland"],
    preview: "suv",
  },
  {
    year: "2020",
    make: "BMW",
    model: "3 Series",
    body: "Sedan",
    trims: ["330i", "M340i"],
    preview: "sedan",
  },
  {
    year: "2020",
    make: "Hyundai",
    model: "Santa Fe",
    body: "SUV",
    trims: ["SE", "SEL", "Limited"],
    preview: "suv",
  },
  {
    year: "2020",
    make: "Kia",
    model: "Telluride",
    body: "SUV",
    trims: ["LX", "S", "EX", "SX"],
    preview: "suv",
  },
  {
    year: "2026",
    make: "Toyota",
    model: "Corolla",
    body: "Sedan",
    trims: ["LE", "SE", "XSE"],
    preview: "sedan",
  },
  {
    year: "2021",
    make: "Toyota",
    model: "Camry",
    body: "Sedan",
    trims: ["LE", "SE", "XLE"],
    preview: "sedan",
  },
  {
    year: "2021",
    make: "Honda",
    model: "Accord",
    body: "Sedan",
    trims: ["LX", "Sport", "EX-L", "Touring"],
    preview: "sedan",
  },
  {
    year: "2021",
    make: "Ford",
    model: "F-150",
    body: "Crew Cab",
    trims: ["XL", "XLT", "Lariat"],
    preview: "truck",
  },
  {
    year: "2025",
    make: "Toyota",
    model: "Camry",
    body: "Sedan",
    trims: ["LE", "SE", "XLE"],
    preview: "sedan",
  },
  {
    year: "2025",
    make: "Honda",
    model: "CR-V",
    body: "SUV",
    trims: ["LX", "EX", "Sport-L Hybrid"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Ford",
    model: "F-150",
    body: "Crew Cab",
    trims: ["XL", "XLT", "Lariat"],
    preview: "truck",
  },
  {
    year: "2024",
    make: "Honda",
    model: "Civic",
    body: "Sedan",
    trims: ["Sport", "Touring"],
    preview: "sedan",
  },
  {
    year: "2024",
    make: "Honda",
    model: "Civic",
    body: "Hatchback",
    trims: ["Sport", "Sport Touring"],
    preview: "suv",
  },
  {
    year: "2024",
    make: "Toyota",
    model: "RAV4",
    body: "SUV",
    trims: ["LE", "XLE", "Adventure"],
    preview: "suv",
  },
  {
    year: "2024",
    make: "Ford",
    model: "Escape",
    body: "SUV",
    trims: ["Active", "ST-Line", "Platinum"],
    preview: "suv",
  },
  {
    year: "2023",
    make: "Toyota",
    model: "Corolla",
    body: "Sedan",
    trims: ["LE", "SE", "XSE"],
    preview: "sedan",
  },
  {
    year: "2023",
    make: "Toyota",
    model: "Corolla",
    body: "Hatchback",
    trims: ["SE", "XSE"],
    preview: "suv",
  },
  {
    year: "2023",
    make: "Honda",
    model: "Accord",
    body: "Sedan",
    trims: ["LX", "EX", "Touring Hybrid"],
    preview: "sedan",
  },
  {
    year: "2023",
    make: "Ford",
    model: "Bronco Sport",
    body: "SUV",
    trims: ["Big Bend", "Outer Banks", "Badlands"],
    preview: "suv",
  },
  {
    year: "2022",
    make: "Ford",
    model: "F-150",
    body: "Crew Cab",
    trims: ["XL", "XLT", "Lariat"],
    preview: "truck",
  },
  {
    year: "2022",
    make: "Ford",
    model: "F-150",
    body: "SuperCab",
    trims: ["XL", "XLT"],
    preview: "truck",
  },
  {
    year: "2022",
    make: "Toyota",
    model: "Highlander",
    body: "SUV",
    trims: ["LE", "XLE", "Limited"],
    preview: "suv",
  },
  {
    year: "2022",
    make: "Honda",
    model: "CR-V",
    body: "SUV",
    trims: ["LX", "EX", "EX-L"],
    preview: "suv",
  },
  {
    year: "2022",
    make: "Chevrolet",
    model: "Equinox",
    body: "SUV",
    trims: ["LS", "LT", "Premier"],
    preview: "suv",
  },
  {
    year: "2021",
    make: "Toyota",
    model: "RAV4",
    body: "SUV",
    trims: ["LE", "XLE", "Adventure"],
    preview: "suv",
  },
  {
    year: "2021",
    make: "Honda",
    model: "Civic",
    body: "Sedan",
    trims: ["LX", "EX", "Touring"],
    preview: "sedan",
  },
  {
    year: "2023",
    make: "Chevrolet",
    model: "Malibu",
    body: "Sedan",
    trims: ["LS", "LT", "2LT"],
    preview: "sedan",
  },
  {
    year: "2023",
    make: "Jeep",
    model: "Grand Cherokee",
    body: "SUV",
    trims: ["Laredo", "Limited"],
    preview: "suv",
  },
  {
    year: "2023",
    make: "Nissan",
    model: "Altima",
    body: "Sedan",
    trims: ["S", "SV", "SR"],
    preview: "sedan",
  },
  {
    year: "2024",
    make: "Tesla",
    model: "Model 3",
    body: "Sedan",
    trims: ["RWD", "Long Range", "Performance"],
    preview: "sedan",
  },
  {
    year: "2024",
    make: "Jeep",
    model: "Wrangler",
    body: "SUV",
    trims: ["Sport", "Sahara", "Rubicon"],
    preview: "suv",
  },
  {
    year: "2024",
    make: "Subaru",
    model: "Forester",
    body: "SUV",
    trims: ["Base", "Premium", "Sport"],
    preview: "suv",
  },
  {
    year: "2024",
    make: "Hyundai",
    model: "Tucson",
    body: "SUV",
    trims: ["SEL", "XRT", "Limited"],
    preview: "suv",
  },
  {
    year: "2024",
    make: "Kia",
    model: "Telluride",
    body: "SUV",
    trims: ["LX", "S", "EX"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Chevrolet",
    model: "Equinox",
    body: "SUV",
    trims: ["LT", "RS", "ACTIV"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Chevrolet",
    model: "Silverado 1500",
    body: "Crew Cab",
    trims: ["WT", "LT", "High Country"],
    preview: "truck",
  },
  {
    year: "2025",
    make: "Jeep",
    model: "Grand Cherokee",
    body: "SUV",
    trims: ["Laredo", "Limited", "Overland"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Subaru",
    model: "Outback",
    body: "SUV",
    trims: ["Base", "Premium", "Wilderness"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Mazda",
    model: "CX-5",
    body: "SUV",
    trims: ["S Select", "S Preferred", "S Premium"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Nissan",
    model: "Rogue",
    body: "SUV",
    trims: ["S", "SV", "SL"],
    preview: "suv",
  },
  {
    year: "2025",
    make: "Nissan",
    model: "Altima",
    body: "Sedan",
    trims: ["S", "SV", "SR"],
    preview: "sedan",
  },
  {
    year: "2025",
    make: "Volkswagen",
    model: "Tiguan",
    body: "SUV",
    trims: ["S", "SE", "SEL"],
    preview: "suv",
  },
  {
    year: "2026",
    make: "Honda",
    model: "Civic",
    body: "Sedan",
    trims: ["Sport", "Touring"],
    preview: "sedan",
  },
  {
    year: "2026",
    make: "Tesla",
    model: "Model 3",
    body: "Sedan",
    trims: ["RWD", "Long Range", "Performance"],
    preview: "sedan",
  },
  {
    year: "2026",
    make: "Tesla",
    model: "Model Y",
    body: "SUV",
    trims: ["Standard", "Long Range", "Performance"],
    preview: "suv",
  },
  {
    year: "2026",
    make: "Chevrolet",
    model: "Silverado 1500",
    body: "Crew Cab",
    trims: ["WT", "LT", "High Country"],
    preview: "truck",
  },
  {
    year: "2026",
    make: "Hyundai",
    model: "Elantra",
    body: "Sedan",
    trims: ["SE", "SEL", "Limited"],
    preview: "sedan",
  },
  {
    year: "2026",
    make: "Kia",
    model: "Sportage",
    body: "SUV",
    trims: ["LX", "EX", "SX"],
    preview: "suv",
  },
];

export function vehiclePreviewFor(vehicle: {
  year: string;
  make: string;
  model: string;
  body: string;
}) {
  return (
    vehicleCatalog.find(
      (item) =>
        item.year === vehicle.year &&
        item.make === vehicle.make &&
        item.model === vehicle.model &&
        item.body === vehicle.body,
    )?.preview ??
    (vehicle.body.includes("Cab")
      ? "truck"
      : vehicle.body === "SUV" || vehicle.body === "Hatchback"
        ? "suv"
        : "sedan")
  );
}

const featuredFitments: Fitment[] = [
  {
    id: "FIT-101",
    year: "2023",
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    body: "Sedan",
    market: "US Demo",
    sku: "MS-AE-240",
    zones: [
      "Driver front",
      "Driver rear",
      "Passenger front",
      "Passenger rear",
      "Windshield",
    ],
    status: "Verified",
    tested: "Oct 16, 2026",
    revision: 3,
    geometry: "GEO-CRL-03",
    notes:
      "Apply only to compatible clean metal door-frame and exterior windshield-perimeter points. Never attach directly to glass.",
    exclusions:
      "Direct glass mounting; operation of moving windows while shades are installed",
    history: [
      {
        revision: 1,
        date: "Sep 18, 2026",
        note: "Initial front-pair demo record.",
      },
      {
        revision: 2,
        date: "Oct 02, 2026",
        note: "Rear door coverage added to sample record.",
      },
      {
        revision: 3,
        date: "Oct 16, 2026",
        note: "Added illustrative windshield coverage at compatible exterior metal perimeter points only.",
        status: "Verified",
        zones: [
          "Driver front",
          "Driver rear",
          "Passenger front",
          "Passenger rear",
          "Windshield",
        ],
      },
    ],
  },
  {
    id: "FIT-102",
    year: "2022",
    make: "Ford",
    model: "F-150",
    trim: "XLT",
    body: "Crew Cab",
    market: "US Demo",
    sku: "MS-AE-240",
    zones: ["Driver front", "Driver rear", "Passenger front", "Passenger rear"],
    status: "Needs Confirmation",
    tested: "Sep 28, 2026",
    revision: 1,
    geometry: "GEO-F150-01",
    notes:
      "Manual review required for cab dimensions and exterior metal contact points.",
    exclusions: "Windshield pending review",
    history: [
      {
        revision: 1,
        date: "Sep 28, 2026",
        note: "Created as confirmation-only demo record.",
      },
    ],
  },
  {
    id: "FIT-103",
    year: "2024",
    make: "Honda",
    model: "Civic",
    trim: "Touring",
    body: "Sedan",
    market: "US Demo",
    sku: "MS-AE-240",
    zones: [],
    status: "Not Compatible",
    tested: "Sep 14, 2026",
    revision: 1,
    geometry: "GEO-CVC-01",
    notes:
      "This shade product is recorded as not compatible with the selected vehicle.",
    exclusions: "All coverage zones",
    history: [
      {
        revision: 1,
        date: "Sep 14, 2026",
        note: "Marked not compatible in the sample dataset.",
      },
    ],
  },
  {
    id: "FIT-104",
    year: "2023",
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    body: "Sedan",
    market: "US Demo",
    sku: "MS-CP-118",
    zones: ["Driver front", "Passenger front"],
    status: "Verified",
    tested: "Oct 09, 2026",
    revision: 1,
    geometry: "GEO-CRL-CP-01",
    notes:
      "Front-pair coverage on compatible exterior metal door-frame points only.",
    exclusions: "Rear doors; windshield; direct glass mounting",
    history: [
      {
        revision: 1,
        date: "Oct 09, 2026",
        note: "Created verified City Pair sample record.",
        status: "Verified",
        zones: ["Driver front", "Passenger front"],
      },
    ],
  },
  {
    id: "FIT-105",
    year: "2022",
    make: "Ford",
    model: "F-150",
    trim: "XLT",
    body: "Crew Cab",
    market: "US Demo",
    sku: "MS-CP-118",
    zones: ["Driver front", "Passenger front"],
    status: "Needs Confirmation",
    tested: "Oct 05, 2026",
    revision: 1,
    geometry: "GEO-F150-CP-01",
    notes:
      "Cab dimensions and exterior metal contact points require manual review.",
    exclusions: "Rear doors; windshield pending confirmation",
    history: [
      {
        revision: 1,
        date: "Oct 05, 2026",
        note: "Created confirmation-only City Pair sample record.",
        status: "Needs Confirmation",
        zones: ["Driver front", "Passenger front"],
      },
    ],
  },
  {
    id: "FIT-106",
    year: "2024",
    make: "Honda",
    model: "Civic",
    trim: "Touring",
    body: "Sedan",
    market: "US Demo",
    sku: "MS-CP-118",
    zones: [],
    status: "Not Compatible",
    tested: "Oct 06, 2026",
    revision: 1,
    geometry: "GEO-CVC-CP-01",
    notes:
      "This shade product is recorded as not compatible with the selected vehicle.",
    exclusions: "All coverage zones",
    history: [
      {
        revision: 1,
        date: "Oct 06, 2026",
        note: "Added not-compatible City Pair scenario.",
        status: "Not Compatible",
        zones: [],
      },
    ],
  },
];

const featuredFitmentKeys = new Set(
  featuredFitments.map(
    (fitment) =>
      `${fitment.year}|${fitment.make}|${fitment.model}|${fitment.body}|${fitment.trim}|${fitment.sku}`,
  ),
);

const demoStatusCycle: FitmentStatus[] = [
  "Verified",
  "Needs Confirmation",
  "Verified",
  "Not Compatible",
];

const catalogFitments: Fitment[] = vehicleCatalog.flatMap(
  (vehicle, vehicleIndex) =>
    vehicle.trims.flatMap((trim, trimIndex) =>
      (["MS-AE-240", "MS-CP-118"] as const).flatMap((sku, skuIndex) => {
        const key = `${vehicle.year}|${vehicle.make}|${vehicle.model}|${vehicle.body}|${trim}|${sku}`;
        if (featuredFitmentKeys.has(key)) return [];
        const status =
          demoStatusCycle[
            (vehicleIndex + trimIndex + skuIndex) % demoStatusCycle.length
          ];
        const zones =
          status === "Not Compatible"
            ? []
            : sku === "MS-CP-118"
              ? ["Driver front", "Passenger front"]
              : [
                  "Driver front",
                  "Driver rear",
                  "Passenger front",
                  "Passenger rear",
                ];
        return [
          {
            id: `FIT-CAT-${vehicleIndex + 1}-${trimIndex + 1}-${skuIndex + 1}`,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            trim,
            body: vehicle.body,
            market: "Illustrative Demo",
            sku,
            zones,
            status,
            tested: "Oct 20, 2026",
            revision: 1,
            geometry: `GEO-DEMO-${vehicleIndex + 1}-${trimIndex + 1}`,
            notes:
              status === "Verified"
                ? "Illustrative verified scenario for configurator testing. Replace with validated production fitment data before launch."
                : status === "Needs Confirmation"
                  ? "This vehicle and shade combination requires a fitment review before purchase."
                  : "This illustrative record is marked not compatible with the selected shade product.",
            exclusions:
              status === "Verified"
                ? "Direct glass mounting; use only compatible exterior metal contact points"
                : status === "Needs Confirmation"
                  ? "Purchase remains unavailable until fitment is confirmed"
                  : "All coverage zones",
            history: [
              {
                revision: 1,
                date: "Oct 20, 2026",
                note: `Created ${status.toLowerCase()} catalog demonstration scenario.`,
                status,
                zones,
              },
            ],
          },
        ];
      }),
    ),
);

export const seedFitments: Fitment[] = [
  ...featuredFitments,
  ...catalogFitments,
];

export const seedOrders: DemoOrder[] = [
  {
    id: "MS-10428",
    customer: "Olivia Bennett",
    email: "olivia.bennett@example.demo",
    shippingAddress: "1842 Magnolia Avenue, Austin, TX 78704, United States",
    date: "Oct 15, 2026",
    total: 356.48,
    payment: "Paid (demo)",
    fulfillment: "Preparing",
    request: "None",
    delivery: "Illustrative delivery: Oct 22–24",
    items: [
      {
        name: "Aero Edge Shade Kit",
        qty: 1,
        price: 289,
        meta: "2023 Toyota Corolla Sedan LE · Four-window coverage",
      },
    ],
    timeline: ["Order created", "Demo payment approved", "Preparing"],
  },
  {
    id: "MS-10396",
    customer: "Ethan Parker",
    email: "ethan.parker@example.demo",
    shippingAddress: "725 NW Everett Street, Portland, OR 97209, United States",
    date: "Oct 12, 2026",
    total: 154.22,
    payment: "Paid (demo)",
    fulfillment: "Packed",
    request: "Refund requested",
    delivery: "Illustrative delivery: Oct 19–21",
    items: [
      {
        name: "Fleetmark Door Pair",
        qty: 1,
        price: 126,
        meta: "18 × 24 in · Matte",
      },
    ],
    timeline: ["Order created", "Proof approved", "Packed", "Refund requested"],
  },
];

export const seedQuotes: Quote[] = [
  {
    id: "QT-2081",
    customer: "Northline Studio",
    product: "Studio Magnetic Panel",
    qty: 4,
    config: "24 × 36 in · High-tack magnetic",
    date: "Oct 15, 2026",
    status: "Under Review",
    amount: null,
    email: "studio@example.com",
    artworkId: "ART-641",
    filename: "northline-mark.pdf",
    productSku: "MS-SP-2436",
  },
  {
    id: "QT-2074",
    customer: "Beacon Coffee",
    product: "Fleetmark Door Pair",
    qty: 2,
    config: "18 × 24 in · Matte",
    date: "Oct 13, 2026",
    status: "Quoted",
    amount: 264,
    email: "orders@beacon.example",
    artworkId: "ART-638",
    filename: "beacon-coffee.png",
    productSku: "MS-FM-1824",
  },
];

export const seedArtwork: Artwork[] = [
  {
    id: "ART-641",
    customer: "Northline Studio",
    product: "Studio Magnetic Panel",
    filename: "northline-mark.pdf",
    proof: 1,
    status: "Awaiting Review",
    readiness: "Blocked",
    quoteId: "QT-2081",
    config: "24 × 36 in · High-tack magnetic",
  },
  {
    id: "ART-638",
    customer: "Beacon Coffee",
    product: "Fleetmark Door Pair",
    filename: "beacon-coffee.png",
    proof: 2,
    status: "Approved",
    readiness: "Ready",
    quoteId: "QT-2074",
    config: "18 × 24 in · Matte",
  },
];

export const faqItems = [
  {
    category: "Products",
    q: "Do magnetic shades attach directly to window glass?",
    a: "No. The exterior shade concepts shown here mount to compatible metal vehicle body or door-frame surfaces described by the selected demonstration fitment record.",
  },
  {
    category: "Vehicle Compatibility",
    q: "What does Verified mean in this prototype?",
    a: "Verified means eligible within the fabricated demonstration dataset. It is not a claim of physical testing or real-world compatibility.",
  },
  {
    category: "Installation",
    q: "How should I prepare a mounting surface?",
    a: "Use a clean, dry and suitable metal surface. Review the vehicle-specific notes and never cover controls, cameras or required visibility areas.",
  },
  {
    category: "Magnetic Signs",
    q: "Can I upload my own artwork?",
    a: "Yes. The prototype accepts PNG, JPG and PDF files up to 10 MB locally for a simulated proof workflow. Files are not uploaded to a production service.",
  },
  {
    category: "Artwork & Proofs",
    q: "Does approving a proof start production?",
    a: "No. Proof approval, quotation and a confirmed production order are separate states in this demonstration.",
  },
  {
    category: "Ordering",
    q: "Will the checkout charge my card?",
    a: "No. Checkout is simulated and never asks for a real card number, CVV or payment token.",
  },
  {
    category: "Shipping & Returns",
    q: "Are the delivery dates guaranteed?",
    a: "No. Delivery ranges and policies shown here are illustrative sample content pending business approval.",
  },
];

export type DemoState = {
  version: number;
  products: Product[];
  fitments: Fitment[];
  orders: DemoOrder[];
  quotes: Quote[];
  artwork: Artwork[];
  cart: CartItem[];
  vehicle: {
    year: string;
    make: string;
    model: string;
    body: string;
    trim: string;
  };
  shade: {
    zones: string[];
    mesh: string;
    edge: string;
    view: string;
    zoom: number;
    angle: number;
    productSku: string;
  };
  sign: SignConfiguration;
  editingSignCartItemId: string;
  discount: string;
  lastOrderId: string;
  fitmentRequests: {
    id: string;
    customer: string;
    email?: string;
    phone?: string;
    notes?: string;
    vehicle: string;
    sku: string;
    coverage: string;
    appearance: string;
    status: string;
  }[];
  supportRequests: {
    id: string;
    name: string;
    category: string;
    status: string;
  }[];
  demoRole: string;
  events: string[];
};

export function initialState(): DemoState {
  return {
    version: 10,
    products: structuredClone(seedProducts),
    fitments: structuredClone(seedFitments),
    orders: structuredClone(seedOrders),
    quotes: structuredClone(seedQuotes),
    artwork: structuredClone(seedArtwork),
    cart: [
      {
        id: "line-seed-1",
        productId: "p5",
        name: "Surface Prep Kit",
        sku: "MS-CARE-01",
        qty: 1,
        price: 28,
        meta: "Neutral finish · Standard kit",
        image: seedProducts[4].image,
      },
    ],
    vehicle: {
      year: "2023",
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "LE",
    },
    shade: {
      zones: ["Driver front", "Passenger front"],
      mesh: "Performance mesh",
      edge: "Copper",
      view: "Driver side",
      zoom: 1,
      angle: 0,
      productSku: "MS-AE-240",
    },
    sign: {
      size: "18 × 24 in",
      material: "Matte magnetic",
      qty: 2,
      color: "#f5f3ee",
      assist: false,
      filename: "",
      proofStatus: "Awaiting Artwork",
      productType: "Fleetmark Door Pair",
      alignment: "Centered",
      assistNotes: "",
      requestedChanges: "",
      approvedFingerprint: "",
      customerApproval: "Not approved",
      businessReviewStatus: "Not submitted",
      printReadiness: "Not checked",
      pixelWidth: 0,
      pixelHeight: 0,
      resolutionWarning: "",
      proofVersion: 0,
    },
    editingSignCartItemId: "",
    discount: "",
    lastOrderId: "MS-10428",
    fitmentRequests: [],
    supportRequests: [],
    demoRole: "Retail customer",
    events: [],
  };
}
