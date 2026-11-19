// Footer 2: a choreographed 3D architectural exhibition (three.js, no React inside the render loop).
//
// Three procedurally modelled residences travel left -> right on ONE shared path at ONE constant speed. Their
// positions are derived from a single loop offset, so spacing is fixed forever: they can never overlap, catch up or
// bunch together. The loop is always longer than the visible stage, so a building is only ever wrapped from the right
// edge back to the left edge while it is fully off screen -- there are no visible resets.
// The path bows gently towards the camera at centre stage and each model turns slightly to face the viewer as it
// passes, which gives the "walking past a gallery of models" depth without any speed change.
import {
  CanvasTexture,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  type Material,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createMaterials } from "./materials";
import { arcadeResidence, cantileverVilla, linearResidences, type Model } from "./models";

export type Showcase = {
  /** Start/stop rendering (call with false when the section is off screen). */
  setActive(active: boolean): void;
  /** Reduced motion renders a single still frame instead of animating. */
  setReducedMotion(reduced: boolean): void;
  dispose(): void;
};

type Options = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  reducedMotion: boolean;
  /** Called when the building closest to centre stage changes. */
  onCaption?: (name: string) => void;
};

// ----- choreography constants -----
const SPEED = 1.35; // metres per second, constant
const BASE_GAP = 9; // minimum clear distance between consecutive podiums (metres)
const ARC_DEPTH = 7; // how far the path recedes at the stage edges
const ARC_RADIUS = 26; // half-width over which the path curves
const TURN = 0.22; // how much a model turns towards the viewer at the edges (radians)
const CAM_FOV = 30;
const EYE_Y = 3.2; // level, eye-height camera: verticals stay vertical, as in architectural photography
const LENS_SHIFT = 0.2; // vertical shift-lens offset (fraction of the frame) that lowers the horizon

function backdrop() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#1c1b1a");
  grad.addColorStop(0.42, "#2c2722");
  grad.addColorStop(0.6, "#3a3029");
  grad.addColorStop(0.62, "#211e1b");
  grad.addColorStop(1, "#161513");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 512);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function contactShadow() {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, s * 0.2, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.55)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return new CanvasTexture(c);
}

export async function createShowcase(opts: Options): Promise<Showcase> {
  const { canvas, container } = opts;
  const small = container.clientWidth < 700;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const bg = backdrop();
  scene.background = bg;

  // Neutral studio reflections for glass and bronze.
  const pmrem = new PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envTarget = pmrem.fromScene(envScene, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.32; // mostly for reflections; materials boost their own envMapIntensity
  envScene.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  pmrem.dispose();

  // ----- golden-hour lighting: warm low key, cool sky fill, soft rim -----
  scene.add(new HemisphereLight(0xb9c4d0, 0x2a241f, 0.45));
  const key = new DirectionalLight(0xffd6a8, 3.1);
  key.position.set(-34, 21, 14); // raking light from the left reveals depth and casts real shadows
  key.castShadow = true;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.04;
  key.shadow.radius = 4;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -30, right: 30, top: 24, bottom: -12, near: 1, far: 110 });
  key.shadow.camera.updateProjectionMatrix();
  key.target.position.set(0, 0, -2);
  scene.add(key, key.target);
  const rim = new DirectionalLight(0xa9c2ff, 0.6);
  rim.position.set(20, 14, -28);
  scene.add(rim);

  const pal = createMaterials(small);

  // ----- stage floor: dark honed stone, world-scale UVs -----
  const floorGeo = new PlaneGeometry(600, 420); // reaches past the camera at every framing
  const uv = floorGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 600, uv.getY(i) * 420);
  const floor = new Mesh(floorGeo, pal.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // ----- the three models, each on its own carrier with a soft contact shadow -----
  const shadowTex = contactShadow();
  const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const shadowGeo = new PlaneGeometry(1, 1);
  const models: Model[] = [cantileverVilla(pal), arcadeResidence(pal), linearResidences(pal)];
  const carriers = models.map((m) => {
    const carrier = new Group();
    carrier.add(m.group);
    const blob = new Mesh(shadowGeo, shadowMat);
    blob.rotation.x = -Math.PI / 2;
    blob.scale.set(m.width * 1.5, m.depth * 1.7, 1);
    blob.position.y = 0.01;
    blob.renderOrder = -1;
    carrier.add(blob);
    scene.add(carrier);
    return carrier;
  });

  const camera = new PerspectiveCamera(CAM_FOV, 1, 0.5, 260);
  let camZ = 44;

  // ----- path & loop -----
  const pathZ = (x: number) => {
    const t = Math.min(1, Math.abs(x) / ARC_RADIUS);
    return 2 - ARC_DEPTH * t * t;
  };
  const halfVisibleAt = (z: number) => Math.tan((CAM_FOV * Math.PI) / 360) * (camZ - z) * camera.aspect;
  // A model's footprint on the x axis when turned.
  const footprint = models.map((m) => m.width * Math.cos(TURN) + m.depth * Math.sin(TURN));
  const maxFoot = Math.max(...footprint);
  let loop = 0;
  let offsets: number[] = [];

  function layout() {
    // Fixed slots: centre-to-centre spacing = half of each neighbour + a constant clear gap.
    const sum = footprint.reduce((a, b) => a + b, 0);
    let gap = BASE_GAP;
    loop = sum + 3 * gap;
    // The wrap point (±loop/2) must sit beyond the visible edge plus a full model, so wrapping is never seen.
    for (let i = 0; i < 4; i++) {
      const need = 2 * (halfVisibleAt(pathZ(loop / 2)) + maxFoot / 2 + 2);
      if (loop >= need) break;
      loop = need;
      gap = (loop - sum) / 3;
    }
    offsets = [];
    let acc = 0;
    footprint.forEach((f) => {
      offsets.push(acc + f / 2);
      acc += f + gap;
    });
  }

  const wrap = (v: number) => ((v % loop) + loop) % loop;

  // ----- resize / framing -----
  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Frame so the centre-stage model fills ~60% of the height on landscape screens, and still fits the width
    // (with margin) on portrait phones.
    const tanHalf = Math.tan((CAM_FOV * Math.PI) / 360);
    const forHeight = 14.5 / (2 * tanHalf * 0.44);
    const forWidth = (maxFoot * (camera.aspect < 1 ? 1.06 : 1.25)) / (2 * tanHalf * camera.aspect);
    camZ = 2 + Math.max(forHeight, forWidth);
    camera.setViewOffset(w, h, 0, -LENS_SHIFT * h, w, h);
    camera.near = 1;
    camera.far = camZ + 200;
    camera.updateProjectionMatrix();
    scene.fog = new Fog(0x1b1916, camZ + 14, camZ + 110);
    layout();
  }

  // ----- animation -----
  let s = 0;
  let t = 0;
  let caption = "";
  let raf = false;
  let running = false;
  let reduced = opts.reducedMotion;
  let last = 0;

  function place() {
    let best = -1;
    let bestDist = Infinity;
    carriers.forEach((c, i) => {
      const x = wrap(offsets[i] + s) - loop / 2;
      c.position.set(x, 0, pathZ(x));
      // Turn towards the viewer progressively towards the edges (eased, no sudden change).
      const n = Math.max(-1, Math.min(1, x / ARC_RADIUS));
      c.rotation.y = -TURN * n * (2 - Math.abs(n));
      if (Math.abs(x) < bestDist) {
        bestDist = Math.abs(x);
        best = i;
      }
    });
    const sway = Math.sin(t * 0.05) * 0.8;
    camera.position.set(sway, EYE_Y, camZ);
    camera.lookAt(sway * 0.5, EYE_Y, 0);
    if (opts.onCaption && best >= 0 && bestDist < footprint[best] && models[best].name !== caption) {
      caption = models[best].name;
      opts.onCaption(caption);
    }
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60);
    last = now;
    s += SPEED * dt;
    t += dt;
    place();
    renderer.render(scene, camera);
  }

  function renderStill() {
    place();
    renderer.render(scene, camera);
  }

  function start() {
    if (raf || reduced) return;
    raf = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    raf = false;
    renderer.setAnimationLoop(null);
  }

  resize();
  // Start mid-flow with the villa just left of centre, so the first frame is already a composed shot.
  s = loop / 2 - offsets[0] - 3;
  renderStill(); // also compiles shaders before the section scrolls into view

  const ro = new ResizeObserver(() => {
    resize();
    if (!raf) renderStill();
  });
  ro.observe(container);

  return {
    setActive(active) {
      running = active;
      if (active && !reduced) start();
      else stop();
    },
    setReducedMotion(r) {
      reduced = r;
      if (r) {
        stop();
        renderStill();
      } else if (running) start();
    },
    dispose() {
      stop();
      ro.disconnect();
      models.forEach((m) => m.dispose());
      pal.dispose();
      floorGeo.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      bg.dispose();
      envTarget.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
