// "Find your needs" questionnaire. Draft from QUESTIONNAIRE.md — TODO(client): approve wording and options.
// Options tagged with an `audience` only show for that kind of project (derived from the answer to `type`).

export type Audience = "residential" | "commercial";

export type Option = {
  value: string;
  label: string;
  audience?: Audience;
  // Reveals a text box when picked; the string is its placeholder.
  withText?: string;
  image?: string;
};

export type Field = {
  id: string;
  label: string;
  kind: "number" | "checkbox";
  suffix?: string;
  audience?: Audience;
};

type Base = { id: string; title: string; summary: string; help?: string; optional?: boolean };

export type Question =
  | (Base & { kind: "single"; options: Option[] })
  | (Base & { kind: "multi"; options: Option[]; max?: number })
  | (Base & { kind: "fields"; fields: Field[] })
  | (Base & { kind: "text"; placeholder: string });

export const residentialTypes = ["home", "apartment", "farmhouse"];

export const questions: Question[] = [
  {
    id: "type",
    kind: "single",
    title: "What are you planning to build or design?",
    summary: "Project",
    options: [
      { value: "home", label: "Home / bungalow" },
      { value: "apartment", label: "Apartment / flat" },
      { value: "farmhouse", label: "Farmhouse / villa" },
      { value: "office", label: "Office / commercial space" },
      { value: "retail", label: "Shop / showroom" },
      { value: "hospitality", label: "Hotel / restaurant" },
      { value: "industrial", label: "Factory / industrial" },
      { value: "township", label: "Plotted development / township" },
      { value: "other", label: "Something else", withText: "Tell us what" },
    ],
  },
  {
    id: "location",
    kind: "single",
    title: "Where is the site?",
    summary: "Location",
    options: [
      { value: "indore", label: "Indore" },
      { value: "ujjain", label: "Ujjain" },
      { value: "mp", label: "Elsewhere in Madhya Pradesh", withText: "Town or city" },
      { value: "outside", label: "Outside Madhya Pradesh", withText: "City" },
    ],
  },
  {
    id: "services",
    kind: "multi",
    title: "What do you need from us?",
    summary: "Services",
    help: "Pick all that apply.",
    options: [
      { value: "architecture", label: "Architecture (planning & building design)" },
      { value: "elevation", label: "Elevation / façade design" },
      { value: "interior", label: "Interior design" },
      { value: "landscape", label: "Landscape design" },
      { value: "furniture", label: "Custom furniture" },
      { value: "turnkey", label: "Turnkey execution (design + build)" },
      { value: "unsure", label: "Not sure yet, guide me" },
    ],
  },
  {
    id: "stage",
    kind: "single",
    title: "What stage is the project at?",
    summary: "Stage",
    options: [
      { value: "searching", label: "Just bought the plot / still searching" },
      { value: "plot", label: "Plot ready, nothing designed yet" },
      { value: "redesign", label: "Drawings exist, need a redesign or second opinion" },
      { value: "construction", label: "Construction ongoing" },
      { value: "structure", label: "Structure complete, need interiors" },
      { value: "renovation", label: "Existing space to renovate" },
    ],
  },
  {
    id: "size",
    kind: "fields",
    title: "How big is the site or space?",
    summary: "Size",
    help: "Rough numbers are fine.",
    optional: true,
    fields: [
      { id: "plot", label: "Plot area", kind: "number", suffix: "sq ft" },
      { id: "builtup", label: "Built-up / carpet area", kind: "number", suffix: "sq ft" },
      { id: "floors", label: "Floors planned", kind: "number" },
      { id: "unknown", label: "I don't know yet", kind: "checkbox" },
    ],
  },
  {
    id: "users",
    kind: "fields",
    title: "Who will use the space?",
    summary: "Users",
    optional: true,
    fields: [
      { id: "family", label: "Family members", kind: "number", audience: "residential" },
      { id: "elderly", label: "Elderly", kind: "checkbox", audience: "residential" },
      { id: "children", label: "Children", kind: "checkbox", audience: "residential" },
      { id: "pets", label: "Pets", kind: "checkbox", audience: "residential" },
      { id: "people", label: "Staff, rooms or seats (approx.)", kind: "number", audience: "commercial" },
    ],
  },
  {
    id: "feel",
    kind: "multi",
    title: "How would you like the space to feel?",
    summary: "Feel",
    help: "Pick up to 3.",
    max: 3,
    options: [
      { value: "calm", label: "Calm & serene" },
      { value: "earthy", label: "Warm & earthy" },
      { value: "bold", label: "Bold & statement-making" },
      { value: "minimal", label: "Minimal & clean" },
      { value: "luxurious", label: "Luxurious & grand" },
      { value: "nature", label: "Close to nature" },
      { value: "practical", label: "Practical & low-maintenance" },
    ],
  },
  {
    id: "spaces",
    kind: "multi",
    title: "Which spaces matter most to you?",
    summary: "Key spaces",
    help: "Pick all that apply.",
    options: [
      { value: "living", label: "Living / drawing room", audience: "residential" },
      { value: "kitchen", label: "Kitchen & dining", audience: "residential" },
      { value: "master", label: "Master bedroom", audience: "residential" },
      { value: "kids", label: "Kids' room", audience: "residential" },
      { value: "pooja", label: "Pooja room", audience: "residential" },
      { value: "office", label: "Home office", audience: "residential" },
      { value: "guest", label: "Guest room", audience: "residential" },
      { value: "terrace", label: "Terrace / balcony", audience: "residential" },
      { value: "garden", label: "Garden / courtyard", audience: "residential" },
      { value: "pool", label: "Pool", audience: "residential" },
      { value: "parking", label: "Parking", audience: "residential" },
      { value: "reception", label: "Reception / lobby", audience: "commercial" },
      { value: "work", label: "Work areas", audience: "commercial" },
      { value: "cabins", label: "Cabins", audience: "commercial" },
      { value: "conference", label: "Conference room", audience: "commercial" },
      { value: "rooms", label: "Guest rooms", audience: "commercial" },
      { value: "restaurant", label: "Restaurant / café", audience: "commercial" },
      { value: "showroom", label: "Showroom floor", audience: "commercial" },
      { value: "storage", label: "Storage / back-of-house", audience: "commercial" },
    ],
  },
  {
    id: "style",
    kind: "multi",
    title: "Which design style draws you?",
    summary: "Style",
    help: "Pick up to 2.",
    max: 2,
    options: [
      { value: "contemporary", label: "Contemporary modern", image: "/images/projects/maru-mansion/01.webp" },
      {
        value: "classical",
        label: "Contemporary-classical",
        image: "/images/projects/residential-bungalow-betma/01.webp",
      },
      { value: "minimal", label: "Minimal", image: "/images/projects/kalantri-mansion/01.webp" },
      { value: "bohemian", label: "Bohemian / earthy", image: "/images/projects/anandam-farmhouse/01.webp" },
      { value: "traditional", label: "Indian traditional", image: "/images/projects/jain-palace-khachrod/01.webp" },
      { value: "resort", label: "Tropical / resort", image: "/images/projects/anandam-farmhouse/02.webp" },
      { value: "unsure", label: "Not sure, show me options" },
    ],
  },
  {
    id: "vastu",
    kind: "single",
    title: "How important is Vastu?",
    summary: "Vastu",
    options: [
      { value: "strict", label: "Must follow strictly" },
      { value: "practical", label: "Follow where practical" },
      { value: "no", label: "Not important" },
    ],
  },
  {
    id: "features",
    kind: "multi",
    title: "Anything specific you want to include?",
    summary: "Must-haves",
    optional: true,
    options: [
      { value: "light", label: "Natural light & ventilation" },
      { value: "double", label: "Double-height space" },
      { value: "courtyard", label: "Courtyard" },
      { value: "water", label: "Water feature" },
      { value: "smart", label: "Smart-home automation" },
      { value: "solar", label: "Solar / sustainable features" },
      { value: "lift", label: "Lift" },
      { value: "theatre", label: "Home theatre", audience: "residential" },
      { value: "gym", label: "Gym" },
      { value: "storage", label: "Lots of storage" },
      { value: "other", label: "Something else", withText: "Tell us what" },
    ],
  },
  {
    // TODO(client): confirm budget bands.
    id: "budget",
    kind: "single",
    title: "What is your approximate budget for this scope?",
    summary: "Budget",
    options: [
      { value: "lt25", label: "Under ₹25 lakh" },
      { value: "25-50", label: "₹25–50 lakh" },
      { value: "50-1cr", label: "₹50 lakh – 1 crore" },
      { value: "1-2cr", label: "₹1–2 crore" },
      { value: "gt2cr", label: "Above ₹2 crore" },
      { value: "unsure", label: "Not decided, need guidance" },
    ],
  },
  {
    id: "timeline",
    kind: "single",
    title: "When would you like to start?",
    summary: "Start",
    options: [
      { value: "now", label: "Immediately" },
      { value: "1-3m", label: "Within 1–3 months" },
      { value: "3-6m", label: "In 3–6 months" },
      { value: "later", label: "Later / just exploring" },
    ],
  },
  {
    id: "references",
    kind: "text",
    title: "Do you have reference images or ideas?",
    summary: "References",
    help: "Paste a Pinterest, Instagram or Drive link. You can also send photos in the WhatsApp chat afterwards.",
    placeholder: "https://",
    optional: true,
  },
  {
    id: "notes",
    kind: "text",
    title: "Anything else we should know?",
    summary: "Notes",
    help: "Existing problems, family needs, deadlines, things to avoid.",
    placeholder: "Write anything you like",
    optional: true,
  },
];

export const contactOptions = {
  via: ["WhatsApp call", "Phone call", "Visit the studio"],
  time: ["Morning", "Afternoon", "Evening"],
};
