import type { ServiceId } from "./studio";

// `source` points at the image extracted from the client's deck (assets/portfolio-pdf/<deck>/<file>).
// `npm run images` converts each one to public/images/projects/<slug>/<index>.webp.
export type ProjectImage = {
  source: string;
  kind: "render" | "site" | "plan";
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  concept?: string;
  category: ServiceId;
  location?: string;
  facts: { label: string; value: string }[];
  summary: string;
  description: string;
  images: ProjectImage[];
  featured?: boolean;
  // Present only in the 2024 deck; client to confirm it should stay.
  needsConfirmation?: boolean;
};

export const projects: Project[] = [
  {
    slug: "kalantri-mansion",
    name: "Kalantri Mansion",
    concept: "House of Grids",
    category: "residential",
    facts: [{ label: "Plot", value: "2,400 sq ft" }],
    summary: "A contemporary residence that begins on the first floor for an elevated way of living.",
    description:
      "The House of Grids sits on a 2,400 sq ft plot and is designed to start on the first floor for an elevated living experience. A spacious open-plan living and dining area flows into a modern kitchen, with a dedicated home office, smart-home technology, energy-efficient appliances and refined fixtures. Balconies and outdoor spaces offer room to relax, while large windows fill the home with natural light.",
    images: [
      {
        source: "v2-latest/p08-1.jpeg",
        kind: "render",
        alt: "Kalantri Mansion street elevation render with timber and grey grid facade",
      },
      { source: "v2-latest/p08-2.jpeg", kind: "site", alt: "Kalantri Mansion under construction" },
    ],
    featured: true,
  },
  {
    slug: "panchal-mansion",
    name: "Panchal Mansion",
    concept: "The Air Mansion",
    category: "residential",
    facts: [{ label: "Plot", value: "5,000 sq ft" }],
    summary: "A courtyard home with double-height living spaces and a water body at its heart.",
    description:
      "Designed on a 5,000 sq ft plot, the Air Mansion is organised around a central courtyard that acts as the heart of the home. The living and drawing rooms rise to double-height ceilings for light and ventilation, and a serene water body inside the living room connects indoors and out. Large glass doors and carefully placed windows create cross ventilation, while stone, wood and lush landscaping make it a calm, elegant retreat.",
    images: [
      { source: "v2-latest/p09-3.jpeg", kind: "render", alt: "Panchal Mansion front elevation render at dusk" },
      { source: "v2-latest/p09-1.jpeg", kind: "site", alt: "Panchal Mansion structure, cantilevered concrete forms" },
      { source: "v2-latest/p09-2.jpeg", kind: "site", alt: "Panchal Mansion structure from the corner" },
    ],
    featured: true,
  },
  {
    slug: "shakti-pump-headquarter",
    name: "Shakti Pump Headquarter",
    concept: "Silver Spring Commercial",
    category: "commercial",
    location: "Silver Spring Business Park, Bypass, Indore",
    facts: [
      { label: "Plot", value: "9,000 sq ft" },
      { label: "Built-up", value: "20,000 sq ft" },
    ],
    summary: "A 20,000 sq ft corporate headquarters built for collaboration.",
    description:
      "Designed for Shakti Pump on a 9,000 sq ft plot in Silver Spring Business Park, the building offers 20,000 sq ft of built-up area. An efficient layout maximises usable space and meets modern building standards, with expansive offices, conference rooms and an open-plan work environment that encourages collaboration and productivity.",
    images: [
      { source: "v2-latest/p10-1.jpeg", kind: "render", alt: "Shakti Pump headquarters facade render" },
      { source: "v2-latest/p10-2.png", kind: "site", alt: "Completed Shakti Pump headquarters building" },
    ],
    featured: true,
  },
  {
    slug: "anandam-farmhouse",
    name: "Anandam Farmhouse",
    concept: "Bohemian theme",
    category: "residential",
    location: "Indore",
    facts: [{ label: "Area", value: "7,000 sq ft" }],
    summary: "A relaxed bohemian retreat of earthy tones, handcrafted textures and lush landscape.",
    description:
      "A 7,000 sq ft farmhouse designed as a relaxed bohemian retreat, blending earthy tones, natural materials, handcrafted textures and a lush landscape. Indoor and outdoor spaces flow together, with warm, informal areas that invite relaxation, gathering and a connection with nature.",
    images: [
      {
        source: "v2-latest/p11-4.jpeg",
        kind: "render",
        alt: "Anandam Farmhouse with curved stone walls and round window",
      },
      { source: "v2-latest/p11-2.png", kind: "render", alt: "Anandam Farmhouse lawn and pool at night" },
      { source: "v2-latest/p11-3.jpeg", kind: "plan", alt: "Anandam Farmhouse ground floor plan" },
    ],
    featured: true,
  },
  {
    slug: "travell-inn-ujjain",
    name: "Travell Inn",
    concept: "Hotel of 24 rooms",
    category: "hospitality",
    location: "Ujjain",
    facts: [{ label: "Rooms", value: "24" }],
    summary: "A 24-room hotel blending comfort with modern convenience.",
    description:
      "The 24-room hotel in Ujjain gives guests comfort and modern convenience. Every room uses modular furniture that saves space without losing style, a computerised check-in and check-out keeps arrivals smooth, and high-speed Wi-Fi, smart TVs and energy-efficient lighting complete a contemporary stay.",
    images: [
      { source: "v2-latest/p12-1.jpeg", kind: "render", alt: "Travell Inn hotel tower render" },
      { source: "v2-latest/p12-2.jpeg", kind: "site", alt: "Travell Inn under construction" },
    ],
  },
  {
    slug: "she-think-office",
    name: "SHE Think Office",
    category: "commercial",
    facts: [{ label: "Area", value: "1,450 sq ft" }],
    summary: "A refined 1,450 sq ft workplace planned for different ways of working.",
    description:
      "SHE Think is a contemporary 1,450 sq ft office designed to be refined, functional and inspiring. Workstations, collaborative areas, meeting spaces and informal zones support different modes of work, while clear circulation and an organised layout keep the office easy to use without compromising its look.",
    images: [
      {
        source: "v2-latest/p13-3.jpeg",
        kind: "render",
        alt: "SHE Think office interior with arched niche and artwork",
      },
      { source: "v2-latest/p13-2.jpeg", kind: "site", alt: "SHE Think office during construction" },
    ],
  },
  {
    slug: "maru-mansion",
    name: "Maru Mansion",
    concept: "Architectural elevation design",
    category: "residential",
    facts: [],
    summary: "A façade balancing modern clean lines with warmth and elegance.",
    description:
      "The elevation of Maru Mansion balances modern aesthetics, elegance and function. Clean lines, well-defined forms and a harmonious mix of materials give it a distinctive exterior, while planned textures, colours and finishes add character. Balanced proportions and contemporary detailing create a timeless expression that blends luxury with simplicity.",
    images: [
      { source: "v2-latest/p14-2.jpeg", kind: "render", alt: "Maru Mansion elevation at dusk with planted balconies" },
    ],
    featured: true,
  },
  {
    slug: "residential-bungalow-ujjain",
    name: "Residential Bungalow",
    category: "residential",
    location: "Ujjain, Madhya Pradesh",
    facts: [],
    summary: "A comfortable modern family home planned around light and ventilation.",
    description:
      "A residential bungalow in Ujjain designed as a comfortable, modern home, with well-planned living, dining, bedrooms, kitchen and outdoor areas. The design focuses on natural light, ventilation, function and a simple modern aesthetic.",
    images: [
      { source: "v2-latest/p15-2.png", kind: "render", alt: "Ujjain bungalow front elevation render" },
      { source: "v2-latest/p15-3.png", kind: "render", alt: "Ujjain bungalow corner view render" },
    ],
  },
  {
    slug: "evara-mansion",
    name: "Evara Mansion",
    category: "residential",
    location: "Nalkheda, Madhya Pradesh",
    facts: [],
    summary: "A contemporary family bungalow with warm lighting and textured surfaces.",
    description:
      "Evara Mansion is a residential bungalow in Nalkheda designed as a comfortable, modern family home focused on function, privacy, natural light and ventilation. Clean forms, balanced proportions, neutral materials, textured surfaces and warm lighting define the architecture, while landscaped areas and outdoor seating make room for relaxation and family gatherings.",
    images: [
      { source: "v2-latest/p16-2.png", kind: "render", alt: "Evara Mansion lit at dusk" },
      { source: "v2-latest/p16-1.png", kind: "render", alt: "Evara Mansion street view at night" },
      { source: "v2-latest/p16-4.png", kind: "site", alt: "Evara Mansion under construction" },
    ],
    featured: true,
  },
  {
    slug: "residential-bungalow-betma",
    name: "Residential Bungalow",
    concept: "Contemporary-classical",
    category: "residential",
    location: "Betma, Madhya Pradesh",
    facts: [],
    summary: "A grand symmetrical façade pairing classical detailing with warm modern materials.",
    description:
      "A grand, elegant contemporary-classical elevation with balanced proportions and refined decorative detailing: a symmetrical composition, prominent columns, framed openings, ornamental railings, patterned screens and a clean white palette. Warm timber and large glazing add contrast, and the landscaped frontage and integrated lighting complete a sophisticated, welcoming residence.",
    images: [
      { source: "v2-latest/p17-2.png", kind: "render", alt: "Betma bungalow white classical elevation render" },
      { source: "v2-latest/p17-1.jpeg", kind: "site", alt: "Betma bungalow under construction" },
    ],
  },
  {
    slug: "akshay-palace-hotel",
    name: "Akshay Palace",
    concept: "Hotel",
    category: "hospitality",
    location: "Ujjain",
    facts: [],
    summary: "A contemporary hotel balancing guest comfort and visual appeal.",
    description:
      "Akshay Palace is a contemporary hospitality project in Ujjain designed to give guests a comfortable, welcoming and memorable stay. The architecture balances function and visual appeal, with spaces planned around hospitality needs and guest movement.",
    images: [
      { source: "v2-latest/p18-2.png", kind: "render", alt: "Akshay Palace hotel lit at night" },
      { source: "v2-latest/p18-3.png", kind: "render", alt: "Akshay Palace hotel night view from the corner" },
    ],
  },
  {
    slug: "khandelwal-mansion",
    name: "Khandelwal Mansion",
    concept: "House of Sun",
    category: "residential",
    facts: [{ label: "Plot", value: "3,600 sq ft" }],
    summary: "A luxurious bungalow open on three sides to sunlight and outdoor living.",
    description:
      "The House of Sun is a luxurious bungalow on a 3,600 sq ft plot, open on three sides to maximise natural light and outdoor living. An open-plan layout includes a modern living area and flexible spaces such as a home office or gym. High-end finishes, smart-home technology and sustainable features combine with landscaped gardens, an entertaining patio and a pool.",
    images: [
      { source: "v1-2024/p08-3.jpeg", kind: "render", alt: "House of Sun bungalow render" },
      { source: "v1-2024/p08-1.jpeg", kind: "site", alt: "House of Sun under construction" },
      { source: "v1-2024/p08-2.jpeg", kind: "site", alt: "House of Sun structure with scaffolding" },
    ],
    needsConfirmation: true,
  },
  {
    slug: "jain-palace-khachrod",
    name: "Jain Palace",
    concept: "Commercial complex",
    category: "commercial",
    location: "Khachrod",
    facts: [{ label: "Use", value: "Showrooms + residences" }],
    summary: "A mixed-use complex with glass-fronted showrooms below and homes above.",
    description:
      "A mixed-use complex that makes the most of its site while building brand value. Ground-floor showrooms with expansive glass façades draw foot traffic, contemporary residential units above enjoy views and easy access to amenities, and shared facilities such as a rooftop garden and fitness centre serve both businesses and residents.",
    images: [
      { source: "v1-2024/p12-1.jpeg", kind: "render", alt: "Jain Palace classical mixed-use facade render" },
      { source: "v1-2024/p12-2.jpeg", kind: "render", alt: "Jain Palace street view render" },
      { source: "v1-2024/p12-3.jpeg", kind: "site", alt: "Jain Palace column structure on site" },
    ],
    needsConfirmation: true,
  },
  {
    slug: "nbk-paint-factory",
    name: "NBK Paint Factory",
    concept: "Sunlight Shell",
    category: "commercial",
    facts: [{ label: "Plot", value: "12,000 sq ft" }],
    summary: "A prefabricated factory planned for a clean, efficient production flow.",
    description:
      "Set on a 12,000 sq ft plot, the paint factory uses a prefabricated structure planned for efficient workflow, with zones for raw material storage, mixing, production and packaging. An open plan keeps movement easy, high ceilings and large windows bring in daylight, and energy-efficient lighting and waste management make it an eco-friendly workplace.",
    images: [
      { source: "v1-2024/p14-3.jpeg", kind: "site", alt: "NBK Paint Factory completed shed in orange and grey" },
      { source: "v1-2024/p14-2.jpeg", kind: "site", alt: "NBK Paint Factory front view" },
      { source: "v1-2024/p14-1.jpeg", kind: "site", alt: "NBK Paint Factory steel structure interior" },
    ],
    needsConfirmation: true,
  },
  {
    slug: "volcanus-institute",
    name: "Volcanus Institute",
    concept: "Modern institute",
    category: "commercial",
    facts: [],
    summary: "A sleek IT office interior built for creativity and collaboration.",
    description:
      "A modern IT office interior with an open reception, polished concrete floors and bold wall art. A glass-walled conference room with audiovisual equipment, two director cabins with ergonomic furniture and warm lighting, and a main floor of modular workstations balance teamwork with individual focus.",
    images: [
      { source: "v1-2024/p15-2.jpeg", kind: "site", alt: "Volcanus Institute open workstations" },
      { source: "v1-2024/p15-1.jpeg", kind: "site", alt: "Volcanus Institute reception with logo wall" },
      { source: "v1-2024/p15-3.jpeg", kind: "site", alt: "Volcanus Institute work area with portrait art" },
    ],
    needsConfirmation: true,
  },
  {
    slug: "the-farm",
    name: "The Farm",
    concept: "Organic farm",
    category: "urban-design",
    facts: [
      { label: "Farmhouses", value: "31" },
      { label: "Plots", value: "9,000–11,000 sq ft" },
      { label: "Built-up each", value: "1,500 sq ft" },
    ],
    summary: "A master plan of 31 farmhouses set around a fruit farm and pool.",
    description:
      "A site plan of 31 exclusive farmhouses on plots of 9,000 to 11,000 sq ft. Each offers 1,500 sq ft of built-up space with 1,000 sq ft of ground coverage, and blends indoor and outdoor living with a private sitting area overlooking the fruit farm and a sparkling swimming pool.",
    images: [
      { source: "v1-2024/p16-3.png", kind: "render", alt: "The Farm farmhouse render with paved court" },
      { source: "v1-2024/p16-2.png", kind: "render", alt: "The Farm entrance gate render" },
      { source: "v1-2024/p16-1.png", kind: "plan", alt: "The Farm master plan of 31 plots" },
    ],
    needsConfirmation: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectImageSrc = (slug: string, index: number) =>
  `/images/projects/${slug}/${String(index + 1).padStart(2, "0")}.webp`;
