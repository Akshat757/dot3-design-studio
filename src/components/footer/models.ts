// Three procedurally modelled residences for Footer 2, each with its own architectural identity:
//   1. Cantilever Villa    – board-formed concrete upper volume floating over a glazed pavilion and travertine wall
//   2. Arcade Residence    – white plaster facade cut with deep arched loggias, bronze balconies, rooftop pergola
//   3. Linear Residences   – four-storey apartment block, slab-edge balconies, glass balustrades, travertine spine
// Geometry uses world-scale UVs (metres) and is merged per material, so each building is a handful of draw calls.
import { BoxGeometry, type BufferGeometry, ExtrudeGeometry, Group, type Material, Mesh, Path, Shape } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Palette } from "./materials";

export type Model = { name: string; group: Group; width: number; depth: number; dispose(): void };

/** BoxGeometry whose UVs are in metres instead of 0..1 per face. */
function boxGeo(w: number, h: number, d: number) {
  const g = new BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const spans: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++)
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, uv.getX(i) * spans[f][0], uv.getY(i) * spans[f][1]);
    }
  return g;
}

class Kit {
  private parts = new Map<Material, BufferGeometry[]>();
  private noShadow = new Set<Material>();

  constructor(private readonly p: Palette) {
    this.noShadow.add(p.led);
    this.noShadow.add(p.glassRail);
  }

  /** Box with its base at y (not its centre), centred on x/z. */
  box(mat: Material, w: number, h: number, d: number, x: number, y: number, z: number) {
    const g = boxGeo(w, h, d);
    g.translate(x, y + h / 2, z);
    this.add(mat, g);
  }

  add(mat: Material, g: BufferGeometry) {
    const list = this.parts.get(mat) ?? [];
    list.push(g.index ? g.toNonIndexed() : g);
    if (g.index) g.dispose();
    this.parts.set(mat, list);
  }

  build(name: string, width: number, depth: number): Model {
    const group = new Group();
    const geos: BufferGeometry[] = [];
    for (const [mat, list] of this.parts) {
      const merged = mergeGeometries(list)!;
      list.forEach((g) => g.dispose());
      geos.push(merged);
      const mesh = new Mesh(merged, mat);
      const shadows = !this.noShadow.has(mat);
      mesh.castShadow = shadows;
      mesh.receiveShadow = shadows;
      if (mat === this.p.glassRail) mesh.renderOrder = 2;
      group.add(mesh);
    }
    this.parts.clear();
    return { name, group, width, depth, dispose: () => geos.forEach((g) => g.dispose()) };
  }
}

/** Run of glazing panes between bronze mullions, lit/unlit in a fixed rhythm. */
function glazing(
  k: Kit,
  p: Palette,
  x0: number,
  x1: number,
  y: number,
  h: number,
  z: number,
  pane: number,
  pattern: number[],
) {
  const count = Math.max(1, Math.round((x1 - x0) / pane));
  const pw = (x1 - x0) / count;
  for (let i = 0; i < count; i++) {
    const lit = pattern[i % pattern.length] === 1;
    k.box(lit ? p.glassLit : p.glassDark, pw, h, 0.06, x0 + pw * (i + 0.5), y, z);
  }
  for (let i = 0; i <= count; i++) k.box(p.bronze, 0.07, h, 0.14, x0 + pw * i, y, z + 0.04);
  k.box(p.bronze, x1 - x0 + 0.07, 0.08, 0.14, (x0 + x1) / 2, y + h - 0.08, z + 0.04);
  k.box(p.bronze, x1 - x0 + 0.07, 0.08, 0.14, (x0 + x1) / 2, y, z + 0.04);
}

function railing(k: Kit, p: Palette, x0: number, x1: number, y: number, z: number) {
  k.box(p.glassRail, x1 - x0, 1.0, 0.03, (x0 + x1) / 2, y, z);
  k.box(p.bronze, x1 - x0 + 0.04, 0.05, 0.07, (x0 + x1) / 2, y + 1.0, z);
}

// ---------------------------------------------------------------------------------------------------------------
// 1. Cantilever Villa (≈ 16 m wide, 10.6 m tall)
// ---------------------------------------------------------------------------------------------------------------
export function cantileverVilla(p: Palette): Model {
  const k = new Kit(p);
  const P = 0.6; // podium height

  // Basalt podium with three entry steps.
  k.box(p.basalt, 16.4, P, 10.6, 0, 0, 0);
  for (let i = 0; i < 3; i++) k.box(p.basalt, 4.2, P - 0.2 * (i + 1) + 0.2, 0.42, -4.6, 0, 5.3 + 0.42 * i + 0.21);

  // Ground floor (3.4 m): travertine wall with a pivot door, glazed living pavilion, timber deck under the cantilever.
  const G = 3.4;
  k.box(p.travertine, 4.6, G, 8.6, -5.6, P, -0.4);
  k.box(p.wood, 1.5, 2.7, 0.08, -4.6, P, 3.92);
  k.box(p.bronze, 0.05, 0.9, 0.06, -4.0, P + 0.9, 3.98);
  k.box(p.plaster, 7.6, G, 6.2, 0.9, P, -0.6);
  glazing(k, p, -3.3, 4.7, P, G, 2.62, 1.6, [1, 1, 0, 1, 1]);
  k.box(p.wood, 3.4, 0.08, 7.2, 6.4, P, 0.2);
  for (const z of [3.4, -2.9]) k.box(p.bronze, 0.18, G, 0.18, 7.55, P, z);

  // Upper floor (3.6 m): concrete tube cantilevering 3 m past the pavilion, ribbon glazing, timber louvre screen.
  const U = P + G;
  const UH = 3.6;
  const ux0 = -7.0;
  const ux1 = 7.8;
  const uz = -0.2;
  const ud = 8.6;
  const front = uz + ud / 2;
  k.box(p.concrete, ux1 - ux0, 0.4, ud, (ux0 + ux1) / 2, U, uz); // floor slab
  k.box(p.concrete, ux1 - ux0 + 0.6, 0.5, ud + 0.6, (ux0 + ux1) / 2, U + UH - 0.5, uz + 0.1); // roof slab
  k.box(p.concrete, 0.5, UH - 0.9, ud, ux0 + 0.25, U + 0.4, uz); // end walls
  k.box(p.concrete, 0.5, UH - 0.9, ud, ux1 - 0.25, U + 0.4, uz);
  k.box(p.plaster, ux1 - ux0 - 1, UH - 0.9, ud - 1.6, (ux0 + ux1) / 2, U + 0.4, uz - 0.8); // interior core
  glazing(k, p, ux0 + 0.5, ux1 - 0.5, U + 0.4, UH - 0.9, front - 0.75, 1.7, [1, 0, 1, 1, 0, 1, 1, 0]);
  for (let x = ux0 + 0.7; x < -0.8; x += 0.32) k.box(p.wood, 0.1, UH - 0.9, 0.34, x, U + 0.4, front - 0.25);
  k.box(p.led, ux1 - ux0 - 0.2, 0.03, 0.05, (ux0 + ux1) / 2, U - 0.03, front - 0.1); // soffit wash
  k.box(p.bronze, ux1 - ux0 + 0.62, 0.14, 0.06, (ux0 + ux1) / 2, U + UH - 0.45, front + 0.42); // fascia
  // Side glazing slots so the volume reads in perspective.
  for (const sx of [ux0 - 0.01, ux1 + 0.01])
    for (const z of [-2.6, 1.0]) k.box(p.glassDark, 0.04, UH - 1.5, 2.2, sx, U + 0.7, z);

  // Roof pavilion with its own floating slab and a glass balustrade.
  const R = U + UH;
  k.box(p.glassLit, 4.6, 2.5, 3.4, -3.2, R, -2.0);
  k.box(p.bronze, 4.66, 0.08, 3.46, -3.2, R + 2.42, -2.0);
  k.box(p.concrete, 5.8, 0.28, 4.6, -3.2, R + 2.5, -1.8);
  // Slim bronze roof-terrace rail (posts + top rail) along the front edge.
  k.box(p.bronze, 7.8, 0.05, 0.06, 3.7, R + 1.0, front + 0.2);
  for (let x = -0.2; x <= 7.61; x += 1.3) k.box(p.bronze, 0.05, 1.0, 0.05, x, R, front + 0.2);

  return k.build("Cantilever Villa", 16.4, 10.6);
}

// ---------------------------------------------------------------------------------------------------------------
// 2. Arcade Residence (≈ 13 m wide, 12.9 m tall)
// ---------------------------------------------------------------------------------------------------------------
export function arcadeResidence(p: Palette): Model {
  const k = new Kit(p);
  const P = 0.5;
  const W = 12;
  const D = 9;
  const FH = 3.3;
  const floors = 3;
  const H = FH * floors + 0.6; // incl. parapet
  const cols = [-3.9, 0, 3.9];
  const r = 1.3;
  const rect = 1.45;
  const wallT = 0.65;
  const fz = D / 2; // facade front plane

  k.box(p.travertine, W + 1.2, P, D + 1.2, 0, 0, 0);
  k.box(p.plaster, W, H, D - wallT, 0, P, -wallT / 2); // main volume behind the arcade wall

  // Front wall extruded with genuine arched openings.
  const shape = new Shape();
  shape.moveTo(-W / 2, 0);
  shape.lineTo(W / 2, 0);
  shape.lineTo(W / 2, H);
  shape.lineTo(-W / 2, H);
  shape.lineTo(-W / 2, 0);
  const openings: { cx: number; y0: number; floor: number }[] = [];
  for (let f = 0; f < floors; f++)
    for (const cx of cols) {
      const y0 = f * FH + 0.35;
      openings.push({ cx, y0, floor: f });
      const hole = new Path();
      hole.moveTo(cx - r, y0);
      hole.lineTo(cx + r, y0);
      hole.lineTo(cx + r, y0 + rect);
      hole.absarc(cx, y0 + rect, r, 0, Math.PI, false);
      hole.lineTo(cx - r, y0);
      shape.holes.push(hole);
    }
  const wall = new ExtrudeGeometry(shape, { depth: wallT, bevelEnabled: false, curveSegments: 20 });
  wall.translate(0, P, fz - wallT);
  k.add(p.plaster, wall);

  // Recessed glazing / doors inside each arch, with bronze frames.
  const lit = [1, 0, 1, 1, 1, 0, 0, 1, 1];
  openings.forEach(({ cx, y0, floor }, i) => {
    const y = P + y0;
    const z = fz - wallT + 0.08;
    const entrance = floor === 0 && cx === 0;
    k.box(entrance ? p.wood : lit[i] ? p.glassLit : p.glassDark, 2 * r, rect + r, 0.06, cx, y, z);
    k.box(p.bronze, 0.06, rect + r, 0.1, cx, y, z + 0.05);
    k.box(p.bronze, 2 * r, 0.06, 0.1, cx, y + rect, z + 0.05);
    if (entrance) for (const s of [-1, 1]) k.box(p.bronze, 0.04, 1.1, 0.08, cx + s * 0.18, y + 0.9, z + 0.08);
    // Balconies on the upper floors: slender plaster slab, bronze balusters, timber planter.
    if (floor > 0) {
      const bz = fz + 0.45;
      k.box(p.plaster, 2 * r + 0.5, 0.16, 0.9, cx, y - 0.16, fz + 0.45);
      k.box(p.bronze, 2 * r + 0.5, 0.05, 0.05, cx, y + 1.0, bz + 0.42);
      for (let x = cx - r - 0.2; x <= cx + r + 0.21; x += 0.16) k.box(p.bronze, 0.025, 1.0, 0.025, x, y, bz + 0.42);
      k.box(p.wood, 2 * r - 0.2, 0.32, 0.32, cx, y, fz + 0.18);
    }
  });

  // String courses at each floor and a crowning cornice.
  for (let f = 1; f < floors; f++) k.box(p.plaster, W + 0.3, 0.16, 0.2, 0, P + f * FH, fz + 0.1);
  k.box(p.plaster, W + 0.5, 0.28, D + 0.5, 0, P + H, -0.0);
  // Side elevations: tall windows with bronze reveals.
  for (const sx of [-W / 2 - 0.01, W / 2 + 0.01])
    for (let f = 0; f < floors; f++)
      for (const z of [-2.2, 1.2]) {
        k.box(f === 1 ? p.glassLit : p.glassDark, 0.04, 2.2, 1.3, sx, P + f * FH + 0.6, z);
        k.box(p.bronze, 0.06, 0.08, 1.4, sx, P + f * FH + 0.55, z);
      }
  // Rooftop bronze pergola over a timber deck.
  const R = P + H + 0.28;
  k.box(p.wood, 7.4, 0.08, 5, 1.6, R, -1.2);
  for (const x of [-2, 5.2]) for (const z of [-3.5, 1.1]) k.box(p.bronze, 0.12, 2.5, 0.12, x, R, z);
  for (const z of [-3.5, 1.1]) k.box(p.bronze, 7.4, 0.14, 0.12, 1.6, R + 2.5, z);
  for (let x = -1.9; x <= 5.15; x += 0.42) k.box(p.bronze, 0.06, 0.16, 4.8, x, R + 2.64, -1.2);

  return k.build("Arcade Residence", W + 1.2, D + 1.2);
}

// ---------------------------------------------------------------------------------------------------------------
// 3. Linear Residences (≈ 11 m wide, 14.4 m tall)
// ---------------------------------------------------------------------------------------------------------------
export function linearResidences(p: Palette): Model {
  const k = new Kit(p);
  const P = 0.5;
  const W = 10;
  const D = 10;
  const LH = 3.6; // double-height-feel lobby
  const FH = 3.1;
  const floors = 3;
  const top = P + LH + floors * FH;
  const gz = 3.8; // glass line
  const spineX = -W / 2 + 1.1;

  k.box(p.basalt, W + 1.2, P, D + 1.4, 0, 0, 0.1);
  // Travertine spine running the full height on the left.
  k.box(p.travertine, 2.2, top - P + 0.9, D, spineX, P, 0);
  // Interior volume behind the curtain wall.
  k.box(p.plaster, W - 2.4, top - P, D - 2.4, 1.2, P, -1.0);

  // Lobby: full-height glazing with an entrance canopy.
  glazing(k, p, -2.8, W / 2 - 0.2, P, LH, gz, 1.4, [1, 1, 1, 1, 1]);
  k.box(p.concrete, 3.6, 0.22, 2.2, 0.4, P + LH - 0.6, gz + 1.1);
  k.box(p.led, 3.4, 0.03, 0.05, 0.4, P + LH - 0.63, gz + 2.1);

  const pattern = [
    [1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0],
  ];
  for (let f = 0; f < floors; f++) {
    const y = P + LH + f * FH;
    // Slab edge projecting as a 1.3 m balcony, timber soffit, glass balustrade.
    k.box(p.concrete, W - 2.0, 0.3, D - 1.0 + 1.3, 1.0, y, 0.15 + 0.65 - 0.5);
    k.box(p.wood, W - 2.2, 0.04, 1.2, 1.0, y - 0.04, gz + 0.75);
    glazing(k, p, -2.8, W / 2 - 0.2, y + 0.3, FH - 0.3, gz, 1.5, pattern[f]);
    railing(k, p, -2.7, W / 2 - 0.1, y + 0.3, gz + 1.32);
  }
  // Roof slab, bronze fascia and a slatted timber canopy over the roof terrace.
  k.box(p.concrete, W + 0.4, 0.45, D + 0.6, 0.0, top, 0.2);
  k.box(p.bronze, W + 0.42, 0.12, 0.05, 0.0, top + 0.12, D / 2 + 0.52);
  for (const x of [-1.6, 4.2]) k.box(p.bronze, 0.12, 2.4, 0.12, x, top + 0.45, 2.6);
  k.box(p.bronze, 6.0, 0.12, 0.12, 1.3, top + 2.85, 2.6);
  for (let z = -3.4; z <= 2.7; z += 0.36) k.box(p.wood, 6.0, 0.08, 0.14, 1.3, top + 2.97, z);
  // Right elevation: vertical timber fins over the side glazing.
  k.box(p.glassDark, 0.04, top - P - LH, D - 2.6, W / 2 + 0.01, P + LH, -0.6);
  for (let z = -D / 2 + 0.9; z <= D / 2 - 1.2; z += 0.45)
    k.box(p.wood, 0.36, top - P - LH, 0.1, W / 2 + 0.2, P + LH, z);
  // Left elevation of the spine: narrow vertical slot windows.
  for (let f = 0; f < floors; f++) k.box(p.glassLit, 0.04, 2.2, 0.6, spineX - 1.11, P + LH + f * FH + 0.5, 1.2);

  return k.build("Linear Residences", W + 1.2, D + 1.4);
}
