// Procedural PBR materials for the Footer 2 architecture. Every texture is drawn once on a small canvas and mapped
// with world-scale UVs (1 UV unit = 1 metre), so finishes keep a believable scale on every surface.
import {
  CanvasTexture,
  Color,
  type Material,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

// Deterministic noise so every visit looks identical.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Draw = (g: CanvasRenderingContext2D, size: number, r: () => number) => void;

function canvasTexture(size: number, seed: number, draw: Draw, metres: number, srgb = true) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  draw(g, size, rng(seed));
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(1 / metres, 1 / metres);
  t.anisotropy = 4;
  return t;
}

function grain(
  g: CanvasRenderingContext2D,
  size: number,
  r: () => number,
  count: number,
  color: string,
  alpha: number,
) {
  g.fillStyle = color;
  for (let i = 0; i < count; i++) {
    g.globalAlpha = r() * alpha;
    const s = 1 + r() * 2.5;
    g.fillRect(r() * size, r() * size, s, s);
  }
  g.globalAlpha = 1;
}

function blotches(
  g: CanvasRenderingContext2D,
  size: number,
  r: () => number,
  count: number,
  color: string,
  alpha: number,
) {
  for (let i = 0; i < count; i++) {
    const x = r() * size;
    const y = r() * size;
    const rad = size * (0.05 + r() * 0.18);
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.globalAlpha = r() * alpha;
    g.fillStyle = grad;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.globalAlpha = 1;
}

const drawPlaster: Draw = (g, s, r) => {
  g.fillStyle = "#ece6dc";
  g.fillRect(0, 0, s, s);
  blotches(g, s, r, 18, "rgba(150,135,115,1)", 0.06);
  grain(g, s, r, s * 6, "#8d8478", 0.08);
};

const drawConcrete: Draw = (g, s, r) => {
  g.fillStyle = "#b9b4ab";
  g.fillRect(0, 0, s, s);
  blotches(g, s, r, 26, "rgba(90,85,78,1)", 0.12);
  blotches(g, s, r, 14, "rgba(230,226,218,1)", 0.12);
  grain(g, s, r, s * 10, "#5d5952", 0.12);
  // board-formed panel joints and tie holes, 3 m tile -> 1.5 m panels
  g.strokeStyle = "rgba(60,56,50,0.35)";
  g.lineWidth = 1.5;
  for (const p of [0, s / 2]) {
    g.beginPath();
    g.moveTo(0, p + 0.5);
    g.lineTo(s, p + 0.5);
    g.moveTo(p + 0.5, 0);
    g.lineTo(p + 0.5, s);
    g.stroke();
  }
  g.fillStyle = "rgba(50,46,42,0.45)";
  for (const x of [s / 8, (3 * s) / 8, (5 * s) / 8, (7 * s) / 8])
    for (const y of [s / 4, (3 * s) / 4]) {
      g.beginPath();
      g.arc(x, y, s / 160 + 1, 0, Math.PI * 2);
      g.fill();
    }
};

const drawTravertine: Draw = (g, s, r) => {
  g.fillStyle = "#d6c8b1";
  g.fillRect(0, 0, s, s);
  // horizontal travertine veins
  for (let i = 0; i < 70; i++) {
    const y = r() * s;
    g.strokeStyle = r() > 0.5 ? "rgba(160,138,104,0.35)" : "rgba(240,232,216,0.5)";
    g.lineWidth = 0.6 + r() * 2;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= s; x += s / 16) g.lineTo(x, y + (r() - 0.5) * 3);
    g.stroke();
  }
  grain(g, s, r, s * 4, "#8a7656", 0.15);
  // 1.2 x 0.6 m slabs on a 2.4 m tile, stack bond
  g.strokeStyle = "rgba(120,104,80,0.55)";
  g.lineWidth = 1.2;
  for (let row = 0; row < 4; row++) {
    const y = (row * s) / 4;
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(s, y + 0.5);
    g.stroke();
    for (const x of row % 2 ? [s / 4, (3 * s) / 4] : [0, s / 2]) {
      g.beginPath();
      g.moveTo(x + 0.5, y);
      g.lineTo(x + 0.5, y + s / 4);
      g.stroke();
    }
  }
};

const drawBasalt: Draw = (g, s, r) => {
  g.fillStyle = "#3b3936";
  g.fillRect(0, 0, s, s);
  blotches(g, s, r, 20, "rgba(20,19,18,1)", 0.25);
  grain(g, s, r, s * 8, "#77736c", 0.12);
  g.strokeStyle = "rgba(15,14,13,0.8)";
  g.lineWidth = 1.5;
  for (const p of [0, s / 2]) {
    g.beginPath();
    g.moveTo(0, p + 0.5);
    g.lineTo(s, p + 0.5);
    g.moveTo(p + 0.5, 0);
    g.lineTo(p + 0.5, s);
    g.stroke();
  }
};

const drawWood: Draw = (g, s, r) => {
  // vertical boards, 2 m tile, 14 cm boards
  const boards = 14;
  const bw = s / boards;
  for (let b = 0; b < boards; b++) {
    const tone = 0.85 + r() * 0.3;
    g.fillStyle = `rgb(${Math.round(136 * tone)},${Math.round(88 * tone)},${Math.round(54 * tone)})`;
    g.fillRect(b * bw, 0, bw, s);
    for (let i = 0; i < 9; i++) {
      g.strokeStyle = `rgba(60,34,18,${0.15 + r() * 0.25})`;
      g.lineWidth = 0.5 + r();
      const x0 = b * bw + r() * bw;
      g.beginPath();
      g.moveTo(x0, 0);
      for (let y = 0; y <= s; y += s / 12) g.lineTo(x0 + Math.sin(y * 0.03 + i) * 1.5, y);
      g.stroke();
    }
    g.fillStyle = "rgba(25,14,8,0.55)";
    g.fillRect(b * bw, 0, 1.2, s);
  }
};

// Softly lit interiors seen through the glazing. One texture spans ~7 m of facade (three rooms of different warmth
// and depth) so neighbouring panes never show the same picture. Detail is deliberately low-contrast: through
// reflective glass an interior reads as light and depth, not as furniture.
const drawInterior: Draw = (g, s, r) => {
  const rooms = [
    { x: 0, w: 0.38, top: "#f2dcb8", mid: "#c99a68", low: "#4a3322" },
    { x: 0.38, w: 0.27, top: "#e9e0d0", mid: "#a8957c", low: "#3a3129" },
    { x: 0.65, w: 0.35, top: "#f6d2a0", mid: "#bf8752", low: "#432c1c" },
  ];
  for (const room of rooms) {
    const x = room.x * s;
    const w = room.w * s;
    const wall = g.createLinearGradient(0, 0, 0, s);
    wall.addColorStop(0, room.top);
    wall.addColorStop(0.45, room.mid);
    wall.addColorStop(1, room.low);
    g.fillStyle = wall;
    g.fillRect(x, 0, w, s);
    // recessed ceiling light pools
    for (let i = 0; i < 2; i++) {
      const lx = x + w * (0.3 + i * 0.4);
      const glow = g.createRadialGradient(lx, s * 0.05, 0, lx, s * 0.05, s * 0.32);
      glow.addColorStop(0, "rgba(255,244,222,0.75)");
      glow.addColorStop(1, "rgba(255,230,190,0)");
      g.fillStyle = glow;
      g.fillRect(lx - s * 0.32, 0, s * 0.64, s * 0.45);
    }
    // back wall depth: a darker band where the room recedes
    g.fillStyle = "rgba(30,20,12,0.18)";
    g.fillRect(x + w * 0.1, s * 0.62, w * 0.8, s * 0.38);
    // soft furniture masses
    g.fillStyle = "rgba(35,24,16,0.35)";
    g.fillRect(x + w * (0.1 + r() * 0.2), s * 0.74, w * 0.45, s * 0.1);
    // room divider
    g.fillStyle = "rgba(25,18,12,0.5)";
    g.fillRect(x, 0, 2, s);
  }
  // sheer curtain on one side only
  const c = g.createLinearGradient(s * 0.9, 0, s, 0);
  c.addColorStop(0, "rgba(255,246,230,0.1)");
  c.addColorStop(1, "rgba(255,246,230,0.45)");
  g.fillStyle = c;
  g.fillRect(s * 0.9, 0, s * 0.1, s);
};

const drawFloor: Draw = (g, s, r) => {
  g.fillStyle = "#24211d";
  g.fillRect(0, 0, s, s);
  blotches(g, s, r, 16, "rgba(10,9,8,1)", 0.3);
  grain(g, s, r, s * 6, "#55504a", 0.1);
  g.strokeStyle = "rgba(8,8,7,0.7)";
  g.lineWidth = 1;
  g.strokeRect(0.5, 0.5, s - 1, s - 1);
};

export type Palette = ReturnType<typeof createMaterials>;

export function createMaterials(small: boolean) {
  const size = small ? 256 : 512;
  const tex = {
    plaster: canvasTexture(size, 11, drawPlaster, 4),
    concrete: canvasTexture(size, 23, drawConcrete, 3),
    travertine: canvasTexture(size, 37, drawTravertine, 2.4),
    basalt: canvasTexture(size, 41, drawBasalt, 1.2),
    wood: canvasTexture(size, 53, drawWood, 2),
    interior: canvasTexture(size, 67, drawInterior, 7.3),
    floor: canvasTexture(size, 79, drawFloor, 4),
  };

  tex.interior.repeat.set(1 / 7.3, 1 / 3.4);

  const m = {
    plaster: new MeshStandardMaterial({
      map: tex.plaster,
      bumpMap: tex.plaster,
      bumpScale: 0.6,
      roughness: 0.9,
      color: 0xdcd5ca,
    }),
    concrete: new MeshStandardMaterial({ map: tex.concrete, bumpMap: tex.concrete, bumpScale: 1.2, roughness: 0.88 }),
    travertine: new MeshStandardMaterial({
      map: tex.travertine,
      bumpMap: tex.travertine,
      bumpScale: 0.8,
      roughness: 0.62,
    }),
    basalt: new MeshStandardMaterial({ map: tex.basalt, bumpMap: tex.basalt, bumpScale: 0.6, roughness: 0.55 }),
    wood: new MeshStandardMaterial({ map: tex.wood, bumpMap: tex.wood, bumpScale: 1, roughness: 0.58 }),
    // Anodised bronze for frames, mullions, fascias and railings.
    bronze: new MeshStandardMaterial({ color: 0x3b2f25, roughness: 0.32, metalness: 0.85, envMapIntensity: 2.2 }),
    // Lit glazing: reflective dark glass with a warm interior behind it.
    glassLit: new MeshStandardMaterial({
      color: 0x0b1014,
      roughness: 0.03,
      metalness: 0.9,
      envMapIntensity: 3.2,
      emissive: new Color(0xffffff),
      emissiveMap: tex.interior,
      emissiveIntensity: 0.34,
    }),
    // Unlit glazing: deep, mirror-like reflections.
    glassDark: new MeshStandardMaterial({ color: 0x5d7180, roughness: 0.14, metalness: 1, envMapIntensity: 2.6 }),
    // Frameless glass balustrades.
    glassRail: new MeshPhysicalMaterial({
      color: 0xc9dbe0,
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.1,
      envMapIntensity: 3.5,
      depthWrite: false,
    }),
    led: new MeshBasicMaterial({ color: 0xffd7a0 }),
    floor: new MeshStandardMaterial({ map: tex.floor, roughness: 0.6, metalness: 0.05, envMapIntensity: 0.4 }),
  };

  return {
    ...m,
    dispose() {
      Object.values(m).forEach((mat: Material) => mat.dispose());
      Object.values(tex).forEach((t: Texture) => t.dispose());
    },
  };
}
