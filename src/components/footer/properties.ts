// One entry per property shown in the Footer 2 3D scene. Textures are produced by scripts/footer-textures.mjs
// (one tight exterior crop per property, so the same property can never appear twice in frame).
export type ShowcaseProperty = {
  id: string;
  name: string;
  /** width / height of the cropped facade texture. */
  aspect: number;
  /** Side-wall finish used on the 3D massing. */
  finish: "concrete" | "stone" | "timber" | "charcoal";
};

export const showcaseProperties: ShowcaseProperty[] = [
  { id: "anand-one", name: "Anand One", aspect: 0.433, finish: "timber" },
  { id: "arch-life", name: "Arch Life Hotel", aspect: 1.1, finish: "stone" },
  { id: "gupt-bhavan", name: "Gupt Bhavan", aspect: 1.162, finish: "stone" },
  { id: "kothari-sadan", name: "Kothari Sadan", aspect: 1.298, finish: "timber" },
  { id: "maru-mansion", name: "Maru Mansion", aspect: 1.257, finish: "concrete" },
  { id: "akshay-palace", name: "Akshay Palace Hotel", aspect: 0.617, finish: "charcoal" },
  { id: "anandam-farmhouse", name: "Anandam Farmhouse", aspect: 1.051, finish: "stone" },
  { id: "evara-mansion", name: "Evara Mansion", aspect: 2.424, finish: "charcoal" },
  { id: "jain-palace", name: "Jain Palace, Khachrod", aspect: 2.155, finish: "concrete" },
  { id: "kalantri-mansion", name: "Kalantri Mansion", aspect: 1.053, finish: "charcoal" },
  { id: "panchal-mansion", name: "Panchal Mansion", aspect: 1.763, finish: "timber" },
  { id: "betma-bungalow", name: "Residential Bungalow, Betma", aspect: 1.576, finish: "concrete" },
  { id: "ujjain-bungalow", name: "Residential Bungalow, Ujjain", aspect: 1.478, finish: "stone" },
  { id: "travell-inn", name: "Travell Inn, Ujjain", aspect: 0.791, finish: "concrete" },
];

export const showcaseTexture = (id: string) => `/images/footer-3d/${id}.webp`;
