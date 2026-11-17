// Studio copy, taken from the client's portfolio decks (see REQUIREMENTS.md §1, §3–5).

export type ServiceId = "residential" | "commercial" | "hospitality" | "urban-design" | "furniture" | "landscape";

// TODO(client): approve the one-line descriptions (decks give titles only).
export const services: { id: ServiceId; title: string; blurb: string }[] = [
  {
    id: "residential",
    title: "Residential",
    blurb: "Bungalows, mansions and family homes, from plot planning to interiors.",
  },
  {
    id: "commercial",
    title: "Commercial",
    blurb: "Offices, headquarters, showrooms and industrial buildings that work hard.",
  },
  {
    id: "hospitality",
    title: "Hospitality",
    blurb: "Hotels and guest spaces designed for comfort and smooth movement.",
  },
  {
    id: "urban-design",
    title: "Urban design",
    blurb: "Master plans and plotted developments with landscape at their core.",
  },
  { id: "furniture", title: "Furniture", blurb: "Custom pieces detailed for the space they live in." },
  { id: "landscape", title: "Landscape", blurb: "Gardens, courtyards and outdoor rooms that connect inside and out." },
];

export const pillars = [
  { title: "Consult", body: "We start with the site, your requirements, the context and what the space could become." },
  {
    title: "Design",
    body: "Concepts, massing, elevations, interiors and materials, refined with you until they are right.",
  },
  {
    title: "Execute",
    body: "Construction drawings and on-site supervision to deliver the approved design with quality.",
  },
];

export const process = [
  {
    step: "01",
    title: "Understanding the requirements",
    body: "Your project requirements, expectations, vision and preferences.",
  },
  {
    step: "02",
    title: "Conceptual designs & massing",
    body: "After the first discussion we develop concepts and an initial planning draft.",
  },
  {
    step: "03",
    title: "Finalizing the design",
    body: "Concepts are refined through iterations, incorporating your feedback.",
  },
  {
    step: "04",
    title: "Visualizing the design",
    body: "3D renders let you see the design and adjust it before we move ahead.",
  },
  { step: "05", title: "Documentation", body: "Good-for-construction drawings and full documentation." },
  {
    step: "06",
    title: "Execution",
    body: "We execute the approved design with periodic inspections for quality and workflow.",
  },
];

export const philosophy = {
  title: "The three dots of life",
  body: "Mind, body and spirit, each continually informing the others. We see architecture as a tangible impulse for that interaction: spaces that meet functional needs and also resonate on an emotional level, promoting well-being and harmony in everyday life.",
};

export const about =
  "DOT THREE Design Studio is a multidisciplinary studio creating thoughtful, functional and visually distinctive spaces. Good design is not only how a space looks, but how it works, feels and responds to the people in it. Every project begins with the site, the client’s requirements, the surrounding context and the possibilities of the space, then moves through planning, material selection, elevation development, interiors and detailed execution.";

export const vision = {
  title: "Crafting inspiring spaces",
  body: "We design captivating spaces that blend aesthetic elegance with functional brilliance. Our attention to detail lets us create innovative, enduring environments that enhance well-being and inspire.",
  secondaryTitle: "Architecture as art",
  secondaryBody:
    "Each project is a canvas, transforming a client’s vision into reality. We don’t just create spaces; we craft environments that inspire and enrich daily life.",
};

// TODO(client): confirm current members and roles; v1-only members left out.
export const team = [
  { name: "Ar. Manan Kishnani", role: "Architect" },
  { name: "Ar. Ayush Jain", role: "Architect" },
  { name: "ID Shivani Rathore", role: "Interior designer" },
  { name: "ID Tavleen Kaur Saini", role: "Interior designer" },
  { name: "ID Disha Jain", role: "Interior designer" },
];

// TODO(client): replace with real studio numbers (years active, projects completed, sq ft designed).
export const stats = [
  { value: 16, suffix: "+", label: "Projects designed" },
  { value: 5, suffix: "", label: "Cities across Madhya Pradesh" },
  { value: 20000, suffix: "", label: "Sq ft in our largest build" },
  { value: 6, suffix: "", label: "Design disciplines" },
];
